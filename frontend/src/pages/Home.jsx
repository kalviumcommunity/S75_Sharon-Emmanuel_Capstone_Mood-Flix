import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { FiFilm, FiHeart, FiStar } from 'react-icons/fi'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center text-white overflow-hidden">
        
        {/* Background Image */}
        <img
          src="/images/image.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Movies That Match Your Mood
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              AI-powered recommendations based on how you feel
            </p>

            {isAuthenticated ? (
              <Link
                to="/mood-selection"
                className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors text-lg"
              >
                Get Started
              </Link>
            ) : (
              <div className="flex justify-center space-x-4">
                <Link
                  to="/signup"
                  className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors text-lg"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="inline-block border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors text-lg"
                >
                  Login
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose MoodFlix?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card text-center"
            >
              <FiFilm className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mood-Based Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized movie suggestions based on your current or desired mood
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card text-center"
            >
              <FiHeart className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Your Favorites</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build your watchlist and rate movies to improve recommendations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card text-center"
            >
              <FiStar className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optional webcam mood detection for instant recommendations
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
