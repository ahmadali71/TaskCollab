// src/App.tsx - Improved with Dark Mode and Enhanced Features
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState, useCallback, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from './stores/auth-store'
import toast, { Toaster } from 'react-hot-toast'
import {
  LayoutDashboard, ListTodo, Calendar, BarChart3, Users,
  Menu, X, Plus, Bell, Search, Star,
  FolderKanban, Clock, Activity, FileText, HelpCircle,
  Puzzle, TrendingUp, User, Settings, LogOut, Shield,
  Gift, GitBranch, Key, CheckSquare,
  Briefcase, Target, Award, Zap, Sparkles, Globe,
  Moon, Sun, ChevronLeft, ChevronRight, Home, Tag, Archive, 
  TrashIcon, ImportIcon, DownloadIcon, Info, Loader2,
  MessageSquare, Coffee, Brain, Rocket, Trophy, Medal,
  Crown, Wand2, Palette, Music, Cloud, Wifi,
  Database, Cpu, Monitor, Headphones
} from 'lucide-react'

// Import 3D styles
import './styles/3d.css'

// ============================================
// ERROR BOUNDARY COMPONENT
// ============================================
class ErrorBoundary extends Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    toast.error(error.message || 'Something went wrong');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// LAZY LOAD ALL PAGES
// ============================================

// Auth Pages
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Landing = lazy(() => import('./pages/Landing'))

