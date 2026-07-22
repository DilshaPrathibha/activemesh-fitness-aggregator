import { Link } from 'react-router-dom';
import { Search, Shield, Zap, Star, ArrowRight, MapPin } from 'lucide-react';

const features = [
  { icon: Search, title: 'Find Any Gym', desc: 'Search thousands of gyms across Australia by location, facilities, and price.' },
  { icon: Shield, title: 'Secure Check-in', desc: 'Dynamic QR passes with 60-second expiry keep every visit safe and verified.' },
  { icon: Zap, title: 'Instant Booking', desc: 'Book classes in seconds. Cancel anytime up to 2 hours before the session.' },
  { icon: Star, title: 'One Membership', desc: 'A single flexible membership that works across our entire gym network.' },
];

const stats = [
  { value: '500+', label: 'Partner Gyms' },
  { value: '200K+', label: 'Active Members' },
  { value: '50+', label: 'Cities' },
  { value: '99.9%', label: 'Uptime' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" /> Australia's #1 Fitness Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              One Pass.<br />
              <span className="text-cyan-300">Every Gym.</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl">
              Search, book, and check into over 500 partner gyms across Australia with a single ActiveMesh membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/gyms" className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
                <Search className="w-4 h-4" /> Find Gyms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-violet-600">{value}</div>
                <div className="text-sm text-[rgb(var(--color-muted))] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Everything you need to stay fit</h2>
          <p className="text-[rgb(var(--color-muted))] max-w-xl mx-auto">
            ActiveMesh connects you to Australia's largest gym network with smart check-in technology and flexible plans.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[rgb(var(--color-muted))]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-cyan-500 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start your fitness journey?</h2>
          <p className="text-white/80 mb-8">Join 200,000+ Australians who train smarter with ActiveMesh.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
