// src/pages/TaskDetail.tsx - Ultra-Comprehensive Task Detail Page with Working Quick Actions
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowLeft, Edit, Trash2, Clock, User, Calendar, Tag, Paperclip,
  MessageSquare, Send, MoreVertical, CheckCircle2, AlertTriangle,
  Star, Share2, Download, Copy, Plus, X,
  Mic, Smile, ThumbsUp, Heart, RefreshCw,
  Play, Pause, ChevronDown, ChevronUp,
  FileText, Image, Video, Archive, Lock, Unlock,
  TrendingUp, TrendingDown, Activity, BarChart3,
  GitBranch, GitCommit, GitPullRequest, Link2, ExternalLink,
  Flag, Bookmark, BookOpen, Award, Zap, Cloud, Sun, Moon,
  Bell, Eye, EyeOff, Settings, LogOut, Menu,
  Maximize2, Minimize2, Filter, Search, Sliders,
  Sparkles, Rocket, Gift, Coffee, Crown, Medal,
  DollarSign, Briefcase, Clock3, Timer, StopCircle,
  Volume2, AtSign, Folder, Check, Shield, AlertCircle as AlertCircleIcon,
  Code, Palette, Globe, Brain, Upload, CalendarDays, Target,
  Users, Printer, Info
} from 'lucide-react'

// ============================================
// CUSTOM PRINTER ICON (since lucide-react doesn't export Printer)
// ============================================
const PrinterIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </svg>
)

// ============================================
// TYPES
// ============================================
interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: string
  editedAt?: string
  replies: Comment[]
  reactions: Reaction[]
  attachments: Attachment[]
}

interface Reaction {
  emoji: string
  count: number
  users: string[]
}

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string
  uploadedAt: string
  preview?: string
}

interface TimeEntry {
  id: string
  userId: string
  userName: string
  userAvatar: string
  description: string
  startTime: string
  endTime?: string
  duration: number
  billable: boolean
  project?: string
  hourlyRate?: number
  amount?: number
}

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userAvatar: string
  action: string
  field?: string
  oldValue?: string
  newValue?: string
  timestamp: string
  metadata?: Record<string, any>
}

interface Subtask {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  assignee?: { id: string; name: string; avatar: string }
  dueDate?: string
  progress: number
  dependencies?: string[]
  estimatedHours?: number
  actualHours?: number
}

interface Dependency {
  id: string
  title: string
  status: string
  type: 'blocks' | 'blocked_by' | 'relates_to'
  taskId: string
}

interface CustomField {
  name: string
  value: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  options?: string[]
}

interface Watcher {
  id: string
  name: string
  avatar: string
  email: string
  notificationPreference: 'all' | 'mentions' | 'none'
}

interface ChecklistItem {
  id: string
  title: string
  completed: boolean
  assignedTo?: string
  dueDate?: string
}

interface Relation {
  id: string
  title: string
  status: string
  type: 'parent' | 'child' | 'related'
  taskId: string
}

interface Review {
  id: string
  reviewer: { id: string; name: string; avatar: string }
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected'
  comments: string
  submittedAt: string
  completedAt?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  action: () => void
  color: string
  shortcut?: string
}

interface TaskDetail {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: { id: string; name: string; avatar: string; email: string }
  assignees: { id: string; name: string; avatar: string; role?: string }[]
  dueDate: string
  startDate: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  labels: { id: string; name: string; color: string }[]
  estimatedHours: number
  actualHours: number
  progress: number
  parentTask?: { id: string; title: string; status: string }
  subtasks: Subtask[]
  dependencies: Dependency[]
  relations: Relation[]
  comments: Comment[]
  attachments: Attachment[]
  timeEntries: TimeEntry[]
  activityLog: ActivityLog[]
  isRecurring: boolean
  recurringPattern?: string
  recurringEndDate?: string
  aiGenerated: boolean
  aiSuggestions?: string[]
  aiSummary?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  customFields: CustomField[]
  watchers: Watcher[]
  version: number
  storyPoints: number
  sprint: string
  epic?: string
  release?: string
  checklist: ChecklistItem[]
  reviews: Review[]
  tags: string[]
  blocked: boolean
  blockedReason?: string
  timeEstimate: number
  timeSpent: number
  remainingEstimate: number
  dueDateReminder: boolean
  reminderTime?: string
  billableRate?: number
  totalBillableAmount?: number
}

