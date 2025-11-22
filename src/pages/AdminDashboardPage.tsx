import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Profile, Hotel, Booking } from '../lib/supabase';
import { Users, Building, CalendarCheck, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AdminDashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<Profile[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'hotels' | 'bookings' | 'analytics'>('analytics');

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadData();
    }
  }, [user, profile]);

  async function loadData() {
    try {
      await Promise.all([loadUsers(), loadHotels(), loadBookings()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setUsers(data || []);
    setAnalytics((prev) => ({ ...prev, totalUsers: data?.length || 0 }));
  }

  async function loadHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setHotels(data || []);
    setAnalytics((prev) => ({ ...prev, totalHotels: data?.length || 0 }));
  }

  async function loadBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles!bookings_user_id_fkey(full_name),
        rooms(title),
        hotels(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const bookingsData = data || [];
    setBookings(bookingsData);

    const totalRevenue = bookingsData
      .filter(b => b.status !== 'canceled')
      .reduce((sum, b) => sum + Number(b.total_price), 0);

    setAnalytics((prev) => ({
      ...prev,
      totalBookings: bookingsData.length,
      totalRevenue,
    }));
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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

  async function deleteHotel(hotelId: string) {
    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelId);

      if (error) throw error;
      await loadHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
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

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need to be an administrator to access this page.</p>
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
            <h1 className="text-4xl font-serif text-gray-900 mb-2">{t('admin')} {t('dashboard')}</h1>
            <p className="text-gray-600">System Overview and Management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('totalUsers')}</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('totalBookings')}</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CalendarCheck className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('activeHotels')}</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalHotels}</p>
                </div>
                <div className="w-12 h-12 bg-[#b98d4f]/20 rounded-full flex items-center justify-center">
                  <Building className="text-[#b98d4f]" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('totalRevenue')}</p>
                  <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-4 font-medium whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'text-[#b98d4f] border-b-2 border-[#b98d4f]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('analytics')}
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-4 font-medium whitespace-nowrap ${
                    activeTab === 'users'
                      ? 'text-[#b98d4f] border-b-2 border-[#b98d4f]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('userManagement')}
                </button>
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`px-6 py-4 font-medium whitespace-nowrap ${
                    activeTab === 'hotels'
                      ? 'text-[#b98d4f] border-b-2 border-[#b98d4f]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('hotelManagement')}
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-6 py-4 font-medium whitespace-nowrap ${
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
              {activeTab === 'analytics' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('analytics')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Clients</span>
                          <span className="font-semibold">{users.filter(u => u.role === 'client').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Owners</span>
                          <span className="font-semibold">{users.filter(u => u.role === 'owner').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Admins</span>
                          <span className="font-semibold">{users.filter(u => u.role === 'admin').length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('pending')}</span>
                          <span className="font-semibold">{bookings.filter(b => b.status === 'pending').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('confirmed')}</span>
                          <span className="font-semibold">{bookings.filter(b => b.status === 'confirmed').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('completed')}</span>
                          <span className="font-semibold">{bookings.filter(b => b.status === 'completed').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('userManagement')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('fullName')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('email')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('role')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('createdAt')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900">{user.full_name}</td>
                            <td className="px-6 py-4 text-gray-600">{user.id}</td>
                            <td className="px-6 py-4">
                              <select
                                value={user.role}
                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b98d4f]"
                              >
                                <option value="client">{t('client')}</option>
                                <option value="owner">{t('owner')}</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'hotels' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('hotelManagement')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('hotelName')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('owner')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('city')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {hotels.map((hotel: any) => (
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
                            <td className="px-6 py-4 text-gray-600">{hotel.profiles?.full_name}</td>
                            <td className="px-6 py-4 text-gray-600">{hotel.city}</td>
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
                                <a href={`/hotels/${hotel.id}`}>
                                  <Button variant="outline" size="sm">
                                    {t('viewDetails')}
                                  </Button>
                                </a>
                                <button
                                  onClick={() => deleteHotel(hotel.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('bookingManagement')}</h2>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
