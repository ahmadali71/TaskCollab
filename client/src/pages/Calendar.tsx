// src/pages/Calendar.tsx - Ultra Comprehensive Calendar Page with Dark/Light Mode
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Plus, Search, Filter, X,
  Clock, User, Calendar as CalendarIcon, ListTodo, CheckCircle2,
  AlertTriangle, Star, MoreVertical, Tag, ArrowLeft, ArrowRight,
  Sun, Moon, Cloud, CloudRain, Zap, Download, Share2,
  Grid3X3, List, Maximize2, Minimize2, RefreshCw,
  ChevronDown, ChevronUp, Eye, EyeOff, Bell, Settings,
  TrendingUp, TrendingDown, Target, Award, Flame,
  Play, Pause, SkipForward, SkipBack, FastForward, Rewind,
  Copy, Trash2, Edit3, Link, MapPin, Video, Mic, MicOff,
  Volume2, VolumeX, Upload, Download as DownloadIcon, Printer,
  CalendarDays, CalendarRange, Clock3, AlarmClock, Ban,
  Check, Circle, CircleDot, Loader2, Sparkles, Crown,
  Info, Paperclip, FileText, Globe, Wifi, Battery, Signal,
  Thermometer, Wind, Droplet, Sunrise, Sunset, MoonIcon
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: { id: string; name: string; avatar: string; email?: string }
  labels: { id: string; name: string; color: string }[]
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  recurringEndDate?: string
  recurringDays?: number[]
  isAllDay: boolean
  location?: string
  meetingLink?: string
  attendees: { id: string; name: string; avatar: string; email: string; status: 'accepted' | 'declined' | 'pending' }[]
  reminder: number
  reminderUnit?: 'minutes' | 'hours' | 'days'
  attachments?: { id: string; name: string; url: string; size: number }[]
  notes?: string
  color?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  events: CalendarEvent[]
}

interface WeatherData {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'
  high: number
  low: number
  precipitation: number
  windSpeed: number
  humidity: number
  feelsLike: number
}

interface Timezone {
  id: string
  name: string
  offset: number
  abbreviation: string
}

interface ProductivityStats {
  eventsCompleted: number
  totalEvents: number
  completionRate: number
  mostProductiveDay: string
  averageTasksPerDay: number
  streak: number
  focusTime: number
}

interface Holiday {
  date: string
  name: string
  type: 'holiday' | 'observance'
  country: string
}

// ============================================
// UTILITIES
// ============================================
const formatDate = (date: Date, format: 'full' | 'short' | 'numeric' | 'day' = 'full'): string => {
  if (format === 'full') return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  if (format === 'short') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (format === 'day') return date.toLocaleDateString('en-US', { weekday: 'short' })
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

const generateRecurringEvents = (event: CalendarEvent): CalendarEvent[] => {
  if (!event.isRecurring || !event.recurringPattern) return [event]
  
  const recurringEvents: CalendarEvent[] = []
  const startDate = new Date(event.date)
  const endDate = event.recurringEndDate ? new Date(event.recurringEndDate) : new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
  
  let currentDate = new Date(startDate)
  let occurrences = 0
  const maxOccurrences = 52
  
  while (currentDate <= endDate && occurrences < maxOccurrences) {
    if (currentDate.toDateString() !== startDate.toDateString()) {
      recurringEvents.push({
        ...event,
        id: `${event.id}_${currentDate.toISOString()}`,
        date: currentDate.toISOString().split('T')[0],
      })
    }
    
    switch (event.recurringPattern) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14)
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        break
    }
    occurrences++
  }
  
  return recurringEvents
}

const getTimeGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ============================================
// 3D CARD COMPONENT
// ============================================
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
      className={`relative bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${glow ? 'hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}

// ============================================
// WEATHER WIDGET
// ============================================
const WeatherWidget: React.FC<{ date: Date; location?: string }> = ({ date, location = 'San Francisco' }) => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 72, condition: 'sunny', high: 78, low: 65, precipitation: 10, windSpeed: 8, humidity: 55, feelsLike: 71
  })
  
  const weatherIcons = {
    sunny: <Sun className="w-8 h-8 text-yellow-500" />,
    cloudy: <Cloud className="w-8 h-8 text-gray-500 dark:text-gray-400" />,
    rainy: <CloudRain className="w-8 h-8 text-blue-500" />,
    stormy: <Zap className="w-8 h-8 text-purple-500" />,
    snowy: <CloudRain className="w-8 h-8 text-cyan-500" />
  }
  
  return (
    <div className="flex flex-col space-y-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {weatherIcons[weather.condition]}
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{weather.temperature}°F</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Feels like {weather.feelsLike}°</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{location}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><Droplet className="w-3 h-3 mr-0.5" />{weather.humidity}%</span>
            <span className="flex items-center"><Wind className="w-3 h-3 mr-0.5" />{weather.windSpeed} mph</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">🌡️ H: {weather.high}°</span>
        <span className="text-gray-500 dark:text-gray-400">🌡️ L: {weather.low}°</span>
        <span className="text-blue-500">💧 {weather.precipitation}% rain</span>
      </div>
    </div>
  )
}

// ============================================
// PRODUCTIVITY DASHBOARD
// ============================================
const ProductivityDashboard: React.FC<{ stats: ProductivityStats }> = ({ stats }) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
      <div className="flex items-center justify-between">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Streak</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.streak} days</p>
    </div>
    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
      <div className="flex items-center justify-between">
        <Target className="w-5 h-5 text-blue-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Completion</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completionRate}%</p>
    </div>
    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
      <div className="flex items-center justify-between">
        <Award className="w-5 h-5 text-purple-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Focus Time</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.focusTime}h</p>
    </div>
    <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl">
      <div className="flex items-center justify-between">
        <TrendingUp className="w-5 h-5 text-yellow-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Avg/Day</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.averageTasksPerDay}</p>
    </div>
  </div>
)

// ============================================
// EVENT DOT COMPONENT
// ============================================
const EventDot: React.FC<{ event: CalendarEvent; onClick: (event: CalendarEvent) => void; compact?: boolean }> = ({ event, onClick, compact = false }) => {
  const priorityColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }

  const statusStyles: Record<string, string> = {
    done: 'line-through opacity-50 dark:opacity-40',
    cancelled: 'line-through opacity-30 dark:opacity-20',
    todo: '',
    in_progress: '',
    review: '',
  }

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onClick(event) }}
        className={`w-2 h-2 rounded-full ${priorityColors[event.priority]} ${statusStyles[event.status]}`}
      />
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => { e.stopPropagation(); onClick(event) }}
      className={`w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${statusStyles[event.status]}`}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[event.priority]}`} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{event.title}</p>
          {!event.isAllDay && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{event.startTime} - {event.endTime}</p>
          )}
        </div>
        {event.isRecurring && <RefreshCw className="w-3 h-3 text-gray-400 flex-shrink-0" />}
      </div>
    </motion.button>
  )
}

