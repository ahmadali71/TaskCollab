// src/pages/Shortcuts.tsx - Comprehensive Keyboard Shortcuts Page with Dark/Light Mode
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Keyboard, Command, Globe, Monitor, Smartphone,
  Search, Plus, Edit, Trash2, Save, Copy, 
  Undo, Redo, ArrowLeft, ArrowRight, HelpCircle,
  CheckCircle2, Star, Bell, Settings, User, LogOut,
  Zap, Coffee, Award, Target, Calendar, ListTodo,
  FolderKanban, GitBranch, MessageCircle, Share2,
  Download, Upload, Lock, Unlock, Eye, EyeOff,
  Maximize2, Minimize2, Grid3X3, List, Filter,
  ChevronUp, ChevronDown, X, Check, AlertCircle,
  Hash, Music, Sun, Moon, Cloud, Volume2, VolumeX,
  RefreshCw, Clipboard, Scissors, Box, Layers, Database,
  Server, Cpu, HardDrive, Terminal, Palette, Sparkles,
  Heart, Rocket, Shield, Users
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface Shortcut {
  id: string
  keys: string[]
  macKeys: string[]
  winKeys: string[]
  description: string
  category: string
  icon?: React.ElementType
  isCustomizable?: boolean
  isActive?: boolean
  customKey?: string
}

interface ShortcutCategory {
  name: string
  icon: React.ElementType
  description: string
  shortcuts: Shortcut[]
}

interface UserShortcut {
  originalId: string
  customKey: string
  isEnabled: boolean
}

// ============================================
// COMPONENTS
// ============================================
const KeyboardKey: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <kbd className={`px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-mono text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-600 ${className}`}>
    {children}
  </kbd>
)

