import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth service
export const authService = {
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  },

  register: (name, email, password) => {
    return api.post('/auth/register', { name, email, password })
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  getMe: () => {
    return api.get('/auth/me')
  },

  updateProfile: (data) => {
    return api.put('/auth/profile', data)
  }
}

// Movie service
export const movieService = {
  getRecommendations: (currentMood, desiredMood, page = 1, filters = {}) => {
    const params = {
      currentMood,
      desiredMood,
      page,
      ...(filters.minRating && { minRating: filters.minRating }),
      ...(filters.maxRating && { maxRating: filters.maxRating }),
      ...(filters.year && { year: filters.year }),
      ...(filters.sortBy && { sortBy: filters.sortBy })
    };
    return api.get('/movies/recommend', { params });
  },

  getMovieDetails: (id) => {
    return api.get(`/movies/${id}`)
  },

  searchMovies: (query, page = 1) => {
    return api.get('/movies/search', {
      params: { query, page }
    })
  },

  getPopularMovies: (page = 1) => {
    return api.get('/movies/popular', {
      params: { page }
    })
  }
}

// Watchlist service
export const watchlistService = {
  getWatchlist: () => {
    return api.get('/watchlist')
  },

  addToWatchlist: (tmdbId) => {
    return api.post('/watchlist', { tmdbId })
  },

  removeFromWatchlist: (id) => {
    return api.delete(`/watchlist/${id}`)
  },

  updateWatchStatus: (id, watched) => {
    return api.put(`/watchlist/${id}/watched`, { watched })
  }
}

// Rating service
export const ratingService = {
  addRating: (tmdbId, rating, review = '') => {
    return api.post('/ratings', { tmdbId, rating, review })
  },

  getRating: (id) => {
    return api.get(`/ratings/${id}`)
  },

  updateRating: (id, rating, review) => {
    return api.put(`/ratings/${id}`, { rating, review })
  },

  deleteRating: (id) => {
    return api.delete(`/ratings/${id}`)
  },

  getMovieRatings: (movieId) => {
    return api.get(`/ratings/movie/${movieId}`)
  }
}

// Admin service
export const adminService = {
  getUsers: () => {
    return api.get('/admin/users')
  },

  getUserById: (id) => {
    return api.get(`/admin/users/${id}`)
  },

  updateUser: (id, data) => {
    return api.put(`/admin/users/${id}`, data)
  },

  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`)
  },

  getFeedback: () => {
    return api.get('/admin/feedback')
  },

  getStats: () => {
    return api.get('/admin/stats')
  }
}

// Feedback service
export const feedbackService = {
  createFeedback: (data) => {
    return api.post('/feedback', data)
  },

  getFeedback: () => {
    return api.get('/feedback')
  }
}

export default api
