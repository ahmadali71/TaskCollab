// src/pages/Activity.tsx - Activity Feed Page
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Activity as ActivityIcon, Filter, Search, Calendar,
  CheckCircle2, Plus, Edit, Trash2, MessageSquare,
  User, Clock, GitBranch, Star, Flag, RefreshCw,
  Eye, EyeOff, Download, ChevronDown, Bell,
  BellOff, MoreVertical, Users, FolderPlus,
  FileText, Link as LinkIcon, ThumbsUp, Share2,
  Award, Zap, TrendingUp, Calendar as CalendarIcon,
  Filter as FilterIcon, X, Circle, AlertCircle,
  Sun, Moon, Heart, Sparkles, Database, BarChart3
} from 'lucide-react'

// Types
interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'task_updated' | 'comment_added' | 
         'status_change' | 'member_added' | 'file_uploaded' | 'project_created' |
         'task_deleted' | 'task_archived' | 'comment_deleted' | 'milestone_reached' |
         'badge_earned' | 'integration_connected'
  user: { 
    name: string; 
    avatar: string;
    email?: string;
    role?: string;
  }
  action: string
  target: string
  targetUrl: string
  details: string
  timestamp: string
  timestampDate: Date
  project?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  tags?: string[]
  mentions?: string[]
  attachments?: { name: string; size: string; type: string }[]
  likes?: number
  comments?: number
}

interface ActivityStats {
  total: number
  byType: Record<string, number>
  byProject: Record<string, number>
  byUser: Record<string, number>
  mostActiveHour: number
  averageDaily: number
  totalLikes: number
  engagement: number
}

