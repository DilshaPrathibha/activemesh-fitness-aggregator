import { Link } from 'react-router-dom';
import { Dumbbell, Share2, Send, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-violet-600 mb-3">
              <Dumbbell className="w-5 h-5" />
              ActiveMesh
            </Link>
            <p className="text-sm text-[rgb(var(--color-muted))] max-w-xs">
              Australia's premier fitness aggregator. Find gyms, book classes, and track your fitness journey.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-[rgb(var(--color-muted))] transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-[rgb(var(--color-muted))] transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-[rgb(var(--color-muted))] transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-[rgb(var(--color-muted))]">
              <li><Link to="/gyms" className="hover:text-[rgb(var(--color-text))] transition-colors">Find Gyms</Link></li>
              <li><Link to="/memberships" className="hover:text-[rgb(var(--color-text))] transition-colors">Memberships</Link></li>
              <li><Link to="/bookings" className="hover:text-[rgb(var(--color-text))] transition-colors">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-[rgb(var(--color-muted))]">
              <li><Link to="/register" className="hover:text-[rgb(var(--color-text))] transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-[rgb(var(--color-text))] transition-colors">Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-[rgb(var(--color-text))] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[rgb(var(--color-border))] mt-8 pt-6 text-center text-xs text-[rgb(var(--color-muted))]">
          © {new Date().getFullYear()} ActiveMesh. All rights reserved. Built for the Australian Fitness Aggregator Platform.
        </div>
      </div>
    </footer>
  );
}
