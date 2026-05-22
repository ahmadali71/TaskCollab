// src/pages/Tasks.tsx - Complete Task Management Page with 3D & Dark Mode
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Plus, Search, Filter, X, Grid3X3, List, MoreVertical,
  Calendar, User, Tag, Clock, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Star, Download, Upload,
  Sliders, LayoutDashboard, SortAsc, SortDesc,
  Eye, EyeOff, Copy, Archive, Trash2, Edit,
  MessageSquare, Paperclip, Share2, RefreshCw,
  Play, Pause, Zap, Target, Award, Flame,
  GripVertical, ArrowUp, ArrowDown, Move, Sparkles,
  BarChart3, PieChart, Activity, Layers, GitBranch,
  Users, Clock8, Flag, CalendarDays, CheckCheck,
  AlertCircle, Info, Loader2, Settings, Undo2, Redo2,
  Bookmark, Bell, Link2, Maximize2, Minimize2,
  Moon, Sun, Monitor, DownloadCloud, UploadCloud,
  HardDrive, FolderKanban, UserCheck, UserX,
  Briefcase, Hourglass, Rocket, Shield, Zap as ZapIcon
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface TaskLabel {
  id: string
  name: string
  color: string
}

interface TaskAssignee {
  id: string
  name: string
  avatar: string
  email?: string
  role?: string
}

interface SubTask {
  id: string
  title: string
  completed: boolean
  createdAt?: string
}

interface Comment {
  id: string
  author: TaskAssignee
  content: string
  createdAt: string
  attachments?: string[]
}

interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

interface ActivityLog {
  id: string
  action: string
  user: TaskAssignee
  timestamp: string
  details?: string
}

interface Task {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: TaskAssignee
  assignees: TaskAssignee[]
  dueDate: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  labels: TaskLabel[]
  estimatedHours: number
  actualHours: number
  progress: number
  subtasks: SubTask[]
  comments: Comment[]
  attachments: Attachment[]
  activityLog: ActivityLog[]
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'custom'
  recurringEndDate?: string
  aiGenerated: boolean
  aiPriority?: number
  aiSuggestions?: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  dependencies: string[]
  blockedBy: string[]
  order: number
  boardId?: string
  isOverdue: boolean
  sprintId?: string
  storyPoints?: number
  isArchived: boolean
  tags: string[]
  timeTracked?: number
  lastTimeTrackStart?: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
  color: string
  limit?: number
  wipLimit?: number
}

interface Board {
  id: string
  name: string
  columns: Column[]
  createdAt: string
  updatedAt: string
}

interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  goals: string[]
  isActive: boolean
  tasks: string[]
}

interface TaskFilter {
  search: string
  status: string
  priority: string
  assignee: string
  label: string
  dueDate: string
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title' | 'progress' | 'storyPoints' | 'estimatedHours'
  sortOrder: 'asc' | 'desc'
  tags: string[]
  assignees: string[]
  labels: string[]
  showArchived: boolean
  sprintId?: string
}

interface ViewSettings {
  density: 'compact' | 'comfortable' | 'spacious'
  showLabels: boolean
  showProgress: boolean
  showAssignee: boolean
  showDueDate: boolean
  cardSize: 'small' | 'medium' | 'large'
}

// ============================================
// UTILITIES
// ============================================
const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const formatRelativeTime = (date: string) => {
  const diff = new Date(date).getTime() - new Date().getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return `${Math.abs(days)} days overdue`
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `${days} days left`
}

// ============================================
// 3D CARD COMPONENT (with dark mode support)
// ============================================
const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  depth?: number
  glow?: boolean
  onClick?: () => void
}> = ({ children, className = '', depth = 20, glow = false, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.02, z: 20, transition: { duration: 0.2 } }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${glow ? 'hover:shadow-blue-500/30' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }} className="h-full">
        {children}
      </div>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}

// ============================================
// PRIORITY BADGE (with dark mode)
// ============================================
const PriorityBadge: React.FC<{ priority: Task['priority']; size?: 'sm' | 'md' }> = ({ priority, size = 'md' }) => {
  const config: Record<string, { bg: string; text: string; icon: string; label: string }> = {
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: '🔴', label: 'Critical' },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: '🟠', label: 'High' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: '🟡', label: 'Medium' },
    low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: '🟢', label: 'Low' },
  }
  const c = config[priority]
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'
  return (
    <span className={`inline-flex items-center space-x-1 ${sizeClasses} rounded-full font-medium ${c.bg} ${c.text}`}>
      <span>{c.icon}</span>
      <span>{c.label}</span>
    </span>
  )
}

// ============================================
// STATUS BADGE (with dark mode)
// ============================================
const StatusBadge: React.FC<{ status: Task['status']; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const config: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    backlog: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', label: 'Backlog', icon: '📋' },
    todo: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'To Do', icon: '📝' },
    in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Progress', icon: '⚡' },
    review: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Review', icon: '👀' },
    done: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Done', icon: '✅' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Cancelled', icon: '❌' },
  }
  const c = config[status]
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'
  return (
    <span className={`inline-flex items-center space-x-1 ${sizeClasses} rounded-full font-medium ${c.bg} ${c.text}`}>
      <span>{c.icon}</span>
      <span>{c.label}</span>
    </span>
  )
}

// ============================================
// PROGRESS INDICATOR (with dark mode)
// ============================================
const ProgressIndicator: React.FC<{ 
  progress: number; 
  size?: 'sm' | 'md' | 'lg'; 
  showLabel?: boolean;
  className?: string;
}> = ({ progress, size = 'md', showLabel = false, className = '' }) => {
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' }
  const getColor = () => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex-1 ${heights[size]} bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{progress}%</span>}
    </div>
  )
}

