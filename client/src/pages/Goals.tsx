// src/pages/Goals.tsx - Comprehensive Goals & OKRs Management Page
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, Plus, Edit2, Trash2, CheckCircle2, Circle, 
  TrendingUp, Calendar, Users, Award, Star, Zap,
  ChevronRight, MoreVertical, Filter, Search, X,
  BarChart3, Clock, Flag, Rocket, Sparkles, AlertCircle,
  LineChart, PieChart, Activity, Eye, EyeOff, Copy,
  Link, MessageCircle, ThumbsUp, Share2, Bookmark,
  ArrowUp, ArrowDown, Maximize2, Minimize2, Settings,
  GitBranch, Layers, ListTodo, Trophy,
  Crown, Medal, Gift, Coffee, Music, Sun, Moon,
  Grid, List
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface KeyResult {
  id: string
  title: string
  target: number
  current: number
  unit: string
  initial: number
  owner: string
  confidence: number
  status: 'on_track' | 'at_risk' | 'off_track'
  lastUpdated: string
  notes?: string
  milestones?: { date: string; value: number; note: string }[]
}

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  startDate: string
  progress: number
  status: 'active' | 'completed' | 'archived' | 'draft'
  priority: 'critical' | 'high' | 'medium' | 'low'
  keyResults: KeyResult[]
  teamMembers: { id: string; name: string; avatar: string; role: string }[]
  category: 'product' | 'engineering' | 'sales' | 'marketing' | 'support' | 'operations'
  tags: string[]
  parentGoalId?: string
  subGoals?: string[]
  createdAt: string
  updatedAt: string
  owner: { id: string; name: string; avatar: string }
  collaborators: string[]
  comments: { id: string; userId: string; userName: string; content: string; createdAt: string }[]
  attachments: { id: string; name: string; url: string; size: number }[]
}

interface GoalStats {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  atRiskGoals: number
  averageProgress: number
  totalKeyResults: number
  completedKeyResults: number
}

