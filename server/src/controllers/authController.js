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
  console.log('📝 Register endpoint hit!', req.body);
  
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  try {
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

    console.log('✅ User registered successfully:', email);

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  console.log('🔐 Login endpoint hit!', req.body.email);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken();

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

    console.log('✅ User logged in successfully:', email);

    res.json({
      success: true,
      token,
      refreshToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      await Session.findOneAndUpdate(
        { token, isActive: true },
        { isActive: false }
      );
    }

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

  const newToken = generateToken(session.user);
  const newRefreshToken = generateRefreshToken();

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