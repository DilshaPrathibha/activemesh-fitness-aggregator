import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
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
          <h1 className="text-2xl font-bold mt-4 mb-1">Reset your password</h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="card p-8 shadow-lg">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="font-semibold text-lg mb-2">Check your inbox</h2>
              <p className="text-sm text-[rgb(var(--color-muted))] mb-6">
                If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
              </p>
              <Link to="/login" className="btn-primary">Back to Sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" id="forgot-password-form">
              <div>
                <label htmlFor="forgot-email" className="label">Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              <button id="forgot-submit" type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] mt-2">
                <ArrowLeft className="w-4 h-4" /> Back to Sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
