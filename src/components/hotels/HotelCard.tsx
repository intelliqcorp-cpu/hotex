import { Star, MapPin } from 'lucide-react';
import { Hotel } from '../../lib/supabase';

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <a href={`/hotels/${hotel.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="relative h-64 overflow-hidden">
          <img
            src={hotel.main_image}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-[#b98d4f] text-white px-3 py-1 rounded-full text-sm font-medium">
            {hotel.star_rating} Star
          </div>
          {hotel.rating > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2">
              <Star size={16} className="fill-[#b98d4f] text-[#b98d4f]" />
              <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#b98d4f] transition-colors">
            {hotel.name}
          </h3>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{hotel.city}, {hotel.country}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {hotel.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-[#b98d4f] font-semibold">View Details</span>
            <svg
              className="w-5 h-5 text-[#b98d4f] transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}
