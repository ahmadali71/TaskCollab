import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed', 'blocked', 'archived'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  labels: [{
    type: String,
    trim: true,
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
taskSchema.index({ creator: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ project: 1 });

export const Task = mongoose.model('Task', taskSchema);