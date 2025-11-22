import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { HotelsPage } from './pages/HotelsPage';

export function Router() {
  const path = window.location.pathname;

  switch (path) {
    case '/':
      return <HomePage />;
    case '/signin':
      return <SignInPage />;
    case '/signup':
      return <SignUpPage />;
    case '/hotels':
      return <HotelsPage />;
    default:
      return <HomePage />;
  }
}