// ============================================
// COMPONENTS
// ============================================
const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({ 
  progress, size = 60, strokeWidth = 4 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-500"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
  const getColor = () => {
    if (confidence >= 70) return 'bg-green-500'
    if (confidence >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()} rounded-full`} style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-xs text-gray-500 min-w-[40px]">{confidence}%</span>
    </div>
  )
}

const GoalTimeline: React.FC<{ startDate: string; targetDate: string; progress: number }> = ({ 
  startDate, targetDate, progress 
}) => {
  const start = new Date(startDate)
  const target = new Date(targetDate)
  const today = new Date()
  const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const expectedProgress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100))
  const isAhead = progress >= expectedProgress

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Start: {new Date(startDate).toLocaleDateString()}</span>
        <span>Target: {new Date(targetDate).toLocaleDateString()}</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
        <div 
          className="absolute h-full w-0.5 bg-red-500 rounded-full" 
          style={{ left: `${expectedProgress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Progress: {progress}%</span>
        <span className={isAhead ? 'text-green-500' : 'text-red-500'}>
          {isAhead ? 'Ahead of schedule' : 'Behind schedule'}
        </span>
      </div>
    </div>
  )
}

const KeyResultCard: React.FC<{ 
  kr: KeyResult; 
  onUpdate: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}> = ({ kr, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(kr.current)
  const percentComplete = (kr.current / kr.target) * 100

  const getStatusIcon = () => {
    switch (kr.status) {
      case 'on_track': return <ThumbsUp className="w-3 h-3 text-green-500" />
      case 'at_risk': return <AlertCircle className="w-3 h-3 text-yellow-500" />
      case 'off_track': return <AlertCircle className="w-3 h-3 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (kr.status) {
      case 'on_track': return 'On Track'
      case 'at_risk': return 'At Risk'
      case 'off_track': return 'Off Track'
    }
  }

  const handleSave = () => {
    onUpdate(kr.id, editValue)
    setIsEditing(false)
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">{kr.title}</h4>
            <span className="text-xs text-gray-500">Owner: {kr.owner}</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{kr.current}</span>
              <span className="text-gray-500">/ {kr.target} {kr.unit}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getStatusIcon()}
              <span className="text-gray-500">{getStatusText()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentComplete}%` }} />
              </div>
              <span className="text-sm font-medium">{Math.round(percentComplete)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Confidence</span>
              <ConfidenceMeter confidence={kr.confidence} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border rounded"
                autoFocus
              />
              <button onClick={handleSave} className="p-1 text-green-500 hover:bg-green-50 rounded">
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(kr.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'progress' | 'date' | 'priority'>('progress')

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Increase User Engagement',
          description: 'Improve daily active users and session duration through new features and improved UX',
          targetDate: '2026-12-31',
          startDate: '2026-01-01',
          progress: 65,
          status: 'active',
          priority: 'high',
          category: 'product',
          tags: ['growth', 'user-experience'],
          owner: { id: '1', name: 'Alice Johnson', avatar: 'AJ' },
          teamMembers: [
            { id: '1', name: 'Alice Johnson', avatar: 'AJ', role: 'Product Lead' },
            { id: '2', name: 'Bob Smith', avatar: 'BS', role: 'Engineer' },
            { id: '3', name: 'Charlie Brown', avatar: 'CB', role: 'Designer' },
          ],
          collaborators: ['1', '2', '3'],
          comments: [],
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyResults: [
            { 
              id: 'kr1', title: 'Daily Active Users', target: 10000, current: 6500, unit: 'users', 
              initial: 5000, owner: 'Alice', confidence: 75, status: 'on_track', lastUpdated: new Date().toISOString(),
              milestones: [{ date: '2026-03-31', value: 7000, note: 'Q1 target' }]
            },
            { 
              id: 'kr2', title: 'Average Session Duration', target: 15, current: 9.5, unit: 'minutes',
              initial: 8, owner: 'Bob', confidence: 65, status: 'at_risk', lastUpdated: new Date().toISOString()
            },
            { 
              id: 'kr3', title: 'User Retention Rate', target: 80, current: 65, unit: '%',
              initial: 60, owner: 'Charlie', confidence: 80, status: 'on_track', lastUpdated: new Date().toISOString()
            },
          ]
        },
        {
          id: '2',
          title: 'Launch Mobile App v2.0',
          description: 'Complete redesign with new features including offline mode and push notifications',
          targetDate: '2026-11-30',
          startDate: '2026-03-01',
          progress: 45,
          status: 'active',
          priority: 'critical',
          category: 'engineering',
          tags: ['mobile', 'launch'],
          owner: { id: '4', name: 'Diana Prince', avatar: 'DP' },
          teamMembers: [
            { id: '4', name: 'Diana Prince', avatar: 'DP', role: 'Tech Lead' },
            { id: '5', name: 'Eve Wilson', avatar: 'EW', role: 'Mobile Dev' },
            { id: '6', name: 'Frank Castle', avatar: 'FC', role: 'QA' },
          ],
          collaborators: ['4', '5', '6'],
          comments: [],
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyResults: [
            { 
              id: 'kr4', title: 'Features Implemented', target: 12, current: 6, unit: 'features',
              initial: 0, owner: 'Diana', confidence: 70, status: 'on_track', lastUpdated: new Date().toISOString()
            },
            { 
              id: 'kr5', title: 'Beta Testers', target: 500, current: 250, unit: 'testers',
              initial: 0, owner: 'Eve', confidence: 55, status: 'at_risk', lastUpdated: new Date().toISOString()
            },
          ]
        },
        {
          id: '3',
          title: 'Improve Customer Support',
          description: 'Reduce response time and increase customer satisfaction scores',
          targetDate: '2026-10-15',
          startDate: '2026-04-01',
          progress: 80,
          status: 'active',
          priority: 'medium',
          category: 'support',
          tags: ['customer-success', 'satisfaction'],
          owner: { id: '7', name: 'Grace Hopper', avatar: 'GH' },
          teamMembers: [
            { id: '7', name: 'Grace Hopper', avatar: 'GH', role: 'Support Lead' },
            { id: '8', name: 'Henry Ford', avatar: 'HF', role: 'Support Agent' },
          ],
          collaborators: ['7', '8'],
          comments: [],
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyResults: [
            { 
              id: 'kr6', title: 'Average Response Time', target: 2, current: 1.5, unit: 'hours',
              initial: 4, owner: 'Grace', confidence: 85, status: 'on_track', lastUpdated: new Date().toISOString()
            },
            { 
              id: 'kr7', title: 'CSAT Score', target: 95, current: 88, unit: '%',
              initial: 82, owner: 'Henry', confidence: 75, status: 'on_track', lastUpdated: new Date().toISOString()
            },
          ]
        },
      ]
      setGoals(mockGoals)
      setIsLoading(false)
    }, 1000)
  }, [])

  const stats = useMemo<GoalStats>(() => {
    const active = goals.filter(g => g.status === 'active')
    const completed = goals.filter(g => g.status === 'completed')
    const atRisk = goals.filter(g => g.keyResults.some(kr => kr.status === 'at_risk'))
    const totalKR = goals.reduce((acc, g) => acc + g.keyResults.length, 0)
    const completedKR = goals.reduce((acc, g) => acc + g.keyResults.filter(kr => kr.current >= kr.target).length, 0)
    const avgProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0

    return {
      totalGoals: goals.length,
      activeGoals: active.length,
      completedGoals: completed.length,
      atRiskGoals: atRisk.length,
      averageProgress: avgProgress,
      totalKeyResults: totalKR,
      completedKeyResults: completedKR,
    }
  }, [goals])

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus
      const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority
      const matchesCategory = filterCategory === 'all' || goal.category === filterCategory
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    }).sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress
      if (sortBy === 'date') return new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime()
      const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [goals, searchQuery, filterStatus, filterPriority, filterCategory, sortBy])

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g))
  }

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-8 h-8 text-blue-500" />
              Goals & OKRs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Set, track, and achieve your team's objectives with confidence</p>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoals}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Flag className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeGoals}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedGoals}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">At Risk</p>
                <p className="text-2xl font-bold text-red-500">{stats.atRiskGoals}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageProgress}%</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${stats.averageProgress}%` }} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Key Results</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedKeyResults}/{stats.totalKeyResults}</p>
              </div>
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="product">Product</option>
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="support">Support</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="progress">Sort by Progress</option>
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Goals List - Simplified View */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
          {filteredGoals.map((goal) => (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:block">
                    <ProgressRing progress={goal.progress} size={50} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        goal.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        goal.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{goal.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Due {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">{goal.teamMembers.length} members</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No goals found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or create a new goal</p>
            <button onClick={() => setShowNewGoal(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Create Goal
            </button>
          </div>
        )}
      </div>

      {/* Simple Create Goal Modal */}
      {showNewGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewGoal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Create New Goal
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Title</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Increase user engagement" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" placeholder="Describe your goal..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target Date</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button onClick={() => setShowNewGoal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700">Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}