import { Shield, Award, HeadphonesIcon, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Your data and payments are protected with industry-leading security',
  },
  {
    icon: Award,
    title: 'Best Price Guarantee',
    description: 'Find a lower price elsewhere? We will match it',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our team is always here to help you with any questions',
  },
  {
    icon: Clock,
    title: 'Instant Confirmation',
    description: 'Receive booking confirmation immediately after reservation',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-[#161412]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Why Choose Hotex
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Experience the difference with our premium service and exclusive benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#b98d4f] mb-6">
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
