// src/pages/Export.tsx - Comprehensive Data Export Page
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, FileJson, FileSpreadsheet, FileText, File, 
  CheckCircle2, Database, Calendar, Filter, Settings,
  ArrowRight, Shield, Clock, HardDrive, X, AlertCircle,
  Loader2, CalendarDays, Users, Tag, Activity, BarChart,
  FileArchive, Send, Mail, Bell, Lock, Eye, EyeOff,
  ChevronDown, ChevronUp, Plus, Trash2, Copy, Save,
  Server, Cloud, Wifi, Zap, Award, Sparkles, Heart,
  Moon, Sun, Monitor, Printer, Share2, Upload,
  History, Bookmark, Star, Flag, Briefcase, Home
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface ExportFormat {
  id: string
  name: string
  icon: React.ElementType
  description: string
  extension: string
  color: string
  mimeType: string
  features: string[]
  limitations?: string[]
}

interface ExportJob {
  id: string
  format: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  fileSize?: number
  downloadUrl?: string
  filters: ExportFilters
}

interface ExportFilters {
  dateRange: 'all' | 'last30' | 'last90' | 'last365' | 'custom'
  customStartDate?: string
  customEndDate?: string
  includeArchived: boolean
  includeCompleted: boolean
  entities: {
    tasks: boolean
    projects: boolean
    goals: boolean
    calendar: boolean
    users: boolean
  }
  dataTypes: {
    metadata: boolean
    comments: boolean
    attachments: boolean
    history: boolean
  }
}

interface ExportStats {
  tasksCount: number
  projectsCount: number
  goalsCount: number
  calendarEventsCount: number
  totalAttachments: number
  estimatedSize: string
}

