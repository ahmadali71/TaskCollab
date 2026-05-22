// src/pages/Milestones.tsx - Milestones Tracking Page
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, Calendar, CheckCircle2, Circle, Clock, Flag, 
  Plus, Target, Trophy, Star, Sparkles, TrendingUp,
  Users, Gift, Rocket, Zap
} from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  completedDate?: string
  status: 'completed' | 'in-progress' | 'pending'
  category: string
  points: number
  assignedTo: string[]
}

export default function Milestones() {
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Complete Dashboard Redesign',
      description: 'Implement new dashboard with analytics',
      dueDate: '2024-05-30',
      status: 'completed',
      category: 'Product',
      points: 100,
      assignedTo: ['Alice', 'Bob'],
      completedDate: '2024-05-28'
    },
    {
      id: '2',
      title: 'Launch Mobile App Beta',
      description: 'Release beta version for testing',
      dueDate: '2024-06-15',
      status: 'in-progress',
      category: 'Engineering',
      points: 150,
      assignedTo: ['Charlie', 'David', 'Eve']
    },
    {
      id: '3',
      title: 'Reach 10K Users',
      description: 'Achieve 10,000 active users',
      dueDate: '2024-07-31',
      status: 'pending',
      category: 'Growth',
      points: 200,
      assignedTo: ['Frank', 'Grace']
    },
  ])

  const getStatusConfig = (status: string) => {
    const config = {
      completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Completed' },
      'in-progress': { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'In Progress' },
      pending: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700', label: 'Pending' },
    }
    return config[status as keyof typeof config] || config.pending
  }

  const totalPoints = milestones.reduce((sum, m) => sum + m.points, 0)
  const earnedPoints = milestones.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.points, 0)

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Milestones</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your team's achievements and progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Total Milestones</p>
          <p className="text-2xl font-bold">{milestones.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-2xl font-bold">{milestones.filter(m => m.status === 'completed').length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">In Progress</p>
          <p className="text-2xl font-bold">{milestones.filter(m => m.status === 'in-progress').length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Points Earned</p>
          <p className="text-2xl font-bold">{earnedPoints}/{totalPoints}</p>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const StatusIcon = getStatusConfig(milestone.status).icon
            const statusConfig = getStatusConfig(milestone.status)
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row md:items-start gap-4"
              >
                <div className={`relative z-10 w-16 h-16 rounded-full ${statusConfig.bg} flex items-center justify-center flex-shrink-0 mx-auto md:mx-0`}>
                  <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
                </div>
                
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-gray-400">{milestone.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">{milestone.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-500">{milestone.points}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                      <div className="text-center">
                        <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">
                          {milestone.status === 'completed' 
                            ? `Completed ${new Date(milestone.completedDate!).toLocaleDateString()}`
                            : `Due ${new Date(milestone.dueDate).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {milestone.assignedTo.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div className="flex -space-x-2">
                        {milestone.assignedTo.map((person, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800">
                            {person[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Achievement Banner */}
      {earnedPoints > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Great Progress!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You've earned {earnedPoints} points from completed milestones. Keep up the momentum!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}