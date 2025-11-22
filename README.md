# Hotex - Luxury Hotel Booking Platform

A comprehensive hotel booking platform built with React, Vite, and Supabase, featuring role-based access control, real-time booking management, and a premium Hotex-inspired design.

## Features

### For Guests (Clients)
- Browse and search hotels with advanced filtering
- View detailed hotel and room information
- Book rooms with date selection
- Manage personal bookings
- Leave reviews and ratings

### For Hotel Owners
- Create and manage hotel profiles
- Add and manage rooms
- View and manage incoming bookings
- Access analytics and performance metrics
- Update booking statuses

### For Administrators
- Full system oversight
- User management and role assignment
- Hotel and room approval/management
- Booking oversight and modifications
- System-wide analytics and reporting

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Context API

## Database Schema

The platform uses a comprehensive PostgreSQL database with the following tables:

- `profiles` - Extended user information with roles
- `hotels` - Hotel listings and details
- `rooms` - Room inventory per hotel
- `bookings` - Reservation management
- `reviews` - Guest feedback system
- `amenities` - Feature catalog
- `hotel_amenities` - Hotel-amenity relationships
- `room_amenities` - Room-amenity relationships

All tables include Row Level Security (RLS) policies for secure data access.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - The database schema is already applied if you used the migration tool
   - Copy your project URL and anon key

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── home/           # Homepage components
│   ├── hotels/         # Hotel-related components
│   ├── rooms/          # Room-related components
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (Auth)
├── lib/                # Utilities and Supabase client
├── pages/              # Page components
├── App.tsx             # Main app component
├── router.tsx          # Simple routing logic
└── main.tsx            # Entry point
```

## Design System

The platform follows a luxury hotel aesthetic inspired by Hotex:

### Colors
- **Gold**: `#b98d4f` - Primary accent, CTAs
- **Charcoal**: `#161412` - Dark backgrounds
- **Dark Grey**: `#1f1b1a` - Secondary dark
- **Beige**: `#f4efe9` - Light backgrounds
- **White**: `#ffffff` - Text on dark backgrounds
- **Muted Grey**: `#9b9692` - Secondary text

### Typography
- Headlines: Serif font (elegant, traditional)
- Body: Sans-serif (clean, modern)
- Generous spacing and line heights for readability

### Components
- Smooth transitions and hover effects
- Card-based layouts with shadows
- Responsive design (mobile-first)
- Accessibility-focused

## User Roles

### Client (Default)
- Sign up as a guest to book hotels
- Browse all active hotels and rooms
- Create and manage bookings
- Leave reviews after completed stays

### Owner
- Sign up as a hotel owner
- Create hotel profiles
- Add rooms to your hotels
- Manage incoming bookings
- View analytics for your properties

### Admin
- Manually assigned in database
- Full system access
- User and hotel management
- System-wide oversight

## Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure authentication via Supabase Auth
- Protected API endpoints
- Data validation and sanitization

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Database Setup

The database schema includes:

1. **User Management**: Profiles linked to Supabase Auth
2. **Hotel System**: Hotels with owners, ratings, and locations
3. **Room Inventory**: Rooms with pricing, capacity, and amenities
4. **Booking Engine**: Reservations with status tracking
5. **Review System**: Guest feedback with ratings
6. **Amenities**: Categorized features for hotels and rooms

All tables have appropriate indexes for performance and RLS policies for security.

## Future Enhancements

The platform is ready for:
- Payment gateway integration (Stripe)
- Email notifications
- Advanced search with maps
- Multi-language support
- Mobile app version
- Hotel analytics dashboard
- Revenue management tools
- Loyalty program

## Notes

- This is a fully functional booking platform
- Database migrations are managed through Supabase
- The design follows luxury hotel industry standards
- All components are built with accessibility in mind
- The codebase is production-ready

## Support

For issues or questions, refer to the Supabase documentation or React documentation.

---

Built with React + Vite + Supabase
