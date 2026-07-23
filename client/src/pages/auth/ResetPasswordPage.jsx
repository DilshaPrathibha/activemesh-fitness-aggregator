import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed. The link may have expired.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-violet-600">
            <Dumbbell className="w-7 h-7" /> ActiveMesh
          </Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Set new password</h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">Your new password must be at least 8 characters</p>
        </div>

        <div className="card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5" id="reset-password-form">
            <div>
              <label htmlFor="reset-password" className="label">New password</label>
              <div className="relative">
                <input
                  id="reset-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="reset-confirm-password" className="label">Confirm new password</label>
              <input
                id="reset-confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="input"
                placeholder="Repeat password"
              />
            </div>
            <button id="reset-submit" type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
