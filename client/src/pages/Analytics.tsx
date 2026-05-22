// src/pages/Analytics.tsx - Complete Analytics Dashboard with ALL Features
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Users, CheckCircle2, Clock, Target, Zap,
  Activity, BarChart3, PieChart, Calendar, Download, RefreshCw,
  Filter, ChevronDown, ChevronUp, MoreVertical, X, Plus,
  AlertTriangle, ThumbsUp, MessageSquare, Star, Eye, EyeOff,
  DollarSign, Briefcase, Heart, Share2, Award, Flame,
  ArrowUpRight, ArrowDownRight, Minus, Maximize2, Minimize2,
  LayoutDashboard, ListTodo, Settings, LogOut, Bell,
  Search, Sliders, GitBranch, Brain, Moon, Sun,
  ChartLine, ChartArea, ChartPie, Grid, Layers, Hash,
  Rocket, Shield, Coffee, Gift, Crown, Sparkles
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface MetricCard {
  id: string
  label: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  color: string
  sparkline: number[]
  target?: number
  forecast?: number
  historicalAvg?: number
}

interface TeamMember {
  id: string
  name: string
  avatar: string
  email: string
  role: string
  department: string
  tasksCompleted: number
  tasksInProgress: number
  productivity: number
  trend: number[]
  skills: string[]
  currentProject?: string
  availability: number
  attendance: number
}

interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: 'on_track' | 'at_risk' | 'behind' | 'completed' | 'on_hold'
  priority: 'critical' | 'high' | 'medium' | 'low'
  tasksTotal: number
  tasksCompleted: number
  dueDate: string
  startDate: string
  team: string[]
  budget: number
  spent: number
  tags: string[]
  milestones: { name: string; completed: boolean; date: string }[]
}

interface Insight {
  id: string
  type: 'positive' | 'warning' | 'negative' | 'info'
  title: string
  description: string
  metric?: string
  change?: number
  confidence: number
  actionable: boolean
  suggestions?: string[]
}

interface Notification {
  id: string
  type: 'alert' | 'info' | 'success' | 'warning'
  message: string
  timestamp: string
  read: boolean
  action?: { label: string; handler: () => void }
}

interface FilterState {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom'
  customDateRange?: { start: Date; end: Date }
  departments: string[]
  statuses: string[]
  priorities: string[]
  teamMembers: string[]
  searchQuery: string
}

interface ExportConfig {
  format: 'pdf' | 'csv' | 'excel' | 'json'
  sections: string[]
  dateRange: string
  includeCharts: boolean
}

interface QuickStat {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  bg: string
  trend: number
}

// ============================================
// 3D CARD COMPONENT (with dark mode)
// ============================================
const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  depth?: number
  glow?: boolean
  onClick?: () => void
  hoverable?: boolean
  glassmorphism?: boolean
  animation?: 'fade' | 'slide' | 'scale' | 'none'
  delay?: number
}> = ({ 
  children, 
  className = '', 
  depth = 20, 
  glow = false, 
  onClick, 
  hoverable = true,
  glassmorphism = false,
  animation = 'fade',
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-50px" })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !hoverable) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [hoverable, mouseX, mouseY])

  const animationVariants = {
    fade: { opacity: 0, y: 0 },
    slide: { opacity: 0, y: 30 },
    scale: { opacity: 0, scale: 0.95 },
    none: { opacity: 1, y: 0 }
  }

  const glassStyles = glassmorphism ? {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  } : {}

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      onClick={onClick}
      variants={animationVariants}
      initial={animation}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : animationVariants[animation]}
      transition={{ duration: 0.5, delay }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000, ...glassStyles }}
      whileHover={hoverable ? { scale: 1.02, z: 20 } : {}}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${glow ? 'hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}

// ============================================
// ANIMATED COUNTER
// ============================================
const AnimatedCounter: React.FC<{ 
  value: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
  decimals?: number;
  format?: 'number' | 'currency' | 'percentage';
}> = ({ value, duration = 1.5, prefix = '', suffix = '', decimals = 0, format = 'number' }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValue = useRef(0)
  
  useEffect(() => {
    let startTime: number | null = null
    const startValue = prevValue.current
    const valueDiff = value - startValue
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress
      
      const currentValue = startValue + valueDiff * eased
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevValue.current = value
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])

  const formattedValue = useMemo(() => {
    const formatStr = String(format)
    if (formatStr === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(displayValue)
    }
    if (formatStr === 'percentage') {
      return `${displayValue.toFixed(decimals)}%`
    }
    return displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }, [displayValue, format, decimals])

  return <span>{prefix}{formattedValue}{suffix}</span>
}

// ============================================
// SPARKLINE CHART
// ============================================
const Sparkline: React.FC<{ 
  data: number[]; 
  color: string; 
  height?: number;
  showGradient?: boolean;
  showDots?: boolean;
  animate?: boolean;
}> = ({ data, color, height = 40, showGradient = true, showDots = true, animate = true }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: height - ((value - min) / range) * height,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  const gradientId = useMemo(() => `gradient-${color.replace('#', '').replace(/[^a-zA-Z0-9]/g, '')}`, [color])

  return (
    <svg width="100%" height={height} className="overflow-visible">
      {showGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
      )}
      <path d={fillD} fill={`url(#${gradientId})`} />
      <motion.path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0 } : {}}
        animate={animate ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {showDots && (
        <>
          <circle cx={points[0].x} cy={points[0].y} r="2" fill={color} opacity="0.5" />
          <motion.circle 
            cx={points[points.length - 1].x} 
            cy={points[points.length - 1].y} 
            r="3" 
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 }}
          />
        </>
      )}
    </svg>
  )
}

