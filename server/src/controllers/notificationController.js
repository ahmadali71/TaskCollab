import { Notification } from '../models/Notification.js';

// @desc    Get all notifications for authenticated user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    read: false,
  });

  res.json({ count });
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json(notification);
};

// @desc    Mark all notifications as read
// @route   POST /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  res.json({ message: 'All notifications marked as read' });
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json({ message: 'Notification deleted' });
};