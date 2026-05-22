// src/pages/Archived.tsx - Archived Items Page
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Archive, RefreshCw, Trash2, Search, Filter,
  Calendar, User, Folder, CheckCircle2, Clock,
  Download, Eye, EyeOff, RotateCcw, X, AlertTriangle,
  ChevronDown, ChevronUp, SortAsc, SortDesc,
  MoreVertical, MessageSquare, Tag, Star, FileText,
  Sun, Moon, Shield, Database, BarChart3, TrendingUp,
  List, Grid3X3
} from 'lucide-react'

interface ArchivedItem {
  id: string
  title: string
  description?: string
  type: 'task' | 'project' | 'goal'
  archivedDate: string
  originalDate: string
  archivedBy: string
  archivedByAvatar: string
  category: string
  tags?: string[]
  comments?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  attachments?: number
  likes?: number
}

// Confirmation Modal
const ConfirmationModal: React.FC<{
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Toast Notification
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: { bg: 'bg-green-500', text: 'text-white', icon: CheckCircle2 },
    error: { bg: 'bg-red-500', text: 'text-white', icon: AlertTriangle },
    info: { bg: 'bg-blue-500', text: 'text-white', icon: Clock }
  }

  const Icon = config[type].icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-4 right-4 z-50 ${config[type].bg} ${config[type].text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{message}</span>
    </motion.div>
  )
}

