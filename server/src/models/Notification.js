import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['task_assigned', 'task_updated', 'task_completed', 'comment_added', 'mention', 'due_date'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  data: mongoose.Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);