// ============================================
// 3D CARD COMPONENT with Dark Mode
// ============================================
const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  depth?: number
  onClick?: () => void
  glow?: boolean
}> = ({ children, className = '', depth = 20, onClick, glow = false }) => {
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
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ scale: 1.02, z: 20 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden ${glow ? 'hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}

// ============================================
// PROGRESS RING with Dark Mode
// ============================================
const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const getColor = (p: number) => {
    if (p >= 80) return '#10b981'
    if (p >= 50) return '#3b82f6'
    if (p >= 25) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb dark:#374151" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={getColor(progress)} strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold dark:text-white" style={{ color: getColor(progress) }}>{progress}%</span>
      </div>
    </div>
  )
}

// ============================================
// STATUS BADGE with Dark Mode
// ============================================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    backlog: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', icon: Archive },
    todo: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Bookmark },
    in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Play },
    review: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: Eye },
    done: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle2 },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: X },
  }
  const c = config[status] || config.todo
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
      <Icon className="w-4 h-4" />
      <span>{status.replace('_', ' ')}</span>
    </span>
  )
}

// ============================================
// PRIORITY BADGE with Dark Mode
// ============================================
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: AlertTriangle },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: TrendingUp },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Flag },
    low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: TrendingDown },
  }
  const c = config[priority] || config.medium
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${c.bg} ${c.text}`}>
      <Icon className="w-4 h-4" />
      <span>{priority}</span>
    </span>
  )
}

// ============================================
// COMMENT COMPONENT with Dark Mode
// ============================================
const CommentItem: React.FC<{
  comment: Comment
  onReply: (commentId: string) => void
  onReact: (commentId: string, emoji: string) => void
  onEdit?: (commentId: string, content: string) => void
  onDelete?: (commentId: string) => void
  depth?: number
}> = ({ comment, onReply, onReact, onEdit, onDelete, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const emojis = ['👍', '❤️', '😂', '🎉', '🚀', '💡', '👏', '🔥']

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.id, editContent)
      setIsEditing(false)
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}>
      <div className="flex space-x-3 py-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {comment.userAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.userName}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            {comment.editedAt && <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSaveEdit} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
          )}
          
          {comment.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {comment.attachments.map(att => (
                <div key={att.id} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs dark:text-gray-300">
                  <Paperclip className="w-3 h-3" />
                  <span>{att.name}</span>
                </div>
              ))}
            </div>
          )}

          {comment.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {comment.reactions.map((reaction, i) => (
                <button key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs dark:text-gray-300">
                  {reaction.emoji} {reaction.count}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3 mt-2">
            <div className="relative">
              <button onClick={() => setShowReactionPicker(!showReactionPicker)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <Smile className="w-4 h-4" />
              </button>
              {showReactionPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 p-2 flex space-x-1 z-50">
                  {emojis.map(emoji => (
                    <button key={emoji} onClick={() => { onReact(comment.id, emoji); setShowReactionPicker(false) }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg">{emoji}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => onReply(comment.id)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Reply</button>
            {onEdit && (
              <button onClick={() => setIsEditing(true)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Edit</button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(comment.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
            )}
          </div>

          {comment.replies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)} className="flex items-center space-x-1 text-xs text-blue-500 dark:text-blue-400 mt-2">
              {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              <span>{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}

          {showReplies && comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} onReact={onReact} onEdit={onEdit} onDelete={onDelete} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// ACTIVITY TIMELINE ITEM with Dark Mode
// ============================================
const ActivityTimelineItem: React.FC<{ activity: ActivityLog; isLast: boolean }> = ({ activity, isLast }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <Plus className="w-4 h-4 text-green-500" />
      case 'updated': return <Edit className="w-4 h-4 text-blue-500" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'deleted': return <Trash2 className="w-4 h-4 text-red-500" />
      case 'commented': return <MessageSquare className="w-4 h-4 text-purple-500" />
      case 'assigned': return <User className="w-4 h-4 text-blue-500" />
      case 'status_changed': return <Activity className="w-4 h-4 text-yellow-500" />
      case 'time_tracked': return <Clock className="w-4 h-4 text-cyan-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="flex space-x-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {getActionIcon(activity.action)}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {activity.userAvatar}
          </div>
          <p className="text-sm text-gray-900 dark:text-white">
            <span className="font-medium">{activity.userName}</span>{' '}
            {activity.action} {activity.field && <span className="font-medium">{activity.field}</span>}
          </p>
        </div>
        {activity.oldValue && activity.newValue && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Changed from <span className="line-through">{activity.oldValue}</span> to <span className="font-medium">{activity.newValue}</span>
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
      </div>
    </div>
  )
}

// ============================================
// SUBTASK ITEM
// ============================================
const SubtaskItem: React.FC<{
  subtask: Subtask
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}> = ({ subtask, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(subtask.title)

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(subtask.id, editTitle)
      setIsEditing(false)
    }
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <button
        onClick={() => onToggle(subtask.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          subtask.status === 'done'
            ? 'bg-green-500 border-green-500'
            : subtask.status === 'in_progress'
            ? 'bg-yellow-500 border-yellow-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
      >
        {subtask.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
        {subtask.status === 'in_progress' && <Play className="w-3 h-3 text-white" />}
      </button>
      
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-2 py-1 text-sm rounded border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button onClick={handleSave} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Save</button>
          <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-xs border rounded">Cancel</button>
        </div>
      ) : (
        <>
          <span className={`flex-1 text-sm ${subtask.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {subtask.title}
          </span>
          {subtask.assignee && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {subtask.assignee.avatar}
            </div>
          )}
          {subtask.dueDate && (
            <span className="text-xs text-gray-400">{new Date(subtask.dueDate).toLocaleDateString()}</span>
          )}
          {subtask.estimatedHours && (
            <span className="text-xs text-gray-400">{subtask.estimatedHours}h</span>
          )}
          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${subtask.progress >= 80 ? 'bg-green-500' : subtask.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${subtask.progress}%` }} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-500">
              <Edit className="w-3 h-3" />
            </button>
            <button onClick={() => onDelete(subtask.id)} className="p-1 text-gray-400 hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// CHECKLIST ITEM
// ============================================
const ChecklistItem: React.FC<{
  item: ChecklistItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}> = ({ item, onToggle, onDelete }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
    <button
      onClick={() => onToggle(item.id)}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
        item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
      }`}
    >
      {item.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
    </button>
    <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
      {item.title}
    </span>
    {item.assignedTo && (
      <span className="text-xs text-gray-400">@{item.assignedTo}</span>
    )}
    {item.dueDate && (
      <span className="text-xs text-gray-400">{new Date(item.dueDate).toLocaleDateString()}</span>
    )}
    <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity">
      <Trash2 className="w-3 h-3" />
    </button>
  </div>
)

