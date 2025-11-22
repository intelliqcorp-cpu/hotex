import { useEffect, useState } from 'react';
import { supabase, Hotel } from '../../lib/supabase';
import { HotelCard } from '../hotels/HotelCard';

export function FeaturedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedHotels();
  }, []);

  async function loadFeaturedHotels() {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b98d4f]"></div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#f4efe9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Featured Hotels
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of the finest hotels offering exceptional comfort and service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/hotels"
            className="inline-block px-8 py-4 bg-[#b98d4f] text-white rounded-lg font-medium hover:bg-[#a67d40] transition-all duration-300 hover:scale-105"
          >
            View All Hotels
          </a>
        </div>
      </div>
    </section>
  );
}
