import { Activity } from '../models/Activity.js';

export const logActivity = async (userId, type, action, target, targetUrl, details = '', extra = {}) => {
  try {
    const activity = await Activity.create({
      user: userId,
      type,
      action,
      target,
      targetUrl,
      details,
      ...extra,
    });
    return activity;
  } catch (error) {
    console.error('Activity logging error:', error);
    // Don't throw - logging should not break main functionality
  }
};

export const activityLogger = (type, action, target, targetUrl) => {
  return async (req, res, next) => {
    // Store original send to intercept response
    const originalSend = res.send;
    res.send = function(body) {
      // Restore original send
      res.send = originalSend;
      
      // Log after successful operation (200-299 status)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        logActivity(
          req.user._id,
          type,
          action,
          target,
          targetUrl,
          body?.message || ''
        );
      }
      
      return res.send(body);
    };
    next();
  };
};