// ============================================
// TIME TRACKER COMPONENT (with dark mode)
// ============================================
const TimeTracker: React.FC<{ taskId: string; initialTime?: number; onTimeUpdate?: (taskId: string, time: number) => void }> = 
({ taskId, initialTime = 0, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(initialTime)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning])

  useEffect(() => {
    onTimeUpdate?.(taskId, time)
  }, [time, taskId, onTimeUpdate])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-1.5">
      <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
      <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300">{formatTime(time)}</span>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className={`p-1 rounded-full transition-colors ${isRunning ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
      >
        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

// ============================================
// TASK CARD (KANBAN VIEW) - Full 3D with dark mode
// ============================================
const KanbanTaskCard: React.FC<{
  task: Task
  onStatusChange: (taskId: string, newStatus: Task['status']) => void
  onDelete: (taskId: string) => void
  onEdit: (task: Task) => void
  onDuplicate: (task: Task) => void
  onArchive: (taskId: string) => void
  onTimeUpdate?: (taskId: string, time: number) => void
  isDragging?: boolean
  viewSettings: ViewSettings
}> = ({ task, onStatusChange, onDelete, onEdit, onDuplicate, onArchive, onTimeUpdate, isDragging, viewSettings }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  const getCardPadding = () => {
    switch (viewSettings.density) {
      case 'compact': return 'p-3'
      case 'spacious': return 'p-5'
      default: return 'p-4'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) onStatusChange(task.id, 'done')
        else if (info.offset.x < -100) onStatusChange(task.id, 'backlog')
      }}
      className={`relative bg-white dark:bg-gray-800 rounded-xl border-l-4 shadow-md hover:shadow-xl transition-all cursor-grab active:cursor-grabbing ${
        task.priority === 'critical' ? 'border-l-red-500' :
        task.priority === 'high' ? 'border-l-orange-500' :
        task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
      } ${isDragging ? 'shadow-2xl rotate-2 scale-105 z-50' : ''}`}
    >
      <div className={getCardPadding()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <PriorityBadge priority={task.priority} size="sm" />
            {task.aiGenerated && (
              <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded-full flex items-center">
                <Sparkles className="w-3 h-3 mr-0.5" /> AI
              </span>
            )}
          </div>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50 py-1">
                  <button onClick={() => { onEdit(task); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Edit className="w-4 h-4" /><span>Edit</span>
                  </button>
                  <button onClick={() => { onDuplicate(task); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Copy className="w-4 h-4" /><span>Duplicate</span>
                  </button>
                  <button onClick={() => { onArchive(task.id); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Archive className="w-4 h-4" /><span>Archive</span>
                  </button>
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={() => { setShowTimeTracker(!showTimeTracker); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4" /><span>Track Time</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Bell className="w-4 h-4" /><span>Remind me</span>
                  </button>
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={() => { onDelete(task.id); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" /><span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <Link to={`/tasks/${task.id}`} className="block mb-2">
          <h3 className={`font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
            {task.title}
          </h3>
        </Link>
        
        {/* Description */}
        {task.description && viewSettings.density !== 'compact' && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Labels */}
        {viewSettings.showLabels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.slice(0, 3).map(label => (
              <span key={label.id} className="px-2 py-0.5 text-xs rounded-full text-white shadow-sm" style={{ backgroundColor: label.color }}>
                {label.name}
              </span>
            ))}
            {task.labels.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">+{task.labels.length - 3}</span>
            )}
          </div>
        )}

        {/* Progress */}
        {viewSettings.showProgress && task.progress > 0 && (
          <div className="mb-3">
            <ProgressIndicator progress={task.progress} size="sm" showLabel={viewSettings.density !== 'compact'} />
          </div>
        )}

        {/* Time Tracker */}
        {showTimeTracker && (
          <div className="mb-3">
            <TimeTracker taskId={task.id} initialTime={task.timeTracked} onTimeUpdate={onTimeUpdate} />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            {viewSettings.showDueDate && (
              <span className={`flex items-center ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="flex items-center">
                <CheckCheck className="w-3 h-3 mr-1" />
                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
              </span>
            )}
            {task.comments.length > 0 && (
              <span className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {task.comments.length}
              </span>
            )}
            {task.attachments.length > 0 && (
              <span className="flex items-center">
                <Paperclip className="w-3 h-3 mr-1" />
                {task.attachments.length}
              </span>
            )}
            {task.storyPoints && (
              <span className="flex items-center">
                <ZapIcon className="w-3 h-3 mr-1" />
                {task.storyPoints} pts
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {viewSettings.showAssignee && task.assignees.slice(0, 2).map((a, i) => (
              <div key={a.id} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium shadow-sm"
                title={a.name}>
                {a.avatar || a.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {task.assignees.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{task.assignees.length - 2}</span>
            )}
            {isOverdue && (
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-xs">
                ⚠️
              </motion.span>
            )}
            {task.blockedBy.length > 0 && (
              <span className="text-xs text-orange-500" title={`Blocked by ${task.blockedBy.length} tasks`}>🚫</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// TASK ROW (LIST VIEW) with dark mode
// ============================================
const TaskRow: React.FC<{
  task: Task
  onStatusChange: (taskId: string, newStatus: Task['status']) => void
  onDelete: (taskId: string) => void
  onEdit: (task: Task) => void
  isSelected?: boolean
  onSelect?: (taskId: string) => void
}> = ({ task, onStatusChange, onDelete, onEdit, isSelected, onSelect }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border-b dark:border-gray-700 ${isSelected ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => onSelect?.(task.id)}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={() => onStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
          }`}
        >
          {task.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>
      </div>
      
      <div className="flex-1 min-w-0 px-4">
        <div className="flex items-center space-x-2">
          <Link to={`/tasks/${task.id}`} className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 truncate ${task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </Link>
          {task.aiGenerated && <Sparkles className="w-3 h-3 text-purple-500" />}
        </div>
        {task.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{task.description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <PriorityBadge priority={task.priority} size="sm" />
        <StatusBadge status={task.status} size="sm" />
        <span className={`text-sm whitespace-nowrap ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          {formatDate(task.dueDate)}
        </span>
        <div className="w-24">
          <ProgressIndicator progress={task.progress} size="sm" />
        </div>
        <div className="flex items-center space-x-1 -space-x-1">
          {task.assignees.slice(0, 2).map(a => (
            <div key={a.id} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white dark:ring-gray-800">
              {a.avatar || a.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// ============================================
// TASK DETAIL MODAL with dark mode
// ============================================
const TaskDetailModal: React.FC<{
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onAddComment: (taskId: string, comment: string) => void
}> = ({ task, isOpen, onClose, onUpdate, onAddComment }) => {
  const [comment, setComment] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!task || !isOpen) return null

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(task.id, comment)
      setComment('')
    }
  }

  const toggleStatus = () => {
    const statusOrder: Task['status'][] = ['backlog', 'todo', 'in_progress', 'review', 'done']
    const currentIndex = statusOrder.indexOf(task.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
    onUpdate(task.id, { status: nextStatus })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-4xl w-full max-h-[90vh]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center space-x-3">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {task.aiGenerated && (
                <span className="flex items-center space-x-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Generated</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                {isFullscreen ? <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                </div>

                {/* Subtasks */}
                {task.subtasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <CheckCheck className="w-5 h-5 mr-2" />
                      Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                    </h3>
                    <div className="space-y-2">
                      {task.subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => onUpdate(task.id, {
                              subtasks: task.subtasks.map(s => s.id === subtask.id ? { ...s, completed: !s.completed } : s)
                            })}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                          />
                          <span className={subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Comments ({task.comments.length})
                  </h3>
                  <div className="space-y-4 mb-4">
                    {task.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {comment.author.avatar || comment.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.author.name}</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button onClick={handleAddComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      <button onClick={toggleStatus} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {task.status}
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500 font-medium' : 'text-gray-900 dark:text-white'}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Created</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(task.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Est. Hours</span>
                      <span className="text-gray-900 dark:text-white">{task.estimatedHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Actual Hours</span>
                      <span className="text-gray-900 dark:text-white">{task.actualHours}h</span>
                    </div>
                    {task.storyPoints && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Story Points</span>
                        <span className="text-gray-900 dark:text-white">{task.storyPoints}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assignees */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Assignees
                  </h3>
                  <div className="space-y-2">
                    {task.assignees.map(assignee => (
                      <div key={assignee.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {assignee.avatar || assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{assignee.name}</div>
                          {assignee.email && <div className="text-xs text-gray-400 dark:text-gray-500">{assignee.email}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labels */}
                {task.labels.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Labels
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {task.labels.map(label => (
                        <span key={label.id} className="px-2 py-1 text-xs rounded-full text-white shadow-sm" style={{ backgroundColor: label.color }}>
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {task.attachments.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attachments ({task.attachments.length})
                    </h3>
                    <div className="space-y-2">
                      {task.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 truncate">{attachment.name}</span>
                          <span className="text-gray-400 dark:text-gray-500 text-xs">{(attachment.size / 1024).toFixed(1)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <TimeTracker taskId={task.id} initialTime={task.timeTracked} onTimeUpdate={(id, time) => onUpdate(id, { timeTracked: time })} />
            <button onClick={() => onUpdate(task.id, { isArchived: true })} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2">
              <Archive className="w-4 h-4" /><span>Archive</span>
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// NEW TASK MODAL with dark mode
// ============================================
const NewTaskModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onCreate: (task: Partial<Task>) => void
  defaultStatus?: Task['status']
  editingTask?: Task | null
  onUpdate?: (taskId: string, updates: Partial<Task>) => void
}> = ({ isOpen, onClose, onCreate, defaultStatus = 'todo', editingTask, onUpdate }) => {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium' as Task['priority'],
    status: defaultStatus, dueDate: '', estimatedHours: 1, storyPoints: 0,
    labels: [] as { name: string; color: string }[],
    assignees: [] as string[],
    subtasks: [] as string[],
  })
  const [newLabel, setNewLabel] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#3b82f6')
  const [newSubtask, setNewSubtask] = useState('')
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate,
        estimatedHours: editingTask.estimatedHours,
        storyPoints: editingTask.storyPoints || 0,
        labels: editingTask.labels.map(l => ({ name: l.name, color: l.color })),
        assignees: editingTask.assignees.map(a => a.name),
        subtasks: editingTask.subtasks.map(s => s.title),
      })
    } else {
      setForm({
        title: '', description: '', priority: 'medium', status: defaultStatus,
        dueDate: '', estimatedHours: 1, storyPoints: 0, labels: [], assignees: [], subtasks: []
      })
    }
  }, [editingTask, defaultStatus])

  const handleSubmit = () => {
    if (!form.title.trim()) return
    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate,
        estimatedHours: form.estimatedHours,
        storyPoints: form.storyPoints,
        labels: form.labels.map((l, i) => ({ id: `label-${i}`, name: l.name, color: l.color })),
        subtasks: form.subtasks.map((s, i) => ({ id: `sub-${i}`, title: s, completed: false })),
      })
    } else {
      onCreate({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedHours: form.estimatedHours,
        storyPoints: form.storyPoints,
        labels: form.labels.map((l, i) => ({ id: `label-${i}`, name: l.name, color: l.color })),
        subtasks: form.subtasks.map((s, i) => ({ id: `sub-${i}`, title: s, completed: false })),
      })
    }
    onClose()
  }

  const generateAITask = async () => {
    setIsAIGenerating(true)
    setTimeout(() => {
      setForm({
        ...form,
        title: 'AI-Generated Task: Implement intelligent task suggestions',
        description: 'This task was automatically generated by AI based on project patterns. It includes smart prioritization and estimated effort based on historical data.',
        priority: 'high',
        estimatedHours: 8,
        storyPoints: 5,
        labels: [...form.labels, { name: 'AI Generated', color: '#8b5cf6' }],
      })
      setIsAIGenerating(false)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={generateAITask}
                  disabled={isAIGenerating}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {isAIGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>AI Generate</span>
                </button>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Task title" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="low">Low</option><option value="medium">Medium</option>
                    <option value="high">High</option><option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="backlog">Backlog</option><option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option><option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Points</label>
                  <input type="number" value={form.storyPoints} onChange={(e) => setForm({ ...form, storyPoints: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" min="0" max="21" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Est. Hours</label>
                  <input type="number" value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" min="1" max="100" />
                </div>
              </div>

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Labels</label>
                <div className="flex space-x-2">
                  <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" placeholder="Label name" />
                  <input type="color" value={newLabelColor} onChange={(e) => setNewLabelColor(e.target.value)}
                    className="w-12 h-11 rounded-lg border cursor-pointer" />
                  <button onClick={() => { if (newLabel) { setForm({ ...form, labels: [...form.labels, { name: newLabel, color: newLabelColor }] }); setNewLabel(''); setNewLabelColor('#3b82f6') } }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                {form.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.labels.map((label, i) => (
                      <span key={i} className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs text-white shadow-sm" style={{ backgroundColor: label.color }}>
                        <span>{label.name}</span>
                        <button onClick={() => setForm({ ...form, labels: form.labels.filter((_, j) => j !== i) })}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtasks</label>
                <div className="flex space-x-2">
                  <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), newSubtask && (setForm({ ...form, subtasks: [...form.subtasks, newSubtask] }), setNewSubtask('')))}
                    className="flex-1 px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" placeholder="Subtask title" />
                  <button onClick={() => { if (newSubtask) { setForm({ ...form, subtasks: [...form.subtasks, newSubtask] }); setNewSubtask('') } }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                {form.subtasks.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {form.subtasks.map((subtask, i) => (
                      <div key={i} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{subtask}</span>
                        <button onClick={() => setForm({ ...form, subtasks: form.subtasks.filter((_, j) => j !== i) })}>
                          <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button onClick={handleSubmit} disabled={!form.title.trim()}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 transition-colors">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button onClick={onClose} className="px-6 py-2.5 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// ANALYTICS DASHBOARD with dark mode
// ============================================
const AnalyticsDashboard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length
    const completionRate = total > 0 ? (completed / total) * 100 : 0
    
    const avgProgress = tasks.reduce((acc, t) => acc + t.progress, 0) / (total || 1)
    const totalEstimatedHours = tasks.reduce((acc, t) => acc + t.estimatedHours, 0)
    const totalActualHours = tasks.reduce((acc, t) => acc + t.actualHours, 0)
    const timeAccuracy = totalEstimatedHours > 0 ? (totalActualHours / totalEstimatedHours) * 100 : 0
    
    const priorityBreakdown = {
      critical: tasks.filter(t => t.priority === 'critical').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }
    
    const statusBreakdown = {
      backlog: tasks.filter(t => t.status === 'backlog').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    }
    
    return { total, completed, inProgress, overdue, completionRate, avgProgress, totalEstimatedHours, totalActualHours, timeAccuracy, priorityBreakdown, statusBreakdown }
  }, [tasks])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
        Analytics Dashboard
      </h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card3D depth={10} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <ProgressIndicator progress={stats.completionRate} size="sm" className="mt-3" />
        </Card3D>
        
        <Card3D depth={10} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgProgress.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <ProgressIndicator progress={stats.avgProgress} size="sm" className="mt-3" />
        </Card3D>
        
        <Card3D depth={10} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Tasks</p>
              <p className={`text-2xl font-bold ${stats.overdue > 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stats.overdue > 0 ? 'Needs attention' : 'All on track'}</p>
        </Card3D>
        
        <Card3D depth={10} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Accuracy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.timeAccuracy.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Actual vs Estimated</p>
        </Card3D>
      </div>
      
      {/* Priority Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card3D depth={10} className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Flag className="w-4 h-4 mr-2" />
            Priority Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.priorityBreakdown).map(([priority, count]) => (
              <div key={priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{priority}</span>
                  <span className="text-gray-900 dark:text-white">{count} tasks</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / stats.total) * 100}%` }}
                    className={`h-full rounded-full ${
                      priority === 'critical' ? 'bg-red-500' :
                      priority === 'high' ? 'bg-orange-500' :
                      priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card3D>
        
        {/* Status Distribution */}
        <Card3D depth={10} className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Status Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{status.replace('_', ' ')}</span>
                  <span className="text-gray-900 dark:text-white">{count} tasks</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / stats.total) * 100}%` }}
                    className={`h-full rounded-full ${
                      status === 'done' ? 'bg-green-500' :
                      status === 'in_progress' ? 'bg-yellow-500' :
                      status === 'review' ? 'bg-purple-500' :
                      status === 'todo' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card3D>
      </div>
      
      {/* Time Tracking Summary */}
      <Card3D depth={10} className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Hourglass className="w-4 h-4 mr-2" />
          Time Tracking Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Estimated</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalEstimatedHours}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Actual</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalActualHours}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Variance</p>
            <p className={`text-xl font-bold ${stats.totalActualHours > stats.totalEstimatedHours ? 'text-red-500' : 'text-green-500'}`}>
              {stats.totalActualHours > stats.totalEstimatedHours ? '+' : ''}{stats.totalActualHours - stats.totalEstimatedHours}h
            </p>
          </div>
        </div>
      </Card3D>
    </motion.div>
  )
}

// ============================================
// MAIN TASKS COMPONENT - FULL 3D WITH DARK MODE
// ============================================
export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'grid' | 'analytics'>('kanban')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<Task['status']>('todo')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    density: 'comfortable',
    showLabels: true,
    showProgress: true,
    showAssignee: true,
    showDueDate: true,
    cardSize: 'medium'
  })
  const [showViewSettings, setShowViewSettings] = useState(false)
  const [undoStack, setUndoStack] = useState<{ action: string; data: any }[]>([])
  const [redoStack, setRedoStack] = useState<{ action: string; data: any }[]>([])
  
  const [filters, setFilters] = useState<TaskFilter>({
    search: '', status: 'all', priority: 'all', assignee: 'all',
    label: 'all', dueDate: '', sortBy: 'dueDate', sortOrder: 'asc',
    tags: [], assignees: [], labels: [], showArchived: false
  })

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark'
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const columns: Column[] = [
    { id: 'backlog', title: 'Backlog', tasks: [], color: 'bg-gray-400', limit: 50, wipLimit: 20 },
    { id: 'todo', title: 'To Do', tasks: [], color: 'bg-blue-500', limit: 30, wipLimit: 15 },
    { id: 'in_progress', title: 'In Progress', tasks: [], color: 'bg-yellow-500', limit: 10, wipLimit: 5 },
    { id: 'review', title: 'Review', tasks: [], color: 'bg-purple-500', limit: 15, wipLimit: 8 },
    { id: 'done', title: 'Done', tasks: [], color: 'bg-green-500', limit: undefined, wipLimit: undefined },
    { id: 'cancelled', title: 'Cancelled', tasks: [], color: 'bg-red-400', limit: undefined, wipLimit: undefined },
  ]

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      const mockTasks: Task[] = [
        { id: '1', title: 'Design new dashboard layout', description: 'Create 3D dashboard with modern UI featuring glassmorphism and animations', status: 'in_progress', priority: 'high', assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', role: 'Designer' }, assignees: [{ id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com' }], dueDate: '2026-05-25', createdAt: '2026-05-20', updatedAt: '2026-05-21', labels: [{ id: 'l1', name: 'design', color: '#3b82f6' }, { id: 'l2', name: 'ui/ux', color: '#ec4899' }], estimatedHours: 8, actualHours: 3, progress: 65, subtasks: [{ id: 's1', title: 'Create wireframes', completed: true }, { id: 's2', title: 'Implement glass morphism', completed: false }], comments: [{ id: 'c1', author: { id: '2', name: 'Bob', avatar: 'B' }, content: 'Great progress!', createdAt: '2026-05-21T10:00:00Z' }], attachments: [{ id: 'a1', name: 'design.fig', url: '', size: 2048, type: 'figma', uploadedAt: '2026-05-20' }], activityLog: [], isRecurring: false, aiGenerated: false, sentiment: 'positive', dependencies: [], blockedBy: [], order: 0, isOverdue: false, tags: ['urgent', 'frontend'], timeTracked: 3600, isArchived: false, storyPoints: 5 },
        { id: '2', title: 'Implement real-time collaboration', description: 'WebSocket connections for live updates with presence indicators', status: 'todo', priority: 'critical', assignee: { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', role: 'Backend' }, assignees: [{ id: '2', name: 'Bob Smith', avatar: 'BS' }], dueDate: '2026-05-23', createdAt: '2026-05-19', updatedAt: '2026-05-21', labels: [{ id: 'l3', name: 'backend', color: '#10b981' }, { id: 'l4', name: 'websocket', color: '#6366f1' }], estimatedHours: 16, actualHours: 0, progress: 10, subtasks: [], comments: [], attachments: [], activityLog: [], isRecurring: false, aiGenerated: true, aiPriority: 95, aiSuggestions: ['Use Socket.io', 'Implement retry logic'], sentiment: 'neutral', dependencies: [], blockedBy: ['1'], order: 1, isOverdue: true, tags: ['critical', 'backend'], timeTracked: 0, isArchived: false, storyPoints: 8 },
        { id: '3', title: 'Write API documentation', description: 'OpenAPI 3.0 documentation with interactive examples', status: 'review', priority: 'medium', assignee: { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com', role: 'Tech Writer' }, assignees: [{ id: '3', name: 'Charlie Brown', avatar: 'CB' }], dueDate: '2026-05-28', createdAt: '2026-05-18', updatedAt: '2026-05-21', labels: [{ id: 'l5', name: 'docs', color: '#8b5cf6' }], estimatedHours: 12, actualHours: 10, progress: 85, subtasks: [{ id: 's3', title: 'Write overview', completed: true }, { id: 's4', title: 'Add examples', completed: true }, { id: 's5', title: 'Review with team', completed: false }], comments: [], attachments: [], activityLog: [], isRecurring: false, aiGenerated: false, sentiment: 'positive', dependencies: ['2'], blockedBy: [], order: 2, isOverdue: false, tags: ['documentation'], timeTracked: 36000, isArchived: false, storyPoints: 3 },
        { id: '4', title: 'Fix mobile layout bugs', description: 'iOS Safari and Chrome rendering issues on mobile devices', status: 'done', priority: 'high', assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ' }, assignees: [{ id: '1', name: 'Alice Johnson', avatar: 'AJ' }], dueDate: '2026-05-20', createdAt: '2026-05-15', updatedAt: '2026-05-20', completedAt: '2026-05-20', labels: [{ id: 'l6', name: 'bug', color: '#ef4444' }, { id: 'l7', name: 'mobile', color: '#f59e0b' }], estimatedHours: 6, actualHours: 5, progress: 100, subtasks: [], comments: [], attachments: [], activityLog: [], isRecurring: false, aiGenerated: false, sentiment: 'positive', dependencies: [], blockedBy: [], order: 3, isOverdue: false, tags: ['bug', 'mobile'], timeTracked: 18000, isArchived: false, storyPoints: 2 },
        { id: '5', title: 'Set up CI/CD pipeline', description: 'GitHub Actions automation for testing and deployment', status: 'in_progress', priority: 'high', assignee: { id: '2', name: 'Bob Smith', avatar: 'BS' }, assignees: [{ id: '2', name: 'Bob Smith', avatar: 'BS' }, { id: '4', name: 'Diana Prince', avatar: 'DP' }], dueDate: '2026-05-30', createdAt: '2026-05-17', updatedAt: '2026-05-21', labels: [{ id: 'l8', name: 'devops', color: '#f59e0b' }], estimatedHours: 10, actualHours: 4, progress: 45, subtasks: [{ id: 's6', title: 'Setup GitHub Actions', completed: true }, { id: 's7', title: 'Configure tests', completed: false }], comments: [], attachments: [], activityLog: [], isRecurring: false, aiGenerated: true, aiPriority: 85, aiSuggestions: ['Add caching', 'Parallelize jobs'], sentiment: 'neutral', dependencies: [], blockedBy: [], order: 4, isOverdue: false, tags: ['devops', 'automation'], timeTracked: 14400, isArchived: false, storyPoints: 5 },
        { id: '6', title: 'Database optimization', description: 'Add indexes and optimize slow queries for performance', status: 'backlog', priority: 'medium', assignee: { id: '3', name: 'Charlie Brown', avatar: 'CB' }, assignees: [{ id: '3', name: 'Charlie Brown', avatar: 'CB' }], dueDate: '2026-06-01', createdAt: '2026-05-16', updatedAt: '2026-05-21', labels: [{ id: 'l9', name: 'performance', color: '#ec4899' }], estimatedHours: 20, actualHours: 0, progress: 5, subtasks: [], comments: [], attachments: [], activityLog: [], isRecurring: false, aiGenerated: false, sentiment: 'neutral', dependencies: ['5'], blockedBy: ['2'], order: 5, isOverdue: false, tags: ['database', 'performance'], timeTracked: 0, isArchived: false, storyPoints: 8 },
        { id: '7', title: 'Dark mode implementation', description: 'System-wide dark theme with theme switching', status: 'todo', priority: 'low', assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ' }, assignees: [{ id: '1', name: 'Alice Johnson', avatar: 'AJ' }], dueDate: '2026-06-10', createdAt: '2026-05-14', updatedAt: '2026-05-21', labels: [{ id: 'l10', name: 'feature', color: '#3b82f6' }], estimatedHours: 8, actualHours: 0, progress: 0, subtasks: [], comments: [], attachments: [], activityLog: [], isRecurring: false, aiGenerated: false, sentiment: 'positive', dependencies: ['1'], blockedBy: [], order: 6, isOverdue: false, tags: ['ui', 'theme'], timeTracked: 0, isArchived: false, storyPoints: 3 },
        { id: '8', title: 'Weekly team sync', description: 'Team synchronization meeting every Monday', status: 'todo', priority: 'medium', assignee: { id: '4', name: 'Diana Prince', avatar: 'DP' }, assignees: [{ id: '4', name: 'Diana Prince', avatar: 'DP' }], dueDate: '2026-05-26', createdAt: '2026-05-01', updatedAt: '2026-05-21', labels: [{ id: 'l11', name: 'meeting', color: '#6366f1' }], estimatedHours: 1, actualHours: 0, progress: 0, subtasks: [], comments: [], attachments: [], activityLog: [], isRecurring: true, recurringPattern: 'weekly', aiGenerated: false, sentiment: 'neutral', dependencies: [], blockedBy: [], order: 7, isOverdue: false, tags: ['meeting', 'recurring'], timeTracked: 0, isArchived: false, storyPoints: 1 },
      ]
      setTasks(mockTasks)
      setIsLoading(false)
    }, 800)
  }, [])

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !task.description.toLowerCase().includes(filters.search.toLowerCase())) return false
        if (filters.status !== 'all' && task.status !== filters.status) return false
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false
        if (filters.assignee !== 'all' && !task.assignees.some(a => a.name === filters.assignee)) return false
        if (filters.label !== 'all' && !task.labels.some(l => l.name === filters.label)) return false
        if (!filters.showArchived && task.isArchived) return false
        return true
      })
      .sort((a, b) => {
        let comparison = 0
        switch (filters.sortBy) {
          case 'dueDate': comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); break
          case 'priority': { const p = { critical: 4, high: 3, medium: 2, low: 1 }; comparison = (p[b.priority] || 0) - (p[a.priority] || 0); break }
          case 'createdAt': comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); break
          case 'title': comparison = a.title.localeCompare(b.title); break
          case 'progress': comparison = b.progress - a.progress; break
          case 'storyPoints': comparison = (b.storyPoints || 0) - (a.storyPoints || 0); break
          case 'estimatedHours': comparison = b.estimatedHours - a.estimatedHours; break
        }
        return filters.sortOrder === 'asc' ? comparison : -comparison
      })
  }, [tasks, filters])

  // Get tasks for each column
  const getColumnTasks = (columnId: string) => {
    return filteredTasks.filter(t => t.status === columnId && !t.isArchived)
  }

  // Handlers
  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString(), progress: newStatus === 'done' ? 100 : t.progress } : t))
  }

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: { id: 'current', name: 'Current User', avatar: 'CU', email: 'user@example.com' },
      assignees: [{ id: 'current', name: 'Current User', avatar: 'CU' }],
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: taskData.labels || [],
      estimatedHours: taskData.estimatedHours || 1,
      actualHours: 0,
      progress: 0,
      subtasks: taskData.subtasks || [],
      comments: [],
      attachments: [],
      activityLog: [],
      isRecurring: false,
      aiGenerated: false,
      sentiment: 'neutral',
      dependencies: [],
      blockedBy: [],
      order: tasks.length,
      isOverdue: false,
      tags: [],
      timeTracked: 0,
      isArchived: false,
      storyPoints: taskData.storyPoints || 0,
    }
    setTasks([newTask, ...tasks])
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
  }

  const handleDuplicate = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'todo',
      progress: 0,
      completedAt: undefined,
    }
    setTasks([newTask, ...tasks])
  }

  const handleArchive = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isArchived: true } : t))
  }

  const handleTimeUpdate = (taskId: string, time: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, timeTracked: time } : t))
  }

  const handleAddComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: { id: 'current', name: 'Current User', avatar: 'CU' },
      content,
      createdAt: new Date().toISOString(),
    }
    setTasks(tasks.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t))
  }

  const stats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === 'todo').length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
    review: filteredTasks.filter(t => t.status === 'review').length,
    done: filteredTasks.filter(t => t.status === 'done').length,
    backlog: filteredTasks.filter(t => t.status === 'backlog').length,
    overdue: filteredTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FolderKanban className="w-8 h-8 mr-2 text-blue-500" />
              Tasks
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 dark:text-gray-400 mt-1">
              {stats.total} active tasks • {stats.overdue} overdue • {stats.done} completed
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme}
              className="p-2.5 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </motion.button>

            {/* Undo/Redo */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <button onClick={() => {}} disabled={undoStack.length === 0}
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" title="Undo">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={() => {}} disabled={redoStack.length === 0}
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 border-l dark:border-gray-700" title="Redo">
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              {[
                { value: 'kanban' as const, icon: LayoutDashboard, label: 'Kanban' },
                { value: 'list' as const, icon: List, label: 'List' },
                { value: 'grid' as const, icon: Grid3X3, label: 'Grid' },
                { value: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
              ].map(v => (
                <button key={v.value} onClick={() => setViewMode(v.value)}
                  className={`p-2.5 transition-colors ${viewMode === v.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  title={v.label}>
                  <v.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* View Settings */}
            <div className="relative">
              <button onClick={() => setShowViewSettings(!showViewSettings)}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <AnimatePresence>
                {showViewSettings && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">View Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Density</label>
                        <select value={viewSettings.density} onChange={(e) => setViewSettings({ ...viewSettings, density: e.target.value as any })}
                          className="w-full px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                          <option value="compact">Compact</option>
                          <option value="comfortable">Comfortable</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Show Labels</span>
                        <button onClick={() => setViewSettings({ ...viewSettings, showLabels: !viewSettings.showLabels })}
                          className={`w-10 h-5 rounded-full transition-colors ${viewSettings.showLabels ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <motion.div animate={{ x: viewSettings.showLabels ? 20 : 2 }} className="w-4 h-4 bg-white rounded-full mt-0.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Show Progress</span>
                        <button onClick={() => setViewSettings({ ...viewSettings, showProgress: !viewSettings.showProgress })}
                          className={`w-10 h-5 rounded-full transition-colors ${viewSettings.showProgress ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <motion.div animate={{ x: viewSettings.showProgress ? 20 : 2 }} className="w-4 h-4 bg-white rounded-full mt-0.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Show Assignee</span>
                        <button onClick={() => setViewSettings({ ...viewSettings, showAssignee: !viewSettings.showAssignee })}
                          className={`w-10 h-5 rounded-full transition-colors ${viewSettings.showAssignee ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <motion.div animate={{ x: viewSettings.showAssignee ? 20 : 2 }} className="w-4 h-4 bg-white rounded-full mt-0.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Show Due Date</span>
                        <button onClick={() => setViewSettings({ ...viewSettings, showDueDate: !viewSettings.showDueDate })}
                          className={`w-10 h-5 rounded-full transition-colors ${viewSettings.showDueDate ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <motion.div animate={{ x: viewSettings.showDueDate ? 20 : 2 }} className="w-4 h-4 bg-white rounded-full mt-0.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk Actions */}
            {selectedTasks.size > 0 && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1.5">
                <span className="text-sm text-blue-700 dark:text-blue-400">{selectedTasks.size} selected</span>
                <button onClick={() => {
                  setTasks(tasks.filter(t => !selectedTasks.has(t.id)))
                  setSelectedTasks(new Set())
                }} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* New Task */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setEditingTask(null); setDefaultStatus('todo'); setShowNewTaskModal(true) }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium shadow-md transition-all">
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </motion.button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-500', icon: Layers },
            { label: 'Backlog', value: stats.backlog, color: 'bg-gray-400', icon: Archive },
            { label: 'To Do', value: stats.todo, color: 'bg-blue-500', icon: List },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-yellow-500', icon: Play },
            { label: 'Review', value: stats.review, color: 'bg-purple-500', icon: Eye },
            { label: 'Done', value: stats.done, color: 'bg-green-500', icon: CheckCircle2 },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border dark:border-gray-700 flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input type="text" placeholder="Search tasks by title, description, or tags..." value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <Filter className="w-4 h-4" /><span>Filters</span>
            {Object.values(filters).some(v => v !== 'all' && v !== '' && v !== false) && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
          <select value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => { const [sortBy, sortOrder] = e.target.value.split('-') as [TaskFilter['sortBy'], TaskFilter['sortOrder']]; setFilters({ ...filters, sortBy, sortOrder }) }}
            className="px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="dueDate-asc">Due Date ↑</option>
            <option value="dueDate-desc">Due Date ↓</option>
            <option value="priority-desc">Highest Priority</option>
            <option value="priority-asc">Lowest Priority</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="title-asc">A-Z</option>
            <option value="progress-desc">Most Progress</option>
            <option value="storyPoints-desc">Most Story Points</option>
          </select>
        </div>

        {/* FILTER PANEL */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                    <option value="all">All</option>
                    <option value="backlog">Backlog</option><option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option><option value="review">Review</option>
                    <option value="done">Done</option><option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</label>
                  <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                    <option value="all">All</option>
                    <option value="critical">Critical</option><option value="high">High</option>
                    <option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assignee</label>
                  <select value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                    <option value="all">All</option>
                    <option value="Alice Johnson">Alice Johnson</option>
                    <option value="Bob Smith">Bob Smith</option>
                    <option value="Charlie Brown">Charlie Brown</option>
                    <option value="Diana Prince">Diana Prince</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Label</label>
                  <select value={filters.label} onChange={(e) => setFilters({ ...filters, label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                    <option value="all">All</option>
                    <option value="design">Design</option><option value="backend">Backend</option>
                    <option value="bug">Bug</option><option value="feature">Feature</option>
                    <option value="docs">Docs</option><option value="devops">DevOps</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-4 flex items-center justify-between pt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={filters.showArchived} onChange={(e) => setFilters({ ...filters, showArchived: e.target.checked })}
                      className="rounded border-gray-300 dark:border-gray-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Show archived tasks</span>
                  </label>
                  <button onClick={() => setFilters({ search: '', status: 'all', priority: 'all', assignee: 'all', label: 'all', dueDate: '', sortBy: 'dueDate', sortOrder: 'asc', tags: [], assignees: [], labels: [], showArchived: false })}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">Clear all</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TASK VIEWS */}
        {viewMode === 'analytics' ? (
          <AnalyticsDashboard tasks={filteredTasks} />
        ) : viewMode === 'kanban' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[1000px]" style={{ perspective: '2000px' }}>
              {columns.map((column, colIndex) => {
                const columnTasks = getColumnTasks(column.id)
                return (
                  <motion.div
                    key={column.id}
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: colIndex * 0.1 }}
                    className="flex-shrink-0 w-80 rounded-2xl p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 border dark:border-gray-700 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{columnTasks.length}</span>
                        {column.wipLimit && columnTasks.length >= column.wipLimit && (
                          <span className="text-xs text-orange-500">WIP limit</span>
                        )}
                      </div>
                      <button onClick={() => { setEditingTask(null); setDefaultStatus(column.id as Task['status']); setShowNewTaskModal(true) }}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="space-y-3 min-h-[200px]">
                      <AnimatePresence>
                        {columnTasks.map(task => (
                          <KanbanTaskCard key={task.id} task={task}
                            onStatusChange={handleStatusChange} onDelete={handleDelete}
                            onEdit={(t) => { setEditingTask(t); setShowNewTaskModal(true) }}
                            onDuplicate={handleDuplicate} onArchive={handleArchive}
                            onTimeUpdate={handleTimeUpdate} viewSettings={viewSettings} />
                        ))}
                      </AnimatePresence>
                      {columnTasks.length === 0 && (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                          <p className="text-sm">No tasks</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <Card3D depth={15} className="overflow-hidden">
            <div className="divide-y dark:divide-gray-700">
              <div className="grid grid-cols-[auto,1fr,auto] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="w-20">Select</div>
                <div>Task</div>
                <div className="flex items-center space-x-4">
                  <span className="w-24">Priority</span>
                  <span className="w-24">Status</span>
                  <span className="w-28">Due Date</span>
                  <span className="w-24">Progress</span>
                  <span className="w-20">Assignees</span>
                  <span className="w-16">Actions</span>
                </div>
              </div>
              <AnimatePresence>
                {filteredTasks.map(task => (
                  <TaskRow key={task.id} task={task}
                    onStatusChange={handleStatusChange} onDelete={handleDelete}
                    onEdit={(t) => { setEditingTask(t); setShowNewTaskModal(true) }}
                    isSelected={selectedTasks.has(task.id)} onSelect={(id) => {
                      const newSet = new Set(selectedTasks)
                      if (newSet.has(id)) newSet.delete(id)
                      else newSet.add(id)
                      setSelectedTasks(newSet)
                    }} />
                ))}
              </AnimatePresence>
              {filteredTasks.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No tasks found</h3>
                  <button onClick={() => setShowNewTaskModal(true)} className="mt-4 text-blue-500 hover:text-blue-600">Create one →</button>
                </div>
              )}
            </div>
          </Card3D>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <KanbanTaskCard key={task.id} task={task}
                  onStatusChange={handleStatusChange} onDelete={handleDelete}
                  onEdit={(t) => { setEditingTask(t); setShowNewTaskModal(true) }}
                  onDuplicate={handleDuplicate} onArchive={handleArchive}
                  onTimeUpdate={handleTimeUpdate} viewSettings={viewSettings} />
              ))}
            </AnimatePresence>
            {filteredTasks.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No tasks found</h3>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleUpdateTask}
        onAddComment={handleAddComment}
      />

      {/* New/Edit Task Modal */}
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => { setShowNewTaskModal(false); setEditingTask(null) }}
        onCreate={handleCreateTask}
        defaultStatus={defaultStatus}
        editingTask={editingTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  )
}