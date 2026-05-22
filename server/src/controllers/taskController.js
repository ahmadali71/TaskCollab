import { Task } from '../models/Task.js';
import { logActivity } from '../middleware/activityLogger.js';

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  const { status, priority, project, search } = req.query;
  
  // Build query - user can see tasks they created or are assigned to
  const query = {
    $or: [
      { creator: req.user._id },
      { assignee: req.user._id },
    ],
    isActive: true,
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (project) query.project = project;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const tasks = await Task.find(query)
    .sort({ order: 1, createdAt: -1 })
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar');

  res.json({
    success: true,
    tasks,
  });
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access
  if (task.creator.toString() !== req.user._id.toString() && 
      task.assignee?.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this task',
    });
  }

  res.json({
    success: true,
    task,
  });
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignee, project, labels } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignee,
    project,
    labels,
    creator: req.user._id,
  });

  // Log activity
  await logActivity(
    req.user._id,
    'task_created',
    'Created task',
    'Task',
    `/tasks/${task._id}`,
    `Created task: ${title}`
  );

  res.status(201).json({
    success: true,
    task,
  });
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const updates = {};
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assignee', 'labels'];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access
  if (task.creator.toString() !== req.user._id.toString() && 
      task.assignee?.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task',
    });
  }

  // Log activity
  await logActivity(
    req.user._id,
    'task_updated',
    'Updated task',
    'Task',
    `/tasks/${task._id}`,
    `Updated task: ${task.title}`
  );

  res.json({
    success: true,
    task,
  });
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access
  if (task.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this task',
    });
  }

  // Log activity
  await logActivity(
    req.user._id,
    'task_deleted',
    'Deleted task',
    'Task',
    '/tasks',
    `Deleted task: ${task.title}`
  );

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
};

// @desc    Complete task
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access
  if (task.creator.toString() !== req.user._id.toString() && 
      task.assignee?.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task',
    });
  }

  task.status = task.status === 'completed' ? 'todo' : 'completed';
  task.completedAt = task.status === 'completed' ? new Date() : null;
  await task.save();

  // Log activity
  await logActivity(
    req.user._id,
    task.status === 'completed' ? 'task_completed' : 'status_change',
    task.status === 'completed' ? 'Completed task' : 'Reopened task',
    'Task',
    `/tasks/${task._id}`,
    `${task.title} marked as ${task.status}`
  );

  res.json({
    success: true,
    task,
  });
};

// @desc    Reorder tasks
// @route   PUT /api/tasks/reorder
// @access  Private
export const reorderTasks = async (req, res) => {
  const { taskIds } = req.body;

  for (let i = 0; i < taskIds.length; i++) {
    await Task.findByIdAndUpdate(taskIds[i], { order: i });
  }

  res.json({
    success: true,
    message: 'Tasks reordered successfully',
  });
};