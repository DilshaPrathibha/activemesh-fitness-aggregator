import mongoose from 'mongoose';

const qrPassSchema = new mongoose.Schema(
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
    token: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 1000), // 60 seconds
    },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL index: MongoDB auto-deletes expired QR passes
qrPassSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const QRPass = mongoose.model('QRPass', qrPassSchema);
export default QRPass;
