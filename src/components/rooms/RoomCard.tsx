import { Users, Maximize } from 'lucide-react';
import { Room } from '../../lib/supabase';
import { Button } from '../ui/Button';

interface RoomCardProps {
  room: Room;
  hotelId?: string;
  onBook?: () => void;
}

export function RoomCard({ room, hotelId, onBook }: RoomCardProps) {
  const roomUrl = hotelId ? `/hotels/${hotelId}/rooms/${room.id}` : `/rooms/${room.id}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.images[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        <div className="absolute top-4 right-4">
          <div className="bg-[#b98d4f] text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-xl">
            <div className="text-2xl font-bold">${room.price_per_night}</div>
            <div className="text-xs">/ night</div>
          </div>
        </div>

        {!room.is_available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {room.title}
        </h3>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users size={18} />
            <span className="text-sm">Up to {room.max_guests} guests</span>
          </div>
          {room.room_size && (
            <div className="flex items-center gap-1">
              <Maximize size={18} />
              <span className="text-sm">{room.room_size} m²</span>
            </div>
          )}
        </div>

        {room.bed_type && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Bed:</span> {room.bed_type}
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {room.description}
        </p>

        <div className="flex gap-3">
          {room.is_available ? (
            <>
              <a href={roomUrl} className="flex-1">
                <Button variant="outline" size="md" className="w-full">
                  View Details
                </Button>
              </a>
              <a href={`/book/${room.id}`} className="flex-1">
                <Button variant="primary" size="md" className="w-full">
                  Book Now
                </Button>
              </a>
            </>
          ) : (
            <Button variant="outline" size="md" className="w-full" disabled>
              Not Available
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
