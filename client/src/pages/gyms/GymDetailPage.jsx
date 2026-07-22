import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, Phone, Globe, Clock, CheckCircle,
  QrCode, ArrowLeft, ChevronLeft, ChevronRight,
  Calendar, Dumbbell, Heart, Navigation,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import QRPassModal from '../../components/gyms/QRPassModal';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TABS = ['Overview', 'Timetable', 'Gallery', 'Location'];

export default function GymDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [gym, setGym] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const [gymRes, classRes] = await Promise.all([
          api.get(`/gyms/${id}`),
          api.get(`/gyms/${id}/classes`).catch(() => ({ data: { data: [] } })),
        ]);
        setGym(gymRes.data.data);
        setClasses(classRes.data.data || []);
        if (user) {
          setIsFavourite(user.favouriteGyms?.includes(id));
        }
      } catch {
        toast.error('Gym not found');
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [id, user]);

  const toggleFavourite = async () => {
    if (!user) return toast.error('Sign in to save favourites');
    try {
      if (isFavourite) {
        await api.delete(`/users/me/favourites/${id}`);
        setIsFavourite(false);
        toast.success('Removed from favourites');
      } else {
        await api.post(`/users/me/favourites/${id}`);
        setIsFavourite(true);
        toast.success('Added to favourites');
      }
    } catch {
      toast.error('Could not update favourites');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="skeleton h-64 rounded-2xl mb-6" />
        <div className="skeleton h-8 w-1/3 mb-4" />
        <div className="skeleton h-4 w-1/2 mb-2" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-[rgb(var(--color-muted))]">Gym not found.</p>
        <Link to="/gyms" className="btn-primary mt-4">Browse Gyms</Link>
      </div>
    );
  }

  const heroImage = gym.gallery?.[galleryIndex] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/gyms" className="inline-flex items-center gap-1.5 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to gyms
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 mb-8 bg-gray-100 dark:bg-slate-700">
        <img src={heroImage} alt={gym.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Gallery nav */}
        {gym.gallery?.length > 1 && (
          <>
            <button
              onClick={() => setGalleryIndex((i) => (i - 1 + gym.gallery.length) % gym.gallery.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGalleryIndex((i) => (i + 1) % gym.gallery.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gym.gallery.map((_, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === galleryIndex ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          </>
        )}

        {/* Overlay info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {gym.isVerified && (
                  <span className="badge bg-emerald-500/80 text-white text-xs">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{gym.name}</h1>
              <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
                <MapPin className="w-4 h-4" /> {gym.address}, {gym.suburb} {gym.state} {gym.postcode}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{gym.rating.toFixed(1)}</span>
              <span className="text-white/70 text-xs">({gym.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl p-1 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-violet-600 text-white'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="font-semibold mb-3">About</h2>
                <p className="text-sm text-[rgb(var(--color-muted))] leading-relaxed">{gym.description || 'No description available.'}</p>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Dumbbell className="w-4 h-4 text-violet-600" /> Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {gym.facilities?.map((f) => (
                    <span key={f} className="badge bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs py-1 px-3">{f}</span>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-violet-600" /> Opening Hours</h2>
                <div className="space-y-2">
                  {gym.openingHours && Object.entries(Object.fromEntries(gym.openingHours)).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize text-[rgb(var(--color-muted))]">{day}</span>
                      <span className="font-medium">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timetable tab */}
          {activeTab === 'Timetable' && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-600" /> Class Schedule</h2>
              {classes.length === 0 ? (
                <p className="text-sm text-[rgb(var(--color-muted))] text-center py-8">No classes scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => (
                    <div key={cls._id} className="flex items-center justify-between p-3 rounded-lg border border-[rgb(var(--color-border))] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{cls.name}</p>
                        <p className="text-xs text-[rgb(var(--color-muted))]">{DAYS[cls.schedule.dayOfWeek]} · {cls.schedule.startTime} · {cls.schedule.duration} min · {cls.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-violet-600">{cls.availableSlots ?? (cls.capacity - cls.enrolled?.length)} spots</p>
                        <Link to={user ? `/bookings?class=${cls._id}` : '/login'} className="text-xs btn-primary py-1 px-3 mt-1 inline-flex">Book</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gallery tab */}
          {activeTab === 'Gallery' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(gym.gallery?.length ? gym.gallery : ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600']).map((img, i) => (
                <button key={i} onClick={() => { setGalleryIndex(i); setActiveTab('Overview'); }} className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Location tab */}
          {activeTab === 'Location' && (
            <div className="card p-6">
              <h2 className="font-semibold mb-3">Location</h2>
              <p className="text-sm text-[rgb(var(--color-muted))] mb-4">{gym.address}, {gym.suburb} {gym.state} {gym.postcode}</p>
              {/* Google Maps embed */}
              <div className="rounded-xl overflow-hidden h-64 bg-gray-100 dark:bg-slate-700">
                <iframe
                  title="Gym location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(`${gym.name}, ${gym.address}, ${gym.city}`)}`}
                  allowFullScreen
                />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${gym.address}, ${gym.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-4 inline-flex"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="card p-5 space-y-3">
            {user ? (
              <button
                id="qr-pass-btn"
                onClick={() => setShowQR(true)}
                className="btn-primary w-full py-3 text-base"
              >
                <QrCode className="w-5 h-5" /> Get QR Pass
              </button>
            ) : (
              <Link to="/login" className="btn-primary w-full py-3 text-base text-center block">
                Sign in to Check In
              </Link>
            )}
            <button
              onClick={toggleFavourite}
              className={`btn-secondary w-full ${isFavourite ? 'text-red-500 border-red-200' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-red-500' : ''}`} />
              {isFavourite ? 'Saved' : 'Save Gym'}
            </button>
          </div>

          {/* Contact info */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-sm">Contact</h3>
            {gym.phone && (
              <a href={`tel:${gym.phone}`} className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]">
                <Phone className="w-4 h-4" /> {gym.phone}
              </a>
            )}
            {gym.website && (
              <a href={gym.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]">
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* QR Pass Modal */}
      {showQR && (
        <QRPassModal gymId={id} gymName={gym.name} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}