// Main Pages (Protected)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks = lazy(() => import('./pages/Tasks'))
const TaskDetail = lazy(() => import('./pages/TaskDetail'))
const CalendarPage = lazy(() => import('./pages/Calendar'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Team = lazy(() => import('./pages/Team'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))
const Projects = lazy(() => import('./pages/Projects'))
const Kanban = lazy(() => import('./pages/Kanban'))
const TimeTracking = lazy(() => import('./pages/TimeTracking'))
const Notifications = lazy(() => import('./pages/Notifications'))
const SearchPage = lazy(() => import('./pages/Search'))
const Reports = lazy(() => import('./pages/Reports'))
const ActivityPage = lazy(() => import('./pages/Activity'))
const Integrations = lazy(() => import('./pages/Integrations'))
const Help = lazy(() => import('./pages/Help'))
const Changelog = lazy(() => import('./pages/Changelog'))
const AccessibilityPage = lazy(() => import('./pages/Accessibility'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Goals = lazy(() => import('./pages/Goals'))
const Milestones = lazy(() => import('./pages/Milestones'))
const Templates = lazy(() => import('./pages/Templates'))
const Tags = lazy(() => import('./pages/Tags'))
const Archived = lazy(() => import('./pages/Archived'))
const Trash = lazy(() => import('./pages/Trash'))
const ExportPage = lazy(() => import('./pages/Export'))
const ImportPage = lazy(() => import('./pages/Import'))
const Shortcuts = lazy(() => import('./pages/Shortcuts'))
const About = lazy(() => import('./pages/About'))

// ============================================
// LOADING FALLBACK
// ============================================
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      </motion.div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
)

// ============================================
// DARK MODE TOGGLE BUTTON
// ============================================
const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: isDark ? 180 : 0 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
    </motion.button>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const { isAuthenticated, user, isLoading, logout, checkAuth } = useAuthStore()
  const location = useLocation()

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    toast.success('Logged out successfully')
  }, [logout])

  // Navigation items with icons
  const mainNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, color: 'text-green-500' },
    { name: 'Kanban', href: '/kanban', icon: FolderKanban, color: 'text-purple-500' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, color: 'text-pink-500' },
    { name: 'Projects', href: '/projects', icon: Briefcase, color: 'text-orange-500' },
    { name: 'Goals', href: '/goals', icon: Target, color: 'text-red-500' },
    { name: 'Milestones', href: '/milestones', icon: Trophy, color: 'text-yellow-500' },
  ]

  const teamNavigation = [
    { name: 'Team', href: '/team', icon: Users, color: 'text-indigo-500' },
    { name: 'Time Tracking', href: '/time-tracking', icon: Clock, color: 'text-teal-500' },
    { name: 'Activity', href: '/activity', icon: Activity, color: 'text-cyan-500' },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp, color: 'text-violet-500' },
    { name: 'Reports', href: '/reports', icon: BarChart3, color: 'text-rose-500' },
  ]

  const workspaceNavigation = [
    { name: 'Templates', href: '/templates', icon: FileText, color: 'text-gray-500' },
    { name: 'Tags', href: '/tags', icon: Tag, color: 'text-gray-500' },
    { name: 'Archived', href: '/archived', icon: Archive, color: 'text-gray-500' },
    { name: 'Trash', href: '/trash', icon: TrashIcon, color: 'text-gray-500' },
  ]

  const moreNavigation = [
    { name: 'Notifications', href: '/notifications', icon: Bell, color: 'text-red-500' },
    { name: 'Search', href: '/search', icon: Search, color: 'text-blue-500' },
    { name: 'Integrations', href: '/integrations', icon: Puzzle, color: 'text-purple-500' },
    { name: 'Import', href: '/import', icon: ImportIcon, color: 'text-green-500' },
    { name: 'Export', href: '/export', icon: DownloadIcon, color: 'text-orange-500' },
  ]

  const accountNavigation = [
    { name: 'Profile', href: '/profile', icon: User, color: 'text-blue-500' },
    { name: 'Settings', href: '/settings', icon: Settings, color: 'text-gray-500' },
    { name: 'Shortcuts', href: '/shortcuts', icon: Key, color: 'text-yellow-500' },
    { name: 'Help', href: '/help', icon: HelpCircle, color: 'text-green-500' },
    { name: 'About', href: '/about', icon: Info, color: 'text-purple-500' },
  ]

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoader />
  }

  // If not authenticated, show auth pages only
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/welcome" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    )
  }

  // If authenticated, show main app with sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
      
      {/* Global Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks, projects, or team members... (Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-500">ESC</kbd>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                {searchQuery && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Search results for "{searchQuery}" will appear here
                  </div>
                )}
                {!searchQuery && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Type something to search...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <SidebarContent 
                mainNav={mainNavigation}
                teamNav={teamNavigation}
                workspaceNav={workspaceNavigation}
                moreNav={moreNavigation}
                accountNav={accountNavigation}
                sidebarCollapsed={false}
                onLogout={handleLogout}
                user={user}
                onClose={() => setSidebarOpen(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 z-40
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex flex-col flex-grow bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-xl">
          <SidebarContent 
            mainNav={mainNavigation}
            teamNav={teamNavigation}
            workspaceNav={workspaceNavigation}
            moreNav={moreNavigation}
            accountNav={accountNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onLogout={handleLogout}
            user={user}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg' 
            : 'bg-white dark:bg-gray-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)} 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
              
              {/* Breadcrumb */}
              <div className="hidden lg:flex items-center space-x-2 text-sm">
                <Link to="/" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Home className="w-4 h-4" />
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-600 dark:text-gray-400 capitalize font-medium">
                  {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).split('/')[0] || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Logo for mobile */}
            <Link to="/" className="flex items-center space-x-2 lg:hidden">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg"
              >
                <ListTodo className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskCollab
              </span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Search button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Search...</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-800 rounded text-gray-500">Ctrl+K</kbd>
              </motion.button>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Notifications */}
              <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
                />
              </Link>

              {/* User menu */}
              <div className="flex items-center space-x-2 ml-2 cursor-pointer group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md"
                >
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </motion.div>
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content with Error Boundary */}
        <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <ErrorBoundary>
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/milestones" element={<Milestones />} />
                
                {/* Team Pages */}
                <Route path="/team" element={<Team />} />
                <Route path="/time-tracking" element={<TimeTracking />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
                
                {/* Workspace Pages */}
                <Route path="/templates" element={<Templates />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/archived" element={<Archived />} />
                <Route path="/trash" element={<Trash />} />
                
                {/* More Pages */}
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/export" element={<ExportPage />} />
                
                {/* Account Pages */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/shortcuts" element={<Shortcuts />} />
                <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} />
                
                {/* Info Pages */}
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

// ============================================
// SIDEBAR CONTENT COMPONENT
// ============================================

interface SidebarContentProps {
  mainNav: any[]
  teamNav: any[]
  workspaceNav: any[]
  moreNav: any[]
  accountNav: any[]
  sidebarCollapsed: boolean
  onLogout: () => void
  user: { name: string; email: string } | null
  onClose?: () => void
}

function SidebarContent({ 
  mainNav, 
  teamNav, 
  workspaceNav,
  moreNav,
  accountNav,
  sidebarCollapsed, 
  onClose,
  onLogout,
  user
}: SidebarContentProps) {
  const location = useLocation()

  const handleClick = () => {
    if (onClose) onClose()
  }

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: any }) => (
    <motion.div
      whileHover={{ x: sidebarCollapsed ? 0 : 8 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={item.href}
        onClick={handleClick}
        className={`flex items-center transition-all duration-200 rounded-xl group ${
          sidebarCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2.5 space-x-3'
        } ${
          isActive(item.href) 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
      >
        <item.icon className={`flex-shrink-0 ${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive(item.href) ? item.color : ''}`} />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-sm">{item.name}</span>
            {isActive(item.href) && (
              <motion.div
                layoutId="active-indicator"
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
            )}
          </>
        )}
      </Link>
    </motion.div>
  )

  const NavSection = ({ title, items }: { title: string; items: any[] }) => (
    <div className="mt-6 first:mt-0">
      {!sidebarCollapsed && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"
        >
          {title}
        </motion.p>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Logo */}
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-gray-200 dark:border-gray-700`}>
        {!sidebarCollapsed ? (
          <>
            <Link to="/" className="flex items-center space-x-2" onClick={handleClick}>
              <motion.div 
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg"
              >
                <ListTodo className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                TaskCollab
              </motion.span>
            </Link>
            {onClose && (
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden">
                <X className="w-5 h-5" />
              </button>
            )}
          </>
        ) : (
          <Link to="/" onClick={handleClick}>
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg"
            >
              <ListTodo className="w-5 h-5 text-white" />
            </motion.div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <NavSection title="MAIN" items={mainNav} />
        <NavSection title="TEAM" items={teamNav} />
        <NavSection title="WORKSPACE" items={workspaceNav} />
        <NavSection title="MORE" items={moreNav} />
        <NavSection title="ACCOUNT" items={accountNav} />
      </nav>

      {/* New Task Button */}
      <div className={`p-3 border-t border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        <Link
          to="/tasks/new"
          onClick={handleClick}
          className={`flex items-center justify-center transition-all rounded-xl font-medium shadow-lg hover:shadow-xl
            bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600
            ${sidebarCollapsed ? 'w-10 h-10 p-2' : 'w-full px-4 py-2.5 space-x-2'}`}
          title={sidebarCollapsed ? 'New Task' : ''}
        >
          <Plus className="w-5 h-5" />
          {!sidebarCollapsed && <span>New Task</span>}
        </Link>
      </div>

      {/* User Profile Section */}
      {!sidebarCollapsed && user && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className={`p-3 border-t border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onLogout}
          className={`flex items-center justify-center transition-all rounded-xl font-medium
            bg-red-500 text-white hover:bg-red-600
            ${sidebarCollapsed ? 'w-10 h-10 p-2' : 'w-full px-4 py-2.5 space-x-2'}`}
          title={sidebarCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Version Footer */}
      {!sidebarCollapsed && (
        <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">Version 2.1.0</p>
        </div>
      )}
    </>
  )
}