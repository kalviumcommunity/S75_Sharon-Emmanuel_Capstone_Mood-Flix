import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { movieService, watchlistService, ratingService } from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiStar, FiHeart } from 'react-icons/fi'

const MovieDetails = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    fetchMovieDetails()
    checkWatchlistStatus()
    checkUserRating()
  }, [id])

  const fetchMovieDetails = async () => {
    setLoading(true)
    try {
      const response = await movieService.getMovieDetails(id)
      setMovie(response.data.movie)
    } catch (error) {
      toast.error('Failed to fetch movie details')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkWatchlistStatus = async () => {
    try {
      const response = await watchlistService.getWatchlist()
      const watchlistItems = response.data.watchlist || []
      const isInWatchlist = watchlistItems.some(
        item => item.movie?.tmdbId?.toString() === id || item.movie?._id?.toString() === id
      )
      setInWatchlist(isInWatchlist)
    } catch (error) {
      console.error('Error checking watchlist:', error)
    }
  }

  const checkUserRating = async () => {
    try {
      const response = await ratingService.getMovieRatings(id)
      // Find user's rating if exists
      const userRating = response.data.ratings?.find(
        r => r.user?._id || r.user
      )
      if (userRating) {
        setRating(userRating.rating)
      }
    } catch (error) {
      console.error('Error checking rating:', error)
    }
  }

  const handleAddToWatchlist = async () => {
    try {
      if (inWatchlist) {
        // Find the watchlist item ID
        const response = await watchlistService.getWatchlist()
        const watchlistItems = response.data.watchlist || []
        const item = watchlistItems.find(
          item => item.movie?.tmdbId?.toString() === id || item.movie?._id?.toString() === id
        )
        if (item) {
          await watchlistService.removeFromWatchlist(item._id)
          setInWatchlist(false)
          toast.success('Removed from watchlist')
        }
      } else {
        await watchlistService.addToWatchlist(id)
        setInWatchlist(true)
        toast.success('Added to watchlist')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update watchlist')
      console.error('Error:', error)
    }
  }

  const handleRating = async (value) => {
    try {
      await ratingService.addRating(id, value)
      setRating(value)
      toast.success('Rating saved')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save rating')
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Movie not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      {movie.backdropPath && (
        <div
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${movie.backdropPath})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            {movie.posterPath ? (
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-64 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-xl italic text-gray-600 dark:text-gray-400 mb-4">
                {movie.tagline}
              </p>
            )}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-primary-600 font-semibold">
                ⭐ {movie.rating?.toFixed(1)}
              </span>
              {movie.releaseDate && (
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span className="text-gray-600 dark:text-gray-400">
                  {movie.runtime} min
                </span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToWatchlist}
                className={`flex items-center space-x-2 ${
                  inWatchlist
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'btn-primary'
                }`}
              >
                <FiHeart fill={inWatchlist ? 'currentColor' : 'none'} />
                <span>{inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-gray-700 dark:text-gray-300">Rate:</span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRating(value)}
                    className={`text-2xl ${
                      rating >= value
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <FiStar fill={rating >= value ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
