import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { HotelsPage } from './pages/HotelsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BookingPage } from './pages/BookingPage';

export function Router() {
  const path = window.location.pathname;
  const pathParts = path.split('/').filter(Boolean);

  if (path === '/') return <HomePage />;
  if (path === '/signin') return <SignInPage />;
  if (path === '/signup') return <SignUpPage />;
  if (path === '/hotels') return <HotelsPage />;
  if (path === '/bookings') return <MyBookingsPage />;
  if (path === '/dashboard') return <OwnerDashboardPage />;
  if (path === '/admin') return <AdminDashboardPage />;

  if (pathParts[0] === 'book' && pathParts[1]) {
    return <BookingPage roomId={pathParts[1]} />;
  }

  return <HomePage />;
}
