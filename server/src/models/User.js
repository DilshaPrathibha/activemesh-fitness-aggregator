import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'gym_owner', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    favouriteGyms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
      },
    ],
    // JWT refresh token
    refreshToken: {
      type: String,
      select: false,
    },
    // Password reset
    resetToken: {
      type: String,
      select: false,
    },
    resetExpiry: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10); // 10 is OWASP-compliant; 12 caused OOM crashes
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Public profile (strip sensitive fields)
userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.resetToken;
  delete obj.resetExpiry;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