// ============================================
// QUICK ACTIONS BAR
// ============================================
const QuickActionsBar: React.FC<{ actions: QuickAction[] }> = ({ actions }) => {
  const [showAll, setShowAll] = useState(false)
  const visibleActions = showAll ? actions : actions.slice(0, 6)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</h4>
        {actions.length > 6 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-blue-500 hover:text-blue-600">
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {visibleActions.map(action => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${action.color} hover:shadow-md`}
            title={action.shortcut ? `Shortcut: ${action.shortcut}` : ''}
          >
            <action.icon className="w-4 h-4" />
            <span className="text-xs">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// BILLABLE TIME ENTRY MODAL
// ============================================
const BillableTimeModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSave: (entry: { description: string; hours: number; billable: boolean; hourlyRate: number }) => void
}> = ({ isOpen, onClose, onSave }) => {
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState(1)
  const [billable, setBillable] = useState(true)
  const [hourlyRate, setHourlyRate] = useState(50)

  const handleSubmit = () => {
    if (description.trim()) {
      onSave({ description, hours, billable, hourlyRate })
      setDescription('')
      setHours(1)
      setBillable(true)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Time Entry</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                step={0.5}
                min={0.25}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={billable}
              onChange={(e) => setBillable(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Billable</span>
          </label>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Add Time
            </button>
            <button onClick={onClose} className="flex-1 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// MAIN TASK DETAIL COMPONENT
// ============================================
export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity' | 'time' | 'attachments' | 'checklist'>('details')
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isTrackingTime, setIsTrackingTime] = useState(false)
  const [timeStart, setTimeStart] = useState<Date | null>(null)
  const [timeDescription, setTimeDescription] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showBillableModal, setShowBillableModal] = useState(false)
  const [showToast, setShowToast] = useState<{ message: string; type: string } | null>(null)
  const [editForm, setEditForm] = useState({
    title: '', description: '', priority: 'medium' as TaskDetail['priority'],
    status: 'todo' as TaskDetail['status'], dueDate: '', estimatedHours: 0,
  })

  // Initialize dark mode
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

  const showToastMessage = (message: string, type: string) => {
    setShowToast({ message, type })
    setTimeout(() => setShowToast(null), 3000)
  }

  useEffect(() => {
    loadTask()
  }, [id])

  const loadTask = () => {
    setIsLoading(true)
    setTimeout(() => {
      const mockTask: TaskDetail = {
        id: id || '1',
        title: 'Design New Dashboard Layout with 3D Effects',
        description: 'Create a comprehensive dashboard with modern UI components, 3D CSS animations, and real-time data visualization.',
        status: 'in_progress',
        priority: 'high',
        assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@taskcollab.com' },
        assignees: [
          { id: '1', name: 'Alice Johnson', avatar: 'AJ', role: 'Lead Designer' },
          { id: '2', name: 'Bob Smith', avatar: 'BS', role: 'Frontend Dev' },
        ],
        dueDate: '2026-05-30',
        startDate: '2026-05-20',
        createdAt: '2026-05-20T10:00:00Z',
        updatedAt: '2026-05-21T14:30:00Z',
        labels: [
          { id: 'l1', name: 'design', color: '#3b82f6' },
          { id: 'l2', name: 'frontend', color: '#8b5cf6' },
        ],
        estimatedHours: 16,
        actualHours: 8,
        progress: 65,
        parentTask: { id: '0', title: 'Q2 Platform Redesign', status: 'in_progress' },
        subtasks: [
          { id: 's1', title: 'Create wireframes', status: 'done', progress: 100, assignee: { id: '1', name: 'Alice', avatar: 'AJ' }, dueDate: '2026-05-21' },
          { id: 's2', title: 'Design color scheme', status: 'done', progress: 100, assignee: { id: '1', name: 'Alice', avatar: 'AJ' }, dueDate: '2026-05-22' },
          { id: 's3', title: 'Implement 3D card effects', status: 'in_progress', progress: 70, assignee: { id: '2', name: 'Bob', avatar: 'BS' }, dueDate: '2026-05-24' },
          { id: 's4', title: 'Add responsive breakpoints', status: 'todo', progress: 0, assignee: { id: '2', name: 'Bob', avatar: 'BS' }, dueDate: '2026-05-25' },
        ],
        dependencies: [],
        relations: [],
        comments: [
          {
            id: 'c1', userId: '1', userName: 'Alice Johnson', userAvatar: 'AJ',
            content: "I have completed the wireframes and started working on the 3D card effects.",
            createdAt: '2026-05-21T10:00:00Z',
            replies: [],
            reactions: [{ emoji: '👍', count: 2, users: ['1', '2'] }],
            attachments: [],
          },
        ],
        attachments: [],
        timeEntries: [
          { id: 't1', userId: '1', userName: 'Alice', userAvatar: 'AJ', description: 'Wireframe design', startTime: '2026-05-20T09:00:00Z', endTime: '2026-05-20T12:00:00Z', duration: 180, billable: true, hourlyRate: 75, amount: 225 },
        ],
        activityLog: [
          { id: 'log1', userId: '1', userName: 'Alice', userAvatar: 'AJ', action: 'created', timestamp: '2026-05-20T10:00:00Z' },
          { id: 'log2', userId: '1', userName: 'Alice', userAvatar: 'AJ', action: 'updated', field: 'status', oldValue: 'todo', newValue: 'in_progress', timestamp: '2026-05-20T11:00:00Z' },
        ],
        isRecurring: false,
        aiGenerated: false,
        aiSuggestions: ['Consider breaking this into smaller subtasks'],
        aiSummary: 'Dashboard redesign with 3D effects - wireframes done, 3D effects in progress.',
        sentiment: 'positive',
        customFields: [
          { name: 'Sprint', value: 'Sprint 12', type: 'text' },
          { name: 'Story Points', value: '8', type: 'number' },
        ],
        watchers: [
          { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', notificationPreference: 'all' },
          { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', notificationPreference: 'all' },
        ],
        version: 3,
        storyPoints: 8,
        sprint: 'Sprint 12',
        epic: 'Q2 Platform Redesign',
        release: 'v2.0.0',
        checklist: [
          { id: 'ch1', title: 'Review design with stakeholders', completed: false, assignedTo: 'Alice' },
          { id: 'ch2', title: 'Update documentation', completed: true, assignedTo: 'Bob' },
        ],
        reviews: [],
        tags: ['dashboard', '3d', 'ui/ux'],
        blocked: false,
        timeEstimate: 16,
        timeSpent: 8,
        remainingEstimate: 8,
        dueDateReminder: true,
        reminderTime: '2026-05-24T09:00:00Z',
        billableRate: 75,
        totalBillableAmount: 225,
      }
      setTask(mockTask)
      setEditForm({
        title: mockTask.title, description: mockTask.description,
        priority: mockTask.priority, status: mockTask.status,
        dueDate: mockTask.dueDate, estimatedHours: mockTask.estimatedHours,
      })
      setIsLoading(false)
    }, 800)
  }

  // Quick Actions
  const quickActions: QuickAction[] = [
    { id: 'edit', label: 'Edit', icon: Edit, action: () => setIsEditing(true), color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', shortcut: '⌘E' },
    { id: 'duplicate', label: 'Duplicate', icon: Copy, action: handleDuplicate, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', shortcut: '⌘D' },
    { id: 'share', label: 'Share', icon: Share2, action: () => setShowShareModal(true), color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400', shortcut: '⌘S' },
    { id: 'time', label: 'Log Time', icon: Clock, action: () => setShowBillableModal(true), color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400', shortcut: '⌘T' },
    { id: 'archive', label: 'Archive', icon: Archive, action: handleArchive, color: 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400', shortcut: '⌘A' },
    { id: 'watch', label: 'Watch', icon: Eye, action: handleWatch, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400', shortcut: '⌘W' },
    { id: 'move', label: 'Move', icon: ArrowLeft, action: handleMove, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400', shortcut: '⌘M' },
    { id: 'print', label: 'Print', icon: PrinterIcon, action: handlePrint, color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400', shortcut: '⌘P' },
  ]

  function handleDuplicate() {
    if (!task) return
    const newTask = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
      comments: [],
      timeEntries: [],
      activityLog: [],
      progress: 0,
      actualHours: 0,
      timeSpent: 0,
    }
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    localStorage.setItem('tasks', JSON.stringify([newTask, ...tasks]))
    showToastMessage('Task duplicated successfully!', 'success')
    navigate(`/tasks/${newTask.id}`)
  }

  function handleArchive() {
    if (!task) return
    showToastMessage('Task archived successfully!', 'success')
    navigate('/tasks')
  }

  function handleWatch() {
    if (!task) return
    const isWatching = task.watchers.some(w => w.id === 'current')
    if (isWatching) {
      setTask({
        ...task,
        watchers: task.watchers.filter(w => w.id !== 'current')
      })
      showToastMessage('Removed from watch list', 'info')
    } else {
      setTask({
        ...task,
        watchers: [...task.watchers, { id: 'current', name: 'You', avatar: 'YO', email: 'you@example.com', notificationPreference: 'all' }]
      })
      showToastMessage('Added to watch list', 'success')
    }
  }

  function handleMove() {
    showToastMessage('Move to project feature coming soon!', 'info')
  }

  function handlePrint() {
    window.print()
  }

  function handleAddBillableTime(entry: { description: string; hours: number; billable: boolean; hourlyRate: number }) {
    if (!task) return
    const duration = entry.hours * 60
    const amount = entry.hours * entry.hourlyRate
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      userId: 'current',
      userName: 'You',
      userAvatar: 'YO',
      description: entry.description,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + entry.hours * 3600000).toISOString(),
      duration: duration,
      billable: entry.billable,
      hourlyRate: entry.hourlyRate,
      amount: amount,
    }
    setTask({
      ...task,
      timeEntries: [...task.timeEntries, newEntry],
      actualHours: task.actualHours + entry.hours,
      timeSpent: task.timeSpent + entry.hours,
      remainingEstimate: task.remainingEstimate - entry.hours,
      totalBillableAmount: (task.totalBillableAmount || 0) + amount,
    })
    showToastMessage(`Added ${entry.hours}h of time ($${amount})`, 'success')
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !task) return
    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current', userName: 'You', userAvatar: 'YO',
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: [], reactions: [], attachments: [],
    }
    setTask({ ...task, comments: [comment, ...task.comments] })
    setNewComment('')
    setReplyTo(null)
    showToastMessage('Comment added', 'success')
  }

  const handleReact = (commentId: string, emoji: string) => {
    if (!task) return
    const updateReactions = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          const existing = c.reactions.find(r => r.emoji === emoji)
          if (existing) {
            return { ...c, reactions: c.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) }
          }
          return { ...c, reactions: [...c.reactions, { emoji, count: 1, users: ['current'] }] }
        }
        if (c.replies.length > 0) return { ...c, replies: updateReactions(c.replies) }
        return c
      })
    }
    setTask({ ...task, comments: updateReactions(task.comments) })
    showToastMessage(`Reacted with ${emoji}`, 'success')
  }

  const handleEditComment = (commentId: string, newContent: string) => {
    if (!task) return
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return { ...c, content: newContent, editedAt: new Date().toISOString() }
        }
        if (c.replies.length > 0) return { ...c, replies: updateComments(c.replies) }
        return c
      })
    }
    setTask({ ...task, comments: updateComments(task.comments) })
    showToastMessage('Comment updated', 'success')
  }

  const handleDeleteComment = (commentId: string) => {
    if (!task) return
    const filterComments = (comments: Comment[]): Comment[] => {
      return comments.filter(c => {
        if (c.id === commentId) return false
        if (c.replies.length > 0) c.replies = filterComments(c.replies)
        return true
      })
    }
    setTask({ ...task, comments: filterComments(task.comments) })
    showToastMessage('Comment deleted', 'success')
  }

  const handleToggleSubtask = (subtaskId: string) => {
    if (!task) return
    setTask({
      ...task,
      subtasks: task.subtasks.map(st =>
        st.id === subtaskId
          ? { ...st, status: st.status === 'done' ? 'todo' : st.status === 'in_progress' ? 'done' : 'in_progress', progress: st.status === 'done' ? 0 : st.status === 'in_progress' ? 100 : 50 }
          : st
      )
    })
    showToastMessage('Subtask status updated', 'success')
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !task) return
    setTask({
      ...task,
      subtasks: [
        ...task.subtasks,
        { id: Date.now().toString(), title: newSubtask.trim(), status: 'todo', progress: 0 }
      ]
    })
    setNewSubtask('')
    showToastMessage('Subtask added', 'success')
  }

  const handleEditSubtask = (subtaskId: string, newTitle: string) => {
    if (!task) return
    setTask({
      ...task,
      subtasks: task.subtasks.map(st => st.id === subtaskId ? { ...st, title: newTitle } : st)
    })
    showToastMessage('Subtask updated', 'success')
  }

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!task) return
    setTask({
      ...task,
      subtasks: task.subtasks.filter(st => st.id !== subtaskId)
    })
    showToastMessage('Subtask deleted', 'success')
  }

  const handleToggleChecklist = (itemId: string) => {
    if (!task) return
    setTask({
      ...task,
      checklist: task.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    })
    showToastMessage('Checklist item updated', 'success')
  }

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim() || !task) return
    setTask({
      ...task,
      checklist: [
        ...task.checklist,
        { id: Date.now().toString(), title: newChecklistItem.trim(), completed: false }
      ]
    })
    setNewChecklistItem('')
    showToastMessage('Checklist item added', 'success')
  }

  const handleDeleteChecklistItem = (itemId: string) => {
    if (!task) return
    setTask({
      ...task,
      checklist: task.checklist.filter(item => item.id !== itemId)
    })
    showToastMessage('Checklist item deleted', 'success')
  }

  const handleSaveEdit = () => {
    if (!task) return
    setTask({
      ...task, ...editForm,
      updatedAt: new Date().toISOString(),
      version: task.version + 1,
    })
    setIsEditing(false)
    showToastMessage('Task updated successfully', 'success')
  }

  const handleDelete = () => {
    showToastMessage('Task deleted successfully', 'success')
    navigate('/tasks')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tasks/${task?.id}`)
    showToastMessage('Task link copied to clipboard!', 'success')
  }

  const handleTimeTracking = () => {
    if (isTrackingTime) {
      if (timeStart && timeDescription && task) {
        const duration = Math.round((new Date().getTime() - timeStart.getTime()) / 60000)
        const amount = (duration / 60) * (task.billableRate || 50)
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          userId: 'current', userName: 'You', userAvatar: 'YO',
          description: timeDescription,
          startTime: timeStart.toISOString(),
          endTime: new Date().toISOString(),
          duration,
          billable: true,
          hourlyRate: task.billableRate || 50,
          amount: amount,
        }
        setTask({
          ...task,
          timeEntries: [...task.timeEntries, newEntry],
          actualHours: task.actualHours + duration / 60,
          timeSpent: task.timeSpent + duration / 60,
          remainingEstimate: task.remainingEstimate - duration / 60,
          totalBillableAmount: (task.totalBillableAmount || 0) + amount,
        })
        showToastMessage(`Logged ${Math.floor(duration / 60)}h ${duration % 60}m`, 'success')
      }
      setIsTrackingTime(false)
      setTimeStart(null)
      setTimeDescription('')
    } else {
      setIsTrackingTime(true)
      setTimeStart(new Date())
    }
  }

  const isOverdue = task ? new Date(task.dueDate) < new Date() && task.status !== 'done' : false

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Not Found</h2>
          <button onClick={() => navigate('/tasks')} className="mt-4 text-blue-500 hover:text-blue-600">Back to Tasks</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 hover:scale-110 transition-transform"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm"
            style={{ backgroundColor: showToast.type === 'success' ? '#10b981' : showToast.type === 'error' ? '#ef4444' : '#3b82f6' }}
          >
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center space-x-2">
            <button onClick={handleCopyLink} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
              <Link2 className="w-5 h-5" />
            </button>
            <button onClick={() => setShowShareModal(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSubscribeModal(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <QuickActionsBar actions={quickActions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task Card */}
            <Card3D className="p-6" depth={25}>
              {isEditing ? (
                <div className="space-y-4">
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full text-2xl font-bold px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4}
                    className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TaskDetail['status'] })}
                      className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="todo">To Do</option><option value="in_progress">In Progress</option>
                      <option value="review">Review</option><option value="done">Done</option><option value="cancelled">Cancelled</option>
                    </select>
                    <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as TaskDetail['priority'] })}
                      className="px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="low">Low</option><option value="medium">Medium</option>
                      <option value="high">High</option><option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Due Date</label>
                    <input type="date" value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Estimated Hours</label>
                    <input type="number" value={editForm.estimatedHours} onChange={(e) => setEditForm({ ...editForm, estimatedHours: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleSaveEdit} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    {isOverdue && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" /><span>Overdue</span>
                      </span>
                    )}
                    {task.blocked && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        <Lock className="w-4 h-4" /><span>Blocked</span>
                      </span>
                    )}
                    {task.aiGenerated && <span className="text-lg">🤖 AI</span>}
                    {task.isRecurring && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        <RefreshCw className="w-4 h-4" /><span>Recurring</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-3 whitespace-pre-wrap">{task.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {task.labels.map(label => (
                      <span key={label.id} className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm" style={{ backgroundColor: label.color }}>
                        {label.name}
                      </span>
                    ))}
                    {task.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        #{tag}
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-full text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-gray-400">
                      <Plus className="w-3 h-3 inline" /> Add
                    </button>
                  </div>

                  {task.customFields.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-4">
                      {task.customFields.map((field, i) => (
                        <div key={i}>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{field.name}</span>
                          <p className="text-sm font-medium dark:text-white">{field.value}</p>
                        </div>
                      ))}
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Story Points</span>
                        <p className="text-sm font-medium dark:text-white">{task.storyPoints}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Sprint</span>
                        <p className="text-sm font-medium dark:text-white">{task.sprint}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Epic</span>
                        <p className="text-sm font-medium dark:text-white">{task.epic}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Release</span>
                        <p className="text-sm font-medium dark:text-white">{task.release}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card3D>

            {/* Tabs Section */}
            <Card3D className="overflow-hidden" depth={15}>
              <div className="flex border-b dark:border-gray-700 overflow-x-auto">
                {[
                  { id: 'details' as const, label: 'Details' },
                  { id: 'comments' as const, label: 'Comments', count: task.comments.length },
                  { id: 'activity' as const, label: 'Activity', count: task.activityLog.length },
                  { id: 'time' as const, label: 'Time', count: task.timeEntries.length },
                  { id: 'attachments' as const, label: 'Files', count: task.attachments.length },
                  { id: 'checklist' as const, label: 'Checklist', count: task.checklist.length },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-4 ${
                      activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}>
                    {tab.label} {tab.count !== undefined && `(${tab.count})`}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Subtasks ({task.subtasks.filter(s => s.status === 'done').length}/{task.subtasks.length})</h3>
                      <div className="space-y-2">
                        {task.subtasks.map(subtask => (
                          <SubtaskItem key={subtask.id} subtask={subtask} onToggle={handleToggleSubtask} onDelete={handleDeleteSubtask} onEdit={handleEditSubtask} />
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                          placeholder="Add a subtask..."
                          className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleAddSubtask} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {task.parentTask && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Parent Task</h3>
                        <Link to={`/tasks/${task.parentTask.id}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <ArrowLeft className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{task.parentTask.title}</span>
                          <StatusBadge status={task.parentTask.status} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <div className="flex space-x-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">YO</div>
                      <div className="flex-1">
                        <textarea 
                          value={newComment} 
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..." 
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment())} />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500">
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500">
                              <Smile className="w-4 h-4" />
                            </button>
                          </div>
                          <button onClick={handleAddComment} disabled={!newComment.trim()}
                            className="flex items-center space-x-1 px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50">
                            <Send className="w-4 h-4" /><span>Send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                      {task.comments.map(comment => (
                        <CommentItem 
                          key={comment.id} 
                          comment={comment} 
                          onReply={setReplyTo} 
                          onReact={handleReact}
                          onEdit={handleEditComment}
                          onDelete={handleDeleteComment}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    {task.activityLog.map((activity, index) => (
                      <ActivityTimelineItem key={activity.id} activity={activity} isLast={index === task.activityLog.length - 1} />
                    ))}
                  </div>
                )}

                {activeTab === 'time' && (
                  <div>
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Time Entries</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total: {task.timeSpent}h / {task.timeEstimate}h</p>
                        {task.billableRate && (
                          <p className="text-sm text-green-600 dark:text-green-400">Billable Amount: ${task.totalBillableAmount}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isTrackingTime && (
                          <input
                            type="text"
                            value={timeDescription}
                            onChange={(e) => setTimeDescription(e.target.value)}
                            placeholder="What are you working on?"
                            className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-48"
                          />
                        )}
                        <button onClick={handleTimeTracking}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${
                            isTrackingTime ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                          }`}>
                          {isTrackingTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isTrackingTime ? 'Stop' : 'Start'} Timer</span>
                        </button>
                        <button
                          onClick={() => setShowBillableModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 text-white hover:bg-cyan-600"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>Add Time</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {task.timeEntries.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium dark:text-white">{entry.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {entry.userName} • {new Date(entry.startTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium dark:text-white">{Math.floor(entry.duration / 60)}h {entry.duration % 60}m</p>
                            {entry.billable && <p className="text-xs text-green-600 dark:text-green-400">${entry.amount}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Files ({task.attachments.length})</h3>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                        <Plus className="w-4 h-4" /> Upload
                      </button>
                    </div>
                    <div className="space-y-2">
                      {task.attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium dark:text-white">{att.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{(att.size / 1000000).toFixed(1)}MB • {att.uploadedBy}</p>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Checklist ({task.checklist.filter(i => i.completed).length}/{task.checklist.length})</h3>
                    <div className="space-y-2">
                      {task.checklist.map(item => (
                        <ChecklistItem key={item.id} item={item} onToggle={handleToggleChecklist} onDelete={handleDeleteChecklistItem} />
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                        placeholder="Add a checklist item..."
                        className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button onClick={handleAddChecklistItem} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card3D>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Card3D className="p-6 text-center" depth={20}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Progress</h3>
              <div className="flex justify-center"><ProgressRing progress={task.progress} /></div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500 dark:text-gray-400">Estimated</p><p className="font-semibold dark:text-white">{task.estimatedHours}h</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Actual</p><p className="font-semibold dark:text-white">{task.actualHours}h</p></div>
              </div>
              <div className="mt-3 pt-3 border-t dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Remaining</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{task.remainingEstimate}h</span>
                </div>
              </div>
            </Card3D>

            <Card3D className="p-6" depth={15}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2"><User className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Assignee:</span><span className="font-medium dark:text-white">{task.assignee.name}</span></div>
                <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Due:</span><span className={`font-medium ${isOverdue ? 'text-red-600' : 'dark:text-white'}`}>{new Date(task.dueDate).toLocaleDateString()}</span></div>
                <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Start:</span><span className="dark:text-white">{new Date(task.startDate).toLocaleDateString()}</span></div>
                <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Created:</span><span className="dark:text-white">{new Date(task.createdAt).toLocaleDateString()}</span></div>
                <div className="flex items-center space-x-2"><RefreshCw className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Updated:</span><span className="dark:text-white">{new Date(task.updatedAt).toLocaleDateString()}</span></div>
                <div className="flex items-center space-x-2"><GitCommit className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Version:</span><span className="font-medium dark:text-white">v{task.version}</span></div>
              </div>
            </Card3D>

            <Card3D className="p-6" depth={15}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Team</h3>
              <div className="space-y-3">
                {task.assignees.map(user => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">{user.avatar}</div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">{user.name}</p>
                      {user.role && <p className="text-xs text-gray-400">{user.role}</p>}
                    </div>
                  </div>
                ))}
                <button className="flex items-center space-x-2 text-sm text-blue-500"><Plus className="w-4 h-4" /> Assign</button>
              </div>
            </Card3D>

            <Card3D className="p-6" depth={15}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Watchers ({task.watchers.length})</h3>
              <div className="flex flex-wrap gap-2">
                {task.watchers.map(w => (
                  <div key={w.id} className="relative group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium" title={w.name}>
                      {w.avatar}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {w.name}
                    </div>
                  </div>
                ))}
                <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </Card3D>

            {/* AI Summary */}
            {task.aiSummary && (
              <Card3D className="p-6" depth={15} glow>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI Summary</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{task.aiSummary}</p>
              </Card3D>
            )}

            {/* AI Suggestions */}
            {task.aiSuggestions && task.aiSuggestions.length > 0 && (
              <Card3D className="p-6" depth={15} glow>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>AI Suggestions</span>
                </h3>
                <div className="space-y-2">
                  {task.aiSuggestions.map((s, i) => (
                    <div key={i} className="flex items-start space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Zap className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-900 dark:text-purple-300">{s}</p>
                    </div>
                  ))}
                </div>
              </Card3D>
            )}
          </div>
        </div>
      </div>

      {/* Billable Time Modal */}
      <AnimatePresence>
        {showBillableModal && (
          <BillableTimeModal
            isOpen={showBillableModal}
            onClose={() => setShowBillableModal(false)}
            onSave={handleAddBillableTime}
          />
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Task?</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">This action cannot be undone.</p>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">Delete</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={() => setShowShareModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share Task</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Share Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/tasks/${task?.id}`}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button onClick={handleCopyLink} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => setShowShareModal(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}