// src/pages/Trash.tsx - Comprehensive Trash/Deleted Items Page
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, RotateCcw, AlertTriangle, Search,
  Calendar, User, FileText, CheckCircle2, X,
  Clock, Folder, Archive, RefreshCw, Filter,
  ChevronDown, ChevronUp, Download, Mail,
  Info, HelpCircle, Shield, Database, HardDrive,
  Target as TargetIcon, Layers, Briefcase, Sparkles,
  CheckSquare, ListTodo, Calendar as CalendarIcon,
  Users, Star, Flag, Eye, EyeOff, Lock, Unlock,
  Plus, Minus, Maximize2, Minimize2
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface TrashItem {
  id: string
  title: string
  description?: string
  type: 'task' | 'project' | 'goal' | 'template' | 'document'
  deletedDate: string
  deletedBy: { id: string; name: string; avatar: string }
  originalCategory: string
  daysUntilPermanent: number
  originalStatus?: string
  originalPriority?: 'low' | 'medium' | 'high' | 'critical'
  attachments?: number
  size?: string
  canRestore: boolean
  restoredBy?: string
  permanentDeleteDate: string
}

interface TrashStats {
  totalItems: number
  totalSize: string
  oldestItem: string
  recoverableItems: number
  itemsByType: Record<string, number>
  itemsExpiringSoon: number
}

