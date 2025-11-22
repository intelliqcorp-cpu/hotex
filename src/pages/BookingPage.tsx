import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Room, Hotel } from '../lib/supabase';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface BookingPageProps {
  roomId?: string;
  hotelId?: string;
}

export function BookingPage({ roomId, hotelId }: BookingPageProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [room, setRoom] = useState<Room | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    numGuests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    if (roomId) {
      loadRoomAndHotel();
    }
  }, [roomId]);

  async function loadRoomAndHotel() {
    try {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .maybeSingle();

      if (roomError) throw roomError;
      if (!roomData) throw new Error('Room not found');

      setRoom(roomData);

      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', roomData.hotel_id)
        .maybeSingle();

      if (hotelError) throw hotelError;
      setHotel(hotelData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function calculateNights() {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function calculateTotalPrice() {
    if (!room) return 0;
    const nights = calculateNights();
    return nights * Number(room.price_per_night);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      window.location.href = '/signin';
      return;
    }

    if (!room || !hotel) {
      setError('Room or hotel information is missing');
      return;
    }

    if (bookingData.numGuests > room.max_guests) {
      setError(`Maximum ${room.max_guests} guests allowed for this room`);
      return;
    }

    const nights = calculateNights();
    if (nights < 1) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          room_id: room.id,
          hotel_id: hotel.id,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          num_guests: bookingData.numGuests,
          total_price: calculateTotalPrice(),
          special_requests: bookingData.specialRequests || null,
          status: 'pending',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/bookings';
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('bookingError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">You need to sign in to make a booking.</p>
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

  if (!room || !hotel) {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Room Not Found</h1>
            <p className="text-gray-600 mb-8">The room you're looking for doesn't exist.</p>
            <a href="/hotels">
              <Button variant="primary" size="lg">
                Browse Hotels
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f4efe9]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-4">{t('bookingSuccess')}</h1>
            <p className="text-gray-600 mb-8">Redirecting to your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <Header />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif text-gray-900 mb-8">{t('createBooking')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('bookingDetails')}</h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkIn')}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkOut')}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('guests')}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={bookingData.numGuests}
                        onChange={(e) => setBookingData({ ...bookingData, numGuests: parseInt(e.target.value) })}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f] focus:border-transparent"
                      >
                        {Array.from({ length: room.max_guests }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('specialRequests')} (Optional)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                      rows={4}
                      placeholder="Any special requests or requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f] focus:border-transparent"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? t('loading') : t('confirmBooking')}
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h3>

                <div className="space-y-4">
                  <div>
                    <img
                      src={room.images[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                      alt={room.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                    <p className="text-gray-600 text-sm">{room.title}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    {bookingData.checkIn && bookingData.checkOut && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">${room.price_per_night} x {calculateNights()} {t('nights')}</span>
                          <span className="text-gray-900 font-medium">${(Number(room.price_per_night) * calculateNights()).toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">{t('totalPrice')}</span>
                        <span className="text-lg font-bold text-[#b98d4f]">${calculateTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    <p>You won't be charged yet. Review your booking details before confirming.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
