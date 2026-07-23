import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, default: 'mock' },
  reference: { type: String, default: null },
});

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      default: null, // null = network access
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending'],
      default: 'active',
    },
    startDate: { type: Date, default: Date.now },
    renewalDate: { type: Date, required: true },
    cancelledAt: { type: Date, default: null },
    paymentHistory: [paymentSchema],
  },
  { timestamps: true }
);

// Only one active subscription per user
subscriptionSchema.index({ user: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