// ============================================
// COMPONENTS
// ============================================
const TrashItemCard: React.FC<{ 
  item: TrashItem; 
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onBatchSelect: (id: string) => void;
  isSelected: boolean;
}> = ({ item, onRestore, onPermanentDelete, onBatchSelect, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const getTypeIcon = () => {
    const icons = {
      task: CheckCircle2,
      project: Folder,
      goal: TargetIcon,
      template: FileText,
      document: FileText
    }
    const Icon = icons[item.type] || FileText
    return <Icon className="w-5 h-5" />
  }

  const getTypeColor = () => {
    const colors = {
      task: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      project: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
      goal: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      template: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
      document: 'text-gray-500 bg-gray-50 dark:bg-gray-700'
    }
    return colors[item.type] || colors.task
  }

  const getPriorityBadge = () => {
    if (!item.originalPriority) return null
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    }
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${colors[item.originalPriority]}`}>
        {item.originalPriority.charAt(0).toUpperCase() + item.originalPriority.slice(1)}
      </span>
    )
  }

  const daysLeft = item.daysUntilPermanent
  const isExpiringSoon = daysLeft <= 7

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' 
          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-1">
            <button
              onClick={() => onBatchSelect(item.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
            </button>
          </div>

          {/* Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              {getPriorityBadge()}
              {isExpiringSoon && (
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">
                  Expiring soon!
                </span>
              )}
            </div>
            
            {item.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {item.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Deleted: {new Date(item.deletedDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                by {item.deletedBy.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className={isExpiringSoon ? 'text-red-500 font-medium' : ''}>
                  {item.daysUntilPermanent} days left
                </span>
              </span>
              {item.attachments && (
                <span className="flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  {item.attachments} files
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => onRestore(item.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Restore"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete Permanently"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Original Category:</span>
                  <span className="text-gray-700 dark:text-gray-300">{item.originalCategory}</span>
                </div>
                {item.originalStatus && (
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Status:</span>
                    <span className="text-gray-700 dark:text-gray-300">{item.originalStatus}</span>
                  </div>
                )}
                {item.size && (
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Size:</span>
                    <span className="text-gray-700 dark:text-gray-300">{item.size}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Permanent deletion:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(item.permanentDeleteDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {item.canRestore && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    This item can be fully restored with all its original data and relationships.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Permanently Delete?</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to permanently delete "{item.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onPermanentDelete(item.id)
                    setShowConfirmDelete(false)
                  }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const BatchActionBar: React.FC<{
  selectedCount: number
  onRestoreAll: () => void
  onDeleteAll: () => void
  onClearSelection: () => void
}> = ({ selectedCount, onRestoreAll, onDeleteAll, onClearSelection }) => {
  if (selectedCount === 0) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="bg-gray-900 dark:bg-gray-800 rounded-full shadow-2xl px-4 py-2 flex items-center gap-3">
        <span className="text-white text-sm font-medium">{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
        <div className="w-px h-6 bg-gray-700" />
        <button
          onClick={onRestoreAll}
          className="flex items-center gap-2 px-3 py-1.5 text-green-400 hover:text-green-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restore All
        </button>
        <button
          onClick={onDeleteAll}
          className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete All
        </button>
        <button
          onClick={onClearSelection}
          className="px-3 py-1.5 text-gray-400 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  )
}

const StatsCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = ({ 
  icon: Icon, label, value, color 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
)

// Missing imports
import { Paperclip } from 'lucide-react'

// ============================================
// MAIN COMPONENT
// ============================================
export default function Trash() {
  const [items, setItems] = useState<TrashItem[]>([
    {
      id: '1',
      title: 'Old Meeting Notes',
      description: 'Notes from Q2 planning meetings and follow-ups',
      type: 'task',
      deletedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deletedBy: { id: '1', name: 'Alice Johnson', avatar: 'AJ' },
      originalCategory: 'Meetings',
      daysUntilPermanent: 25,
      originalPriority: 'medium',
      attachments: 3,
      size: '245 KB',
      canRestore: true,
      permanentDeleteDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Experimental Feature',
      description: 'Experimental dashboard feature prototype',
      type: 'task',
      deletedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deletedBy: { id: '2', name: 'Bob Smith', avatar: 'BS' },
      originalCategory: 'Development',
      daysUntilPermanent: 27,
      originalPriority: 'high',
      attachments: 1,
      size: '128 KB',
      canRestore: true,
      permanentDeleteDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Q2 Planning Document',
      description: 'Strategic planning document for Q2 2026',
      type: 'document',
      deletedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deletedBy: { id: '3', name: 'Charlie Brown', avatar: 'CB' },
      originalCategory: 'Planning',
      daysUntilPermanent: 20,
      attachments: 5,
      size: '1.2 MB',
      canRestore: true,
      permanentDeleteDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'User Research Report',
      description: 'Customer feedback and user research findings',
      type: 'document',
      deletedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      deletedBy: { id: '4', name: 'Diana Prince', avatar: 'DP' },
      originalCategory: 'Research',
      daysUntilPermanent: 5,
      attachments: 8,
      size: '3.4 MB',
      canRestore: true,
      originalPriority: 'high',
      permanentDeleteDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: 'Marketing Campaign',
      description: 'Q3 marketing campaign assets and schedule',
      type: 'project',
      deletedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      deletedBy: { id: '5', name: 'Eve Wilson', avatar: 'EW' },
      originalCategory: 'Marketing',
      daysUntilPermanent: 2,
      originalStatus: 'In Progress',
      attachments: 12,
      size: '8.7 MB',
      canRestore: true,
      permanentDeleteDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'expiry'>('expiry')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false)
  const [lastRestored, setLastRestored] = useState<string>('')

  const stats = useMemo<TrashStats>(() => {
    const totalItems = items.length
    const itemsByType: Record<string, number> = {}
    items.forEach(item => {
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1
    })
    const itemsExpiringSoon = items.filter(i => i.daysUntilPermanent <= 7).length
    const recoverableItems = items.filter(i => i.canRestore).length
    const totalSize = items.reduce((acc, i) => {
      if (i.size) {
        const sizeNum = parseFloat(i.size)
        if (i.size.includes('MB')) return acc + sizeNum
        if (i.size.includes('KB')) return acc + sizeNum / 1024
      }
      return acc
    }, 0)
    
    return {
      totalItems,
      totalSize: `${totalSize.toFixed(1)} MB`,
      oldestItem: items.length > 0 ? [...items].sort((a, b) => 
        new Date(a.deletedDate).getTime() - new Date(b.deletedDate).getTime()
      )[0].title : 'N/A',
      recoverableItems,
      itemsByType,
      itemsExpiringSoon,
    }
  }, [items])

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || item.type === filterType
        return matchesSearch && matchesType
      })
      .sort((a, b) => {
        if (sortBy === 'expiry') {
          return a.daysUntilPermanent - b.daysUntilPermanent
        }
        return new Date(b.deletedDate).getTime() - new Date(a.deletedDate).getTime()
      })
  }, [items, searchQuery, filterType, sortBy])

  const handleRestore = (id: string) => {
    const item = items.find(i => i.id === id)
    setItems(items.filter(i => i.id !== id))
    setSelectedItems(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setLastRestored(item?.title || 'Item')
    setShowRestoreSuccess(true)
    setTimeout(() => setShowRestoreSuccess(false), 3000)
  }

  const handlePermanentDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id))
    setSelectedItems(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleBatchRestore = () => {
    const remainingItems = items.filter(i => !selectedItems.has(i.id))
    const restoredCount = items.length - remainingItems.length
    setItems(remainingItems)
    setSelectedItems(new Set())
    setLastRestored(`${restoredCount} items`)
    setShowRestoreSuccess(true)
    setTimeout(() => setShowRestoreSuccess(false), 3000)
  }

  const handleBatchDelete = () => {
    if (window.confirm(`Permanently delete ${selectedItems.size} items? This action cannot be undone.`)) {
      setItems(items.filter(i => !selectedItems.has(i.id)))
      setSelectedItems(new Set())
    }
  }

  const handleEmptyTrash = () => {
    if (window.confirm('Empty entire trash? This will permanently delete all items. This action cannot be undone.')) {
      setItems([])
      setSelectedItems(new Set())
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(i => i.id)))
    }
  }

  const typeOptions = ['all', 'task', 'project', 'goal', 'document', 'template']

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-8 h-8 text-red-500" />
              Trash
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Items are automatically deleted after 30 days</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEmptyTrash}
              disabled={items.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Empty Trash
            </button>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showRestoreSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {lastRestored} restored successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard icon={Trash2} label="Total Items" value={stats.totalItems} color="bg-red-500" />
          <StatsCard icon={Database} label="Total Size" value={stats.totalSize} color="bg-blue-500" />
          <StatsCard icon={RotateCcw} label="Recoverable" value={stats.recoverableItems} color="bg-green-500" />
          <StatsCard icon={AlertTriangle} label="Expiring Soon" value={stats.itemsExpiringSoon} color="bg-orange-500" />
        </div>

        {/* Warning Banner for Expiring Items */}
        {stats.itemsExpiringSoon > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 dark:text-orange-400">⚠️ Items expiring soon</h3>
              <p className="text-sm text-orange-700 dark:text-orange-500 mt-1">
                {stats.itemsExpiringSoon} item{stats.itemsExpiringSoon !== 1 ? 's are' : ' is'} scheduled for permanent deletion within 7 days. 
                Restore them now to keep your data.
              </p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trashed items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'expiry')}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="expiry">Sort by Expiry (Soonest first)</option>
              <option value="date">Sort by Deletion Date (Newest first)</option>
            </select>
            
            {selectedItems.size > 0 && (
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type:</span>
                  {typeOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filterType === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trash Items List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Trash is empty</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {searchQuery || filterType !== 'all' 
                    ? 'No items match your search criteria' 
                    : 'Deleted items will appear here'}
                </p>
              </motion.div>
            ) : (
              filteredItems.map(item => (
                <TrashItemCard
                  key={item.id}
                  item={item}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                  onBatchSelect={(id) => {
                    setSelectedItems(prev => {
                      const next = new Set(prev)
                      if (next.has(id)) next.delete(id)
                      else next.add(id)
                      return next
                    })
                  }}
                  isSelected={selectedItems.has(item.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Restore Info Footer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400">About Trash & Recovery</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Items in trash are automatically permanently deleted after 30 days. When you restore an item, 
                it will return to its original location with all its data, comments, and attachments intact. 
                Items that are manually deleted by admins cannot be recovered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedItems.size}
        onRestoreAll={handleBatchRestore}
        onDeleteAll={handleBatchDelete}
        onClearSelection={() => setSelectedItems(new Set())}
      />
    </div>
  )
}