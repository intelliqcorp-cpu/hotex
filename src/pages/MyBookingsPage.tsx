import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Booking } from '../lib/supabase';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function MyBookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  async function loadBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms(title, images, price_per_night),
          hotels(name, city, country, main_image)
        `)
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'canceled' })
        .eq('id', bookingId);

      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  }

  function getFilteredBookings() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (filter === 'upcoming') {
      return bookings.filter((b) => new Date(b.check_in) >= today && b.status !== 'canceled');
    } else if (filter === 'past') {
      return bookings.filter((b) => new Date(b.check_out) < today || b.status === 'completed');
    }
    return bookings;
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      checked_in: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      canceled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">You need to sign in to view your bookings.</p>
            <a href="/signin">
              <Button variant="primary" size="lg">
                {t('signIn')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b98d4f]"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <Header />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-900 mb-4">{t('myBookings')}</h1>
            <p className="text-gray-600">Manage your hotel reservations</p>
          </div>

          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[#b98d4f] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-[#b98d4f] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'past'
                  ? 'bg-[#b98d4f] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Past
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">No bookings found</p>
              <p className="text-gray-500 mb-8">Start exploring our hotels and make your first booking!</p>
              <a href="/hotels">
                <Button variant="primary" size="lg">
                  Browse Hotels
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                    <div className="md:col-span-1">
                      <img
                        src={booking.hotels?.main_image || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'}
                        alt={booking.hotels?.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            {booking.hotels?.name}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin size={16} className="mr-1" />
                            <span className="text-sm">
                              {booking.hotels?.city}, {booking.hotels?.country}
                            </span>
                          </div>
                          <p className="text-gray-600">{booking.rooms?.title}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {t(booking.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={18} className="mr-2 text-[#b98d4f]" />
                          <div>
                            <p className="text-xs text-gray-500">Check-in</p>
                            <p className="text-sm font-medium">
                              {new Date(booking.check_in).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar size={18} className="mr-2 text-[#b98d4f]" />
                          <div>
                            <p className="text-xs text-gray-500">Check-out</p>
                            <p className="text-sm font-medium">
                              {new Date(booking.check_out).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Users size={18} className="mr-2 text-[#b98d4f]" />
                          <div>
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="text-sm font-medium">{booking.num_guests}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-600">Total Price</p>
                          <p className="text-2xl font-bold text-[#b98d4f]">${booking.total_price}</p>
                        </div>
                        <div className="flex gap-3">
                          <a href={`/hotels/${booking.hotel_id}`}>
                            <Button variant="outline" size="md">
                              {t('viewDetails')}
                            </Button>
                          </a>
                          {booking.status === 'pending' && (
                            <Button
                              variant="secondary"
                              size="md"
                              onClick={() => cancelBooking(booking.id)}
                            >
                              {t('cancel')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
