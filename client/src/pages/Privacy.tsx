// src/pages/Privacy.tsx - Comprehensive Privacy Policy Page
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Lock, Eye, Trash2, Download, Mail, Phone, 
  Globe, Server, Database, Cloud, Key, Fingerprint,
  Bell, Clock, FileText, CheckCircle, AlertTriangle,
  Users, Building, Cookie, CreditCard, Smartphone,
  Laptop, Wifi, ShieldCheck, UserCheck, BarChart,
  Send, MessageCircle, Heart, Award, Sparkles
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface PolicySection {
  id: string
  title: string
  icon: React.ElementType
  summary: string
  content: string[]
  subSections?: { title: string; content: string }[]
  lastUpdated?: string
}

interface CookieCategory {
  name: string
  description: string
  cookies: { name: string; purpose: string; duration: string }[]
  isEssential: boolean
}

// ============================================
// COMPONENTS
// ============================================
const SectionCard: React.FC<{ section: PolicySection; index: number; isExpanded: boolean; onToggle: () => void }> = ({ 
  section, index, isExpanded, onToggle 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start justify-between group"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
            <section.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {section.title}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{section.summary}</p>
          </div>
        </div>
        <div className="ml-4 p-1 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 pt-0 space-y-4">
              {section.content.map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              
              {section.subSections && (
                <div className="mt-4 space-y-4">
                  {section.subSections.map((sub, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{sub.title}</h3>
                      <p className="text-gray-600 text-sm">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const CookieSettings: React.FC = () => {
  const [cookieCategories, setCookieCategories] = useState<CookieCategory[]>([
    {
      name: 'Essential Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      isEssential: true,
      cookies: [
        { name: 'session_id', purpose: 'Maintain user session and authentication', duration: 'Session' },
        { name: 'csrf_token', purpose: 'Prevent cross-site request forgery attacks', duration: 'Session' },
        { name: 'security_settings', purpose: 'Store security preferences', duration: '1 year' },
      ]
    },
    {
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization.',
      isEssential: false,
      cookies: [
        { name: 'user_preferences', purpose: 'Store display preferences and settings', duration: '1 year' },
        { name: 'ui_state', purpose: 'Remember sidebar and layout preferences', duration: '6 months' },
        { name: 'recent_activity', purpose: 'Show recently accessed content', duration: '30 days' },
      ]
    },
    {
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      isEssential: false,
      cookies: [
        { name: '_ga', purpose: 'Google Analytics - distinguish users', duration: '2 years' },
        { name: '_gid', purpose: 'Google Analytics - distinguish users', duration: '24 hours' },
        { name: '_gat', purpose: 'Google Analytics - throttle request rate', duration: '1 minute' },
      ]
    },
    {
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements.',
      isEssential: false,
      cookies: [
        { name: 'personalization_id', purpose: 'Twitter - personalization', duration: '2 years' },
        { name: 'fr', purpose: 'Facebook - ad delivery', duration: '3 months' },
        { name: 'IDE', purpose: 'Google DoubleClick - ad targeting', duration: '1 year' },
      ]
    },
  ])

  const [showCookieDetails, setShowCookieDetails] = useState(false)
  const [cookieConsent, setCookieConsent] = useState<Record<string, boolean>>({
    'Essential Cookies': true,
    'Functional Cookies': true,
    'Analytics Cookies': false,
    'Marketing Cookies': false,
  })

  const handleCookieToggle = (categoryName: string) => {
    const category = cookieCategories.find(c => c.name === categoryName)
    if (category?.isEssential) return
    setCookieConsent(prev => ({ ...prev, [categoryName]: !prev[categoryName] }))
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieConsent))
    alert('Cookie preferences saved successfully!')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Cookie className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
          </div>
          <button
            onClick={() => setShowCookieDetails(!showCookieDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showCookieDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {cookieCategories.map((category) => (
          <div key={category.name} className="flex items-start justify-between py-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                {category.isEssential && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Required</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
              
              {showCookieDetails && category.cookies.length > 0 && (
                <div className="mt-3 space-y-2">
                  {category.cookies.map((cookie, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-xs text-gray-700">{cookie.name}</span>
                        <span className="text-xs text-gray-400">{cookie.duration}</span>
                      </div>
                      <p className="text-xs text-gray-500">{cookie.purpose}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={cookieConsent[category.name]}
                onChange={() => handleCookieToggle(category.name)}
                disabled={category.isEssential}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                category.isEssential 
                  ? 'bg-blue-600 cursor-not-allowed opacity-50' 
                  : cookieConsent[category.name] 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
              } peer-checked:bg-blue-600`}
              />
            </label>
          </div>
        ))}
        
        <button
          onClick={savePreferences}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}

const DataRequestForm: React.FC = () => {
  const [requestType, setRequestType] = useState<'access' | 'delete' | 'export'>('access')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Submit a Data Request</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        Under data protection laws, you have the right to access, correct, export, or delete your personal data.
        Submit a request below and we'll respond within 30 days.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'access', label: 'Access Data', icon: Eye },
            { value: 'export', label: 'Export Data', icon: Download },
            { value: 'delete', label: 'Delete Account', icon: Trash2 },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRequestType(option.value as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                requestType === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </button>
          ))}
        </div>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Submit Request
        </button>
        
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Request submitted successfully! We'll contact you at {email}
          </motion.div>
        )}
      </form>
    </div>
  )
}

const SecurityBadge: React.FC<{ icon: React.ElementType; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
    <Icon className="w-5 h-5 text-green-600" />
    <span className="text-sm text-gray-700">{text}</span>
  </div>
)

// ============================================
// MAIN COMPONENT
// ============================================
export default function Privacy() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Information We Collect': true,
    'How We Use Your Data': false,
    'Data Security': false,
    'Your Rights': false,
    'Data Retention': false,
    'Third-Party Services': false,
    'International Data Transfers': false,
    'Children\'s Privacy': false,
  })

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const sections: PolicySection[] = [
    {
      id: 'collect',
      title: 'Information We Collect',
      icon: Eye,
      summary: 'Learn about the types of data we collect from you',
      content: [
        'We collect information you provide directly to us when creating an account, using our services, or communicating with us. This includes your name, email address, profile information, and any content you create or upload.',
        'We automatically collect certain information when you use our services, including usage data (features used, actions taken), device information (IP address, browser type, operating system), and analytics data to improve our services.',
        'We may also collect information from third-party services you connect to our platform, such as Google Calendar, Slack, or GitHub integrations. This data is used solely to provide the integrated functionality you request.',
      ],
      subSections: [
        {
          title: 'Sensitive Data',
          content: 'We do not intentionally collect sensitive personal information such as health data, political opinions, religious beliefs, or biometric data. If you choose to share such information in your tasks or notes, you acknowledge that it is done at your own discretion.'
        },
        {
          title: 'Payment Information',
          content: 'When you make payments, your payment card information is processed by our secure payment partners (Stripe, PayPal). We do not store full payment card numbers on our servers, only encrypted tokens and last four digits for reference.'
        }
      ]
    },
    {
      id: 'use',
      title: 'How We Use Your Data',
      icon: Shield,
      summary: 'Understand how your information is used to improve your experience',
      content: [
        'Your data is used to provide, maintain, and improve our services. This includes processing your tasks, syncing across devices, sending notifications, and personalizing your dashboard.',
        'We use aggregated and anonymized data for analytics, performance monitoring, and service optimization. This helps us understand usage patterns and develop new features.',
        'We may use your email address to send service updates, security alerts, and occasional product news. You can opt out of marketing communications at any time from your settings.',
      ],
      subSections: [
        {
          title: 'Machine Learning & AI Features',
          content: 'We use anonymized task data to train our smart scheduling and prioritization algorithms. Your individual data is never used for training without explicit consent, and you can opt out of AI features in your privacy settings.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: Lock,
      summary: 'Our comprehensive security measures to protect your data',
      content: [
        'We implement industry-standard security measures including AES-256 encryption for data at rest and TLS 1.3 for data in transit. All data is encrypted before being stored in our databases.',
        'Our infrastructure is hosted on enterprise-grade cloud providers (AWS/GCP) with SOC 2, ISO 27001, and GDPR compliance certifications. Data is backed up across multiple geographic regions with redundancy.',
        'We conduct regular security audits, penetration testing, and vulnerability assessments. Our team follows secure development practices and undergoes annual security training.',
      ],
      subSections: [
        {
          title: 'Two-Factor Authentication (2FA)',
          content: 'We strongly recommend enabling 2FA for your account. You can use authenticator apps (Google Authenticator, Authy) or security keys (WebAuthn) for additional protection.'
        },
        {
          title: 'Incident Response',
          content: 'In the unlikely event of a security breach, we will notify affected users within 72 hours and provide remediation steps. We maintain a dedicated security response team on call 24/7.'
        }
      ]
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: Download,
      summary: 'Control over your personal data',
      content: [
        'You have the right to access, correct, or delete your personal information at any time. You can manage most settings directly from your account dashboard.',
        'You have the right to data portability - you can export all your data in JSON or CSV format. This includes your tasks, settings, and activity history.',
        'You have the right to withdraw consent for data processing and object to certain types of processing. Contact our privacy team for assistance with these requests.',
      ],
      subSections: [
        {
          title: 'California Privacy Rights (CCPA)',
          content: 'California residents have additional rights including knowing what personal information is collected, requesting deletion, opting out of sale of personal information, and non-discrimination for exercising privacy rights.'
        },
        {
          title: 'GDPR Rights (EU Residents)',
          content: 'EU residents have rights including rectification, erasure (right to be forgotten), restriction of processing, data portability, and the right to lodge a complaint with a supervisory authority.'
        }
      ]
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: Trash2,
      summary: 'How long we keep your information',
      content: [
        'We retain your data for as long as your account is active. This allows you to maintain your task history and access past information when needed.',
        'When you delete your account, your data is permanently removed from our active systems within 30 days. Backups may retain data for up to 90 days before complete erasure.',
        'Some anonymized or aggregated data may be retained for analytics purposes after account deletion. This data cannot be used to identify you personally.',
      ],
      subSections: [
        {
          title: 'Inactive Accounts',
          content: 'Accounts inactive for 24 months may be flagged for review. We will notify you via email before taking any action, allowing you to reactivate your account and retain your data.'
        }
      ]
    },
    {
      id: 'third-party',
      title: 'Third-Party Services',
      icon: Globe,
      summary: 'How we share data with partners',
      content: [
        'We use trusted third-party services to provide core functionality: cloud hosting (AWS/GCP), email delivery (SendGrid), analytics (PostHog/Mixpanel), and customer support (Intercom).',
        'These service providers are contractually bound to protect your data and use it only for specified purposes. They undergo our security and privacy assessment before integration.',
        'We never sell your personal information to third parties. Any data shared with partners is limited to what is necessary for providing the service and is always encrypted.',
      ]
    },
    {
      id: 'transfers',
      title: 'International Data Transfers',
      icon: Server,
      summary: 'Where your data is stored',
      content: [
        'Your data may be transferred to and processed in countries other than your country of residence. We maintain servers in the United States and European Union.',
        'For data transfers from the EU to non-EEA countries, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection.',
        'We comply with the EU-U.S. Data Privacy Framework and Swiss-U.S. Data Privacy Framework for transfers of personal data from the EU and Switzerland to the United States.',
      ]
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: Users,
      summary: 'Protecting young users',
      content: [
        'Our services are not intended for children under 13 years of age (or 16 in certain jurisdictions). We do not knowingly collect personal information from children under these age limits.',
        'If you believe we have inadvertently collected information from a child, please contact us immediately. We will promptly delete any such data upon verification.',
        'Parents or guardians who discover their child has provided us with personal information can request its removal by contacting our privacy team.',
      ]
    }
  ]

  const complianceBadges = [
    { name: 'GDPR Compliant', icon: Shield, color: 'from-blue-500 to-blue-600' },
    { name: 'CCPA Ready', icon: UserCheck, color: 'from-purple-500 to-purple-600' },
    { name: 'SOC 2 Type II', icon: Award, color: 'from-green-500 to-green-600' },
    { name: 'ISO 27001', icon: Lock, color: 'from-indigo-500 to-indigo-600' },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6"
          >
            <Shield className="w-4 h-4" />
            <span>Updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto"
          >
            Your trust is our priority. We're committed to transparency about how we handle your data.
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compliance Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {complianceBadges.map((badge, i) => (
            <div key={i} className={`p-3 rounded-xl bg-gradient-to-r ${badge.color} text-white text-center`}>
              <badge.icon className="w-5 h-5 mx-auto mb-1 opacity-90" />
              <p className="text-xs font-medium">{badge.name}</p>
            </div>
          ))}
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                At TaskCollab, we take your privacy seriously. This policy describes how we collect, 
                use, and protect your personal information when you use our services. We are committed 
                to being transparent about our data practices and giving you meaningful control over 
                your information.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <SecurityBadge icon={Lock} text="Encrypted at rest & in transit" />
                <SecurityBadge icon={Fingerprint} text="Multi-factor authentication" />
                <SecurityBadge icon={Clock} text="Automated backups" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-3 mb-8">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              isExpanded={expandedSections[section.title]}
              onToggle={() => toggleSection(section.title)}
            />
          ))}
        </div>

        {/* Cookie Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <CookieSettings />
        </motion.div>

        {/* Data Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <DataRequestForm />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white"
        >
          <Heart className="w-8 h-8 mx-auto mb-3 text-blue-400" />
          <h3 className="text-xl font-bold mb-2">Questions about our privacy policy?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Our data protection team is here to help. We typically respond within 2 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:privacy@taskcollab.com"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              privacy@taskcollab.com
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Data Protection Officer: Dr. Sarah Chen | Last reviewed: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
          © {currentYear} TaskCollab, Inc. All rights reserved. This privacy policy may be updated periodically.
          We will notify you of any material changes via email or through the platform.
        </p>
      </div>
    </div>
  )
}