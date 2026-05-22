// src/pages/Tags.tsx - Tags Management Page
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Tag, Plus, Edit2, Trash2, Search, X, Check,
  Folder, Star, AlertCircle, Info, Hash,
  TrendingUp, Clock, Filter, Save, ExternalLink,
  Palette, Sparkles, Zap, Shield, Eye, EyeOff,
  Sun, Moon
} from 'lucide-react'

interface TagItem {
  id: string
  name: string
  color: string
  taskCount: number
  createdAt: string
  updatedAt: string
  description?: string
  isActive?: boolean
  usageTrend?: 'up' | 'down' | 'stable'
}

const colorOptions = [
  { value: '#3b82f6', name: 'Blue', shade: 'primary' },
  { value: '#10b981', name: 'Green', shade: 'success' },
  { value: '#f59e0b', name: 'Amber', shade: 'warning' },
  { value: '#ef4444', name: 'Red', shade: 'danger' },
  { value: '#8b5cf6', name: 'Purple', shade: 'accent' },
  { value: '#ec4899', name: 'Pink', shade: 'secondary' },
  { value: '#14b8a6', name: 'Teal', shade: 'info' },
  { value: '#f97316', name: 'Orange', shade: 'warm' },
  { value: '#6366f1', name: 'Indigo', shade: 'cool' },
  { value: '#06b6d4', name: 'Cyan', shade: 'light' },
]

