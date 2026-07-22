import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: { type: String, default: '' },
    address: { type: String, required: [true, 'Address is required'] },
    suburb: { type: String, default: '' },
    city: { type: String, required: [true, 'City is required'] },
    state: {
      type: String,
      enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
      required: true,
    },
    postcode: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    website: { type: String, default: null },
    facilities: [{ type: String }],
    gallery: [{ type: String }], // image URLs
    openingHours: {
      type: Map,
      of: String,
      default: {
        mon: '06:00 - 22:00',
        tue: '06:00 - 22:00',
        wed: '06:00 - 22:00',
        thu: '06:00 - 22:00',
        fri: '06:00 - 21:00',
        sat: '07:00 - 20:00',
        sun: '08:00 - 18:00',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Geospatial index for nearby queries
gymSchema.index({ location: '2dsphere' });

// Full-text search index
gymSchema.index({ name: 'text', description: 'text', suburb: 'text', city: 'text' });

const Gym = mongoose.model('Gym', gymSchema);
export default Gym;
