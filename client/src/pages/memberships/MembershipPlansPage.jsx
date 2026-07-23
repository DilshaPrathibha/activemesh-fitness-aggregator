import { useState, useEffect } from 'react';
import { Check, X, Loader2, Zap, Shield, Star } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PLAN_ICONS = { basic: Shield, standard: Zap, premium: Star };
const PLAN_COLORS = {
  basic: 'from-gray-400 to-gray-600',
  standard: 'from-violet-500 to-violet-700',
  premium: 'from-amber-400 to-orange-500',
};

export default function MembershipPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          api.get('/plans'),
          user ? api.get('/subscriptions/me').catch(() => ({ data: { data: null } })) : Promise.resolve({ data: { data: null } }),
        ]);
        setPlans(plansRes.data.data);
        setSubscription(subRes.data.data);
      } catch {
        toast.error('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubscribe = async (planId) => {
    if (!user) return toast.error('Please sign in to subscribe');
    setSubscribing(planId);
    try {
      const { data } = await api.post('/subscriptions', { planId });
      setSubscription(data.data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await api.put(`/subscriptions/${subscription._id}/cancel`);
      setSubscription(null);
      toast.success('Subscription cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Membership Plans</h1>
        <p className="text-[rgb(var(--color-muted))] max-w-xl mx-auto">
          Choose the plan that fits your fitness journey. All plans include QR check-in and mobile app access.
        </p>
      </div>

      {/* Current subscription banner */}
      {subscription && (
        <div className="card p-4 mb-8 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 flex items-center justify-between">
          <div>
            <p className="font-semibold text-violet-700 dark:text-violet-300">
              ✓ Active: {subscription.plan?.name} Plan
            </p>
            <p className="text-sm text-[rgb(var(--color-muted))] mt-0.5">
              Renews {new Date(subscription.renewalDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={handleCancel} className="btn-danger text-xs px-3 py-1.5">Cancel Plan</button>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.slug] || Shield;
          const gradient = PLAN_COLORS[plan.slug] || 'from-gray-400 to-gray-600';
          const isCurrentPlan = subscription?.plan?._id === plan._id || subscription?.plan === plan._id;
          const isPremium = plan.slug === 'premium';

          return (
            <div
              key={plan._id}
              id={`plan-${plan.slug}`}
              className={`card overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${isPremium ? 'ring-2 ring-amber-400' : ''}`}
            >
              {/* Plan header */}
              <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
                {isPremium && (
                  <div className="badge bg-white/20 text-white text-xs mb-3">Most Popular</div>
                )}
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-white/70 text-sm mb-1">/month</span>
                </div>
                <p className="text-white/70 text-xs mt-1 capitalize">{plan.gymAccess} gym access</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <div className="btn-secondary w-full text-center cursor-default opacity-75">
                    <Check className="w-4 h-4 text-emerald-500" /> Current Plan
                  </div>
                ) : (
                  <button
                    id={`subscribe-${plan.slug}`}
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={subscribing === plan._id}
                    className={`w-full py-2.5 font-medium rounded-lg transition-all ${
                      isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-90' : 'btn-primary'
                    }`}
                  >
                    {subscribing === plan._id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : subscription ? 'Switch Plan' : 'Get Started'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features comparison note */}
      <p className="text-center text-sm text-[rgb(var(--color-muted))] mt-10">
        All plans include a 30-day billing cycle. Cancel anytime — access continues until period end.
      </p>
    </div>
  );
}
