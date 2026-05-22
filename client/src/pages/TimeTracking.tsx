// src/pages/TimeTracking.tsx - Complete Time Tracking Page

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, StopCircle, Clock, Calendar, User,
  Plus, Search, Filter, Download, RefreshCw,
  BarChart3, TrendingUp, CheckCircle2, X,
  ChevronDown, Edit, Trash2, DollarSign, Target,
  AlertCircle, Save, Upload, PieChart, Zap,
  Sun, Moon, Settings, Filter as FilterIcon,
  Layers, Calendar as CalendarIcon, Users,
  Activity, Award, Flame, Heart
} from 'lucide-react'

// Types
interface TimeEntry {
  id: string
  task: string
  project: string
  description: string
  startTime: string
  endTime: string | null
  duration: number
  billable: boolean
  status: 'running' | 'paused' | 'stopped'
  user: {
    id: string
    name: string
    avatar: string
    email?: string
  }
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
  color: string
  rate?: number
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user' | 'manager'
}

interface TimeStats {
  total: number
  billable: number
  nonBillable: number
  entriesCount: number
  averageDuration: number
  topProject: string | null
  weeklyTotal: number
  monthlyTotal: number
  dailyAverage: number
}

// Mock Data
const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Dashboard Redesign', color: '#3B82F6', rate: 85 },
  { id: '2', name: 'API Development', color: '#10B981', rate: 95 },
  { id: '3', name: 'Mobile App', color: '#F59E0B', rate: 75 },
  { id: '4', name: 'Code Review', color: '#8B5CF6', rate: 65 },
  { id: '5', name: 'Documentation', color: '#EC4899', rate: 70 },
]

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'AJ', role: 'admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'BS', role: 'manager' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'CB', role: 'user' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', avatar: 'DP', role: 'user' },
]

