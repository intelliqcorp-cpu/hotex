import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleSearch = () => {
    const params = new URLSearchParams({
      city: searchData.city,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString(),
    });
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="relative h-screen min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            Luxury Awaits
            <br />
            Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed">
            Discover exceptional hotels and create unforgettable memories in the world's most beautiful destinations.
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="City"
                  value={searchData.city}
                  onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 rounded-lg border-0 focus:ring-2 focus:ring-[#b98d4f] focus:outline-none text-gray-800 placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  placeholder="Check In"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-lg border-0 focus:ring-2 focus:ring-[#b98d4f] focus:outline-none text-gray-800"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  placeholder="Check Out"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-lg border-0 focus:ring-2 focus:ring-[#b98d4f] focus:outline-none text-gray-800"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-lg border-0 focus:ring-2 focus:ring-[#b98d4f] focus:outline-none text-gray-800 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleSearch}
                variant="primary"
                size="lg"
                className="w-full md:w-auto"
              >
                <Search size={20} className="mr-2" />
                Search Hotels
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
