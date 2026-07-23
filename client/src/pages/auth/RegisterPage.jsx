import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth, getRoleHome } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
      const result = await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      toast.success('Account created! Welcome to ActiveMesh.');
      navigate(getRoleHome(result.user.role));
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
          <h1 className="text-2xl font-bold mt-4 mb-1">Create your account</h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">Join Australia's fitness network</p>
        </div>

        <div className="card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            <div>
              <label htmlFor="register-name" className="label">Full name</label>
              <input id="register-name" name="name" type="text" required value={form.name} onChange={handleChange} className="input" placeholder="Jane Smith" />
            </div>

            <div>
              <label htmlFor="register-email" className="label">Email address</label>
              <input id="register-email" name="email" type="email" required value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="register-role" className="label">I am a</label>
              <select id="register-role" name="role" value={form.role} onChange={handleChange} className="input">
                <option value="user">Fitness Member</option>
                <option value="gym_owner">Gym Owner</option>
              </select>
            </div>

            <div>
              <label htmlFor="register-password" className="label">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="label">Confirm password</label>
              <input id="register-confirm-password" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="input" placeholder="Repeat password" />
            </div>

            <button id="register-submit" type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[rgb(var(--color-muted))] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-medium hover:text-violet-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
