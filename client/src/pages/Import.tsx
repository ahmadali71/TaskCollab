// src/pages/Import.tsx - Data Import Page
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileJson, FileSpreadsheet, CheckCircle2, AlertCircle,
  ArrowRight, Shield, Database, RefreshCw, X, FileText,
  MapPin, Link2, Settings, Eye, Download, Clock,
  HardDrive, Zap, Globe, Server, Cloud, ShieldCheck,
  Lock, FileWarning, History, DatabaseZap, Info,
  Sun, Moon
} from 'lucide-react'

interface ImportOption {
  id: string
  name: string
  icon: React.ElementType
  formats: string[]
  description: string
  color: string
}

interface ImportHistory {
  id: string
  fileName: string
  fileSize: string
  status: 'success' | 'failed' | 'pending'
  timestamp: Date
  recordsImported: number
}

// Toast Notification Component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info' | 'warning'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: { bg: 'bg-green-500', icon: CheckCircle2 },
    error: { bg: 'bg-red-500', icon: AlertCircle },
    info: { bg: 'bg-blue-500', icon: Info },
    warning: { bg: 'bg-yellow-500', icon: AlertCircle }
  }

  const Icon = config[type].icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-4 right-4 z-50 ${config[type].bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{message}</span>
    </motion.div>
  )
}

