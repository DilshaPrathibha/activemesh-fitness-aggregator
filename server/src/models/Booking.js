import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    date: { type: Date, required: true }, // specific session date
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// Prevent double-booking same class on same date
bookingSchema.index({ user: 1, class: 1, date: 1 }, { unique: true });
// Fast lookup for gym's bookings on a date
bookingSchema.index({ gym: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
