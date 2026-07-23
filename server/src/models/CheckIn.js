import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    // Store date as UTC midnight for reliable date-only comparison
    date: {
      type: Date,
      required: true,
    },
    qrToken: { type: String, required: true },
    validatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index: enforce one-gym-per-day rule efficiently
checkInSchema.index({ user: 1, date: 1 });

const CheckIn = mongoose.model('CheckIn', checkInSchema);
export default CheckIn;
