// src/pages/Search.tsx - Global Search Page
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search as SearchIcon, X, Clock, TrendingUp, FileText,
  User, MessageSquare, Calendar, ArrowRight, Filter,
  Grid3X3, List, ChevronDown, CheckCircle2, 
  Star, Folder, Users, Tag, Filter as FilterIcon,
  SlidersHorizontal, SortAsc, SortDesc, Image,
  Music, Video, Archive, Download, Eye, ThumbsUp,
  Share2, Sun, Moon
} from 'lucide-react'

// Types
interface SearchResult {
  id: string
  type: 'task' | 'project' | 'user' | 'comment' | 'file' | 'document'
  title: string
  description: string
  url: string
  relevance: number
  metadata?: string
  thumbnail?: string
  createdAt?: string
  author?: string
  tags?: string[]
  views?: number
  likes?: number
}

interface SearchFilters {
  type: string
  sortBy: 'relevance' | 'date' | 'views' | 'likes'
  sortOrder: 'asc' | 'desc'
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
}

interface SearchHistory {
  id: string
  query: string
  timestamp: Date
  resultCount: number
}

// Search Result Card Component
const ResultCard: React.FC<{ result: SearchResult; index: number; darkMode?: boolean }> = ({ result, index, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="w-5 h-5 text-blue-500" />
      case 'project': return <Folder className="w-5 h-5 text-purple-500" />
      case 'user': return <User className="w-5 h-5 text-green-500" />
      case 'comment': return <MessageSquare className="w-5 h-5 text-orange-500" />
      case 'file': return <FileText className="w-5 h-5 text-red-500" />
      case 'document': return <FileText className="w-5 h-5 text-indigo-500" />
      default: return <SearchIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
      case 'project': return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
      case 'user': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
      case 'comment': return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
      case 'file': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={result.url} className="block">
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 transition-all duration-300 ${getTypeColor(result.type)} ${isHovered ? 'shadow-lg border-opacity-100' : 'border-opacity-50'}`}>
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`p-3 rounded-xl transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
              {getTypeIcon(result.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm dark:text-gray-300">
                  {result.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {result.relevance}% match
                </span>
                {result.createdAt && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                )}
                {result.views && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {result.views} views
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
                {result.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{result.description}</p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {result.author && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {result.author}
                  </span>
                )}
                {result.tags && result.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    <div className="flex gap-1">
                      {result.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                          {tag}
                        </span>
                      ))}
                      {result.tags.length > 3 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">+{result.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                {result.metadata && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">{result.metadata}</span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ArrowRight className={`w-5 h-5 transition-colors ${isHovered ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
            </motion.div>
          </div>

          {/* Quick Actions on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2"
              >
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  <Share2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  )
}

// Filter Sidebar Component
const FilterSidebar: React.FC<{
  filters: SearchFilters
  onFilterChange: (filters: SearchFilters) => void
  isOpen: boolean
  onClose: () => void
  darkMode?: boolean
}> = ({ filters, onFilterChange, isOpen, onClose, darkMode }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApply = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      type: 'all',
      sortBy: 'relevance',
      sortOrder: 'desc',
      dateRange: 'all'
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <FilterIcon className="w-5 h-5" />
                Filters
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'task', 'project', 'user', 'comment', 'file', 'document'].map(type => (
                    <button
                      key={type}
                      onClick={() => setLocalFilters({ ...localFilters, type })}
                      className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                        localFilters.type === type
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Sort By</label>
                <div className="space-y-2">
                  {['relevance', 'date', 'views', 'likes'].map(sort => (
                    <button
                      key={sort}
                      onClick={() => setLocalFilters({ ...localFilters, sortBy: sort as any })}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all ${
                        localFilters.sortBy === sort
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="capitalize">{sort}</span>
                      {localFilters.sortBy === sort && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Sort Order</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLocalFilters({ ...localFilters, sortOrder: 'desc' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      localFilters.sortOrder === 'desc'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortDesc className="w-4 h-4" />
                    Descending
                  </button>
                  <button
                    onClick={() => setLocalFilters({ ...localFilters, sortOrder: 'asc' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      localFilters.sortOrder === 'asc'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SortAsc className="w-4 h-4" />
                    Ascending
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Date Range</label>
                <div className="space-y-2">
                  {['all', 'today', 'week', 'month', 'year'].map(range => (
                    <button
                      key={range}
                      onClick={() => setLocalFilters({ ...localFilters, dateRange: range as any })}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                        localFilters.dateRange === range
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{range === 'all' ? 'All Time' : range}</span>
                      {localFilters.dateRange === range && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                  onClick={handleApply}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Main Component
export default function Search() {
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

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc',
    dateRange: 'all'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
    inputRef.current?.focus()
  }, [])

  // Save search history
  const saveToHistory = useCallback((searchQuery: string, resultCount: number) => {
    const newHistory: SearchHistory = {
      id: Date.now().toString(),
      query: searchQuery,
      timestamp: new Date(),
      resultCount
    }
    const updatedHistory = [newHistory, ...searchHistory.filter(h => h.query !== searchQuery)].slice(0, 10)
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }, [searchHistory])

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.length < 2) {
      setResults([])
      return
    }
    
    setIsSearching(true)
    
    // Simulate API call with realistic results
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const mockResults: SearchResult[] = [
      { 
        id: '1', 
        type: 'task', 
        title: 'Design new dashboard layout', 
        description: 'Create modern dashboard with 3D effects and interactive charts for the main analytics page.', 
        url: '/tasks/1', 
        relevance: 95, 
        metadata: 'In Progress • High Priority',
        createdAt: '2024-03-10',
        author: 'Alice Johnson',
        tags: ['design', 'dashboard', 'ui/ux'],
        views: 234,
        likes: 45
      },
      { 
        id: '2', 
        type: 'task', 
        title: 'API Documentation Update', 
        description: 'Update OpenAPI specs for v2 endpoints including authentication and rate limiting details.', 
        url: '/tasks/3', 
        relevance: 87, 
        metadata: 'Review • Medium Priority',
        createdAt: '2024-03-12',
        author: 'Bob Smith',
        tags: ['api', 'documentation', 'backend'],
        views: 156,
        likes: 32
      },
      { 
        id: '3', 
        type: 'project', 
        title: 'Dashboard Redesign Project', 
        description: 'Complete overhaul of the main dashboard with new features and improved performance.', 
        url: '/projects/1', 
        relevance: 82, 
        metadata: '75% Complete • Due Apr 15',
        createdAt: '2024-02-01',
        author: 'Product Team',
        tags: ['project', 'dashboard', 'redesign'],
        views: 567,
        likes: 89
      },
      { 
        id: '4', 
        type: 'user', 
        title: 'Alice Johnson', 
        description: 'Lead Designer • Design Team • 8 years experience', 
        url: '/team/1', 
        relevance: 65, 
        metadata: 'Online • Last active 2 minutes ago',
        createdAt: '2024-01-15',
        author: 'Alice Johnson',
        tags: ['designer', 'team-lead'],
        views: 89,
        likes: 12
      },
      { 
        id: '5', 
        type: 'comment', 
        title: 'Comment on API documentation', 
        description: 'Great work on the endpoints! Need to add authentication examples and error handling documentation.', 
        url: '/tasks/3#comments', 
        relevance: 55, 
        metadata: '2 days ago • 3 replies',
        createdAt: '2024-03-13',
        author: 'Carol Davis',
        tags: ['feedback', 'api'],
        views: 45,
        likes: 8
      },
      { 
        id: '6', 
        type: 'file', 
        title: 'requirements-v2.pdf', 
        description: 'Updated project requirements document with new features and technical specifications.', 
        url: '/files/1', 
        relevance: 45, 
        metadata: '2.4 MB • PDF • Updated Mar 10',
        createdAt: '2024-03-10',
        author: 'Technical Team',
        tags: ['documentation', 'requirements'],
        views: 123,
        likes: 15
      },
      { 
        id: '7', 
        type: 'document', 
        title: 'Technical Design Document', 
        description: 'System architecture and database schema design for the new microservices.', 
        url: '/docs/1', 
        relevance: 72, 
        metadata: '15 pages • Last edited Mar 14',
        createdAt: '2024-03-14',
        author: 'Architecture Team',
        tags: ['architecture', 'design', 'technical'],
        views: 89,
        likes: 23
      }
    ]
    
    // Apply filters
    let filtered = mockResults
    if (filters.type !== 'all') {
      filtered = filtered.filter(r => r.type === filters.type)
    }
    
    // Sort results
    filtered.sort((a, b) => {
      if (filters.sortBy === 'relevance') {
        return filters.sortOrder === 'desc' ? b.relevance - a.relevance : a.relevance - b.relevance
      } else if (filters.sortBy === 'date') {
        const dateA = new Date(a.createdAt || '0')
        const dateB = new Date(b.createdAt || '0')
        return filters.sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      } else if (filters.sortBy === 'views') {
        return filters.sortOrder === 'desc' ? (b.views || 0) - (a.views || 0) : (a.views || 0) - (b.views || 0)
      } else {
        return filters.sortOrder === 'desc' ? (b.likes || 0) - (a.likes || 0) : (a.likes || 0) - (b.likes || 0)
      }
    })
    
    setResults(filtered)
    setIsSearching(false)
    
    if (searchQuery.length >= 2 && filtered.length > 0) {
      saveToHistory(searchQuery, filtered.length)
    }
  }, [filters, saveToHistory])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, handleSearch])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const removeHistoryItem = (id: string) => {
    const updatedHistory = searchHistory.filter(h => h.id !== id)
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }

  const suggestedSearches = [
    { query: 'dashboard design', icon: '🎨', category: 'design' },
    { query: 'API integration', icon: '🔌', category: 'development' },
    { query: 'team meeting notes', icon: '📝', category: 'team' },
    { query: 'performance optimization', icon: '⚡', category: 'performance' },
    { query: 'bug fixes', icon: '🐛', category: 'development' },
    { query: 'user feedback', icon: '💬', category: 'feedback' }
  ]

  const popularSearches = [
    { query: 'sprint planning', count: 234 },
    { query: 'code review', count: 187 },
    { query: 'design system', count: 156 },
    { query: 'deployment', count: 134 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
      </button>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Search Everything
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find tasks, projects, people, and documents instantly</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="relative group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, projects, people, comments, files..."
              className="w-full pl-12 pr-32 py-5 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-800 shadow-lg transition-all text-gray-900 dark:text-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isSearching && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 rounded-full border-2 border-blue-200 dark:border-blue-800 border-t-blue-500"
                />
              )}
              {query && !isSearching && (
                <button
                  onClick={clearSearch}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all text-gray-700 dark:text-gray-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Search Tips */}
          {!query && (
            <div className="absolute mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-4">
              <span>💡 Tip: Use quotes for exact matches</span>
              <span>🔍 Search by @username or #tag</span>
            </div>
          )}
        </motion.div>

        {/* Results Header */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Found <span className="font-semibold text-gray-900 dark:text-white">{results.length}</span> results 
              {filters.type !== 'all' && ` in ${filters.type}s`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Grid/List */}
        {results.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
            {results.map((result, index) => (
              <ResultCard key={result.id} result={result} index={index} darkMode={darkMode} />
            ))}
          </div>
        )}

        {/* No Query State */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearch(item.query)}
                      className="group relative px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700 transition-all"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.query}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeHistoryItem(item.id)
                        }}
                        className="absolute -top-1 -right-1 p-0.5 bg-white dark:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Searches */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <TrendingUp className="w-4 h-4" />
                Suggested Searches
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestedSearches.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(suggestion.query)}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all group"
                  >
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {suggestion.query}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{suggestion.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-3">
                {popularSearches.map((popular, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(popular.query)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all group"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-white">
                      {popular.query} <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-white/80">({popular.count})</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🔍 Search Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">"exact phrase"</code> for precise matches</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">@username</code> to find user content</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">#tag</code> to search by tags</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">type:task</code> to filter by type</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {query && !isSearching && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          >
            <SearchIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No results found</h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">We couldn't find anything matching "{query}"</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setFilters({ ...filters, type: 'all' })
                  handleSearch(query)
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try removing filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        darkMode={darkMode}
      />
    </div>
  )
}