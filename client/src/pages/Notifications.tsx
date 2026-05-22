// src/pages/Notifications.tsx - Comprehensive Notifications Center with Dark/Light Mode
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Bell, CheckCircle2, AlertTriangle, Info, X, Trash2,
  MessageSquare, User, Calendar, Star, Check, Filter,
  Search, Settings, RefreshCw, Eye, EyeOff, Clock,
  Tag, BellRing, BellOff, Archive, Download, ChevronDown,
  MoreHorizontal, Reply, Flag, Volume2, VolumeX,
  Sun, Moon, Sparkles, Award, TrendingUp, Zap,
  Shield, Lock, Unlock, Gift, Coffee, Heart
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  timestampISO: string
  read: boolean
  archived: boolean
  category: 'task' | 'comment' | 'team' | 'system' | 'reminder' | 'mention'
  actionUrl?: string
  actor?: {
    name: string
    avatar: string
    id: string
  }
  metadata?: {
    taskId?: string
    commentId?: string
    priority?: 'low' | 'medium' | 'high' | 'critical'
  }
}

interface NotificationGroup {
  date: string
  notifications: Notification[]
}

// ============================================
// NOTIFICATION CARD COMPONENT
// ============================================
const NotificationCard: React.FC<{
  notification: Notification
  onMarkAsRead: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onMarkUnread?: (id: string) => void
}> = ({ notification, onMarkAsRead, onArchive, onDelete, onMarkUnread }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
      case 'error':
        return <X className="w-5 h-5 text-red-500 dark:text-red-400" />
      default:
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'task':
        return <CheckCircle2 className="w-3.5 h-3.5" />
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5" />
      case 'team':
        return <User className="w-3.5 h-3.5" />
      case 'reminder':
        return <Calendar className="w-3.5 h-3.5" />
      case 'mention':
        return <Star className="w-3.5 h-3.5" />
      default:
        return <Bell className="w-3.5 h-3.5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
      case 'comment': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
      case 'team': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
      case 'reminder': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
      case 'mention': return 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      default: return ''
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 ${
        !notification.read 
          ? 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/30 to-white dark:from-blue-900/10 dark:to-gray-800' 
          : notification.archived 
            ? 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 opacity-75' 
            : 'hover:shadow-md'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`p-2 rounded-xl transition-colors ${
            !notification.read ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {getIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {notification.title}
              </h3>
              {!notification.read && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  New
                </span>
              )}
              {notification.metadata?.priority && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notification.metadata.priority)}`}>
                  {notification.metadata.priority}
                </span>
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>

            {/* Footer */}
            <div className="flex items-center flex-wrap gap-3">
              {/* Category */}
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                {getCategoryIcon(notification.category)}
                <span className="capitalize">{notification.category}</span>
              </span>

              {/* Actor */}
              {notification.actor && (
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {notification.actor.avatar}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{notification.actor.name}</span>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{notification.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {isHovered && !notification.read && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => onMarkAsRead(notification.id)}
                className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400 transition-colors"
                title="Mark as read"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            )}
            
            {isHovered && notification.read && onMarkUnread && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => onMarkUnread(notification.id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                title="Mark as unread"
              >
                <EyeOff className="w-4 h-4" />
              </motion.button>
            )}

            {isHovered && !notification.archived && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => onArchive(notification.id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </motion.button>
            )}

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-50 py-1"
                  >
                    {notification.actionUrl && (
                      <Link to={notification.actionUrl}>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                          <Reply className="w-4 h-4 text-gray-400" />
                          <span>View Details</span>
                        </button>
                      </Link>
                    )}
                    {!notification.read ? (
                      <button onClick={() => { onMarkAsRead(notification.id); setShowMenu(false) }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>Mark as Read</span>
                      </button>
                    ) : onMarkUnread && (
                      <button onClick={() => { onMarkUnread(notification.id); setShowMenu(false) }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                        <EyeOff className="w-4 h-4 text-gray-400" />
                        <span>Mark as Unread</span>
                      </button>
                    )}
                    {!notification.archived && (
                      <button onClick={() => { onArchive(notification.id); setShowMenu(false) }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                        <Archive className="w-4 h-4 text-gray-400" />
                        <span>Archive</span>
                      </button>
                    )}
                    <hr className="my-1 dark:border-gray-700" />
                    <button onClick={() => { onDelete(notification.id); setShowMenu(false) }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-3">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// STATS CARD
// ============================================
const StatsCard: React.FC<{ label: string; value: number; color: string; icon: React.ElementType }> = 
  ({ label, value, color, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )

// ============================================
// MAIN NOTIFICATIONS COMPONENT
// ============================================
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Track dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  // Load notifications
  useEffect(() => {
    loadNotifications()
  }, [])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      refreshNotifications()
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadNotifications = () => {
    setTimeout(() => {
      setNotifications([
        { 
          id: '1', type: 'success', title: 'Task Completed', message: 'Alice completed "Fix mobile layout bugs"', 
          timestamp: '5 minutes ago', timestampISO: new Date(Date.now() - 5 * 60000).toISOString(),
          read: false, archived: false, category: 'task',
          actor: { name: 'Alice', avatar: 'AJ', id: '1' },
          metadata: { taskId: 'task_123', priority: 'high' }
        },
        { 
          id: '2', type: 'info', title: 'New Comment', message: 'Bob commented on "API documentation v2"', 
          timestamp: '15 minutes ago', timestampISO: new Date(Date.now() - 15 * 60000).toISOString(),
          read: false, archived: false, category: 'comment',
          actor: { name: 'Bob', avatar: 'BS', id: '2' },
          actionUrl: '/tasks/t1'
        },
        { 
          id: '3', type: 'warning', title: 'Task Overdue', message: '"Dashboard redesign" is now overdue by 2 days', 
          timestamp: '1 hour ago', timestampISO: new Date(Date.now() - 60 * 60000).toISOString(),
          read: false, archived: false, category: 'task',
          metadata: { taskId: 'ip1', priority: 'critical' }
        },
        { 
          id: '4', type: 'info', title: 'Team Meeting', message: 'Weekly standup tomorrow at 10:00 AM in Meeting Room A', 
          timestamp: '3 hours ago', timestampISO: new Date(Date.now() - 3 * 3600000).toISOString(),
          read: true, archived: false, category: 'reminder'
        },
        { 
          id: '5', type: 'success', title: 'Deployment Success', message: 'Version 2.1.0 deployed to production successfully', 
          timestamp: '5 hours ago', timestampISO: new Date(Date.now() - 5 * 3600000).toISOString(),
          read: true, archived: false, category: 'system'
        },
        { 
          id: '6', type: 'info', title: 'New Member', message: 'Eve Wilson joined the Design team', 
          timestamp: '1 day ago', timestampISO: new Date(Date.now() - 24 * 3600000).toISOString(),
          read: true, archived: false, category: 'team',
          actor: { name: 'Eve Wilson', avatar: 'EW', id: '5' }
        },
        { 
          id: '7', type: 'error', title: 'Build Failed', message: 'CI/CD pipeline failed on main branch - tests failing', 
          timestamp: '1 day ago', timestampISO: new Date(Date.now() - 24 * 3600000).toISOString(),
          read: true, archived: false, category: 'system'
        },
        { 
          id: '8', type: 'info', title: 'You were mentioned', message: 'Charlie mentioned you in "Database optimization" task', 
          timestamp: '2 days ago', timestampISO: new Date(Date.now() - 48 * 3600000).toISOString(),
          read: true, archived: false, category: 'mention',
          actor: { name: 'Charlie', avatar: 'CB', id: '3' },
          actionUrl: '/tasks/d2'
        },
        { 
          id: '9', type: 'warning', title: 'Storage Limit', message: 'Project storage is at 85% capacity', 
          timestamp: '3 days ago', timestampISO: new Date(Date.now() - 72 * 3600000).toISOString(),
          read: false, archived: false, category: 'system'
        },
        { 
          id: '10', type: 'info', title: 'New Feature Release', message: 'Check out the new Kanban board improvements', 
          timestamp: '4 days ago', timestampISO: new Date(Date.now() - 96 * 3600000).toISOString(),
          read: true, archived: true, category: 'system'
        },
      ])
      setIsLoading(false)
    }, 800)
  }

  const refreshNotifications = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newNotification: Notification = {
        id: `new_${Date.now()}`,
        type: 'info',
        title: 'New Update Available',
        message: 'Version 2.2.0 is now available with new features',
        timestamp: 'Just now',
        timestampISO: new Date().toISOString(),
        read: false,
        archived: false,
        category: 'system',
      }
      setNotifications(prev => [newNotification, ...prev])
      setIsLoading(false)
      setLastRefreshed(new Date())
      
      if (soundEnabled) {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscillator.frequency.value = 880
          gainNode.gain.value = 0.1
          oscillator.start()
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5)
          oscillator.stop(audioContext.currentTime + 0.5)
          audioContext.resume()
        } catch (e) {
          console.log('Audio not supported')
        }
      }
    }, 500)
  }

  const getFilteredNotifications = () => {
    let filtered = notifications.filter(n => showArchived ? n.archived : !n.archived)
    
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read)
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read)
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(n => n.category === selectedCategory)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query)
      )
    }
    
    return filtered.sort((a, b) => 
      new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime()
    )
  }

  const groupByDate = (notifications: Notification[]): NotificationGroup[] => {
    const groups: { [key: string]: Notification[] } = {}
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    notifications.forEach(notif => {
      const date = new Date(notif.timestampISO)
      let key = date.toDateString()
      if (key === today) key = 'Today'
      else if (key === yesterday) key = 'Yesterday'
      else key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
      
      if (!groups[key]) groups[key] = []
      groups[key].push(notif)
    })
    
    return Object.entries(groups).map(([date, notifications]) => ({ date, notifications }))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true, read: true } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.read))
  }

  const exportNotifications = () => {
    const data = JSON.stringify(getFilteredNotifications(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredNotifications = getFilteredNotifications()
  const groupedNotifications = groupByDate(filteredNotifications)
  const unreadCount = notifications.filter(n => !n.read && !n.archived).length
  const archivedCount = notifications.filter(n => n.archived).length
  const totalCount = notifications.filter(n => !n.archived).length

  const stats = [
    { label: 'Total', value: totalCount, color: 'bg-blue-500', icon: Bell },
    { label: 'Unread', value: unreadCount, color: 'bg-red-500', icon: BellRing },
    { label: 'Archived', value: archivedCount, color: 'bg-gray-500', icon: Archive },
  ]

  const categories = ['task', 'comment', 'team', 'system', 'reminder', 'mention']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                {unreadCount} unread • {totalCount} total
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
              title={soundEnabled ? "Disable sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg border transition-colors ${
                autoRefresh 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
              title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
            </button>

            {/* Refresh Button */}
            <button 
              onClick={refreshNotifications}
              className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Filter */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
              title="Filter options"
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Export */}
            <button 
              onClick={exportNotifications}
              className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              title="Export"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* EXPANDED FILTERS */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search notifications..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'unread', 'read'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                      filter === f 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Categories:</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-2 py-1 rounded-md text-xs transition-colors ${
                    !selectedCategory 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-2 py-1 rounded-md text-xs transition-colors capitalize ${
                      selectedCategory === cat 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showArchived}
                    onChange={(e) => setShowArchived(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Show archived notifications</span>
                </label>
                
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Mark All Read
                    </button>
                  )}
                  <button 
                    onClick={deleteAllRead}
                    className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Clear Read
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-6">
          {groupedNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <BellOff className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No notifications</h3>
              <p className="text-gray-400 dark:text-gray-500 mt-1">
                {showArchived ? "No archived notifications" : "You're all caught up!"}
              </p>
              {!showArchived && (
                <button 
                  onClick={() => setShowArchived(true)}
                  className="mt-4 px-4 py-2 text-sm text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  View archived
                </button>
              )}
            </motion.div>
          ) : (
            groupedNotifications.map(group => (
              <div key={group.date}>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
                  {group.date}
                </h3>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {group.notifications.map(notification => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onMarkUnread={markAsUnread}
                        onArchive={archiveNotification}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Insights Summary */}
        {filteredNotifications.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Insights</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You have {unreadCount} unread notifications. {notifications.filter(n => n.category === 'mention').length} mentions await your attention.
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        )}

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span>Last refreshed: {lastRefreshed.toLocaleTimeString()}</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Add CSS for spin-slow animation
const style = document.createElement('style')
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`
document.head.appendChild(style)