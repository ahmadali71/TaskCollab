// src/pages/Help.tsx - Help & Support Center with Dark/Light Mode
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Book, MessageCircle, Phone, Mail, Video,
  FileText, ChevronRight, ExternalLink, Star,
  ThumbsUp, ThumbsDown, HelpCircle, LifeBuoy,
  Shield, Zap, Users, Clock, Target, Award,
  AlertCircle, CheckCircle, XCircle, Info,
  Send, ArrowRight, Download, Printer, Copy,
  Link, ChevronDown, Filter, Grid, List, Layout, Settings, Globe,
  Smartphone, Share2, Sun, Moon, Sparkles, TrendingUp,
  Heart, Coffee, Gift, Crown, Rocket, Compass
} from 'lucide-react'

// Types
interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
  notHelpful: number
  dateAdded: string
  author: string
}

interface Article {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  icon: React.ElementType
  content?: string
  tags: string[]
  views: number
  helpful: number
  publishedDate: string
}

interface SupportTicket {
  id: string
  subject: string
  message: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
}

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  type: 'info' | 'warning' | 'success' | 'error'
}

// Modal Component for Contact Support
const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSubmit(formData)
    setIsSubmitting(false)
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Support</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Toast Notification Component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-4 min-w-[300px]"
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no' | null>>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([])
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

  // Load announcements on mount
  useEffect(() => {
    const loadAnnouncements = () => {
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'New AI Features Available!',
          content: 'We\'ve added AI-powered task suggestions and smart prioritization.',
          date: '2024-03-15',
          type: 'success'
        },
        {
          id: '2',
          title: 'Scheduled Maintenance',
          content: 'System will be offline for 2 hours on March 20th for upgrades.',
          date: '2024-03-14',
          type: 'warning'
        },
        {
          id: '3',
          title: 'Integration Updates',
          content: 'New integrations with Slack and Teams now available.',
          date: '2024-03-10',
          type: 'info'
        }
      ]
      setAnnouncements(mockAnnouncements)
    }
    loadAnnouncements()
  }, [])

  const faqs: FAQ[] = useMemo(() => [
    { 
      id: '1', 
      question: 'How do I create a new task?', 
      answer: 'Click the "+" button in the top navigation or use the "New Task" button on any page. You can also use the AI natural language input to create tasks with voice or text. Pro tip: Use keyboard shortcut "T" to quickly create a new task from anywhere in the app.', 
      category: 'Tasks',
      tags: ['tasks', 'creation', 'basics'],
      helpful: 245,
      notHelpful: 12,
      dateAdded: '2024-01-15',
      author: 'Support Team'
    },
    { 
      id: '2', 
      question: 'How do I invite team members?', 
      answer: 'Go to Team page, click "Invite Member", enter their email address, and select their role. They will receive an email invitation to join your workspace. You can also generate a shareable link for team members to join directly.', 
      category: 'Team',
      tags: ['team', 'invites', 'collaboration'],
      helpful: 189,
      notHelpful: 8,
      dateAdded: '2024-01-20',
      author: 'Product Team'
    },
    { 
      id: '3', 
      question: 'How does offline mode work?', 
      answer: 'All changes are saved locally when offline and automatically synced when you reconnect. Tasks created offline will appear with a sync indicator until uploaded. You can view and edit up to 100 tasks while offline.', 
      category: 'Features',
      tags: ['offline', 'sync', 'mobile'],
      helpful: 167,
      notHelpful: 15,
      dateAdded: '2024-01-25',
      author: 'Engineering Team'
    },
    { 
      id: '4', 
      question: 'Can I integrate with other tools?', 
      answer: 'Yes! We support integrations with Google Calendar, Slack, GitHub, Jira, Microsoft Teams, Zoom, Trello, Asana, and 50+ other tools. Visit the Integrations page to connect your tools and automate workflows.', 
      category: 'Integrations',
      tags: ['integrations', 'api', 'automation'],
      helpful: 234,
      notHelpful: 6,
      dateAdded: '2024-02-01',
      author: 'Integration Team'
    },
    { 
      id: '5', 
      question: 'How do I export my data?', 
      answer: 'Go to Settings → Data Management → Export Data. You can export in JSON, CSV, or PDF formats. You can also schedule automatic exports daily, weekly, or monthly. Enterprise users get real-time API access.', 
      category: 'Data',
      tags: ['export', 'data', 'backup'],
      helpful: 156,
      notHelpful: 4,
      dateAdded: '2024-02-05',
      author: 'Data Team'
    },
    { 
      id: '6', 
      question: 'Is my data secure?', 
      answer: 'Yes. We use AES-256 encryption for data at rest, TLS 1.3 for data in transit, and offer two-factor authentication. We are SOC 2 Type II compliant and GDPR ready. Regular security audits are conducted by third-party firms.', 
      category: 'Security',
      tags: ['security', 'privacy', 'encryption'],
      helpful: 278,
      notHelpful: 3,
      dateAdded: '2024-02-10',
      author: 'Security Team'
    },
    {
      id: '7',
      question: 'What are the pricing plans?',
      answer: 'We offer Free, Pro, Business, and Enterprise plans. Free includes 5 projects and 10 users. Pro starts at $12/user/month with unlimited projects. Business at $24/user/month includes advanced analytics. Contact sales for Enterprise pricing.',
      category: 'Pricing',
      tags: ['pricing', 'plans', 'billing'],
      helpful: 312,
      notHelpful: 28,
      dateAdded: '2024-02-15',
      author: 'Sales Team'
    },
    {
      id: '8',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. You\'ll receive a reset link via email. Click the link and follow the prompts. For security, the link expires in 24 hours. Contact support if you don\'t receive the email.',
      category: 'Account',
      tags: ['password', 'account', 'security'],
      helpful: 198,
      notHelpful: 11,
      dateAdded: '2024-02-20',
      author: 'Support Team'
    }
  ], [])

  const articles: Article[] = useMemo(() => [
    { 
      id: '1', 
      title: 'Getting Started Guide', 
      description: 'Learn the basics of TaskCollab in 10 minutes', 
      category: 'Basics', 
      readTime: '5 min', 
      icon: Book,
      tags: ['beginner', 'tutorial'],
      views: 12500,
      helpful: 342,
      publishedDate: '2024-01-01'
    },
    { 
      id: '2', 
      title: 'Advanced Task Management', 
      description: 'Master subtasks, dependencies, and automation', 
      category: 'Tasks', 
      readTime: '8 min', 
      icon: Target,
      tags: ['advanced', 'tasks', 'automation'],
      views: 8900,
      helpful: 267,
      publishedDate: '2024-01-15'
    },
    { 
      id: '3', 
      title: 'Team Collaboration Features', 
      description: 'Real-time editing, comments, and presence', 
      category: 'Team', 
      readTime: '6 min', 
      icon: Users,
      tags: ['collaboration', 'team', 'realtime'],
      views: 6700,
      helpful: 189,
      publishedDate: '2024-02-01'
    },
    { 
      id: '4', 
      title: 'Analytics & Reporting', 
      description: 'Understanding dashboards and generating reports', 
      category: 'Analytics', 
      readTime: '10 min', 
      icon: Zap,
      tags: ['analytics', 'reports', 'insights'],
      views: 4500,
      helpful: 156,
      publishedDate: '2024-02-10'
    },
    {
      id: '5',
      title: 'API Documentation',
      description: 'Integrate TaskCollab with your custom applications',
      category: 'Developers',
      readTime: '15 min',
      icon: Settings,
      tags: ['api', 'development', 'integration'],
      views: 3200,
      helpful: 98,
      publishedDate: '2024-02-20'
    },
    {
      id: '6',
      title: 'Mobile App Guide',
      description: 'Use TaskCollab on iOS and Android devices',
      category: 'Mobile',
      readTime: '7 min',
      icon: Smartphone,
      tags: ['mobile', 'ios', 'android'],
      views: 5600,
      helpful: 178,
      publishedDate: '2024-02-25'
    }
  ], [])

  const supportOptions = [
    { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support team', action: 'Start Chat', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', availability: '24/7' },
    { icon: Mail, title: 'Email Support', desc: 'Usually replies within 2 hours', action: 'Send Email', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', availability: '24/5' },
    { icon: Video, title: 'Video Tutorials', desc: 'Watch step-by-step guides', action: 'Watch Now', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30', availability: 'On-demand' },
    { icon: Book, title: 'Documentation', desc: 'Browse detailed docs', action: 'Read Docs', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', availability: 'Always' },
    { icon: Phone, title: 'Phone Support', desc: 'Call our support hotline', action: 'Call Now', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30', availability: '9AM-6PM EST' },
    { icon: Globe, title: 'Community Forum', desc: 'Connect with other users', action: 'Join Forum', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/30', availability: '24/7' }
  ]

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(faqs.map(f => f.category))]
    return cats
  }, [faqs])

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => 
      (selectedCategory === 'all' || faq.category === selectedCategory) &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
       faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
       faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }, [faqs, selectedCategory, searchQuery])

  const filteredArticles = useMemo(() => {
    let filtered = articles
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return filtered
  }, [articles, searchQuery])

  const handleHelpfulClick = async (faqId: string, feedback: 'yes' | 'no') => {
    setHelpfulFeedback(prev => ({ ...prev, [faqId]: feedback }))
    setToast({
      message: `Thank you for your feedback!`,
      type: 'success'
    })
  }

  const handleSupportOptionClick = (option: string) => {
    switch(option) {
      case 'Live Chat':
        setToast({
          message: 'Connecting you to a support agent...',
          type: 'info'
        })
        break
      case 'Email Support':
        window.location.href = 'mailto:support@taskcollab.com'
        break
      case 'Video Tutorials':
        window.open('https://youtube.com/taskcollab', '_blank')
        break
      case 'Documentation':
        window.open('/docs', '_blank')
        break
      case 'Phone Support':
        setToast({
          message: 'Call us at +1 (555) 123-4567',
          type: 'info'
        })
        break
      case 'Community Forum':
        window.open('/community', '_blank')
        break
      default:
        break
    }
  }

  const handleContactSupport = () => {
    setIsContactModalOpen(true)
  }

  const handleSubmitSupportTicket = async (data: any) => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      subject: data.subject,
      message: data.message,
      status: 'open',
      priority: data.priority,
      createdAt: new Date()
    }
    setRecentTickets(prev => [newTicket, ...prev].slice(0, 5))
    setToast({
      message: 'Support ticket created successfully! We\'ll respond within 2 hours.',
      type: 'success'
    })
  }

  const handleShareArticle = async (article: Article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      await navigator.clipboard.writeText(`${article.title} - ${article.description}`)
      setToast({
        message: 'Article link copied to clipboard!',
        type: 'success'
      })
    }
  }

  const getAnnouncementIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getAnnouncementBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* HEADER with Dark Mode Toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6 shadow-lg">
              <LifeBuoy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
              Get the help you need to master TaskCollab and boost your productivity
            </p>
          </motion.div>
        </div>

        {/* ANNOUNCEMENTS */}
        {announcements.length > 0 && (
          <div className="space-y-2">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-lg border ${getAnnouncementBg(announcement.type)} p-4 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start space-x-3">
                  {getAnnouncementIcon(announcement.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h4>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{announcement.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative max-w-3xl mx-auto"
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-5 text-base rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* SUPPORT OPTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {supportOptions.map((option, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => handleSupportOptionClick(option.title)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-center group"
            >
              <div className={`w-12 h-12 rounded-lg ${option.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <option.icon className={`w-6 h-6 ${option.color}`} />
              </div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{option.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{option.desc}</p>
              <span className="inline-block mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                {option.action} →
              </span>
            </motion.button>
          ))}
        </div>

        {/* POPULAR ARTICLES */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Articles</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Most viewed and helpful guides</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg cursor-pointer transition-all"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                      <article.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{article.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <Star className="w-3 h-3" />
                          <span>{article.helpful} helpful</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShareArticle(article)
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Share2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md cursor-pointer transition-all"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <article.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{article.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-400 dark:text-gray-500">{article.readTime}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{article.views} views</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* FAQ SECTION */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quick answers to common questions</p>
            </div>
          </div>

          {/* FAQ CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* FAQ LIST */}
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <HelpCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No FAQs found matching your search.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search terms or browse all categories.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gradient-to-r hover:from-gray-50 dark:hover:from-gray-700/50 hover:to-transparent transition-all"
                  >
                    <div className="flex-1 pr-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{faq.category}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{faq.helpful} found helpful</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${expandedFAQ === faq.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
                          <p className="leading-relaxed">{faq.answer}</p>
                          
                          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-xs text-gray-400 dark:text-gray-500">Tags:</span>
                              <div className="flex flex-wrap gap-1">
                                {faq.tags.map(tag => (
                                  <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-gray-400 dark:text-gray-500">Was this helpful?</span>
                              <button
                                onClick={() => handleHelpfulClick(faq.id, 'yes')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  helpfulFeedback[faq.id] === 'yes'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 scale-110'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:scale-110'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleHelpfulClick(faq.id, 'no')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  helpfulFeedback[faq.id] === 'no'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 scale-110'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:scale-110'
                                }`}
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* CONTACT SUPPORT BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl"
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
          }}></div>
          <div className="relative p-8 md:p-12 text-center text-white">
            <LifeBuoy className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Still need help?</h3>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleContactSupport}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Contact Support
              </button>
              <button
                onClick={() => window.open('/docs', '_blank')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse Documentation
              </button>
            </div>
          </div>
        </motion.div>

        {/* QUICK HELP STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">24/7</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Support Available</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Uptime Guarantee</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">&lt;2h</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Avg Response Time</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customer Rating</p>
          </div>
        </div>

        {/* RECENT SUPPORT TICKETS (if any) */}
        {recentTickets.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Support Tickets</h3>
            <div className="space-y-3">
              {recentTickets.map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ticket.status === 'open' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    ticket.status === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    ticket.status === 'resolved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Stay Updated</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get the latest tips, tutorials, and product updates</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleSubmitSupportTicket}
      />

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedArticle.title}</h2>
              <button onClick={() => setSelectedArticle(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedArticle.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-gray-500 mb-6">
                <span>{selectedArticle.readTime} read</span>
                <span>{selectedArticle.views} views</span>
                <span>{selectedArticle.helpful} found helpful</span>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">Key Points:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Understanding the basics of {selectedArticle.title}</li>
                  <li>Step-by-step implementation guide</li>
                  <li>Best practices and common pitfalls</li>
                  <li>Advanced tips and tricks</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}