// src/pages/Templates.tsx - Comprehensive Task Templates Page
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Plus, Copy, Trash2, Edit, MoreVertical,
  Clock, Users, Tag, Calendar, CheckCircle2, Star,
  LayoutGrid, List, Search, Filter, Download, Upload,
  X, Heart, TrendingUp, Award, Zap, Shield, Crown,
  FolderOpen, Bookmark, Share2, Eye, EyeOff, Lock,
  Unlock, RefreshCw, AlertCircle, Check, ChevronDown,
  Globe, UserCheck, BarChart3, Activity, Layers,
  FolderKanban, Briefcase, Rocket, Sparkles, Gift,
  Coffee, Music, Code, Palette, PenTool, Megaphone,
  TrendingDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface TemplateTask {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedHours: number
  tags: string[]
  subtasks?: { title: string; completed: boolean }[]
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  usageCount: number
  createdAt: string
  updatedAt: string
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
  author: { id: string; name: string; avatar: string }
  rating: number
  reviews: number
  tasks: TemplateTask[]
  estimatedDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnail?: string
  icon?: string
  version: number
  dependencies?: string[]
}

interface TemplateStats {
  totalTemplates: number
  totalUses: number
  averageRating: number
  mostUsedCategory: string
  templatesCreatedThisMonth: number
  publicTemplates: number
  featuredTemplates: number
}

