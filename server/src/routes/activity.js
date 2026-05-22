import express from 'express';
import {
  getActivities,
  getActivityStats,
  createActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.get('/stats', getActivityStats);
router.post('/', createActivity);

export default router;