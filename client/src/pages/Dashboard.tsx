// src/pages/Dashboard.tsx - Complete Production-Ready 3D Dashboard with ALL Features
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Plus, TrendingUp, Users, CheckCircle2, Clock, Target,
  Calendar, Search, X, Bell, Sun, Moon, ListTodo, AlertTriangle,
  MessageSquare, RefreshCw, Download, Share2, Filter,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Star, Flag, User, Activity, BarChart2, PieChart, TrendingDown,
  Zap, Settings, HelpCircle, FileText, Video, MapPin,
  Paperclip, Image, ThumbsUp, Heart, Gift, Rocket, Globe,
  Wifi, WifiOff, Database, Cloud, Eye, EyeOff, Lock, Unlock,
  Copy, ExternalLink, Maximize2, Minimize2, RotateCw,
  ZoomIn, ZoomOut, Sliders, Play, Pause, Mic, Camera,
  Monitor, Layout, Grid, List, Bold, Italic, Code, Quote,
  Save, FolderOpen, FolderPlus, Trash2, Edit3, Archive,
  History, GitBranch, GitPullRequest, GitMerge, Package,
  ShoppingCart, CreditCard, DollarSign, Percent, Compass,
  Layers, Box, HardDrive, Cpu, Keyboard, Mouse, Headphones,
  Tv, Cast, Bluetooth, ArrowUp, ArrowDown, ArrowUpDown,
  Move, MoreVertical, ShareIcon,
  Coffee, Brain, BookOpen, Lightbulb, Timer, Trophy,
  BadgeCheck, Crown, Medal, Sparkles, Swords, ShieldCheck,
  Wand2, Palette, Music, Podcast, RadioReceiver,
  Microscope, Telescope, Globe2, CloudSun, CloudMoon,
  Sunset, Sunrise, Waves, Flame, Snowflake, Leaf,
  Atom, Dna, Fingerprint, Scan, QrCode, Barcode
} from 'lucide-react'

// ============================================
// COMPREHENSIVE TYPE DEFINITIONS
// ============================================

type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled' | 'blocked'
type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
type MemberStatus = 'online' | 'idle' | 'offline' | 'busy' | 'in_meeting' | 'on_break'
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'mention' | 'assignment' | 'due_date' | 'comment' | 'reaction'
type ThemeMode = 'light' | 'dark' | 'system'
type ViewMode = 'grid' | 'list' | 'board' | 'calendar' | 'timeline' | 'gantt'
type PomodoroMode = 'work' | 'shortBreak' | 'longBreak'
type SentimentType = 'positive' | 'neutral' | 'negative'
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
type InsightType = 'prediction' | 'recommendation' | 'anomaly' | 'optimization' | 'risk_alert'
type ImpactLevel = 'low' | 'medium' | 'high'

interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

interface TaskDependency extends BaseEntity {
  taskId: string
  dependencyType: 'blocks' | 'blocked_by' | 'relates_to' | 'duplicates' | 'parent' | 'child'
}

interface TaskTimeLog extends BaseEntity {
  userId: string
  taskId: string
  startTime: string
  endTime?: string
  duration?: number
  description: string
  billable: boolean
}

interface TaskAttachment extends BaseEntity {
  taskId: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedBy: string
  thumbnail?: string
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  completedBy?: string
  completedAt?: string
  order: number
}

interface TaskChecklist extends BaseEntity {
  taskId: string
  title: string
  items: ChecklistItem[]
}

interface Reaction {
  emoji: string
  userId: string
  userName: string
  createdAt: string
}

interface TaskComment extends BaseEntity {
  taskId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  parentId?: string
  reactions: Reaction[]
  attachments: TaskAttachment[]
  isEdited: boolean
  mentions: string[]
}

interface TaskActivity {
  id: string
  taskId: string
  userId: string
  userName: string
  action: 'created' | 'updated' | 'deleted' | 'commented' | 'status_changed' | 'assigned' | 'priority_changed' | 'due_date_changed' | 'label_added' | 'label_removed' | 'attachment_added' | 'time_logged' | 'dependency_added' | 'dependency_removed'
  details: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

interface Task extends BaseEntity {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  assigneeAvatar: string
  assigneeEmail: string
  reporter: string
  dueDate: string
  startDate?: string
  completedAt?: string
  labels: string[]
  tags: string[]
  estimatedHours: number
  actualHours: number
  progress: number
  storyPoints: number
  sprint: string
  epic: string
  comments: TaskComment[]
  checklists: TaskChecklist[]
  attachments: TaskAttachment[]
  timeLogs: TaskTimeLog[]
  dependencies: TaskDependency[]
  activities: TaskActivity[]
  isRecurring: boolean
  recurringRule?: string
  aiGenerated: boolean
  sentiment: SentimentType
  confidence: number
  effortScore: number
  valueScore: number
  riskLevel: RiskLevel
  customFields: Record<string, any>
  watchers: string[]
  votes: number
  version: number
  template: string
  subtasks: string[]
  parentTask?: string
  color: string
  position: number
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar: string
  status: MemberStatus
  tasksCompleted: number
  tasksInProgress: number
  productivity: number
  efficiency: number
  lastActive: string
  skills: string[]
  certifications: string[]
  availability: number
  workload: number
  timezone: string
  workingHours: { start: string; end: string; days: number[] }
  currentProject?: string
  location: string
  phone: string
  joinDate: string
  reportsTo: string
  performance: number
  mood: 'happy' | 'neutral' | 'stressed' | 'focused'
  breakTime: number
  meetingsToday: number
  goalsCompleted: number
  totalGoals: number
}

interface Sprint extends BaseEntity {
  name: string
  goal: string
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  tasks: string[]
  velocity: number
  burndown: BurndownData[]
  teamCapacity: number
  plannedPoints: number
  completedPoints: number
}

interface BurndownData {
  date: string
  ideal: number
  actual: number
}

interface Milestone extends BaseEntity {
  name: string
  description: string
  dueDate: string
  completed: boolean
  progress: number
  tasks: string[]
  type: 'release' | 'feature' | 'sprint' | 'project'
}

interface ProjectMetrics {
  velocity: number
  cycleTime: number
  leadTime: number
  throughput: number
  workInProgress: number
  scopeCreep: number
  technicalDebt: number
  testCoverage: number
  buildSuccessRate: number
  deploymentFrequency: number
  meanTimeToRecover: number
  changeFailureRate: number
  teamSatisfaction: number
  customerSatisfaction: number
  revenue: number
  costs: number
  roi: number
}

interface Risk extends BaseEntity {
  title: string
  description: string
  probability: number
  impact: number
  status: 'identified' | 'mitigated' | 'accepted' | 'transferred' | 'closed'
  mitigation: string
  owner: string
  category: string
  score: number
}

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  category: string
  priority: 'low' | 'normal' | 'high'
  dismissible: boolean
  expiryDate?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

interface UserPreferences {
  theme: ThemeMode
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
    digest: 'none' | 'hourly' | 'daily' | 'weekly'
    types: string[]
  }
  layout: {
    density: 'compact' | 'comfortable' | 'spacious'
    sidebarPosition: 'left' | 'right'
    sidebarCollapsed: boolean
    taskView: ViewMode
    columns: number
  }
  accessibility: {
    highContrast: boolean
    reduceMotion: boolean
    fontSize: 'small' | 'medium' | 'large'
    screenReader: boolean
    keyboardShortcuts: boolean
  }
}

