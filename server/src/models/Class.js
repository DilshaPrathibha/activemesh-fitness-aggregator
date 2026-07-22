import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    instructor: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['yoga', 'pilates', 'spin', 'hiit', 'boxing', 'strength', 'crossfit', 'dance', 'swim', 'other'],
      default: 'other',
    },
    schedule: {
      dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0=Sun, 6=Sat
      startTime: { type: String, required: true }, // "HH:MM"
      duration: { type: Number, required: true, min: 15 }, // minutes
    },
    capacity: { type: Number, required: true, min: 1 },
    enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual for available slots
classSchema.virtual('availableSlots').get(function () {
  return this.capacity - this.enrolled.length;
});

classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

const Class = mongoose.model('Class', classSchema);
export default Class;
