import { useState } from 'react';
import { Menu, X, User, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#b98d4f] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v7.22c0 4.24-2.92 8.38-7 9.69V4.18z"/>
              </svg>
            </div>
            <span className="text-2xl font-serif text-white tracking-tight">Hotex</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white hover:text-[#b98d4f] transition-colors text-sm font-medium">
              {t('home')}
            </a>
            <a href="/hotels" className="text-white hover:text-[#b98d4f] transition-colors text-sm font-medium">
              {t('hotels')}
            </a>
            <a href="/rooms" className="text-white hover:text-[#b98d4f] transition-colors text-sm font-medium">
              {t('rooms')}
            </a>
            {user && (
              <a href="/bookings" className="text-white hover:text-[#b98d4f] transition-colors text-sm font-medium">
                {t('myBookings')}
              </a>
            )}
            {profile?.role === 'owner' && (
              <a href="/dashboard" className="text-white hover:text-[#b98d4f] transition-colors text-sm font-medium">
                {t('dashboard')}
              </a>
            )}
            {profile?.role === 'admin' && (
              <a href="/admin" className="text-white hover:text-[#b98d4f] transition-colors text-sm font-medium">
                {t('admin')}
              </a>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-2 text-white hover:text-[#b98d4f] transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-white">
                  <User size={20} />
                  <span className="text-sm">{profile?.full_name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-white text-white hover:bg-white hover:text-[#161412]"
                >
                  <LogOut size={16} className="mr-2" />
                  {t('signOut')}
                </Button>
              </div>
            ) : (
              <>
                <a href="/signin">
                  <Button variant="ghost" size="sm" className="text-white">
                    {t('signIn')}
                  </Button>
                </a>
                <a href="/signup">
                  <Button variant="primary" size="sm">
                    {t('signUp')}
                  </Button>
                </a>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f1b1a] border-t border-white/10">
          <nav className="flex flex-col gap-4 p-6">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 text-white hover:text-[#b98d4f] transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <a href="/" className="text-white hover:text-[#b98d4f] transition-colors">
              {t('home')}
            </a>
            <a href="/hotels" className="text-white hover:text-[#b98d4f] transition-colors">
              {t('hotels')}
            </a>
            <a href="/rooms" className="text-white hover:text-[#b98d4f] transition-colors">
              {t('rooms')}
            </a>
            {user && (
              <>
                <a href="/bookings" className="text-white hover:text-[#b98d4f] transition-colors">
                  {t('myBookings')}
                </a>
                {profile?.role === 'owner' && (
                  <a href="/dashboard" className="text-white hover:text-[#b98d4f] transition-colors">
                    {t('dashboard')}
                  </a>
                )}
                {profile?.role === 'admin' && (
                  <a href="/admin" className="text-white hover:text-[#b98d4f] transition-colors">
                    {t('admin')}
                  </a>
                )}
                <button
                  onClick={signOut}
                  className="text-left text-white hover:text-[#b98d4f] transition-colors"
                >
                  {t('signOut')}
                </button>
              </>
            )}
            {!user && (
              <>
                <a href="/signin" className="text-white hover:text-[#b98d4f] transition-colors">
                  {t('signIn')}
                </a>
                <a href="/signup">
                  <Button variant="primary" size="sm" className="w-full">
                    {t('signUp')}
                  </Button>
                </a>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