// ============================================
// COMPONENTS
// ============================================
const TemplateCard: React.FC<{ 
  template: Template; 
  onUse: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string) => void;
}> = ({ template, onUse, onEdit, onDelete, onTogglePublic }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  const difficultyIcons = {
    beginner: <Zap className="w-3 h-3" />,
    intermediate: <TrendingUp className="w-3 h-3" />,
    advanced: <Crown className="w-3 h-3" />,
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
    >
      {/* Featured Badge */}
      {template.isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
            <Star className="w-3 h-3" />
            <span>Featured</span>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              {template.icon ? (
                <span className="text-2xl">{template.icon}</span>
              ) : (
                <FileText className="w-6 h-6 text-white" />
              )}
            </div>
            {template.isPublic ? (
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-green-500 rounded-full">
                <Globe className="w-3 h-3 text-white" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-gray-500 rounded-full">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute right-0 top-8 z-20 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => { onEdit(template); setShowMenu(false) }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => { onTogglePublic(template.id); setShowMenu(false) }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    {template.isPublic ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {template.isPublic ? 'Make Private' : 'Make Public'}
                  </button>
                  <button
                    onClick={() => { onDelete(template.id); setShowMenu(false) }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Title & Description */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
          {template.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {template.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              #{tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">
              +{template.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-500">
              <Copy className="w-3 h-3" />
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedDuration}h</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">{template.rating}</span>
            <span className="text-gray-400">({template.reviews})</span>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${difficultyColors[template.difficulty]}`}>
            {difficultyIcons[template.difficulty]}
            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
          </span>
          <span className="text-xs text-gray-400">v{template.version}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => onUse(template)}
            className="flex-1 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
          >
            Use Template
          </button>
          <button
            onClick={() => onEdit(template)}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const TemplateListItem: React.FC<{ 
  template: Template; 
  onUse: (template: Template) => void;
  onEdit: (template: Template) => void;
}> = ({ template, onUse, onEdit }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
            {template.isFeatured && (
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            )}
            {!template.isPublic && (
              <Lock className="w-3 h-3 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{template.description}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>{template.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Copy className="w-3 h-3" />{template.usageCount}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{template.estimatedDuration}h</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(template)}
          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onUse(template)}
          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Use
        </button>
      </div>
    </motion.div>
  )
}

const CreateTemplateModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onCreate: (template: Partial<Template>) => void
}> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Productivity',
    tags: [] as string[],
    isPublic: true,
    difficulty: 'intermediate' as Template['difficulty'],
    estimatedDuration: 2,
  })
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const handleSubmit = () => {
    if (!formData.name) return
    onCreate({
      ...formData,
      tasks: [],
      usageCount: 0,
      rating: 0,
      reviews: 0,
      version: 1,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Create New Template
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Template Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Product Launch Checklist"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe what this template is for..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Productivity</option>
                  <option>Marketing</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Design</option>
                  <option>Management</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Template['difficulty'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Duration (hours)</label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                min={0.5}
                step={0.5}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Add a tag..."
                />
                <button onClick={handleAddTag} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Make this template public</span>
            </label>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md">
              Create Template
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const TemplatePreviewModal: React.FC<{
  template: Template | null
  isOpen: boolean
  onClose: () => void
  onUse: (template: Template) => void
}> = ({ template, isOpen, onClose, onUse }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'stats'>('overview')

  if (!template || !isOpen) return null

  const totalSubtasks = template.tasks.reduce((acc, task) => acc + (task.subtasks?.length || 0), 0)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{template.name}</h2>
                <p className="text-white/80 text-sm">{template.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{template.tasks.length}</p>
                    <p className="text-xs text-gray-500">Total Tasks</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSubtasks}</p>
                    <p className="text-xs text-gray-500">Sub-tasks</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{template.estimatedDuration}</p>
                    <p className="text-xs text-gray-500">Est. Hours</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{template.usageCount}</p>
                    <p className="text-xs text-gray-500">Total Uses</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 rounded-full">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><UserCheck className="w-4 h-4" /> By {template.author.name}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Created {new Date(template.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> v{template.version}</span>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {template.tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks added yet</p>
                  </div>
                ) : (
                  template.tasks.map((task, idx) => (
                    <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {idx + 1}. {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
                          )}
                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {task.subtasks.map((st, stIdx) => (
                                <div key={stIdx} className="flex items-center gap-2 text-sm text-gray-500">
                                  <Circle className="w-3 h-3" />
                                  <span>{st.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-400">{task.estimatedHours}h</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rating & Reviews</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= template.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{template.rating} out of 5 ({template.reviews} reviews)</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Usage Analytics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Uses</span>
                      <span className="font-medium">{template.usageCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="font-medium">{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Updated</span>
                      <span className="font-medium">{new Date(template.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Close</button>
            <button onClick={() => { onUse(template); onClose() }} className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md">
              Use This Template
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Templates() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular')
  
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Product Launch',
      description: 'Complete checklist for launching a new product from planning to post-launch review',
      category: 'Marketing',
      usageCount: 245,
      createdAt: '2024-01-15',
      updatedAt: '2024-02-20',
      tags: ['product', 'launch', 'marketing', 'go-to-market'],
      isPublic: true,
      isFeatured: true,
      author: { id: '1', name: 'Sarah Johnson', avatar: 'SJ' },
      rating: 4.8,
      reviews: 124,
      tasks: [
        { id: 't1', title: 'Market Research', description: 'Conduct thorough market analysis', priority: 'high', estimatedHours: 8, tags: ['research'], subtasks: [{ title: 'Competitor analysis', completed: false }, { title: 'Customer surveys', completed: false }] },
        { id: 't2', title: 'Product Positioning', description: 'Define unique value proposition', priority: 'medium', estimatedHours: 4, tags: ['strategy'], subtasks: [] },
      ],
      estimatedDuration: 40,
      difficulty: 'advanced',
      version: 2,
    },
    {
      id: '2',
      name: 'Sprint Planning',
      description: 'Agile sprint planning and execution template for development teams',
      category: 'Engineering',
      usageCount: 189,
      createdAt: '2024-02-01',
      updatedAt: '2024-03-10',
      tags: ['agile', 'sprint', 'planning', 'scrum'],
      isPublic: true,
      isFeatured: true,
      author: { id: '2', name: 'Mike Chen', avatar: 'MC' },
      rating: 4.9,
      reviews: 98,
      tasks: [
        { id: 't3', title: 'Sprint Goals', description: 'Define clear sprint objectives', priority: 'high', estimatedHours: 2, tags: ['planning'], subtasks: [] },
        { id: 't4', title: 'Backlog Refinement', description: 'Prioritize and estimate tasks', priority: 'medium', estimatedHours: 4, tags: ['backlog'], subtasks: [] },
      ],
      estimatedDuration: 30,
      difficulty: 'intermediate',
      version: 3,
    },
    {
      id: '3',
      name: 'Client Onboarding',
      description: 'Step-by-step client onboarding process for new customers',
      category: 'Sales',
      usageCount: 156,
      createdAt: '2024-01-20',
      updatedAt: '2024-02-15',
      tags: ['client', 'onboarding', 'sales', 'customer-success'],
      isPublic: true,
      isFeatured: false,
      author: { id: '3', name: 'Emily Wong', avatar: 'EW' },
      rating: 4.7,
      reviews: 76,
      tasks: [
        { id: 't5', title: 'Welcome Call', description: 'Schedule and conduct welcome meeting', priority: 'high', estimatedHours: 1, tags: ['communication'], subtasks: [] },
        { id: 't6', title: 'Account Setup', description: 'Create user accounts and permissions', priority: 'high', estimatedHours: 2, tags: ['setup'], subtasks: [] },
      ],
      estimatedDuration: 15,
      difficulty: 'beginner',
      version: 1,
    },
    {
      id: '4',
      name: 'Bug Report',
      description: 'Standard bug reporting and tracking template for QA teams',
      category: 'QA',
      usageCount: 312,
      createdAt: '2024-02-10',
      updatedAt: '2024-03-01',
      tags: ['bug', 'qa', 'testing', 'quality'],
      isPublic: true,
      isFeatured: false,
      author: { id: '4', name: 'David Kim', avatar: 'DK' },
      rating: 4.6,
      reviews: 203,
      tasks: [
        { id: 't7', title: 'Bug Discovery', description: 'Document reproduction steps', priority: 'high', estimatedHours: 1, tags: ['reporting'], subtasks: [] },
        { id: 't8', title: 'Bug Verification', description: 'Verify fix in staging', priority: 'medium', estimatedHours: 0.5, tags: ['testing'], subtasks: [] },
      ],
      estimatedDuration: 8,
      difficulty: 'beginner',
      version: 1,
    },
    {
      id: '5',
      name: 'Weekly Review',
      description: 'Weekly progress review and planning template for teams',
      category: 'Management',
      usageCount: 98,
      createdAt: '2024-03-01',
      updatedAt: '2024-03-20',
      tags: ['weekly', 'review', 'planning', 'retrospective'],
      isPublic: false,
      isFeatured: false,
      author: { id: '5', name: 'Lisa Park', avatar: 'LP' },
      rating: 4.5,
      reviews: 34,
      tasks: [
        { id: 't9', title: 'Weekly Summary', description: 'Document key accomplishments', priority: 'medium', estimatedHours: 1, tags: ['review'], subtasks: [] },
        { id: 't10', title: 'Next Week Planning', description: 'Set priorities for upcoming week', priority: 'high', estimatedHours: 1.5, tags: ['planning'], subtasks: [] },
      ],
      estimatedDuration: 4,
      difficulty: 'beginner',
      version: 1,
    },
    {
      id: '6',
      name: 'Design System Setup',
      description: 'Complete design system setup and documentation',
      category: 'Design',
      usageCount: 67,
      createdAt: '2024-02-15',
      updatedAt: '2024-03-05',
      tags: ['design', 'ui', 'ux', 'system'],
      isPublic: true,
      isFeatured: false,
      author: { id: '6', name: 'Alex Rivera', avatar: 'AR' },
      rating: 4.9,
      reviews: 42,
      tasks: [
        { id: 't11', title: 'Color System', description: 'Define color palette and usage', priority: 'high', estimatedHours: 6, tags: ['colors'], subtasks: [] },
        { id: 't12', title: 'Typography Scale', description: 'Set up typography system', priority: 'high', estimatedHours: 4, tags: ['typography'], subtasks: [] },
      ],
      estimatedDuration: 25,
      difficulty: 'intermediate',
      version: 1,
    },
  ])

  const categories = ['all', 'Marketing', 'Engineering', 'Sales', 'QA', 'Management', 'Design', 'Productivity']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const stats = useMemo<TemplateStats>(() => {
    const totalUses = templates.reduce((sum, t) => sum + t.usageCount, 0)
    const avgRating = templates.reduce((sum, t) => sum + t.rating, 0) / templates.length
    const categoryCounts: Record<string, number> = {}
    templates.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + t.usageCount
    })
    const mostUsedCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const currentMonth = new Date().getMonth()
    const templatesThisMonth = templates.filter(t => new Date(t.createdAt).getMonth() === currentMonth).length

    return {
      totalTemplates: templates.length,
      totalUses: totalUses,
      averageRating: avgRating,
      mostUsedCategory: mostUsedCategory,
      templatesCreatedThisMonth: templatesThisMonth,
      publicTemplates: templates.filter(t => t.isPublic).length,
      featuredTemplates: templates.filter(t => t.isFeatured).length,
    }
  }, [templates])

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.usageCount - a.usageCount
      if (sortBy === 'rating') return b.rating - a.rating
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [templates, searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const handleUseTemplate = (template: Template) => {
    setTemplates(templates.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    ))
    alert(`Using template: ${template.name}\nThis would create a new project/task list based on this template.`)
  }

  const handleCreateTemplate = (newTemplate: Partial<Template>) => {
    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name || '',
      description: newTemplate.description || '',
      category: newTemplate.category || 'Productivity',
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newTemplate.tags || [],
      isPublic: newTemplate.isPublic || false,
      isFeatured: false,
      author: { id: 'current', name: 'You', avatar: 'YO' },
      rating: 0,
      reviews: 0,
      tasks: [],
      estimatedDuration: newTemplate.estimatedDuration || 2,
      difficulty: newTemplate.difficulty || 'intermediate',
      version: 1,
    }
    setTemplates([template, ...templates])
  }

  const handleEditTemplate = (template: Template) => {
    alert(`Edit template: ${template.name}\nThis would open the template editor.`)
  }

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id))
    }
  }

  const handleTogglePublic = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isPublic: !t.isPublic } : t
    ))
  }

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShowPreviewModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-500" />
              Templates
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Save time with reusable task templates and workflows</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTemplates}</p>
            <p className="text-xs text-gray-500">Templates</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUses.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Uses</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg Rating</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publicTemplates}</p>
            <p className="text-xs text-gray-500">Public</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.featuredTemplates}</p>
            <p className="text-xs text-gray-500">Featured</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.templatesCreatedThisMonth}</p>
            <p className="text-xs text-gray-500">New This Month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{stats.mostUsedCategory}</p>
            <p className="text-xs text-gray-500">Top Category</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-400'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredTemplates.map(template => (
                <div key={template.id} onClick={() => handlePreviewTemplate(template)} className="cursor-pointer">
                  <TemplateCard
                    template={template}
                    onUse={handleUseTemplate}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onTogglePublic={handleTogglePublic}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {filteredTemplates.map(template => (
                <div key={template.id} onClick={() => handlePreviewTemplate(template)} className="cursor-pointer">
                  <TemplateListItem
                    template={template}
                    onUse={handleUseTemplate}
                    onEdit={handleEditTemplate}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No templates found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters</p>
            <button onClick={() => setShowCreateModal(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Create a template
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTemplate}
      />

      <TemplatePreviewModal
        template={selectedTemplate}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onUse={handleUseTemplate}
      />
    </div>
  )
}

// Missing import
import { Circle } from 'lucide-react'