import Watchlist from '../models/Watchlist.model.js';
import Movie from '../models/Movie.model.js';
import axios from 'axios';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * @desc    Get user's watchlist
 * @route   GET /api/watchlist
 * @access  Private
 */
export const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.id })
      .populate('movie')
      .sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      count: watchlist.length,
      watchlist
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add movie to watchlist
 * @route   POST /api/watchlist
 * @access  Private
 */
export const addToWatchlist = async (req, res, next) => {
  try {
    const { tmdbId } = req.body;

    if (!tmdbId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a movie ID (tmdbId)'
      });
    }

    // Check if movie exists in our database, if not fetch from TMDb and save
    let movie = await Movie.findOne({ tmdbId });

    if (!movie) {
      // Fetch movie details from TMDb
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

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      user: req.user.id,
      movie: movie._id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    // Add to watchlist
    const watchlistItem = await Watchlist.create({
      user: req.user.id,
      movie: movie._id
    });

    await watchlistItem.populate('movie');

    res.status(201).json({
      success: true,
      watchlistItem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }
    next(error);
  }
};

/**
 * @desc    Remove movie from watchlist
 * @route   DELETE /api/watchlist/:id
 * @access  Private
 */
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const watchlistItem = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found'
      });
    }

    await watchlistItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Movie removed from watchlist'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update watch status
 * @route   PUT /api/watchlist/:id/watched
 * @access  Private
 */
export const updateWatchStatus = async (req, res, next) => {
  try {
    const { watched } = req.body;

    const watchlistItem = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found'
      });
    }

    watchlistItem.watched = watched;
    if (watched) {
      watchlistItem.watchedAt = new Date();
    } else {
      watchlistItem.watchedAt = null;
    }

    await watchlistItem.save();

    res.status(200).json({
      success: true,
      watchlistItem
    });
  } catch (error) {
    next(error);
  }
};
