// src/pages/Integrations.tsx - Comprehensive Integrations Marketplace with Dark/Light Mode
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Zap, CheckCircle2, X, ExternalLink,
  Calendar, MessageSquare, FileText, Activity,
  Cloud, Database, Code, Mail, Camera, Music,
  Star, TrendingUp, Shield, Globe, Smartphone,
  AlertTriangle, Info, ChevronDown, Settings,
  RefreshCw, Link2, Unlink, Clock, Award,
  Sparkles, Lock, Bell, Webhook, GitBranch,
  Download, Upload, ShieldCheck, Server,
  Layers, PieChart, Users, Target, Package,
  Briefcase, Home, Box, GitPullRequest,
  UserPlus, Share2, Heart, ThumbsUp, Sun, Moon,
  Filter, TrendingDown, Rocket, Compass, Gift,
  Crown, Medal, Coffee, BookOpen, Wifi
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface Integration {
  id: string
  name: string
  description: string
  shortDescription: string
  icon: React.ElementType
  category: string
  connected: boolean
  popular: boolean
  featured: boolean
  color: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync?: string
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'manual'
  authType: 'oauth' | 'api_key' | 'webhook' | 'none'
  docsUrl: string
  permissions: string[]
  pricingTier: 'free' | 'basic' | 'pro' | 'enterprise'
  rating: number
  reviews: number
  users: number
}

interface Connection {
  integrationId: string
  connectedAt: string
  settings: Record<string, any>
  syncStatus: 'syncing' | 'idle' | 'error'
  lastSyncTime?: string
  syncCount?: number
}

interface ActivityLog {
  id: string
  integrationId: string
  action: 'connect' | 'disconnect' | 'sync' | 'error'
  timestamp: string
  details: string
}

