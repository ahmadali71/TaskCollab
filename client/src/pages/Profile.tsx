// src/pages/Profile.tsx - Comprehensive User Profile Page with Dark/Light Mode
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Calendar, Clock, Award,
  TrendingUp, CheckCircle2, Activity, Star, Zap,
  Edit, Camera, Settings, LogOut, ChevronRight,
  MessageSquare, FileText, Target, Briefcase,
  Heart, Share2, Download, Eye, EyeOff,
  X, Save, AlertCircle, ThumbsUp, Coffee,
  Globe, Link as LinkIcon, Moon, Sun, Bell,
  Shield, CreditCard, HelpCircle, Flag,
  Users, FolderKanban, BarChart3, Filter,
  MoreHorizontal, Copy, Printer, QrCode,
  Sparkles, Crown, Gift, Rocket, Compass
} from 'lucide-react'

// ============================================
// CUSTOM SVG ICONS (since lucide-react doesn't export some)
// ============================================
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

// ============================================
// TYPES
// ============================================
interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  location: string
  joinDate: string
  phone: string
  bio: string
  skills: string[]
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
    website?: string
  }
  stats: {
    tasksCompleted: number
    tasksInProgress: number
    projectsWorked: number
    commentsPosted: number
    productivity: number
    streak: number
    hoursLogged: number
    meetingsAttended: number
  }
  recentBadges: Badge[]
  recentActivity: Activity[]
  achievements: Achievement[]
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    emailDigest: boolean
    language: string
  }
}

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  dateEarned: string
  category: 'productivity' | 'collaboration' | 'innovation' | 'leadership'
}

interface Activity {
  id: string
  action: string
  task: string
  time: string
  timestamp: Date
  type: 'complete' | 'comment' | 'create' | 'review' | 'join'
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  target: number
  reward: string
  icon: string
}

// ============================================
// COMPONENTS
// ============================================
const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ 
  children, 
  className = '',
  onClick 
}) => (
  <motion.div 
    whileHover={{ y: onClick ? -2 : 0 }}
    onClick={onClick}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-xl' : ''} ${className}`}
  >
    {children}
  </motion.div>
)