const ShortcutRow: React.FC<{ 
  shortcut: Shortcut; 
  platform: 'mac' | 'win';
  onCustomize?: (id: string) => void;
  onToggle?: (id: string) => void;
  isCustomizing?: boolean;
}> = ({ shortcut, platform, onCustomize, onToggle, isCustomizing }) => {
  const keys = platform === 'mac' ? shortcut.macKeys : shortcut.winKeys
  
  const getKeyIcon = (key: string) => {
    const icons: Record<string, React.ReactNode> = {
      '⌘': <Command className="w-3 h-3" />,
      '⌥': <span>⌥</span>,
      '⇧': <span>⇧</span>,
      '⌃': <span>⌃</span>,
      '⎋': <span>⎋</span>,
      '↵': <span>↵</span>,
    }
    return icons[key] || key
  }

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <div className="flex items-center gap-3 flex-1">
        {shortcut.icon && <shortcut.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
        <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.description}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {keys.map((key, i) => (
            <KeyboardKey key={i}>
              {getKeyIcon(key)}
            </KeyboardKey>
          ))}
        </div>
        {shortcut.isCustomizable && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggle?.(shortcut.id)}
              className="p-1 text-gray-400 hover:text-green-500 rounded"
              title={shortcut.isActive ? 'Disable shortcut' : 'Enable shortcut'}
            >
              {shortcut.isActive ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </button>
            <button
              onClick={() => onCustomize?.(shortcut.id)}
              className="p-1 text-gray-400 hover:text-blue-500 rounded"
              title="Customize shortcut"
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const VisualKeyboard: React.FC<{ pressedKey?: string }> = ({ pressedKey }) => {
  const rows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl'],
  ]

  return (
    <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-4 overflow-x-auto">
      <div className="min-w-[800px]">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1">
            {row.map((key) => {
              const isPressed = pressedKey?.toLowerCase() === key.toLowerCase()
              const isSpecial = ['Backspace', 'Tab', 'Caps', 'Enter', 'Shift', 'Ctrl', 'Win', 'Alt', 'Menu', 'Space'].includes(key)
              const width = key === 'Space' ? 'w-48' : key === 'Backspace' || key === 'Enter' ? 'w-20' : 'w-12'
              
              return (
                <motion.div
                  key={key}
                  animate={isPressed ? { scale: 0.95, backgroundColor: '#3b82f6' } : { scale: 1, backgroundColor: '#374151' }}
                  className={`${width} h-12 m-0.5 rounded-lg flex items-center justify-center text-xs font-medium text-gray-300 transition-all cursor-default`}
                >
                  {key}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

const CustomizeShortcutModal: React.FC<{
  shortcut: Shortcut | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, customKey: string) => void
}> = ({ shortcut, isOpen, onClose, onSave }) => {
  const [recording, setRecording] = useState(false)
  const [recordedKeys, setRecordedKeys] = useState<string[]>([])

  useEffect(() => {
    if (!recording) return

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      const keys: string[] = []
      if (e.ctrlKey) keys.push('Ctrl')
      if (e.altKey) keys.push('Alt')
      if (e.shiftKey) keys.push('Shift')
      if (e.metaKey) keys.push('⌘')
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
        keys.push(key)
        setRecordedKeys(keys)
        setRecording(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recording])

  if (!shortcut || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customize Shortcut</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{shortcut.description}</p>
          </div>
          
          <div className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {recording ? 'Press your new key combination...' : 'Current shortcut:'}
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {recordedKeys.length > 0 ? (
                  recordedKeys.map((key, i) => (
                    <KeyboardKey key={i}>{key}</KeyboardKey>
                  ))
                ) : (
                  shortcut.macKeys.map((key, i) => (
                    <KeyboardKey key={i}>{key}</KeyboardKey>
                  ))
                )}
              </div>
              
              {!recording ? (
                <button
                  onClick={() => {
                    setRecording(true)
                    setRecordedKeys([])
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Record New Shortcut
                </button>
              ) : (
                <div className="text-yellow-600 dark:text-yellow-400 text-sm animate-pulse">
                  Listening for keys... Press Escape to cancel
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            {recordedKeys.length > 0 && (
              <button
                onClick={() => {
                  onSave(shortcut.id, recordedKeys.join('+'))
                  onClose()
                }}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Shortcut
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const SearchShortcuts: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search shortcuts by action or key..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
    />
  </div>
)

const CheatsheetCard: React.FC = () => {
  const [flipped, setFlipped] = useState(false)

  const essentialShortcuts = [
    { action: 'Quick Search', keys: ['⌘', 'K'] },
    { action: 'New Task', keys: ['⌘', 'N'] },
    { action: 'Save', keys: ['⌘', 'S'] },
    { action: 'Undo', keys: ['⌘', 'Z'] },
    { action: 'Help', keys: ['?'] },
  ]

  return (
    <motion.div
      className="relative w-full h-64 cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white h-full">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold">Quick Reference</h3>
          </div>
          <div className="space-y-2">
            {essentialShortcuts.map((shortcut, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, j) => (
                    <span key={j} className="px-1.5 py-0.5 bg-white/20 rounded text-xs">{key}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-4 text-center">Click to flip →</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
        style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5" />
          <h3 className="font-bold">Pro Tips</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li>• Press <kbd className="px-1 bg-white/20 rounded">?</kbd> anytime for help</li>
          <li>• Use <kbd className="px-1 bg-white/20 rounded">⌘</kbd>+<kbd className="px-1 bg-white/20 rounded">K</kbd> to quickly navigate</li>
          <li>• <kbd className="px-1 bg-white/20 rounded">Tab</kbd> and <kbd className="px-1 bg-white/20 rounded">Shift+Tab</kbd> for focus</li>
          <li>• Customize shortcuts in Settings</li>
        </ul>
        <p className="text-xs text-white/60 mt-4 text-center">Click to flip back →</p>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Shortcuts() {
  const [platform, setPlatform] = useState<'mac' | 'win'>('mac')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([
    'Navigation', 'Tasks', 'Editing', 'View', 'General'
  ]))
  const [customizingShortcut, setCustomizingShortcut] = useState<Shortcut | null>(null)
  const [userShortcuts, setUserShortcuts] = useState<Map<string, UserShortcut>>(new Map())
  const [pressedKey, setPressedKey] = useState<string>()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Track key presses for visual keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key)
      setTimeout(() => setPressedKey(undefined), 200)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const shortcutCategories: ShortcutCategory[] = [
    {
      name: 'Navigation',
      icon: Globe,
      description: 'Navigate through the application quickly',
      shortcuts: [
        { 
          id: 'nav-cmd-palette',
          keys: ['⌘', 'K'], macKeys: ['⌘', 'K'], winKeys: ['Ctrl', 'K'], 
          description: 'Open command palette / Quick search', category: 'Navigation', icon: Search,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'nav-back',
          keys: ['⌘', '←'], macKeys: ['⌘', '←'], winKeys: ['Alt', '←'], 
          description: 'Go back', category: 'Navigation', icon: ArrowLeft,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'nav-forward',
          keys: ['⌘', '→'], macKeys: ['⌘', '→'], winKeys: ['Alt', '→'], 
          description: 'Go forward', category: 'Navigation', icon: ArrowRight,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'nav-home',
          keys: ['⌘', 'Shift', 'H'], macKeys: ['⌘', 'Shift', 'H'], winKeys: ['Ctrl', 'Shift', 'H'], 
          description: 'Go to Home/Dashboard', category: 'Navigation', icon: Target,
          isCustomizable: false
        },
        { 
          id: 'nav-tasks',
          keys: ['G', 'T'], macKeys: ['G', 'T'], winKeys: ['G', 'T'], 
          description: 'Go to Tasks', category: 'Navigation', icon: ListTodo,
          isCustomizable: false
        },
        { 
          id: 'nav-projects',
          keys: ['G', 'P'], macKeys: ['G', 'P'], winKeys: ['G', 'P'], 
          description: 'Go to Projects', category: 'Navigation', icon: FolderKanban,
          isCustomizable: false
        },
        { 
          id: 'nav-calendar',
          keys: ['G', 'C'], macKeys: ['G', 'C'], winKeys: ['G', 'C'], 
          description: 'Go to Calendar', category: 'Navigation', icon: Calendar,
          isCustomizable: false
        },
        { 
          id: 'nav-goals',
          keys: ['G', 'G'], macKeys: ['G', 'G'], winKeys: ['G', 'G'], 
          description: 'Go to Goals', category: 'Navigation', icon: Target,
          isCustomizable: false
        },
        { 
          id: 'nav-templates',
          keys: ['G', 'M'], macKeys: ['G', 'M'], winKeys: ['G', 'M'], 
          description: 'Go to Templates', category: 'Navigation', icon: Copy,
          isCustomizable: false
        },
      ]
    },
    {
      name: 'Tasks',
      icon: CheckCircle2,
      description: 'Manage tasks efficiently',
      shortcuts: [
        { 
          id: 'task-new',
          keys: ['⌘', 'N'], macKeys: ['⌘', 'N'], winKeys: ['Ctrl', 'N'], 
          description: 'Create new task', category: 'Tasks', icon: Plus,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-edit',
          keys: ['⌘', 'E'], macKeys: ['⌘', 'E'], winKeys: ['Ctrl', 'E'], 
          description: 'Edit selected task', category: 'Tasks', icon: Edit,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-duplicate',
          keys: ['⌘', 'D'], macKeys: ['⌘', 'D'], winKeys: ['Ctrl', 'D'], 
          description: 'Duplicate task', category: 'Tasks', icon: Copy,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-delete',
          keys: ['⌘', 'Delete'], macKeys: ['⌘', 'Delete'], winKeys: ['Delete'], 
          description: 'Delete task', category: 'Tasks', icon: Trash2,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-save',
          keys: ['⌘', 'S'], macKeys: ['⌘', 'S'], winKeys: ['Ctrl', 'S'], 
          description: 'Save task', category: 'Tasks', icon: Save,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-complete',
          keys: ['Space'], macKeys: ['Space'], winKeys: ['Space'], 
          description: 'Toggle task complete', category: 'Tasks', icon: CheckCircle2,
          isCustomizable: false
        },
        { 
          id: 'task-priority-up',
          keys: ['⌘', '↑'], macKeys: ['⌘', '↑'], winKeys: ['Ctrl', '↑'], 
          description: 'Increase priority', category: 'Tasks', icon: ChevronUp,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-priority-down',
          keys: ['⌘', '↓'], macKeys: ['⌘', '↓'], winKeys: ['Ctrl', '↓'], 
          description: 'Decrease priority', category: 'Tasks', icon: ChevronDown,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'task-assign',
          keys: ['⌘', 'Shift', 'A'], macKeys: ['⌘', 'Shift', 'A'], winKeys: ['Ctrl', 'Shift', 'A'], 
          description: 'Assign task', category: 'Tasks', icon: User,
          isCustomizable: false
        },
        { 
          id: 'task-due-date',
          keys: ['⌘', 'Shift', 'D'], macKeys: ['⌘', 'Shift', 'D'], winKeys: ['Ctrl', 'Shift', 'D'], 
          description: 'Set due date', category: 'Tasks', icon: Calendar,
          isCustomizable: false
        },
      ]
    },
    {
      name: 'Editing',
      icon: Edit,
      description: 'Text editing and formatting',
      shortcuts: [
        { 
          id: 'edit-undo',
          keys: ['⌘', 'Z'], macKeys: ['⌘', 'Z'], winKeys: ['Ctrl', 'Z'], 
          description: 'Undo last action', category: 'Editing', icon: Undo,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-redo',
          keys: ['⌘', 'Shift', 'Z'], macKeys: ['⌘', 'Shift', 'Z'], winKeys: ['Ctrl', 'Y'], 
          description: 'Redo last action', category: 'Editing', icon: Redo,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-copy',
          keys: ['⌘', 'C'], macKeys: ['⌘', 'C'], winKeys: ['Ctrl', 'C'], 
          description: 'Copy', category: 'Editing', icon: Copy,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-paste',
          keys: ['⌘', 'V'], macKeys: ['⌘', 'V'], winKeys: ['Ctrl', 'V'], 
          description: 'Paste', category: 'Editing', icon: Clipboard,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-cut',
          keys: ['⌘', 'X'], macKeys: ['⌘', 'X'], winKeys: ['Ctrl', 'X'], 
          description: 'Cut', category: 'Editing', icon: Scissors,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-select-all',
          keys: ['⌘', 'A'], macKeys: ['⌘', 'A'], winKeys: ['Ctrl', 'A'], 
          description: 'Select all', category: 'Editing', icon: CheckCircle2,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-find',
          keys: ['⌘', 'F'], macKeys: ['⌘', 'F'], winKeys: ['Ctrl', 'F'], 
          description: 'Find / Search', category: 'Editing', icon: Search,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-replace',
          keys: ['⌘', 'H'], macKeys: ['⌘', 'H'], winKeys: ['Ctrl', 'H'], 
          description: 'Find and replace', category: 'Editing', icon: Hash,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-bold',
          keys: ['⌘', 'B'], macKeys: ['⌘', 'B'], winKeys: ['Ctrl', 'B'], 
          description: 'Bold text', category: 'Editing',
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-italic',
          keys: ['⌘', 'I'], macKeys: ['⌘', 'I'], winKeys: ['Ctrl', 'I'], 
          description: 'Italic text', category: 'Editing',
          isCustomizable: true, isActive: true
        },
        { 
          id: 'edit-underline',
          keys: ['⌘', 'U'], macKeys: ['⌘', 'U'], winKeys: ['Ctrl', 'U'], 
          description: 'Underline text', category: 'Editing',
          isCustomizable: true, isActive: true
        },
      ]
    },
    {
      name: 'View',
      icon: Monitor,
      description: 'Control your workspace view',
      shortcuts: [
        { 
          id: 'view-zoom-in',
          keys: ['⌘', '+'], macKeys: ['⌘', '+'], winKeys: ['Ctrl', '+'], 
          description: 'Zoom in', category: 'View', icon: Maximize2,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'view-zoom-out',
          keys: ['⌘', '-'], macKeys: ['⌘', '-'], winKeys: ['Ctrl', '-'], 
          description: 'Zoom out', category: 'View', icon: Minimize2,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'view-reset-zoom',
          keys: ['⌘', '0'], macKeys: ['⌘', '0'], winKeys: ['Ctrl', '0'], 
          description: 'Reset zoom', category: 'View',
          isCustomizable: true, isActive: true
        },
        { 
          id: 'view-toggle-sidebar',
          keys: ['⌘', '\\'], macKeys: ['⌘', '\\'], winKeys: ['Ctrl', '\\'], 
          description: 'Toggle sidebar', category: 'View', icon: Grid3X3,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'view-toggle-dark-mode',
          keys: ['⌘', '/'], macKeys: ['⌘', '/'], winKeys: ['Ctrl', '/'], 
          description: 'Toggle dark mode', category: 'View', icon: Moon,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'view-fullscreen',
          keys: ['F11'], macKeys: ['F11'], winKeys: ['F11'], 
          description: 'Full screen', category: 'View', icon: Maximize2,
          isCustomizable: false
        },
        { 
          id: 'view-toggle-grid',
          keys: ['⌘', 'Shift', 'G'], macKeys: ['⌘', 'Shift', 'G'], winKeys: ['Ctrl', 'Shift', 'G'], 
          description: 'Toggle grid/list view', category: 'View', icon: Grid3X3,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'view-refresh',
          keys: ['⌘', 'R'], macKeys: ['⌘', 'R'], winKeys: ['Ctrl', 'R'], 
          description: 'Refresh view', category: 'View', icon: RefreshCw,
          isCustomizable: true, isActive: true
        },
      ]
    },
    {
      name: 'General',
      icon: Settings,
      description: 'Application-wide controls',
      shortcuts: [
        { 
          id: 'general-help',
          keys: ['?'], macKeys: ['?'], winKeys: ['?'], 
          description: 'Show keyboard shortcuts', category: 'General', icon: HelpCircle,
          isCustomizable: false
        },
        { 
          id: 'general-settings',
          keys: ['⌘', ','], macKeys: ['⌘', ','], winKeys: ['Ctrl', ','], 
          description: 'Open settings', category: 'General', icon: Settings,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'general-close',
          keys: ['Esc'], macKeys: ['Esc'], winKeys: ['Esc'], 
          description: 'Close modal / Cancel', category: 'General',
          isCustomizable: false
        },
        { 
          id: 'general-submit',
          keys: ['Enter'], macKeys: ['Enter'], winKeys: ['Enter'], 
          description: 'Confirm / Submit', category: 'General',
          isCustomizable: false
        },
        { 
          id: 'general-logout',
          keys: ['⌘', 'Shift', 'L'], macKeys: ['⌘', 'Shift', 'L'], winKeys: ['Ctrl', 'Shift', 'L'], 
          description: 'Log out', category: 'General', icon: LogOut,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'general-notifications',
          keys: ['⌘', 'Shift', 'N'], macKeys: ['⌘', 'Shift', 'N'], winKeys: ['Ctrl', 'Shift', 'N'], 
          description: 'Open notifications', category: 'General', icon: Bell,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'general-profile',
          keys: ['⌘', 'Shift', 'U'], macKeys: ['⌘', 'Shift', 'U'], winKeys: ['Ctrl', 'Shift', 'U'], 
          description: 'Open profile', category: 'General', icon: User,
          isCustomizable: true, isActive: true
        },
      ]
    },
    {
      name: 'Projects & Collaboration',
      icon: FolderKanban,
      description: 'Team collaboration shortcuts',
      shortcuts: [
        { 
          id: 'collab-new-project',
          keys: ['⌘', 'Shift', 'P'], macKeys: ['⌘', 'Shift', 'P'], winKeys: ['Ctrl', 'Shift', 'P'], 
          description: 'Create new project', category: 'Projects & Collaboration', icon: FolderKanban,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'collab-mention',
          keys: ['@'], macKeys: ['@'], winKeys: ['@'], 
          description: 'Mention team member', category: 'Projects & Collaboration', icon: MessageCircle,
          isCustomizable: false
        },
        { 
          id: 'collab-share',
          keys: ['⌘', 'Shift', 'S'], macKeys: ['⌘', 'Shift', 'S'], winKeys: ['Ctrl', 'Shift', 'S'], 
          description: 'Share current view', category: 'Projects & Collaboration', icon: Share2,
          isCustomizable: true, isActive: true
        },
        { 
          id: 'collab-comment',
          keys: ['⌘', 'Shift', 'C'], macKeys: ['⌘', 'Shift', 'C'], winKeys: ['Ctrl', 'Shift', 'C'], 
          description: 'Add comment', category: 'Projects & Collaboration', icon: MessageCircle,
          isCustomizable: true, isActive: true
        },
      ]
    },
  ]

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryName)) next.delete(categoryName)
      else next.add(categoryName)
      return next
    })
  }

  const handleCustomize = (shortcutId: string) => {
    const shortcut = shortcutCategories
      .flatMap(c => c.shortcuts)
      .find(s => s.id === shortcutId)
    if (shortcut) setCustomizingShortcut(shortcut)
  }

  const handleSaveCustomization = (shortcutId: string, customKey: string) => {
    setUserShortcuts(prev => {
      const next = new Map(prev)
      next.set(shortcutId, {
        originalId: shortcutId,
        customKey,
        isEnabled: true
      })
      return next
    })
  }

  const handleToggleShortcut = (shortcutId: string) => {
    setUserShortcuts(prev => {
      const next = new Map(prev)
      const existing = next.get(shortcutId)
      if (existing) {
        next.set(shortcutId, { ...existing, isEnabled: !existing.isEnabled })
      } else {
        next.set(shortcutId, {
          originalId: shortcutId,
          customKey: '',
          isEnabled: false
        })
      }
      return next
    })
  }

  const getShortcutStatus = (shortcutId: string): { isActive: boolean; customKey?: string } => {
    const userShortcut = userShortcuts.get(shortcutId)
    if (userShortcut) {
      return { isActive: userShortcut.isEnabled, customKey: userShortcut.customKey }
    }
    return { isActive: true }
  }

  const filteredCategories = shortcutCategories
    .map(category => ({
      ...category,
      shortcuts: category.shortcuts.filter(shortcut =>
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.shortcuts.length > 0)

  const totalShortcuts = shortcutCategories.reduce((acc, c) => acc + c.shortcuts.length, 0)
  const enabledShortcuts = shortcutCategories.reduce(
    (acc, c) => acc + c.shortcuts.filter(s => getShortcutStatus(s.id).isActive).length, 0
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Dark Mode Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (isDarkMode) {
                document.documentElement.classList.remove('dark')
              } else {
                document.documentElement.classList.add('dark')
              }
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
          >
            <Keyboard className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            Keyboard Shortcuts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 mt-1"
          >
            Boost your productivity with keyboard shortcuts
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalShortcuts}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Shortcuts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{enabledShortcuts}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Shortcuts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">∞</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Customizable</p>
          </div>
        </div>

        {/* Platform Toggle */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setPlatform('mac')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              platform === 'mac' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Command className="w-4 h-4" />
            <span>Mac</span>
          </button>
          <button
            onClick={() => setPlatform('win')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              platform === 'win' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows</span>
          </button>
        </div>

        {/* Search */}
        <SearchShortcuts onSearch={setSearchQuery} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shortcuts List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCategories.map((category, idx) => {
              const isExpanded = expandedCategories.has(category.name)
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <category.icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <h2 className="font-semibold text-gray-900 dark:text-white">{category.name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{category.shortcuts.length} shortcuts</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="border-t border-gray-100 dark:border-gray-700"
                      >
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {category.shortcuts.map((shortcut) => {
                            const status = getShortcutStatus(shortcut.id)
                            return (
                              <ShortcutRow
                                key={shortcut.id}
                                shortcut={{
                                  ...shortcut,
                                  isActive: status.isActive,
                                  customKey: status.customKey
                                }}
                                platform={platform}
                                onCustomize={() => handleCustomize(shortcut.id)}
                                onToggle={() => handleToggleShortcut(shortcut.id)}
                              />
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No shortcuts found</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Sidebar - Visual Keyboard & Cheatsheet */}
          <div className="space-y-6">
            {/* Visual Keyboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Visual Keyboard</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press any key to see it highlighted</p>
              </div>
              <div className="p-4">
                <VisualKeyboard pressedKey={pressedKey} />
              </div>
            </div>

            {/* Quick Reference Card */}
            <CheatsheetCard />

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Pro Tips</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">K</kbd> is your best friend</li>
                    <li>• Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">Tab</kbd> to navigate between fields</li>
                    <li>• <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">Space</kbd> toggles task completion</li>
                    <li>• Customize shortcuts in Settings → Keyboard</li>
                    <li>• <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">Esc</kbd> closes any modal or dropdown</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reset to Defaults */}
            <button
              onClick={() => {
                if (window.confirm('Reset all shortcuts to default? This will remove all customizations.')) {
                  setUserShortcuts(new Map())
                }
              }}
              className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default Shortcuts
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p>Shortcuts may vary depending on your browser and operating system</p>
          <p className="mt-1">Custom shortcuts are saved locally and synced across devices when signed in</p>
        </div>
      </div>

      {/* Customize Modal */}
      <CustomizeShortcutModal
        shortcut={customizingShortcut}
        isOpen={!!customizingShortcut}
        onClose={() => setCustomizingShortcut(null)}
        onSave={handleSaveCustomization}
      />
    </div>
  )
}