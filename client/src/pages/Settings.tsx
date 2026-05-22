// src/pages/Settings.tsx - Ultra-Comprehensive Settings Page
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  User, Bell, Shield, Palette, Globe, Lock, Moon, Sun,
  Monitor, Smartphone, Tablet, Volume2, VolumeX, Eye,
  EyeOff, Key, Mail, Phone, MapPin, Calendar, Clock,
  Database, Cloud, Download, Upload, RefreshCw, Trash2,
  Save, X, CheckCircle2, AlertTriangle, ChevronRight,
  ChevronDown, Plus, Minus, ToggleLeft, ToggleRight,
  LogOut, Share2, Copy, Edit, Camera, Image, FileText,
  MessageSquare, Zap, Activity, BarChart3, Settings as SettingsIcon,
  Fingerprint, Wifi, WifiOff, Bluetooth, Printer,
  Battery, BatteryCharging, Signal, HardDrive,
  Cpu, Mic, MicOff, Video, VideoOff,
  Headphones, Speaker, MonitorPlay, Gamepad2, Keyboard,
  Mouse, Watch, Home, Briefcase, Coffee,
  Dumbbell, Heart, Brain, Sparkles, Rocket, Star,
  Award, Gift, Cake, Music, Film, BookOpen,
  Brush, Scissors, Ruler, Droplet, Flame, Leaf,
  CloudLightning, Compass, Map as MapIcon,
  Flag, Navigation, Anchor, Ship, Plane, Train, Bus,
  Bike, Luggage, Backpack, Tent, TreePine, Flower, Mountain, Waves,
  Crown, Gem, Diamond, BriefcaseBusiness, GraduationCap, Stethoscope,
  Search, Wrench, PenTool, Code, Terminal, GitBranch,
  Layers, Grid, List, Layout, Maximize2, Minimize2,
  Workflow, GitMerge, Server, CloudOff, AlertCircle
} from 'lucide-react'

// ============================================
// ENHANCED TYPES
// ============================================
interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
  role: string
  department: string
  phone: string
  mobile: string
  workPhone: string
  location: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  weekStartsOn: 0 | 1 | 6
  workHoursStart: string
  workHoursEnd: string
  breakDuration: number
  overtimeEnabled: boolean
  emergencyContact: string
  emergencyPhone: string
  bloodGroup: string
  allergies: string[]
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  desktopNotifications: boolean
  soundEnabled: boolean
  soundVolume: number
  soundTone: 'default' | 'soft' | 'energetic' | 'minimal'
  vibrationEnabled: boolean
  taskAssigned: boolean
  taskCompleted: boolean
  taskDue: boolean
  taskOverdue: boolean
  taskUpdated: boolean
  taskDeleted: boolean
  commentAdded: boolean
  mentionReceived: boolean
  weeklyDigest: boolean
  monthlyReport: boolean
  dueDateReminder: number
  reminderTimes: number[]
  quietHoursStart: string
  quietHoursEnd: string
  quietHoursEnabled: boolean
  quietHoursExceptions: string[]
  criticalOnlyMode: boolean
  focusMode: boolean
  focusModeSchedule: { start: string; end: string; days: number[] }
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  fontFamily: 'system' | 'sans' | 'serif' | 'mono'
  lineHeight: 'compact' | 'normal' | 'relaxed'
  compactMode: boolean
  highContrast: boolean
  reducedMotion: boolean
  showAnimations: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
  sidebarPosition: 'left' | 'right'
  sidebarCollapsed: boolean
  defaultView: 'kanban' | 'list' | 'grid' | 'timeline' | 'calendar'
  tasksPerPage: number
  accentColor: string
  backgroundColor: string
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'pill'
  shadowIntensity: 'none' | 'light' | 'medium' | 'heavy'
  glassmorphism: boolean
  backgroundImage: string | null
  backgroundBlur: number
  showTaskProgress: boolean
  showSubtasks: boolean
  showTags: boolean
  taskCardStyle: 'minimal' | 'detailed' | 'compact'
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod: 'authenticator' | 'sms' | 'email' | 'biometric'
  backupCodes: string[]
  sessionTimeout: number
  loginNotifications: boolean
  deviceVerification: boolean
  trustedDevices: string[]
  blockedDevices: string[]
  lastPasswordChange: string
  passwordStrength: 'weak' | 'medium' | 'strong'
  passwordExpiryDays: number
  passwordHistory: string[]
  loginAlerts: boolean
  suspiciousActivityAlerts: boolean
  ipWhitelist: string[]
  allowedDomains: string[]
  mfaRememberDays: number
  biometricEnabled: boolean
  faceIdEnabled: boolean
  fingerprintEnabled: boolean
  securityQuestions: { question: string; answer: string }[]
  encryptedBackup: boolean
  autoLockTimeout: number
}

