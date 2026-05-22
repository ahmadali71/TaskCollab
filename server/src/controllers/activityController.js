import { Activity } from '../models/Activity.js';
import { logActivity } from '../middleware/activityLogger.js';

// @desc    Get user activity feed
// @route   GET /api/activity
// @access  Private
export const getActivities = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = req.query.filter || 'all';
  const search = req.query.search || '';

  // Build query
  const query = { user: req.user._id };

  // Apply filter
  if (filter !== 'all') {
    query.type = { $regex: filter, $options: 'i' };
  }

  // Apply search
  if (search) {
    query.$or = [
      { action: { $regex: search, $options: 'i' } },
      { target: { $regex: search, $options: 'i' } },
      { details: { $regex: search, $options: 'i' } },
      { project: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const activities = await Activity.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name avatar email');

  // Get total count for pagination
  const total = await Activity.countDocuments(query);

  res.json({
    success: true,
    activities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

// @desc    Get activity statistics
// @route   GET /api/activity/stats
// @access  Private
export const getActivityStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  const match = { user: req.user._id };
  
  if (startDate && endDate) {
    match.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const stats = await Activity.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byType: {
          $push: '$type',
        },
        totalLikes: {
          $sum: { $size: '$likes' },
        },
        uniqueProjects: {
          $addToSet: '$project',
        },
      },
    },
    {
      $project: {
        total: 1,
        byType: 1,
        totalLikes: 1,
        uniqueProjects: { $size: '$uniqueProjects' },
      },
    },
  ]);

  res.json({
    success: true,
    stats: stats[0] || { total: 0, byType: [], totalLikes: 0, uniqueProjects: 0 },
  });
};

// @desc    Create activity (for testing or manual logging)
// @route   POST /api/activity
// @access  Private
export const createActivity = async (req, res) => {
  const { type, action, target, targetUrl, details, project, priority, tags } = req.body;

  const activity = await logActivity(
    req.user._id,
    type,
    action,
    target,
    targetUrl,
    details,
    { project, priority, tags, userAgent: req.get('User-Agent'), ipAddress: req.ip }
  );

  res.status(201).json({
    success: true,
    activity,
  });
};