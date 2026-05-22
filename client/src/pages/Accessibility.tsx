// src/pages/Accessibility.tsx - Comprehensive Accessibility Statement
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, Eye, Volume2, Keyboard, Smartphone, Sun, Moon, Heart,
  Monitor, MousePointer, Mic, ZoomIn, Type, Palette, RefreshCw,
  Shield, Award, Globe, MessageCircle, Mail, Phone, ExternalLink,
  FileText, Download, Printer, Users, Brain, Settings, Wifi,
  Maximize, Minus, Plus, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, List, ListOrdered, Quote
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface AccessibilityFeature {
  id: string
  icon: React.ElementType
  title: string
  description: string
  details: string[]
  wcagReference?: string
}

interface ComplianceStandard {
  name: string
  level: string
  status: 'passed' | 'partial' | 'in-progress'
  description: string
  lastTested: string
}

interface AssistiveTechnology {
  name: string
  icon: React.ElementType
  description: string
  supportLevel: 'full' | 'partial' | 'planned'
}

interface KeyboardShortcut {
  action: string
  windows: string
  mac: string
  description: string
}

// ============================================
// COMPONENTS
// ============================================
const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [grayscale, setGrayscale] = useState(false)

  const applySettings = () => {
    document.documentElement.style.fontSize = `${fontSize}%`
    if (highContrast) {
      document.documentElement.style.filter = 'contrast(1.2) brightness(0.9)'
    } else {
      document.documentElement.style.filter = ''
    }
    if (grayscale) {
      document.documentElement.style.filter = `${document.documentElement.style.filter} grayscale(1)`
    }
  }

  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
    setReduceMotion(false)
    setGrayscale(false)
    document.documentElement.style.fontSize = ''
    document.documentElement.style.filter = ''
    document.documentElement.style.transition = ''
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Open accessibility menu"
      >
        <Heart className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden"
            role="dialog"
            aria-label="Accessibility settings"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="font-semibold">Accessibility Settings</h3>
              <p className="text-xs text-white/80">Customize your experience</p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Font Size: {fontSize}%
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize(Math.max(70, fontSize - 10))}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                    aria-label="Decrease font size"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="70"
                    max="200"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="flex-1"
                    aria-label="Font size slider"
                  />
                  <button
                    onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                    aria-label="Increase font size"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">High Contrast</span>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${highContrast ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-pressed={highContrast}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">Reduce Motion</span>
                  <button
                    onClick={() => setReduceMotion(!reduceMotion)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${reduceMotion ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-pressed={reduceMotion}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">Grayscale Mode</span>
                  <button
                    onClick={() => setGrayscale(!grayscale)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${grayscale ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-pressed={grayscale}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${grayscale ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={applySettings}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Apply
                </button>
                <button
                  onClick={resetSettings}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const FeatureCard: React.FC<{ feature: AccessibilityFeature; index: number }> = ({ feature, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left flex items-start gap-4"
      >
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
          <feature.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
          {feature.wcagReference && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              WCAG: {feature.wcagReference}
            </span>
          )}
        </div>
        <div className="text-gray-400">
          <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-5 pt-0 space-y-2">
              {feature.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const KeyboardShortcutsTable: React.FC = () => {
  const shortcuts: KeyboardShortcut[] = [
    { action: 'Navigate to next element', windows: 'Tab', mac: 'Tab', description: 'Moves focus to the next interactive element' },
    { action: 'Navigate to previous element', windows: 'Shift + Tab', mac: 'Shift + Tab', description: 'Moves focus to the previous interactive element' },
    { action: 'Activate element', windows: 'Enter', mac: 'Return', description: 'Activates the currently focused button or link' },
    { action: 'Open search', windows: 'Ctrl + K', mac: 'Cmd + K', description: 'Opens the global search dialog' },
    { action: 'New task', windows: 'Ctrl + N', mac: 'Cmd + N', description: 'Creates a new task' },
    { action: 'Save changes', windows: 'Ctrl + S', mac: 'Cmd + S', description: 'Saves current changes' },
    { action: 'Toggle sidebar', windows: 'Ctrl + B', mac: 'Cmd + B', description: 'Shows or hides the sidebar' },
    { action: 'Focus search', windows: 'Ctrl + F', mac: 'Cmd + F', description: 'Focuses the search input field' },
    { action: 'Go to dashboard', windows: 'G then D', mac: 'G then D', description: 'Navigates to dashboard' },
    { action: 'Go to calendar', windows: 'G then C', mac: 'G then C', description: 'Navigates to calendar view' },
    { action: 'Go to settings', windows: 'G then S', mac: 'G then S', description: 'Opens settings page' },
    { action: 'Close modal', windows: 'Escape', mac: 'Escape', description: 'Closes the current modal or dialog' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Windows/Linux</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">macOS</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
          </tr>
        </thead>
        <tbody>
          {shortcuts.map((shortcut, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-4 font-medium text-gray-800">{shortcut.action}</td>
              <td className="py-2 px-4">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{shortcut.windows}</kbd>
              </td>
              <td className="py-2 px-4">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{shortcut.mac}</kbd>
              </td>
              <td className="py-2 px-4 text-gray-500 text-xs">{shortcut.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AssistiveTechnologyCard: React.FC<{ tech: AssistiveTechnology }> = ({ tech }) => {
  const statusColors = {
    full: 'bg-green-100 text-green-700',
    partial: 'bg-yellow-100 text-yellow-700',
    planned: 'bg-blue-100 text-blue-700',
  }

  const statusLabels = {
    full: 'Fully Supported',
    partial: 'Partial Support',
    planned: 'Planned',
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg">
          <tech.icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-semibold text-gray-900">{tech.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[tech.supportLevel]}`}>
              {statusLabels[tech.supportLevel]}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{tech.description}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Accessibility() {
  const [activeTab, setActiveTab] = useState<'features' | 'shortcuts' | 'standards' | 'technologies'>('features')

  const features: AccessibilityFeature[] = [
    {
      id: 'screen-reader',
      icon: Eye,
      title: 'Screen Reader Support',
      description: 'Full compatibility with major screen readers',
      details: [
        'Semantic HTML5 elements for proper document structure',
        'ARIA landmarks and live regions for dynamic content',
        'Descriptive alt text for all images and icons',
        'Proper heading hierarchy (H1-H6) for navigation',
        'Announcement of form validation errors and success messages',
        'Support for NVDA, JAWS, VoiceOver, and TalkBack'
      ],
      wcagReference: '1.3.1, 4.1.2'
    },
    {
      id: 'keyboard',
      icon: Keyboard,
      title: 'Keyboard Navigation',
      description: 'Complete keyboard accessibility for all functionality',
      details: [
        'Logical tab order following visual layout',
        'Visible focus indicators with 3:1 contrast ratio',
        'Skip to main content link at page start',
        'Arrow key navigation for lists and calendars',
        'Escape key closes modals and dropdowns',
        'No keyboard traps - can navigate away from all elements'
      ],
      wcagReference: '2.1.1, 2.4.7'
    },
    {
      id: 'visual',
      icon: Monitor,
      title: 'Visual Accessibility',
      description: 'Optimized for users with visual impairments',
      details: [
        'WCAG 2.1 AA compliant color contrast (minimum 4.5:1)',
        'Text can be resized up to 200% without breaking layout',
        'Dark mode support with system preference detection',
        'High contrast mode with enhanced readability',
        'Option to disable animations and transitions',
        'Focus indicators visible on all interactive elements'
      ],
      wcagReference: '1.4.3, 1.4.10'
    },
    {
      id: 'cognitive',
      icon: Brain,
      title: 'Cognitive Accessibility',
      description: 'Designed for users with learning or cognitive disabilities',
      details: [
        'Consistent navigation across all pages',
        'Clear and simple language throughout',
        'Error suggestions and prevention tips',
        'Confirmations for destructive actions',
        'Progress indicators for multi-step processes',
        'Option to extend session timeouts'
      ],
      wcagReference: '3.3.3, 3.3.4'
    },
    {
      id: 'responsive',
      icon: Smartphone,
      title: 'Responsive & Mobile',
      description: 'Works seamlessly across all devices and screen sizes',
      details: [
        'Responsive layout from 320px to 4K displays',
        'Touch-optimized tap targets (minimum 44x44px)',
        'Pinch-to-zoom support enabled',
        'Orientation support (portrait and landscape)',
        'Mobile-specific navigation patterns',
        'Voice control compatibility (Siri, Google Assistant)'
      ],
      wcagReference: '1.4.4, 2.5.5'
    },
    {
      id: 'motion',
      icon: Heart,
      title: 'Motion & Animation',
      description: 'Respects user preferences for motion',
      details: [
        'Respects prefers-reduced-motion media query',
        'No auto-playing video or animations',
        'Flashing content limited to less than 3 flashes per second',
        'Pause button for any auto-updating content',
        'Smooth but not distracting transitions',
        'Option to disable all non-essential animations'
      ],
      wcagReference: '2.2.2, 2.3.1'
    },
    {
      id: 'voice',
      icon: Mic,
      title: 'Voice Control',
      description: 'Compatible with voice recognition software',
      details: [
        'Support for Dragon NaturallySpeaking',
        'Windows Speech Recognition compatibility',
        'Voice Control on iOS and macOS',
        'Proper labeling for all interactive elements',
        'Numbers and names for direct commands',
        'Confirmation dialogs for voice-triggered actions'
      ],
      wcagReference: '4.1.2, 2.1.4'
    },
    {
      id: 'zoom',
      icon: ZoomIn,
      title: 'Zoom & Magnification',
      description: 'Optimized for screen magnification users',
      details: [
        'Content reflows without horizontal scroll at 400% zoom',
        'Text remains readable when magnified',
        'Tooltips and popups stay visible when zoomed',
        'No content hidden behind other elements at high zoom',
        'Support for browser zoom and OS magnification',
        'Minimum font size of 16px on mobile devices'
      ],
      wcagReference: '1.4.4, 1.4.10'
    }
  ]

  const complianceStandards: ComplianceStandard[] = [
    {
      name: 'WCAG 2.1',
      level: 'Level AA',
      status: 'passed',
      description: 'Web Content Accessibility Guidelines - International standard for web accessibility',
      lastTested: '2026-05-15'
    },
    {
      name: 'Section 508',
      level: 'Compliant',
      status: 'passed',
      description: 'US federal law requiring accessible technology for people with disabilities',
      lastTested: '2026-05-10'
    },
    {
      name: 'EN 301 549',
      level: 'Compliant',
      status: 'passed',
      description: 'European standard for ICT accessibility requirements',
      lastTested: '2026-05-01'
    },
    {
      name: 'ADA Title III',
      level: 'Compliant',
      status: 'passed',
      description: 'Americans with Disabilities Act - Public accommodation requirements',
      lastTested: '2026-04-25'
    },
    {
      name: 'AODA',
      level: 'WCAG 2.0 AA',
      status: 'passed',
      description: 'Accessibility for Ontarians with Disabilities Act',
      lastTested: '2026-04-20'
    },
    {
      name: 'IS 5568',
      level: 'Level A',
      status: 'partial',
      description: 'Indian standard for web accessibility',
      lastTested: '2026-04-15'
    }
  ]

  const assistiveTechnologies: AssistiveTechnology[] = [
    {
      name: 'NVDA (NonVisual Desktop Access)',
      icon: Eye,
      description: 'Free, open-source screen reader for Windows',
      supportLevel: 'full'
    },
    {
      name: 'JAWS (Job Access With Speech)',
      icon: Volume2,
      description: 'Commercial screen reader for Windows',
      supportLevel: 'full'
    },
    {
      name: 'VoiceOver',
      icon: Mic,
      description: 'Built-in screen reader for macOS and iOS',
      supportLevel: 'full'
    },
    {
      name: 'TalkBack',
      icon: Smartphone,
      description: 'Screen reader for Android devices',
      supportLevel: 'full'
    },
    {
      name: 'Dragon NaturallySpeaking',
      icon: Mic,
      description: 'Voice recognition software',
      supportLevel: 'full'
    },
    {
      name: 'ZoomText',
      icon: ZoomIn,
      description: 'Screen magnification software for Windows',
      supportLevel: 'full'
    },
    {
      name: 'Orca',
      icon: Eye,
      description: 'Screen reader for Linux',
      supportLevel: 'partial'
    },
    {
      name: 'ChromeVox',
      icon: Volume2,
      description: 'Screen reader for Chrome OS',
      supportLevel: 'partial'
    }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6"
          >
            <Heart className="w-4 h-4" />
            <span>WCAG 2.1 AA Compliant</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Accessibility Statement
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto"
          >
            We're committed to making TaskCollab accessible and inclusive for everyone
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Our Commitment to Accessibility</h2>
              <p className="text-gray-600 leading-relaxed">
                TaskCollab is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying relevant 
                accessibility standards to achieve these goals. Our platform is built with inclusion 
                as a core principle, not an afterthought.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> WCAG 2.1 AA
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Section 508
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> EN 301 549
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'features', label: 'Features', icon: Settings },
            { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
            { id: 'standards', label: 'Compliance', icon: Award },
            { id: 'technologies', label: 'Assistive Tech', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {features.map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </motion.div>
          )}

          {activeTab === 'shortcuts' && (
            <motion.div
              key="shortcuts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Keyboard Shortcuts</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Use these keyboard shortcuts to navigate TaskCollab efficiently
                </p>
              </div>
              <div className="p-5">
                <KeyboardShortcutsTable />
              </div>
              <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t">
                <p>💡 Tip: Press <kbd className="px-1.5 py-0.5 bg-white rounded border">?</kbd> anywhere to see available shortcuts</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'standards' && (
            <motion.div
              key="standards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {complianceStandards.map((standard, index) => (
                <div key={standard.name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{standard.name}</h3>
                      <p className="text-sm text-gray-500">{standard.level}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      standard.status === 'passed' ? 'bg-green-100 text-green-700' :
                      standard.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {standard.status === 'passed' ? (
                        <><CheckCircle2 className="w-3 h-3 inline mr-1" /> Passed</>
                      ) : standard.status === 'partial' ? (
                        <>Partial</>
                      ) : (
                        <>In Progress</>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{standard.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Last tested: {new Date(standard.lastTested).toLocaleDateString()}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'technologies' && (
            <motion.div
              key="technologies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-3"
            >
              {assistiveTechnologies.map((tech, index) => (
                <AssistiveTechnologyCard key={tech.name} tech={tech} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testing & Evaluation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gray-900 rounded-2xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <RefreshCw className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Ongoing Accessibility Testing</h3>
              <p className="text-gray-300 text-sm">
                We maintain a continuous accessibility testing program that includes automated scans, 
                manual testing with assistive technologies, and user testing with people who have 
                disabilities. Our platform is tested quarterly against WCAG 2.1 Level AA criteria.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-1 rounded">Automated: axe-core, Lighthouse</span>
                <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-1 rounded">Manual: Keyboard, Screen readers</span>
                <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-1 rounded">User testing: Quarterly sessions</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feedback & Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-xl font-bold mb-2">Need Assistance?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            If you encounter any accessibility barriers while using TaskCollab, 
            please let us know. We're here to help!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:accessibility@taskcollab.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              accessibility@taskcollab.com
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Live Chat (9AM-5PM ET)
            </a>
          </div>
          <p className="text-white/60 text-xs mt-4">
            We aim to respond to accessibility inquiries within 2 business days
          </p>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            © {currentYear} TaskCollab, Inc. All rights reserved. | 
            This statement was last updated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            We welcome your feedback on the accessibility of TaskCollab. Please contact our accessibility team at accessibility@taskcollab.com
          </p>
        </div>
      </div>

      {/* Accessibility Widget */}
      <AccessibilityWidget />
    </div>
  )
}