// Helper component
const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default function Archived() {
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

  const [items, setItems] = useState<ArchivedItem[]>([
    {
      id: '1',
      title: 'Complete Dashboard Design',
      description: 'Design and implement the new dashboard with 3D visualizations',
      type: 'task',
      archivedDate: '2024-05-15',
      originalDate: '2024-03-01',
      archivedBy: 'Alice Johnson',
      archivedByAvatar: 'AJ',
      category: 'Design',
      tags: ['design', 'ui/ux', 'dashboard'],
      comments: 12,
      priority: 'high',
      attachments: 3,
      likes: 24
    },
    {
      id: '2',
      title: 'Q1 Marketing Campaign',
      description: 'Launch marketing campaign for Q1 2024',
      type: 'project',
      archivedDate: '2024-04-30',
      originalDate: '2024-01-10',
      archivedBy: 'Bob Smith',
      archivedByAvatar: 'BS',
      category: 'Marketing',
      tags: ['marketing', 'campaign', 'q1'],
      comments: 8,
      priority: 'medium',
      attachments: 5,
      likes: 15
    },
    {
      id: '3',
      title: 'Increase User Retention',
      description: 'Implement strategies to improve user retention by 20%',
      type: 'goal',
      archivedDate: '2024-05-01',
      originalDate: '2024-01-15',
      archivedBy: 'Charlie Brown',
      archivedByAvatar: 'CB',
      category: 'Product',
      tags: ['retention', 'growth', 'analytics'],
      comments: 15,
      priority: 'high',
      attachments: 2,
      likes: 32
    },
    {
      id: '4',
      title: 'Fix Login Bug',
      description: 'Resolve authentication issue on mobile devices',
      type: 'task',
      archivedDate: '2024-05-10',
      originalDate: '2024-04-01',
      archivedBy: 'Diana Prince',
      archivedByAvatar: 'DP',
      category: 'Engineering',
      tags: ['bug', 'authentication', 'mobile'],
      comments: 5,
      priority: 'urgent',
      attachments: 1,
      likes: 8
    },
    {
      id: '5',
      title: 'Mobile App Redesign',
      description: 'Complete overhaul of mobile application UI',
      type: 'project',
      archivedDate: '2024-05-20',
      originalDate: '2024-02-15',
      archivedBy: 'Eve Wilson',
      archivedByAvatar: 'EW',
      category: 'Design',
      tags: ['mobile', 'redesign', 'ui'],
      comments: 23,
      priority: 'high',
      attachments: 8,
      likes: 45
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type' | 'likes' | 'comments'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState<{ type: string; itemId?: string } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list')

  const getTypeIcon = (type: string) => {
    const icons = {
      task: CheckCircle2,
      project: Folder,
      goal: TargetIcon
    }
    return icons[type as keyof typeof icons] || Archive
  }

  const getPriorityColor = (priority?: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }
  }

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = filterType === 'all' || item.type === filterType
      const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
      return matchesSearch && matchesType && matchesPriority
    })

    // Sort items
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.archivedDate).getTime()
        const dateB = new Date(b.archivedDate).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      } else if (sortBy === 'name') {
        return sortOrder === 'desc' 
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      } else if (sortBy === 'likes') {
        return sortOrder === 'desc'
          ? (b.likes || 0) - (a.likes || 0)
          : (a.likes || 0) - (b.likes || 0)
      } else if (sortBy === 'comments') {
        return sortOrder === 'desc'
          ? (b.comments || 0) - (a.comments || 0)
          : (a.comments || 0) - (b.comments || 0)
      } else {
        return sortOrder === 'desc'
          ? b.type.localeCompare(a.type)
          : a.type.localeCompare(b.type)
      }
    })

    return filtered
  }, [items, searchQuery, filterType, filterPriority, sortBy, sortOrder])

  const handleRestore = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
    setToast({ message: 'Item restored successfully!', type: 'success' })
    setSelectedItems(prev => prev.filter(id => id !== itemId))
  }

  const handlePermanentDelete = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
    setToast({ message: 'Item permanently deleted.', type: 'success' })
    setSelectedItems(prev => prev.filter(id => id !== itemId))
  }

  const handleRestoreAll = () => {
    if (selectedItems.length === 0) {
      setToast({ message: 'No items selected to restore', type: 'info' })
      return
    }
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setToast({ message: `${selectedItems.length} items restored successfully!`, type: 'success' })
    setSelectedItems([])
  }

  const handleEmptyTrash = () => {
    setItems([])
    setToast({ message: 'All items permanently deleted.', type: 'success' })
    setSelectedItems([])
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleExpandItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  const stats = {
    total: items.length,
    tasks: items.filter(i => i.type === 'task').length,
    projects: items.filter(i => i.type === 'project').length,
    goals: items.filter(i => i.type === 'goal').length,
    totalComments: items.reduce((sum, i) => sum + (i.comments || 0), 0),
    totalLikes: items.reduce((sum, i) => sum + (i.likes || 0), 0),
    urgentItems: items.filter(i => i.priority === 'urgent').length
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

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <ConfirmationModal
            isOpen={true}
            title={showConfirmation.type === 'restore' ? 'Restore Item' : 'Permanently Delete'}
            message={showConfirmation.type === 'restore' 
              ? 'Are you sure you want to restore this item? It will reappear in your active items.'
              : 'Are you sure you want to permanently delete this item? This action cannot be undone.'}
            onConfirm={() => {
              if (showConfirmation.type === 'restore' && showConfirmation.itemId) {
                handleRestore(showConfirmation.itemId)
              } else if (showConfirmation.type === 'delete' && showConfirmation.itemId) {
                handlePermanentDelete(showConfirmation.itemId)
              } else if (showConfirmation.type === 'empty') {
                handleEmptyTrash()
              }
              setShowConfirmation(null)
            }}
            onCancel={() => setShowConfirmation(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
              <Archive className="w-7 h-7" />
              Archived Items
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Restore or permanently delete archived items</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-400"
            >
              {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">Stats</span>
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleRestoreAll}
                className="flex items-center space-x-2 px-4 py-2 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore Selected ({selectedItems.length})</span>
              </button>
            )}
            <button
              onClick={() => items.length > 0 && setShowConfirmation({ type: 'empty' })}
              disabled={items.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Trash</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3"
          >
            {[
              { label: 'Total Archived', value: stats.total, icon: Archive, color: 'from-blue-500 to-blue-600' },
              { label: 'Tasks', value: stats.tasks, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
              { label: 'Projects', value: stats.projects, icon: Folder, color: 'from-purple-500 to-purple-600' },
              { label: 'Goals', value: stats.goals, icon: TargetIcon, color: 'from-orange-500 to-orange-600' },
              { label: 'Comments', value: stats.totalComments, icon: MessageSquare, color: 'from-pink-500 to-pink-600' },
              { label: 'Likes', value: stats.totalLikes, icon: TrendingUp, color: 'from-red-500 to-red-600' },
              { label: 'Urgent', value: stats.urgentItems, icon: AlertTriangle, color: 'from-yellow-500 to-yellow-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-2`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Search, Filter, and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, description, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            >
              <option value="all">All Types</option>
              <option value="task">Tasks</option>
              <option value="project">Projects</option>
              <option value="goal">Goals</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="likes">Sort by Likes</option>
              <option value="comments">Sort by Comments</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              {sortOrder === 'desc' ? <SortDesc className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <SortAsc className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
            </button>

            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-3 transition-colors ${viewMode === 'compact' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Archived Items List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAndSortedItems.map((item, index) => {
              const Icon = getTypeIcon(item.type)
              const isSelected = selectedItems.includes(item.id)
              const isExpanded = expandedItem === item.id
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all ${
                    isSelected ? 'border-blue-500 shadow-md' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Checkbox */}
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>

                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          item.type === 'task' ? 'bg-green-100 dark:bg-green-900/30' :
                          item.type === 'project' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            item.type === 'task' ? 'text-green-600 dark:text-green-400' :
                            item.type === 'project' ? 'text-purple-600 dark:text-purple-400' : 'text-orange-600 dark:text-orange-400'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                            {item.priority && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                                {item.priority.toUpperCase()}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">{item.type}</span>
                          </div>
                          
                          {viewMode !== 'compact' && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Archived: {new Date(item.archivedDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              by {item.archivedBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Folder className="w-3 h-3" />
                              {item.category}
                            </span>
                            {item.comments && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {item.comments} comments
                              </span>
                            )}
                            {item.likes && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {item.likes} likes
                              </span>
                            )}
                            {item.attachments && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {item.attachments} files
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && viewMode !== 'compact' && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full flex items-center gap-1">
                                  <Tag className="w-2 h-2" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Additional Details</h4>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Original Created Date</p>
                                      <p className="text-gray-700 dark:text-gray-300">{new Date(item.originalDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Archived By</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                                          {item.archivedByAvatar}
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300">{item.archivedBy}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleExpandItem(item.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title={isExpanded ? 'Show less' : 'Show more'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                          </button>
                          <button
                            onClick={() => setShowConfirmation({ type: 'restore', itemId: item.id })}
                            className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-600 dark:text-green-400"
                            title="Restore"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowConfirmation({ type: 'delete', itemId: item.id })}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          >
            <Archive className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No archived items found</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {searchQuery || filterType !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Archived items will appear here when you archive them'}
            </p>
            {(searchQuery || filterType !== 'all' || filterPriority !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterType('all')
                  setFilterPriority('all')
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Selected Items Bar */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-4 z-50"
          >
            <span className="text-sm">{selectedItems.length} item(s) selected</span>
            <button
              onClick={() => setSelectedItems([])}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-700" />
            <button
              onClick={handleRestoreAll}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restore All
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}