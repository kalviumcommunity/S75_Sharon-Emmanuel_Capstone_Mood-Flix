import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchStatus
} from '../controllers/watchlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:id', removeFromWatchlist);
router.put('/:id/watched', updateWatchStatus);

export default router;