// ============================================
// COMPONENTS
// ============================================
const FormatCard: React.FC<{
  format: ExportFormat
  isSelected: boolean
  onSelect: () => void
}> = ({ format, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center transition-all ${
          isSelected 
            ? 'from-blue-500 to-blue-600 shadow-lg' 
            : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'
        }`}>
          <format.icon className={`w-7 h-7 ${isSelected ? 'text-white' : format.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{format.name}</h3>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format.description}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">{format.extension}</p>
        </div>
      </div>
      
      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-3 right-3 text-xs text-blue-500"
          >
            Click to select
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const ExportHistoryItem: React.FC<{ job: ExportJob; onDownload: (job: ExportJob) => void }> = ({ job, onDownload }) => {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'pending': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (job.status) {
      case 'pending': return 'Pending'
      case 'processing': return 'Processing...'
      case 'completed': return 'Completed'
      case 'failed': return 'Failed'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            Export as {job.format.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(job.createdAt).toLocaleString()}
            {job.completedAt && ` • Completed ${new Date(job.completedAt).toLocaleTimeString()}`}
          </p>
          {job.fileSize && (
            <p className="text-xs text-gray-400">{formatFileSize(job.fileSize)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
          {getStatusText()}
        </span>
        {job.status === 'completed' && job.downloadUrl && (
          <button
            onClick={() => onDownload(job)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        {job.status === 'failed' && (
          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Retry">
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

const ScheduledExportCard: React.FC = () => {
  const [isScheduled, setIsScheduled] = useState(false)
  const [frequency, setFrequency] = useState('weekly')
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Scheduled Exports</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      {isScheduled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 mt-4"
        >
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly (Monday)</option>
            <option value="monthly">Monthly (1st day)</option>
            <option value="quarterly">Quarterly</option>
          </select>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address for delivery"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
            Schedule Export
          </button>
        </motion.div>
      )}
    </div>
  )
}

const DataPreviewTable: React.FC<{ filters: ExportFilters; stats: ExportStats }> = ({ filters, stats }) => {
  const [expanded, setExpanded] = useState(false)

  const previewData = [
    { type: 'Tasks', count: stats.tasksCount, icon: CheckCircle2, color: 'text-blue-500' },
    { type: 'Projects', count: stats.projectsCount, icon: Briefcase, color: 'text-purple-500' },
    { type: 'Goals', count: stats.goalsCount, icon: Target, color: 'text-green-500' },
    { type: 'Calendar Events', count: stats.calendarEventsCount, icon: Calendar, color: 'text-orange-500' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Export Preview</span>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {stats.tasksCount + stats.projectsCount + stats.goalsCount + stats.calendarEventsCount} items
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {previewData.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <div>
                      <p className="text-xs text-gray-500">{item.type}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Total attachments: {stats.totalAttachments}</span>
                <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> Estimated size: {stats.estimatedSize}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const EncryptionSettings: React.FC = () => {
  const [encryptExport, setEncryptExport] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Security & Encryption</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={encryptExport}
            onChange={(e) => setEncryptExport(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">AES-256 Encryption</span>
        </label>
      </div>
      
      {encryptExport && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to encrypt export"
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Your file will be encrypted with AES-256. Keep this password safe!
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Missing imports
import { Target, RefreshCw } from 'lucide-react'

// ============================================
// MAIN COMPONENT
// ============================================
export default function Export() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [exportHistory, setExportHistory] = useState<ExportJob[]>([])
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: 'all',
    includeArchived: false,
    includeCompleted: true,
    entities: {
      tasks: true,
      projects: true,
      goals: true,
      calendar: true,
      users: false,
    },
    dataTypes: {
      metadata: true,
      comments: true,
      attachments: true,
      history: false,
    }
  })
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const formats: ExportFormat[] = [
    { 
      id: 'csv', 
      name: 'CSV', 
      icon: FileSpreadsheet, 
      description: 'Comma-separated values - compatible with Excel, Google Sheets',
      extension: '.csv', 
      color: 'text-green-500',
      mimeType: 'text/csv',
      features: ['Universal compatibility', 'Small file size', 'Easy to parse'],
      limitations: ['No formatting', 'Limited to 1M rows']
    },
    { 
      id: 'json', 
      name: 'JSON', 
      icon: FileJson, 
      description: 'JavaScript Object Notation - ideal for developers and APIs',
      extension: '.json', 
      color: 'text-yellow-500',
      mimeType: 'application/json',
      features: ['Preserves data structure', 'Machine-readable', 'Nested data support'],
      limitations: ['Larger file size', 'Not human-friendly for large files']
    },
    { 
      id: 'pdf', 
      name: 'PDF', 
      icon: FileText, 
      description: 'Portable Document Format - perfect for printing and sharing',
      extension: '.pdf', 
      color: 'text-red-500',
      mimeType: 'application/pdf',
      features: ['Preserves formatting', 'Print-ready', 'Universal viewing'],
      limitations: ['Not editable', 'Larger file size']
    },
    { 
      id: 'excel', 
      name: 'Excel', 
      icon: FileSpreadsheet, 
      description: 'Microsoft Excel format - full spreadsheet features',
      extension: '.xlsx', 
      color: 'text-green-600',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      features: ['Multiple sheets', 'Formulas support', 'Charts and formatting'],
      limitations: ['Requires Excel or compatible software']
    },
    { 
      id: 'archive', 
      name: 'Archive', 
      icon: FileArchive, 
      description: 'ZIP archive with all data and attachments',
      extension: '.zip', 
      color: 'text-purple-500',
      mimeType: 'application/zip',
      features: ['Includes all files', 'Compressed size', 'Complete backup'],
      limitations: ['Larger download', 'Requires extraction']
    },
  ]

  // Mock stats
  const stats: ExportStats = {
    tasksCount: 156,
    projectsCount: 12,
    goalsCount: 8,
    calendarEventsCount: 43,
    totalAttachments: 67,
    estimatedSize: '4.2 MB'
  }

  const handleExport = () => {
    if (!selectedFormat) return
    
    setIsExporting(true)
    
    // Simulate export process
    setTimeout(() => {
      const newJob: ExportJob = {
        id: Date.now().toString(),
        format: selectedFormat,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        fileSize: 4.2 * 1024 * 1024,
        downloadUrl: '#',
        filters: { ...filters }
      }
      
      setExportHistory(prev => [newJob, ...prev].slice(0, 10))
      setIsExporting(false)
      setExportComplete(true)
      setTimeout(() => setExportComplete(false), 3000)
    }, 2500)
  }

  const handleDownload = (job: ExportJob) => {
    // Simulate download
    alert(`Downloading ${job.format} export...`)
  }

  const handleEntityToggle = (entity: keyof ExportFilters['entities']) => {
    setFilters(prev => ({
      ...prev,
      entities: { ...prev.entities, [entity]: !prev.entities[entity] }
    }))
  }

  const handleDataTypeToggle = (dataType: keyof ExportFilters['dataTypes']) => {
    setFilters(prev => ({
      ...prev,
      dataTypes: { ...prev.dataTypes, [dataType]: !prev.dataTypes[dataType] }
    }))
  }

  const selectedFormatObj = formats.find(f => f.id === selectedFormat)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm mb-4">
            <Shield className="w-4 h-4" />
            <span>Your data, your control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Download className="w-8 h-8 text-blue-500" />
            Export Data
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
            Export your workspace data in your preferred format. Choose what to include and how to receive it.
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {exportComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-green-800 dark:text-green-300">Export Complete!</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your {selectedFormatObj?.name} file has been prepared and will be downloaded automatically.
                </p>
              </div>
              <button onClick={() => setExportComplete(false)} className="text-green-500 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Format Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <File className="w-5 h-5 text-blue-500" />
                Select Export Format
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formats.map(format => (
                  <FormatCard
                    key={format.id}
                    format={format}
                    isSelected={selectedFormat === format.id}
                    onSelect={() => setSelectedFormat(format.id)}
                  />
                ))}
              </div>
            </div>

            {/* Selected Format Details */}
            {selectedFormatObj && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <selectedFormatObj.icon className={`w-5 h-5 ${selectedFormatObj.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{selectedFormatObj.name} Format</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{selectedFormatObj.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs">
                      <div>
                        <span className="text-gray-500">MIME Type:</span>
                        <code className="ml-1 text-gray-700 dark:text-gray-300">{selectedFormatObj.mimeType}</code>
                      </div>
                      <div>
                        <span className="text-gray-500">Extension:</span>
                        <code className="ml-1 text-gray-700 dark:text-gray-300">{selectedFormatObj.extension}</code>
                      </div>
                    </div>
                    {selectedFormatObj.features && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedFormatObj.features.map((feature, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-blue-200/50 dark:bg-blue-800/50 rounded-full text-blue-700 dark:text-blue-300">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">Advanced Export Options</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {/* Advanced Options Panel */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Entities Selection */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      What to Export
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(filters.entities).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleEntityToggle(key as keyof ExportFilters['entities'])}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Data Types */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      Include Additional Data
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(filters.dataTypes).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleDataTypeToggle(key as keyof ExportFilters['dataTypes'])}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Date Range
                    </h3>
                    <div className="space-y-3">
                      <select
                        value={filters.dateRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="all">All Time</option>
                        <option value="last30">Last 30 Days</option>
                        <option value="last90">Last 90 Days</option>
                        <option value="last365">Last Year</option>
                        <option value="custom">Custom Range</option>
                      </select>
                      
                      {filters.dateRange === 'custom' && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="text-xs text-gray-500">Start Date</label>
                            <input
                              type="date"
                              value={customDateRange.start}
                              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">End Date</label>
                            <input
                              type="date"
                              value={customDateRange.end}
                              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.includeArchived}
                            onChange={(e) => setFilters(prev => ({ ...prev, includeArchived: e.target.checked }))}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Include archived items</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.includeCompleted}
                            onChange={(e) => setFilters(prev => ({ ...prev, includeCompleted: e.target.checked }))}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Include completed tasks</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Data Preview */}
                  <DataPreviewTable filters={filters} stats={stats} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleExport}
              disabled={!selectedFormat || isExporting}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing your export...</span>
                </>
              ) : exportComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Export Ready!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Start Export</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Security Note */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Encrypted in transit (TLS 1.3)</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Available for 7 days</span>
              <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> Stored securely on AWS</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Encryption Settings */}
            <EncryptionSettings />

            {/* Scheduled Exports */}
            <ScheduledExportCard />

            {/* Export History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Exports</h3>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {exportHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Download className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent exports</p>
                    <p className="text-xs">Your exports will appear here</p>
                  </div>
                ) : (
                  exportHistory.map(job => (
                    <ExportHistoryItem key={job.id} job={job} onDownload={handleDownload} />
                  ))
                )}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-5 text-white text-center">
              <Heart className="w-8 h-8 mx-auto mb-3 opacity-90" />
              <h3 className="font-semibold mb-1">Need Help Exporting?</h3>
              <p className="text-white/80 text-sm mb-3">
                Our support team is ready to assist you with any export questions
              </p>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}