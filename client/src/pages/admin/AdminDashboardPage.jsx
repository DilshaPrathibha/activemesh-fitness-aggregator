import { useState, useEffect, useCallback } from 'react';
import {
  Users, Dumbbell, TrendingUp, CheckCircle, Calendar,
  Search, ChevronLeft, ChevronRight, ShieldCheck, ShieldOff,
  BarChart3, Clock, UserCheck, UserX, Plus, X, UserCog,
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {sub && <span className="text-xs text-[rgb(var(--color-muted))]">{sub}</span>}
      </div>
      <p className="text-2xl font-bold">{value ?? '—'}</p>
      <p className="text-xs text-[rgb(var(--color-muted))] mt-1">{label}</p>
    </div>
  );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data, color = '#7c3aed' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 text-[rgb(var(--color-muted))] text-sm">
        No data yet
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-28 w-full">
      {data.slice(-20).map((d) => (
        <div
          key={d._id}
          className="flex-1 flex flex-col items-center group"
          title={`${d._id}: ${d.count}`}
        >
          <div
            className="w-full rounded-t transition-all duration-300 hover:opacity-70"
            style={{
              height: `${(d.count / max) * 100}%`,
              background: color,
              minHeight: d.count > 0 ? '4px' : 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg border border-[rgb(var(--color-border))] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs text-[rgb(var(--color-muted))]">
        {page} / {pages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className="p-1.5 rounded-lg border border-[rgb(var(--color-border))] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = {
    admin: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    gym_owner: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
    user: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
  };
  return (
    <span className={`badge ${map[role] || map.user}`}>
      {role === 'gym_owner' ? 'Owner' : role}
    </span>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
        active
          ? 'bg-violet-600 text-white border-violet-600'
          : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Register Gym Modal ───────────────────────────────────────────────────────
const AU_STATES = ['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'];
const EMPTY_GYM = { name:'', address:'', suburb:'', city:'', state:'NSW', postcode:'', phone:'', website:'', description:'', ownerId:'' };

function RegisterGymModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_GYM);
  const [owners, setOwners] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load gym_owner users for the dropdown
    api.get('/admin/users?role=gym_owner&limit=50')
      .then(r => setOwners(r.data.data.users))
      .catch(() => toast.error('Could not load owners'));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ownerId) return toast.error('Please select an owner');
    setSaving(true);
    try {
      const { data } = await api.post('/admin/gyms', form);
      toast.success(data.message);
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create gym');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold mb-1">Register New Gym</h2>
        <p className="text-sm text-[rgb(var(--color-muted))] mb-5">Gym will be auto-verified and assigned to the selected owner.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Gym Name *</label>
            <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. FitHub Sydney" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Address *</label>
              <input className="input" required value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St" />
            </div>
            <div>
              <label className="label">Suburb</label>
              <input className="input" value={form.suburb} onChange={e => set('suburb', e.target.value)} placeholder="Surry Hills" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">City *</label>
              <input className="input" required value={form.city} onChange={e => set('city', e.target.value)} placeholder="Sydney" />
            </div>
            <div>
              <label className="label">State *</label>
              <select className="input" value={form.state} onChange={e => set('state', e.target.value)}>
                {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Postcode *</label>
              <input className="input" required value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder="2010" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="02 9000 0000" />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of the gym..." />
          </div>
          <div>
            <label className="label">Assign Owner * <span className="text-[rgb(var(--color-muted))] font-normal">(must have Gym Owner role)</span></label>
            <select className="input" required value={form.ownerId} onChange={e => set('ownerId', e.target.value)}>
              <option value="">— Select an owner —</option>
              {owners.map(o => (
                <option key={o._id} value={o._id}>{o.name} ({o.email})</option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">⚠ No gym_owner accounts found. Create one first via Users tab (change role to Gym Owner).</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Creating…' : 'Register Gym'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Assign Owner Modal ───────────────────────────────────────────────────────
function AssignOwnerModal({ gym, onClose, onUpdated }) {
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState(gym.owner?._id || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/users?role=gym_owner&limit=50')
      .then(r => setOwners(r.data.data.users))
      .catch(() => toast.error('Could not load owners'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/gyms/${gym._id}/owner`, { ownerId });
      toast.success(data.message);
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update owner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold mb-1">Assign Owner</h2>
        <p className="text-sm text-[rgb(var(--color-muted))] mb-5">{gym.name}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Select Owner *</label>
            <select className="input" required value={ownerId} onChange={e => setOwnerId(e.target.value)}>
              <option value="">— Select an owner —</option>
              {owners.map(o => (
                <option key={o._id} value={o._id}>{o.name} ({o.email})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving || !ownerId} className="btn-primary flex-1">
              {saving ? 'Saving…' : 'Assign Owner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Users table state
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPages, setUsersPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRole, setUsersRole] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Gyms table state
  const [gyms, setGyms] = useState([]);
  const [gymsTotal, setGymsTotal] = useState(0);
  const [gymsPage, setGymsPage] = useState(1);
  const [gymsPages, setGymsPages] = useState(1);
  const [gymsFilter, setGymsFilter] = useState('');
  const [gymsLoading, setGymsLoading] = useState(false);

  // Modal state
  const [showRegisterGym, setShowRegisterGym] = useState(false);
  const [assignOwnerGym, setAssignOwnerGym] = useState(null); // gym object to assign

  // ── Fetch stats ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setStatsLoading(true);
    api.get('/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Could not load platform stats'))
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch users ─────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    const params = new URLSearchParams({ page: usersPage, limit: 15 });
    if (usersSearch) params.set('search', usersSearch);
    if (usersRole) params.set('role', usersRole);
    api.get(`/admin/users?${params}`)
      .then((res) => {
        const { users: u, total, pages } = res.data.data;
        setUsers(u);
        setUsersTotal(total);
        setUsersPages(pages);
      })
      .catch(() => toast.error('Could not load users'))
      .finally(() => setUsersLoading(false));
  }, [usersPage, usersSearch, usersRole]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchUsers]);

  // ── Fetch gyms ─────────────────────────────────────────────────────────────
  const fetchGyms = useCallback(() => {
    setGymsLoading(true);
    const params = new URLSearchParams({ page: gymsPage, limit: 15 });
    if (gymsFilter !== '') params.set('verified', gymsFilter);
    api.get(`/admin/gyms?${params}`)
      .then((res) => {
        const { gyms: g, total, pages } = res.data.data;
        setGyms(g);
        setGymsTotal(total);
        setGymsPages(pages);
      })
      .catch(() => toast.error('Could not load gyms'))
      .finally(() => setGymsLoading(false));
  }, [gymsPage, gymsFilter]);

  useEffect(() => {
    if (activeTab === 'gyms') fetchGyms();
  }, [activeTab, fetchGyms]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleApproveGym = async (gymId) => {
    try {
      await api.patch(`/admin/gyms/${gymId}/approve`);
      toast.success('Gym approved!');
      fetchGyms();
    } catch {
      toast.error('Could not approve gym');
    }
  };

  const handleToggleUser = async (userId, isActive) => {
    try {
      const endpoint = isActive ? 'deactivate' : 'activate';
      await api.patch(`/admin/users/${userId}/${endpoint}`);
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch {
      toast.error('Could not update user');
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">Platform oversight &amp; management</p>
        </div>
        <span className="badge bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs px-3 py-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Admin
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Tab active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
          <BarChart3 className="w-4 h-4 inline-block mr-1" />Platform Stats
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          <Users className="w-4 h-4 inline-block mr-1" />Users
        </Tab>
        <Tab active={activeTab === 'gyms'} onClick={() => setActiveTab('gyms')}>
          <Dumbbell className="w-4 h-4 inline-block mr-1" />Gyms
        </Tab>
      </div>

      {/* ── STATS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <>
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-28 rounded-2xl" />
              ))}
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={Users}
                  label="Total Members"
                  value={stats.users.total}
                  sub={`+${stats.users.newLast30} this month`}
                  color="bg-violet-100 dark:bg-violet-900/40 text-violet-600"
                />
                <StatCard
                  icon={Dumbbell}
                  label="Total Gyms"
                  value={stats.gyms.total}
                  sub={`${stats.gyms.pending} pending`}
                  color="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Check-ins (30d)"
                  value={stats.checkIns.last30}
                  sub={`${stats.checkIns.total} all-time`}
                  color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Active Subscriptions"
                  value={stats.subscriptions.active}
                  color="bg-amber-100 dark:bg-amber-900/40 text-amber-600"
                />
              </div>

              {/* Daily check-ins chart */}
              <div className="card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold">Platform Daily Check-ins (Last 30 Days)</h3>
                </div>
                <MiniBarChart data={stats.dailyCheckIns} />
                <div className="flex justify-between text-xs text-[rgb(var(--color-muted))] mt-2">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={Calendar}
                  label="Confirmed Bookings"
                  value={stats.bookings.confirmed}
                  color="bg-rose-100 dark:bg-rose-900/40 text-rose-600"
                />
                <StatCard
                  icon={UserCheck}
                  label="New Members (30d)"
                  value={stats.users.newLast30}
                  color="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600"
                />
              </div>
            </>
          ) : (
            <div className="card p-8 text-center text-[rgb(var(--color-muted))]">
              Failed to load stats. Please refresh.
            </div>
          )}
        </>
      )}

      {/* ── USERS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-[rgb(var(--color-border))] flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" />
              <input
                id="admin-user-search"
                type="text"
                placeholder="Search name or email…"
                value={usersSearch}
                onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1); }}
                className="input pl-9 text-sm"
              />
            </div>
            <select
              id="admin-user-role-filter"
              value={usersRole}
              onChange={(e) => { setUsersRole(e.target.value); setUsersPage(1); }}
              className="input w-36 text-sm"
            >
              <option value="">All roles</option>
              <option value="user">Member</option>
              <option value="gym_owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <span className="text-xs text-[rgb(var(--color-muted))] whitespace-nowrap">
              {usersTotal} users
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))] bg-gray-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))]">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))] hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))]">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))] hidden md:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))]">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-[rgb(var(--color-border))]">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="skeleton h-4 rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[rgb(var(--color-muted))]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-[rgb(var(--color-border))] hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-violet-600">
                              {u.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium truncate max-w-[120px]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[rgb(var(--color-muted))] hidden sm:table-cell truncate max-w-[160px]">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-3 text-[rgb(var(--color-muted))] hidden md:table-cell">
                        {new Date(u.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        {u.isActive ? (
                          <span className="badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUser(u._id, u.isActive)}
                            title={u.isActive ? 'Deactivate user' : 'Activate user'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.isActive
                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`}
                          >
                            {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination page={usersPage} pages={usersPages} onPage={setUsersPage} />
          </div>
        </div>
      )}

      {/* ── GYMS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'gyms' && (
        <div className="card overflow-hidden">
          {/* Filters + Register button */}
          <div className="p-4 border-b border-[rgb(var(--color-border))] flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              {[
                { label: 'All Gyms', value: '' },
                { label: 'Pending', value: 'false' },
                { label: 'Verified', value: 'true' },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => { setGymsFilter(value); setGymsPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    gymsFilter === value
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs text-[rgb(var(--color-muted))]">{gymsTotal} gyms</span>
            <button
              onClick={() => setShowRegisterGym(true)}
              className="ml-auto btn-primary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Register Gym
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))] bg-gray-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))]">Gym</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))] hidden sm:table-cell">Owner</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))] hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-[rgb(var(--color-muted))]">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {gymsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-[rgb(var(--color-border))]">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="skeleton h-4 rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : gyms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[rgb(var(--color-muted))]">
                      No gyms found
                    </td>
                  </tr>
                ) : (
                  gyms.map((gym) => (
                    <tr
                      key={gym._id}
                      className="border-b border-[rgb(var(--color-border))] hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
                            {gym.gallery?.[0] ? (
                              <img src={gym.gallery[0]} alt={gym.name} className="w-full h-full object-cover" />
                            ) : (
                              <Dumbbell className="w-4 h-4 m-2 text-[rgb(var(--color-muted))]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[140px]">{gym.name}</p>
                            <p className="text-xs text-[rgb(var(--color-muted))]">
                              ★ {gym.rating?.toFixed(1) ?? '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[rgb(var(--color-muted))] hidden sm:table-cell">
                        <p className="truncate max-w-[120px]">{gym.owner?.name ?? '—'}</p>
                        <p className="text-xs truncate">{gym.owner?.email ?? ''}</p>
                      </td>
                      <td className="px-4 py-3 text-[rgb(var(--color-muted))] hidden md:table-cell">
                        {gym.suburb}, {gym.state}
                      </td>
                      <td className="px-4 py-3">
                        {gym.isVerified ? (
                          <span className="badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setAssignOwnerGym(gym)}
                            title="Assign / change owner"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[rgb(var(--color-border))] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <UserCog className="w-3.5 h-3.5" /> Owner
                          </button>
                          {!gym.isVerified && (
                            <button
                              onClick={() => handleApproveGym(gym._id)}
                              title="Approve gym"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination page={gymsPage} pages={gymsPages} onPage={setGymsPage} />
          </div>
        </div>
      )}

      {/* Modals */}
      {showRegisterGym && (
        <RegisterGymModal
          onClose={() => setShowRegisterGym(false)}
          onCreated={() => { fetchGyms(); setActiveTab('gyms'); }}
        />
      )}
      {assignOwnerGym && (
        <AssignOwnerModal
          gym={assignOwnerGym}
          onClose={() => setAssignOwnerGym(null)}
          onUpdated={fetchGyms}
        />
      )}
    </div>
  );
}