// ============================================
// METRIC CARD 3D
// ============================================
const MetricCard3D: React.FC<{
  metric: MetricCard
}> = ({ metric }) => {
  const Icon = metric.icon
  const isPositive = metric.changeType === 'increase'
  const isNeutral = metric.changeType === 'neutral'

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600',
    red: 'from-red-500 to-red-600',
  }

  return (
    <Card3D className="p-5" depth={15}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorMap[metric.color] || colorMap.blue} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
            isNeutral ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' :
            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> :
           isNeutral ? <Minus className="w-3 h-3" /> :
           <ArrowDownRight className="w-3 h-3" />}
          <span>{Math.abs(metric.change)}%</span>
        </motion.div>
      </div>
      <div>
        <motion.p className="text-2xl font-bold text-gray-900 dark:text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {typeof metric.value === 'number' ? <AnimatedCounter value={metric.value} /> : metric.value}
        </motion.p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.label}</p>
      </div>
      <div className="mt-3">
        <Sparkline data={metric.sparkline} color={metric.color === 'blue' ? '#3b82f6' : metric.color === 'green' ? '#10b981' : '#8b5cf6'} />
      </div>
    </Card3D>
  )
}

// ============================================
// INSIGHT CARD (with dark mode)
// ============================================
const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const config = useMemo(() => ({
    positive: { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', icon: <ThumbsUp className="w-5 h-5 text-green-500" />, badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />, badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    negative: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: <AlertTriangle className="w-5 h-5 text-red-500" />, badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: <Zap className="w-5 h-5 text-blue-500" />, badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  }), [])
  
  const c = config[insight.type]

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      className={`flex items-start space-x-3 p-4 rounded-xl border ${c.bg}`}>
      <div className="flex-shrink-0">{c.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${c.badge}`}>{insight.type}</span>
          {insight.change && (
            <span className={`text-xs font-medium ${insight.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {insight.change > 0 ? '+' : ''}{insight.change}%
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{insight.title}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
      </div>
    </motion.div>
  )
}

// ============================================
// RADAR CHART (Skills Overview)
// ============================================
const SkillsRadar: React.FC<{
  data: { skill: string; value: number; fullMark: number }[]
  height?: number
}> = ({ data, height = 300 }) => {
  const centerX = 150
  const centerY = 150
  const radius = 120
  const angleStep = (2 * Math.PI) / data.length
  
  const getPoint = useCallback((index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }, [angleStep])
  
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1]
  const dataPoints = useMemo(() => data.map((d, i) => getPoint(i, d.value)), [data, getPoint])
  const dataPath = useMemo(() => 
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z',
    [dataPoints]
  )

  return (
    <div className="flex justify-center">
      <svg width={300} height={height} viewBox="0 0 300 300">
        {gridLevels.map((level, i) => {
          const points = data.map((_, index) => getPoint(index, level * 100))
          const path = points.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}
        
        {data.map((_, i) => {
          const point = getPoint(i, 100)
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}
        
        <motion.path
          d={dataPath}
          fill="#8b5cf6"
          fillOpacity={0.3}
          stroke="#8b5cf6"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="#8b5cf6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.1 }}
          />
        ))}
        
        {data.map((d, i) => {
          const point = getPoint(i, 110)
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {d.skill}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ============================================
// HEATMAP COMPONENT
// ============================================
const Heatmap: React.FC<{
  data: { day: string; hour: number; value: number }[][]
  days: string[]
  hours: number[]
  colorScale: string[]
}> = ({ data, days, hours, colorScale }) => {
  const maxValue = useMemo(() => Math.max(...data.flat().map(d => d.value), 1), [data])
  
  const getColor = useCallback((value: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-700'
    const index = Math.min(Math.floor((value / maxValue) * (colorScale.length - 1)), colorScale.length - 1)
    return colorScale[index]
  }, [maxValue, colorScale])

  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        <div className="flex">
          <div className="w-12" />
          {hours.map(hour => (
            <div key={hour} className="w-8 text-xs text-gray-500 dark:text-gray-400 text-center">
              {hour}h
            </div>
          ))}
        </div>
        {data.map((row, dayIndex) => (
          <div key={dayIndex} className="flex items-center">
            <div className="w-12 text-xs text-gray-500 dark:text-gray-400">{days[dayIndex]}</div>
            {row.map((cell, hourIndex) => (
              <motion.div
                key={hourIndex}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (dayIndex * hours.length + hourIndex) * 0.01 }}
                className={`w-8 h-8 m-0.5 rounded cursor-pointer transition-all ${getColor(cell.value)}`}
                title={`${days[dayIndex]} ${hours[hourIndex]}:00 - ${cell.value} tasks`}
                whileHover={{ scale: 1.2, zIndex: 10 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// FUNNEL CHART
// ============================================
const FunnelVisualization: React.FC<{
  data: { name: string; value: number; fill: string }[]
}> = ({ data }) => {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data])
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(item.value / maxValue) * 100}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className="h-8 rounded-lg overflow-hidden"
          >
            <div 
              className="h-full rounded-lg"
              style={{ 
                background: item.fill,
                width: '100%',
                marginLeft: `${index * 3}%`,
                marginRight: `${index * 3}%`
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// DONUT CHART
// ============================================
const DonutChart: React.FC<{
  data: { label: string; value: number; color: string }[]
  size?: number
  thickness?: number
}> = ({ data, size = 200, thickness = 40 }) => {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])
  const radius = (size - thickness) / 2
  let cumulativePercent = 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, index) => {
          const percent = item.value / total
          const startAngle = cumulativePercent * 360
          const endAngle = (cumulativePercent + percent) * 360
          cumulativePercent += percent

          const startRad = (startAngle - 90) * (Math.PI / 180)
          const endRad = (endAngle - 90) * (Math.PI / 180)
          
          const x1 = size / 2 + radius * Math.cos(startRad)
          const y1 = size / 2 + radius * Math.sin(startRad)
          const x2 = size / 2 + radius * Math.cos(endRad)
          const y2 = size / 2 + radius * Math.sin(endRad)
          
          const largeArc = percent > 0.5 ? 1 : 0

          return (
            <motion.path
              key={index}
              d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          )
        })}
        <circle cx={size / 2} cy={size / 2} r={radius - thickness / 2} fill="white" className="dark:fill-gray-800" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</span>
      </div>
    </div>
  )
}

// ============================================
// BAR CHART
// ============================================
const BarChart: React.FC<{
  data: { label: string; value: number; color: string }[]
  height?: number
  showLabels?: boolean
}> = ({ data, height = 250, showLabels = true }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  return (
    <div className="w-full">
      <div className="flex items-end space-x-2 sm:space-x-4" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full"
            onMouseEnter={() => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}>
            <AnimatePresence>
              {hoveredBar === index && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2 py-1 mb-2 whitespace-nowrap">
                  {item.value} tasks
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`w-full rounded-t-lg bg-gradient-to-t ${item.color} relative cursor-pointer hover:opacity-80 transition-opacity`}
              style={{ minHeight: '4px', boxShadow: '0 5px 15px -5px rgba(0,0,0,0.2)' }}
            />
            {showLabels && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 hidden sm:block">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// HORIZONTAL BAR CHART
// ============================================
const HorizontalBarChart: React.FC<{
  data: { label: string; value: number; maxValue: number; color: string }[]
}> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
            <span className="text-gray-500 dark:text-gray-400">{item.value}</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / item.maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// INTERACTIVE LINE CHART
// ============================================
const InteractiveLineChart: React.FC<{
  data: Record<string, any>[]
  dataKeys: string[]
  colors: string[]
  height?: number
  showLegend?: boolean
}> = ({ data, dataKeys, colors, height = 250, showLegend = true }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const chartWidth = 800
  
  return (
    <div style={{ width: '100%', height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
        {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
          <line key={i} x1={0} y1={pos * height} x2={chartWidth} y2={pos * height} stroke="#e5e7eb" strokeDasharray="3 3" />
        ))}
        
        {dataKeys.map((key, dataIndex) => {
          const values = data.map((d) => d[key] as number)
          const max = Math.max(...values)
          const min = Math.min(...values)
          const range = max - min || 1
          
          const points = values.map((value: number, i: number) => ({
            x: (i / (values.length - 1)) * chartWidth,
            y: height - ((value - min) / range) * (height - 40) - 20,
          }))
          
          const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
          
          return (
            <g key={key}>
              <path d={pathD} fill="none" stroke={colors[dataIndex]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r={i === activeIndex ? 6 : 4} fill={colors[dataIndex]} stroke="white" strokeWidth={2}
                  onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)} style={{ cursor: 'pointer' }} />
              ))}
            </g>
          )
        })}
        
        {data.map((d, i) => (
          <text key={i} x={(i / (data.length - 1)) * chartWidth} y={height - 5} textAnchor="middle" fontSize="12" fill="#9ca3af">
            {d.name}
          </text>
        ))}
      </svg>
      
      {showLegend && (
        <div className="flex justify-center space-x-6 mt-4">
          {dataKeys.map((key, i) => (
            <div key={key} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// AREA CHART
// ============================================
const AreaChart: React.FC<{
  data: { name: string; tasks: number; completed: number }[]
  height?: number
}> = ({ data, height = 250 }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.tasks, d.completed]), 1)
  
  const getPoints = (key: 'tasks' | 'completed') => {
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * 800 + 10,
      y: 230 - (d[key] / maxValue) * 200,
    }))
  }

  const tasksPoints = getPoints('tasks')
  const completedPoints = getPoints('completed')

  const tasksPath = tasksPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const completedPath = completedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  const tasksArea = `${tasksPath} L ${tasksPoints[tasksPoints.length - 1].x} 240 L ${tasksPoints[0].x} 240 Z`
  const completedArea = `${completedPath} L ${completedPoints[completedPoints.length - 1].x} 240 L ${completedPoints[0].x} 240 Z`

  return (
    <div style={{ width: '100%', height }}>
      <svg width="100%" height={height} viewBox="0 0 820 250" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="tasksGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="completedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {[0, 50, 100, 150, 200].map((y, i) => (
          <line key={i} x1={0} y1={y} x2={820} y2={y} stroke="#e5e7eb" strokeDasharray="3 3" />
        ))}
        
        <path d={tasksArea} fill="url(#tasksGrad)" />
        <path d={completedArea} fill="url(#completedGrad)" />
        <path d={tasksPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d={completedPath} fill="none" stroke="#10b981" strokeWidth="2" />
        
        {data.map((d, i) => (
          <text key={i} x={(i / (data.length - 1)) * 800 + 10} y={245} textAnchor="middle" fontSize="12" fill="#9ca3af">
            {d.name}
          </text>
        ))}
      </svg>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// NOTIFICATION CENTER (with dark mode)
// ============================================
const NotificationCenter: React.FC<{
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onClearAll: () => void
}> = ({ notifications, onMarkRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])
  
  const getNotificationIcon = useCallback((type: Notification['type']) => {
    switch (type) {
      case 'alert': return { Icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' }
      case 'warning': return { Icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
      case 'success': return { Icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' }
      default: return { Icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' }
    }
  }, [])

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <button
                  onClick={onClearAll}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Clear all
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notification => {
                  const { Icon, color, bg } = getNotificationIcon(notification.type)
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => onMarkRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-lg ${bg}`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.timestamp}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// MAIN ANALYTICS COMPONENT
// ============================================
export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'area' | 'donut'>('bar')
  const [showFilters, setShowFilters] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '30d',
    departments: [],
    statuses: [],
    priorities: [],
    teamMembers: [],
    searchQuery: ''
  })

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark'
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    addNotification('success', `Switched to ${newDarkMode ? 'dark' : 'light'} mode`)
  }

  const dashboardRef = useRef<HTMLDivElement>(null)

  const addNotification = (type: Notification['type'], message: string) => {
    setNotifications(prev => [{
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toLocaleString(),
      read: false
    }, ...prev])
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRefreshing(false)
    addNotification('success', 'Dashboard data refreshed')
  }, [])

  const handleExport = useCallback((config: ExportConfig) => {
    console.log('Exporting with config:', config)
    setShowExport(false)
    addNotification('success', `Dashboard exported as ${config.format.toUpperCase()}`)
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // ============================================
  // MOCK DATA
  // ============================================
  const metrics: MetricCard[] = useMemo(() => [
    { id: '1', label: 'Total Tasks', value: 248, change: 12.5, changeType: 'increase', icon: ListTodo, color: 'blue', sparkline: [10, 15, 8, 22, 18, 25, 20, 30, 28, 35], target: 300, forecast: 280, historicalAvg: 220 },
    { id: '2', label: 'Completed', value: 189, change: 8.3, changeType: 'increase', icon: CheckCircle2, color: 'green', sparkline: [5, 10, 15, 12, 20, 18, 25, 22, 30, 28], target: 200, forecast: 195, historicalAvg: 170 },
    { id: '3', label: 'In Progress', value: 42, change: -3.2, changeType: 'decrease', icon: Clock, color: 'orange', sparkline: [8, 6, 10, 7, 9, 5, 8, 6, 7, 5], target: 35, forecast: 40, historicalAvg: 45 },
    { id: '4', label: 'Overdue', value: 7, change: 15.8, changeType: 'increase', icon: AlertTriangle, color: 'red', sparkline: [2, 1, 3, 2, 4, 3, 5, 4, 6, 7], target: 3, forecast: 5, historicalAvg: 8 },
    { id: '5', label: 'Team Members', value: 12, change: 0, changeType: 'neutral', icon: Users, color: 'purple', sparkline: [10, 10, 11, 11, 12, 12, 12, 12, 12, 12], target: 12, forecast: 12, historicalAvg: 10 },
    { id: '6', label: 'Productivity', value: 87, change: 5.1, changeType: 'increase', icon: TrendingUp, color: 'indigo', sparkline: [75, 78, 80, 82, 83, 85, 84, 86, 87, 87], target: 90, forecast: 89, historicalAvg: 82 },
  ], [])

  const weeklyData = useMemo(() => [
    { name: 'Mon', tasks: 28, completed: 22, inProgress: 6 },
    { name: 'Tue', tasks: 35, completed: 30, inProgress: 5 },
    { name: 'Wed', tasks: 42, completed: 38, inProgress: 4 },
    { name: 'Thu', tasks: 30, completed: 25, inProgress: 5 },
    { name: 'Fri', tasks: 38, completed: 32, inProgress: 6 },
    { name: 'Sat', tasks: 15, completed: 14, inProgress: 1 },
    { name: 'Sun', tasks: 8, completed: 8, inProgress: 0 },
  ], [])

  const taskDistribution = useMemo(() => [
    { label: 'Completed', value: 189, color: '#10b981' },
    { label: 'In Progress', value: 42, color: '#3b82f6' },
    { label: 'Review', value: 15, color: '#8b5cf6' },
    { label: 'To Do', value: 35, color: '#f59e0b' },
    { label: 'Backlog', value: 20, color: '#6b7280' },
  ], [])

  const teamProductivity: TeamMember[] = useMemo(() => [
    { id: '1', name: 'Alice Johnson', avatar: 'AJ', email: 'alice@example.com', role: 'Lead Designer', department: 'Design',
      tasksCompleted: 45, tasksInProgress: 3, productivity: 92, trend: [85, 87, 88, 90, 91, 92],
      skills: ['UI Design', 'UX Research', 'Prototyping', 'Design Systems'], currentProject: 'Dashboard Redesign', availability: 85, attendance: 98 },
    { id: '2', name: 'Bob Smith', avatar: 'BS', email: 'bob@example.com', role: 'Senior Developer', department: 'Engineering',
      tasksCompleted: 38, tasksInProgress: 5, productivity: 87, trend: [80, 82, 84, 85, 86, 87],
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'], currentProject: 'API Development', availability: 70, attendance: 95 },
    { id: '3', name: 'Charlie Brown', avatar: 'CB', email: 'charlie@example.com', role: 'Backend Developer', department: 'Engineering',
      tasksCompleted: 28, tasksInProgress: 2, productivity: 78, trend: [70, 72, 74, 75, 77, 78],
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'], currentProject: 'API Development', availability: 90, attendance: 92 },
    { id: '4', name: 'Diana Prince', avatar: 'DP', email: 'diana@example.com', role: 'QA Engineer', department: 'Engineering',
      tasksCompleted: 52, tasksInProgress: 1, productivity: 95, trend: [90, 91, 92, 93, 94, 95],
      skills: ['Test Automation', 'Selenium', 'Jest', 'CI/CD'], currentProject: 'Mobile App', availability: 60, attendance: 100 },
  ], [])

  const projects: Project[] = useMemo(() => [
    { id: 'p1', name: 'Dashboard Redesign', description: 'Complete overhaul of the main dashboard with new features',
      progress: 75, status: 'on_track', priority: 'high', tasksTotal: 24, tasksCompleted: 18,
      dueDate: '2026-06-15', startDate: '2026-03-01', team: ['AJ', 'BS', 'CB'], budget: 50000, spent: 35000,
      tags: ['UI/UX', 'Frontend'], milestones: [
        { name: 'Research', completed: true, date: '2026-03-15' },
        { name: 'Design', completed: true, date: '2026-04-15' },
        { name: 'Development', completed: false, date: '2026-05-30' },
        { name: 'Testing', completed: false, date: '2026-06-10' },
      ] },
    { id: 'p2', name: 'API Development', description: 'Build and deploy RESTful APIs for mobile and web clients',
      progress: 45, status: 'at_risk', priority: 'critical', tasksTotal: 36, tasksCompleted: 16,
      dueDate: '2026-06-01', startDate: '2026-02-15', team: ['BS', 'CB'], budget: 80000, spent: 60000,
      tags: ['Backend', 'Infrastructure'], milestones: [
        { name: 'Architecture', completed: true, date: '2026-03-01' },
        { name: 'Core APIs', completed: true, date: '2026-04-15' },
        { name: 'Integration', completed: false, date: '2026-05-15' },
        { name: 'Deployment', completed: false, date: '2026-05-30' },
      ] },
    { id: 'p3', name: 'Mobile App', description: 'Cross-platform mobile application for iOS and Android',
      progress: 90, status: 'on_track', priority: 'high', tasksTotal: 40, tasksCompleted: 36,
      dueDate: '2026-05-30', startDate: '2026-01-01', team: ['AJ', 'DP'], budget: 120000, spent: 110000,
      tags: ['Mobile', 'Cross-platform'], milestones: [
        { name: 'MVP', completed: true, date: '2026-02-28' },
        { name: 'Beta', completed: true, date: '2026-04-15' },
        { name: 'Testing', completed: true, date: '2026-05-15' },
        { name: 'Release', completed: false, date: '2026-05-30' },
      ] },
  ], [])

  const insights: Insight[] = useMemo(() => [
    { id: 'i1', type: 'positive', title: 'Productivity Increase', description: 'Team productivity has increased by 5.1% this month. Alice and Diana are leading the improvement.', change: 5.1, confidence: 95, actionable: false },
    { id: 'i2', type: 'warning', title: 'API Project at Risk', description: 'The API Development project is behind schedule. Consider adding resources or adjusting the timeline.', metric: 'Progress', confidence: 87, actionable: true, suggestions: ['Add 1-2 developers', 'Extend deadline by 2 weeks', 'Reduce scope for MVP'] },
    { id: 'i3', type: 'info', title: 'Optimal Meeting Time', description: 'Based on team activity patterns, Tuesday at 10 AM is the most productive meeting time.', metric: 'Analysis', confidence: 78, actionable: false },
    { id: 'i4', type: 'negative', title: 'Overdue Tasks Increasing', description: 'Overdue tasks have increased by 15.8%. Review priorities and deadlines.', change: 15.8, confidence: 92, actionable: true, suggestions: ['Schedule priority review', 'Redistribute workload', 'Set stricter deadlines'] },
  ], [])

  const skillsData = useMemo(() => [
    { skill: 'Frontend', value: 88, fullMark: 100 },
    { skill: 'Backend', value: 75, fullMark: 100 },
    { skill: 'DevOps', value: 65, fullMark: 100 },
    { skill: 'Design', value: 82, fullMark: 100 },
    { skill: 'Testing', value: 90, fullMark: 100 },
    { skill: 'Architecture', value: 70, fullMark: 100 },
  ], [])

  const funnelData = useMemo(() => [
    { name: 'Leads', value: 1000, fill: '#3b82f6' },
    { name: 'Qualified', value: 750, fill: '#8b5cf6' },
    { name: 'Proposal', value: 500, fill: '#ec4899' },
    { name: 'Negotiation', value: 300, fill: '#f59e0b' },
    { name: 'Closed', value: 150, fill: '#10b981' },
  ], [])

  const heatmapData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const hours = Array.from({ length: 9 }, (_, i) => i + 9)
    
    return days.map(day => 
      hours.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 20) + (hour >= 10 && hour <= 15 ? 10 : 0)
      }))
    )
  }, [])

  const priorityData = useMemo(() => [
    { label: 'Critical', value: 12, maxValue: 50, color: 'from-red-500 to-red-400' },
    { label: 'High', value: 28, maxValue: 50, color: 'from-orange-500 to-orange-400' },
    { label: 'Medium', value: 35, maxValue: 50, color: 'from-yellow-500 to-yellow-400' },
    { label: 'Low', value: 25, maxValue: 50, color: 'from-green-500 to-green-400' },
  ], [])

  const completionTrends = useMemo(() => [
    { label: 'This Week', completed: 35, total: 42, percentage: 83, color: 'from-blue-500 to-blue-400' },
    { label: 'Last Week', completed: 28, total: 38, percentage: 74, color: 'from-purple-500 to-purple-400' },
    { label: 'Two Weeks Ago', completed: 31, total: 40, percentage: 78, color: 'from-indigo-500 to-indigo-400' },
  ], [])

  const quickStats: QuickStat[] = useMemo(() => [
    { icon: Clock, label: 'Avg. Completion Time', value: '2.4 days', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: -12 },
    { icon: Target, label: 'On-Time Rate', value: '94%', color: 'text-green-500 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', trend: 3 },
    { icon: Flame, label: 'Current Streak', value: '12 days', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', trend: 5 },
    { icon: Award, label: 'Top Performer', value: 'Diana P.', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: 0 },
    { icon: DollarSign, label: 'Budget Utilization', value: '73%', color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', trend: -5 },
    { icon: GitBranch, label: 'Active Branches', value: '18', color: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', trend: 2 },
  ], [])

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400" />
            <div className="absolute inset-2 rounded-full border-4 border-purple-200 dark:border-purple-800 border-b-purple-500 dark:border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Loading Analytics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 dark:text-gray-400"
          >
            Crunching the numbers...
          </motion.p>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"
          />
        </div>
      </div>
    )
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300" ref={dashboardRef}>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
            >
              Analytics Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 }} 
              className="text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Real-time performance, productivity, and team insights</span>
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </motion.button>

            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
              {[
                { value: '7d' as const, label: '7D' },
                { value: '30d' as const, label: '30D' },
                { value: '90d' as const, label: '90D' },
                { value: '1y' as const, label: '1Y' },
                { value: 'custom' as const, label: 'Custom' },
              ].map((range) => (
                <motion.button
                  key={range.value}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range.value
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {range.label}
                </motion.button>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
              disabled={refreshing}
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <NotificationCenter
              notifications={notifications}
              onMarkRead={markNotificationRead}
              onClearAll={clearAllNotifications}
            />

            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExport(true)}
              className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.slice(0, 6).map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard3D metric={metric} />
            </motion.div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card3D className="lg:col-span-2 p-6" depth={25} glow animation="slide" delay={0.2}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Activity</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily task completion and progress</p>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {[
                  { type: 'bar' as const, icon: BarChart3 },
                  { type: 'line' as const, icon: ChartLine },
                  { type: 'area' as const, icon: ChartArea },
                  { type: 'donut' as const, icon: ChartPie },
                ].map(({ type, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setActiveChart(type)}
                    className={`p-2 rounded-lg transition-all ${
                      activeChart === type 
                        ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {activeChart === 'bar' && (
                <motion.div key="bar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <BarChart data={weeklyData.map(d => ({ label: d.name, value: d.tasks, color: 'from-blue-500 to-blue-400' }))} height={250} />
                </motion.div>
              )}
              
              {activeChart === 'line' && (
                <motion.div key="line" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <InteractiveLineChart data={weeklyData} dataKeys={['tasks', 'completed']} colors={['#3b82f6', '#10b981']} height={250} />
                </motion.div>
              )}
              
              {activeChart === 'area' && (
                <motion.div key="area" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <AreaChart data={weeklyData} height={250} />
                </motion.div>
              )}
              
              {activeChart === 'donut' && (
                <motion.div key="donut" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center space-x-8 flex-wrap">
                  <DonutChart data={taskDistribution} size={250} thickness={40} />
                  <div className="space-y-3">
                    {taskDistribution.map((item, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card3D>

          <Card3D className="p-6" depth={20} glow animation="slide" delay={0.3}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3>
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-purple-500 font-medium">Powered by AI</span>
              </div>
            </div>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <motion.div key={insight.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}>
                  <InsightCard insight={insight} />
                </motion.div>
              ))}
            </div>
          </Card3D>
        </div>

        {/* ADVANCED CHARTS ROW - Radar & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card3D className="p-6" depth={15} animation="fade" delay={0.4}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Skills Overview</h3>
              <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors">View Details</button>
            </div>
            <SkillsRadar data={skillsData} height={300} />
          </Card3D>

          <Card3D className="p-6" depth={15} animation="fade" delay={0.5}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Heatmap</h3>
              <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors">Export</button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Task activity distribution by day and hour</p>
            <Heatmap
              data={heatmapData}
              days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
              hours={Array.from({ length: 9 }, (_, i) => i + 9)}
              colorScale={[
                'bg-gray-100 dark:bg-gray-700', 'bg-green-200 dark:bg-green-900/40', 'bg-green-300 dark:bg-green-800/60',
                'bg-green-400 dark:bg-green-700/80', 'bg-green-500 dark:bg-green-600', 'bg-green-600 dark:bg-green-500',
              ]}
            />
          </Card3D>
        </div>

        {/* TEAM & PROJECTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card3D className="p-6" depth={20} animation="slide" delay={0.6}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Productivity</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
            </div>
            <div className="space-y-4">
              {teamProductivity.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-colors cursor-pointer ${
                    selectedTeamMember === member.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                  }`}
                  onClick={() => setSelectedTeamMember(selectedTeamMember === member.id ? null : member.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{member.productivity}%</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.tasksCompleted} tasks</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${member.productivity}%` }}
                        transition={{ duration: 1, delay: 0.1 * index }}
                        className={`h-full rounded-full ${
                          member.productivity >= 90 ? 'bg-green-500' :
                          member.productivity >= 80 ? 'bg-blue-500' :
                          member.productivity >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                      />
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <Sparkline data={member.trend} color="#3b82f6" height={20} showDots={false} />
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
                    selectedTeamMember === member.id ? 'rotate-180' : ''
                  }`} />
                </motion.div>
              ))}
            </div>
          </Card3D>

          <Card3D className="p-6" depth={20} animation="slide" delay={0.7}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
              <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        project.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        project.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                        project.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {project.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        project.status === 'on_track' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        project.status === 'at_risk' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        project.status === 'behind' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        project.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{project.tasksCompleted}/{project.tasksTotal} tasks</span>
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.1 * index }}
                      className={`h-full rounded-full ${
                        project.progress >= 75 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        project.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        project.progress >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`} 
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white mix-blend-difference">
                        {project.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.map((avatar, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                          title={avatar}
                        >
                          {avatar}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <DollarSign className="w-3 h-3" />
                      <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card3D>
        </div>

        {/* BOTTOM ROW - Priority, Funnel, Completion Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card3D className="p-6" depth={15} animation="fade" delay={0.8}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Priority Distribution</h3>
            <HorizontalBarChart data={priorityData} />
          </Card3D>

          <Card3D className="p-6" depth={15} animation="fade" delay={0.9}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Funnel</h3>
            <FunnelVisualization data={funnelData} />
          </Card3D>

          <Card3D className="p-6" depth={15} animation="fade" delay={1.0}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Completion Trends</h3>
            <div className="space-y-3">
              {completionTrends.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.completed}/{item.total}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * i }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card3D>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickStats.map((stat, i) => {
            const IconComponent = stat.icon
            return (
              <Card3D key={i} className="p-4" depth={10} animation="fade" delay={1.1 + i * 0.05}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <div className="flex items-center space-x-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                      {stat.trend !== 0 && (
                        <span className={`text-xs font-medium ${
                          stat.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {stat.trend > 0 ? '+' : ''}{stat.trend}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card3D>
            )
          })}
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 py-4"
        >
          <p>Last updated: {new Date().toLocaleString()}</p>
        </motion.div>
      </div>

      {/* BACKGROUND OVERLAY FOR MODALS */}
      <AnimatePresence>
        {(showFilters || showExport) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={() => {
              setShowFilters(false)
              setShowExport(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}