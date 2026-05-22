// src/pages/Kanban.tsx - Ultra-Comprehensive Kanban Board with Dark/Light Mode
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Plus, MoreHorizontal, X, Calendar, User,
  MessageSquare, Paperclip, AlertTriangle, CheckCircle2, Clock,
  Tag, ChevronDown, Filter, Search, Download,
  Maximize2, Minimize2, Eye, EyeOff, Star, Zap,
  Copy, Trash2, Edit, Share2, ChevronRight, ChevronLeft,
  BarChart3, Activity, Layers, ClipboardList, Grid3X3,
  List, Settings, Bell, Sun, Moon, Monitor as MonitorIcon,
  Award, Flame, Target, GitBranch, GitPullRequest,
  Users, UserPlus, UserCheck, UserX, AtSign, Link as LinkIcon,
  FileText, Image, Video, Music, Archive, Bookmark,
  Flag, Gift, Coffee, Heart, Shield, Lock, Unlock,
  Truck, Package, Box, Database, Server, Cloud, Wifi
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface KanbanTask {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'testing' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: { id: string; name: string; avatar: string }
  assignees: { id: string; name: string; avatar: string }[]
  dueDate: string
  createdAt: string
  updatedAt: string
  labels: { id: string; name: string; color: string }[]
  estimatedHours: number
  actualHours: number
  progress: number
  subtasks: { id: string; title: string; completed: boolean }[]
  comments: number
  attachments: number
  isRecurring: boolean
  aiGenerated: boolean
  storyPoints: number
  sprint: string
  order: number
  swimlane: string
  blocked: boolean
  blockedReason?: string
  watchers: number
  timeEstimate: number
  timeSpent: number
  dependencies: string[]
}

interface KanbanColumn {
  id: string
  title: string
  tasks: KanbanTask[]
  color: string
  icon: React.ElementType
  limit: number
  description: string
  wipLimit?: number
}

interface ActivityLog {
  id: string
  taskId: string
  action: string
  user: string
  timestamp: string
}

