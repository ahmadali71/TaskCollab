// src/pages/Projects.tsx - Complete Project Management Page
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Plus, Search, Filter, X, Grid3X3, List, MoreVertical,
  Calendar, User, Target, TrendingUp, CheckCircle2, Clock,
  AlertTriangle, Star, Download, Upload, RefreshCw,
  BarChart3, PieChart, Activity, Zap, Folder, FolderOpen,
  GitBranch, GitCommit, GitPullRequest, Layers,
  ArrowUpRight, ArrowDownRight, Minus, ChevronRight,
  Edit, Trash2, Copy, Archive, Share2, Eye, EyeOff,
  MessageSquare, Paperclip, Users, Flag, Award, Flame,
  Sun, Moon, Palette, Sparkles, Shield, Database
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on_hold' | 'cancelled' | 'planning'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number
  startDate: string
  endDate: string
  lead: { id: string; name: string; avatar: string }
  team: { id: string; name: string; avatar: string }[]
  tasksTotal: number
  tasksCompleted: number
  tasksInProgress: number
  tasksOverdue: number
  budget: number
  spent: number
  labels: { id: string; name: string; color: string }[]
  milestones: { id: string; name: string; dueDate: string; completed: boolean }[]
  color: string
  isFavorite: boolean
  repository?: string
  lastCommit?: string
}

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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ scale: 1.02, z: 20 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${glow ? 'hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}

const NewProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (project: Partial<Project>) => void; darkMode?: boolean }> = ({ 
  isOpen, onClose, onSave, darkMode 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 0,
    color: '#3b82f6'
  })

  if (!isOpen) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter project name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Project description" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget ($)</label>
            <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Color</label>
            <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            Cancel
          </button>
          <button onClick={() => {
            if (formData.name) {
              onSave(formData)
              onClose()
            }
          }} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Create Project
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
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

  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showNewProject, setShowNewProject] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setProjects([
        {
          id: '1', name: 'Dashboard Redesign', description: 'Complete overhaul of the main analytics dashboard with 3D visualizations',
          status: 'active', priority: 'high', progress: 75, startDate: '2026-03-01', endDate: '2026-06-15',
          lead: { id: '1', name: 'Alice Johnson', avatar: 'AJ' },
          team: [{ id: '1', name: 'Alice Johnson', avatar: 'AJ' }, { id: '2', name: 'Bob Smith', avatar: 'BS' }, { id: '3', name: 'Charlie Brown', avatar: 'CB' }],
          tasksTotal: 24, tasksCompleted: 18, tasksInProgress: 4, tasksOverdue: 2,
          budget: 50000, spent: 35000,
          labels: [{ id: 'l1', name: 'design', color: '#3b82f6' }, { id: 'l2', name: 'frontend', color: '#8b5cf6' }],
          milestones: [
            { id: 'm1', name: 'Wireframes', dueDate: '2026-04-01', completed: true },
            { id: 'm2', name: 'Prototype', dueDate: '2026-05-01', completed: true },
            { id: 'm3', name: 'Development', dueDate: '2026-06-01', completed: false },
            { id: 'm4', name: 'Launch', dueDate: '2026-06-15', completed: false },
          ],
          color: '#3b82f6', isFavorite: true, repository: 'dashboard-redesign', lastCommit: '2 hours ago'
        },
        {
          id: '2', name: 'API Development', description: 'RESTful API with real-time WebSocket support',
          status: 'active', priority: 'critical', progress: 45, startDate: '2026-02-15', endDate: '2026-07-01',
          lead: { id: '2', name: 'Bob Smith', avatar: 'BS' },
          team: [{ id: '2', name: 'Bob Smith', avatar: 'BS' }, { id: '3', name: 'Charlie Brown', avatar: 'CB' }],
          tasksTotal: 36, tasksCompleted: 16, tasksInProgress: 8, tasksOverdue: 3,
          budget: 80000, spent: 40000,
          labels: [{ id: 'l3', name: 'backend', color: '#10b981' }, { id: 'l4', name: 'core', color: '#ef4444' }],
          milestones: [
            { id: 'm5', name: 'Design', dueDate: '2026-03-15', completed: true },
            { id: 'm6', name: 'Development', dueDate: '2026-06-01', completed: false },
            { id: 'm7', name: 'Testing', dueDate: '2026-06-15', completed: false },
          ],
          color: '#10b981', isFavorite: false, repository: 'api-development', lastCommit: '1 day ago'
        },
        {
          id: '3', name: 'Mobile App', description: 'Native mobile application for iOS and Android',
          status: 'planning', priority: 'medium', progress: 10, startDate: '2026-06-01', endDate: '2026-12-01',
          lead: { id: '1', name: 'Alice Johnson', avatar: 'AJ' },
          team: [{ id: '1', name: 'Alice Johnson', avatar: 'AJ' }, { id: '4', name: 'Diana Prince', avatar: 'DP' }],
          tasksTotal: 40, tasksCompleted: 4, tasksInProgress: 0, tasksOverdue: 0,
          budget: 120000, spent: 5000,
          labels: [{ id: 'l5', name: 'mobile', color: '#f59e0b' }],
          milestones: [
            { id: 'm8', name: 'Research', dueDate: '2026-07-01', completed: false },
            { id: 'm9', name: 'Design', dueDate: '2026-09-01', completed: false },
          ],
          color: '#f59e0b', isFavorite: true, repository: 'mobile-app', lastCommit: '3 days ago'
        },
        {
          id: '4', name: 'Database Migration', description: 'Migrate from MySQL to PostgreSQL with optimization',
          status: 'completed', priority: 'high', progress: 100, startDate: '2026-01-01', endDate: '2026-04-01',
          lead: { id: '3', name: 'Charlie Brown', avatar: 'CB' },
          team: [{ id: '3', name: 'Charlie Brown', avatar: 'CB' }],
          tasksTotal: 15, tasksCompleted: 15, tasksInProgress: 0, tasksOverdue: 0,
          budget: 30000, spent: 28000,
          labels: [{ id: 'l6', name: 'backend', color: '#10b981' }],
          milestones: [
            { id: 'm10', name: 'Planning', dueDate: '2026-01-15', completed: true },
            { id: 'm11', name: 'Migration', dueDate: '2026-03-01', completed: true },
            { id: 'm12', name: 'Testing', dueDate: '2026-04-01', completed: true },
          ],
          color: '#6366f1', isFavorite: false, repository: 'db-migration', lastCommit: '1 month ago'
        },
        {
          id: '5', name: 'Analytics Platform', description: 'Real-time analytics dashboard with AI insights',
          status: 'active', priority: 'high', progress: 60, startDate: '2026-04-01', endDate: '2026-08-01',
          lead: { id: '4', name: 'Diana Prince', avatar: 'DP' },
          team: [{ id: '1', name: 'Alice Johnson', avatar: 'AJ' }, { id: '2', name: 'Bob Smith', avatar: 'BS' }, { id: '4', name: 'Diana Prince', avatar: 'DP' }],
          tasksTotal: 30, tasksCompleted: 18, tasksInProgress: 8, tasksOverdue: 1,
          budget: 95000, spent: 55000,
          labels: [{ id: 'l7', name: 'analytics', color: '#ec4899' }, { id: 'l8', name: 'ai', color: '#8b5cf6' }],
          milestones: [
            { id: 'm13', name: 'Data Pipeline', dueDate: '2026-05-15', completed: true },
            { id: 'm14', name: 'Dashboard', dueDate: '2026-06-15', completed: false },
            { id: 'm15', name: 'AI Features', dueDate: '2026-07-15', completed: false },
          ],
          color: '#ec4899', isFavorite: true, repository: 'analytics-platform', lastCommit: '5 hours ago'
        },
      ])
      setIsLoading(false)
    }, 800)
  }, [])

  const handleCreateProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name!,
      description: projectData.description!,
      status: projectData.status!,
      priority: projectData.priority!,
      progress: 0,
      startDate: projectData.startDate!,
      endDate: projectData.endDate!,
      lead: { id: 'current', name: 'Current User', avatar: 'CU' },
      team: [],
      tasksTotal: 0,
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksOverdue: 0,
      budget: projectData.budget!,
      spent: 0,
      labels: [],
      milestones: [],
      color: projectData.color!,
      isFavorite: false,
    }
    setProjects([newProject, ...projects])
  }

  const toggleFavorite = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ))
  }

  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus
      const matchesPriority = filterPriority === 'all' || p.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onTrack: projects.filter(p => p.status === 'active' && p.progress >= (p.tasksCompleted / p.tasksTotal) * 100).length,
    atRisk: projects.filter(p => p.tasksOverdue > 0).length,
    totalTasks: projects.reduce((sum, p) => sum + p.tasksTotal, 0),
    completedTasks: projects.reduce((sum, p) => sum + p.tasksCompleted, 0),
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    spentBudget: projects.reduce((sum, p) => sum + p.spent, 0),
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string; darkBg: string; darkText: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-400' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
      on_hold: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'On Hold', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-400' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
      planning: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Planning', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
    }
    return configs[status] || configs.active
  }

  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { bg: string; text: string; icon: any; darkBg: string; darkText: string }> = {
      low: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Minus, darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-400' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Minus, darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
      high: { bg: 'bg-orange-100', text: 'text-orange-700', icon: ArrowUpRight, darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
      critical: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertTriangle, darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
    }
    return configs[priority] || configs.medium
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500" />
      </div>
    )
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

      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
              className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Projects
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} 
              className="text-gray-500 dark:text-gray-400 mt-1">
              {stats.total} projects • {stats.active} active • {stats.atRisk} at risk
            </motion.p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {showStats ? <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            </button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 800)
              }}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewProject(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium shadow-md">
              <Plus className="w-5 h-5" /><span>New Project</span>
            </motion.button>
          </div>
        </div>

        {/* STATS CARDS */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Total Projects', value: stats.total, color: 'from-gray-500 to-gray-600', icon: Folder },
              { label: 'Active', value: stats.active, color: 'from-green-500 to-green-600', icon: Activity },
              { label: 'Completed', value: stats.completed, color: 'from-blue-500 to-blue-600', icon: CheckCircle2 },
              { label: 'At Risk', value: stats.atRisk, color: 'from-red-500 to-red-600', icon: AlertTriangle },
              { label: 'Tasks', value: stats.totalTasks, color: 'from-purple-500 to-purple-600', icon: CheckCircle2 },
              { label: 'Completed Tasks', value: stats.completedTasks, color: 'from-teal-500 to-teal-600', icon: CheckCircle2 },
              { label: 'Budget', value: `$${(stats.totalBudget / 1000).toFixed(0)}k`, color: 'from-yellow-500 to-yellow-600', icon: Database },
              { label: 'Spent', value: `$${(stats.spentBudget / 1000).toFixed(0)}k`, color: 'from-orange-500 to-orange-600', icon: Database },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* FILTERS AND SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search projects by name or description..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
            <button onClick={() => setViewMode('grid')} 
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} 
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PROJECTS DISPLAY */}
        {filteredProjects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <FolderOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterPriority('all'); }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Clear filters
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div key={project.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}>
                  <Link to={`/projects/${project.id}`}>
                    <Card3D className="p-6 cursor-pointer group" depth={20} glow={project.priority === 'critical'}>
                      {/* Color bar */}
                      <div className="h-1.5 rounded-full mb-4 transition-all group-hover:h-2" style={{ backgroundColor: project.color }} />
                      
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <button onClick={(e) => { e.preventDefault(); toggleFavorite(project.id); }} className="focus:outline-none">
                              <Star className={`w-4 h-4 ${project.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
                            </button>
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{project.name}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusConfig(project.status).bg} ${getStatusConfig(project.status).text} ${getStatusConfig(project.status).darkBg} ${getStatusConfig(project.status).darkText}`}>
                              {getStatusConfig(project.status).label}
                            </span>
                            {(() => {
                              const PriorityIcon = getPriorityConfig(project.priority).icon
                              return (
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPriorityConfig(project.priority).bg} ${getPriorityConfig(project.priority).text} ${getPriorityConfig(project.priority).darkBg} ${getPriorityConfig(project.priority).darkText} flex items-center space-x-1`}>
                                  <PriorityIcon className="w-3 h-3" />
                                  <span>{project.priority}</span>
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Overall Progress</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1 }}
                            className="h-full rounded-full" style={{ backgroundColor: project.color }} />
                        </div>
                      </div>

                      {/* Repository Info */}
                      {project.repository && (
                        <div className="mb-3 flex items-center space-x-2 text-xs">
                          <GitBranch className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">{project.repository}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 dark:text-gray-400">Updated {project.lastCommit}</span>
                        </div>
                      )}

                      {/* Milestones */}
                      {project.milestones.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Milestones</p>
                          <div className="space-y-1.5">
                            {project.milestones.slice(0, 3).map(milestone => (
                              <div key={milestone.id} className="flex items-center space-x-2 text-xs">
                                <div className={`w-1.5 h-1.5 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                <span className={`flex-1 truncate ${milestone.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                  {milestone.name}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 text-xs">
                                  {new Date(milestone.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Labels */}
                      {project.labels.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                          {project.labels.slice(0, 3).map(label => (
                            <span key={label.id} className="px-2 py-0.5 text-xs rounded-full" 
                              style={{ backgroundColor: `${label.color}20`, color: label.color }}>
                              {label.name}
                            </span>
                          ))}
                          {project.labels.length > 3 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              +{project.labels.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Team & Tasks */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 4).map(member => (
                            <div key={member.id} 
                              className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                              title={member.name}>
                              {member.avatar}
                            </div>
                          ))}
                          {project.team.length > 4 && (
                            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                              +{project.team.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span>{project.tasksCompleted}/{project.tasksTotal}</span>
                          </div>
                          {project.tasksOverdue > 0 && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="text-red-500">{project.tasksOverdue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card3D>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card3D className="overflow-hidden" depth={15}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProjects.map(project => (
                    <Link to={`/projects/${project.id}`} key={project.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusConfig(project.status).bg} ${getStatusConfig(project.status).text} ${getStatusConfig(project.status).darkBg} ${getStatusConfig(project.status).darkText}`}>
                            {getStatusConfig(project.status).label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityConfig(project.priority).bg} ${getPriorityConfig(project.priority).text} ${getPriorityConfig(project.priority).darkBg} ${getPriorityConfig(project.priority).darkText}`}>
                            {project.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600 dark:text-gray-400">{project.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map(member => (
                              <div key={member.id} 
                                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                                title={member.name}>
                                {member.avatar}
                              </div>
                            ))}
                            {project.team.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{project.tasksCompleted}/{project.tasksTotal}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(project.endDate).toLocaleDateString()}
                        </td>
                      </tr>
                    </Link>
                  ))}
                </tbody>
              </table>
            </div>
          </Card3D>
        )}
      </div>

      <NewProjectModal 
        isOpen={showNewProject} 
        onClose={() => setShowNewProject(false)} 
        onSave={handleCreateProject}
        darkMode={darkMode}
      />
    </div>
  )
}