// src/pages/About.tsx - Comprehensive About Page with Dark/Light Mode
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ListTodo, Users, Target, Clock, Shield, Zap, 
  Mail, Heart, Star, Award, Globe, Cloud, Lock, 
  Smartphone, Monitor, Code, Sparkles, Rocket, CheckCircle2,
  Coffee, MapPin, Calendar, Briefcase, GraduationCap, MessageCircle,
  BookOpen, Film, Music, Gamepad2, Dumbbell, Camera,
  ChevronRight, ExternalLink, Download, Share2, Copy,
  Sun, Moon, Laptop, Database, Server, Cpu, HardDrive,
  GitBranch, Terminal, Box, Package, Layers, Wifi, Palette
} from 'lucide-react'

// ============================================
// CUSTOM SOCIAL ICONS
// ============================================
const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.142-12.401c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
  </svg>
)

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.3-.536-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

// ============================================
// TYPES
// ============================================
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  location: string
  joinedDate: string
  email: string
  hobbies: string[]
  skills: string[]
  social: { icon: React.ElementType; url: string; label: string }[]
}

interface Milestone {
  year: string
  title: string
  description: string
  icon: React.ElementType
}

interface Stat {
  value: string
  label: string
  icon: React.ElementType
  color: string
}

// ============================================
// COMPONENTS
// ============================================
const TeamMemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative h-[400px] cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Front Side */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600" />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white dark:border-gray-800">
                {member.avatar}
              </div>
            </div>
          </div>
          <div className="pt-14 pb-4 px-4 text-center">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{member.name}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">{member.role}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>{member.location}</span>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {member.social.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-blue-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back Side */}
      <motion.div
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 overflow-y-auto"
        style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{member.bio}</p>
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 4).map(skill => (
                <span key={skill} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Interests</p>
            <div className="flex flex-wrap gap-1">
              {member.hobbies.map(hobby => (
                <span key={hobby} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Joined {member.joinedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Mail className="w-3 h-3" />
            <span>{member.email}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const MilestoneTimeline: React.FC<{ milestones: Milestone[] }> = ({ milestones }) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            <div className="absolute left-0 top-1 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
              <milestone.icon className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{milestone.year}</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const TechStackCard: React.FC<{ name: string; icon: React.ElementType; category: string; description: string }> = ({ 
  name, icon: Icon, category, description 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-xs text-blue-600 dark:text-blue-400">{category}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  </div>
)

// ============================================
// MAIN COMPONENT
// ============================================
export default function About() {
  const [activeTab, setActiveTab] = useState<'about' | 'team' | 'tech' | 'milestones'>('about')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  const stats: Stat[] = [
    { value: '10,000+', label: 'Active Users', icon: Users, color: 'from-blue-500 to-blue-600' },
    { value: '500,000+', label: 'Tasks Completed', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
    { value: '4.9/5', label: 'User Rating', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { value: '24/7', label: 'Support', icon: Clock, color: 'from-purple-500 to-purple-600' },
  ]

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed with instant updates and real-time sync' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 Type II certified with AES-256 encryption' },
    { icon: Users, title: 'Team Collaboration', description: 'Real-time comments, mentions, and activity feeds' },
    { icon: Cloud, title: 'Cloud Native', description: 'Access from anywhere, auto-sync across all devices' },
    { icon: Smartphone, title: 'Mobile Ready', description: 'Fully responsive design that works on any screen size' },
    { icon: Lock, title: 'Data Privacy', description: 'Your data stays yours with GDPR and CCPA compliance' },
    { icon: Rocket, title: 'Automation', description: 'Automate repetitive tasks with smart workflows' },
    { icon: Award, title: '99.9% Uptime', description: 'Enterprise-grade reliability with global infrastructure' },
  ]

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'CEO & Founder',
      avatar: 'AJ',
      bio: 'Former Google product manager with 10+ years of experience in productivity software. Passionate about helping teams work better together.',
      location: 'San Francisco, CA',
      joinedDate: 'Jan 2020',
      email: 'alice@taskcollab.com',
      hobbies: ['Running', 'Reading', 'Travel'],
      skills: ['Leadership', 'Product Strategy', 'UX Design'],
      social: [
        { icon: TwitterIcon, url: '#', label: 'Twitter' },
        { icon: LinkedInIcon, url: '#', label: 'LinkedIn' },
      ]
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'CTO',
      avatar: 'BS',
      bio: 'Full-stack architect with expertise in scalable systems. Previously led engineering teams at Stripe and built high-performance applications.',
      location: 'Seattle, WA',
      joinedDate: 'Mar 2020',
      email: 'bob@taskcollab.com',
      hobbies: ['Guitar', 'Chess', 'Hiking'],
      skills: ['System Architecture', 'TypeScript', 'Cloud Infrastructure'],
      social: [
        { icon: GithubIcon, url: '#', label: 'GitHub' },
        { icon: TwitterIcon, url: '#', label: 'Twitter' },
      ]
    },
    {
      id: '3',
      name: 'Charlie Brown',
      role: 'Lead Developer',
      avatar: 'CB',
      bio: 'Open source enthusiast and React expert. Loves building beautiful, performant user interfaces and mentoring junior developers.',
      location: 'Austin, TX',
      joinedDate: 'Jun 2020',
      email: 'charlie@taskcollab.com',
      hobbies: ['Gaming', 'Cooking', 'Podcasts'],
      skills: ['React', 'Node.js', 'GraphQL'],
      social: [
        { icon: GithubIcon, url: '#', label: 'GitHub' },
      ]
    },
    {
      id: '4',
      name: 'Diana Prince',
      role: 'Product Manager',
      avatar: 'DP',
      bio: 'Data-driven product leader who bridges the gap between business needs and technical implementation. Focused on user-centric design.',
      location: 'New York, NY',
      joinedDate: 'Sep 2020',
      email: 'diana@taskcollab.com',
      hobbies: ['Photography', 'Yoga', 'Painting'],
      skills: ['Product Analytics', 'User Research', 'Agile'],
      social: [
        { icon: LinkedInIcon, url: '#', label: 'LinkedIn' },
      ]
    },
    {
      id: '5',
      name: 'Eve Wilson',
      role: 'UX Designer',
      avatar: 'EW',
      bio: 'Award-winning designer passionate about creating inclusive, accessible experiences. Advocate for design systems and user testing.',
      location: 'Portland, OR',
      joinedDate: 'Jan 2021',
      email: 'eve@taskcollab.com',
      hobbies: ['Illustration', 'Journaling', 'Gardening'],
      skills: ['Figma', 'User Testing', 'Accessibility'],
      social: [
        { icon: TwitterIcon, url: '#', label: 'Twitter' },
        { icon: LinkedInIcon, url: '#', label: 'LinkedIn' },
      ]
    },
    {
      id: '6',
      name: 'Frank Miller',
      role: 'DevOps Engineer',
      avatar: 'FM',
      bio: 'Infrastructure specialist focused on reliability, scalability, and automation. Ensures the platform stays fast and available.',
      location: 'Denver, CO',
      joinedDate: 'Apr 2021',
      email: 'frank@taskcollab.com',
      hobbies: ['DJing', 'Snowboarding', 'DIY'],
      skills: ['AWS', 'Kubernetes', 'Terraform'],
      social: [
        { icon: GithubIcon, url: '#', label: 'GitHub' },
      ]
    },
  ]

  const milestones: Milestone[] = [
    { year: '2020', title: 'Company Founded', description: 'TaskCollab was founded with a mission to revolutionize task management.', icon: Rocket },
    { year: '2021', title: 'First Product Launch', description: 'Released v1.0 to early access users with core task management features.', icon: Sparkles },
    { year: '2022', title: 'Team Collaboration', description: 'Launched real-time collaboration, comments, and team workspaces.', icon: Users },
    { year: '2023', title: '10,000 Users', description: 'Reached 10,000 active users milestone across 500+ companies.', icon: Award },
    { year: '2024', title: 'Enterprise Ready', description: 'Released enterprise features including SSO, audit logs, and SLA guarantees.', icon: Shield },
    { year: '2025', title: 'AI Integration', description: 'Launched AI-powered task prioritization and smart scheduling.', icon: Cpu },
  ]

  const techStack = [
    { name: 'React 18', icon: Code, category: 'Frontend', description: 'Modern UI library for building interactive interfaces' },
    { name: 'TypeScript', icon: Terminal, category: 'Language', description: 'Type-safe JavaScript for better reliability' },
    { name: 'Tailwind CSS', icon: Palette, category: 'Styling', description: 'Utility-first CSS framework for rapid UI development' },
    { name: 'Framer Motion', icon: Sparkles, category: 'Animation', description: 'Production-ready animation library for React' },
    { name: 'Vite', icon: Zap, category: 'Build Tool', description: 'Next-generation frontend tooling' },
    { name: 'Node.js', icon: Server, category: 'Backend', description: 'JavaScript runtime for scalable server applications' },
    { name: 'PostgreSQL', icon: Database, category: 'Database', description: 'Powerful open-source relational database' },
    { name: 'Redis', icon: Box, category: 'Cache', description: 'In-memory data structure store for caching' },
    { name: 'AWS', icon: Cloud, category: 'Infrastructure', description: 'Cloud services for global scalability' },
    { name: 'Docker', icon: Box, category: 'Containerization', description: 'Container platform for consistent deployment' },
    { name: 'Kubernetes', icon: Layers, category: 'Orchestration', description: 'Container orchestration for microservices' },
    { name: 'GraphQL', icon: GitBranch, category: 'API', description: 'Query language for efficient data fetching' },
  ]

  const values = [
    { icon: Heart, title: 'User First', description: 'Every decision starts with our users\' needs' },
    { icon: Shield, title: 'Privacy by Design', description: 'Data protection built into our DNA' },
    { icon: Zap, title: 'Ship Fast', description: 'Move quickly while maintaining quality' },
    { icon: Users, title: 'Inclusive Culture', description: 'Diverse perspectives make us stronger' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
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

        {/* Hero Section */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ListTodo className="w-14 h-14 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            TaskCollab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 mt-2"
          >
            Version 3.2.1 | Enterprise Edition
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {[
            { id: 'about', label: 'About', icon: Heart },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'tech', label: 'Tech Stack', icon: Code },
            { id: 'milestones', label: 'Milestones', icon: Award },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Mission Statement */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  To empower teams worldwide with intuitive, powerful, and secure collaboration tools 
                  that transform how work gets done. We believe that great software should be both 
                  beautiful and functional, making productivity feel effortless.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white text-center shadow-lg`}
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-90" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs opacity-90">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Company Values */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Our Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {values.map((value, i) => (
                    <div key={i} className="text-center p-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{value.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Grid */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Why Choose TaskCollab?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meet the Team</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">The passionate people behind TaskCollab</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, i) => (
                  <TeamMemberCard key={member.id} member={member} index={i} />
                ))}
              </div>
              
              {/* Join Our Team */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center mt-6">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Join Our Team</h3>
                <p className="text-blue-100 mb-4">We're always looking for talented individuals to join our mission</p>
                <button className="px-5 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  View Open Positions
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'tech' && (
            <motion.div
              key="tech"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Technology Stack</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Built with modern, reliable technologies</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techStack.map((tech, i) => (
                  <TechStackCard key={i} {...tech} />
                ))}
              </div>

              {/* Architecture Diagram */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-500" />
                  System Architecture
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 text-center">
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto">
                        <Smartphone className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-xs mt-1 dark:text-gray-400">Client</p>
                    </div>
                    <div className="flex items-center text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto">
                        <Cloud className="w-8 h-8 text-purple-500" />
                      </div>
                      <p className="text-xs mt-1 dark:text-gray-400">CDN</p>
                    </div>
                    <div className="flex items-center text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto">
                        <Server className="w-8 h-8 text-green-500" />
                      </div>
                      <p className="text-xs mt-1 dark:text-gray-400">API Gateway</p>
                    </div>
                    <div className="flex items-center text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto">
                        <Database className="w-8 h-8 text-orange-500" />
                      </div>
                      <p className="text-xs mt-1 dark:text-gray-400">Database</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Source */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <GithubIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Open Source Commitment</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  TaskCollab is built on open source technologies. We believe in giving back to the community 
                  and have open-sourced several of our internal tools and libraries.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <GithubIcon className="w-4 h-4" />
                    View on GitHub
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Star className="w-4 h-4" />
                    Star us on GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Journey</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Key milestones in TaskCollab's history</p>
              </div>
              
              <MilestoneTimeline milestones={milestones} />

              {/* Future Roadmap */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">What's Next?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center p-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Q3</span>
                    </div>
                    <p className="text-sm font-medium dark:text-gray-300">AI Task Automation</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Q4</span>
                    </div>
                    <p className="text-sm font-medium dark:text-gray-300">Native Mobile Apps</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2026</span>
                    </div>
                    <p className="text-sm font-medium dark:text-gray-300">Enterprise AI Suite</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with <Heart className="w-3 h-3 inline text-red-500 animate-pulse" /> by the TaskCollab Team
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3">
            <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</a>
            <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</a>
            <a href="/accessibility" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Accessibility</a>
            <a href="/shortcuts" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Keyboard Shortcuts</a>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            © 2024 TaskCollab, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}