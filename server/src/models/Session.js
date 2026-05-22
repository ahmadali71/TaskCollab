import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index for automatic cleanup
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
sessionSchema.index({ token: 1 });
sessionSchema.index({ user: 1, isActive: 1 });
sessionSchema.index({ expiresAt: 1 });

// Update lastAccessed on each use
sessionSchema.pre('findOneAndUpdate', function() {
  this.set({ lastAccessed: new Date() });
});

export const Session = mongoose.model('Session', sessionSchema);