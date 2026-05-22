// src/pages/Reports.tsx - Reports & Export Page with Dark/Light Mode
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Icons
import {
  FileText, Download, Calendar, Filter, RefreshCw,
  BarChart3, PieChart, TrendingUp, Clock, CheckCircle2,
  Users, Target, Zap, ChevronDown, Eye, Printer, Share2,
  FileSpreadsheet, FileJson, FileType, Image, Plus,
  Loader2, AlertCircle, X, Search, Settings, Trash2,
  Edit3, Mail, MoreVertical, ArrowUpDown, ChevronLeft,
  ChevronRight, FolderOpen, Database, Server, Activity,
  Sun, Moon, Info as InfoIcon, Award, Flame, CalendarDays,
  BarChart, LineChart, PieChart as PieChartIcon, DownloadCloud
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

type ReportType = 'productivity' | 'tasks' | 'team' | 'time' | 'custom'
type ExportFormat = 'pdf' | 'csv' | 'excel' | 'json' | 'png'
type ScheduleFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom'
type Theme = 'light' | 'dark'

interface Report {
  id: string
  name: string
  description: string
  type: ReportType
  lastGenerated: string | null
  schedule: ScheduleFrequency | null
  format: ExportFormat
  createdAt: string
  updatedAt: string
  isActive: boolean
  createdBy: string
  tags: string[]
  size: string | null
  downloadCount: number
  lastDownloadedAt: string | null
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: ReportType
  icon: React.ReactNode
  defaultFormat: ExportFormat
  defaultSchedule: ScheduleFrequency
  isPopular: boolean
}

interface QuickStat {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bg: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface ExportOption {
  format: ExportFormat
  icon: React.ElementType
  color: string
  bg: string
  label: string
  description: string
}

interface DateRangeOption {
  value: string
  label: string
  days: number
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 90 days', days: 90 },
  { value: '1y', label: 'Last year', days: 365 },
  { value: 'custom', label: 'Custom range', days: 0 },
]

const EXPORT_OPTIONS: ExportOption[] = [
  { format: 'pdf', icon: FileType, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', label: 'PDF Document', description: 'Formatted report with charts and tables' },
  { format: 'csv', icon: FileSpreadsheet, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', label: 'CSV File', description: 'Plain text data, comma separated' },
  { format: 'excel', icon: FileSpreadsheet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Excel File', description: 'Microsoft Excel spreadsheet' },
  { format: 'json', icon: FileJson, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'JSON File', description: 'Raw structured data' },
  { format: 'png', icon: Image, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'PNG Images', description: 'Chart screenshots' },
]

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'prod-weekly', name: 'Weekly Productivity Report', description: 'Team productivity metrics, velocity, and efficiency trends', type: 'productivity', icon: <TrendingUp className="w-5 h-5" />, defaultFormat: 'pdf', defaultSchedule: 'weekly', isPopular: true },
  { id: 'tasks-summary', name: 'Task Completion Summary', description: 'Tasks completed, overdue, pending, and completion rates', type: 'tasks', icon: <CheckCircle2 className="w-5 h-5" />, defaultFormat: 'csv', defaultSchedule: 'daily', isPopular: true },
  { id: 'team-perf', name: 'Team Performance Overview', description: 'Individual and team KPIs, workload distribution', type: 'team', icon: <Users className="w-5 h-5" />, defaultFormat: 'excel', defaultSchedule: 'monthly', isPopular: false },
  { id: 'time-tracking', name: 'Time Tracking Analysis', description: 'Hours logged, billable vs non-billable, overtime', type: 'time', icon: <Clock className="w-5 h-5" />, defaultFormat: 'pdf', defaultSchedule: 'weekly', isPopular: true },
  { id: 'sprint-retro', name: 'Sprint Retrospective', description: 'Sprint analysis, velocity trends, improvement areas', type: 'custom', icon: <Zap className="w-5 h-5" />, defaultFormat: 'pdf', defaultSchedule: 'biweekly', isPopular: false },
  { id: 'resource-alloc', name: 'Resource Allocation', description: 'Team capacity, utilization rates, forecasts', type: 'custom', icon: <Target className="w-5 h-5" />, defaultFormat: 'excel', defaultSchedule: 'monthly', isPopular: false },
]

// Mock report data
const MOCK_REPORTS: Report[] = [
  { id: '1', name: 'Weekly Productivity Report', description: 'Team productivity metrics and trends', type: 'productivity', lastGenerated: '2026-05-20T10:30:00Z', schedule: 'weekly', format: 'pdf', createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-05-20T10:30:00Z', isActive: true, createdBy: 'Admin', tags: ['productivity', 'weekly'], size: '2.4 MB', downloadCount: 45, lastDownloadedAt: '2026-05-21T09:15:00Z' },
  { id: '2', name: 'Task Completion Summary', description: 'Tasks completed, overdue, and in progress', type: 'tasks', lastGenerated: '2026-05-19T08:00:00Z', schedule: 'daily', format: 'csv', createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-05-19T08:00:00Z', isActive: true, createdBy: 'Admin', tags: ['tasks', 'daily'], size: '856 KB', downloadCount: 128, lastDownloadedAt: '2026-05-20T14:30:00Z' },
  { id: '3', name: 'Team Performance Overview', description: 'Individual and team performance metrics', type: 'team', lastGenerated: '2026-05-18T12:00:00Z', schedule: 'monthly', format: 'excel', createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-05-18T12:00:00Z', isActive: true, createdBy: 'Manager', tags: ['team', 'monthly'], size: '3.1 MB', downloadCount: 23, lastDownloadedAt: '2026-05-19T11:00:00Z' },
  { id: '4', name: 'Time Tracking Analysis', description: 'Hours logged, billable vs non-billable', type: 'time', lastGenerated: '2026-05-17T09:45:00Z', schedule: 'weekly', format: 'pdf', createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-05-17T09:45:00Z', isActive: true, createdBy: 'Admin', tags: ['time', 'billing'], size: '1.8 MB', downloadCount: 67, lastDownloadedAt: '2026-05-18T16:20:00Z' },
  { id: '5', name: 'Sprint Retrospective', description: 'Custom sprint analysis and insights', type: 'custom', lastGenerated: '2026-05-15T14:00:00Z', schedule: 'biweekly', format: 'pdf', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-05-15T14:00:00Z', isActive: true, createdBy: 'Scrum Master', tags: ['sprint', 'agile'], size: '4.2 MB', downloadCount: 34, lastDownloadedAt: '2026-05-16T10:00:00Z' },
  { id: '6', name: 'Resource Allocation Report', description: 'Team capacity and utilization', type: 'custom', lastGenerated: null, schedule: 'monthly', format: 'excel', createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-03-10T00:00:00Z', isActive: false, createdBy: 'Admin', tags: ['resources', 'capacity'], size: null, downloadCount: 0, lastDownloadedAt: null },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Not generated'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return formatDate(dateString)
}

const getTypeIcon = (type: ReportType): React.ReactElement => {
  const icons: Record<ReportType, React.ElementType> = {
    productivity: TrendingUp,
    tasks: CheckCircle2,
    team: Users,
    time: Clock,
    custom: Zap,
  }
  const Icon = icons[type]
  return <Icon className="w-5 h-5" />
}

const getTypeColor = (type: ReportType): string => {
  const colors: Record<ReportType, string> = {
    productivity: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    tasks: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    team: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
    time: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30',
    custom: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30',
  }
  return colors[type]
}

const getScheduleLabel = (schedule: ScheduleFrequency | null): string => {
  if (!schedule) return 'Manual only'
  const labels: Record<ScheduleFrequency, string> = {
    daily: 'Daily',
    weekly: 'Weekly (Monday)',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    custom: 'Custom schedule',
  }
  return labels[schedule]
}

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"
    />
  </div>
)

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard: React.FC<{ stat: QuickStat }> = ({ stat }) => (
  <motion.div
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div className={`p-2.5 rounded-xl ${stat.bg}`}>
        <stat.icon className={`w-5 h-5 ${stat.color}`} />
      </div>
      {stat.trend && (
        <div className={`flex items-center space-x-1 text-xs font-medium ${stat.trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <span>{stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%</span>
        </div>
      )}
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
    </div>
  </motion.div>
)

// ============================================================================
// REPORT CARD COMPONENT
// ============================================================================

interface ReportCardProps {
  report: Report
  onGenerate: (id: string) => void
  onView: (id: string) => void
  onShare: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  isGenerating: boolean
  generatingId: string | null
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onGenerate,
  onView,
  onShare,
  onDelete,
  onEdit,
  isGenerating,
  generatingId,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const typeColorClass = getTypeColor(report.type)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-800 border rounded-xl hover:shadow-lg transition-all duration-200 ${
        report.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className={`p-2.5 rounded-xl ${typeColorClass} flex-shrink-0`}>
              {getTypeIcon(report.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{report.name}</h3>
                {!report.isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">Inactive</span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{report.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last: {formatRelativeTime(report.lastGenerated)}</span>
                </span>
                {report.schedule && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{getScheduleLabel(report.schedule)}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  {report.format === 'pdf' && <FileType className="w-3.5 h-3.5" />}
                  {report.format === 'csv' && <FileSpreadsheet className="w-3.5 h-3.5" />}
                  {report.format === 'excel' && <FileSpreadsheet className="w-3.5 h-3.5" />}
                  {report.format === 'json' && <FileJson className="w-3.5 h-3.5" />}
                  {report.format === 'png' && <Image className="w-3.5 h-3.5" />}
                  <span>{report.format.toUpperCase()}</span>
                </span>
                {report.size && (
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>{report.size}</span>
                  </span>
                )}
              </div>
              {report.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {report.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                  {report.tags.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                      +{report.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0 ml-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGenerate(report.id)}
              disabled={isGenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isGenerating && generatingId === report.id
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              {isGenerating && generatingId === report.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </>
              )}
            </motion.button>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 overflow-hidden"
                  >
                    <button
                      onClick={() => { onView(report.id); setShowMenu(false) }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button
                      onClick={() => { onEdit(report.id); setShowMenu(false) }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { onShare(report.id); setShowMenu(false) }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button
                      onClick={() => { onDelete(report.id); setShowMenu(false) }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Download stats bar */}
        {report.downloadCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              Downloaded {report.downloadCount} times
            </span>
            {report.lastDownloadedAt && (
              <span>Last download: {formatRelativeTime(report.lastDownloadedAt)}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// TEMPLATE CARD COMPONENT
// ============================================================================

interface TemplateCardProps {
  template: ReportTemplate
  onUseTemplate: (template: ReportTemplate) => void
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUseTemplate }) => {
  const getTemplateBg = (type: ReportType): string => {
    const bgs: Record<ReportType, string> = {
      productivity: 'bg-blue-50 dark:bg-blue-900/30',
      tasks: 'bg-green-50 dark:bg-green-900/30',
      team: 'bg-purple-50 dark:bg-purple-900/30',
      time: 'bg-orange-50 dark:bg-orange-900/30',
      custom: 'bg-indigo-50 dark:bg-indigo-900/30',
    }
    return bgs[type]
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onUseTemplate(template)}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${getTemplateBg(template.type)}`}>
          {template.icon}
        </div>
        {template.isPopular && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Popular</span>
        )}
      </div>
      <h4 className="font-medium text-gray-900 dark:text-white mt-3">{template.name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <FileType className="w-3 h-3" />
          {template.defaultFormat.toUpperCase()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getScheduleLabel(template.defaultSchedule)}
        </span>
      </div>
    </motion.div>
  )
}

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ 
  message, type, onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      {type === 'success' && <CheckCircle2 className="w-5 h-5" />}
      {type === 'error' && <AlertCircle className="w-5 h-5" />}
      {type === 'info' && <InfoIcon className="w-5 h-5" />}
      <span className="text-sm">{message}</span>
    </motion.div>
  )
}

// ============================================================================
// MAIN REPORTS COMPONENT
// ============================================================================

export default function Reports() {
  // State
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [modalState, setModalState] = useState<{ type: 'new' | 'delete' | 'share' | null; data?: any }>({ type: null })
  const [shareEmail, setShareEmail] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  // Load reports
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setReports(MOCK_REPORTS)
      setIsLoading(false)
    }
    loadReports()
  }, [])

  // Filtered reports
  const filteredReports = useMemo(() => {
    let filtered = [...reports]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType)
    }
    
    return filtered
  }, [reports, searchQuery, selectedType])

  // Quick stats
  const quickStats: QuickStat[] = useMemo(() => {
    const activeReports = reports.filter(r => r.isActive)
    const totalDownloads = reports.reduce((sum, r) => sum + r.downloadCount, 0)
    const scheduledReports = reports.filter(r => r.schedule && r.isActive).length
    
    return [
      { label: 'Reports Generated', value: reports.length, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: { value: 12, isPositive: true } },
      { label: 'Scheduled Reports', value: scheduledReports, icon: Clock, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
      { label: 'Total Downloads', value: totalDownloads, icon: Download, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: { value: 8, isPositive: true } },
      { label: 'Active Reports', value: activeReports.length, icon: Activity, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    ]
  }, [reports])

  // Handlers
  const handleGenerate = useCallback(async (reportId: string) => {
    setGeneratingId(reportId)
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, lastGenerated: new Date().toISOString(), downloadCount: r.downloadCount + 1 }
        : r
    ))
    
    setGeneratingId(null)
    setIsGenerating(false)
    setToast({ message: 'Report generated successfully!', type: 'success' })
  }, [])

  const handleDelete = useCallback((reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId))
    setModalState({ type: null })
    setToast({ message: 'Report deleted successfully', type: 'success' })
  }, [])

  const handleShare = useCallback(async () => {
    if (!shareEmail) {
      setToast({ message: 'Please enter an email address', type: 'error' })
      return
    }
    
    setIsSharing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSharing(false)
    setModalState({ type: null })
    setShareEmail('')
    setToast({ message: `Report shared to ${shareEmail}`, type: 'success' })
  }, [shareEmail])

  const handleUseTemplate = useCallback((template: ReportTemplate) => {
    const newReport: Report = {
      id: `new-${Date.now()}`,
      name: template.name,
      description: template.description,
      type: template.type,
      lastGenerated: null,
      schedule: template.defaultSchedule,
      format: template.defaultFormat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      createdBy: 'Current User',
      tags: [template.type, template.defaultSchedule],
      size: null,
      downloadCount: 0,
      lastDownloadedAt: null,
    }
    
    setReports(prev => [newReport, ...prev])
    setModalState({ type: null })
    setToast({ message: `Created "${template.name}" report`, type: 'success' })
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header with Dark Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Generate, schedule, and export comprehensive reports</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DATE_RANGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalState({ type: 'new' })}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'productivity', 'tasks', 'team', 'time', 'custom'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    selectedType === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              Your Reports
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({filteredReports.length})</span>
            </h2>
            <button 
              onClick={() => {
                setReports([...reports])
                setToast({ message: 'Reports refreshed', type: 'success' })
              }}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
          
          <AnimatePresence>
            {filteredReports.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No reports found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or create a new report</p>
                <button
                  onClick={() => setModalState({ type: 'new' })}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Create Report
                </button>
              </div>
            ) : (
              filteredReports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onGenerate={handleGenerate}
                  onView={(id) => showToast(`Viewing report ${id}`, 'info')}
                  onShare={(id) => setModalState({ type: 'share', data: { reportId: id } })}
                  onDelete={(id) => setModalState({ type: 'delete', data: { reportId: id, reportName: reports.find(r => r.id === id)?.name } })}
                  onEdit={(id) => showToast(`Edit report ${id}`, 'info')}
                  isGenerating={isGenerating}
                  generatingId={generatingId}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Templates Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              Report Templates
            </h2>
            <button 
              onClick={() => showToast('View all templates', 'info')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TEMPLATES.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        </div>

        {/* Quick Export Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Export</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Export your current dashboard data in various formats</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {EXPORT_OPTIONS.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => showToast(`Exporting as ${item.format.toUpperCase()}`, 'success')}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all text-center group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Analytics Preview Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Analytics Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Report Usage</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Most used: Task Completion Summary</span>
                    <span className="text-gray-700 dark:text-gray-300">128 downloads</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Second: Weekly Productivity</span>
                    <span className="text-gray-700 dark:text-gray-300">45 downloads</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Export Format Distribution</span>
                <PieChartIcon className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">PDF (35%)</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">CSV (28%)</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs">Excel (22%)</span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs">JSON (10%)</span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs">PNG (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {reports.length} total reports
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {reports.reduce((sum, r) => sum + r.downloadCount, 0)} total downloads
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Auto-refreshes every 5 minutes
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            Data up to {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* New Report Modal */}
        {modalState.type === 'new' && (
          <Modal isOpen={true} onClose={() => setModalState({ type: null })} title="Create New Report">
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose a template to get started:</p>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {REPORT_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleUseTemplate(template)}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {modalState.type === 'delete' && (
          <Modal isOpen={true} onClose={() => setModalState({ type: null })} title="Delete Report">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete "{modalState.data?.reportName}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setModalState({ type: null })}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(modalState.data?.reportId)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Share Modal */}
        {modalState.type === 'share' && (
          <Modal isOpen={true} onClose={() => setModalState({ type: null })} title="Share Report">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setModalState({ type: null })}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Share
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}