import Rating from '../models/Rating.model.js';
import Movie from '../models/Movie.model.js';
import axios from 'axios';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * @desc    Add or update rating for a movie
 * @route   POST /api/ratings
 * @access  Private
 */
export const addRating = async (req, res, next) => {
  try {
    const { tmdbId, rating, review } = req.body;

    if (!tmdbId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie ID (tmdbId) and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if movie exists in our database, if not fetch from TMDb and save
    let movie = await Movie.findOne({ tmdbId });

    if (!movie) {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
        params: {
          api_key: TMDB_API_KEY
        }
      });

      const tmdbMovie = response.data;

      movie = await Movie.create({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        releaseDate: tmdbMovie.release_date,
        posterPath: tmdbMovie.poster_path,
        backdropPath: tmdbMovie.backdrop_path,
        genres: tmdbMovie.genres.map(g => g.name),
        rating: tmdbMovie.vote_average,
        voteCount: tmdbMovie.vote_count,
        popularity: tmdbMovie.popularity,
        runtime: tmdbMovie.runtime,
        tagline: tmdbMovie.tagline
      });
    }

    // Check if rating already exists
    let userRating = await Rating.findOne({
      user: req.user.id,
      movie: movie._id
    });

    if (userRating) {
      // Update existing rating
      userRating.rating = rating;
      if (review) userRating.review = review;
      await userRating.save();
    } else {
      // Create new rating
      userRating = await Rating.create({
        user: req.user.id,
        movie: movie._id,
        rating,
        review: review || ''
      });
    }

    await userRating.populate('movie');

    res.status(201).json({
      success: true,
      rating: userRating
    });
  } catch (error) {
    if (error.code === 11000) {
      // Rating already exists, update it
      return addRating(req, res, next);
    }
    next(error);
  }
};

/**
 * @desc    Get user's rating for a movie
 * @route   GET /api/ratings/:id
 * @access  Private
 */
export const getRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('movie')
      .populate('user', 'name email');

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    res.status(200).json({
      success: true,
      rating
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update rating
 * @route   PUT /api/ratings/:id
 * @access  Private
 */
export const updateRating = async (req, res, next) => {
  try {
    let rating = await Rating.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    if (req.body.rating) {
      if (req.body.rating < 1 || req.body.rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      rating.rating = req.body.rating;
    }

    if (req.body.review !== undefined) {
      rating.review = req.body.review;
    }

    await rating.save();
    await rating.populate('movie');

    res.status(200).json({
      success: true,
      rating
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete rating
 * @route   DELETE /api/ratings/:id
 * @access  Private
 */
export const deleteRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    await rating.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Rating deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all ratings for a movie
 * @route   GET /api/ratings/movie/:movieId
 * @access  Private
 */
export const getMovieRatings = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.movieId });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const ratings = await Rating.find({ movie: movie._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.status(200).json({
      success: true,
      count: ratings.length,
      averageRating: avgRating.toFixed(1),
      ratings
    });
  } catch (error) {
    next(error);
  }
};
