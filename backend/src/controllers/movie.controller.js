import axios from 'axios';
import Movie from '../models/Movie.model.js';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Mood to genre mapping
 */
const moodToGenres = {
  happy: [35, 10402, 10751], // Comedy, Music, Family
  sad: [18, 10749], // Drama, Romance
  excited: [28, 12, 878], // Action, Adventure, Science Fiction
  relaxed: [99, 36, 14], // Documentary, History, Fantasy
  romantic: [10749, 18], // Romance, Drama
  scared: [27, 53], // Horror, Thriller
  nostalgic: [36, 18], // History, Drama
  adventurous: [12, 28], // Adventure, Action
  thoughtful: [99, 18], // Documentary, Drama
  energetic: [28, 35] // Action, Comedy
};

/**
 * @desc    Get mood-based movie recommendations
 * @route   GET /api/movies/recommend
 * @access  Private
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const { currentMood, desiredMood, minRating, maxRating, year, sortBy } = req.query;

    if (!currentMood && !desiredMood) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one mood (currentMood or desiredMood)'
      });
    }

    // Determine which mood to use (prefer desiredMood)
    const mood = desiredMood || currentMood;
    const genres = moodToGenres[mood.toLowerCase()] || moodToGenres.happy;

    // Build TMDb API params
    const tmdbParams = {
      api_key: process.env.TMDB_API_KEY,
      with_genres: genres.join(','),
      sort_by: sortBy || 'popularity.desc',
      page: req.query.page || 1
    };

    // Add rating filters
    if (minRating) {
      tmdbParams['vote_average.gte'] = parseFloat(minRating);
    } else {
      tmdbParams['vote_average.gte'] = 6.0; // Default minimum
    }

    if (maxRating) {
      tmdbParams['vote_average.lte'] = parseFloat(maxRating);
    }

    // Add year filter
    if (year) {
      const yearInt = parseInt(year);
      tmdbParams['primary_release_date.gte'] = `${yearInt}-01-01`;
      tmdbParams['primary_release_date.lte'] = `${yearInt}-12-31`;
    }

    // Fetch movies from TMDb
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: tmdbParams
    });

    const movies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity
    }));

    res.status(200).json({
      success: true,
      count: movies.length,
      page: response.data.page,
      totalPages: response.data.total_pages,
      movies
    });
  } catch (error) {
    console.error('TMDb API Error:', error.message);
    next(error);
  }
};

/**
 * @desc    Get movie details
 * @route   GET /api/movies/:id
 * @access  Public
 */
export const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY
      }
    });

    const movie = {
      id: response.data.id,
      title: response.data.title,
      overview: response.data.overview,
      releaseDate: response.data.release_date,
      posterPath: response.data.poster_path ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}` : null,
      backdropPath: response.data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}` : null,
      rating: response.data.vote_average,
      voteCount: response.data.vote_count,
      popularity: response.data.popularity,
      runtime: response.data.runtime,
      tagline: response.data.tagline,
      genres: response.data.genres.map(g => g.name)
    };

    res.status(200).json({
      success: true,
      movie
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    next(error);
  }
};

/**
 * @desc    Search movies
 * @route   GET /api/movies/search
 * @access  Public
 */
export const searchMovies = async (req, res, next) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        page
      }
    });

    const movies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      rating: movie.vote_average,
      voteCount: movie.vote_count
    }));

    res.status(200).json({
      success: true,
      count: movies.length,
      page: response.data.page,
      totalPages: response.data.total_pages,
      movies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get popular movies
 * @route   GET /api/movies/popular
 * @access  Public
 */
export const getPopularMovies = async (req, res, next) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        page: req.query.page || 1
      }
    });

    const movies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      rating: movie.vote_average,
      voteCount: movie.vote_count
    }));

    res.status(200).json({
      success: true,
      count: movies.length,
      page: response.data.page,
      totalPages: response.data.total_pages,
      movies
    });
  } catch (error) {
    next(error);
  }
};
