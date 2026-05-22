// src/pages/NotFound.tsx - Enhanced 404 Page
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-9xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <Link to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto justify-center">
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <Link to="/tasks"
            className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl border hover:bg-gray-50 font-medium transition-all w-full sm:w-auto justify-center">
            <Search className="w-5 h-5" />
            <span>Browse Tasks</span>
          </Link>
          <button onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl border hover:bg-gray-50 font-medium transition-all w-full sm:w-auto justify-center">
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-12 text-6xl"
        >
          🗺️
        </motion.div>
      </div>
    </div>
  )
}