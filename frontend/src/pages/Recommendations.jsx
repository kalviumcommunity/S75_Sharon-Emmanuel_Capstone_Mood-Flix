import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { movieService } from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiFilter, FiX } from 'react-icons/fi'

const Recommendations = () => {
  const [searchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minRating: '',
    maxRating: '',
    year: '',
    sortBy: 'popularity.desc'
  })

  const currentMood = searchParams.get('currentMood')
  const desiredMood = searchParams.get('desiredMood')

  useEffect(() => {
    fetchRecommendations()
  }, [currentMood, desiredMood, page, filters])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const response = await movieService.getRecommendations(
        currentMood,
        desiredMood,
        page,
        filters
      )
      setMovies(response.data.movies)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast.error('Failed to fetch recommendations')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
    setPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      minRating: '',
      maxRating: '',
      year: '',
      sortBy: 'popularity.desc'
    })
    setPage(1)
  }

  const hasActiveFilters = filters.minRating || filters.maxRating || filters.year || filters.sortBy !== 'popularity.desc'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recommendations
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Rating
                </label>
                <input
                  type="number"
                  name="minRating"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Rating
                </label>
                <input
                  type="number"
                  name="maxRating"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.maxRating}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="10.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={filters.year}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="vote_average.desc">Rating</option>
                  <option value="release_date.desc">Newest</option>
                  <option value="release_date.asc">Oldest</option>
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiX />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No recommendations found. Try selecting different moods.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/movie/${movie.id}`}>
                    <div className="card cursor-pointer overflow-hidden">
                      {movie.posterPath ? (
                        <img
                          src={movie.posterPath}
                          alt={movie.title}
                          className="w-full h-64 object-cover mb-4"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {movie.releaseDate?.split('-')[0]}
                        </span>
                        <span className="text-sm font-medium text-primary-600">
                          ⭐ {movie.rating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Recommendations