const Badge: React.FC<{ icon: React.ReactNode; label: string; color?: string }> = ({ 
  icon, 
  label, 
  color = 'blue' 
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'
  }
  
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colorClasses[color]}`}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ 
  icon, 
  label, 
  value, 
  color 
}) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-center transition-all"
  >
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
      {icon}
    </div>
    <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </motion.div>
)

// ============================================
// EDIT PROFILE MODAL
// ============================================
const EditProfileModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  profile: UserProfile; 
  onSave: (updatedProfile: UserProfile) => void 
}> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState(profile)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSave(formData)
    setIsSaving(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 dark:bg-black/70"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" 
                />
              ) : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ============================================
// SETTINGS MODAL
// ============================================
const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  preferences: UserProfile['preferences'];
  onSave: (preferences: UserProfile['preferences']) => void;
}> = ({ isOpen, onClose, preferences, onSave }) => {
  const [settings, setSettings] = useState(preferences)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 dark:bg-black/70"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <div className="flex space-x-2">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, theme: theme as any })}
                    className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-colors ${
                      settings.theme === theme 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</label>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`w-10 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div
                  animate={{ x: settings.notifications ? 16 : 2 }}
                  className="w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Digest</label>
              <button
                onClick={() => setSettings({ ...settings, emailDigest: !settings.emailDigest })}
                className={`w-10 h-6 rounded-full transition-colors ${settings.emailDigest ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div
                  animate={{ x: settings.emailDigest ? 16 : 2 }}
                  className="w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </div>
          
          <div className="border-t dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              Cancel
            </button>
            <button onClick={() => { onSave(settings); onClose(); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ============================================
// MAIN PROFILE COMPONENT
// ============================================
export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [showFullActivity, setShowFullActivity] = useState(false)
  const [showFullBadges, setShowFullBadges] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    const loadProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProfile({
        id: 'user-123',
        name: 'Alice Johnson',
        email: 'alice@taskcollab.com',
        avatar: 'AJ',
        role: 'Lead Designer',
        department: 'Design',
        location: 'San Francisco, CA',
        joinDate: '2024-03-15',
        phone: '+1 (555) 123-4567',
        bio: 'Passionate designer focused on creating intuitive and beautiful user experiences. Love collaborating with cross-functional teams to bring ideas to life. 8+ years of experience in product design and user research.',
        skills: ['UI Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe XD', 'Sketch', 'HTML/CSS', 'React', 'TailwindCSS'],
        socialLinks: {
          github: 'https://github.com/alicejohnson',
          twitter: 'https://twitter.com/alicej',
          linkedin: 'https://linkedin.com/in/alicejohnson',
          website: 'https://alicejohnson.design'
        },
        stats: {
          tasksCompleted: 245,
          tasksInProgress: 3,
          projectsWorked: 12,
          commentsPosted: 156,
          productivity: 92,
          streak: 15,
          hoursLogged: 1240,
          meetingsAttended: 89
        },
        recentBadges: [
          { id: '1', name: 'Top Performer', icon: '🏆', description: 'Highest productivity for 3 months', dateEarned: '2024-02-01', category: 'productivity' },
          { id: '2', name: 'Early Bird', icon: '🌅', description: 'First to complete daily tasks', dateEarned: '2024-02-15', category: 'productivity' },
          { id: '3', name: 'Team Player', icon: '🤝', description: 'Collaborated on 50+ tasks', dateEarned: '2024-01-20', category: 'collaboration' },
          { id: '4', name: 'Innovation Hero', icon: '💡', description: 'Introduced new process improvements', dateEarned: '2024-02-28', category: 'innovation' },
          { id: '5', name: 'Mentor', icon: '🎓', description: 'Helped 10+ team members', dateEarned: '2024-03-01', category: 'leadership' }
        ],
        recentActivity: [
          { id: '1', action: 'Completed', task: 'Dashboard wireframes', time: '2 hours ago', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'complete' },
          { id: '2', action: 'Commented on', task: 'API documentation', time: '4 hours ago', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'comment' },
          { id: '3', action: 'Created', task: 'Design system update', time: 'Yesterday', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'create' },
          { id: '4', action: 'Reviewed', task: 'Mobile app designs', time: '2 days ago', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'review' },
          { id: '5', action: 'Joined', task: 'Design review meeting', time: '3 days ago', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'join' },
          { id: '6', action: 'Completed', task: 'User flow diagrams', time: '5 days ago', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), type: 'complete' }
        ],
        achievements: [
          { id: '1', title: 'Task Master', description: 'Complete 500 tasks', progress: 245, target: 500, reward: 'Expert Badge', icon: '⭐' },
          { id: '2', title: 'Perfect Streak', description: '30 day streak', progress: 15, target: 30, reward: 'Streak Master Badge', icon: '🔥' },
          { id: '3', title: 'Collaboration King', description: '100 comments', progress: 156, target: 100, reward: 'Community Champion', icon: '💬' }
        ],
        preferences: {
          theme: 'light',
          notifications: true,
          emailDigest: true,
          language: 'English'
        }
      })
      setIsLoading(false)
    }
    
    loadProfile()
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (profile && result) {
          const newAvatar = file.name.charAt(0).toUpperCase()
          setProfile({ ...profile, avatar: newAvatar })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
  }

  const handleSaveSettings = (preferences: UserProfile['preferences']) => {
    if (profile) {
      setProfile({ ...profile, preferences })
      // Apply theme change
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (preferences.theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else if (preferences.theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
  }

  const handleShareProfile = async () => {
    if (navigator.share && profile) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile`,
          text: `Check out ${profile.name}'s profile on TaskCollab`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else if (profile) {
      await navigator.clipboard.writeText(`${profile.name} - TaskCollab Profile`)
      alert('Profile info copied to clipboard!')
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    alert('Profile link copied!')
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400"
        />
      </div>
    )
  }

  const displayedActivity = showFullActivity ? profile.recentActivity : profile.recentActivity.slice(0, 4)
  const displayedBadges = showFullBadges ? profile.recentBadges : profile.recentBadges.slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Dark Mode Toggle Button */}
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
        {/* COVER & AVATAR SECTION */}
        <Card className="overflow-hidden p-0">
          <div className="relative h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="relative group -mt-12 inline-block">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-xl transition-transform group-hover:scale-105">
                {profile.avatar}
              </div>
              <button 
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all hover:scale-110"
              >
                <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{profile.role} • {profile.department}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge icon={<Star className="w-3 h-3" />} label="Pro Member" color="purple" />
                  <Badge icon={<CheckCircle2 className="w-3 h-3" />} label="Verified" color="green" />
                  <Badge icon={<Zap className="w-3 h-3" />} label={`${profile.stats.streak} day streak`} color="orange" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button 
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                  title="Copy Profile Link"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button 
                  onClick={handleShareProfile}
                  className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                  title="Share Profile"
                >
                  <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                  title="Edit Profile"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* About Section */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                About
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profile.bio}</p>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{profile.stats.hoursLogged} hours logged</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  {profile.socialLinks.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" 
                       className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover:scale-105">
                      <GithubIcon />
                    </a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover:scale-105">
                      <TwitterIcon />
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover:scale-105">
                      <LinkedinIcon />
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover:scale-105">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {/* Skills Section */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-4 h-4 mr-2 text-blue-500" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 font-medium cursor-pointer hover:shadow-md transition-all"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </Card>

            {/* Badges Section */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  Badges & Achievements
                </h3>
                {profile.recentBadges.length > 4 && (
                  <button
                    onClick={() => setShowFullBadges(!showFullBadges)}
                    className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center"
                  >
                    {showFullBadges ? 'Show Less' : `+${profile.recentBadges.length - 4} more`}
                    <ChevronRight className={`w-3 h-3 ml-0.5 transition-transform ${showFullBadges ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {displayedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{badge.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(badge.dateEarned).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                label="Tasks Done"
                value={profile.stats.tasksCompleted}
                color="bg-green-50 dark:bg-green-900/20"
              />
              <StatCard
                icon={<Activity className="w-5 h-5 text-blue-500" />}
                label="In Progress"
                value={profile.stats.tasksInProgress}
                color="bg-blue-50 dark:bg-blue-900/20"
              />
              <StatCard
                icon={<Briefcase className="w-5 h-5 text-purple-500" />}
                label="Projects"
                value={profile.stats.projectsWorked}
                color="bg-purple-50 dark:bg-purple-900/20"
              />
              <StatCard
                icon={<MessageSquare className="w-5 h-5 text-orange-500" />}
                label="Comments"
                value={profile.stats.commentsPosted}
                color="bg-orange-50 dark:bg-orange-900/20"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
                label="Productivity"
                value={`${profile.stats.productivity}%`}
                color="bg-indigo-50 dark:bg-indigo-900/20"
              />
              <StatCard
                icon={<Zap className="w-5 h-5 text-red-500" />}
                label="Streak"
                value={`${profile.stats.streak} days`}
                color="bg-red-50 dark:bg-red-900/20"
              />
              <StatCard
                icon={<Clock className="w-5 h-5 text-teal-500" />}
                label="Hours Logged"
                value={profile.stats.hoursLogged}
                color="bg-teal-50 dark:bg-teal-900/20"
              />
              <StatCard
                icon={<Calendar className="w-5 h-5 text-pink-500" />}
                label="Meetings"
                value={profile.stats.meetingsAttended}
                color="bg-pink-50 dark:bg-pink-900/20"
              />
            </div>

            {/* Achievements Progress */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-500" />
                Current Achievements
              </h3>
              <div className="space-y-4">
                {profile.achievements.map((achievement, index) => {
                  const percentage = Math.min((achievement.progress / achievement.target) * 100, 100)
                  const isCompleted = achievement.progress >= achievement.target
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{achievement.icon}</span>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">{achievement.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`absolute h-full rounded-full ${
                            isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                        />
                      </div>
                      {!isCompleted && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Reward: {achievement.reward}</p>
                      )}
                      {isCompleted && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed! Reward earned: {achievement.reward}
                        </p>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-blue-500" />
                  Recent Activity
                </h3>
                {profile.recentActivity.length > 4 && (
                  <button
                    onClick={() => setShowFullActivity(!showFullActivity)}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center"
                  >
                    {showFullActivity ? 'Show Less' : 'View All'}
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showFullActivity ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {displayedActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'complete' ? 'bg-green-500' :
                      activity.type === 'comment' ? 'bg-blue-500' :
                      activity.type === 'create' ? 'bg-purple-500' :
                      activity.type === 'review' ? 'bg-orange-500' :
                      'bg-pink-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {activity.action}
                        </span>{' '}
                        <span className="text-gray-900 dark:text-white">{activity.task}</span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                    </div>
                    {activity.type === 'complete' && <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    {activity.type === 'create' && <FileText className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <Card className="text-center hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Create Report</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generate weekly summary</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <Card className="text-center hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Set Goals</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Define your targets</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <Card className="text-center hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Invite Team</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Collaborate together</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.02 }}>
                <Card className="text-center hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View insights</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 text-center">
              <Sparkles className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">"The only way to do great work is to love what you do."</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">— Steve Jobs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleEditProfile}
      />
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        preferences={profile.preferences}
        onSave={handleSaveSettings}
      />
    </div>
  )
}