// Activity Card Component
const ActivityCard: React.FC<{ 
  activity: ActivityItem; 
  index: number; 
  onLike?: (id: string) => void; 
  onShare?: (id: string) => void;
  darkMode?: boolean;
}> = ({ 
  activity, 
  index, 
  onLike,
  onShare,
  darkMode 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(activity.likes || 0)

  const getActivityIcon = (type: string) => {
    const config: Record<string, { bg: string; darkBg: string; icon: React.ElementType; color: string; darkColor: string; gradient: string }> = {
      task_created: { bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900/30', icon: Plus, color: 'text-blue-600', darkColor: 'dark:text-blue-400', gradient: 'from-blue-500 to-blue-600' },
      task_completed: { bg: 'bg-green-100', darkBg: 'dark:bg-green-900/30', icon: CheckCircle2, color: 'text-green-600', darkColor: 'dark:text-green-400', gradient: 'from-green-500 to-green-600' },
      task_updated: { bg: 'bg-yellow-100', darkBg: 'dark:bg-yellow-900/30', icon: Edit, color: 'text-yellow-600', darkColor: 'dark:text-yellow-400', gradient: 'from-yellow-500 to-yellow-600' },
      task_deleted: { bg: 'bg-red-100', darkBg: 'dark:bg-red-900/30', icon: Trash2, color: 'text-red-600', darkColor: 'dark:text-red-400', gradient: 'from-red-500 to-red-600' },
      comment_added: { bg: 'bg-purple-100', darkBg: 'dark:bg-purple-900/30', icon: MessageSquare, color: 'text-purple-600', darkColor: 'dark:text-purple-400', gradient: 'from-purple-500 to-purple-600' },
      status_change: { bg: 'bg-orange-100', darkBg: 'dark:bg-orange-900/30', icon: RefreshCw, color: 'text-orange-600', darkColor: 'dark:text-orange-400', gradient: 'from-orange-500 to-orange-600' },
      member_added: { bg: 'bg-indigo-100', darkBg: 'dark:bg-indigo-900/30', icon: User, color: 'text-indigo-600', darkColor: 'dark:text-indigo-400', gradient: 'from-indigo-500 to-indigo-600' },
      file_uploaded: { bg: 'bg-pink-100', darkBg: 'dark:bg-pink-900/30', icon: Download, color: 'text-pink-600', darkColor: 'dark:text-pink-400', gradient: 'from-pink-500 to-pink-600' },
      project_created: { bg: 'bg-teal-100', darkBg: 'dark:bg-teal-900/30', icon: Flag, color: 'text-teal-600', darkColor: 'dark:text-teal-400', gradient: 'from-teal-500 to-teal-600' },
      badge_earned: { bg: 'bg-yellow-100', darkBg: 'dark:bg-yellow-900/30', icon: Award, color: 'text-yellow-600', darkColor: 'dark:text-yellow-400', gradient: 'from-yellow-500 to-yellow-600' },
      milestone_reached: { bg: 'bg-green-100', darkBg: 'dark:bg-green-900/30', icon: TrendingUp, color: 'text-green-600', darkColor: 'dark:text-green-400', gradient: 'from-green-500 to-green-600' },
    }
    const c = config[type] || config.task_updated
    const Icon = c.icon
    return { 
      bg: c.bg, 
      darkBg: c.darkBg,
      icon: <Icon className={`w-4 h-4 ${c.color} ${c.darkColor}`} />, 
      color: c.color, 
      darkColor: c.darkColor,
      gradient: c.gradient 
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  const { bg, darkBg, icon, color, darkColor } = getActivityIcon(activity.type)
  
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    const intervals = {
      year: 31536000, month: 2592000, week: 604800, day: 86400,
      hour: 3600, minute: 60, second: 1
    }
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit)
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`
      }
    }
    return 'just now'
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(activity.id)
  }

  const handleShare = () => {
    onShare?.(activity.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ x: 4 }}
      className="relative group"
    >
      <div className="flex items-start space-x-4">
        {/* Timeline Dot with Pulse Animation */}
        <div className="relative">
          <div className={`relative z-10 w-10 h-10 rounded-full ${bg} ${darkBg} flex items-center justify-center flex-shrink-0 ring-4 ring-white dark:ring-gray-800 shadow-md transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          {index === 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500 opacity-50"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    {activity.user.avatar}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{activity.user.name}</span>
                  {activity.user.role && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">({activity.user.role})</span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(activity.timestampDate)}</span>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-medium text-gray-900 dark:text-white">{activity.action}</span>{' '}
                <Link to={activity.targetUrl} className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline">
                  {activity.target}
                </Link>
              </p>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{activity.details}</p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={handleLike}
                className={`p-1.5 rounded-lg transition-all ${
                  isLiked 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/30' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
              </button>
              {likeCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{likeCount}</span>
              )}
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {activity.project && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                <FolderPlus className="w-3 h-3" />
                {activity.project}
              </span>
            )}
            {activity.priority && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getPriorityColor(activity.priority)}`}>
                <AlertCircle className="w-3 h-3" />
                {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)} Priority
              </span>
            )}
            {activity.tags?.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                #{tag}
              </span>
            ))}
          </div>

          {/* Expandable Details */}
          {(activity.mentions?.length || activity.attachments?.length) && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                {isExpanded ? 'Show less' : 'Show more details'}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                      {activity.mentions && activity.mentions.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Mentioned: {activity.mentions.join(', ')}
                          </span>
                        </div>
                      )}
                      {activity.attachments && activity.attachments.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Attachments:</span>
                          {activity.attachments.map(att => (
                            <div key={att.name} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <FileText className="w-3 h-3" />
                              <span>{att.name}</span>
                              <span className="text-gray-400 dark:text-gray-500">({att.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Timestamp */}
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            {new Date(activity.timestampDate).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Stats Cards Component
const StatsCards: React.FC<{ stats: ActivityStats; darkMode?: boolean }> = ({ stats, darkMode }) => {
  const statsData = [
    { label: 'Total Activities', value: stats.total, icon: ActivityIcon, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Task Completions', value: stats.byType['task_completed'] || 0, icon: CheckCircle2, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
    { label: 'Comments', value: stats.byType['comment_added'] || 0, icon: MessageSquare, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Projects Created', value: stats.byType['project_created'] || 0, icon: Flag, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/30' },
    { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'from-red-500 to-red-600', bg: 'bg-red-50 dark:bg-red-900/30' },
    { label: 'Engagement', value: `${stats.engagement}%`, icon: BarChart3, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/30' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsData.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
        >
          <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// Filter Drawer Component
const FilterDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
  filters: any
  onFilterChange: (filters: any) => void
  darkMode?: boolean
}> = ({ isOpen, onClose, filters, onFilterChange, darkMode }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const activityTypes = [
    'task_created', 'task_completed', 'task_updated', 'comment_added',
    'status_change', 'member_added', 'file_uploaded', 'project_created',
    'badge_earned', 'milestone_reached'
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <FilterIcon className="w-5 h-5" />
                Filters
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Date Range</label>
                <div className="space-y-2">
                  {['Today', 'This Week', 'This Month', 'This Year', 'All Time'].map(range => (
                    <button
                      key={range}
                      onClick={() => setLocalFilters({ ...localFilters, dateRange: range.toLowerCase().replace(' ', '_') })}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all ${
                        localFilters.dateRange === range.toLowerCase().replace(' ', '_')
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{range}</span>
                      {localFilters.dateRange === range.toLowerCase().replace(' ', '_') && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Types */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Activity Types</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activityTypes.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.types.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalFilters({ ...localFilters, types: [...localFilters.types, type] })
                          } else {
                            setLocalFilters({ ...localFilters, types: localFilters.types.filter((t: string) => t !== type) })
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{type.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                  onClick={() => onFilterChange(localFilters)}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    const resetFilters = { dateRange: 'all_time', types: [] }
                    setLocalFilters(resetFilters)
                    onFilterChange(resetFilters)
                  }}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Main Component
export default function Activity() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ dateRange: 'all_time', types: [] as string[] })
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [stats, setStats] = useState<ActivityStats>({
    total: 0,
    byType: {},
    byProject: {},
    byUser: {},
    mostActiveHour: 0,
    averageDaily: 0,
    totalLikes: 0,
    engagement: 0
  })

  useEffect(() => {
    // Simulate API call with enhanced data
    setTimeout(() => {
      const mockActivities: ActivityItem[] = [
        { 
          id: '1', 
          type: 'task_completed', 
          user: { name: 'Alice Johnson', avatar: 'AJ', role: 'Lead Designer', email: 'alice@taskcollab.com' }, 
          action: 'completed task', 
          target: 'Fix mobile layout bugs', 
          targetUrl: '/tasks/4', 
          details: 'Marked as done after testing on iOS and Android. All 12 test cases passed successfully.', 
          timestamp: '2024-03-15T10:30:00',
          timestampDate: new Date(Date.now() - 5 * 60 * 1000),
          project: 'Mobile App',
          priority: 'high',
          tags: ['mobile', 'ui', 'bugfix'],
          mentions: ['@bobsmith', '@charlie'],
          likes: 5,
          comments: 2
        },
        { 
          id: '2', 
          type: 'comment_added', 
          user: { name: 'Bob Smith', avatar: 'BS', role: 'Backend Developer' }, 
          action: 'commented on', 
          target: 'API documentation', 
          targetUrl: '/tasks/3', 
          details: 'Great work! Need to add rate limiting section and authentication examples.', 
          timestamp: '2024-03-15T09:15:00',
          timestampDate: new Date(Date.now() - 15 * 60 * 1000),
          project: 'API Development',
          tags: ['api', 'documentation', 'feedback'],
          likes: 3,
          comments: 1
        },
        { 
          id: '3', 
          type: 'status_change', 
          user: { name: 'Charlie Brown', avatar: 'CB', role: 'Project Manager' }, 
          action: 'moved', 
          target: 'Database optimization', 
          targetUrl: '/tasks/6', 
          details: 'From Backlog → In Progress', 
          timestamp: '2024-03-15T08:45:00',
          timestampDate: new Date(Date.now() - 30 * 60 * 1000),
          project: 'API Development',
          priority: 'urgent',
          likes: 2
        },
        { 
          id: '4', 
          type: 'task_created', 
          user: { name: 'Alice Johnson', avatar: 'AJ', role: 'Lead Designer' }, 
          action: 'created task', 
          target: 'Design system update', 
          targetUrl: '/tasks/11', 
          details: 'Priority: High | Due: June 5, 2026', 
          timestamp: '2024-03-15T08:00:00',
          timestampDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
          project: 'Dashboard Redesign',
          priority: 'high',
          tags: ['design', 'ui', 'system'],
          likes: 4
        },
        { 
          id: '5', 
          type: 'member_added', 
          user: { name: 'Eve Wilson', avatar: 'EW', role: 'Team Lead' }, 
          action: 'added', 
          target: 'Diana Prince to Mobile App project', 
          targetUrl: '/projects/3', 
          details: 'Role: QA Engineer', 
          timestamp: '2024-03-15T06:30:00',
          timestampDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
          project: 'Mobile App',
          likes: 1
        },
        { 
          id: '6', 
          type: 'file_uploaded', 
          user: { name: 'Bob Smith', avatar: 'BS', role: 'Backend Developer' }, 
          action: 'uploaded file to', 
          target: 'API documentation', 
          targetUrl: '/tasks/3', 
          details: 'api-spec-v2.yaml (245 KB)', 
          timestamp: '2024-03-15T05:00:00',
          timestampDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
          project: 'API Development',
          attachments: [{ name: 'api-spec-v2.yaml', size: '245 KB', type: 'yaml' }],
          likes: 2
        },
        { 
          id: '7', 
          type: 'task_updated', 
          user: { name: 'Alice Johnson', avatar: 'AJ', role: 'Lead Designer' }, 
          action: 'updated', 
          target: 'Dashboard redesign', 
          targetUrl: '/tasks/1', 
          details: 'Changed due date from May 30 → May 25', 
          timestamp: '2024-03-15T04:00:00',
          timestampDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
          project: 'Dashboard Redesign',
          likes: 0
        },
        { 
          id: '8', 
          type: 'project_created', 
          user: { name: 'Eve Wilson', avatar: 'EW', role: 'Team Lead' }, 
          action: 'created project', 
          target: 'Q3 Planning', 
          targetUrl: '/projects/5', 
          details: 'Team: 4 members | Timeline: Jul-Sep 2026', 
          timestamp: '2024-03-14T20:00:00',
          timestampDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          project: 'Q3 Planning',
          likes: 3,
          comments: 1
        },
        { 
          id: '9', 
          type: 'task_completed', 
          user: { name: 'Diana Prince', avatar: 'DP', role: 'QA Engineer' }, 
          action: 'completed task', 
          target: 'Test suite update', 
          targetUrl: '/tasks/12', 
          details: 'All 245 tests passing', 
          timestamp: '2024-03-14T18:30:00',
          timestampDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          project: 'Mobile App',
          tags: ['testing', 'qa', 'automation'],
          likes: 6,
          comments: 3
        },
        { 
          id: '10', 
          type: 'comment_added', 
          user: { name: 'Charlie Brown', avatar: 'CB', role: 'Project Manager' }, 
          action: 'commented on', 
          target: 'Performance testing', 
          targetUrl: '/tasks/10', 
          details: 'Load test results look promising. 200ms avg response.', 
          timestamp: '2024-03-14T15:00:00',
          timestampDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          project: 'API Development',
          likes: 2
        },
        { 
          id: '11', 
          type: 'badge_earned', 
          user: { name: 'Alice Johnson', avatar: 'AJ', role: 'Lead Designer' }, 
          action: 'earned badge', 
          target: 'Task Master', 
          targetUrl: '/profile', 
          details: 'Completed 100 tasks!', 
          timestamp: '2024-03-14T10:00:00',
          timestampDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          tags: ['achievement', 'milestone'],
          likes: 12,
          comments: 2
        },
        { 
          id: '12', 
          type: 'milestone_reached', 
          user: { name: 'Team', avatar: 'TM', role: 'Team' }, 
          action: 'reached milestone', 
          target: '500 tasks completed', 
          targetUrl: '/dashboard', 
          details: 'Team achievement unlocked!', 
          timestamp: '2024-03-13T12:00:00',
          timestampDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          project: 'All Projects',
          likes: 8,
          comments: 4
        }
      ]
      
      setActivities(mockActivities)
      
      // Calculate stats
      const byType: Record<string, number> = {}
      const byProject: Record<string, number> = {}
      const byUser: Record<string, number> = {}
      let totalLikes = 0
      
      mockActivities.forEach(activity => {
        byType[activity.type] = (byType[activity.type] || 0) + 1
        if (activity.project) byProject[activity.project] = (byProject[activity.project] || 0) + 1
        byUser[activity.user.name] = (byUser[activity.user.name] || 0) + 1
        totalLikes += activity.likes || 0
      })
      
      const engagement = mockActivities.length > 0 
        ? Math.round((mockActivities.filter(a => (a.likes || 0) > 0).length / mockActivities.length) * 100)
        : 0
      
      setStats({
        total: mockActivities.length,
        byType,
        byProject,
        byUser,
        mostActiveHour: 14,
        averageDaily: Math.round(mockActivities.length / 3),
        totalLikes,
        engagement
      })
      
      setIsLoading(false)
    }, 800)
  }, [])

  const filteredActivities = useMemo(() => {
    let filtered = activities
    
    // Type filter
    if (filter !== 'all') {
      filtered = filtered.filter(a => a.type.includes(filter))
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(a => 
        a.user.name.toLowerCase().includes(query) ||
        a.target.toLowerCase().includes(query) ||
        a.details.toLowerCase().includes(query) ||
        a.project?.toLowerCase().includes(query) ||
        a.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Date range filter
    if (filters.dateRange !== 'all_time') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      const thisYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      
      filtered = filtered.filter(a => {
        const activityDate = new Date(a.timestampDate)
        switch(filters.dateRange) {
          case 'today': return activityDate >= today
          case 'this_week': return activityDate >= thisWeek
          case 'this_month': return activityDate >= thisMonth
          case 'this_year': return activityDate >= thisYear
          default: return true
        }
      })
    }
    
    // Types filter
    if (filters.types.length > 0) {
      filtered = filtered.filter(a => filters.types.includes(a.type))
    }
    
    return filtered
  }, [activities, filter, searchQuery, filters])

  const handleLike = (id: string) => {
    console.log(`Liked activity ${id}`)
  }

  const handleShare = (id: string) => {
    console.log(`Shared activity ${id}`)
    // Implement share functionality
    navigator.clipboard.writeText(`${window.location.origin}/activity/${id}`)
    alert('Link copied to clipboard!')
  }

  const toggleNotifications = () => {
    setNotificationEnabled(!notificationEnabled)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-400 mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">Loading activity feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
      </button>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Activity Feed
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time updates across all your projects</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-400"
            >
              {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm font-medium">Stats</span>
            </button>
            
            <button
              onClick={toggleNotifications}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                notificationEnabled 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {notificationEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {notificationEnabled ? 'Notifications On' : 'Notifications Off'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {showStats && <StatsCards stats={stats} darkMode={darkMode} />}

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by user, task, project, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="flex rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
              {['all', 'task', 'comment', 'project', 'member'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-400"
            >
              <FilterIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {(filters.dateRange !== 'all_time' || filters.types.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800" />
          
          <div className="space-y-6">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  onLike={handleLike}
                  onShare={handleShare}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
              >
                <ActivityIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No activity found</h3>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setFilter('all')
                    setSearchQuery('')
                    setFilters({ dateRange: 'all_time', types: [] })
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Load More Button */}
        {filteredActivities.length > 0 && filteredActivities.length === activities.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center pt-4"
          >
            <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Load More Activity
            </button>
          </motion.div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
        darkMode={darkMode}
      />
    </div>
  )
}