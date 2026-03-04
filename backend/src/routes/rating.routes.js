import express from 'express';
import {
  addRating,
  getRating,
  updateRating,
  deleteRating,
  getMovieRatings
} from '../controllers/rating.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRating } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', validateRating, addRating);
router.get('/movie/:movieId', getMovieRatings);
router.get('/:id', getRating);
router.put('/:id', updateRating);
router.delete('/:id', deleteRating);

export default router;
