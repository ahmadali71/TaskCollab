// src/pages/Changelog.tsx - Changelog Page
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Zap, Bug, Plus, RefreshCw, Gift, Rocket, Sparkles, 
  CheckCircle2, Calendar, TrendingUp, Shield, Award, 
  Smartphone, Cloud, Lock, Users, MessageSquare, BarChart,
  Filter, Search, Download, Bell, Clock, GitBranch, Package,
  ArrowUp, ArrowDown, Eye, Heart, ThumbsUp, Share2
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface ChangelogEntry {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  title: string
  description?: string
  changes: { 
    type: 'feature' | 'improvement' | 'bugfix' | 'release' | 'security' | 'performance'
    description: string 
    contributor?: string
    issue?: string
  }[]
  contributors?: string[]
  stats?: {
    commits: number
    filesChanged: number
    additions: number
    deletions: number
  }
}

// ============================================
// TOAST NOTIFICATION
// ============================================

interface Toast {
  id: string
  message: string
  type: 'success' | 'info'
}

const ToastNotification: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 50, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg text-white 
        ${toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'} min-w-[280px]`}
    >
      {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
      <span className="text-sm flex-1">{toast.message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

// ============================================
// MAIN CHANGELOG COMPONENT
// ============================================

export default function Changelog() {
  const [entries] = useState<ChangelogEntry[]>([
    {
      version: '2.2.0',
      date: 'May 21, 2026',
      type: 'minor',
      title: '3D Dashboard & AI Enhancements',
      description: 'Revolutionary update with AI-powered features and immersive 3D experience',
      changes: [
        { type: 'feature', description: 'Added 3D card effects with perspective transforms and mouse tracking' },
        { type: 'feature', description: 'AI-powered task decomposition and smart prioritization' },
        { type: 'feature', description: 'Real-time collaboration with presence indicators' },
        { type: 'improvement', description: 'Enhanced mobile responsiveness with touch gestures and swipe actions' },
        { type: 'improvement', description: 'Dark mode support with system preference detection' },
        { type: 'bugfix', description: 'Fixed offline sync conflicts with CRDT resolution algorithm' },
        { type: 'security', description: 'Enhanced password encryption with bcrypt and 2FA support' },
        { type: 'performance', description: 'Reduced initial load time by 40% with code splitting' },
      ],
      contributors: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
      stats: { commits: 45, filesChanged: 128, additions: 2450, deletions: 890 }
    },
    {
      version: '2.1.0',
      date: 'May 15, 2026',
      type: 'patch',
      title: 'UI/UX Refinements',
      description: 'Polished user interface and improved user experience',
      changes: [
        { type: 'feature', description: 'Added keyboard shortcuts for power users (Ctrl+K for search, Ctrl+N for new task)' },
        { type: 'improvement', description: 'Redesigned notification center with grouped alerts' },
        { type: 'improvement', description: 'Improved loading states with skeleton screens' },
        { type: 'bugfix', description: 'Fixed task duplication issue when dragging between columns' },
        { type: 'bugfix', description: 'Resolved infinite scroll pagination bug in activity feed' },
      ],
      contributors: ['Diana Prince', 'Eve Wilson'],
      stats: { commits: 23, filesChanged: 56, additions: 890, deletions: 234 }
    },
    {
      version: '2.0.0',
      date: 'April 15, 2026',
      type: 'major',
      title: 'Major Platform Release',
      description: 'Complete platform redesign with revolutionary features',
      changes: [
        { type: 'release', description: 'Complete platform redesign with new architecture and micro-frontends' },
        { type: 'feature', description: 'Real-time collaboration with WebSocket support and presence indicators' },
        { type: 'feature', description: 'Kanban board with drag-and-drop functionality and swimlanes' },
        { type: 'feature', description: 'Advanced analytics dashboard with customizable reports and charts' },
        { type: 'feature', description: 'Team management with granular roles and permissions (RBAC)' },
        { type: 'feature', description: 'Calendar view with month/week/day layouts and drag events' },
        { type: 'improvement', description: '10x performance improvement with lazy loading and virtual scrolling' },
        { type: 'improvement', description: 'Offline support with IndexedDB and automatic sync' },
        { type: 'security', description: 'End-to-end encryption for sensitive data' },
      ],
      contributors: ['Alice Johnson', 'Bob Smith', 'Diana Prince', 'Eve Wilson', 'Frank Miller'],
      stats: { commits: 156, filesChanged: 342, additions: 12500, deletions: 3400 }
    },
    {
      version: '1.5.0',
      date: 'March 1, 2026',
      type: 'minor',
      title: 'Team & Calendar Features',
      description: 'Enhanced collaboration tools and time management',
      changes: [
        { type: 'feature', description: 'Team management with roles and permissions system' },
        { type: 'feature', description: 'Calendar view with month/week/day layouts and iCal export' },
        { type: 'feature', description: 'Notification system with email, push, and in-app support' },
        { type: 'feature', description: 'User profiles with customizable avatars and bios' },
        { type: 'improvement', description: 'Improved search with fuzzy matching and filters' },
        { type: 'bugfix', description: 'Fixed timezone issues in date calculations' },
      ],
      contributors: ['Alice Johnson', 'Bob Smith'],
      stats: { commits: 67, filesChanged: 89, additions: 3450, deletions: 567 }
    },
    {
      version: '1.0.0',
      date: 'January 1, 2026',
      type: 'major',
      title: 'Initial Release',
      description: 'First public release of TaskCollab - Your ultimate task management solution',
      changes: [
        { type: 'release', description: 'First public release of TaskCollab' },
        { type: 'feature', description: 'Task creation, editing, and management with rich text editor' },
        { type: 'feature', description: 'User authentication with JWT and social login (Google, GitHub)' },
        { type: 'feature', description: 'Basic dashboard with task summaries and progress charts' },
        { type: 'feature', description: 'Project organization with tags and categories' },
        { type: 'feature', description: 'File attachments and image uploads' },
        { type: 'improvement', description: 'Responsive design for all device sizes' },
      ],
      contributors: ['TaskCollab Team'],
      stats: { commits: 234, filesChanged: 156, additions: 45000, deletions: 0 }
    },
  ])

  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'feature' | 'improvement' | 'bugfix' | 'security'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [showStats, setShowStats] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [showWhatsNew, setShowWhatsNew] = useState(true)

  // Add toast notification
  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Handle share
  const handleShare = (version: string) => {
    const url = `${window.location.origin}/changelog#${version}`
    navigator.clipboard.writeText(url)
    addToast(`Link to v${version} copied to clipboard!`, 'success')
  }

  // Get type icon and color
  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: React.ElementType; color: string; bgLight: string }> = {
      feature: { icon: Star, color: 'text-blue-600', bgLight: 'bg-blue-50' },
      improvement: { icon: TrendingUp, color: 'text-green-600', bgLight: 'bg-green-50' },
      bugfix: { icon: Bug, color: 'text-red-600', bgLight: 'bg-red-50' },
      release: { icon: Rocket, color: 'text-purple-600', bgLight: 'bg-purple-50' },
      security: { icon: Shield, color: 'text-yellow-600', bgLight: 'bg-yellow-50' },
      performance: { icon: Zap, color: 'text-orange-600', bgLight: 'bg-orange-50' },
    }
    return configs[type] || configs.feature
  }

  // Get version badge
  const getVersionBadge = (type: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
      major: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Major Release', icon: Rocket },
      minor: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Minor Update', icon: Package },
      patch: { bg: 'bg-green-100', text: 'text-green-700', label: 'Patch Fix', icon: Bug },
    }
    return badges[type] || badges.patch
  }

  // Filter and sort entries
  const filteredEntries = entries
    .map(entry => ({
      ...entry,
      changes: entry.changes.filter(change => 
        (filterType === 'all' || change.type === filterType) &&
        (searchQuery === '' || change.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(entry => entry.changes.length > 0)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

  // Get latest version
  const latestVersion = entries[0]

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Updates', icon: GitBranch },
    { value: 'feature', label: 'Features', icon: Star },
    { value: 'improvement', label: 'Improvements', icon: TrendingUp },
    { value: 'bugfix', label: 'Bug Fixes', icon: Bug },
    { value: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GitBranch className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Changelog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mt-2"
          >
            Stay up to date with the latest improvements and features
          </motion.p>
        </div>

        {/* Latest Version Highlight */}
        {showWhatsNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">What's New in v{latestVersion.version}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                      Latest
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{latestVersion.title}</p>
                  <p className="text-sm text-gray-500 mt-2">{latestVersion.description}</p>
                  <button
                    onClick={() => setExpandedVersion(latestVersion.version === expandedVersion ? null : latestVersion.version)}
                    className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium inline-flex items-center"
                  >
                    View details
                    {expandedVersion === latestVersion.version ? (
                      <ArrowUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => {
              const Icon = option.icon
              const isActive = filterType === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setFilterType(option.value as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              title={sortOrder === 'desc' ? 'Oldest first' : 'Newest first'}
            >
              {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2 rounded-xl border transition-colors ${showStats ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Show statistics"
            >
              <BarChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Changelog Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300 hidden md:block" />

          <div className="space-y-8">
            <AnimatePresence>
              {filteredEntries.map((entry, index) => {
                const badge = getVersionBadge(entry.type)
                const BadgeIcon = badge.icon
                const isExpanded = expandedVersion === entry.version
                
                return (
                  <motion.div
                    key={entry.version}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex flex-col md:flex-row md:items-start md:space-x-6 ml-2"
                  >
                    {/* Timeline Node */}
                    <div className="relative z-10 flex-shrink-0 mb-4 md:mb-0">
                      <div className={`w-14 h-14 rounded-2xl ${badge.bg} flex items-center justify-center ring-4 ring-white shadow-md`}>
                        <BadgeIcon className={`w-6 h-6 ${badge.text}`} />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Card Header */}
                      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">v{entry.version}</h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${badge.bg} ${badge.text} flex items-center space-x-1`}>
                                <BadgeIcon className="w-3 h-3" />
                                <span>{badge.label}</span>
                              </span>
                              {index === 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium flex items-center space-x-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Latest</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-gray-800 font-medium">{entry.title}</h4>
                            {entry.description && (
                              <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{entry.date}</span>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-3 mt-4 pt-2">
                          <button
                            onClick={() => setExpandedVersion(isExpanded ? null : entry.version)}
                            className="text-sm text-blue-500 hover:text-blue-600 font-medium inline-flex items-center"
                          >
                            {isExpanded ? 'Show less' : 'Show details'}
                            {isExpanded ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
                          </button>
                          <button
                            onClick={() => handleShare(entry.version)}
                            className="text-sm text-gray-500 hover:text-gray-600 inline-flex items-center"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>

                      {/* Changes List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-6 space-y-4">
                              <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>Changes & Updates</span>
                              </h5>
                              <div className="space-y-3">
                                {entry.changes.map((change, j) => {
                                  const { icon: Icon, color, bgLight } = getTypeConfig(change.type)
                                  return (
                                    <motion.div
                                      key={j}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: j * 0.02 }}
                                      className="flex items-start space-x-3 group"
                                    >
                                      <div className={`p-1.5 rounded-lg ${bgLight} ${color} flex-shrink-0 mt-0.5`}>
                                        <Icon className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-gray-700">{change.description}</span>
                                        {change.contributor && (
                                          <span className="text-xs text-gray-400 ml-2">
                                            — {change.contributor}
                                          </span>
                                        )}
                                        {change.issue && (
                                          <a href="#" className="text-xs text-blue-500 ml-2 hover:underline">
                                            #{change.issue}
                                          </a>
                                        )}
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </div>

                              {/* Contributors */}
                              {entry.contributors && entry.contributors.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">Contributors:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {entry.contributors.map(contributor => (
                                        <span key={contributor} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                          {contributor}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Statistics */}
                              {showStats && entry.stats && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-gray-900">{entry.stats.commits}</p>
                                      <p className="text-xs text-gray-500">Commits</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-gray-900">{entry.stats.filesChanged}</p>
                                      <p className="text-xs text-gray-500">Files Changed</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-green-600">+{entry.stats.additions}</p>
                                      <p className="text-xs text-gray-500">Additions</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-red-600">-{entry.stats.deletions}</p>
                                      <p className="text-xs text-gray-500">Deletions</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <GitBranch className="w-4 h-4" />
              <span>View all releases on GitHub</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Bell className="w-4 h-4" />
              <span>Subscribe to updates</span>
            </span>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}