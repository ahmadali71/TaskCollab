import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activity.js';
import taskRoutes from './routes/task.js';
import notificationRoutes from './routes/notification.js';
import aiRoutes from './routes/ai.js';

// Connect to database
connectDB();

// Initialize express
const app = express();

// CORS - Allow client to connect (MUST come first)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://task-collab-app.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Security middleware (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging in development
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Debug: Log all registered routes
console.log('Registered routes:');
app._router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// Health check for Vercel frontend
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// Health check (without /api prefix)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`CORS enabled for origins: http://localhost:5173, http://localhost:3000, https://task-collab-app.vercel.app`);
});