interface IntegrationSettings {
  googleCalendar: boolean
  googleCalendarSync: 'one-way' | 'two-way'
  googleDrive: boolean
  outlookCalendar: boolean
  exchangeServer: string
  slack: boolean
  slackChannel: string
  microsoftTeams: boolean
  teamsWebhook: string
  discord: boolean
  discordWebhook: string
  github: boolean
  githubRepo: string
  gitlab: boolean
  bitbucket: boolean
  jira: boolean
  jiraProject: string
  trello: boolean
  asana: boolean
  notion: boolean
  notionApiKey: string
  zapier: boolean
  zapierWebhook: string
  apiKey: string
  apiKeyExpiry: string
  webhookUrl: string
  webhookSecret: string
  rateLimit: number
  allowedOrigins: string[]
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'team' | 'contacts'
  emailVisibility: 'public' | 'private' | 'team'
  phoneVisibility: 'public' | 'private' | 'team'
  activityStatus: boolean
  readReceipts: boolean
  typingIndicator: boolean
  lastSeen: 'everyone' | 'contacts' | 'nobody'
  dataSharing: boolean
  analyticsTracking: boolean
  personalizedAds: boolean
  thirdPartySharing: boolean
  deleteDataAfter: number | 'never'
  downloadMyData: boolean
  dataPortability: boolean
  gdprCompliance: boolean
  ccpaCompliance: boolean
}

interface BackupSettings {
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  backupTime: string
  backupRetention: number
  cloudBackup: boolean
  cloudProvider: 'google' | 'dropbox' | 'onedrive' | 'custom'
  cloudFolder: string
  localBackup: boolean
  backupPath: string
  encryptionEnabled: boolean
  encryptionKey: string
  lastBackup: string
  backupSize: string
  backupStatus: 'success' | 'failed' | 'in-progress'
}

interface AccessibilitySettings {
  screenReaderOptimized: boolean
  highContrastMode: 'off' | 'on' | 'auto'
  fontSizeScaling: number
  dyslexicFont: boolean
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  reduceTransparency: boolean
  increaseButtonSize: boolean
  keyboardNavigation: boolean
  keyboardShortcuts: { [key: string]: string }
  voiceControl: boolean
  voiceCommands: string[]
  customShortcuts: { action: string; shortcut: string }[]
  tooltipDelay: number
  focusIndicator: boolean
  announcementVolume: number
}

interface WorkspaceSettings {
  workspaceName: string
  workspaceLogo: string
  workspaceDomain: string
  teamSize: number
  defaultRole: 'admin' | 'member' | 'viewer'
  allowGuests: boolean
  guestPermissions: string[]
  teamFolders: boolean
  sharedCalendars: boolean
  resourceManagement: boolean
  timeTracking: boolean
  expensesEnabled: boolean
  budgetTracking: boolean
  invoiceGeneration: boolean
  clientPortal: boolean
  whiteLabel: boolean
  customCSS: string
  customJS: string
  brandingColor: string
  favicon: string
}

interface AdvancedSettings {
  experimentalFeatures: boolean
  betaProgram: boolean
  developerMode: boolean
  apiAccess: boolean
  webhooksEnabled: boolean
  customEndpoints: { name: string; url: string }[]
  loggingLevel: 'debug' | 'info' | 'warn' | 'error'
  auditLogging: boolean
  performanceMonitoring: boolean
  errorReporting: boolean
  usageAnalytics: boolean
  cacheEnabled: boolean
  cacheDuration: number
  offlineMode: boolean
  syncOnReconnect: boolean
  batchProcessing: boolean
  batchSize: number
  queueRetryAttempts: number
  webSocketEnabled: boolean
  realtimeUpdates: boolean
}

type SectionType = 'profile' | 'notifications' | 'appearance' | 'security' | 'integrations' | 'privacy' | 'backup' | 'accessibility' | 'workspace' | 'advanced'

