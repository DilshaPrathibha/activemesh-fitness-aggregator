import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle } from 'lucide-react';

export default function GymCard({ gym }) {
  const heroImage = gym.gallery?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600';

  return (
    <Link
      to={`/gyms/${gym._id}`}
      id={`gym-card-${gym._id}`}
      className="card overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700">
        <img
          src={heroImage}
          alt={gym.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'; }}
        />
        {gym.isVerified && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle className="w-3 h-3" /> Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{gym.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{gym.rating != null ? gym.rating.toFixed(1) : '—'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-[rgb(var(--color-muted))] mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{gym.suburb || gym.city}, {gym.state}</span>
        </div>

        {/* Facility chips */}
        <div className="flex flex-wrap gap-1.5">
          {gym.facilities?.slice(0, 3).map((f) => (
            <span key={f} className="badge bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[10px]">
              {f}
            </span>
          ))}
          {gym.facilities?.length > 3 && (
            <span className="badge bg-gray-100 dark:bg-slate-700 text-[rgb(var(--color-muted))] text-[10px]">
              +{gym.facilities.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