// ============================================
// INTEGRATION CARD COMPONENT
// ============================================
const IntegrationCard: React.FC<{
  integration: Integration
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
  onConfigure: (id: string) => void
  isConnecting: boolean
}> = ({ integration, onConnect, onDisconnect, onConfigure, isConnecting }) => {
  const [showDetails, setShowDetails] = useState(false)

  const getStatusBadge = () => {
    switch (integration.status) {
      case 'active':
        return <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"><CheckCircle2 className="w-3 h-3" /><span>Active</span></span>
      case 'error':
        return <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"><AlertTriangle className="w-3 h-3" /><span>Error</span></span>
      case 'pending':
        return <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"><Clock className="w-3 h-3" /><span>Pending</span></span>
      default:
        return null
    }
  }

  const getSyncFrequencyIcon = () => {
    switch (integration.syncFrequency) {
      case 'realtime': return <Zap className="w-3 h-3" />
      case 'hourly': return <RefreshCw className="w-3 h-3" />
      case 'daily': return <Calendar className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const getPricingBadge = () => {
    const pricing = integration.pricingTier
    const pricingColors: Record<string, string> = {
      free: 'text-green-600 dark:text-green-400',
      basic: 'text-blue-600 dark:text-blue-400',
      pro: 'text-purple-600 dark:text-purple-400',
      enterprise: 'text-orange-600 dark:text-orange-400'
    }
    return <span className={`text-xs ${pricingColors[pricing]}`}>{pricing.charAt(0).toUpperCase() + pricing.slice(1)}</span>
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {integration.connected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform"
            style={{ backgroundColor: integration.color }}
          >
            <integration.icon className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            {integration.popular && (
              <span className="flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>Popular</span>
              </span>
            )}
            {integration.featured && (
              <span className="flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                <Award className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            {getStatusBadge()}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{integration.name}</h3>
            {getPricingBadge()}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {showDetails ? integration.description : integration.shortDescription}
          </p>
          {integration.description.length > integration.shortDescription.length && (
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 mt-1 font-medium"
            >
              {showDetails ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-3 h-3 ${star <= integration.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({integration.reviews} reviews)</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{integration.users.toLocaleString()} users</span>
        </div>

        {showDetails && integration.permissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Required permissions:</p>
            <div className="flex flex-wrap gap-1">
              {integration.permissions.map(perm => (
                <span key={perm} className="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 border dark:border-gray-500">
                  {perm}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-4 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              {getSyncFrequencyIcon()}
              <span className="capitalize">{integration.syncFrequency || 'manual'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span className="capitalize">{integration.authType.replace('_', ' ')}</span>
            </span>
          </div>
          {integration.lastSync && (
            <span className="flex items-center space-x-1">
              <RefreshCw className="w-3 h-3" />
              <span>Synced {integration.lastSync}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {integration.connected ? (
            <>
              <button
                onClick={() => onConfigure(integration.id)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
              <button
                onClick={() => onDisconnect(integration.id)}
                className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
              >
                <Unlink className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onConnect(integration.id)}
              disabled={isConnecting}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center space-x-2"
            >
              {isConnecting ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" 
                  />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Connect</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="mt-3 text-center">
          <a 
            href={integration.docsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span>Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// FEATURED INTEGRATION COMPONENT
// ============================================
const FeaturedIntegration: React.FC<{ integration: Integration; onConnect: (id: string) => void }> = 
  ({ integration, onConnect }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <integration.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{integration.name}</h3>
              <p className="text-gray-300 text-sm mt-1">{integration.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="flex items-center space-x-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  <span>Recommended for you</span>
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onConnect(integration.id)}
            className="px-6 py-2.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
          >
            Connect Now
          </button>
        </div>
      </motion.div>
    )
  }

// ============================================
// STATS CARD COMPONENT
// ============================================
const StatsCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; color: string }> = ({ 
  label, value, icon: Icon, color 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
)

// ============================================
// ACTIVITY LOG COMPONENT
// ============================================
const ActivityLog: React.FC<{ logs: ActivityLog[]; integrations: Integration[] }> = ({ logs, integrations }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'connect': return <Link2 className="w-3 h-3 text-green-500" />
      case 'disconnect': return <Unlink className="w-3 h-3 text-red-500" />
      case 'sync': return <RefreshCw className="w-3 h-3 text-blue-500" />
      case 'error': return <AlertTriangle className="w-3 h-3 text-red-500" />
      default: return <Activity className="w-3 h-3 text-gray-500" />
    }
  }

  const getIntegrationName = (integrationId: string) => {
    return integrations.find(i => i.id === integrationId)?.name || integrationId
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-500" />
        Recent Activity
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
        ) : (
          logs.slice(0, 5).map(log => (
            <div key={log.id} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              {getActionIcon(log.action)}
              <div className="flex-1">
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{getIntegrationName(log.integrationId)}</span>
                  {' '}{log.action === 'connect' ? 'connected' : log.action === 'disconnect' ? 'disconnected' : log.action === 'sync' ? 'synced' : 'error'}
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500">{log.details}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================
// CATEGORY ICON MAP
// ============================================
const categoryIcons: Record<string, React.ElementType> = {
  'all': Layers,
  'Calendar': Calendar,
  'Communication': MessageSquare,
  'Development': Code,
  'Automation': Zap,
  'Storage': Cloud,
  'Email': Mail,
  'Design': Box,
  'Analytics': PieChart,
  'Team': Users,
  'Productivity': Target,
  'Social': Share2,
  'Other': Package,
}

// ============================================
// MAIN INTEGRATIONS COMPONENT
// ============================================
export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showConnectedOnly, setShowConnectedOnly] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null)
  const [showConfigureModal, setShowConfigureModal] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [configSettings, setConfigSettings] = useState({
    syncFrequency: 'realtime',
    enableNotifications: true,
    autoSync: true,
    twoWaySync: true
  })

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

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  // Load integrations
  useEffect(() => {
    const loadIntegrations = () => {
      const integrationData: Integration[] = [
        { id: 'google-calendar', name: 'Google Calendar', shortDescription: 'Sync tasks with Google Calendar', description: 'Two-way synchronization between your tasks and Google Calendar. Create, update, and delete events automatically.', icon: Calendar, category: 'Calendar', connected: false, popular: true, featured: true, color: '#4285F4', status: 'inactive', authType: 'oauth', docsUrl: '/docs/google-calendar', permissions: ['Read/write calendar events', 'View your location'], pricingTier: 'free', syncFrequency: 'realtime', rating: 4.8, reviews: 1243, users: 15000 },
        { id: 'slack', name: 'Slack', shortDescription: 'Get notifications in Slack channels', description: 'Receive real-time notifications about task updates, mentions, and deadlines directly in your Slack workspace.', icon: MessageSquare, category: 'Communication', connected: false, popular: true, featured: true, color: '#4A154B', status: 'inactive', authType: 'oauth', docsUrl: '/docs/slack', permissions: ['Send messages as you', 'View channel info'], pricingTier: 'free', syncFrequency: 'realtime', rating: 4.9, reviews: 2341, users: 25000 },
        { id: 'github', name: 'GitHub', shortDescription: 'Link tasks to GitHub issues & PRs', description: 'Connect tasks to GitHub issues and pull requests. Automatically update task status when PRs are merged.', icon: GitBranch, category: 'Development', connected: false, popular: true, featured: true, color: '#24292e', status: 'inactive', authType: 'oauth', docsUrl: '/docs/github', permissions: ['Read/write issues', 'Read PRs'], pricingTier: 'free', syncFrequency: 'realtime', rating: 4.8, reviews: 987, users: 12000 },
        { id: 'microsoft-teams', name: 'Microsoft Teams', shortDescription: 'Collaborate with Teams integration', description: 'Bring your tasks into Microsoft Teams channels and receive notifications.', icon: MessageSquare, category: 'Communication', connected: false, popular: true, featured: false, color: '#6264A7', status: 'inactive', authType: 'oauth', docsUrl: '/docs/teams', permissions: ['Send messages', 'Read channels'], pricingTier: 'basic', syncFrequency: 'realtime', rating: 4.7, reviews: 567, users: 8000 },
        { id: 'jira', name: 'Jira', shortDescription: 'Two-way sync with Jira projects', description: 'Bi-directional synchronization between tasks and Jira issues. Map statuses and fields automatically.', icon: Activity, category: 'Development', connected: false, popular: true, featured: false, color: '#0052CC', status: 'inactive', authType: 'oauth', docsUrl: '/docs/jira', permissions: ['Read/write issues', 'View projects'], pricingTier: 'pro', syncFrequency: 'hourly', rating: 4.6, reviews: 234, users: 5000 },
        { id: 'zapier', name: 'Zapier', shortDescription: 'Connect with 5000+ apps via Zapier', description: 'Automate workflows by connecting with thousands of apps through Zapier triggers and actions.', icon: Zap, category: 'Automation', connected: false, popular: true, featured: false, color: '#FF4A00', status: 'inactive', authType: 'api_key', docsUrl: '/docs/zapier', permissions: ['Create webhooks', 'Trigger actions'], pricingTier: 'basic', syncFrequency: 'realtime', rating: 4.9, reviews: 876, users: 10000 },
        { id: 'outlook', name: 'Outlook Calendar', shortDescription: 'Sync with Microsoft Outlook', description: 'Two-way sync with Outlook Calendar for Microsoft 365 users.', icon: Calendar, category: 'Calendar', connected: false, popular: false, featured: false, color: '#0078D4', status: 'inactive', authType: 'oauth', docsUrl: '/docs/outlook', permissions: ['Read/write calendar'], pricingTier: 'free', syncFrequency: 'hourly', rating: 4.5, reviews: 345, users: 6000 },
        { id: 'dropbox', name: 'Dropbox', shortDescription: 'Attach files from Dropbox', description: 'Easily attach files from Dropbox to tasks and comments.', icon: Cloud, category: 'Storage', connected: false, popular: false, featured: false, color: '#0061FF', status: 'inactive', authType: 'oauth', docsUrl: '/docs/dropbox', permissions: ['Read files', 'View file info'], pricingTier: 'free', syncFrequency: 'manual', rating: 4.4, reviews: 234, users: 4000 },
        { id: 'gmail', name: 'Gmail', shortDescription: 'Create tasks from emails', description: 'Convert important emails into tasks with one click and track email conversations.', icon: Mail, category: 'Email', connected: false, popular: false, featured: false, color: '#EA4335', status: 'inactive', authType: 'oauth', docsUrl: '/docs/gmail', permissions: ['Read emails', 'Send emails'], pricingTier: 'free', syncFrequency: 'realtime', rating: 4.7, reviews: 567, users: 7000 },
        { id: 'figma', name: 'Figma', shortDescription: 'Embed Figma designs in tasks', description: 'Preview Figma designs directly in tasks and get notified of design updates.', icon: Box, category: 'Design', connected: false, popular: true, featured: false, color: '#F24E1E', status: 'inactive', authType: 'oauth', docsUrl: '/docs/figma', permissions: ['Read files', 'View comments'], pricingTier: 'free', syncFrequency: 'hourly', rating: 4.8, reviews: 432, users: 5000 },
        { id: 'zoom', name: 'Zoom', shortDescription: 'Schedule and join Zoom meetings', description: 'Create Zoom meetings directly from tasks and join with one click.', icon: Camera, category: 'Communication', connected: false, popular: true, featured: false, color: '#2D8CFF', status: 'inactive', authType: 'oauth', docsUrl: '/docs/zoom', permissions: ['Create meetings', 'View meetings'], pricingTier: 'basic', syncFrequency: 'realtime', rating: 4.8, reviews: 654, users: 8000 },
        { id: 'trello', name: 'Trello', shortDescription: 'Sync with Trello boards', description: 'Two-way sync between tasks and Trello cards.', icon: Briefcase, category: 'Productivity', connected: false, popular: true, featured: false, color: '#0079BF', status: 'inactive', authType: 'oauth', docsUrl: '/docs/trello', permissions: ['Read/write cards', 'Create boards'], pricingTier: 'basic', syncFrequency: 'hourly', rating: 4.6, reviews: 345, users: 4500 },
        { id: 'webhook', name: 'Webhooks', shortDescription: 'Custom webhook integrations', description: 'Send and receive data using custom webhook endpoints.', icon: Webhook, category: 'Automation', connected: false, popular: false, featured: false, color: '#6B7280', status: 'inactive', authType: 'webhook', docsUrl: '/docs/webhooks', permissions: ['Send webhooks', 'Receive data'], pricingTier: 'pro', syncFrequency: 'realtime', rating: 4.5, reviews: 123, users: 2000 },
        { id: 'asana', name: 'Asana', shortDescription: 'Sync with Asana projects', description: 'Two-way synchronization between tasks and Asana projects.', icon: Target, category: 'Productivity', connected: false, popular: true, featured: false, color: '#F06A6A', status: 'inactive', authType: 'oauth', docsUrl: '/docs/asana', permissions: ['Read/write tasks', 'View projects'], pricingTier: 'basic', syncFrequency: 'hourly', rating: 4.6, reviews: 234, users: 3500 },
        { id: 'notion', name: 'Notion', shortDescription: 'Connect with Notion databases', description: 'Sync tasks with Notion databases and pages.', icon: Home, category: 'Productivity', connected: false, popular: true, featured: false, color: '#000000', status: 'inactive', authType: 'oauth', docsUrl: '/docs/notion', permissions: ['Read/write pages', 'View databases'], pricingTier: 'free', syncFrequency: 'hourly', rating: 4.9, reviews: 789, users: 9000 },
      ]
      
      setIntegrations(integrationData)
      
      // Load saved connections from localStorage
      const savedConnections = localStorage.getItem('integrations_connections')
      if (savedConnections) {
        const parsed = JSON.parse(savedConnections)
        setConnections(parsed)
        setIntegrations(prev => prev.map(i => ({
          ...i,
          connected: parsed.some((c: Connection) => c.integrationId === i.id)
        })))
      }

      // Load activity logs
      const savedLogs = localStorage.getItem('integrations_activity')
      if (savedLogs) {
        setActivityLogs(JSON.parse(savedLogs))
      }
      
      setIsLoading(false)
    }
    
    loadIntegrations()
  }, [])

  // Save connections to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('integrations_connections', JSON.stringify(connections))
    }
  }, [connections, isLoading])

  // Save activity logs
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('integrations_activity', JSON.stringify(activityLogs))
    }
  }, [activityLogs, isLoading])

  const addActivityLog = (integrationId: string, action: ActivityLog['action'], details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      integrationId,
      action,
      timestamp: new Date().toISOString(),
      details
    }
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50))
  }

  const handleConnect = (id: string) => {
    setConnectingId(id)
    
    setTimeout(() => {
      const integration = integrations.find(i => i.id === id)
      if (integration) {
        const newConnection: Connection = {
          integrationId: id,
          connectedAt: new Date().toISOString(),
          settings: {
            autoSync: true,
            notifications: true,
            twoWaySync: true,
          },
          syncStatus: 'idle',
          lastSyncTime: new Date().toISOString(),
          syncCount: 0,
        }
        
        setConnections(prev => [...prev, newConnection])
        setIntegrations(prev => prev.map(i => 
          i.id === id ? { ...i, connected: true, status: 'active', lastSync: 'Just now' } : i
        ))
        addActivityLog(id, 'connect', `Connected ${integration.name} to TaskCollab`)
        setShowSuccessToast(id)
        
        setTimeout(() => setShowSuccessToast(null), 3000)
      }
      setConnectingId(null)
    }, 1500)
  }

  const handleDisconnect = (id: string) => {
    setDisconnectingId(id)
    
    setTimeout(() => {
      const integration = integrations.find(i => i.id === id)
      setConnections(prev => prev.filter(c => c.integrationId !== id))
      setIntegrations(prev => prev.map(i => 
        i.id === id ? { ...i, connected: false, status: 'inactive', lastSync: undefined } : i
      ))
      if (integration) {
        addActivityLog(id, 'disconnect', `Disconnected ${integration.name} from TaskCollab`)
      }
      setDisconnectingId(null)
    }, 800)
  }

  const handleConfigure = (id: string) => {
    const integration = integrations.find(i => i.id === id)
    const connection = connections.find(c => c.integrationId === id)
    setSelectedIntegration(integration || null)
    if (connection?.settings) {
      setConfigSettings({
        syncFrequency: connection.settings.syncFrequency || 'realtime',
        enableNotifications: connection.settings.enableNotifications ?? true,
        autoSync: connection.settings.autoSync ?? true,
        twoWaySync: connection.settings.twoWaySync ?? true
      })
    }
    setShowConfigureModal(id)
  }

  const saveConfiguration = () => {
    if (selectedIntegration) {
      setConnections(prev => prev.map(c => 
        c.integrationId === selectedIntegration.id 
          ? { ...c, settings: { ...c.settings, ...configSettings } }
          : c
      ))
      addActivityLog(selectedIntegration.id, 'sync', `Updated configuration for ${selectedIntegration.name}`)
      setShowConfigureModal(null)
      setSelectedIntegration(null)
      setConfigSettings({ syncFrequency: 'realtime', enableNotifications: true, autoSync: true, twoWaySync: true })
    }
  }

  const getFilteredIntegrations = () => {
    let filtered = integrations
    
    if (showConnectedOnly) {
      filtered = filtered.filter(i => i.connected)
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(i => i.category === selectedCategory)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(query) || 
        i.description.toLowerCase().includes(query) ||
        i.shortDescription.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  const getFeaturedIntegration = () => {
    return integrations.find(i => i.featured && !i.connected)
  }

  const categories = ['all', ...new Set(integrations.map(i => i.category))]
  const filteredIntegrations = getFilteredIntegrations()
  const featuredIntegration = getFeaturedIntegration()
  const connectedCount = integrations.filter(i => i.connected).length
  const popularCount = integrations.filter(i => i.popular).length
  const totalSyncs = connections.reduce((acc, c) => acc + (c.syncCount || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">Loading integrations marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Integrations Marketplace
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                {connectedCount} connected • {popularCount} popular integrations
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConnectedOnly(!showConnectedOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showConnectedOnly 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {showConnectedOnly ? 'Showing Connected' : 'Show Connected Only'}
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard label="Available Apps" value={integrations.length} icon={Package} color="bg-blue-500" />
          <StatsCard label="Connected Apps" value={connectedCount} icon={Link2} color="bg-green-500" />
          <StatsCard label="Total Syncs" value={totalSyncs.toLocaleString()} icon={RefreshCw} color="bg-purple-500" />
          <StatsCard label="Avg Rating" value="4.7" icon={Star} color="bg-yellow-500" />
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, category, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* FEATURED INTEGRATION BANNER */}
        {featuredIntegration && !searchQuery && selectedCategory === 'all' && !showConnectedOnly && (
          <FeaturedIntegration 
            integration={featuredIntegration} 
            onConnect={handleConnect} 
          />
        )}

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = categoryIcons[cat] || Package
            const count = integrations.filter(i => i.category === cat).length
            return (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{cat === 'all' ? 'All' : cat}</span>
                {cat !== 'all' && (
                  <span className={`text-xs ${selectedCategory === cat ? 'text-blue-200' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* INTEGRATIONS GRID & ACTIVITY SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {filteredIntegrations.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700"
              >
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No integrations found</h3>
                <p className="text-gray-400 dark:text-gray-500 mt-1">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setShowConnectedOnly(false)
                  }}
                  className="mt-4 px-4 py-2 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredIntegrations.map(integration => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                      onConfigure={handleConfigure}
                      isConnecting={connectingId === integration.id || disconnectingId === integration.id}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Activity Log Sidebar */}
          <div>
            <ActivityLog logs={activityLogs} integrations={integrations} />
            
            {/* Quick Stats */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Popular Now</h4>
              </div>
              <div className="space-y-2">
                {integrations.filter(i => i.popular).slice(0, 3).map(integration => (
                  <div key={integration.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{integration.name}</span>
                    <span className="text-xs text-green-500">{integration.users.toLocaleString()} users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUCCESS TOAST */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 z-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Integration connected successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONFIGURE MODAL */}
      <AnimatePresence>
        {showConfigureModal && selectedIntegration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfigureModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedIntegration.color }}>
                    <selectedIntegration.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Configure {selectedIntegration.name}
                  </h2>
                </div>
                <button onClick={() => setShowConfigureModal(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Your integration is connected and working properly. Use these settings to customize behavior.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sync Frequency</label>
                  <select 
                    value={configSettings.syncFrequency}
                    onChange={(e) => setConfigSettings({ ...configSettings, syncFrequency: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="realtime">Realtime</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={configSettings.enableNotifications}
                      onChange={(e) => setConfigSettings({ ...configSettings, enableNotifications: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable notifications</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={configSettings.autoSync}
                      onChange={(e) => setConfigSettings({ ...configSettings, autoSync: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-sync data</span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={configSettings.twoWaySync}
                      onChange={(e) => setConfigSettings({ ...configSettings, twoWaySync: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Two-way sync</span>
                  </label>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    onClick={saveConfiguration}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={() => setShowConfigureModal(null)}
                    className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
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