// ============================================
// 3D CARD COMPONENT
// ============================================
const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  depth?: number
  glow?: boolean
}> = ({ children, className = '', depth = 20, glow = false }) => {
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
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ scale: 1.02, z: 20 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${glow ? 'hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}

// ============================================
// ENHANCED TOGGLE SWITCH
// ============================================
const ToggleSwitch: React.FC<{
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
  icon?: React.ReactNode
  warning?: string
}> = ({ enabled, onChange, label, description, icon, warning }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 transition-colors"
  >
    <div className="flex-1 flex items-start space-x-3">
      {icon && <div className="mt-0.5 text-gray-400 dark:text-gray-500">{icon}</div>}
      <div>
        {label && <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>}
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        {warning && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{warning}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <motion.span
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
      />
    </button>
  </motion.div>
)

// ============================================
// SLIDER COMPONENT
// ============================================
const Slider: React.FC<{
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label: string
  unit?: string
}> = ({ value, onChange, min, max, step = 1, label, unit }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-gray-500 dark:text-gray-400">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
    />
  </div>
)

// ============================================
// COLOR PICKER
// ============================================
const ColorPicker: React.FC<{
  value: string
  onChange: (color: string) => void
  label: string
}> = ({ value, onChange, label }) => {
  const presetColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#06b6d4', '#f97316']

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border dark:border-gray-600"
        />
        <div className="flex flex-wrap gap-2 flex-1">
          {presetColors.map(color => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={`w-8 h-8 rounded-full transition-all ${value === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN SETTINGS COMPONENT
// ============================================
export default function Settings() {
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

  const [activeSection, setActiveSection] = useState<SectionType>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alice Johnson', email: 'alice@taskcollab.com', avatar: 'AJ',
    bio: 'Lead Designer passionate about creating beautiful user experiences.',
    role: 'Lead Designer', department: 'Design', phone: '+1 (555) 123-4567',
    mobile: '+1 (555) 987-6543', workPhone: '+1 (555) 456-7890',
    location: 'San Francisco, CA', timezone: 'America/Los_Angeles',
    language: 'en', dateFormat: 'MM/DD/YYYY', timeFormat: '12h', weekStartsOn: 0,
    workHoursStart: '09:00', workHoursEnd: '17:00', breakDuration: 60,
    overtimeEnabled: true, emergencyContact: 'John Johnson', emergencyPhone: '+1 (555) 111-2222',
    bloodGroup: 'A+', allergies: ['Peanuts', 'Pollen']
  })

  // Notification State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true, pushNotifications: true, desktopNotifications: true,
    soundEnabled: true, soundVolume: 70, soundTone: 'default', vibrationEnabled: true,
    taskAssigned: true, taskCompleted: true, taskDue: true, taskOverdue: true,
    taskUpdated: true, taskDeleted: false, commentAdded: true, mentionReceived: true,
    weeklyDigest: true, monthlyReport: false, dueDateReminder: 24, reminderTimes: [60, 15],
    quietHoursStart: '22:00', quietHoursEnd: '07:00', quietHoursEnabled: false,
    quietHoursExceptions: ['urgent', 'mention'], criticalOnlyMode: false,
    focusMode: false, focusModeSchedule: { start: '09:00', end: '12:00', days: [1, 2, 3, 4, 5] }
  })

  // Appearance State
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'system', fontSize: 'medium', fontFamily: 'system', lineHeight: 'normal',
    compactMode: false, highContrast: false, reducedMotion: false,
    showAnimations: true, animationSpeed: 'normal', sidebarPosition: 'left',
    sidebarCollapsed: false, defaultView: 'kanban', tasksPerPage: 20,
    accentColor: '#3b82f6', backgroundColor: '#ffffff', borderRadius: 'medium',
    shadowIntensity: 'medium', glassmorphism: false, backgroundImage: null,
    backgroundBlur: 0, showTaskProgress: true, showSubtasks: true, showTags: true,
    taskCardStyle: 'detailed'
  })

  // Security State
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false, twoFactorMethod: 'authenticator', backupCodes: [],
    sessionTimeout: 30, loginNotifications: true, deviceVerification: true,
    trustedDevices: ['MacBook Pro', 'iPhone 15'], blockedDevices: [],
    lastPasswordChange: '2026-04-15', passwordStrength: 'strong', passwordExpiryDays: 90,
    passwordHistory: [], loginAlerts: true, suspiciousActivityAlerts: true,
    ipWhitelist: [], allowedDomains: [], mfaRememberDays: 30,
    biometricEnabled: false, faceIdEnabled: false, fingerprintEnabled: false,
    securityQuestions: [], encryptedBackup: false, autoLockTimeout: 5
  })

  // Integration State
  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    googleCalendar: true, googleCalendarSync: 'two-way', googleDrive: false,
    outlookCalendar: false, exchangeServer: '', slack: true, slackChannel: '#general',
    microsoftTeams: false, teamsWebhook: '', discord: false, discordWebhook: '',
    github: true, githubRepo: 'taskcollab/main', gitlab: false, bitbucket: false,
    jira: false, jiraProject: '', trello: false, asana: false, notion: false,
    notionApiKey: '', zapier: false, zapierWebhook: '',
    apiKey: '••••••••••••••••••••••••••', apiKeyExpiry: '2027-01-01',
    webhookUrl: 'https://api.taskcollab.com/webhook', webhookSecret: '••••••••',
    rateLimit: 1000, allowedOrigins: ['https://taskcollab.com']
  })

  // Privacy State
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'team', emailVisibility: 'team', phoneVisibility: 'private',
    activityStatus: true, readReceipts: true, typingIndicator: true,
    lastSeen: 'contacts', dataSharing: false, analyticsTracking: true,
    personalizedAds: false, thirdPartySharing: false, deleteDataAfter: 'never',
    downloadMyData: true, dataPortability: true, gdprCompliance: true, ccpaCompliance: true
  })

  // Backup State
  const [backup, setBackup] = useState<BackupSettings>({
    autoBackup: true, backupFrequency: 'daily', backupTime: '02:00',
    backupRetention: 30, cloudBackup: true, cloudProvider: 'google',
    cloudFolder: '/TaskCollab/Backups', localBackup: false, backupPath: '',
    encryptionEnabled: true, encryptionKey: '', lastBackup: '2026-04-20 02:00:00',
    backupSize: '245 MB', backupStatus: 'success'
  })

  // Accessibility State
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    screenReaderOptimized: true, highContrastMode: 'off', fontSizeScaling: 100,
    dyslexicFont: false, colorBlindMode: 'none', reduceTransparency: false,
    increaseButtonSize: false, keyboardNavigation: true,
    keyboardShortcuts: { 'Ctrl+N': 'New Task', 'Ctrl+F': 'Search', 'Ctrl+S': 'Save' },
    voiceControl: false, voiceCommands: ['create task', 'search', 'navigate'],
    customShortcuts: [], tooltipDelay: 500, focusIndicator: true, announcementVolume: 50
  })

  // Workspace State
  const [workspace, setWorkspace] = useState<WorkspaceSettings>({
    workspaceName: 'TaskCollab', workspaceLogo: '', workspaceDomain: 'taskcollab.com',
    teamSize: 25, defaultRole: 'member', allowGuests: true,
    guestPermissions: ['view', 'comment'], teamFolders: true, sharedCalendars: true,
    resourceManagement: true, timeTracking: true, expensesEnabled: false,
    budgetTracking: false, invoiceGeneration: false, clientPortal: false,
    whiteLabel: false, customCSS: '', customJS: '', brandingColor: '#3b82f6', favicon: ''
  })

  // Advanced State
  const [advanced, setAdvanced] = useState<AdvancedSettings>({
    experimentalFeatures: false, betaProgram: false, developerMode: false,
    apiAccess: true, webhooksEnabled: true, customEndpoints: [],
    loggingLevel: 'info', auditLogging: true, performanceMonitoring: true,
    errorReporting: true, usageAnalytics: true, cacheEnabled: true,
    cacheDuration: 3600, offlineMode: true, syncOnReconnect: true,
    batchProcessing: true, batchSize: 100, queueRetryAttempts: 3,
    webSocketEnabled: true, realtimeUpdates: true
  })

  const handleSave = useCallback(() => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveMessage('All settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 1200)
  }, [])

  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(cardId)) newExpanded.delete(cardId)
    else newExpanded.add(cardId)
    setExpandedCards(newExpanded)
  }

  const sections: { id: SectionType; label: string; icon: any; color: string }[] = [
    { id: 'profile', label: 'Profile', icon: User, color: 'blue' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'purple' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'pink' },
    { id: 'security', label: 'Security', icon: Shield, color: 'red' },
    { id: 'integrations', label: 'Integrations', icon: Zap, color: 'yellow' },
    { id: 'privacy', label: 'Privacy', icon: Lock, color: 'indigo' },
    { id: 'backup', label: 'Backup', icon: Database, color: 'green' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, color: 'teal' },
    { id: 'workspace', label: 'Workspace', icon: Briefcase, color: 'orange' },
    { id: 'advanced', label: 'Advanced', icon: SettingsIcon, color: 'gray' }
  ]

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections
    return sections.filter(section => 
      section.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, sections])

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; activeBg: string }> = {
      blue: { bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', activeBg: 'bg-blue-50 dark:bg-blue-900/30' },
      purple: { bg: 'hover:bg-purple-50 dark:hover:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', activeBg: 'bg-purple-50 dark:bg-purple-900/30' },
      pink: { bg: 'hover:bg-pink-50 dark:hover:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', activeBg: 'bg-pink-50 dark:bg-pink-900/30' },
      red: { bg: 'hover:bg-red-50 dark:hover:bg-red-900/20', text: 'text-red-600 dark:text-red-400', activeBg: 'bg-red-50 dark:bg-red-900/30' },
      yellow: { bg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', activeBg: 'bg-yellow-50 dark:bg-yellow-900/30' },
      indigo: { bg: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', activeBg: 'bg-indigo-50 dark:bg-indigo-900/30' },
      green: { bg: 'hover:bg-green-50 dark:hover:bg-green-900/20', text: 'text-green-600 dark:text-green-400', activeBg: 'bg-green-50 dark:bg-green-900/30' },
      teal: { bg: 'hover:bg-teal-50 dark:hover:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', activeBg: 'bg-teal-50 dark:bg-teal-900/30' },
      orange: { bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', activeBg: 'bg-orange-50 dark:bg-orange-900/30' },
      gray: { bg: 'hover:bg-gray-50 dark:hover:bg-gray-700/50', text: 'text-gray-600 dark:text-gray-400', activeBg: 'bg-gray-50 dark:bg-gray-700/50' },
    }
    return colors[color] || colors.gray
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
        
        {/* HEADER WITH SEARCH */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
            >
              Settings
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 }} 
              className="text-gray-500 dark:text-gray-400 mt-1"
            >
              Manage all your preferences in one place
            </motion.p>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <div className="lg:w-64 flex-shrink-0">
            <Card3D className="p-2 sticky top-6" depth={10}>
              <nav className="space-y-1">
                {filteredSections.map(section => {
                  const colors = getColorClasses(section.color)
                  return (
                    <motion.button
                      key={section.id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeSection === section.id 
                          ? `${colors.activeBg} ${colors.text} shadow-sm` 
                          : `text-gray-600 dark:text-gray-400 ${colors.bg}`
                      }`}
                    >
                      <section.icon className={`w-4 h-4 ${activeSection === section.id ? colors.text : ''}`} />
                      <span>{section.label}</span>
                      {activeSection === section.id && (
                        <motion.div
                          layoutId="activeSection"
                          className={`ml-auto w-1 h-6 bg-${section.color}-500 rounded-full`}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </nav>
            </Card3D>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {/* PROFILE SECTION */}
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card3D className="p-6" depth={20} glow>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <span>Profile Information</span>
                    </h2>
                    
                    <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                          {profile.avatar}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group-hover:scale-110">
                          <Camera className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xl">{profile.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{profile.role}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Active
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {profile.department}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Personal Information</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Work)</label>
                            <input type="tel" value={profile.workPhone} onChange={(e) => setProfile({ ...profile, workPhone: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Mobile)</label>
                            <input type="tel" value={profile.mobile} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                            <select value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>Design</option><option>Engineering</option><option>Product</option>
                              <option>Marketing</option><option>Sales</option><option>HR</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                            <input type="text" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                            <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                            <select value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option>America/Los_Angeles</option><option>America/New_York</option>
                              <option>Europe/London</option><option>Asia/Tokyo</option>
                              <option>Australia/Sydney</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <button 
                          onClick={() => toggleCard('emergency')}
                          className="flex items-center justify-between w-full text-md font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>Emergency Contact</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedCards.has('emergency') ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedCards.has('emergency') && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact Name</label>
                                <input type="text" value={profile.emergencyContact} onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Phone</label>
                                <input type="tel" value={profile.emergencyPhone} onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                                <select value={profile.bloodGroup} onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                                  <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergies</label>
                                <input type="text" value={profile.allergies.join(', ')} onChange={(e) => setProfile({ ...profile, allergies: e.target.value.split(',').map(s => s.trim()) })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Separate with commas" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <button 
                          onClick={() => toggleCard('schedule')}
                          className="flex items-center justify-between w-full text-md font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span>Work Schedule</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedCards.has('schedule') ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedCards.has('schedule') && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work Start</label>
                                <input type="time" value={profile.workHoursStart} onChange={(e) => setProfile({ ...profile, workHoursStart: e.target.value })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work End</label>
                                <input type="time" value={profile.workHoursEnd} onChange={(e) => setProfile({ ...profile, workHoursEnd: e.target.value })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Break Duration (minutes)</label>
                                <select value={profile.breakDuration} onChange={(e) => setProfile({ ...profile, breakDuration: parseInt(e.target.value) })}
                                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                  <option value="30">30 minutes</option><option value="45">45 minutes</option>
                                  <option value="60">60 minutes</option><option value="90">90 minutes</option>
                                </select>
                              </div>
                              <div className="flex items-center pt-6">
                                <ToggleSwitch 
                                  enabled={profile.overtimeEnabled} 
                                  onChange={(v) => setProfile({ ...profile, overtimeEnabled: v })}
                                  label="Enable Overtime Tracking"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Regional Preferences</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                            <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option value="en">English (US)</option><option value="en-GB">English (UK)</option>
                              <option value="es">Español</option><option value="fr">Français</option>
                              <option value="de">Deutsch</option><option value="ja">日本語</option>
                              <option value="zh">中文</option><option value="ko">한국어</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Format</label>
                            <select value={profile.dateFormat} onChange={(e) => setProfile({ ...profile, dateFormat: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Format</label>
                            <select value={profile.timeFormat} onChange={(e) => setProfile({ ...profile, timeFormat: e.target.value as '12h' | '24h' })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option value="12h">12-hour (AM/PM)</option><option value="24h">24-hour</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Week Starts On</label>
                            <select value={profile.weekStartsOn} onChange={(e) => setProfile({ ...profile, weekStartsOn: parseInt(e.target.value) as 0 | 1 | 6 })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              <option value="0">Sunday</option><option value="1">Monday</option><option value="6">Saturday</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* NOTIFICATIONS SECTION */}
              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-purple-500" />
                      <span>Notification Preferences</span>
                    </h2>

                    <div className="mb-6">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Delivery Methods</h3>
                      <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                        <ToggleSwitch enabled={notifications.emailNotifications} onChange={(v) => setNotifications({ ...notifications, emailNotifications: v })}
                          label="Email Notifications" icon={<Mail className="w-4 h-4" />}
                          description="Receive notifications via email" />
                        <ToggleSwitch enabled={notifications.pushNotifications} onChange={(v) => setNotifications({ ...notifications, pushNotifications: v })}
                          label="Push Notifications" icon={<Bell className="w-4 h-4" />}
                          description="Receive push notifications in browser" />
                        <ToggleSwitch enabled={notifications.desktopNotifications} onChange={(v) => setNotifications({ ...notifications, desktopNotifications: v })}
                          label="Desktop Notifications" icon={<Monitor className="w-4 h-4" />}
                          description="Show desktop notification popups" />
                        <ToggleSwitch enabled={notifications.soundEnabled} onChange={(v) => setNotifications({ ...notifications, soundEnabled: v })}
                          label="Sound Effects" icon={<Volume2 className="w-4 h-4" />}
                          description="Play sound for notifications" />
                        {notifications.soundEnabled && (
                          <div className="pl-8 pr-2 py-2">
                            <Slider 
                              value={notifications.soundVolume} 
                              onChange={(v) => setNotifications({ ...notifications, soundVolume: v })}
                              min={0} max={100} label="Sound Volume" unit="%"
                            />
                            <select 
                              value={notifications.soundTone}
                              onChange={(e) => setNotifications({ ...notifications, soundTone: e.target.value as any })}
                              className="mt-2 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                              <option value="default">Default Tone</option>
                              <option value="soft">Soft Tone</option>
                              <option value="energetic">Energetic Tone</option>
                              <option value="minimal">Minimal Tone</option>
                            </select>
                          </div>
                        )}
                        <ToggleSwitch enabled={notifications.vibrationEnabled} onChange={(v) => setNotifications({ ...notifications, vibrationEnabled: v })}
                          label="Vibration" icon={<Smartphone className="w-4 h-4" />}
                          description="Vibrate on mobile devices" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">What to notify me about</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <ToggleSwitch enabled={notifications.taskAssigned} onChange={(v) => setNotifications({ ...notifications, taskAssigned: v })}
                          label="Task Assigned" description="When a task is assigned to you" />
                        <ToggleSwitch enabled={notifications.taskCompleted} onChange={(v) => setNotifications({ ...notifications, taskCompleted: v })}
                          label="Task Completed" description="When a task you're watching is completed" />
                        <ToggleSwitch enabled={notifications.taskDue} onChange={(v) => setNotifications({ ...notifications, taskDue: v })}
                          label="Task Due" description="When a task is approaching due date" />
                        <ToggleSwitch enabled={notifications.taskOverdue} onChange={(v) => setNotifications({ ...notifications, taskOverdue: v })}
                          label="Task Overdue" description="When a task becomes overdue" />
                        <ToggleSwitch enabled={notifications.taskUpdated} onChange={(v) => setNotifications({ ...notifications, taskUpdated: v })}
                          label="Task Updates" description="When tasks are updated" />
                        <ToggleSwitch enabled={notifications.commentAdded} onChange={(v) => setNotifications({ ...notifications, commentAdded: v })}
                          label="Comments" description="When someone comments on your tasks" />
                        <ToggleSwitch enabled={notifications.mentionReceived} onChange={(v) => setNotifications({ ...notifications, mentionReceived: v })}
                          label="@Mentions" description="When someone mentions you" />
                        <ToggleSwitch enabled={notifications.weeklyDigest} onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
                          label="Weekly Digest" description="Weekly summary of your activity" />
                      </div>
                    </div>

                    <div>
                      <ToggleSwitch enabled={notifications.quietHoursEnabled} onChange={(v) => setNotifications({ ...notifications, quietHoursEnabled: v })}
                        label="Quiet Hours" icon={<Moon className="w-4 h-4" />}
                        description="Pause notifications during specific hours" />
                      {notifications.quietHoursEnabled && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                              <input type="time" value={notifications.quietHoursStart} 
                                onChange={(e) => setNotifications({ ...notifications, quietHoursStart: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                              <input type="time" value={notifications.quietHoursEnd} 
                                onChange={(e) => setNotifications({ ...notifications, quietHoursEnd: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* APPEARANCE SECTION */}
              {activeSection === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Palette className="w-5 h-5 text-pink-500" />
                      <span>Appearance Settings</span>
                    </h2>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: 'light' as const, icon: Sun, label: 'Light' },
                          { value: 'dark' as const, icon: Moon, label: 'Dark' },
                          { value: 'system' as const, icon: Monitor, label: 'System' },
                        ].map(theme => (
                          <button key={theme.value}
                            onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              appearance.theme === theme.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}>
                            <theme.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ColorPicker 
                        value={appearance.accentColor} 
                        onChange={(color) => setAppearance({ ...appearance, accentColor: color })}
                        label="Accent Color"
                      />
                      <ColorPicker 
                        value={appearance.backgroundColor} 
                        onChange={(color) => setAppearance({ ...appearance, backgroundColor: color })}
                        label="Background Color"
                      />
                    </div>

                    <div className="mb-6">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Typography</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                          <select value={appearance.fontSize} onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value as any })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                            <option value="small">Small</option><option value="medium">Medium</option>
                            <option value="large">Large</option><option value="extra-large">Extra Large</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
                          <select value={appearance.fontFamily} onChange={(e) => setAppearance({ ...appearance, fontFamily: e.target.value as any })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                            <option value="system">System Default</option><option value="sans">Sans-serif</option>
                            <option value="serif">Serif</option><option value="mono">Monospace</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Line Height</label>
                          <select value={appearance.lineHeight} onChange={(e) => setAppearance({ ...appearance, lineHeight: e.target.value as any })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                            <option value="compact">Compact</option><option value="normal">Normal</option>
                            <option value="relaxed">Relaxed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 divide-y divide-gray-100 dark:divide-gray-700">
                      <ToggleSwitch enabled={appearance.compactMode} onChange={(v) => setAppearance({ ...appearance, compactMode: v })}
                        label="Compact Mode" description="Reduce spacing between elements" />
                      <ToggleSwitch enabled={appearance.glassmorphism} onChange={(v) => setAppearance({ ...appearance, glassmorphism: v })}
                        label="Glassmorphism" description="Enable frosted glass effect" warning="May impact performance" />
                      <ToggleSwitch enabled={appearance.showTaskProgress} onChange={(v) => setAppearance({ ...appearance, showTaskProgress: v })}
                        label="Show Task Progress" description="Display progress bars on tasks" />
                      <ToggleSwitch enabled={appearance.showSubtasks} onChange={(v) => setAppearance({ ...appearance, showSubtasks: v })}
                        label="Show Subtasks" description="Display subtasks in task cards" />
                      <ToggleSwitch enabled={appearance.showTags} onChange={(v) => setAppearance({ ...appearance, showTags: v })}
                        label="Show Tags" description="Display tags on task cards" />
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* SECURITY SECTION */}
              {activeSection === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      <span>Security Settings</span>
                    </h2>
                    
                    <div className="space-y-4">
                      <ToggleSwitch enabled={security.twoFactorEnabled} onChange={(v) => setSecurity({ ...security, twoFactorEnabled: v })}
                        label="Two-Factor Authentication" description="Add an extra layer of security to your account" />
                      <ToggleSwitch enabled={security.loginNotifications} onChange={(v) => setSecurity({ ...security, loginNotifications: v })}
                        label="Login Notifications" description="Get notified of new logins to your account" />
                      <ToggleSwitch enabled={security.biometricEnabled} onChange={(v) => setSecurity({ ...security, biometricEnabled: v })}
                        label="Biometric Authentication" description="Use fingerprint or face recognition" />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
                        <select value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="15">15 minutes</option><option value="30">30 minutes</option>
                          <option value="60">1 hour</option><option value="120">2 hours</option>
                          <option value="0">Never</option>
                        </select>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Last changed: {security.lastPasswordChange}</p>
                        <div className="space-y-3">
                          <input type={showPassword ? "text" : "password"} placeholder="Current password" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                          <input type={showPassword ? "text" : "password"} placeholder="New password" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                          <input type={showPassword ? "text" : "password"} placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">Update Password</button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Trusted Devices</h3>
                        <div className="space-y-2">
                          {security.trustedDevices.map((device, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Monitor className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{device}</span>
                              </div>
                              <button className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* INTEGRATIONS SECTION */}
              {activeSection === 'integrations' && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span>Integrations</span>
                    </h2>
                    <div className="space-y-3">
                      {[
                        { name: 'Google Calendar', enabled: integrations.googleCalendar, icon: Calendar, color: '#4285F4' },
                        { name: 'Outlook Calendar', enabled: integrations.outlookCalendar, icon: Calendar, color: '#0078D4' },
                        { name: 'Slack', enabled: integrations.slack, icon: MessageSquare, color: '#4A154B' },
                        { name: 'Microsoft Teams', enabled: integrations.microsoftTeams, icon: MessageSquare, color: '#6264A7' },
                        { name: 'GitHub', enabled: integrations.github, icon: Code, color: '#24292e' },
                        { name: 'Discord', enabled: integrations.discord, icon: MessageSquare, color: '#5865F2' },
                      ].map(integration => (
                        <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: integration.color }}>
                              <integration.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">{integration.name}</span>
                          </div>
                          <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            integration.enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}>
                            {integration.enabled ? 'Connected' : 'Connect'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* PRIVACY SECTION */}
              {activeSection === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-indigo-500" />
                      <span>Privacy Controls</span>
                    </h2>
                    <div className="space-y-4">
                      <ToggleSwitch enabled={privacy.activityStatus} onChange={(v) => setPrivacy({ ...privacy, activityStatus: v })}
                        label="Show Activity Status" description="Let others see when you're active" />
                      <ToggleSwitch enabled={privacy.readReceipts} onChange={(v) => setPrivacy({ ...privacy, readReceipts: v })}
                        label="Read Receipts" description="Show when you've read messages" />
                      <ToggleSwitch enabled={privacy.typingIndicator} onChange={(v) => setPrivacy({ ...privacy, typingIndicator: v })}
                        label="Typing Indicator" description="Show when you're typing" />
                      <ToggleSwitch enabled={privacy.analyticsTracking} onChange={(v) => setPrivacy({ ...privacy, analyticsTracking: v })}
                        label="Analytics Tracking" description="Help us improve by sharing usage data" />
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* BACKUP SECTION */}
              {activeSection === 'backup' && (
                <motion.div
                  key="backup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Database className="w-5 h-5 text-green-500" />
                      <span>Backup & Data</span>
                    </h2>
                    <div className="space-y-4">
                      <ToggleSwitch enabled={backup.autoBackup} onChange={(v) => setBackup({ ...backup, autoBackup: v })}
                        label="Auto Backup" description="Automatically backup your data" />
                      <ToggleSwitch enabled={backup.cloudBackup} onChange={(v) => setBackup({ ...backup, cloudBackup: v })}
                        label="Cloud Backup" description="Store backups in the cloud" />
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Last Backup</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{backup.lastBackup}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Size: {backup.backupSize}</p>
                          </div>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Backup Now</button>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* ACCESSIBILITY SECTION */}
              {activeSection === 'accessibility' && (
                <motion.div
                  key="accessibility"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-teal-500" />
                      <span>Accessibility</span>
                    </h2>
                    <div className="space-y-4">
                      <ToggleSwitch enabled={accessibility.screenReaderOptimized} onChange={(v) => setAccessibility({ ...accessibility, screenReaderOptimized: v })}
                        label="Screen Reader Optimized" description="Optimize for screen readers" />
                      <ToggleSwitch enabled={accessibility.dyslexicFont} onChange={(v) => setAccessibility({ ...accessibility, dyslexicFont: v })}
                        label="Dyslexic-Friendly Font" description="Use font optimized for dyslexia" />
                      <ToggleSwitch enabled={accessibility.keyboardNavigation} onChange={(v) => setAccessibility({ ...accessibility, keyboardNavigation: v })}
                        label="Keyboard Navigation" description="Enable full keyboard navigation" />
                      <Slider 
                        value={accessibility.fontSizeScaling}
                        onChange={(v) => setAccessibility({ ...accessibility, fontSizeScaling: v })}
                        min={50} max={200} label="Font Size Scaling" unit="%"
                      />
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* WORKSPACE SECTION */}
              {activeSection === 'workspace' && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-orange-500" />
                      <span>Workspace Settings</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workspace Name</label>
                        <input type="text" value={workspace.workspaceName} onChange={(e) => setWorkspace({ ...workspace, workspaceName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workspace Domain</label>
                        <input type="text" value={workspace.workspaceDomain} onChange={(e) => setWorkspace({ ...workspace, workspaceDomain: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                      </div>
                      <ToggleSwitch enabled={workspace.allowGuests} onChange={(v) => setWorkspace({ ...workspace, allowGuests: v })}
                        label="Allow Guests" description="Allow external guests to join" />
                      <ToggleSwitch enabled={workspace.timeTracking} onChange={(v) => setWorkspace({ ...workspace, timeTracking: v })}
                        label="Time Tracking" description="Enable time tracking features" />
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* ADVANCED SECTION */}
              {activeSection === 'advanced' && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card3D className="p-6" depth={20}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                      <SettingsIcon className="w-5 h-5 text-gray-500" />
                      <span>Advanced Settings</span>
                    </h2>
                    <div className="space-y-4">
                      <ToggleSwitch enabled={advanced.experimentalFeatures} onChange={(v) => setAdvanced({ ...advanced, experimentalFeatures: v })}
                        label="Experimental Features" description="Try out beta features" warning="May be unstable" />
                      <ToggleSwitch enabled={advanced.developerMode} onChange={(v) => setAdvanced({ ...advanced, developerMode: v })}
                        label="Developer Mode" description="Enable developer tools" />
                      <ToggleSwitch enabled={advanced.performanceMonitoring} onChange={(v) => setAdvanced({ ...advanced, performanceMonitoring: v })}
                        label="Performance Monitoring" description="Track app performance" />
                      <ToggleSwitch enabled={advanced.offlineMode} onChange={(v) => setAdvanced({ ...advanced, offlineMode: v })}
                        label="Offline Mode" description="Work without internet connection" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logging Level</label>
                        <select value={advanced.loggingLevel} onChange={(e) => setAdvanced({ ...advanced, loggingLevel: e.target.value as any })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="debug">Debug</option><option value="info">Info</option>
                          <option value="warn">Warning</option><option value="error">Error</option>
                        </select>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SAVE BUTTON BAR */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-6 flex items-center justify-end space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {saveMessage && (
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saveMessage}</span>
                </motion.span>
              )}
              <button 
                onClick={handleSave}
                className="flex items-center space-x-3 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                disabled={isSaving}
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}