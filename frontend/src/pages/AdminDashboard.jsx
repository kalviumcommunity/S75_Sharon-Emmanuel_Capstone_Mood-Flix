import { useState, useEffect } from 'react'
import { adminService } from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiUsers, FiFilm, FiStar, FiMessageSquare } from 'react-icons/fi'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers()
      ])
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users)
    } catch (error) {
      toast.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
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
          Admin Dashboard
        </h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <FiUsers className="text-3xl text-primary-600 mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Total Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <FiFilm className="text-3xl text-primary-600 mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalWatchlists}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Watchlists</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <FiStar className="text-3xl text-primary-600 mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalRatings}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Ratings</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <FiMessageSquare className="text-3xl text-primary-600 mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalFeedback}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Feedback</p>
            </motion.div>
          </div>
        )}

        {/* Users Table */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          user.role === 'admin'
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
