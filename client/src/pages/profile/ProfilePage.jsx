import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Loader2, User, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', avatar: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', avatar: user.avatar || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/me/profile', form);
      setUser(data.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center relative">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-violet-600">{user?.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-[rgb(var(--color-muted))]">{user?.email}</p>
            <span className="badge bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs mt-1 capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} id="profile-form" className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="label">Full name</label>
            <input id="profile-name" name="name" type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          </div>
          <div>
            <label htmlFor="profile-phone" className="label">Phone</label>
            <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" placeholder="04xx xxx xxx" />
          </div>
          <div>
            <label htmlFor="profile-avatar" className="label">Avatar URL</label>
            <input id="profile-avatar" name="avatar" type="url" value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))} className="input" placeholder="https://..." />
          </div>
          <button id="profile-save" type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
