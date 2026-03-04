import express from 'express';
import {
  getRecommendations,
  getMovieDetails,
  searchMovies,
  getPopularMovies
} from '../controllers/movie.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/recommend', protect, getRecommendations);
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);

export default router;
