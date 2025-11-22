/*
  # Initial Hotel Booking Platform Schema

  ## Overview
  Complete database schema for a luxury hotel booking platform with role-based access control.

  ## Tables Created
  
  ### 1. profiles
  - Extended user profile information
  - Links to Supabase auth.users
  - Stores: role, full_name, phone, avatar_url
  - Roles: client, owner, admin
  
  ### 2. hotels
  - Hotel information and details
  - Owner relationship
  - Location data with coordinates
  - Rating and status management
  - Image gallery support
  
  ### 3. rooms
  - Room details per hotel
  - Pricing and capacity
  - Amenities and features
  - Availability status
  - Multiple image support
  
  ### 4. bookings
  - Guest reservations
  - Date ranges and pricing
  - Status workflow tracking
  - Links users, rooms, and hotels
  
  ### 5. reviews
  - Guest feedback system
  - Rating and comments
  - Hotel-specific reviews
  
  ### 6. amenities
  - Master list of available amenities
  - Used for filtering and display
  
  ### 7. hotel_amenities
  - Junction table linking hotels to amenities
  
  ### 8. room_amenities
  - Junction table linking rooms to amenities

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies enforce role-based access:
    - Clients: own bookings and reviews
    - Owners: own hotels, rooms, and related bookings
    - Admins: full access
  - Public read access for hotels and rooms (browsing)
  - Authenticated write access with ownership checks
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('client', 'owner', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for booking status
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'completed', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'client' NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. HOTELS TABLE
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  address text NOT NULL,
  location_coordinates jsonb,
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  star_rating int DEFAULT 3 CHECK (star_rating >= 1 AND star_rating <= 5),
  main_image text NOT NULL,
  images text[] DEFAULT '{}',
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels are viewable by everyone"
  ON hotels FOR SELECT
  TO authenticated
  USING (is_active = true OR owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Hotel owners can insert own hotels"
  ON hotels FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid() AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Hotel owners can update own hotels"
  ON hotels FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete hotels"
  ON hotels FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price_per_night numeric(10,2) NOT NULL CHECK (price_per_night >= 0),
  max_guests int DEFAULT 2 NOT NULL CHECK (max_guests > 0),
  bed_type text,
  room_size numeric(6,2),
  images text[] DEFAULT '{}' NOT NULL,
  is_available boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are viewable by everyone"
  ON rooms FOR SELECT
  TO authenticated
  USING (
    is_available = true OR 
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Hotel owners can insert rooms for own hotels"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hotels 
      WHERE id = hotel_id AND owner_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Hotel owners can update own hotel rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  num_guests int NOT NULL CHECK (num_guests > 0),
  total_price numeric(10,2) NOT NULL CHECK (total_price >= 0),
  status booking_status DEFAULT 'pending' NOT NULL,
  special_requests text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and hotel owners can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, booking_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for own bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id AND user_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. AMENITIES TABLE
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  icon text,
  category text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Amenities are viewable by everyone"
  ON amenities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage amenities"
  ON amenities FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 7. HOTEL_AMENITIES TABLE
CREATE TABLE IF NOT EXISTS hotel_amenities (
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (hotel_id, amenity_id)
);

ALTER TABLE hotel_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotel amenities are viewable by everyone"
  ON hotel_amenities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hotel owners can manage own hotel amenities"
  ON hotel_amenities FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM hotels WHERE id = hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. ROOM_AMENITIES TABLE
CREATE TABLE IF NOT EXISTS room_amenities (
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, amenity_id)
);

ALTER TABLE room_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room amenities are viewable by everyone"
  ON room_amenities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hotel owners can manage room amenities"
  ON room_amenities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = room_id AND h.owner_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = room_id AND h.owner_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating);
CREATE INDEX IF NOT EXISTS idx_hotels_active ON hotels(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON rooms(price_per_night);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel ON bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel ON reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Insert default amenities
INSERT INTO amenities (name, icon, category) VALUES
  ('WiFi', 'wifi', 'connectivity'),
  ('Pool', 'waves', 'recreation'),
  ('Gym', 'dumbbell', 'fitness'),
  ('Spa', 'sparkles', 'wellness'),
  ('Restaurant', 'utensils', 'dining'),
  ('Bar', 'wine', 'dining'),
  ('Parking', 'car', 'services'),
  ('Room Service', 'bell', 'services'),
  ('Concierge', 'user-check', 'services'),
  ('Laundry', 'shirt', 'services'),
  ('Air Conditioning', 'air-vent', 'comfort'),
  ('TV', 'tv', 'entertainment'),
  ('Mini Bar', 'refrigerator', 'comfort'),
  ('Safe', 'lock', 'security'),
  ('Balcony', 'door-open', 'room-features'),
  ('Sea View', 'waves', 'room-features'),
  ('City View', 'building-2', 'room-features'),
  ('Breakfast Included', 'coffee', 'dining'),
  ('Pet Friendly', 'dog', 'policies'),
  ('Business Center', 'briefcase', 'business')
ON CONFLICT (name) DO NOTHING;
