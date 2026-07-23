import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Trash2, Loader2, CheckCircle, X, Users } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_COLORS = {
  yoga:     'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  hiit:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  spin:     'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  boxing:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  pilates:  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  crossfit: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  strength: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  other:    'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300',
};

/** Returns the next Date on which the given dayOfWeek (0=Sun) occurs */
function nextOccurrence(dayOfWeek) {
  const today = new Date();
  const todayDay = today.getDay();
  let daysAhead = dayOfWeek - todayDay;
  if (daysAhead <= 0) daysAhead += 7; // always future
  const next = new Date(today);
  next.setDate(today.getDate() + daysAhead);
  return next;
}

// ─── Booking Confirmation Banner ────────────────────────────────────────────
function BookingBanner({ classId, onBooked, onDismiss }) {
  const [cls, setCls] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api.get(`/classes/${classId}`)
      .then(({ data }) => {
        const c = data.data;
        setCls(c);
        // Pre-fill with the next occurrence of this class day
        const next = nextOccurrence(c.schedule.dayOfWeek);
        setBookingDate(next.toISOString().split('T')[0]);
      })
      .catch(() => {
        toast.error('Class not found');
        onDismiss();
      })
      .finally(() => setLoading(false));
  }, [classId]);

  const handleConfirm = async () => {
    if (!bookingDate) return toast.error('Please select a date');
    setConfirming(true);
    try {
      await api.post('/bookings', { classId, date: bookingDate });
      toast.success(`Booked ${cls.name}!`);
      onBooked();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create booking');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-5 mb-6 border-2 border-violet-500 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[rgb(var(--color-muted))]">Loading class details…</span>
      </div>
    );
  }

  if (!cls) return null;

  const spotsLeft = cls.capacity - (cls.enrolled?.length ?? 0);
  const categoryColor = CATEGORY_COLORS[cls.category] || CATEGORY_COLORS.other;

  return (
    <div className="card p-5 mb-6 border-2 border-violet-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Confirm your booking</p>
          <h2 className="text-lg font-bold">{cls.name}</h2>
          <p className="text-sm text-[rgb(var(--color-muted))]">{cls.gym?.name} · {cls.gym?.suburb}</p>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-sm text-[rgb(var(--color-muted))]">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-violet-500" />
          {DAYS[cls.schedule.dayOfWeek]}s · {cls.schedule.startTime} · {cls.schedule.duration} min
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-violet-500" />
          {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
        </span>
        <span className={`badge capitalize ${categoryColor}`}>{cls.category}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1">
          <label className="label text-xs mb-1">Select date</label>
          <input
            type="date"
            className="input"
            value={bookingDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setBookingDate(e.target.value)}
          />
          {bookingDate && (
            <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
              {DAYS[new Date(bookingDate + 'T00:00:00').getDay()]}
              {' — '}
              {new Date(bookingDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <button
          onClick={handleConfirm}
          disabled={confirming || spotsLeft === 0}
          className="btn-primary py-2.5 px-6 shrink-0"
        >
          {confirming
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : spotsLeft === 0
              ? 'Class Full'
              : <><CheckCircle className="w-4 h-4" /> Confirm Booking</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MyBookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pendingClassId = searchParams.get('class');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/bookings/me?status=${filter}`);
      setBookings(data.data.bookings);
    } catch {
      toast.error('Could not load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const handleBooked = () => {
    // Clear ?class= param and refresh list
    setSearchParams({});
    fetchBookings();
  };

  const handleDismiss = () => setSearchParams({});

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="flex gap-2">
          {['all', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-violet-600 text-white'
                  : 'bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Booking confirmation banner — appears when ?class= is in the URL */}
      {pendingClassId && (
        <BookingBanner
          classId={pendingClassId}
          onBooked={handleBooked}
          onDismiss={handleDismiss}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-[rgb(var(--color-muted))]">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No bookings yet</p>
          <p className="text-sm mt-1 mb-4">Browse gyms and pick a class to get started</p>
          <Link to="/gyms" className="btn-primary">Browse Gyms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const d = new Date(booking.date);
            const isPast = d < new Date();
            const categoryColor = CATEGORY_COLORS[booking.class?.category] || CATEGORY_COLORS.other;

            return (
              <div
                key={booking._id}
                id={`booking-${booking._id}`}
                className={`card p-5 flex items-center gap-4 ${booking.status === 'cancelled' ? 'opacity-60' : ''}`}
              >
                {/* Date block */}
                <div className="w-14 text-center shrink-0">
                  <div className="bg-violet-600 text-white text-xs font-bold py-1 rounded-t-lg">{MONTHS[d.getMonth()]}</div>
                  <div className="border border-[rgb(var(--color-border))] border-t-0 rounded-b-lg py-1.5">
                    <span className="text-xl font-bold">{d.getDate()}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{booking.class?.name}</h3>
                    <span className={`badge text-[10px] ${categoryColor} capitalize`}>{booking.class?.category}</span>
                    {booking.status === 'cancelled' && (
                      <span className="badge bg-gray-100 dark:bg-slate-700 text-gray-500 text-[10px]">Cancelled</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[rgb(var(--color-muted))]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {booking.class?.schedule?.startTime} · {booking.class?.schedule?.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {booking.gym?.name}, {booking.gym?.suburb}
                    </span>
                    <span>{booking.class?.instructor}</span>
                  </div>
                </div>

                {/* Cancel */}
                {booking.status === 'confirmed' && !isPast && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancelling === booking._id}
                    className="btn-danger text-xs px-3 py-1.5 shrink-0"
                  >
                    {cancelling === booking._id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <><Trash2 className="w-3 h-3" /> Cancel</>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
