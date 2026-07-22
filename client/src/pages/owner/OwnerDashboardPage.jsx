import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell, TrendingUp, Users, Calendar, Star,
  MapPin, ChevronRight, BarChart3, CheckCircle, Edit3,
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {sub && <span className="text-xs text-[rgb(var(--color-muted))]">{sub}</span>}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-[rgb(var(--color-muted))] mt-1">{label}</p>
    </div>
  );
}

function SimpleBarChart({ data, color = '#7c3aed' }) {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-32 text-[rgb(var(--color-muted))] text-sm">No data yet</div>
  );
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-32 w-full">
      {data.slice(-14).map((d) => (
        <div key={d._id} className="flex-1 flex flex-col items-center gap-1 group relative" title={`${d._id}: ${d.count}`}>
          <div
            className="w-full rounded-t transition-all duration-300 hover:opacity-80"
            style={{ height: `${(d.count / max) * 100}%`, background: color, minHeight: d.count > 0 ? '4px' : 0 }}
          />
        </div>
      ))}
    </div>
  );
}

export default function OwnerDashboardPage() {
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    api.get('/owner/gyms')
      .then((res) => {
        const data = res.data.data;
        setGyms(data);
        if (data.length > 0) setSelectedGym(data[0]);
      })
      .catch(() => toast.error('Could not load your gyms'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedGym) return;
    setAnalyticsLoading(true);
    api.get(`/owner/analytics/${selectedGym._id}`)
      .then((res) => setAnalytics(res.data.data))
      .catch(() => toast.error('Could not load analytics'))
      .finally(() => setAnalyticsLoading(false));
  }, [selectedGym]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  if (gyms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Dumbbell className="w-12 h-12 mx-auto mb-4 text-violet-300" />
        <h1 className="text-2xl font-bold mb-2">No gyms yet</h1>
        <p className="text-[rgb(var(--color-muted))] mb-6">Contact admin to register your gym on ActiveMesh.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">Manage your gyms and view performance</p>
        </div>
      </div>

      {/* Gym selector */}
      {gyms.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {gyms.map((gym) => (
            <button
              key={gym._id}
              onClick={() => setSelectedGym(gym)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                selectedGym?._id === gym._id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              {gym.name}
            </button>
          ))}
        </div>
      )}

      {selectedGym && (
        <>
          {/* Gym header card */}
          <div className="card p-6 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
              {selectedGym.gallery?.[0] && (
                <img src={selectedGym.gallery[0]} alt={selectedGym.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-lg">{selectedGym.name}</h2>
                {selectedGym.isVerified && (
                  <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-muted))]">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedGym.suburb}, {selectedGym.state}</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{selectedGym.rating?.toFixed(1)} ({selectedGym.reviewCount} reviews)</span>
              </div>
            </div>
            <Link to={`/gyms/${selectedGym._id}`} className="btn-secondary text-xs shrink-0">
              <Edit3 className="w-3 h-3" /> View Public Page
            </Link>
          </div>

          {/* Analytics stats */}
          {analyticsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
            </div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={CheckCircle} label="Total Check-ins" value={analytics.stats.totalCheckIns} color="bg-violet-100 dark:bg-violet-900/40 text-violet-600" />
                <StatCard icon={TrendingUp} label="Last 30 Days" value={analytics.stats.checkInsLast30} color="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600" sub="check-ins" />
                <StatCard icon={Calendar} label="Active Bookings" value={analytics.stats.totalBookings} color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600" />
                <StatCard icon={Users} label="Subscribers" value={analytics.stats.activeSubscriptions} color="bg-amber-100 dark:bg-amber-900/40 text-amber-600" />
              </div>

              {/* Daily check-ins chart */}
              <div className="card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold">Daily Check-ins (Last 30 Days)</h3>
                </div>
                <SimpleBarChart data={analytics.dailyCheckIns} />
                <div className="flex justify-between text-xs text-[rgb(var(--color-muted))] mt-2">
                  <span>30 days ago</span><span>Today</span>
                </div>
              </div>
            </>
          ) : null}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={`/gyms/${selectedGym._id}`}
              className="card p-5 flex items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">View Gym Profile</p>
                  <p className="text-xs text-[rgb(var(--color-muted))]">See public-facing page</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[rgb(var(--color-muted))] group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Rating</p>
                  <p className="text-xs text-[rgb(var(--color-muted))]">{selectedGym.rating?.toFixed(1)} / 5.0 from {selectedGym.reviewCount} reviews</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
