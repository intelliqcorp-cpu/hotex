import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Hotel, Room, Booking } from '../lib/supabase';
import { Plus, Edit, Trash2, DollarSign, CalendarCheck, Building } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function OwnerDashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeHotels: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hotels' | 'bookings' | 'analytics'>('hotels');

  useEffect(() => {
    if (user && profile?.role === 'owner') {
      loadData();
    }
  }, [user, profile]);

  async function loadData() {
    try {
      await Promise.all([loadHotels(), loadBookings()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('owner_id', user?.id || '')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setHotels(data || []);
    setAnalytics((prev) => ({ ...prev, activeHotels: data?.filter(h => h.is_active).length || 0 }));
  }

  async function loadBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles!bookings_user_id_fkey(full_name, email),
        rooms(title, price_per_night),
        hotels(name)
      `)
      .in('hotel_id', hotels.map(h => h.id))
      .order('created_at', { ascending: false });

    if (error) throw error;

    const bookingsData = data || [];
    setBookings(bookingsData);

    const totalRevenue = bookingsData
      .filter(b => b.status !== 'canceled')
      .reduce((sum, b) => sum + Number(b.total_price), 0);

    setAnalytics((prev) => ({
      ...prev,
      totalRevenue,
      totalBookings: bookingsData.length,
    }));
  }

  async function toggleHotelStatus(hotelId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ is_active: !currentStatus })
        .eq('id', hotelId);

      if (error) throw error;
      await loadHotels();
    } catch (error) {
      console.error('Error updating hotel status:', error);
    }
  }

  async function updateBookingStatus(bookingId: string, status: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  }

  if (!user || profile?.role !== 'owner') {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need to be a hotel owner to access this page.</p>
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

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <Header />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-900 mb-2">{t('dashboard')}</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('totalRevenue')}</p>
                  <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('totalBookings')}</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CalendarCheck className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('activeHotels')}</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.activeHotels}</p>
                </div>
                <div className="w-12 h-12 bg-[#b98d4f]/20 rounded-full flex items-center justify-center">
                  <Building className="text-[#b98d4f]" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'hotels'
                      ? 'text-[#b98d4f] border-b-2 border-[#b98d4f]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('myHotels')}
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'bookings'
                      ? 'text-[#b98d4f] border-b-2 border-[#b98d4f]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('bookingManagement')}
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'hotels' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('myHotels')}</h2>
                    <a href="/owner/hotels/new">
                      <Button variant="primary" size="md">
                        <Plus size={20} className="mr-2" />
                        {t('addHotel')}
                      </Button>
                    </a>
                  </div>

                  {hotels.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">You haven't added any hotels yet.</p>
                      <a href="/owner/hotels/new">
                        <Button variant="primary" size="md">
                          <Plus size={20} className="mr-2" />
                          Add Your First Hotel
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('hotelName')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('city')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('starRating')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {hotels.map((hotel) => (
                            <tr key={hotel.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <img
                                    src={hotel.main_image}
                                    alt={hotel.name}
                                    className="w-12 h-12 rounded-lg object-cover mr-3"
                                  />
                                  <span className="font-medium text-gray-900">{hotel.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{hotel.city}</td>
                              <td className="px-6 py-4 text-gray-600">{hotel.star_rating} Star</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => toggleHotelStatus(hotel.id, hotel.is_active)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    hotel.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {hotel.is_active ? t('available') : t('notAvailable')}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <a href={`/owner/hotels/${hotel.id}/edit`}>
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                      <Edit size={18} />
                                    </button>
                                  </a>
                                  <a href={`/owner/hotels/${hotel.id}/rooms`}>
                                    <Button variant="outline" size="sm">
                                      {t('manageRooms')}
                                    </Button>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('bookingManagement')}</h2>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No bookings yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('guestName')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('hotel')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('checkIn')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('checkOut')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('totalPrice')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {bookings.map((booking: any) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-gray-900">{booking.profiles?.full_name}</td>
                              <td className="px-6 py-4 text-gray-600">{booking.hotels?.name}</td>
                              <td className="px-6 py-4 text-gray-600">{new Date(booking.check_in).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-gray-600">{new Date(booking.check_out).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-gray-900 font-medium">${booking.total_price}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={booking.status}
                                  onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b98d4f]"
                                >
                                  <option value="pending">{t('pending')}</option>
                                  <option value="confirmed">{t('confirmed')}</option>
                                  <option value="checked_in">{t('checkedIn')}</option>
                                  <option value="completed">{t('completed')}</option>
                                  <option value="canceled">{t('canceled')}</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <a href={`/bookings/${booking.id}`}>
                                  <Button variant="outline" size="sm">
                                    {t('viewDetails')}
                                  </Button>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