// ============================================
// EVENT MODAL (Enhanced)
// ============================================
const EventModal: React.FC<{
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
  onComplete: (eventId: string) => void
  onDuplicate?: (event: CalendarEvent) => void
}> = ({ event, isOpen, onClose, onEdit, onDelete, onComplete, onDuplicate }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attendees' | 'attachments' | 'notes'>('details')
  
  if (!event || !isOpen) return null

  const priorityConfig: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Critical', icon: <AlertTriangle className="w-3 h-3" /> },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'High', icon: <TrendingUp className="w-3 h-3" /> },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Medium', icon: <CircleDot className="w-3 h-3" /> },
    low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Low', icon: <Circle className="w-3 h-3" /> },
  }

  const statusConfig: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    todo: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'To Do', icon: <Circle className="w-3 h-3" /> },
    in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Progress', icon: <Loader2 className="w-3 h-3" /> },
    review: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Review', icon: <Eye className="w-3 h-3" /> },
    done: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Done', icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Cancelled', icon: <Ban className="w-3 h-3" /> },
  }

  const pc = priorityConfig[event.priority]
  const sc = statusConfig[event.status]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6 pb-0" style={{ backgroundColor: event.color || (document.documentElement.classList.contains('dark') ? '#1f2937' : 'white') }}>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl opacity-10" />
            <div className="flex items-start justify-between mb-4 relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${pc.bg} ${pc.text}`}>
                  {pc.icon} {pc.label}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${sc.bg} ${sc.text}`}>
                  {sc.icon} {sc.label}
                </span>
                {event.isRecurring && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium">
                    <RefreshCw className="w-3 h-3" /> {event.recurringPattern}
                  </span>
                )}
                {event.isAllDay && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium">
                    <CalendarDays className="w-3 h-3" /> All Day
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onDuplicate?.(event)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Duplicate">
                  <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <X className="w-4 h-4 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
            {event.description && <p className="text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>}
          </div>

          <div className="border-b dark:border-gray-700 px-6">
            <div className="flex gap-4 overflow-x-auto">
              {[
                { id: 'details', label: 'Details', icon: <Info className="w-4 h-4" /> },
                { id: 'attendees', label: `Attendees (${event.attendees.length})`, icon: <User className="w-4 h-4" /> },
                { id: 'attachments', label: `Files (${event.attachments?.length || 0})`, icon: <Paperclip className="w-4 h-4" /> },
                { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === 'details' && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <CalendarIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{formatDate(new Date(event.date))}</span>
                  </div>
                  {!event.isAllDay && (
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{event.startTime} - {event.endTime}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                        {event.assignee.avatar}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{event.assignee.name}</span>
                      {event.assignee.email && <span className="text-gray-400 text-xs">({event.assignee.email})</span>}
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{event.location}</span>
                    </div>
                  )}
                  {event.meetingLink && (
                    <div className="col-span-2 flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                        {event.meetingLink}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Bell className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{event.reminder} {event.reminderUnit || 'minutes'} before</span>
                  </div>
                </div>

                {event.labels.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Labels</h4>
                    <div className="flex flex-wrap gap-1">
                      {event.labels.map(label => (
                        <span key={label.id} className="px-2 py-1 text-xs rounded-full text-white shadow-sm" style={{ backgroundColor: label.color }}>
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'attendees' && (
              <div className="space-y-3">
                {event.attendees.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                        {att.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{att.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{att.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        att.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        att.status === 'declined' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {att.status === 'accepted' ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : 
                         att.status === 'declined' ? <X className="w-3 h-3 inline mr-1" /> :
                         <Clock className="w-3 h-3 inline mr-1" />}
                        {att.status}
                      </span>
                      {att.status === 'pending' && (
                        <div className="flex gap-1">
                          <button className="p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50">
                            <Check className="w-3 h-3" />
                          </button>
                          <button className="p-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                  + Add Attendee
                </button>
              </div>
            )}

            {activeTab === 'attachments' && (
              <div className="space-y-2">
                {event.attachments?.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <DownloadIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Upload File
                </button>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <textarea
                  defaultValue={event.notes}
                  placeholder="Add your notes here..."
                  className="w-full h-32 p-3 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4 border-t dark:border-gray-700 mt-4">
              {event.status !== 'done' && (
                <button onClick={() => { onComplete(event.id); onClose() }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Mark Complete
                </button>
              )}
              <button onClick={() => { onEdit(event); onClose() }}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md text-sm font-medium flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => { onDelete(event.id); onClose() }}
                className="px-5 py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// IMPORT/EXPORT MODAL
// ============================================
const ImportExportModal: React.FC<{ isOpen: boolean; onClose: () => void; onImport: (events: CalendarEvent[]) => void; events: CalendarEvent[] }> = ({ isOpen, onClose, onImport, events }) => {
  const [importData, setImportData] = useState('')
  const [format, setFormat] = useState<'json' | 'ical'>('json')
  
  const handleExport = () => {
    if (format === 'json') {
      const dataStr = JSON.stringify(events, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `calendar_export_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      let icalData = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TaskCollab//Calendar//EN\n'
      events.forEach(event => {
        icalData += 'BEGIN:VEVENT\n'
        icalData += `SUMMARY:${event.title}\n`
        icalData += `DESCRIPTION:${event.description}\n`
        icalData += `DTSTART:${event.date.replace(/-/g, '')}T${event.startTime.replace(/:/g, '')}00\n`
        icalData += `DTEND:${event.date.replace(/-/g, '')}T${event.endTime.replace(/:/g, '')}00\n`
        icalData += 'END:VEVENT\n'
      })
      icalData += 'END:VCALENDAR'
      
      const blob = new Blob([icalData], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `calendar_export_${new Date().toISOString().split('T')[0]}.ics`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
  
  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData)
      if (Array.isArray(parsed)) {
        onImport(parsed)
        onClose()
      }
    } catch (e) {
      alert('Invalid JSON format')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Import/Export Events</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                format === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setFormat('ical')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                format === 'ical' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              iCal
            </button>
          </div>
          <button onClick={handleExport} className="w-full py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
            <DownloadIcon className="w-4 h-4" /> Export Events ({format.toUpperCase()})
          </button>
          <div className="border-t dark:border-gray-700 pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Import from JSON</p>
            <textarea value={importData} onChange={e => setImportData(e.target.value)}
              placeholder='Paste JSON data here...'
              className="w-full h-32 p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-mono" />
            <button onClick={handleImport} className="w-full mt-2 py-2 border border-blue-500 text-blue-500 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Import
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// MINI CALENDAR
// ============================================
const MiniCalendar: React.FC<{
  currentDate: Date
  onDateSelect: (date: Date) => void
  selectedDate: Date
}> = ({ currentDate, onDateSelect, selectedDate }) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate))
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(viewDate)
  const today = new Date()
  const days = []

  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 py-1">{day}</div>
        ))}
        {days.map((date, i) => (
          <button
            key={i}
            onClick={() => date && onDateSelect(date)}
            className={`text-center text-xs p-1.5 rounded-lg transition-colors ${
              !date ? 'text-gray-300 dark:text-gray-600' :
              date.toDateString() === selectedDate.toDateString() ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm' :
              date.toDateString() === today.toDateString() ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold' :
              'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// STATS CARD
// ============================================
const StatsCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <motion.div whileHover={{ y: -5 }} className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-white/70">{icon}</div>
    </div>
  </motion.div>
)

// ============================================
// HOLIDAYS WIDGET
// ============================================
const HolidaysWidget: React.FC<{ date: Date }> = ({ date }) => {
  const holidays: Holiday[] = [
    { date: '2026-01-01', name: 'New Year\'s Day', type: 'holiday', country: 'US' },
    { date: '2026-07-04', name: 'Independence Day', type: 'holiday', country: 'US' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'holiday', country: 'US' },
  ]
  
  const monthHolidays = holidays.filter(h => h.date.startsWith(date.toISOString().slice(0, 7)))
  
  if (monthHolidays.length === 0) return null
  
  return (
    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">🎉 Holidays this month</p>
      {monthHolidays.map(holiday => (
        <p key={holiday.date} className="text-xs text-red-600 dark:text-red-300">{holiday.name} - {new Date(holiday.date).toLocaleDateString()}</p>
      ))}
    </div>
  )
}

// ============================================
// MAIN CALENDAR COMPONENT
// ============================================
export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showNewEventForm, setShowNewEventForm] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [currentTimezone, setCurrentTimezone] = useState<Timezone>({ id: 'local', name: 'Local Time', offset: 0, abbreviation: 'LOCAL' })
  const [showCompleted, setShowCompleted] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showWeekNumbers, setShowWeekNumbers] = useState(false)
  const [compactView, setCompactView] = useState(false)

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

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', date: selectedDate.toISOString().split('T')[0],
    startTime: '09:00', endTime: '10:00', priority: 'medium' as CalendarEvent['priority'],
    isAllDay: false, isRecurring: false, recurringPattern: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    location: '', meetingLink: ''
  })

  const [events, setEvents] = useState<CalendarEvent[]>([])

  // Productivity stats
  const productivityStats = useMemo<ProductivityStats>(() => {
    const completed = events.filter(e => e.status === 'done').length
    const total = events.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCompletedOnDate = events.some(e => e.status === 'done' && e.date === dateStr)
      if (hasCompletedOnDate) streak++
      else if (i > 0) break
    }
    
    const focusTime = events.filter(e => e.status === 'in_progress').length * 2
    
    return {
      eventsCompleted: completed,
      totalEvents: total,
      completionRate,
      mostProductiveDay: 'Wednesday',
      averageTasksPerDay: Math.round(total / 30) || 1,
      streak,
      focusTime
    }
  }, [events])

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        {
          id: '1', title: 'Sprint Planning', description: 'Plan sprint 12 tasks and assign team members',
          date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
          startTime: '09:00', endTime: '10:30',
          status: 'in_progress', priority: 'high',
          assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com' },
          labels: [{ id: 'l1', name: 'meeting', color: '#3b82f6' }, { id: 'l2', name: 'sprint', color: '#8b5cf6' }],
          isRecurring: true, recurringPattern: 'weekly',
          isAllDay: false, location: 'Conference Room A', meetingLink: 'https://meet.google.com/abc-defg-hij',
          attendees: [
            { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', status: 'accepted' },
            { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', status: 'accepted' },
            { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com', status: 'pending' },
          ],
          reminder: 15, reminderUnit: 'minutes',
          attachments: [{ id: 'a1', name: 'sprint_plan.pdf', url: '#', size: 245000 }],
          notes: 'Remember to discuss the new API endpoints',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '2', title: 'Dashboard Review', description: 'Review new dashboard design with stakeholders',
          date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
          startTime: '14:00', endTime: '15:00',
          status: 'todo', priority: 'critical',
          assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com' },
          labels: [{ id: 'l3', name: 'review', color: '#ec4899' }],
          isRecurring: false, isAllDay: false, location: 'Online',
          attendees: [
            { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', status: 'accepted' },
            { id: '5', name: 'Eve Wilson', avatar: 'EW', email: 'eve@example.com', status: 'accepted' },
          ],
          reminder: 30, reminderUnit: 'minutes',
          attachments: [], notes: '',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '3', title: 'Code Review', description: 'Review pull requests for API endpoints',
          date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
          startTime: '10:00', endTime: '11:30',
          status: 'todo', priority: 'medium',
          assignee: { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com' },
          labels: [{ id: 'l4', name: 'development', color: '#10b981' }],
          isRecurring: false, isAllDay: false,
          attendees: [
            { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', status: 'accepted' },
            { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com', status: 'declined' },
          ],
          reminder: 10, reminderUnit: 'minutes',
          attachments: [], notes: '',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '4', title: 'Team Standup', description: 'Daily team sync',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00', endTime: '09:15',
          status: 'done', priority: 'medium',
          assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com' },
          labels: [{ id: 'l1', name: 'meeting', color: '#3b82f6' }],
          isRecurring: true, recurringPattern: 'daily', isAllDay: false,
          attendees: [
            { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', status: 'accepted' },
            { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', status: 'accepted' },
            { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com', status: 'accepted' },
            { id: '4', name: 'Diana Prince', avatar: 'DP', email: 'diana@example.com', status: 'accepted' },
          ],
          reminder: 5, reminderUnit: 'minutes',
          attachments: [], notes: '',
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '5', title: 'Design Workshop', description: 'UX design workshop for new features',
          date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
          startTime: '13:00', endTime: '17:00',
          status: 'todo', priority: 'high',
          assignee: { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com' },
          labels: [{ id: 'l5', name: 'workshop', color: '#f59e0b' }, { id: 'l6', name: 'design', color: '#3b82f6' }],
          isRecurring: false, isAllDay: true, location: 'Design Lab',
          attendees: [
            { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', status: 'accepted' },
            { id: '4', name: 'Diana Prince', avatar: 'DP', email: 'diana@example.com', status: 'pending' },
          ],
          reminder: 60, reminderUnit: 'minutes',
          attachments: [], notes: '',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
          id: '6', title: 'Database Optimization', description: 'Review and optimize database queries',
          date: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
          startTime: '10:00', endTime: '16:00',
          status: 'todo', priority: 'high',
          assignee: { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com' },
          labels: [{ id: 'l4', name: 'development', color: '#10b981' }, { id: 'l7', name: 'performance', color: '#ef4444' }],
          isRecurring: false, isAllDay: false,
          attendees: [
            { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', status: 'accepted' },
            { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com', status: 'accepted' },
          ],
          reminder: 30, reminderUnit: 'minutes',
          attachments: [], notes: '',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => e.date === dateStr && (showCompleted || e.status !== 'done'))
  }

  // Get filtered events
  const getFilteredEvents = () => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || e.priority === filterPriority
      const matchesStatus = filterStatus === 'all' || e.status === filterStatus
      const matchesAssignee = filterAssignee === 'all' || e.assignee.id === filterAssignee
      return matchesSearch && matchesPriority && matchesStatus && matchesAssignee
    })
  }

  // Calendar navigation
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Generate month grid
  const generateMonthGrid = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const days: CalendarDay[] = []

    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i)
      days.push({
        date, isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: getEventsForDate(date),
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({
        date, isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: getEventsForDate(date),
      })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date, isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: getEventsForDate(date),
      })
    }

    return days
  }

  // Generate week grid
  const generateWeekGrid = (): CalendarDay[] => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const today = new Date()
    const days: CalendarDay[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      days.push({
        date, isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: getEventsForDate(date),
      })
    }

    return days
  }

  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleAddEvent = () => {
    const event: CalendarEvent = {
      id: Date.now().toString(),
      ...newEvent,
      status: 'todo',
      assignee: { id: '1', name: 'You', avatar: 'YO', email: 'you@example.com' },
      labels: [],
      isRecurring: newEvent.isRecurring,
      recurringPattern: newEvent.isRecurring ? newEvent.recurringPattern : undefined,
      attendees: [],
      reminder: 15,
      reminderUnit: 'minutes',
      attachments: [],
      notes: '',
      date: newEvent.date || selectedDate.toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    if (event.isRecurring) {
      const recurringEvents = generateRecurringEvents(event)
      setEvents([...recurringEvents, ...events])
    } else {
      setEvents([event, ...events])
    }
    
    setShowNewEventForm(false)
    setNewEvent({
      title: '', description: '', date: selectedDate.toISOString().split('T')[0],
      startTime: '09:00', endTime: '10:00', priority: 'medium', isAllDay: false,
      isRecurring: false, recurringPattern: 'weekly', location: '', meetingLink: ''
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
  }

  const handleCompleteEvent = (eventId: string) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, status: 'done' as const, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : e))
  }

  const handleEventMove = (eventId: string, newDate: string) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, date: newDate, updatedAt: new Date().toISOString() } : e))
  }

  const handleDuplicateEvent = (event: CalendarEvent) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'todo',
    }
    setEvents([newEvent, ...events])
  }

  const handleImportEvents = (importedEvents: CalendarEvent[]) => {
    setEvents([...importedEvents, ...events])
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const monthGrid = generateMonthGrid()
  const weekGrid = generateWeekGrid()
  const todayEvents = getEventsForDate(selectedDate)
  const uniqueAssignees = Array.from(new Map(events.map(e => [e.assignee.id, e.assignee])).values())
  const greeting = getTimeGreeting()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
            >
              <CalendarIcon className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Smart Calendar
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 dark:text-gray-400 mt-1">
                {greeting}, {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Compact View Toggle */}
            <button
              onClick={() => setCompactView(!compactView)}
              className={`p-2 rounded-lg border transition-colors ${
                compactView 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
              title={compactView ? "Normal view" : "Compact view"}
            >
              {compactView ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
            </button>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
              {[
                { value: 'month' as const, label: 'Month', icon: Grid3X3 },
                { value: 'week' as const, label: 'Week', icon: List },
                { value: 'day' as const, label: 'Day', icon: CalendarIcon },
                { value: 'agenda' as const, label: 'Agenda', icon: CalendarDays },
              ].map(v => (
                <button key={v.value} onClick={() => setViewMode(v.value)}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === v.value ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                  <v.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <button onClick={() => viewMode === 'month' ? navigateMonth(-1) : viewMode === 'week' ? navigateWeek(-1) : navigateDay(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"><ChevronLeft className="w-5 h-5 dark:text-gray-400" /></button>
              <button onClick={goToToday} className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 border-x dark:border-gray-700 transition-colors dark:text-gray-300">Today</button>
              <button onClick={() => viewMode === 'month' ? navigateMonth(1) : viewMode === 'week' ? navigateWeek(1) : navigateDay(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"><ChevronRight className="w-5 h-5 dark:text-gray-400" /></button>
            </div>

            {/* Action Buttons */}
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              {showSidebar ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <button onClick={() => setShowImportExport(true)} className="p-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <DownloadIcon className="w-5 h-5" />
            </button>
            
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewEventForm(!showNewEventForm)}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition-all duration-200">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Event</span>
            </motion.button>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Total Events" value={productivityStats.totalEvents} icon={<ListTodo className="w-6 h-6" />} color="from-blue-500 to-blue-600" />
          <StatsCard title="Completed" value={productivityStats.eventsCompleted} icon={<CheckCircle2 className="w-6 h-6" />} color="from-green-500 to-green-600" />
          <StatsCard title="Completion Rate" value={productivityStats.completionRate} icon={<Target className="w-6 h-6" />} color="from-purple-500 to-purple-600" />
          <StatsCard title="Current Streak" value={productivityStats.streak} icon={<Flame className="w-6 h-6" />} color="from-orange-500 to-red-500" />
        </div>

        <div className={`grid ${showSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'} gap-6 transition-all duration-300`}>
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                {/* Mini Calendar */}
                <Card3D className="p-4" depth={15}>
                  <MiniCalendar currentDate={currentDate} onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                  <HolidaysWidget date={currentDate} />
                </Card3D>

                {/* Weather Widget */}
                <Card3D className="p-4" depth={15}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center"><Cloud className="w-4 h-4 mr-2 text-blue-500" />Weather</h3>
                  <WeatherWidget date={selectedDate} />
                </Card3D>

                {/* Productivity Dashboard */}
                <Card3D className="p-4" depth={15}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center"><Award className="w-4 h-4 mr-2 text-yellow-500" />Productivity</h3>
                  <ProductivityDashboard stats={productivityStats} />
                </Card3D>

                {/* Filters */}
                <Card3D className="p-4" depth={15}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center"><Filter className="w-4 h-4 mr-2 text-blue-500" />Filters</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Search events..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="all">All Priorities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="all">All Statuses</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="all">All Assignees</option>
                      {uniqueAssignees.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)}
                        className="rounded text-blue-500 focus:ring-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">Show completed events</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={showWeekNumbers} onChange={(e) => setShowWeekNumbers(e.target.checked)}
                        className="rounded text-blue-500 focus:ring-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">Show week numbers</span>
                    </label>
                  </div>
                </Card3D>

                {/* Selected Day Events */}
                <Card3D className="p-4" depth={15}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {selectedDate.toDateString() === new Date().toDateString() ? 'Today\'s Schedule' : formatDate(selectedDate, 'full')}
                  </h3>
                  {todayEvents.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                        <CalendarIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No events scheduled</p>
                      <button onClick={() => setShowNewEventForm(true)} className="mt-2 text-xs text-blue-500 hover:underline">
                        + Create event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[400px] overflow-y-auto">
                      {todayEvents.map(event => (
                        <EventDot key={event.id} event={event} onClick={handleEventClick} />
                      ))}
                    </div>
                  )}
                </Card3D>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Calendar */}
          <div className={showSidebar ? 'lg:col-span-3' : 'col-span-1'}>
            {/* New Event Form */}
            <AnimatePresence>
              {showNewEventForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden">
                  <Card3D className="p-6" depth={20} glow>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-blue-500" />Create New Event</h3>
                      <button onClick={() => setShowNewEventForm(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5 dark:text-gray-400" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="Event title *" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Description" rows={2} className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <select value={newEvent.priority} onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as CalendarEvent['priority'] })}
                          className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none">
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="critical">Critical Priority</option>
                        </select>
                      </div>
                      {!newEvent.isAllDay && (
                        <>
                          <div>
                            <input type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                          <div>
                            <input type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                        </>
                      )}
                      <div>
                        <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Location" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <input type="text" value={newEvent.meetingLink} onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                          placeholder="Meeting Link" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <label className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={newEvent.isAllDay} onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                          className="rounded text-blue-500 focus:ring-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">All day event</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={newEvent.isRecurring} onChange={(e) => setNewEvent({ ...newEvent, isRecurring: e.target.checked })}
                          className="rounded text-blue-500 focus:ring-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">Recurring event</span>
                      </label>
                      {newEvent.isRecurring && (
                        <select value={newEvent.recurringPattern} onChange={(e) => setNewEvent({ ...newEvent, recurringPattern: e.target.value as any })}
                          className="px-3 py-1.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      )}
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button onClick={handleAddEvent} disabled={!newEvent.title.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md disabled:opacity-50 transition-all">
                        Create Event
                      </button>
                      <button onClick={() => setShowNewEventForm(false)} className="px-6 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-300">
                        Cancel
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Calendar Grid */}
            <Card3D className="overflow-hidden" depth={25}>
              {viewMode === 'month' && (
                <>
                  <div className="grid grid-cols-7 border-b dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                    {dayNames.map(day => (
                      <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 border-r dark:border-gray-700 last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {monthGrid.map((day, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                        onClick={() => setSelectedDate(day.date)}
                        className={`min-h-[100px] p-2 border-b border-r dark:border-gray-700 cursor-pointer transition-colors ${
                          !day.isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''
                        } ${day.isToday ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''} ${
                          day.date.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/20 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <span className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 ${
                          !day.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' :
                          day.isToday ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm' :
                          'text-gray-700 dark:text-gray-300'
                        }`}>
                          {day.date.getDate()}
                        </span>
                        <div className="mt-1 space-y-0.5 overflow-hidden">
                          {day.events.slice(0, compactView ? 1 : 3).map(event => (
                            <EventDot key={event.id} event={event} onClick={handleEventClick} />
                          ))}
                          {day.events.length > (compactView ? 1 : 3) && (
                            <p className="text-xs text-blue-500 pl-2 font-medium">+{day.events.length - (compactView ? 1 : 3)} more</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {viewMode === 'week' && (
                <div className="divide-y dark:divide-gray-700">
                  <div className="grid grid-cols-8 border-b dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <div className="p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 border-r dark:border-gray-700">Time</div>
                    {weekGrid.map((day, i) => (
                      <div key={i} className={`p-3 text-center text-sm font-medium border-r dark:border-gray-700 last:border-r-0 ${
                        day.isToday ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        <p>{dayNames[day.date.getDay()]}</p>
                        <p className={`text-lg font-bold ${day.isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>{day.date.getDate()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                      <div key={hour} className="grid grid-cols-8 border-b dark:border-gray-700 min-h-[60px] hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="p-2 text-xs text-gray-400 dark:text-gray-500 border-r dark:border-gray-700 text-right pr-3 font-mono">
                          {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </div>
                        {weekGrid.map((day, di) => {
                          const hourEvents = day.events.filter(e => {
                            if (e.isAllDay) return false
                            const startHour = parseInt(e.startTime.split(':')[0])
                            return startHour === hour
                          })
                          return (
                            <div key={di} className="p-1 border-r dark:border-gray-700 last:border-r-0 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 cursor-pointer transition-colors min-h-[60px]"
                              onClick={() => setSelectedDate(day.date)}>
                              {hourEvents.map(event => (
                                <div key={event.id} onClick={(e) => { e.stopPropagation(); handleEventClick(event) }}
                                  className={`px-2 py-1 rounded text-xs mb-1 cursor-pointer truncate shadow-sm ${
                                    event.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-l-2 border-red-500' :
                                    event.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-l-2 border-orange-500' :
                                    event.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-l-2 border-yellow-500' :
                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-2 border-blue-500'
                                  }`}>
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewMode === 'day' && (
                <div className="max-h-[600px] overflow-y-auto">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b dark:border-gray-700 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dayNames[selectedDate.getDay()]}, {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                    </p>
                    {selectedDate.toDateString() === new Date().toDateString() && (
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full shadow-sm">Today</span>
                    )}
                  </div>
                  {todayEvents.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 dark:text-gray-400">
                      <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                        <CalendarIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No events scheduled</p>
                      <p className="text-sm mt-1">Click the "Add Event" button to create one</p>
                    </div>
                  ) : (
                    <div className="divide-y dark:divide-gray-700">
                      {todayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(event => (
                        <motion.div key={event.id} whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                          className="p-5 cursor-pointer transition-colors dark:hover:bg-gray-800/50" onClick={() => handleEventClick(event)}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  event.priority === 'critical' ? 'bg-red-500' :
                                  event.priority === 'high' ? 'bg-orange-500' :
                                  event.priority === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`} />
                                <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                                {event.isRecurring && <RefreshCw className="w-3 h-3 text-gray-400" />}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-3">
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}</span>
                                {event.location && <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{event.location}</span>}
                                {event.meetingLink && <span className="flex items-center"><Video className="w-3 h-3 mr-1" />Video Call</span>}
                              </p>
                              {event.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{event.description}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                event.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                event.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                event.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              }`}>{event.priority}</span>
                              {event.status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'agenda' && (
                <div className="divide-y dark:divide-gray-700">
                  {getFilteredEvents()
                    .filter(e => new Date(e.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 50)
                    .map(event => (
                      <motion.div key={event.id} whileHover={{ backgroundColor: '#f9fafb' }}
                        className="p-4 cursor-pointer dark:hover:bg-gray-800/50" onClick={() => handleEventClick(event)}>
                        <div className="flex items-start gap-4">
                          <div className="min-w-[80px]">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{!event.isAllDay && event.startTime}</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                              <div className={`w-2 h-2 rounded-full ${
                                event.priority === 'critical' ? 'bg-red-500' :
                                event.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                              }`} />
                            </div>
                            {event.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>}
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-medium">
                              {event.assignee.avatar}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  {getFilteredEvents().filter(e => new Date(e.date) >= new Date()).length === 0 && (
                    <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                      <p>No upcoming events found</p>
                    </div>
                  )}
                </div>
              )}
            </Card3D>

            {/* Upcoming Events List */}
            <Card3D className="p-6 mt-6" depth={15}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Upcoming Events
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{getFilteredEvents().filter(e => new Date(e.date) >= new Date()).length} events</span>
              </div>
              <div className="space-y-2">
                {getFilteredEvents().filter(e => new Date(e.date) >= new Date()).slice(0, 5).length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <p>No upcoming events</p>
                  </div>
                ) : (
                  getFilteredEvents().filter(e => new Date(e.date) >= new Date()).slice(0, 5).map(event => (
                    <motion.div key={event.id} whileHover={{ x: 5, backgroundColor: '#f9fafb' }}
                      className="flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all dark:hover:bg-gray-800/50"
                      onClick={() => handleEventClick(event)}>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                        <span className="text-xl">{new Date(event.date).getDate()}</span>
                        <span className="text-[10px] opacity-80">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{event.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {!event.isAllDay && ` • ${event.startTime}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        event.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        event.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                        event.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>{event.priority}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </Card3D>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onEdit={(e) => console.log('Edit', e)}
        onDelete={handleDeleteEvent}
        onComplete={handleCompleteEvent}
        onDuplicate={handleDuplicateEvent}
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        onImport={handleImportEvents}
        events={events}
      />
    </div>
  )
}