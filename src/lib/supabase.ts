import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'client' | 'owner' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'canceled';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Hotel {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  location_coordinates?: { lat: number; lng: number };
  rating: number;
  star_rating: number;
  main_image: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  bed_type?: string;
  room_size?: number;
  images: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  hotel_id: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  total_price: number;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  hotel_id: string;
  booking_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  created_at: string;
}
