import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiSmile, FiFrown, FiZap, FiCoffee, 
  FiHeart, FiAlertCircle, FiClock, 
  FiCompass, FiActivity 
} from 'react-icons/fi'
import { FaBrain } from 'react-icons/fa'

const moods = [
  { id: 'happy', label: 'Happy', icon: FiSmile, emoji: '😊' },
  { id: 'sad', label: 'Sad', icon: FiFrown, emoji: '😢' },
  { id: 'excited', label: 'Excited', icon: FiZap, emoji: '🤩' },
  { id: 'relaxed', label: 'Relaxed', icon: FiCoffee, emoji: '😌' },
  { id: 'romantic', label: 'Romantic', icon: FiHeart, emoji: '💕' },
  { id: 'scared', label: 'Scared', icon: FiAlertCircle, emoji: '😱' },
  { id: 'nostalgic', label: 'Nostalgic', icon: FiClock, emoji: '🕰️' },
  { id: 'adventurous', label: 'Adventurous', icon: FiCompass, emoji: '🗺️' },
  { id: 'thoughtful', label: 'Thoughtful', icon: FaBrain, emoji: '🤔' },
  { id: 'energetic', label: 'Energetic', icon: FiActivity, emoji: '⚡' }
]

const MoodSelection = () => {
  const [currentMood, setCurrentMood] = useState(null)
  const [desiredMood, setDesiredMood] = useState(null)
  const navigate = useNavigate()

  const handleGetRecommendations = () => {
    if (!currentMood && !desiredMood) {
      alert('Please select at least one mood')
      return
    }

    const params = new URLSearchParams()
    if (currentMood) params.append('currentMood', currentMood)
    if (desiredMood) params.append('desiredMood', desiredMood)

    navigate(`/recommendations?${params.toString()}`)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            How are you feeling?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select your current mood and/or desired mood to get personalized recommendations
          </p>
        </motion.div>

        {/* Current Mood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Current Mood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((mood) => {
              const Icon = mood.icon
              const isSelected = currentMood === mood.id
              return (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMood(mood.id)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {mood.label}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Desired Mood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Desired Mood (Optional)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((mood) => {
              const Icon = mood.icon
              const isSelected = desiredMood === mood.id
              return (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDesiredMood(mood.id)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {mood.label}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Get Recommendations Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={handleGetRecommendations}
            className="btn-primary text-lg px-8 py-3"
          >
            Get Recommendations
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default MoodSelection
