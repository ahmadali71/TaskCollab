import express from 'express';
import {
  parseNaturalLanguage,
  getSuggestions,
  decomposeTask,
  getPrioritySuggestion,
  getSentimentAnalysis,
  getProductivityInsights,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/parse-task', parseNaturalLanguage);
router.post('/suggestions', getSuggestions);
router.post('/decompose-task/:id', decomposeTask);
router.get('/priority-suggestion/:id', getPrioritySuggestion);
router.get('/sentiment/:id', getSentimentAnalysis);
router.get('/insights', getProductivityInsights);

export default router;