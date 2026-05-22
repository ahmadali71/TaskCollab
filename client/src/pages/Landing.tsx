// src/pages/Landing.tsx - Complete Marketing Landing Page
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Star, Zap, Shield, Users,
  BarChart3, Clock, Cloud, Smartphone, Globe,
  Mail, Menu, X, Play, ChevronRight,
  Download, Heart, TrendingUp, MessageSquare,
  Activity, GitBranch, Check, Sparkles, Target,
  Award, Flame, ThumbsUp, RefreshCw, Send,
  Monitor, Moon, Sun, Layout, Palette, Code
} from 'lucide-react'

// ============================================
// COMPONENTS
// ============================================

// Animated Counter
const AnimatedCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = value
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

// Feature Card
const FeatureCard: React.FC<{
  icon: React.ElementType
  title: string
  description: string
  delay?: number
}> = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </motion.div>
)

// Testimonial Card
const TestimonialCard: React.FC<{
  quote: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
}> = ({ quote, name, role, company, avatar, rating }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
  >
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
    <p className="text-gray-600 italic mb-6 leading-relaxed">"{quote}"</p>
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
        {avatar}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{role} at {company}</p>
      </div>
    </div>
  </motion.div>
)

// Pricing Card
const PricingCard: React.FC<{
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
  color?: string
}> = ({ name, price, period, description, features, cta, popular, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: popular ? 1.05 : 1.02 }}
    className={`relative rounded-2xl p-8 ${
      popular
        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white ring-4 ring-blue-200 scale-105 shadow-2xl'
        : 'bg-white border border-gray-200 shadow-lg'
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold shadow-lg">
        Most Popular
      </div>
    )}
    <h3 className={`text-2xl font-bold ${popular ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
    <p className={`mt-2 ${popular ? 'text-white/70' : 'text-gray-500'}`}>{description}</p>
    <div className="mt-6 mb-8">
      <span className={`text-5xl font-bold ${popular ? 'text-white' : 'text-gray-900'}`}>{price}</span>
      {period && <span className={popular ? 'text-white/70' : 'text-gray-500'}>/{period}</span>}
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center space-x-3">
          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${popular ? 'text-white' : 'text-green-500'}`} />
          <span className={popular ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
        </li>
      ))}
    </ul>
    <Link
      to="/register"
      className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all ${
        popular
          ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {cta}
    </Link>
  </motion.div>
)

// ============================================
// MAIN LANDING COMPONENT
// ============================================
export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0.95])

  const features = [
    { icon: Sparkles, title: 'AI-Powered Intelligence', description: 'Natural language task creation, smart prioritization, and automatic task decomposition using advanced AI models.' },
    { icon: Users, title: 'Real-Time Collaboration', description: 'Live cursors, presence indicators, instant updates, and threaded comments for seamless team coordination.' },
    { icon: Shield, title: 'Enterprise Security', description: 'End-to-end encryption, SOC 2 compliance, SSO support, and role-based access control for complete data protection.' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Custom dashboards, predictive insights, team performance metrics, and automated weekly reports.' },
    { icon: Layout, title: 'Multiple Views', description: 'Kanban boards, list views, calendar layouts, Gantt charts, and timeline views for any workflow.' },
    { icon: Smartphone, title: 'Mobile First Design', description: 'Fully responsive interface with touch gestures, offline support, and push notifications.' },
  ]

  const stats = [
    { value: 15000, suffix: '+', label: 'Active Users' },
    { value: 1000000, suffix: '+', label: 'Tasks Completed' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA' },
    { value: 4.9, suffix: '/5', label: 'User Rating' },
  ]

  const testimonials = [
    { quote: 'TaskCollab transformed how our team manages projects. The AI features save us hours every week.', name: 'Sarah Chen', role: 'CTO', company: 'TechVista', avatar: 'SC', rating: 5 },
    { quote: 'The real-time collaboration is incredible. Our remote team feels like we are in the same room.', name: 'James Wilson', role: 'Engineering Lead', company: 'CloudNine', avatar: 'JW', rating: 5 },
    { quote: 'We evaluated 15 tools before choosing TaskCollab. The analytics and reporting are unmatched.', name: 'Maria Garcia', role: 'Project Manager', company: 'DataFlow', avatar: 'MG', rating: 5 },
  ]

  const pricingPlans = [
    { name: 'Starter', price: 'Free', period: '', description: 'For individuals and small teams', features: ['Up to 5 members', '100 tasks', 'Basic analytics', 'Community support', '1 GB storage'], cta: 'Get Started' },
    { name: 'Professional', price: '$12', period: 'month', description: 'For growing teams', features: ['Unlimited members', 'Unlimited tasks', 'Advanced analytics', 'Priority support', 'AI features', '50+ integrations', '25 GB storage'], cta: 'Start Free Trial', popular: true },
    { name: 'Enterprise', price: 'Custom', period: '', description: 'For large organizations', features: ['Everything in Pro', 'SSO & SAML', 'Custom workflows', 'Dedicated support', '99.99% SLA', 'Unlimited storage', 'On-premise option'], cta: 'Contact Sales' },
  ]

  const logos = ['TechVista', 'CloudNine', 'DataFlow', 'NexGen', 'QuantumLab', 'SkyBridge']

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}
      <motion.nav
        style={{ opacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskCollab
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {['Features', 'Pricing', 'Testimonials', 'Docs'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              {['Features', 'Pricing', 'Testimonials', 'Docs'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <hr />
              <Link to="/login" className="block py-2 text-gray-600">Sign In</Link>
              <Link
                to="/register"
                className="block w-full text-center py-3 bg-blue-500 text-white rounded-xl font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
        
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-full text-sm font-semibold mb-6 border border-blue-200">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Task Management Platform</span>
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Manage Tasks{' '}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Smarter
                </span>
                <br />
                Not Harder
              </h1>

              <p className="text-xl lg:text-2xl text-gray-500 mt-8 max-w-2xl mx-auto leading-relaxed">
                AI-powered collaborative task management with real-time updates,
                3D visualizations, and advanced analytics. Boost team productivity by{' '}
                <span className="text-green-500 font-bold">40%</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl text-lg font-bold hover:from-blue-600 hover:to-purple-600 shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#demo"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2 group"
                >
                  <Play className="w-5 h-5 fill-blue-500 text-blue-500" />
                  <span>Watch Demo</span>
                </a>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {['AJ', 'BS', 'CB', 'DP'].map((avatar, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {avatar}
                    </div>
                  ))}
                </div>
                <span>Joined by 15,000+ professionals</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRUSTED BY */}
      {/* ============================================ */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {logos.map((logo, i) => (
              <div key={i} className="px-6 py-3 bg-white rounded-xl shadow-sm border">
                <span className="text-lg font-bold text-gray-400">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES SECTION */}
      {/* ============================================ */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-500 mt-4 max-w-2xl mx-auto">
                Powerful features designed to supercharge your team's productivity
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
                Loved by Teams
              </h2>
              <p className="text-xl text-gray-500 mt-4">
                See what our customers are saying
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING SECTION */}
      {/* ============================================ */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-500 mt-4">
                Start free, upgrade when you need more
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <PricingCard key={i} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-500 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join thousands of teams already using TaskCollab. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-lg font-bold hover:bg-gray-50 shadow-xl transition-all"
              >
                Get Started Free
              </Link>
              <a href="#demo" className="px-8 py-4 border-2 border-white text-white rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all">
                Schedule Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TaskCollab</span>
              </Link>
              <p className="text-sm leading-relaxed mb-4">
                AI-powered collaborative task management platform for modern teams.
              </p>
              <div className="flex space-x-4">
                {[MessageSquare, Globe, Code].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2026 TaskCollab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}