// Helper Functions
const formatDuration = (minutes: number): string => {
  if (minutes < 0) return '0m'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTimeRange = (start: string, end: string | null): string => {
  const startTime = new Date(start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (!end) return `${startTime} - Present`
  const endTime = new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${startTime} - ${endTime}`
}

const calculateStats = (entries: TimeEntry[]): TimeStats => {
  const total = entries.reduce((sum, e) => sum + e.duration, 0)
  const billable = entries.filter(e => e.billable).reduce((sum, e) => sum + e.duration, 0)
  const nonBillable = total - billable
  
  // Find top project
  const projectMap = new Map<string, number>()
  entries.forEach(entry => {
    const current = projectMap.get(entry.project) || 0
    projectMap.set(entry.project, current + entry.duration)
  })
  let topProject: string | null = null
  let maxDuration = 0
  projectMap.forEach((duration, project) => {
    if (duration > maxDuration) {
      maxDuration = duration
      topProject = project
    }
  })
  
  // Weekly and monthly totals
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const weeklyTotal = entries.filter(e => new Date(e.startTime) >= weekAgo).reduce((sum, e) => sum + e.duration, 0)
  const monthlyTotal = entries.filter(e => new Date(e.startTime) >= monthAgo).reduce((sum, e) => sum + e.duration, 0)
  const dailyAverage = entries.length > 0 ? total / entries.length : 0
  
  return {
    total,
    billable,
    nonBillable,
    entriesCount: entries.length,
    averageDuration: entries.length > 0 ? total / entries.length : 0,
    topProject,
    weeklyTotal,
    monthlyTotal,
    dailyAverage
  }
}

// Components
interface NewEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'user'>) => void
  projects: Project[]
  currentUser: User
  darkMode?: boolean
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({ isOpen, onClose, onSave, projects, currentUser, darkMode }) => {
  const [task, setTask] = useState('')
  const [project, setProject] = useState(projects[0]?.name || '')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [billable, setBillable] = useState(true)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('09:00')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return
    
    const startDateTime = new Date(`${startDate}T${startTime}`).toISOString()
    const durationMinutes = parseInt(duration) || 0
    const endDateTime = new Date(new Date(startDateTime).getTime() + durationMinutes * 60000).toISOString()
    
    onSave({
      task,
      project,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      duration: durationMinutes,
      billable
    })
    
    onClose()
    setTask('')
    setDescription('')
    setDuration('')
    setBillable(true)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Time Entry</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Name *</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="What did you work on?"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Add details about your work..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 120"
              min="0"
              step="15"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={billable}
                onChange={(e) => setBillable(e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Billable</span>
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">Rate: ${projects.find(p => p.name === project)?.rate || 0}/hr</span>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Entry
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

interface EditEntryModalProps {
  entry: TimeEntry | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedEntry: TimeEntry) => void
  projects: Project[]
  darkMode?: boolean
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({ entry, isOpen, onClose, onSave, projects, darkMode }) => {
  const [task, setTask] = useState('')
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [billable, setBillable] = useState(true)
  
  useEffect(() => {
    if (entry) {
      setTask(entry.task)
      setProject(entry.project)
      setDescription(entry.description)
      setDuration(entry.duration.toString())
      setBillable(entry.billable)
    }
  }, [entry])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry || !task.trim()) return
    
    onSave({
      ...entry,
      task,
      project,
      description,
      duration: parseInt(duration) || 0,
      billable,
      updatedAt: new Date().toISOString()
    })
    
    onClose()
  }
  
  if (!isOpen || !entry) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Time Entry</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Name</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              step="15"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={billable}
              onChange={(e) => setBillable(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded"
              id="edit-billable"
            />
            <label htmlFor="edit-billable" className="text-sm text-gray-700 dark:text-gray-300">Billable</label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Main Component
export default function TimeTracking() {
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
  
  // State
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProject, setFilterProject] = useState<string>('all')
  const [filterBillable, setFilterBillable] = useState<'all' | 'billable' | 'non-billable'>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today')
  const [currentUser] = useState<User>(MOCK_USERS[0])
  const [projects] = useState<Project[]>(MOCK_PROJECTS)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [showFilters, setShowFilters] = useState(false)
  
  const timerRef = useRef<number | null>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  
  // Filtering logic
  const getFilteredEntries = useCallback(() => {
    let filtered = [...entries]
    
    // Date range filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (dateRange === 'today') {
      filtered = filtered.filter(entry => new Date(entry.startTime) >= today)
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(entry => new Date(entry.startTime) >= weekAgo)
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(entry => new Date(entry.startTime) >= monthAgo)
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(entry =>
        entry.task.toLowerCase().includes(query) ||
        entry.project.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query)
      )
    }
    
    // Project filter
    if (filterProject !== 'all') {
      filtered = filtered.filter(entry => entry.project === filterProject)
    }
    
    // Billable filter
    if (filterBillable === 'billable') {
      filtered = filtered.filter(entry => entry.billable)
    } else if (filterBillable === 'non-billable') {
      filtered = filtered.filter(entry => !entry.billable)
    }
    
    return filtered
  }, [entries, dateRange, searchQuery, filterProject, filterBillable])
  
  const filteredEntries = getFilteredEntries()
  const stats = calculateStats(filteredEntries)
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockEntries: TimeEntry[] = [
        {
          id: '1',
          task: 'Dashboard redesign',
          project: 'Dashboard Redesign',
          description: 'Working on responsive layout and animations',
          startTime: '2026-05-21T09:00:00Z',
          endTime: '2026-05-21T12:00:00Z',
          duration: 180,
          billable: true,
          status: 'stopped',
          user: MOCK_USERS[0],
          tags: ['design', 'frontend'],
          createdAt: '2026-05-21T09:00:00Z',
          updatedAt: '2026-05-21T12:00:00Z'
        },
        {
          id: '2',
          task: 'API optimization',
          project: 'API Development',
          description: 'Improving response times and adding caching',
          startTime: '2026-05-21T13:00:00Z',
          endTime: '2026-05-21T17:00:00Z',
          duration: 240,
          billable: true,
          status: 'stopped',
          user: MOCK_USERS[1],
          tags: ['backend', 'optimization'],
          createdAt: '2026-05-21T13:00:00Z',
          updatedAt: '2026-05-21T17:00:00Z'
        },
        {
          id: '3',
          task: 'Code review',
          project: 'Mobile App',
          description: 'Reviewing PR #127 and providing feedback',
          startTime: '2026-05-21T10:00:00Z',
          endTime: '2026-05-21T11:30:00Z',
          duration: 90,
          billable: true,
          status: 'stopped',
          user: MOCK_USERS[2],
          tags: ['review'],
          createdAt: '2026-05-21T10:00:00Z',
          updatedAt: '2026-05-21T11:30:00Z'
        },
        {
          id: '4',
          task: 'Documentation update',
          project: 'Documentation',
          description: 'Updating API documentation',
          startTime: '2026-05-20T14:00:00Z',
          endTime: '2026-05-20T16:30:00Z',
          duration: 150,
          billable: false,
          status: 'stopped',
          user: MOCK_USERS[3],
          tags: ['docs'],
          createdAt: '2026-05-20T14:00:00Z',
          updatedAt: '2026-05-20T16:30:00Z'
        }
      ]
      
      setEntries(mockEntries)
      setIsLoading(false)
    }
    
    loadData()
  }, [])
  
  // Timer cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  // Click outside handler for export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Timer functions
  const startTimer = useCallback((taskName: string) => {
    const newEntry: TimeEntry = {
      id: `temp-${Date.now()}`,
      task: taskName.trim() || 'Untitled Task',
      project: projects[0]?.name || 'General',
      description: '',
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      billable: true,
      status: 'running',
      user: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setActiveTimer(newEntry)
    setElapsedTime(0)
    
    timerRef.current = window.setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }, [projects, currentUser])
  
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    if (activeTimer) {
      const stoppedEntry: TimeEntry = {
        ...activeTimer,
        id: Date.now().toString(),
        endTime: new Date().toISOString(),
        duration: Math.floor(elapsedTime / 60),
        status: 'stopped',
        updatedAt: new Date().toISOString()
      }
      
      setEntries(prev => [stoppedEntry, ...prev])
      setActiveTimer(null)
      setElapsedTime(0)
    }
  }, [activeTimer, elapsedTime])
  
  const addManualEntry = useCallback((entryData: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'user'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: Date.now().toString(),
      status: 'stopped',
      user: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setEntries(prev => [newEntry, ...prev])
  }, [currentUser])
  
  const updateEntry = useCallback((updatedEntry: TimeEntry) => {
    setEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ))
  }, [])
  
  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
    setShowDeleteConfirm(null)
  }, [])
  
  const exportData = useCallback((format: 'csv' | 'json') => {
    const dataToExport = filteredEntries.map(entry => ({
      Task: entry.task,
      Project: entry.project,
      Description: entry.description,
      Date: formatDate(entry.startTime),
      Start: new Date(entry.startTime).toLocaleTimeString(),
      End: entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '',
      Duration: formatDuration(entry.duration),
      Billable: entry.billable ? 'Yes' : 'No',
      User: entry.user.name
    }))
    
    if (format === 'json') {
      const jsonStr = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `time-entries-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const headers = Object.keys(dataToExport[0] || {}).join(',')
      const rows = dataToExport.map(row => Object.values(row).join(','))
      const csv = [headers, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `time-entries-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    
    setShowExportMenu(false)
  }, [filteredEntries])
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-400 mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading time tracking data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
      </button>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Time Tracking
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track, analyze, and optimize your work hours</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {showStats ? <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            </button>
            
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
                  >
                    <button
                      onClick={() => exportData('csv')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => exportData('json')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Export as JSON
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => setShowNewEntry(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>
        
        {/* Active Timer Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          {activeTimer ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-lg font-semibold">Currently Tracking</h2>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-red-400"
                  />
                </div>
                <p className="text-xl font-bold mb-1">{activeTimer.task}</p>
                <p className="text-sm opacity-90">{activeTimer.project}</p>
              </div>
              
              <div className="text-center">
                <p className="text-5xl sm:text-6xl font-mono font-bold tracking-wider mb-3">
                  {formatTime(elapsedTime)}
                </p>
                <button
                  onClick={stopTimer}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-white text-red-500 rounded-xl font-medium hover:bg-red-50 transition-all transform hover:scale-105"
                >
                  <StopCircle className="w-5 h-5" />
                  <span>Stop Timer</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-4">Ready to track your time?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <input
                  type="text"
                  placeholder="What are you working on?"
                  className="px-4 py-2.5 rounded-lg text-gray-900 dark:text-gray-900 w-full sm:w-80 focus:ring-2 focus:ring-white focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && startTimer((e.target as HTMLInputElement).value)}
                />
                <button
                  onClick={() => startTimer('')}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-white text-blue-500 rounded-xl font-medium hover:bg-blue-50 transition-all transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Timer</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Statistics Cards */}
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Time', value: formatDuration(stats.total), icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', trend: '+12%' },
              { label: 'Billable', value: formatDuration(stats.billable), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', trend: '+8%' },
              { label: 'Entries', value: stats.entriesCount, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30', trend: '+3' },
              { label: 'Avg Duration', value: formatDuration(stats.averageDuration), icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', trend: '+5%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Additional Stats Row */}
        {showStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'This Week', value: formatDuration(stats.weeklyTotal), icon: CalendarIcon },
              { label: 'This Month', value: formatDuration(stats.monthlyTotal), icon: CalendarIcon },
              { label: 'Daily Average', value: formatDuration(stats.dailyAverage), icon: Activity },
              { label: 'Top Project', value: stats.topProject || 'None', icon: Award },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                  <stat.icon className="w-3 h-3 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 truncate">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by task, project, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 transition-colors ${viewMode === 'cards' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="all">All time</option>
              </select>
              
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.name}>{project.name}</option>
                ))}
              </select>
              
              <select
                value={filterBillable}
                onChange={(e) => setFilterBillable(e.target.value as typeof filterBillable)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="billable">Billable Only</option>
                <option value="non-billable">Non-Billable Only</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterProject('all')
                  setFilterBillable('all')
                  setDateRange('today')
                }}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Time Entries Display */}
        {viewMode === 'table' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredEntries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No time entries found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters or add a new entry</p>
                            <button
                              onClick={() => setShowNewEntry(true)}
                              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              Add Time Entry
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEntries.map((entry, index) => (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => setEditingEntry(entry)}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{entry.task}</p>
                              {entry.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{entry.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: projects.find(p => p.name === entry.project)?.color }} />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{entry.project}</span>
                              {entry.billable && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                  Billable
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">{formatTimeRange(entry.startTime, entry.endTime)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.startTime)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-medium text-gray-900 dark:text-white">{formatDuration(entry.duration)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                {entry.user.avatar}
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{entry.user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setEditingEntry(entry)}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(entry.id)}
                                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setEditingEntry(entry)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: projects.find(p => p.name === entry.project)?.color }} />
                      <h3 className="font-medium text-gray-900 dark:text-white">{entry.task}</h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{entry.project}</p>
                  </div>
                  {entry.billable && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      Billable
                    </span>
                  )}
                </div>
                
                {entry.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{entry.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="text-gray-700 dark:text-gray-300">{formatDate(entry.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Time:</span>
                    <span className="text-gray-700 dark:text-gray-300">{formatTimeRange(entry.startTime, entry.endTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white">{formatDuration(entry.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">User:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {entry.user.avatar}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{entry.user.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(entry.id)}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Summary Footer */}
        {filteredEntries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatDuration(stats.total)}</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Billable Time</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatDuration(stats.billable)}</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Non-Billable</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{formatDuration(stats.nonBillable)}</p>
                </div>
              </div>
              
              {stats.topProject && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Top Project:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{stats.topProject}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <NewEntryModal
        isOpen={showNewEntry}
        onClose={() => setShowNewEntry(false)}
        onSave={addManualEntry}
        projects={projects}
        currentUser={currentUser}
        darkMode={darkMode}
      />
      
      <EditEntryModal
        entry={editingEntry}
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={updateEntry}
        projects={projects}
        darkMode={darkMode}
      />
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Time Entry</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this time entry? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteEntry(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Missing imports
import { Eye, EyeOff, Grid3X3 } from 'lucide-react'