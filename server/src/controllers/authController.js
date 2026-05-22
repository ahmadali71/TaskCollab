import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Activity } from '../models/Activity.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { logActivity } from '../middleware/activityLogger.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Generate Refresh Token
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken();

  // Save session
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await Session.create({
    user: user._id,
    token,
    refreshToken,
    expiresAt,
    deviceInfo: {
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
    },
  });

  // Log activity
  await logActivity(
    user._id,
    'login',
    'New account registered',
    'Account',
    '/profile',
    'Successfully registered'
  );

  res.status(201).json({
    success: true,
    token,
    refreshToken,
    user: user.getPublicProfile(),
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  user.loginCount += 1;
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken();

  // Save session
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await Session.create({
    user: user._id,
    token,
    refreshToken,
    expiresAt,
    deviceInfo: {
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
    },
  });

  // Log activity
  await logActivity(
    user._id,
    'login',
    'Logged in',
    'Account',
    '/dashboard',
    'Successfully logged in'
  );

  res.json({
    success: true,
    token,
    refreshToken,
    user: user.getPublicProfile(),
  });
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    // Deactivate the session if token exists
    if (token) {
      await Session.findOneAndUpdate(
        { token, isActive: true },
        { isActive: false }
      );
    }

    // Log activity
    await logActivity(
      req.user._id,
      'logout',
      'Logged out',
      'Account',
      '/',
      'Successfully logged out'
    );

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user.getPublicProfile(),
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const updates = {};
  const allowedFields = ['name', 'avatar', 'preferences'];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  // Log activity
  await logActivity(
    req.user._id,
    'profile_updated',
    'Updated profile',
    'Profile',
    '/profile',
    'Profile information updated'
  );

  res.json({
    success: true,
    user: user.getPublicProfile(),
  });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  // Find session with refresh token
  const session = await Session.findOne({
    refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }

  // Generate new tokens
  const newToken = generateToken(session.user);
  const newRefreshToken = generateRefreshToken();

  // Update session
  session.token = newToken;
  session.refreshToken = newRefreshToken;
  session.lastAccessed = new Date();
  await session.save();

  res.json({
    success: true,
    token: newToken,
    refreshToken: newRefreshToken,
  });
};