import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { watchlistService } from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiTrash2, FiCheck } from 'react-icons/fi'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    setLoading(true)
    try {
      const response = await watchlistService.getWatchlist()
      setWatchlist(response.data.watchlist)
    } catch (error) {
      toast.error('Failed to fetch watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      await watchlistService.removeFromWatchlist(id)
      setWatchlist(watchlist.filter(item => item._id !== id))
      toast.success('Removed from watchlist')
    } catch (error) {
      toast.error('Failed to remove from watchlist')
    }
  }

  const handleMarkWatched = async (id, watched) => {
    try {
      await watchlistService.updateWatchStatus(id, !watched)
      setWatchlist(
        watchlist.map(item =>
          item._id === id ? { ...item, watched: !watched } : item
        )
      )
      toast.success(watched ? 'Marked as unwatched' : 'Marked as watched')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

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
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          My Watchlist
        </h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your watchlist is empty
            </p>
            <Link to="/mood-selection" className="btn-primary">
              Find Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card relative"
              >
                <Link to={`/movie/${item.movie?.tmdbId || item.movie?._id}`}>
                  {item.movie?.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.movie.posterPath}`}
                      alt={item.movie.title}
                      className="w-full h-64 object-cover mb-4 rounded"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 rounded">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
                    {item.movie?.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleMarkWatched(item._id, item.watched)}
                    className={`p-2 rounded ${
                      item.watched
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <FiCheck />
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 rounded bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
