import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell, Calendar, Heart, TrendingUp, MapPin,
  Star, ChevronRight, QrCode, CheckCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-[rgb(var(--color-muted))]">{label}</p>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-[rgb(var(--color-muted))] text-sm mt-1">Here's your fitness overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Dumbbell} label="Total Visits" value={data?.stats?.totalVisits ?? 0} color="bg-violet-100 dark:bg-violet-900/40 text-violet-600" />
        <StatCard icon={TrendingUp} label="This Month" value={data?.stats?.thisMonthVisits ?? 0} color="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600" />
        <StatCard icon={Calendar} label="Upcoming Classes" value={data?.upcomingBookings?.length ?? 0} color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600" />
        <StatCard icon={Heart} label="Saved Gyms" value={data?.favouriteGyms?.length ?? 0} color="bg-rose-100 dark:bg-rose-900/40 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership card */}
        <div className="lg:col-span-1">
          <div className={`card p-6 ${data?.subscription ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white' : ''}`}>
            <h2 className={`font-semibold mb-4 ${data?.subscription ? 'text-white' : ''}`}>Membership</h2>
            {data?.subscription ? (
              <>
                <div className="mb-2">
                  <p className="text-3xl font-bold">{data.subscription.plan?.name}</p>
                  <p className="text-white/70 text-sm mt-1 capitalize">{data.subscription.plan?.gymAccess} access</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 mt-4">
                  <p className="text-xs text-white/70">Renews</p>
                  <p className="font-medium">{new Date(data.subscription.renewalDate).toLocaleDateString('en-AU')}</p>
                </div>
                <Link to="/memberships" className="mt-4 flex items-center gap-1 text-sm text-white/80 hover:text-white">
                  Manage plan <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-[rgb(var(--color-muted))] mb-4">You don't have an active membership</p>
                <Link to="/memberships" className="btn-primary">Get a Plan</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Check-ins</h2>
              <Link to="/gyms" className="text-xs text-violet-600 hover:text-violet-700">Find Gyms →</Link>
            </div>
            {data?.recentCheckIns?.length === 0 ? (
              <div className="text-center py-8 text-[rgb(var(--color-muted))]">
                <QrCode className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No check-ins yet. Visit a gym and scan your QR pass!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentCheckIns?.slice(0, 5).map((ci) => (
                  <div key={ci._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/40 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ci.gym?.name}</p>
                      <p className="text-xs text-[rgb(var(--color-muted))]">{ci.gym?.suburb}, {new Date(ci.createdAt).toLocaleDateString('en-AU')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming bookings */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Upcoming Classes</h2>
              <Link to="/bookings" className="text-xs text-violet-600 hover:text-violet-700">All bookings →</Link>
            </div>
            {data?.upcomingBookings?.length === 0 ? (
              <div className="text-center py-6 text-[rgb(var(--color-muted))]">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No upcoming classes. Browse gym timetables to book!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.upcomingBookings?.map((b) => (
                  <div key={b._id} className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(var(--color-border))]">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-center">
                      <span className="text-xs font-bold text-emerald-700">{DAYS[new Date(b.date).getDay()]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{b.class?.name}</p>
                      <p className="text-xs text-[rgb(var(--color-muted))]">{b.class?.instructor} · {b.gym?.name}</p>
                    </div>
                    <p className="text-xs text-[rgb(var(--color-muted))]">{new Date(b.date).toLocaleDateString('en-AU')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favourite gyms */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Favourite Gyms</h2>
            {data?.favouriteGyms?.length === 0 ? (
              <div className="text-center py-4 text-[rgb(var(--color-muted))]">
                <Heart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No saved gyms yet</p>
                <Link to="/gyms" className="text-xs text-violet-600 mt-2 inline-block">Browse gyms →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.favouriteGyms?.map((gym) => (
                  <Link key={gym._id} to={`/gyms/${gym._id}`} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
                      {gym.gallery?.[0] && <img src={gym.gallery[0]} alt={gym.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{gym.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-[rgb(var(--color-muted))]">{gym.rating}</span>
                        <span className="text-xs text-[rgb(var(--color-muted))]">· {gym.suburb}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