// Import Preview Modal
const ImportPreviewModal: React.FC<{
  isOpen: boolean
  fileName: string
  onConfirm: () => void
  onCancel: () => void
  darkMode?: boolean
}> = ({ isOpen, fileName, onConfirm, onCancel, darkMode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Eye className="w-5 h-5 text-blue-500" />
            Import Preview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review your data before importing</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-400">File: {fileName}</span>
              <span className="text-xs text-blue-700 dark:text-blue-300">Ready to import</span>
            </div>
            <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full">
              <div className="w-full h-2 bg-blue-500 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">245</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Records to import</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fields detected</p>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sample Data</p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Sample record {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 dark:text-yellow-400">
              Please review your data before importing. This action may overwrite existing data.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Confirm Import
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Import History Component
const ImportHistory: React.FC<{ history: ImportHistory[]; darkMode?: boolean }> = ({ history, darkMode }) => {
  if (history.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        Recent Imports
      </h3>
      <div className="space-y-3">
        {history.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              {item.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : item.status === 'failed' ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.fileName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.recordsImported} records • {item.fileSize}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Import() {
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

  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importComplete, setImportComplete] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<string>('file')
  const [showPreview, setShowPreview] = useState(false)
  const [importOptions, setImportOptions] = useState({
    overwrite: false,
    createBackup: true,
    sendNotification: true,
    validateData: true,
    skipDuplicates: false
  })
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importSources: ImportOption[] = [
    { id: 'file', name: 'File Upload', icon: Upload, formats: ['CSV', 'JSON', 'Excel'], description: 'Import from local files', color: 'from-blue-500 to-blue-600' },
    { id: 'trello', name: 'Trello', icon: Link2, formats: ['JSON'], description: 'Import Trello boards', color: 'from-green-500 to-green-600' },
    { id: 'asana', name: 'Asana', icon: MapPin, formats: ['CSV'], description: 'Import Asana projects', color: 'from-purple-500 to-purple-600' },
    { id: 'jira', name: 'Jira', icon: Settings, formats: ['JSON'], description: 'Import Jira issues', color: 'from-orange-500 to-orange-600' }
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const validTypes = ['.csv', '.json', '.xlsx', '.xls']
      const fileExtension = '.' + droppedFile.name.split('.').pop()?.toLowerCase()
      
      if (validTypes.includes(fileExtension)) {
        setFile(droppedFile)
        setImportError(null)
        setToast({ message: `File "${droppedFile.name}" selected successfully`, type: 'success' })
      } else {
        setToast({ message: 'Invalid file format. Please use CSV, JSON, or Excel files.', type: 'error' })
      }
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setImportError(null)
      setToast({ message: `File "${selectedFile.name}" selected successfully`, type: 'success' })
    }
  }, [])

  const handleImport = async () => {
    if (!file && selectedSource === 'file') {
      setToast({ message: 'Please select a file to import', type: 'warning' })
      return
    }

    if (importOptions.validateData) {
      setShowPreview(true)
      return
    }

    await performImport()
  }

  const performImport = async () => {
    setIsImporting(true)
    setImportError(null)
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const success = Math.random() > 0.1
    
    if (success) {
      const newHistory: ImportHistory = {
        id: Date.now().toString(),
        fileName: file?.name || 'Imported Data',
        fileSize: file ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown',
        status: 'success',
        timestamp: new Date(),
        recordsImported: Math.floor(Math.random() * 500) + 100
      }
      setImportHistory(prev => [newHistory, ...prev].slice(0, 5))
      setImportComplete(true)
      setToast({ message: 'Import completed successfully!', type: 'success' })
      setTimeout(() => {
        setImportComplete(false)
        setFile(null)
      }, 3000)
    } else {
      setImportError('Failed to import data. Please check the file format and try again.')
      setToast({ message: 'Import failed. Please try again.', type: 'error' })
    }
    
    setIsImporting(false)
    setShowPreview(false)
  }

  const clearFile = () => {
    setFile(null)
    setImportError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const acceptedFormats = ['.csv', '.json', '.xlsx', '.xls']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
      </button>

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

      {/* Import Preview Modal */}
      <AnimatePresence>
        {showPreview && file && (
          <ImportPreviewModal
            isOpen={true}
            fileName={file.name}
            onConfirm={performImport}
            onCancel={() => setShowPreview(false)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
              <Upload className="w-7 h-7 text-blue-500" />
              Import Data
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Import tasks, projects, and data from external sources</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Secure & Encrypted</span>
          </div>
        </motion.div>

        {/* Import Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {importSources.map(source => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`relative overflow-hidden rounded-xl p-5 text-center transition-all ${
                selectedSource === source.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <div className="relative z-10">
                <source.icon className={`w-8 h-8 mx-auto mb-2 ${
                  selectedSource === source.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <h3 className="font-semibold">{source.name}</h3>
                <p className={`text-xs mt-1 ${
                  selectedSource === source.id ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {source.description}
                </p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Drag and Drop Area */}
        {selectedSource === 'file' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <Upload className={`w-16 h-16 mx-auto mb-4 transition-all ${
                dragActive ? 'text-blue-500 scale-110' : 'text-gray-400 dark:text-gray-500'
              }`} />
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {dragActive ? 'Drop your file here' : 'Drag and drop your file here'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">or</p>
              <label className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg cursor-pointer transition-all">
                Browse Files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedFormats.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Supported formats: {acceptedFormats.join(', ')} • Max size: 10MB
              </p>
            </div>
          </motion.div>
        )}

        {/* Selected File */}
        {file && selectedSource === 'file' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{file.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                    <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Ready to import</p>
                  </div>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Import Options */}
        {(file || selectedSource !== 'file') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              Import Options
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Create backup before import</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Recommended for safety</p>
                </div>
                <input
                  type="checkbox"
                  checked={importOptions.createBackup}
                  onChange={(e) => setImportOptions({ ...importOptions, createBackup: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Validate data before import</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Check for errors and preview data</p>
                </div>
                <input
                  type="checkbox"
                  checked={importOptions.validateData}
                  onChange={(e) => setImportOptions({ ...importOptions, validateData: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Overwrite existing items</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Replace matching items with imported data</p>
                </div>
                <input
                  type="checkbox"
                  checked={importOptions.overwrite}
                  onChange={(e) => setImportOptions({ ...importOptions, overwrite: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Skip duplicate records</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Only import new unique items</p>
                </div>
                <input
                  type="checkbox"
                  checked={importOptions.skipDuplicates}
                  onChange={(e) => setImportOptions({ ...importOptions, skipDuplicates: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Send email notification on completion</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Get notified when import finishes</p>
                </div>
                <input
                  type="checkbox"
                  checked={importOptions.sendNotification}
                  onChange={(e) => setImportOptions({ ...importOptions, sendNotification: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-400">Import Failed</p>
              <p className="text-sm text-red-700 dark:text-red-500">{importError}</p>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {importComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start space-x-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-400">Import Successful!</p>
              <p className="text-sm text-green-700 dark:text-green-500">Your data has been imported successfully.</p>
            </div>
          </motion.div>
        )}

        {/* Import Button */}
        {(file || selectedSource !== 'file') && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleImport}
            disabled={isImporting}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Importing...</span>
              </>
            ) : importComplete ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Import Successful!</span>
              </>
            ) : (
              <>
                <DatabaseZap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Import</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        )}

        {/* Import History */}
        <ImportHistory history={importHistory} darkMode={darkMode} />

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Import Tips & Best Practices</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Maximum file size: 10MB</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">CSV files should have headers in the first row</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">JSON files should follow the TaskCollab schema</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Large imports may take a few minutes to process</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Backup recommended before bulk imports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Check data preview before confirming import</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-400 dark:text-gray-500"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Server className="w-3 h-3" />
              <span>Secure servers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}