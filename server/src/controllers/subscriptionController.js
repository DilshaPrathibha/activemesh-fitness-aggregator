import MembershipPlan from '../models/MembershipPlan.js';
import Subscription from '../models/Subscription.js';

// GET /api/plans
export const getPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort('sortOrder').lean();
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscriptions/me
export const getMySubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' })
      .populate('plan')
      .populate('gym', 'name city suburb')
      .lean();
    res.json({ success: true, data: sub });
  } catch (error) {
    next(error);
  }
};

// POST /api/subscriptions — subscribe to a plan
export const subscribe = async (req, res, next) => {
  try {
    const { planId, gymId } = req.body;

    const plan = await MembershipPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Cancel any existing active subscription
    await Subscription.updateMany(
      { user: req.user._id, status: 'active' },
      { status: 'cancelled', cancelledAt: new Date() }
    );

    const renewalDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);

    const sub = await Subscription.create({
      user: req.user._id,
      plan: planId,
      gym: plan.gymAccess === 'single' ? gymId : null,
      renewalDate,
      paymentHistory: [{ amount: plan.price, method: 'mock' }],
    });

    const populated = await sub.populate(['plan', 'gym']);

    res.status(201).json({
      success: true,
      message: `Successfully subscribed to ${plan.name} plan!`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/upgrade
export const upgradeSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id, status: 'active' });

    if (!sub) return res.status(404).json({ success: false, message: 'Active subscription not found' });

    const newPlan = await MembershipPlan.findById(planId);
    if (!newPlan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const renewalDate = new Date(Date.now() + newPlan.duration * 24 * 60 * 60 * 1000);

    sub.plan = planId;
    sub.renewalDate = renewalDate;
    sub.paymentHistory.push({ amount: newPlan.price, method: 'mock' });
    await sub.save();

    const populated = await sub.populate('plan');

    res.json({ success: true, message: `Upgraded to ${newPlan.name}!`, data: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/downgrade — same as upgrade but for lower tier
export const downgradeSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id, status: 'active' });

    if (!sub) return res.status(404).json({ success: false, message: 'Active subscription not found' });

    const newPlan = await MembershipPlan.findById(planId);
    if (!newPlan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Downgrade takes effect at renewal
    sub.plan = planId;
    sub.paymentHistory.push({ amount: newPlan.price, method: 'mock' });
    await sub.save();

    const populated = await sub.populate('plan');
    res.json({ success: true, message: `Downgraded to ${newPlan.name}. Changes take effect on renewal.`, data: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/cancel
export const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id, status: 'active' });

    if (!sub) return res.status(404).json({ success: false, message: 'Active subscription not found' });

    sub.status = 'cancelled';
    sub.cancelledAt = new Date();
    await sub.save();

    res.json({ success: true, message: 'Subscription cancelled. Access continues until renewal date.' });
  } catch (error) {
    next(error);
  }
};
