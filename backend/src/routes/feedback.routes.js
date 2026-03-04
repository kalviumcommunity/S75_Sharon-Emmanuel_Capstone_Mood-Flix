import express from 'express';
import {
  createFeedback,
  getFeedback
} from '../controllers/feedback.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateFeedback } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/', validateFeedback, createFeedback);
router.get('/', protect, getFeedback); // Users can view their own feedback

export default router;