interface AIInsight {
  id: string
  type: InsightType
  title: string
  description: string
  confidence: number
  impact: ImpactLevel
  actionable: boolean
  suggestion: string
  data: any
  createdAt: string
  acknowledged: boolean
  category: string
}

interface DashboardWidget {
  id: string
  type: 'stats' | 'chart' | 'list' | 'calendar' | 'weather' | 'quote' | 'pomodoro' | 'team' | 'ai' | 'custom'
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
  enabled: boolean
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}

const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}${timestamp}${random}`
}

const formatDate = (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const d = new Date(date)
  if (format === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    if (weeks < 4) return `${weeks}w ago`
    if (months < 12) return `${months}mo ago`
    return `${years}y ago`
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    critical: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    high: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    medium: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    low: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  }
  return colors[priority]
}

const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    backlog: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    todo: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    in_progress: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    review: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    done: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    cancelled: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-700 line-through',
    blocked: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  }
  return colors[status]
}

const getMemberStatusColor = (status: MemberStatus): string => {
  const colors: Record<MemberStatus, string> = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    in_meeting: 'bg-blue-500',
    on_break: 'bg-orange-500',
  }
  return colors[status]
}

const calculateProductivity = (member: TeamMember): number => {
  const completionRate = member.tasksCompleted / Math.max(member.tasksCompleted + member.tasksInProgress, 1)
  const efficiencyScore = member.efficiency / 100
  const availabilityScore = member.availability / 100
  return Math.round((completionRate * 0.4 + efficiencyScore * 0.35 + availabilityScore * 0.25) * 100)
}

const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// ============================================
// AI & ANALYTICS UTILITIES
// ============================================

class TaskPredictor {
  private historicalData: Task[]
  
  constructor(tasks: Task[]) {
    this.historicalData = tasks
  }

  predictCompletionTime(task: Task): number {
    const similarTasks = this.historicalData.filter(
      t => t.priority === task.priority && t.storyPoints === task.storyPoints
    )
    if (similarTasks.length === 0) return task.estimatedHours
    const avgActual = similarTasks.reduce((sum, t) => sum + t.actualHours, 0) / similarTasks.length
    return Math.round(avgActual * this.getMultiplier(task.priority))
  }

  predictOverdueRisk(task: Task): number {
    const overdue = this.historicalData.filter(t => new Date(t.dueDate) < new Date()).length
    const highPriority = task.priority === 'critical' || task.priority === 'high' ? 1 : 0.5
    const manyDeps = task.dependencies.length > 3 ? 1 : 0.5
    const lowProgress = task.progress < 30 ? 1 : 0.5
    return Math.min(Math.round((overdue * 0.3 + highPriority * 0.2 + manyDeps * 0.25 + lowProgress * 0.25) * 100), 100)
  }

  suggestAssignee(task: Task, members: TeamMember[]): TeamMember | null {
    if (!members.length) return null
    const scores = members.map(member => ({
      member,
      score: (1 - member.workload / 100) * 0.4 + (member.productivity / 100) * 0.3 + (member.efficiency / 100) * 0.2 + (task.labels.some(l => member.skills.includes(l)) ? 0.1 : 0)
    }))
    return scores.sort((a, b) => b.score - a.score)[0]?.member || null
  }

  private getMultiplier(priority: string): number {
    const multipliers: Record<string, number> = { critical: 0.8, high: 0.9, medium: 1.0, low: 1.3 }
    return multipliers[priority] || 1.0
  }
}

class SentimentAnalyzer {
  private positive = ['great', 'excellent', 'amazing', 'good', 'done', 'complete', 'success', 'awesome', 'fantastic']
  private negative = ['bad', 'terrible', 'issue', 'problem', 'bug', 'failed', 'error', 'blocked', 'broken', 'urgent']

  analyze(text: string): SentimentType {
    const words = text.toLowerCase().split(' ')
    let pos = 0, neg = 0
    words.forEach(w => {
      if (this.positive.includes(w)) pos++
      if (this.negative.includes(w)) neg++
    })
    if (pos > neg) return 'positive'
    if (neg > pos) return 'negative'
    return 'neutral'
  }
}

// ============================================
// CUSTOM HOOKS
// ============================================

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

const useKeyboardShortcut = (key: string, callback: () => void, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!modifiers.ctrl || e.ctrlKey) &&
        (!modifiers.shift || e.shiftKey) &&
        (!modifiers.alt || e.altKey)
      ) {
        e.preventDefault()
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, modifiers])
}

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

// ============================================
// 3D & ANIMATION COMPONENTS
// ============================================

const ParticleField: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'][Math.floor(Math.random() * 6)],
      alpha: Math.random() * 0.5 + 0.3,
    }))

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      frameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  depth?: number
  tilt?: boolean
  glow?: boolean
  onClick?: () => void
  glass?: boolean
}> = ({ children, className = '', depth = 20, tilt = true, glow = false, onClick, glass = false }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !cardRef.current) return
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
      style={{ rotateX: tilt ? rotateX : 0, rotateY: tilt ? rotateY : 0, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ scale: 1.02, z: 20 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden',
        glass && 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg',
        !glass && 'bg-white dark:bg-gray-800',
        glow && 'hover:shadow-blue-500/30',
        className
      )}
    >
      <div className="relative" style={{ transform: 'translateZ(20px)' }}>{children}</div>
      {glow && <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />}
    </motion.div>
  )
}

const FloatingElement: React.FC<{
  children: React.ReactNode
  className?: string
  speed?: number
  amplitude?: number
}> = ({ children, className = '', speed = 3, amplitude = 10 }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -amplitude, 0, amplitude, 0], rotate: [0, 2, 0, -2, 0], scale: [1, 1.02, 1, 0.98, 1] }}
    transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {children}
  </motion.div>
)

const AnimatedNumber: React.FC<{ value: number; duration?: number; prefix?: string; suffix?: string; className?: string }> = 
  ({ value, duration = 2, prefix = '', suffix = '', className = '' }) => {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    startRef.current = 0
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / (duration * 1000), 1)
      setDisplay(Math.floor(progress * value))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return <span className={className}>{prefix}{display.toLocaleString()}{suffix}</span>
}

const CircularProgress: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string; className?: string }> = 
  ({ progress, size = 120, strokeWidth = 8, color = '#3B82F6', className = '' }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} className="stroke-gray-200 dark:stroke-gray-700" fill="none" />
        <motion.circle cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} stroke={color} fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{ strokeDasharray: circumference, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatedNumber value={progress} suffix="%" className="text-2xl font-bold text-gray-900 dark:text-white" />
      </div>
    </div>
  )
}

const ProgressBar: React.FC<{ progress: number; className?: string; color?: string; showLabel?: boolean }> = 
  ({ progress, className = '', color, showLabel = true }) => (
  <div className={className}>
    {showLabel && (
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-500 dark:text-gray-400">Progress</span>
        <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
      </div>
    )}
    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={cn('h-full rounded-full', color || (progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'))}
      />
    </div>
  </div>
)

// ============================================
// STAT CARD COMPONENT
// ============================================

const StatCard: React.FC<{
  label: string
  value: string | number
  change: number
  icon: React.ElementType
  color: string
  subtitle?: string
}> = ({ label, value, change, icon: Icon, color, subtitle }) => {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    red: 'from-red-500 to-red-600',
    teal: 'from-teal-500 to-teal-600',
    cyan: 'from-cyan-500 to-cyan-600',
    amber: 'from-amber-500 to-amber-600',
  }

  return (
    <Card3D className="p-6" depth={15} glow>
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', gradients[color] || gradients.blue)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn('flex items-center space-x-1 text-sm font-medium', change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}
        >
          <span>{change >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(change)}%</span>
        </motion.div>
      </div>
      <div>
        <motion.p className="text-3xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        </motion.p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full bg-gradient-to-r rounded-full', gradients[color] || gradients.blue)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(change) * 2, 100)}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </Card3D>
  )
}

// ============================================
// TASK CARD COMPONENT
// ============================================

const TaskCard: React.FC<{
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  index: number
}> = ({ task, onToggle, onDelete, onEdit, index }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'
  const isToday = new Date(task.dueDate).toDateString() === new Date().toDateString()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group',
        task.status === 'done' && 'opacity-75'
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className={cn('px-2 py-1 text-xs rounded-full font-medium border', getPriorityColor(task.priority))}>
              {task.priority}
            </span>
            <span className={cn('px-2 py-1 text-xs rounded-full font-medium border', getStatusColor(task.status))}>
              {task.status.replace('_', ' ')}
            </span>
            {task.storyPoints > 0 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                {task.storyPoints} SP
              </span>
            )}
            {isOverdue && (
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
                className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
                Overdue
              </motion.span>
            )}
            {isToday && (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                Today
              </span>
            )}
            {task.aiGenerated && <span title="AI Generated" className="text-sm">🤖</span>}
            {task.isRecurring && <span title="Recurring" className="text-sm">🔄</span>}
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onToggle(task.id) }}
              className={cn('p-1.5 rounded-lg transition-colors',
                task.status === 'done' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600'
              )}>
              <CheckCircle2 className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onEdit(task.id) }}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500">
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <Link to={`/tasks/${task.id}`} className="block mb-4">
          <h3 className={cn('font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
            task.status === 'done' && 'line-through text-gray-400 dark:text-gray-500')}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
        </Link>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.labels.map(label => (
              <span key={label} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <ProgressBar progress={task.progress} className="mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow">
              {task.assigneeAvatar}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{task.assignee}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(task.dueDate)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{task.estimatedHours}h</span>
            {task.comments && task.comments.length > 0 && (
              <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" />{task.comments.length}</span>
            )}
            <span className="flex items-center"><ThumbsUp className="w-3 h-3 mr-1" />{task.votes}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function Dashboard() {
  // Preferences
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>('userPreferences', {
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    weekStartsOn: 1,
    notifications: { email: true, push: true, inApp: true, digest: 'daily', types: ['mentions', 'assignments', 'comments', 'due_dates'] },
    layout: { density: 'comfortable', sidebarPosition: 'left', sidebarCollapsed: false, taskView: 'board', columns: 3 },
    accessibility: { highContrast: false, reduceMotion: false, fontSize: 'medium', screenReader: false, keyboardShortcuts: true },
  })

  // State
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [metrics] = useState<ProjectMetrics>({
    velocity: 45, cycleTime: 3.2, leadTime: 5.1, throughput: 12, workInProgress: 8,
    scopeCreep: 5, technicalDebt: 15, testCoverage: 78, buildSuccessRate: 92,
    deploymentFrequency: 3.5, meanTimeToRecover: 2.1, changeFailureRate: 8,
    teamSatisfaction: 87, customerSatisfaction: 92, revenue: 250000, costs: 180000, roi: 38.9,
  })
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [memberFilter, setMemberFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroMode, setPomodoroMode] = useState<PomodoroMode>('work')
  const [pomodoroCycles, setPomodoroCycles] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [toasts, setToasts] = useState<Array<{ id: string; type: string; message: string }>>([])

  // Refs
  const pomodoroRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const predictorRef = useRef<TaskPredictor | null>(null)
  const sentimentRef = useRef<SentimentAnalyzer | null>(null)

  // Derived
  const isDark = prefs.theme === 'dark'
  const isMobile = useMediaQuery('(max-width: 768px)')
  const unreadNotifs = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  // Initialize dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Initialize
  useEffect(() => {
    loadData()
    return () => { if (pomodoroRef.current) clearInterval(pomodoroRef.current) }
  }, [])

  // Keyboard shortcuts
  useKeyboardShortcut('k', () => setShowCommandPalette(true), { ctrl: true })
  useKeyboardShortcut('n', () => setShowNewTask(true), { ctrl: true })
  useKeyboardShortcut('f', () => searchRef.current?.focus(), { ctrl: true })
  useKeyboardShortcut('Escape', () => {
    setShowNewTask(false)
    setShowAI(false)
    setShowNotifs(false)
    setFocusMode(false)
    setShowCommandPalette(false)
  })
  useKeyboardShortcut('d', () => toggleTheme(), { ctrl: true, shift: true })

  const toggleTheme = () => {
    setPrefs(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))
    addToast('success', `Switched to ${prefs.theme === 'dark' ? 'light' : 'dark'} mode`)
  }

  const loadData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const sampleTasks: Task[] = Array.from({ length: 12 }, (_, i) => ({
      id: `task-${i + 1}`,
      title: [
        'Design new dashboard with 3D effects',
        'Implement real-time collaboration',
        'Write API documentation',
        'Fix mobile layout bugs',
        'Set up CI/CD pipeline',
        'Database query optimization',
        'Implement dark mode',
        'Weekly standup meeting',
        'User authentication system',
        'Performance monitoring setup',
        'Create onboarding tutorial',
        'Integrate payment gateway',
      ][i],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      status: (['in_progress', 'todo', 'review', 'done', 'in_progress', 'todo', 'backlog', 'todo', 'in_progress', 'review', 'done', 'todo'] as TaskStatus[])[i],
      priority: (['high', 'critical', 'medium', 'high', 'high', 'medium', 'low', 'medium', 'high', 'medium', 'low', 'critical'] as TaskPriority[])[i],
      assignee: ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Alice Johnson', 'Team', 'Bob Smith', 'Diana Prince', 'Charlie Brown', 'Bob Smith'][i],
      assigneeAvatar: ['AJ', 'BS', 'CB', 'AJ', 'BS', 'CB', 'AJ', 'TM', 'BS', 'DP', 'CB', 'BS'][i],
      assigneeEmail: `user${i}@taskcollab.com`,
      reporter: 'Eve Wilson',
      dueDate: new Date(Date.now() + (i - 3) * 86400000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      labels: [['design', 'frontend'], ['backend', 'core'], ['documentation'], ['bug', 'mobile'], ['devops'], ['backend', 'performance'], ['feature', 'UI'], ['meeting'], ['security'], ['monitoring'], ['onboarding'], ['payment']][i],
      tags: [['3D', 'animation'], ['websocket'], ['api'], ['fix'], ['ci-cd'], ['database'], ['dark-mode'], ['standup'], ['auth'], ['perf'], ['tutorial'], ['stripe']][i],
      estimatedHours: [8, 16, 12, 6, 10, 20, 8, 1, 24, 8, 16, 12][i],
      actualHours: [3, 0, 10, 5, 4, 0, 0, 0, 12, 6, 8, 0][i],
      progress: [65, 10, 85, 100, 45, 5, 0, 0, 50, 75, 100, 15][i],
      storyPoints: [5, 8, 3, 3, 5, 8, 3, 1, 8, 5, 5, 8][i],
      sprint: i < 8 ? '1' : '2',
      epic: ['UI Modernization', 'Collaboration', 'Documentation', 'UI Modernization', 'Infrastructure', 'Infrastructure', 'UI Modernization', 'Meetings', 'Security', 'Infrastructure', 'Onboarding', 'Revenue'][i],
      comments: [],
      checklists: [],
      attachments: [],
      timeLogs: [],
      dependencies: [],
      activities: [],
      isRecurring: i === 7,
      aiGenerated: [false, true, false, false, true, false, false, false, false, false, false, false][i],
      sentiment: (['positive', 'neutral', 'positive', 'positive', 'neutral', 'neutral', 'positive', 'neutral', 'neutral', 'positive', 'positive', 'neutral'] as SentimentType[])[i],
      confidence: 0.9,
      effortScore: [8, 13, 4, 3, 6, 10, 2, 1, 10, 5, 7, 12][i],
      valueScore: [9, 10, 7, 6, 8, 7, 5, 3, 9, 6, 8, 9][i],
      riskLevel: (['low', 'high', 'low', 'low', 'medium', 'medium', 'low', 'low', 'high', 'low', 'low', 'high'] as RiskLevel[])[i],
      customFields: {},
      watchers: [],
      votes: Math.floor(Math.random() * 30),
      version: 1,
      template: '',
      subtasks: [],
      color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4', '#84CC16', '#D946EF'][i],
      position: i,
    }))

    const sampleMembers: TeamMember[] = [
      { id: '1', name: 'Alice Johnson', email: 'alice@taskcollab.com', role: 'Lead Designer', department: 'Design', avatar: 'AJ', status: 'online', tasksCompleted: 45, tasksInProgress: 3, productivity: 92, efficiency: 88, lastActive: 'Now', skills: ['design', 'UI/UX', 'figma', 'sketch'], certifications: ['UX Certified'], availability: 85, workload: 70, timezone: 'America/New_York', workingHours: { start: '09:00', end: '17:00', days: [1,2,3,4,5] }, location: 'New York', phone: '+1-555-0101', joinDate: '2025-01-15', reportsTo: 'Eve Wilson', performance: 95, mood: 'focused', breakTime: 0, meetingsToday: 2, goalsCompleted: 8, totalGoals: 10 },
      { id: '2', name: 'Bob Smith', email: 'bob@taskcollab.com', role: 'Senior Developer', department: 'Engineering', avatar: 'BS', status: 'busy', tasksCompleted: 38, tasksInProgress: 5, productivity: 87, efficiency: 82, lastActive: '5m ago', skills: ['backend', 'websocket', 'nodejs', 'python'], certifications: ['AWS Certified'], availability: 70, workload: 90, timezone: 'America/Chicago', workingHours: { start: '08:00', end: '16:00', days: [1,2,3,4,5] }, location: 'Chicago', phone: '+1-555-0102', joinDate: '2025-02-01', reportsTo: 'Eve Wilson', performance: 88, mood: 'stressed', breakTime: 15, meetingsToday: 4, goalsCompleted: 6, totalGoals: 8 },
      { id: '3', name: 'Charlie Brown', email: 'charlie@taskcollab.com', role: 'Backend Developer', department: 'Engineering', avatar: 'CB', status: 'online', tasksCompleted: 28, tasksInProgress: 2, productivity: 78, efficiency: 75, lastActive: 'Now', skills: ['backend', 'database', 'api', 'java'], certifications: ['Oracle Certified'], availability: 90, workload: 60, timezone: 'America/Denver', workingHours: { start: '07:00', end: '15:00', days: [1,2,3,4,5] }, location: 'Denver', phone: '+1-555-0103', joinDate: '2025-03-15', reportsTo: 'Bob Smith', performance: 82, mood: 'happy', breakTime: 5, meetingsToday: 1, goalsCompleted: 7, totalGoals: 9 },
      { id: '4', name: 'Diana Prince', email: 'diana@taskcollab.com', role: 'QA Engineer', department: 'Quality', avatar: 'DP', status: 'idle', tasksCompleted: 52, tasksInProgress: 1, productivity: 95, efficiency: 92, lastActive: '15m ago', skills: ['testing', 'automation', 'selenium'], certifications: ['ISTQB Certified'], availability: 80, workload: 50, timezone: 'America/Los_Angeles', workingHours: { start: '10:00', end: '18:00', days: [1,2,3,4,5] }, location: 'San Francisco', phone: '+1-555-0104', joinDate: '2025-04-01', reportsTo: 'Eve Wilson', performance: 94, mood: 'focused', breakTime: 0, meetingsToday: 2, goalsCompleted: 9, totalGoals: 10 },
      { id: '5', name: 'Eve Wilson', email: 'eve@taskcollab.com', role: 'Product Manager', department: 'Product', avatar: 'EW', status: 'offline', tasksCompleted: 15, tasksInProgress: 0, productivity: 70, efficiency: 68, lastActive: '1h ago', skills: ['product', 'management', 'agile'], certifications: ['PMP'], availability: 60, workload: 80, timezone: 'America/New_York', workingHours: { start: '09:00', end: '17:00', days: [1,2,3,4,5] }, location: 'Boston', phone: '+1-555-0105', joinDate: '2025-01-01', reportsTo: 'CEO', performance: 90, mood: 'neutral', breakTime: 30, meetingsToday: 6, goalsCompleted: 4, totalGoals: 5 },
    ]

    setTasks(sampleTasks)
    setMembers(sampleMembers)
    setNotifications([
      { id: 'n1', type: 'success', title: 'Task Completed', message: 'Alice completed "Fix mobile layout bugs"', timestamp: '2m ago', read: false, actionUrl: '', category: 'tasks', priority: 'normal', dismissible: true, expiryDate: '', icon: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'n2', type: 'info', title: 'New Comment', message: 'Charlie commented on "API documentation"', timestamp: '15m ago', read: false, actionUrl: '', category: 'comments', priority: 'normal', dismissible: true, expiryDate: '', icon: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'n3', type: 'warning', title: 'Task Overdue', message: '"Design dashboard" is overdue', timestamp: '1h ago', read: true, actionUrl: '', category: 'tasks', priority: 'high', dismissible: true, expiryDate: '', icon: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ])
    setSprints([
      { id: 's1', name: 'Sprint 1', goal: 'Core features', startDate: '2026-05-15', endDate: '2026-05-29', status: 'active', tasks: ['1','2','3','4','5','8'], velocity: 45, burndown: [], teamCapacity: 80, plannedPoints: 55, completedPoints: 32, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ])
    setAiInsights([
      { id: 'ai1', type: 'recommendation', title: 'Task Assignment', description: 'Consider assigning API docs to Charlie based on workload.', confidence: 0.85, impact: 'medium', actionable: true, suggestion: 'Reassign to Charlie Brown', data: {}, createdAt: new Date().toISOString(), acknowledged: false, category: 'optimization' },
      { id: 'ai2', type: 'risk_alert', title: 'Overdue Risk', description: 'Real-time collaboration task has 75% chance of being overdue.', confidence: 0.75, impact: 'high', actionable: true, suggestion: 'Add resources or break down task.', data: {}, createdAt: new Date().toISOString(), acknowledged: false, category: 'risk' },
    ])
    setWeather({ temperature: 72, condition: 'Partly Cloudy', icon: '⛅', humidity: 45, windSpeed: 8, location: 'San Francisco, CA', high: 75, low: 58, forecast: 'Sunny tomorrow' })
    setQuote({ text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' })
    
    predictorRef.current = new TaskPredictor(sampleTasks)
    sentimentRef.current = new SentimentAnalyzer()
    setLoading(false)
  }

  const refreshData = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    await loadData()
    setRefreshing(false)
    addToast('success', 'Data refreshed successfully')
  }

  const addTask = () => {
    const newTask: Task = {
      id: generateId('task_'), title: 'New Task', description: '', status: 'todo', priority: 'medium',
      assignee: '', assigneeAvatar: '', assigneeEmail: '', reporter: 'You', dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), labels: [], tags: [],
      estimatedHours: 4, actualHours: 0, progress: 0, storyPoints: 1, sprint: '', epic: '',
      comments: [], checklists: [], attachments: [], timeLogs: [], dependencies: [], activities: [],
      isRecurring: false, aiGenerated: false, sentiment: 'neutral', confidence: 0, effortScore: 1,
      valueScore: 1, riskLevel: 'low', customFields: {}, watchers: [], votes: 0, version: 1, template: '',
      subtasks: [], color: '#3B82F6', position: tasks.length,
    }
    setTasks(prev => [newTask, ...prev])
    setShowNewTask(false)
    addToast('success', 'Task created successfully')
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const order: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done']
      const idx = order.indexOf(t.status)
      const next = order[(idx + 1) % order.length]
      return { ...t, status: next, progress: next === 'done' ? 100 : t.progress, updatedAt: new Date().toISOString(), completedAt: next === 'done' ? new Date().toISOString() : t.completedAt }
    }))
  }

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    setTasks(prev => prev.filter(t => t.id !== id))
    if (task) {
      addToast('info', `"${task.title}" deleted`)
    }
  }

  const editTask = (id: string) => {
    setShowNewTask(true)
  }

  const dismissNotif = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id))
  const clearNotifs = () => setNotifications([])
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const addToast = (type: string, message: string) => {
    const toast = { id: generateId('toast_'), type, message }
    setToasts(prev => [...prev, toast])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 4000)
  }

  const togglePomodoro = () => {
    if (pomodoroActive) {
      if (pomodoroRef.current) { clearInterval(pomodoroRef.current); pomodoroRef.current = null }
      setPomodoroActive(false)
    } else {
      setPomodoroActive(true)
      pomodoroRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            if (pomodoroRef.current) { clearInterval(pomodoroRef.current); pomodoroRef.current = null }
            setPomodoroActive(false)
            if (pomodoroMode === 'work') {
              setPomodoroCycles(c => { const nc = c + 1; if (nc % 4 === 0) { setPomodoroMode('longBreak'); return 0 } else { setPomodoroMode('shortBreak'); return nc } })
            } else { setPomodoroMode('work') }
            addToast('success', pomodoroMode === 'work' ? 'Focus session complete! 🎉' : 'Break over, time to focus! 💪')
            return pomodoroMode === 'work' ? 5 * 60 : pomodoroMode === 'shortBreak' ? 25 * 60 : 15 * 60
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const resetPomodoro = () => {
    if (pomodoroRef.current) { clearInterval(pomodoroRef.current); pomodoroRef.current = null }
    setPomodoroActive(false); setPomodoroTime(25 * 60); setPomodoroMode('work'); setPomodoroCycles(0)
  }

  const executeCommand = (cmd: string) => {
    setCommandHistory(prev => [cmd, ...prev])
    switch (cmd.toLowerCase()) {
      case 'new task': setShowNewTask(true); break
      case 'toggle theme': toggleTheme(); break
      case 'focus mode': setFocusMode(prev => !prev); break
      case 'refresh': refreshData(); break
      case 'clear notifications': clearNotifs(); break
      default: addToast('info', `Command "${cmd}" executed`)
    }
    setShowCommandPalette(false)
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
        const matchesMember = memberFilter === 'all' || t.assignee === memberFilter
        return matchesSearch && matchesStatus && matchesPriority && matchesMember
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        switch (sortBy) {
          case 'dueDate': return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir
          case 'priority': { const w: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }; return ((w[b.priority]||0) - (w[a.priority]||0)) * dir }
          case 'progress': return (b.progress - a.progress) * dir
          case 'title': return a.title.localeCompare(b.title) * dir
          case 'votes': return (b.votes - a.votes) * dir
          default: return 0
        }
      })
  }, [tasks, search, statusFilter, priorityFilter, memberFilter, sortBy, sortDir])

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    review: tasks.filter(t => t.status === 'review').length,
    backlog: tasks.filter(t => t.status === 'backlog').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0,
    totalHours: tasks.reduce((s, t) => s + t.estimatedHours, 0),
    totalPoints: tasks.reduce((s, t) => s + t.storyPoints, 0),
    completedPoints: tasks.filter(t => t.status === 'done').reduce((s, t) => s + t.storyPoints, 0),
    highPriority: tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length,
    aiGenerated: tasks.filter(t => t.aiGenerated).length,
    avgProgress: tasks.length > 0 ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length) : 0,
    totalVotes: tasks.reduce((s, t) => s + t.votes, 0),
  }), [tasks])

  // SAFE: chartData with proper null checks
  const chartData = useMemo(() => ({
    weekly: tasks.length > 0 ? [
      { label: 'Mon', value: tasks.filter(t => new Date(t.createdAt).getDay() === 1).length, color: 'from-blue-500 to-blue-400' },
      { label: 'Tue', value: tasks.filter(t => new Date(t.createdAt).getDay() === 2).length, color: 'from-green-500 to-green-400' },
      { label: 'Wed', value: tasks.filter(t => new Date(t.createdAt).getDay() === 3).length, color: 'from-purple-500 to-purple-400' },
      { label: 'Thu', value: tasks.filter(t => new Date(t.createdAt).getDay() === 4).length, color: 'from-orange-500 to-orange-400' },
      { label: 'Fri', value: tasks.filter(t => new Date(t.createdAt).getDay() === 5).length, color: 'from-pink-500 to-pink-400' },
      { label: 'Sat', value: tasks.filter(t => new Date(t.createdAt).getDay() === 6).length, color: 'from-indigo-500 to-indigo-400' },
      { label: 'Sun', value: tasks.filter(t => new Date(t.createdAt).getDay() === 0).length, color: 'from-teal-500 to-teal-400' },
    ] : [],
    priority: [
      { label: 'Critical', value: tasks.filter(t => t.priority === 'critical').length, color: 'from-red-500 to-red-400' },
      { label: 'High', value: tasks.filter(t => t.priority === 'high').length, color: 'from-orange-500 to-orange-400' },
      { label: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: 'from-yellow-500 to-yellow-400' },
      { label: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: 'from-green-500 to-green-400' },
    ],
    status: [
      { label: 'Done', value: stats?.completed || 0, color: 'from-green-500 to-green-400' },
      { label: 'In Progress', value: stats?.inProgress || 0, color: 'from-blue-500 to-blue-400' },
      { label: 'Review', value: stats?.review || 0, color: 'from-yellow-500 to-yellow-400' },
      { label: 'Todo', value: stats?.todo || 0, color: 'from-gray-500 to-gray-400' },
      { label: 'Backlog', value: stats?.backlog || 0, color: 'from-purple-500 to-purple-400' },
    ],
  }), [tasks, stats]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <Rocket className="w-12 h-12 text-blue-500" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">TaskCollab</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Loading your workspace...</p>
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div key={i} className="w-3 h-3 rounded-full bg-blue-500"
                animate={{ y: [0, -15, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Main Render
  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <ParticleField count={40} />
      
      <div className="relative space-y-6 p-4 sm:p-6 lg:p-8 max-w-[2000px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <Rocket className="w-10 h-10 text-blue-500" />
            </motion.div>
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TaskCollab
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {/* Pomodoro Timer */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={togglePomodoro}
              className={cn('flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all',
                pomodoroActive ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700')}>
              <Clock className={cn('w-4 h-4', pomodoroActive && 'animate-pulse')} />
              <span className="font-mono">{formatTime(pomodoroTime)}</span>
              {pomodoroActive && <span className="text-xs opacity-75">{pomodoroMode === 'work' ? 'Focus' : 'Break'}</span>}
            </motion.button>
            {pomodoroActive && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetPomodoro}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <RotateCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}

            {/* Refresh */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refreshData}
              className={cn('p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700', refreshing && 'animate-spin', 'bg-white dark:bg-gray-800')}>
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme}
              className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
              {isDark ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </motion.button>

            {/* Focus Mode */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFocusMode(true)}
              className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
              <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 relative bg-white dark:bg-gray-800">
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                {unreadNotifs > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadNotifs}
                  </motion.span>
                )}
              </motion.button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 z-50 overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <div className="flex space-x-2">
                        <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400">Mark all read</button>
                        <button onClick={clearNotifs} className="text-xs text-red-600 dark:text-red-400">Clear</button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center"><Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-500 dark:text-gray-400">No notifications</p></div>
                      ) : notifications.map(n => (
                        <div key={n.id} className={cn('p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer', !n.read && 'bg-blue-50 dark:bg-blue-900/20')}>
                          <div className="flex items-start space-x-3">
                            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                            {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                            {n.type === 'info' && <Bell className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                            {n.type === 'error' && <X className="w-5 h-5 text-red-500 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{n.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.timestamp}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); dismissNotif(n.id) }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex-shrink-0">
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Task Button */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNewTask(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl text-sm">
              <Plus className="w-4 h-4" /><span>New Task</span>
            </motion.button>
          </div>
        </div>

        {/* AI Insights Banner */}
        <AnimatePresence>
          {aiInsights.filter(i => !i.acknowledged).length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-2">
              {aiInsights.filter(i => !i.acknowledged).map(insight => (
                <div key={insight.id} className={cn('p-4 rounded-xl border-l-4',
                  insight.type === 'risk_alert' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                  insight.type === 'optimization' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                  'bg-green-50 dark:bg-green-900/20 border-green-500')}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {insight.type === 'risk_alert' ? <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" /> :
                       insight.type === 'optimization' ? <Zap className="w-5 h-5 text-blue-500 mt-0.5" /> :
                       <Target className="w-5 h-5 text-green-500 mt-0.5" />}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{insight.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                        {insight.actionable && <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">💡 {insight.suggestion}</p>}
                      </div>
                    </div>
                    <button onClick={() => setAiInsights(prev => prev.map(i => i.id === insight.id ? {...i, acknowledged: true} : i))}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><X className="w-4 h-4 text-gray-500" /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quote & Weather Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {quote && (
            <Card3D className="p-6" depth={10}>
              <div className="flex items-center space-x-4">
                <FloatingElement speed={4} amplitude={5}><span className="text-3xl">💡</span></FloatingElement>
                <div>
                  <p className="text-lg italic text-gray-700 dark:text-gray-300">"{quote.text}"</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">— {quote.author}</p>
                </div>
              </div>
            </Card3D>
          )}
          {weather && (
            <Card3D className="p-6" depth={10}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FloatingElement speed={3} amplitude={8}><span className="text-4xl">{weather.icon}</span></FloatingElement>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{weather.temperature}°F</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{weather.condition}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">H: {weather.high}° L: {weather.low}°</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="font-medium">{weather.location}</p>
                  <p>💧 {weather.humidity}%</p>
                  <p>💨 {weather.windSpeed} mph</p>
                  <p className="text-xs text-gray-400">{weather.forecast}</p>
                </div>
              </div>
            </Card3D>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Tasks" value={stats.total} change={12} icon={ListTodo} color="blue" subtitle={`${stats.completed} completed`} />
          <StatCard label="In Progress" value={stats.inProgress} change={-3} icon={TrendingUp} color="purple" subtitle={`${stats.todo} to do`} />
          <StatCard label="Completed" value={stats.completed} change={8} icon={CheckCircle2} color="green" subtitle={`${stats.completionRate}% rate`} />
          <StatCard label="Overdue" value={stats.overdue} change={5} icon={AlertTriangle} color="red" subtitle={`${stats.highPriority} high priority`} />
          <StatCard label="Story Points" value={`${stats.completedPoints}/${stats.totalPoints}`} change={15} icon={Target} color="orange" subtitle={`${stats.avgProgress}% avg progress`} />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: PieChart, color: 'text-green-600 dark:text-green-400' },
            { label: 'Blocked Tasks', value: stats.blocked, icon: Lock, color: 'text-red-600 dark:text-red-400' },
            { label: 'AI Generated', value: stats.aiGenerated, icon: Sparkles, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Total Votes', value: stats.totalVotes, icon: ThumbsUp, color: 'text-orange-600 dark:text-orange-400' },
            { label: 'Team Members', value: members.length, icon: Users, color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Active Sprints', value: sprints.filter(s => s.status === 'active').length, icon: GitBranch, color: 'text-teal-600 dark:text-teal-400' },
          ].map((item, i) => (
            <Card3D key={i} className="p-4 text-center" depth={8}>
              <item.icon className={cn('w-6 h-6 mx-auto mb-2', item.color)} />
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            </Card3D>
          ))}
        </div>

        {/* Analytics Charts - SAFE VERSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card3D className="p-6" depth={20}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-blue-500" /><span>Weekly Productivity</span>
            </h2>
            <div className="flex items-end space-x-3" style={{ height: '200px', perspective: '1000px' }}>
              {/* SAFE: Check if weekly array exists and has items */}
              {chartData.weekly && Array.isArray(chartData.weekly) && chartData.weekly.length > 0 ? (
                chartData.weekly.map((item, i) => {
                  const maxValue = Math.max(...chartData.weekly.map(w => w.value), 1);
                  const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={cn('w-full rounded-t-lg bg-gradient-to-t relative', item.color)}
                        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-5deg)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)', minHeight: '20px' }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-900 dark:text-white">{item.value}</div>
                      </motion.div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-gray-500 py-8">No weekly data available</div>
              )}
            </div>
          </Card3D>
          
          <Card3D className="p-6" depth={20}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-purple-500" /><span>Task Distribution</span>
            </h2>
            <div className="space-y-4">
              {/* SAFE: Check if status array exists */}
              {chartData.status && Array.isArray(chartData.status) && chartData.status.length > 0 ? (
                chartData.status.map((item, i) => {
                  const total = stats?.total || 1;
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: i * 0.15 }} 
                          className={cn('h-full rounded-full bg-gradient-to-r', item.color)} 
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-8">No task distribution data available</div>
              )}
            </div>
          </Card3D>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input ref={searchRef} type="text" placeholder="Search tasks... (Ctrl+F)" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="all">All Status</option>
            <option value="backlog">Backlog</option><option value="todo">To Do</option>
            <option value="in_progress">In Progress</option><option value="review">Review</option>
            <option value="done">Done</option><option value="blocked">Blocked</option>
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="all">All Priority</option>
            <option value="critical">Critical</option><option value="high">High</option>
            <option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <select value={memberFilter} onChange={e => setMemberFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="all">All Members</option>
            {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="dueDate">Due Date</option><option value="priority">Priority</option>
            <option value="progress">Progress</option><option value="title">Title</option>
            <option value="votes">Votes</option>
          </select>
          <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-2">
            {sortDir === 'asc' ? <ArrowUp className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ArrowDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
            <span className="text-sm text-gray-600 dark:text-gray-400">{sortDir === 'asc' ? 'ASC' : 'DESC'}</span>
          </button>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Search className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-500 dark:text-gray-400 mb-2">No tasks found</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">{search ? 'Try different search terms or filters' : 'Create your first task to get started!'}</p>
            {!search && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNewTask(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg">
                <Plus className="w-5 h-5 inline mr-2" />Create Your First Task
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Team Members Section */}
        <Card3D className="p-6" depth={15}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" /><span>Team Members</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-2">({members.length} members)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {members.map(member => (
              <motion.div key={member.id} whileHover={{ y: -5 }} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow">{member.avatar}</div>
                    <span className={cn('absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800', getMemberStatusColor(member.status))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
                  </div>
                  <span className="text-xl">{member.mood === 'happy' ? '😊' : member.mood === 'focused' ? '🎯' : member.mood === 'stressed' ? '😰' : '😐'}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Productivity</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{member.productivity}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${member.productivity}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{member.tasksCompleted} completed</span>
                    <span>{member.tasksInProgress} active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{member.meetingsToday} meetings</span>
                    <span className="flex items-center"><Target className="w-3 h-3 mr-1" />{member.goalsCompleted}/{member.totalGoals}</span>
                  </div>
                </div>
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {member.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">+{member.skills.length - 3}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card3D>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { icon: Plus, label: 'New Task', action: () => setShowNewTask(true), color: 'text-blue-500' },
            { icon: RefreshCw, label: 'Refresh', action: refreshData, color: 'text-green-500' },
            { icon: Download, label: 'Export', action: () => addToast('info', 'Export started'), color: 'text-purple-500' },
            { icon: Settings, label: 'Settings', action: () => {}, color: 'text-gray-500' },
            { icon: Brain, label: 'AI Assistant', action: () => setShowAI(true), color: 'text-pink-500' },
            { icon: Timer, label: 'Pomodoro', action: togglePomodoro, color: 'text-red-500' },
          ].map((item, i) => (
            <motion.button key={i} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={item.action}
              className="flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:shadow-lg transition-all">
              <item.icon className={cn('w-5 h-5', item.color)} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTask && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowNewTask(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Task</h2>
                  <button onClick={() => setShowNewTask(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label><input type="text" className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Task title" autoFocus /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea rows={3} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none" placeholder="Description" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label><select className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label><input type="date" className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Points</label><select className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{[1,2,3,5,8,13,21].map(sp => <option key={sp} value={sp}>{sp} points</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label><select className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"><option value="">Unassigned</option>{members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button onClick={addTask} className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg">Create Task</button>
                    <button onClick={() => setShowNewTask(false)} className="px-6 py-2.5 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAI && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowAI(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2"><Brain className="w-5 h-5" /><h3 className="font-semibold">AI Assistant</h3></div>
                  <button onClick={() => setShowAI(false)}><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-4 h-80 overflow-y-auto space-y-3">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3"><p className="text-sm font-medium text-gray-900 dark:text-white">📊 Predictions</p><p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Tasks with matching skills are completed 25% faster. Consider skill-based assignments.</p></div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"><p className="text-sm font-medium text-blue-900 dark:text-blue-400">💡 Recommendation</p><p className="text-sm mt-1 text-blue-800 dark:text-blue-300">Charlie has low workload (60%). Consider assigning him the database optimization task.</p></div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3"><p className="text-sm font-medium text-green-900 dark:text-green-400">✅ Optimization</p><p className="text-sm mt-1 text-green-800 dark:text-green-300">Batching similar tasks could improve team productivity by 15%.</p></div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3"><p className="text-sm font-medium text-yellow-900 dark:text-yellow-400">⚠️ Risk Alert</p><p className="text-sm mt-1 text-yellow-800 dark:text-yellow-300">2 critical tasks are overdue. Review priorities immediately.</p></div>
              </div>
              <div className="p-4 border-t dark:border-gray-700"><div className="flex space-x-2"><input type="text" placeholder="Ask AI anything..." className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 text-sm focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" /><button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">Send</button></div></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setFocusMode(false)}>
            <div className="text-center text-white">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Target className="w-32 h-32 mx-auto mb-6 text-blue-400" />
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">Focus Mode</h2>
              <p className="text-2xl text-gray-300 mb-2">Deep work in progress...</p>
              <p className="text-lg text-gray-400">Stay focused. You've got this! 💪</p>
              <p className="text-sm text-gray-500 mt-8">Click anywhere or press Esc to exit</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowCommandPalette(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700"><input type="text" placeholder="Type a command..." className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" autoFocus
                onKeyDown={e => { if (e.key === 'Enter') executeCommand((e.target as HTMLInputElement).value) }} /></div>
              <div className="p-2 max-h-60 overflow-y-auto">
                {['New Task', 'Toggle Theme', 'Focus Mode', 'Refresh', 'Clear Notifications'].map(cmd => (
                  <button key={cmd} onClick={() => executeCommand(cmd.toLowerCase())}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">{cmd}</button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
              className={cn('px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium',
                toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500')}>
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}