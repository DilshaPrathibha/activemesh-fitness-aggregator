import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth, getRoleHome } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      toast.success('Welcome back!');
      navigate(getRoleHome(result.user.role));
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-violet-600">
            <Dumbbell className="w-7 h-7" /> ActiveMesh
          </Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Welcome back</h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">Sign in to your account</p>
        </div>

        <div className="card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div>
              <label htmlFor="login-email" className="label">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-[rgb(var(--color-muted))] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-medium hover:text-violet-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