// ============================================
// PRIORITY BADGE
// ============================================
const PriorityBadge: React.FC<{ priority: KanbanTask['priority'] }> = ({ priority }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    critical: { bg: 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700', text: 'text-red-700 dark:text-red-400', icon: <AlertTriangle className="w-3 h-3" /> },
    high: { bg: 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-400', icon: <Zap className="w-3 h-3" /> },
    medium: { bg: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-400', icon: <Clock className="w-3 h-3" /> },
    low: { bg: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700', text: 'text-green-700 dark:text-green-400', icon: <CheckCircle2 className="w-3 h-3" /> },
  }
  const c = config[priority]
  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-xs rounded-full font-medium border ${c.bg} ${c.text}`}>
      {c.icon}
      <span className="capitalize">{priority}</span>
    </span>
  )
}

// ============================================
// TASK CARD
// ============================================
const KanbanTaskCard: React.FC<{
  task: KanbanTask
  onStatusChange: (taskId: string, direction: 'left' | 'right') => void
  onEdit: (task: KanbanTask) => void
  onDelete: (taskId: string) => void
  onDuplicate: (task: KanbanTask) => void
  isDragging?: boolean
}> = ({ task, onStatusChange, onEdit, onDelete, onDuplicate, isDragging }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'
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

  const completedSubtasks = task.subtasks.filter(s => s.completed).length
  const subtaskProgress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0
  const timeProgress = task.timeEstimate > 0 ? (task.timeSpent / task.timeEstimate) * 100 : 0

  const statusColors: Record<string, string> = {
    backlog: 'border-l-gray-400',
    todo: 'border-l-blue-500',
    in_progress: 'border-l-yellow-500',
    review: 'border-l-purple-500',
    testing: 'border-l-orange-500',
    done: 'border-l-green-500',
  }

  const onShare = () => {
    navigator.clipboard.writeText(`Check out this task: ${task.title} - ${window.location.origin}/tasks/${task.id}`)
    alert('Task link copied to clipboard!')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative bg-white dark:bg-gray-800 rounded-xl border-l-4 ${statusColors[task.status]} shadow-md hover:shadow-xl transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl rotate-2 scale-105 z-50 ring-2 ring-blue-400' : ''}`}
      draggable
    >
      <div className="p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <PriorityBadge priority={task.priority} />
          <div className="flex items-center space-x-1">
            {task.blocked && (
              <div className="mr-1" title={task.blockedReason || "Blocked"}>
                <Lock className="w-3 h-3 text-red-500" />
              </div>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'left') }}
              className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors" 
              title="Move left">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'right') }}
              className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors" 
              title="Move right">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div ref={menuRef} className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-50 py-1"
                  >
                    <button onClick={(e) => { e.stopPropagation(); onEdit(task); setShowMenu(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors">
                      <Edit className="w-4 h-4 text-gray-400" /><span>Edit</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDuplicate(task); setShowMenu(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors">
                      <Copy className="w-4 h-4 text-gray-400" /><span>Duplicate</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onShare(); setShowMenu(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors">
                      <Share2 className="w-4 h-4 text-gray-400" /><span>Share</span>
                    </button>
                    <hr className="my-1 dark:border-gray-700" />
                    <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); setShowMenu(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center space-x-3 transition-colors">
                      <Trash2 className="w-4 h-4" /><span>Delete</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Title */}
        <Link to={`/tasks/${task.id}`} className="block mb-2 group">
          <h3 className={`font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
            {task.title}
            {task.aiGenerated && <span className="ml-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1 rounded">AI</span>}
          </h3>
        </Link>

        {/* Description */}
        {task.description && (
          <div className="mb-2">
            <p className={`text-xs text-gray-500 dark:text-gray-400 ${!isExpanded && 'line-clamp-2'}`}>{task.description}</p>
            {task.description.length > 100 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
                className="text-xs text-blue-500 hover:text-blue-600 mt-1 font-medium">
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.map(label => (
              <span 
                key={label.id} 
                className="px-2 py-0.5 text-xs rounded-full text-white font-medium shadow-sm"
                style={{ backgroundColor: label.color }}>
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
              <span className="text-gray-400 text-xs">{Math.round(subtaskProgress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${subtaskProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Progress */}
        {task.progress > 0 && task.status !== 'done' && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{task.progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${task.progress >= 80 ? 'bg-green-500' : task.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Time Tracking */}
        {task.timeEstimate > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Time</span>
              <span className="text-gray-400 text-xs">{task.timeSpent}h / {task.timeEstimate}h</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${timeProgress >= 100 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, timeProgress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={`flex items-center ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {task.storyPoints > 0 && (
              <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">{task.storyPoints} SP</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {task.comments > 0 && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-3 h-3 mr-0.5" />
                {task.comments}
              </span>
            )}
            {task.attachments > 0 && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Paperclip className="w-3 h-3 mr-0.5" />
                {task.attachments}
              </span>
            )}
            {task.watchers > 0 && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Eye className="w-3 h-3 mr-0.5" />
                {task.watchers}
              </span>
            )}
            <div className="flex -space-x-1.5 ml-1">
              {task.assignees.slice(0, 3).map(a => (
                <div 
                  key={a.id} 
                  className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  title={a.name}>
                  {a.avatar}
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// COLUMN HEADER
// ============================================
const ColumnHeader: React.FC<{
  column: KanbanColumn
  isCollapsed: boolean
  onToggleCollapse: () => void
  onAddTask: () => void
}> = ({ column, isCollapsed, onToggleCollapse, onAddTask }) => {
  const Icon = column.icon
  const overLimit = column.wipLimit && column.tasks.length >= column.wipLimit

  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{column.title}</h3>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${overLimit ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
          {column.tasks.length}{column.wipLimit ? `/${column.wipLimit}` : ''}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <button 
          onClick={onToggleCollapse} 
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
          title={isCollapsed ? "Expand column" : "Collapse column"}>
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button 
          onClick={onAddTask}
          className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500 transition-colors"
          title="Add task">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// STATS CARD
// ============================================
const StatsCard: React.FC<{ column: KanbanColumn }> = ({ column }) => {
  const avgProgress = column.tasks.length > 0 
    ? Math.round(column.tasks.reduce((sum, t) => sum + t.progress, 0) / column.tasks.length)
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{column.title}</p>
        </div>
        <column.icon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{column.tasks.length}</p>
      <div className="mt-2">
        <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${avgProgress}%` }} />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{avgProgress}% avg progress</p>
      </div>
    </div>
  )
}

// ============================================
// MAIN KANBAN COMPONENT
// ============================================
export default function Kanban() {
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [showAddTask, setShowAddTask] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; fromColumn: string } | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set())
  const [showStats, setShowStats] = useState(true)
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [viewMode, setViewMode] = useState<'board' | 'compact'>('board')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [activityLogs] = useState<ActivityLog[]>([
    { id: '1', taskId: 't1', action: 'Created task', user: 'Alice', timestamp: new Date().toISOString() },
    { id: '2', taskId: 't1', action: 'Moved to In Progress', user: 'Bob', timestamp: new Date().toISOString() },
  ])
  
  const exportMenuRef = useRef<HTMLDivElement>(null)

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

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      setColumns([
        {
          id: 'backlog', title: 'Backlog', color: '#6b7280', icon: Layers, limit: 30, wipLimit: 30,
          description: 'Ideas and future tasks',
          tasks: [
            { id: 'b1', title: 'AI-powered task suggestions', description: 'Implement ML model for task recommendations using TensorFlow.js for real-time predictions', status: 'backlog', priority: 'medium', assignee: { id: '5', name: 'Eve', avatar: 'EW' }, assignees: [{ id: '5', name: 'Eve', avatar: 'EW' }], dueDate: '2026-07-01', createdAt: '2026-05-01', updatedAt: '2026-05-21', labels: [{ id: 'l1', name: 'AI', color: '#8b5cf6' }, { id: 'l2', name: 'ML', color: '#ec4899' }], estimatedHours: 40, actualHours: 0, progress: 0, subtasks: [{ id: 'sb1', title: 'Research ML models', completed: false }, { id: 'sb2', title: 'Implement API endpoint', completed: false }], comments: 2, attachments: 0, isRecurring: false, aiGenerated: true, storyPoints: 13, sprint: 'Future', order: 1, swimlane: 's1', blocked: false, watchers: 3, timeEstimate: 40, timeSpent: 0, dependencies: [] },
            { id: 'b2', title: 'Dark mode v2 improvements', description: 'Enhanced dark mode with custom themes and automatic system preference detection', status: 'backlog', priority: 'low', assignee: { id: '1', name: 'Alice', avatar: 'AJ' }, assignees: [{ id: '1', name: 'Alice', avatar: 'AJ' }], dueDate: '2026-07-15', createdAt: '2026-05-10', updatedAt: '2026-05-21', labels: [{ id: 'l3', name: 'UI', color: '#3b82f6' }], estimatedHours: 16, actualHours: 0, progress: 0, subtasks: [], comments: 1, attachments: 0, isRecurring: false, aiGenerated: false, storyPoints: 5, sprint: 'Future', order: 2, swimlane: 's1', blocked: false, watchers: 1, timeEstimate: 16, timeSpent: 0, dependencies: [] },
            { id: 'b3', title: 'Performance optimization', description: 'Reduce bundle size and improve load times with code splitting and lazy loading', status: 'backlog', priority: 'high', assignee: { id: '2', name: 'Bob', avatar: 'BS' }, assignees: [{ id: '2', name: 'Bob', avatar: 'BS' }], dueDate: '2026-06-20', createdAt: '2026-05-15', updatedAt: '2026-05-21', labels: [{ id: 'l4', name: 'performance', color: '#10b981' }], estimatedHours: 24, actualHours: 0, progress: 0, subtasks: [], comments: 0, attachments: 0, isRecurring: false, aiGenerated: false, storyPoints: 8, sprint: 'Future', order: 3, swimlane: 's1', blocked: false, watchers: 2, timeEstimate: 24, timeSpent: 0, dependencies: [] },
          ],
        },
        {
          id: 'todo', title: 'To Do', color: '#3b82f6', icon: ClipboardList, limit: 25, wipLimit: 25,
          description: 'Ready to be worked on',
          tasks: [
            { id: 't1', title: 'Implement authentication flow', description: 'JWT auth with refresh tokens and OAuth2 support for Google and GitHub', status: 'todo', priority: 'critical', assignee: { id: '2', name: 'Bob', avatar: 'BS' }, assignees: [{ id: '2', name: 'Bob', avatar: 'BS' }, { id: '3', name: 'Charlie', avatar: 'CB' }], dueDate: '2026-05-25', createdAt: '2026-05-18', updatedAt: '2026-05-21', labels: [{ id: 'l5', name: 'backend', color: '#10b981' }, { id: 'l6', name: 'security', color: '#ef4444' }], estimatedHours: 24, actualHours: 0, progress: 0, subtasks: [{ id: 's1', title: 'Set up JWT', completed: false }, { id: 's2', title: 'OAuth2 integration', completed: false }, { id: 's3', title: 'Refresh token logic', completed: false }], comments: 5, attachments: 2, isRecurring: false, aiGenerated: false, storyPoints: 8, sprint: 'Sprint 12', order: 1, swimlane: 's1', blocked: false, watchers: 4, timeEstimate: 24, timeSpent: 0, dependencies: [] },
            { id: 't2', title: 'Create onboarding tutorial', description: 'Interactive walkthrough for new users with tooltips and step-by-step guides', status: 'todo', priority: 'high', assignee: { id: '1', name: 'Alice', avatar: 'AJ' }, assignees: [{ id: '1', name: 'Alice', avatar: 'AJ' }], dueDate: '2026-05-28', createdAt: '2026-05-19', updatedAt: '2026-05-21', labels: [{ id: 'l7', name: 'UX', color: '#ec4899' }], estimatedHours: 12, actualHours: 0, progress: 0, subtasks: [{ id: 's4', title: 'Design tutorial flow', completed: false }, { id: 's5', title: 'Implement steps', completed: false }], comments: 3, attachments: 1, isRecurring: false, aiGenerated: false, storyPoints: 5, sprint: 'Sprint 12', order: 2, swimlane: 's1', blocked: false, watchers: 2, timeEstimate: 12, timeSpent: 0, dependencies: [] },
          ],
        },
        {
          id: 'in_progress', title: 'In Progress', color: '#f59e0b', icon: Activity, limit: 8, wipLimit: 8,
          description: 'Currently being worked on',
          tasks: [
            { id: 'ip1', title: 'Dashboard redesign with 3D', description: 'Complete overhaul with 3D card effects and real-time charts using D3.js', status: 'in_progress', priority: 'high', assignee: { id: '1', name: 'Alice', avatar: 'AJ' }, assignees: [{ id: '1', name: 'Alice', avatar: 'AJ' }, { id: '4', name: 'Diana', avatar: 'DP' }], dueDate: '2026-05-30', createdAt: '2026-05-15', updatedAt: '2026-05-21', labels: [{ id: 'l9', name: 'design', color: '#3b82f6' }, { id: 'l10', name: 'frontend', color: '#8b5cf6' }], estimatedHours: 32, actualHours: 12, progress: 65, subtasks: [{ id: 's6', title: 'Wireframes', completed: true }, { id: 's7', title: '3D card component', completed: true }, { id: 's8', title: 'Chart integration', completed: false }, { id: 's9', title: 'Responsive design', completed: false }], comments: 8, attachments: 5, isRecurring: false, aiGenerated: false, storyPoints: 13, sprint: 'Sprint 12', order: 1, swimlane: 's1', blocked: false, watchers: 5, timeEstimate: 32, timeSpent: 12, dependencies: [] },
          ],
        },
        {
          id: 'review', title: 'Review', color: '#8b5cf6', icon: Eye, limit: 10, wipLimit: 10,
          description: 'Ready for review',
          tasks: [
            { id: 'r1', title: 'API documentation v2', description: 'Complete OpenAPI 3.0 documentation with examples and interactive playground', status: 'review', priority: 'medium', assignee: { id: '3', name: 'Charlie', avatar: 'CB' }, assignees: [{ id: '3', name: 'Charlie', avatar: 'CB' }], dueDate: '2026-05-23', createdAt: '2026-05-16', updatedAt: '2026-05-21', labels: [{ id: 'l12', name: 'docs', color: '#14b8a6' }], estimatedHours: 12, actualHours: 11, progress: 90, subtasks: [{ id: 's13', title: 'Endpoints', completed: true }, { id: 's14', title: 'Examples', completed: true }, { id: 's15', title: 'Review', completed: false }], comments: 4, attachments: 2, isRecurring: false, aiGenerated: false, storyPoints: 5, sprint: 'Sprint 12', order: 1, swimlane: 's1', blocked: false, watchers: 2, timeEstimate: 12, timeSpent: 11, dependencies: [] },
          ],
        },
        {
          id: 'testing', title: 'Testing', color: '#f97316', icon: Zap, limit: 8, wipLimit: 8,
          description: 'QA and testing phase',
          tasks: [
            { id: 'ts1', title: 'Mobile responsive testing', description: 'Test on iOS Safari, Android Chrome, and various screen sizes', status: 'testing', priority: 'high', assignee: { id: '4', name: 'Diana', avatar: 'DP' }, assignees: [{ id: '4', name: 'Diana', avatar: 'DP' }], dueDate: '2026-05-26', createdAt: '2026-05-17', updatedAt: '2026-05-21', labels: [{ id: 'l13', name: 'QA', color: '#f97316' }], estimatedHours: 10, actualHours: 4, progress: 40, subtasks: [{ id: 's16', title: 'iOS testing', completed: true }, { id: 's17', title: 'Android testing', completed: false }, { id: 's18', title: 'Tablet testing', completed: false }], comments: 2, attachments: 3, isRecurring: false, aiGenerated: false, storyPoints: 5, sprint: 'Sprint 12', order: 1, swimlane: 's1', blocked: false, watchers: 3, timeEstimate: 10, timeSpent: 4, dependencies: [] },
          ],
        },
        {
          id: 'done', title: 'Done', color: '#10b981', icon: CheckCircle2, limit: 50, wipLimit: 50,
          description: 'Completed tasks',
          tasks: [
            { id: 'd1', title: 'Fix mobile layout bugs', description: 'iOS Safari and Android Chrome layout fixes for modals', status: 'done', priority: 'high', assignee: { id: '1', name: 'Alice', avatar: 'AJ' }, assignees: [{ id: '1', name: 'Alice', avatar: 'AJ' }], dueDate: '2026-05-20', createdAt: '2026-05-10', updatedAt: '2026-05-20', labels: [{ id: 'l15', name: 'bug', color: '#ef4444' }], estimatedHours: 6, actualHours: 5, progress: 100, subtasks: [], comments: 2, attachments: 0, isRecurring: false, aiGenerated: false, storyPoints: 3, sprint: 'Sprint 11', order: 1, swimlane: 's1', blocked: false, watchers: 1, timeEstimate: 6, timeSpent: 5, dependencies: [] },
            { id: 'd2', title: 'Set up CI/CD pipeline', description: 'GitHub Actions with automated testing and deployment to Vercel', status: 'done', priority: 'high', assignee: { id: '2', name: 'Bob', avatar: 'BS' }, assignees: [{ id: '2', name: 'Bob', avatar: 'BS' }], dueDate: '2026-05-18', createdAt: '2026-05-05', updatedAt: '2026-05-18', labels: [{ id: 'l16', name: 'devops', color: '#6366f1' }], estimatedHours: 16, actualHours: 14, progress: 100, subtasks: [{ id: 's19', title: 'Setup workflow', completed: true }, { id: 's20', title: 'Add tests', completed: true }], comments: 3, attachments: 0, isRecurring: false, aiGenerated: false, storyPoints: 8, sprint: 'Sprint 11', order: 2, swimlane: 's1', blocked: false, watchers: 2, timeEstimate: 16, timeSpent: 14, dependencies: [] },
          ],
        },
      ])
      setIsLoading(false)
    }
    
    loadData()
    
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter tasks based on search and filters
  const getFilteredColumns = () => {
    return columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             task.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
        const matchesAssignee = filterAssignee === 'all' || 
          task.assignees.some(a => a.name.toLowerCase().includes(filterAssignee.toLowerCase()))
        return matchesSearch && matchesPriority && matchesAssignee
      }),
    }))
  }

  // Move task between statuses
  const handleStatusChange = (taskId: string, direction: 'left' | 'right') => {
    const statusOrder = ['backlog', 'todo', 'in_progress', 'review', 'testing', 'done']
    let taskFound: KanbanTask | null = null
    let fromColId = ''

    for (const col of columns) {
      const task = col.tasks.find(t => t.id === taskId)
      if (task) { taskFound = task; fromColId = col.id; break }
    }
    if (!taskFound) return

    const currentIndex = statusOrder.indexOf(taskFound.status)
    const newIndex = direction === 'right' ? Math.min(currentIndex + 1, statusOrder.length - 1) : Math.max(currentIndex - 1, 0)
    const newStatus = statusOrder[newIndex] as KanbanTask['status']
    if (newStatus === taskFound.status) return

    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => {
        if (col.id === fromColId) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        }
        if (col.id === newStatus) {
          return { ...col, tasks: [...col.tasks, { ...taskFound!, status: newStatus, updatedAt: new Date().toISOString() }] }
        }
        return col
      })
      return newColumns
    })
  }

  // Drag and drop handlers
  const handleDragStart = (taskId: string, columnId: string) => {
    setDraggedTask({ taskId, fromColumn: columnId })
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (toColumnId: string) => {
    if (!draggedTask) {
      setDragOverColumn(null)
      return
    }
    
    if (draggedTask.fromColumn === toColumnId) {
      setDraggedTask(null)
      setDragOverColumn(null)
      return
    }

    setColumns(prevColumns => {
      let taskToMove: KanbanTask | undefined
      const newColumns = prevColumns.map(col => {
        if (col.id === draggedTask.fromColumn) {
          const task = col.tasks.find(t => t.id === draggedTask.taskId)
          if (task) taskToMove = { ...task, status: toColumnId as KanbanTask['status'], updatedAt: new Date().toISOString() }
          return { ...col, tasks: col.tasks.filter(t => t.id !== draggedTask.taskId) }
        }
        if (col.id === toColumnId && taskToMove) {
          return { ...col, tasks: [...col.tasks, taskToMove] }
        }
        return col
      })
      return newColumns
    })
    
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Add new task
  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return
    
    const newTask: KanbanTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newTaskTitle.trim(),
      description: '',
      status: columnId as KanbanTask['status'],
      priority: 'medium',
      assignee: { id: 'current', name: 'Current User', avatar: 'CU' },
      assignees: [{ id: 'current', name: 'Current User', avatar: 'CU' }],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: [],
      estimatedHours: 1,
      actualHours: 0,
      progress: 0,
      subtasks: [],
      comments: 0,
      attachments: 0,
      isRecurring: false,
      aiGenerated: false,
      storyPoints: 1,
      sprint: 'Current',
      order: Date.now(),
      swimlane: 's1',
      blocked: false,
      watchers: 0,
      timeEstimate: 1,
      timeSpent: 0,
      dependencies: [],
    }
    
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    )
    setNewTaskTitle('')
    setShowAddTask(null)
  }

  // Delete task
  const deleteTask = (taskId: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => ({ ...col, tasks: col.tasks.filter(t => t.id !== taskId) }))
    )
  }

  // Edit and save task
  const editTask = (task: KanbanTask) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }
  
  const saveTask = (updatedTask: KanbanTask) => {
    setColumns(prevColumns => 
      prevColumns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : t)
      }))
    )
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  // Duplicate task
  const duplicateTask = (task: KanbanTask) => {
    const newTask: KanbanTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      comments: 0,
      attachments: 0,
    }
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === task.status 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    )
  }

  // Toggle column collapse
  const toggleCollapse = (columnId: string) => {
    setCollapsedColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnId)) {
        newSet.delete(columnId)
      } else {
        newSet.add(columnId)
      }
      return newSet
    })
  }

  // Export data
  const exportData = (format: 'json' | 'csv') => {
    const allTasks = columns.flatMap(col => col.tasks)
    
    if (format === 'json') {
      const dataStr = JSON.stringify(allTasks, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kanban-tasks-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const headers = ['ID', 'Title', 'Status', 'Priority', 'Due Date', 'Story Points', 'Progress', 'Labels']
      const csvRows = [headers]
      for (const task of allTasks) {
        csvRows.push([
          task.id,
          `"${task.title.replace(/"/g, '""')}"`,
          task.status,
          task.priority,
          task.dueDate,
          task.storyPoints.toString(),
          task.progress.toString(),
          `"${task.labels.map(l => l.name).join(', ')}"`,
        ])
      }
      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kanban-tasks-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    setShowExportMenu(false)
  }

  const filteredColumns = getFilteredColumns()
  const totalTasks = filteredColumns.reduce((sum, col) => sum + col.tasks.length, 0)
  const uniqueAssignees = [...new Set(columns.flatMap(col => col.tasks.flatMap(t => t.assignees.map(a => a.name))))]
  const overdueTasks = columns.flatMap(col => col.tasks).filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length
  const completedTasks = columns.find(c => c.id === 'done')?.tasks.length || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading kanban board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Kanban Board
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {totalTasks} tasks across {columns.length} columns
            </p>
          </div>
          
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* View mode toggle */}
            <div className="flex rounded-lg border bg-white dark:bg-gray-800 p-0.5">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'board' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4 inline mr-1" />
                Board
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'compact' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4 inline mr-1" />
                Compact
              </button>
            </div>

            {/* Stats toggle */}
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`p-2 rounded-lg border transition-colors ${
                showStats 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
              title={showStats ? "Hide statistics" : "Show statistics"}
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            {/* Activity log button */}
            <button 
              onClick={() => setShowActivityLog(!showActivityLog)}
              className={`p-2 rounded-lg border transition-colors ${
                showActivityLog 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
              title="Activity log"
            >
              <Activity className="w-5 h-5" />
            </button>

            {/* Export button */}
            <div className="relative" ref={exportMenuRef}>
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                title="Export data"
              >
                <Download className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-50 py-1"
                  >
                    <button onClick={() => exportData('json')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                      Export as JSON
                    </button>
                    <button onClick={() => exportData('csv')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                      Export as CSV
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
            >
              {filteredColumns.map(col => (
                <StatsCard key={col.id} column={col} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Log Panel */}
        <AnimatePresence>
          {showActivityLog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Recent Activity
                </h3>
                <button 
                  onClick={() => setShowActivityLog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activityLogs.map(log => (
                  <div key={log.id} className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">{log.user}</span> {log.action}
                    <span className="text-xs text-gray-400 ml-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tasks by title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
          
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            value={filterAssignee} 
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignees</option>
            {uniqueAssignees.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {(searchQuery || filterPriority !== 'all' || filterAssignee !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterPriority('all')
                setFilterAssignee('all')
              }}
              className="px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* KANBAN BOARD */}
        <div className="overflow-x-auto pb-4">
          <div className={`flex gap-4 ${viewMode === 'board' ? 'min-w-[1100px]' : 'min-w-full'}`}>
            {filteredColumns.map(column => {
              const isCollapsed = collapsedColumns.has(column.id)
              const overLimit = column.wipLimit && column.tasks.length >= column.wipLimit

              return (
                <div 
                  key={column.id} 
                  className={`flex-shrink-0 ${viewMode === 'board' ? 'w-80' : 'w-96'}`}
                >
                  <ColumnHeader
                    column={column}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => toggleCollapse(column.id)}
                    onAddTask={() => setShowAddTask(column.id)}
                  />

                  {/* WIP Limit Warning */}
                  {overLimit && !isCollapsed && (
                    <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                      <p className="text-xs text-red-600 dark:text-red-400">⚠️ WIP limit reached ({column.tasks.length}/{column.wipLimit})</p>
                    </div>
                  )}

                  {/* Add Task Input */}
                  <AnimatePresence>
                    {showAddTask === column.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg"
                      >
                        <input 
                          type="text" 
                          value={newTaskTitle} 
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTask(column.id)}
                          placeholder="Task title..." 
                          className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          autoFocus 
                        />
                        <div className="flex space-x-2 mt-2">
                          <button 
                            onClick={() => addTask(column.id)} 
                            className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                          >
                            Add
                          </button>
                          <button 
                            onClick={() => setShowAddTask(null)} 
                            className="px-4 py-1.5 border dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tasks Container */}
                  {!isCollapsed && (
                    <div
                      className={`space-y-2 min-h-[200px] rounded-xl p-2 transition-colors ${
                        dragOverColumn === column.id ? 'bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-300 dark:ring-blue-700' : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, column.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(column.id)}
                    >
                      <AnimatePresence mode="popLayout">
                        {column.tasks.map(task => (
                          <div 
                            key={task.id} 
                            draggable 
                            onDragStart={() => handleDragStart(task.id, column.id)}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <KanbanTaskCard 
                              task={task} 
                              onStatusChange={handleStatusChange} 
                              onEdit={editTask} 
                              onDelete={deleteTask} 
                              onDuplicate={duplicateTask}
                              isDragging={draggedTask?.taskId === task.id} 
                            />
                          </div>
                        ))}
                      </AnimatePresence>

                      {column.tasks.length === 0 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700"
                        >
                          <p className="text-sm text-gray-400 dark:text-gray-500">No tasks</p>
                          <button 
                            onClick={() => setShowAddTask(column.id)} 
                            className="text-sm text-blue-500 hover:text-blue-600 mt-1 font-medium"
                          >
                            + Add task
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-between items-center gap-3 text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 dark:text-gray-400">📊 Summary</span>
              <span className="text-gray-700 dark:text-gray-300">{totalTasks} total tasks</span>
              <span className="text-green-600 dark:text-green-400">✓ {completedTasks} completed</span>
              <span className="text-red-500">⚠️ {overdueTasks} overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Drag tasks between columns</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT TASK MODAL */}
      <AnimatePresence>
        {showTaskModal && selectedTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Task</h2>
                <button 
                  onClick={() => setShowTaskModal(false)} 
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={selectedTask.title}
                    onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea 
                    value={selectedTask.description}
                    onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} 
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select 
                      value={selectedTask.priority}
                      onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value as KanbanTask['priority'] })}
                      className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Points</label>
                    <input 
                      type="number" 
                      value={selectedTask.storyPoints}
                      onChange={(e) => setSelectedTask({ ...selectedTask, storyPoints: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" 
                      min="0" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                    <input 
                      type="date" 
                      value={selectedTask.dueDate}
                      onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Progress (%)</label>
                    <input 
                      type="number" 
                      value={selectedTask.progress}
                      onChange={(e) => setSelectedTask({ ...selectedTask, progress: Math.min(100, parseInt(e.target.value) || 0) })}
                      className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" 
                      min="0" 
                      max="100" 
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => { saveTask(selectedTask); }}
                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setShowTaskModal(false)} 
                    className="px-6 py-2.5 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}