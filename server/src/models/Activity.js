import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'task_created', 'task_completed', 'task_updated', 'task_deleted',
      'comment_added', 'comment_deleted', 'status_change',
      'member_added', 'file_uploaded', 'project_created',
      'project_updated', 'project_deleted', 'milestone_reached',
      'badge_earned', 'integration_connected', 'login', 'logout',
      'profile_updated', 'password_changed'
    ],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  targetUrl: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: '',
  },
  project: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
  },
  tags: [{
    type: String,
  }],
  mentions: [{
    type: String,
  }],
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, {
  timestamps: true,
});

// Indexes for better query performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ project: 1 });
activitySchema.index({ createdAt: -1 });

// Virtual for formatted timestamp
activitySchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((Date.now() - this.createdAt) / 1000);
  const intervals = {
    year: 31536000, month: 2592000, week: 604800, day: 86400,
    hour: 3600, minute: 60, second: 1
  };
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  return 'just now';
});

activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

export const Activity = mongoose.model('Activity', activitySchema);