// Edit Tag Modal
const EditTagModal: React.FC<{
  isOpen: boolean
  tag: TagItem | null
  onSave: (id: string, name: string, color: string, description: string) => void
  onClose: () => void
}> = ({ isOpen, tag, onSave, onClose }) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState(colorOptions[0].value)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (tag) {
      setName(tag.name)
      setColor(tag.color)
      setDescription(tag.description || '')
    }
  }, [tag])

  if (!isOpen || !tag) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave(tag.id, name.trim(), color, description)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Edit2 className="w-5 h-5 text-blue-500" />
            Edit Tag
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tag Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter tag name"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tag Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Add a description for this tag..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal: React.FC<{
  isOpen: boolean
  tagName: string
  taskCount: number
  onConfirm: () => void
  onCancel: () => void
}> = ({ isOpen, tagName, taskCount, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Tag</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete "{tagName}"?
              </p>
            </div>
          </div>
          {taskCount > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                This tag is used in {taskCount} task(s). Deleting it will remove the tag from those tasks.
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Tag
            </button>
          </div>
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
    success: { bg: 'bg-green-500', text: 'text-white', icon: Check },
    error: { bg: 'bg-red-500', text: 'text-white', icon: AlertCircle },
    info: { bg: 'bg-blue-500', text: 'text-white', icon: Info }
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

export default function Tags() {
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

  const [tags, setTags] = useState<TagItem[]>([
    { 
      id: '1', 
      name: 'Work', 
      color: '#3b82f6', 
      taskCount: 24, 
      createdAt: '2024-01-15',
      updatedAt: '2024-05-20',
      description: 'Work-related tasks and projects',
      isActive: true,
      usageTrend: 'up'
    },
    { 
      id: '2', 
      name: 'Personal', 
      color: '#10b981', 
      taskCount: 12, 
      createdAt: '2024-01-15',
      updatedAt: '2024-05-18',
      description: 'Personal tasks and reminders',
      isActive: true,
      usageTrend: 'stable'
    },
    { 
      id: '3', 
      name: 'Urgent', 
      color: '#ef4444', 
      taskCount: 8, 
      createdAt: '2024-01-16',
      updatedAt: '2024-05-19',
      description: 'High priority tasks needing immediate attention',
      isActive: true,
      usageTrend: 'down'
    },
    { 
      id: '4', 
      name: 'Design', 
      color: '#8b5cf6', 
      taskCount: 15, 
      createdAt: '2024-01-20',
      updatedAt: '2024-05-17',
      description: 'UI/UX design tasks',
      isActive: true,
      usageTrend: 'up'
    },
    { 
      id: '5', 
      name: 'Development', 
      color: '#f59e0b', 
      taskCount: 32, 
      createdAt: '2024-02-01',
      updatedAt: '2024-05-21',
      description: 'Software development tasks',
      isActive: true,
      usageTrend: 'up'
    },
  ])

  const [showNewTag, setShowNewTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagDescription, setNewTagDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [editingTag, setEditingTag] = useState<TagItem | null>(null)
  const [deletingTag, setDeletingTag] = useState<TagItem | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showStats, setShowStats] = useState(true)

  const filteredTags = useMemo(() => {
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tags, searchQuery])

  const stats = {
    total: tags.length,
    totalTasks: tags.reduce((sum, t) => sum + t.taskCount, 0),
    averageTasks: Math.round(tags.reduce((sum, t) => sum + t.taskCount, 0) / tags.length),
    mostUsed: tags.reduce((max, tag) => tag.taskCount > max.taskCount ? tag : max, tags[0]),
    activeTags: tags.filter(t => t.isActive).length
  }

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag: TagItem = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: selectedColor,
        taskCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        description: newTagDescription.trim() || undefined,
        isActive: true,
        usageTrend: 'stable'
      }
      setTags([...tags, newTag])
      setNewTagName('')
      setNewTagDescription('')
      setShowNewTag(false)
      setToast({ message: `Tag "${newTagName}" created successfully!`, type: 'success' })
    }
  }

  const updateTag = (id: string, name: string, color: string, description: string) => {
    setTags(tags.map(tag => 
      tag.id === id 
        ? { 
            ...tag, 
            name, 
            color, 
            description,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : tag
    ))
    setToast({ message: `Tag updated successfully!`, type: 'success' })
  }

  const deleteTag = (id: string) => {
    const deletedTag = tags.find(t => t.id === id)
    setTags(tags.filter(tag => tag.id !== id))
    setToast({ message: `Tag "${deletedTag?.name}" deleted successfully!`, type: 'success' })
    setDeletingTag(null)
  }

  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'down': return <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />
      default: return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTag && (
          <EditTagModal
            isOpen={true}
            tag={editingTag}
            onSave={updateTag}
            onClose={() => setEditingTag(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingTag && (
          <DeleteConfirmModal
            isOpen={true}
            tagName={deletingTag.name}
            taskCount={deletingTag.taskCount}
            onConfirm={() => deleteTag(deletingTag.id)}
            onCancel={() => setDeletingTag(null)}
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
              <Tag className="w-7 h-7 text-blue-500" />
              Tags
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Organize and manage your tasks with custom tags</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300"
            >
              {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">Stats</span>
            </button>
            <button
              onClick={() => setShowNewTag(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Tag</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Tags', value: stats.total, icon: Tag, color: 'from-blue-500 to-blue-600' },
              { label: 'Tagged Tasks', value: stats.totalTasks, icon: Check, color: 'from-green-500 to-green-600' },
              { label: 'Avg per Tag', value: stats.averageTasks, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
              { label: 'Most Used', value: stats.mostUsed.name, icon: Star, color: 'from-orange-500 to-orange-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              List View
            </button>
          </div>
        </motion.div>

        {/* Tags Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${tag.color}20` }}
                    >
                      <Hash className="w-6 h-6" style={{ color: tag.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{tag.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{tag.taskCount} tasks</span>
                        {getTrendIcon(tag.usageTrend)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit tag"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => setDeletingTag(tag)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete tag"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                
                {tag.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{tag.description}</p>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>Created: {new Date(tag.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(tag.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${tag.color}20` }}
                    >
                      <Hash className="w-5 h-5" style={{ color: tag.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{tag.name}</h3>
                        {getTrendIcon(tag.usageTrend)}
                      </div>
                      {tag.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tag.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                        <span>{tag.taskCount} tasks</span>
                        <span>•</span>
                        <span>Created {new Date(tag.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => setDeletingTag(tag)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTags.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          >
            <Tag className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No tags found</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {searchQuery 
                ? 'Try adjusting your search query'
                : 'Create your first tag to organize your tasks'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* New Tag Modal */}
        <AnimatePresence>
          {showNewTag && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setShowNewTag(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Create New Tag
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tag Name *</label>
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="e.g., Design, Urgent, Review"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tag Color</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description (Optional)</label>
                    <textarea
                      value={newTagDescription}
                      onChange={(e) => setNewTagDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add a description for this tag..."
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  <button
                    onClick={() => setShowNewTag(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTag}
                    disabled={!newTagName.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    Create Tag
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}