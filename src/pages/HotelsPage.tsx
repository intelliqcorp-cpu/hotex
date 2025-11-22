import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { HotelCard } from '../components/hotels/HotelCard';
import { supabase, Hotel } from '../lib/supabase';
import { Search, SlidersHorizontal } from 'lucide-react';

export function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    starRating: 0,
    sortBy: 'rating',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadHotels();
  }, [filters]);

  async function loadHotels() {
    try {
      let query = supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true);

      if (filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }

      if (filters.starRating > 0) {
        query = query.eq('star_rating', filters.starRating);
      }

      if (filters.sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (filters.sortBy === 'name') {
        query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <Header />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 text-center">
            Discover Hotels
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by hotel name, city, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-[#161412] text-white rounded-lg hover:bg-[#2a2522] transition-colors"
              >
                <SlidersHorizontal size={20} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f]"
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Star Category
                  </label>
                  <select
                    value={filters.starRating}
                    onChange={(e) => setFilters({ ...filters, starRating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f]"
                  >
                    <option value="0">Any Category</option>
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b98d4f]"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b98d4f]"></div>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No hotels found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                Found {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
