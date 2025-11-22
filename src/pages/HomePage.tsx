import { Header } from '../components/layout/Header';
import { Hero } from '../components/home/Hero';
import { FeaturedHotels } from '../components/home/FeaturedHotels';
import { Features } from '../components/home/Features';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedHotels />
      <Features />

      <footer className="bg-[#1f1b1a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4">Hotex</h3>
              <p className="text-gray-400 text-sm">
                Your gateway to luxury accommodations worldwide
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/hotels" className="hover:text-[#b98d4f]">Hotels</a></li>
                <li><a href="/rooms" className="hover:text-[#b98d4f]">Rooms</a></li>
                <li><a href="/about" className="hover:text-[#b98d4f]">About Us</a></li>
                <li><a href="/contact" className="hover:text-[#b98d4f]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/faq" className="hover:text-[#b98d4f]">FAQ</a></li>
                <li><a href="/terms" className="hover:text-[#b98d4f]">Terms & Conditions</a></li>
                <li><a href="/privacy" className="hover:text-[#b98d4f]">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@hotex.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Hotex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
