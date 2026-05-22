// src/pages/Terms.tsx - Comprehensive Terms of Service Page
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Shield, AlertTriangle, CheckCircle2, 
  Scale, Gavel, Users, Globe, Clock, CreditCard,
  Zap, Lock, Server, Database, Cloud, Mail,
  Phone, MapPin, Link, Copy, ExternalLink,
  BookOpen, Briefcase, DollarSign, UserCheck,
  ShieldCheck, Fingerprint, Smartphone, Laptop,
  Wifi, Activity, Bell, HelpCircle, MessageCircle,
  Heart, Star, Award, Crown, Gift, Sparkles
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface TermSection {
  id: string
  title: string
  icon: React.ElementType
  summary: string
  content: string[]
  subSections?: { title: string; content: string }[]
  lastUpdated?: string
}

interface LegalUpdate {
  date: string
  version: string
  changes: string[]
}

// ============================================
// COMPONENTS
// ============================================
const TermSectionCard: React.FC<{ 
  section: TermSection; 
  index: number; 
  isExpanded: boolean; 
  onToggle: () => void 
}> = ({ section, index, isExpanded, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
    >
      <button
        onClick={onToggle}
        className="w-full p-5 text-left flex items-start justify-between group"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex-shrink-0">
            <section.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {section.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{section.summary}</p>
          </div>
        </div>
        <div className="ml-4 p-1 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
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
            className="border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-5 pt-0 space-y-4">
              {section.content.map((paragraph, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              
              {section.subSections && (
                <div className="mt-4 space-y-4">
                  {section.subSections.map((sub, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{sub.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{sub.content}</p>
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

const VersionHistory: React.FC<{ updates: LegalUpdate[] }> = ({ updates }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Version History</span>
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
              {updates.map((update, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">Version {update.version}</span>
                      <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {update.changes.map((change, j) => (
                        <li key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ContactCard: React.FC = () => {
  const contactMethods = [
    { icon: Mail, label: 'Email', value: 'legal@taskcollab.com', action: 'mailto:legal@taskcollab.com' },
    { icon: MessageCircle, label: 'Live Chat', value: 'Available 9AM-5PM ET', action: '#' },
    { icon: Phone, label: 'Phone', value: '+1 (800) 555-0123', action: 'tel:+18005550123' },
    { icon: MapPin, label: 'Address', value: '123 Tech Street, San Francisco, CA 94105', action: '#' },
  ]

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6" />
        <h3 className="text-xl font-bold">Have Questions?</h3>
      </div>
      <p className="text-blue-100 text-sm mb-4">
        Our legal team is here to help you understand our terms and answer any questions you may have.
      </p>
      <div className="space-y-3">
        {contactMethods.map((method, i) => (
          <a
            key={i}
            href={method.action}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <method.icon className="w-4 h-4 opacity-80" />
            <div className="flex-1">
              <p className="text-xs opacity-70">{method.label}</p>
              <p className="text-sm font-medium">{method.value}</p>
            </div>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  )
}

const AcceptableUseTable: React.FC = () => {
  const useCases = [
    { allowed: true, action: 'Use the service for personal or business purposes', example: 'Task management, team collaboration' },
    { allowed: true, action: 'Integrate with third-party tools via official APIs', example: 'Zapier, Slack, Google Workspace' },
    { allowed: false, action: 'Attempt to bypass security measures', example: 'Hacking, DDoS attacks, unauthorized access' },
    { allowed: false, action: 'Upload malicious code or malware', example: 'Viruses, ransomware, trojans' },
    { allowed: true, action: 'Share templates and public workflows', example: 'Community templates, public boards' },
    { allowed: false, action: 'Use automated scripts to scrape data', example: 'Bot crawling, data mining' },
    { allowed: false, action: 'Infringe on intellectual property rights', example: 'Unauthorized copyrighted content' },
    { allowed: true, action: 'Request feature enhancements', example: 'Feedback, suggestions, bug reports' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Allowed</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Action</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Example</th>
           </tr>
        </thead>
        <tbody>
          {useCases.map((useCase, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="py-3 px-4">
                {useCase.allowed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
               </td>
              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{useCase.action}</td>
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">{useCase.example}</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const FeatureAvailabilityCard: React.FC = () => {
  const tiers = [
    { name: 'Free', price: '$0', features: ['Basic tasks', '5 projects', '1GB storage', 'Community support'], users: 'Up to 3' },
    { name: 'Pro', price: '$12/month', features: ['Unlimited tasks', 'Unlimited projects', '50GB storage', 'Priority support', 'Advanced analytics'], users: 'Unlimited' },
    { name: 'Enterprise', price: 'Custom', features: ['SLA guarantee', 'SSO', 'Custom integrations', '24/7 support', 'On-premise option'], users: 'Custom' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tiers.map((tier, i) => (
        <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
          <h4 className="font-bold text-gray-900 dark:text-white">{tier.name}</h4>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{tier.price}</p>
          <p className="text-xs text-gray-500 mb-3">{tier.users} users</p>
          <ul className="space-y-1 text-left">
            {tier.features.map((feature, j) => (
              <li key={j} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Missing imports
import { ChevronDown, XCircle } from 'lucide-react'

// ============================================
// MAIN COMPONENT
// ============================================
export default function Terms() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Acceptance of Terms': true,
    'Account Responsibilities': false,
    'Acceptable Use': false,
    'Service Level Agreement': false,
    'Intellectual Property': false,
    'Subscription and Billing': false,
    'Data Privacy': false,
    'Termination': false,
    'Limitation of Liability': false,
    'Governing Law': false,
  })

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const sections: TermSection[] = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      summary: 'By using TaskCollab, you agree to these terms',
      content: [
        'By accessing or using TaskCollab (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.',
        'We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.',
        'The Service is intended for users who are at least 13 years old. If you are under 13, you may not use the Service without parental consent.',
      ],
      subSections: [
        {
          title: 'Enterprise Agreements',
          content: 'If you are using TaskCollab on behalf of an organization, you agree to these terms on behalf of that organization. Enterprise customers may have separate written agreements that supersede these terms.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Responsibilities',
      icon: Shield,
      summary: 'Your obligations as a user',
      content: [
        'You are responsible for maintaining the security of your account credentials. TaskCollab is not liable for any unauthorized access to your account resulting from your failure to protect your password.',
        'You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and complete.',
        'You are responsible for all activities that occur under your account, including any actions taken by users you have authorized to access your workspace.',
      ],
      subSections: [
        {
          title: 'Multi-Factor Authentication',
          content: 'We strongly recommend enabling multi-factor authentication (MFA) for all accounts. MFA adds an extra layer of security by requiring a verification code in addition to your password.'
        }
      ]
    },
    {
      id: 'use',
      title: 'Acceptable Use',
      icon: AlertTriangle,
      summary: 'Rules for using our platform',
      content: [
        'You agree not to misuse the Service or help anyone else to do so. You will not use the Service for any illegal purpose or in violation of any laws.',
        'You will not attempt to probe, scan, or test the vulnerability of any system or network. You will not breach or otherwise circumvent any security or authentication measures.',
        'You will not access, search, or create accounts for the Service by any means other than our publicly supported interfaces.',
      ],
      subSections: [
        {
          title: 'Content Guidelines',
          content: 'You may not upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.'
        }
      ]
    },
    {
      id: 'sla',
      title: 'Service Level Agreement',
      icon: Clock,
      summary: 'Uptime commitments and support',
      content: [
        'TaskCollab strives to maintain 99.9% uptime for all paid plans. This does not include scheduled maintenance periods, which will be communicated at least 24 hours in advance.',
        'If we fail to meet the uptime SLA, you may be eligible for service credits. Credits are calculated as 10% of your monthly fee for each 0.1% below 99.9%, up to 50% of your monthly fee.',
        'Support response times: Priority support within 2 hours for critical issues, 8 hours for high priority, and 24 hours for normal requests.',
      ],
      subSections: [
        {
          title: 'Maintenance Windows',
          content: 'Scheduled maintenance typically occurs on Sundays from 2:00 AM to 4:00 AM Eastern Time. We will notify users at least 48 hours before any scheduled maintenance.'
        },
        {
          title: 'Emergency Maintenance',
          content: 'In case of security vulnerabilities or critical issues, we may perform emergency maintenance with shorter notice. We will communicate via email and in-app notifications.'
        }
      ]
    },
    {
      id: 'ip',
      title: 'Intellectual Property',
      icon: Scale,
      summary: 'Ownership of content and rights',
      content: [
        'TaskCollab does not claim ownership of any content you create or upload to the Service. You retain all rights to your content and are responsible for ensuring you have the necessary permissions to share it.',
        'By submitting content to public areas of the Service, you grant TaskCollab a worldwide, royalty-free license to host, store, and display your content as necessary to provide the Service.',
        'The TaskCollab name, logo, and all related names, trademarks, and service marks are property of TaskCollab Inc. You may not use these marks without prior written permission.',
      ],
      subSections: [
        {
          title: 'Copyright Infringement',
          content: 'If you believe your copyrighted work has been infringed, please contact our Copyright Agent at copyright@taskcollab.com with a detailed description of the alleged infringement.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Subscription and Billing',
      icon: CreditCard,
      summary: 'Payment terms and refunds',
      content: [
        'Paid subscriptions are billed in advance on a monthly or annual basis depending on your selected plan. All fees are non-refundable except as required by law.',
        'We reserve the right to change our pricing with 30 days notice. Price changes will be communicated via email and in-app notifications.',
        'If your payment method fails, we will attempt to charge it again after 3 days. After 14 days of failed payments, your account may be downgraded to a free plan.',
      ],
      subSections: [
        {
          title: 'Refund Policy',
          content: 'Annual plan subscribers may request a pro-rated refund within the first 30 days of subscription. Monthly plans are non-refundable but can be canceled at any time effective the next billing cycle.'
        },
        {
          title: 'Taxes',
          content: 'You are responsible for all taxes associated with your subscription. TaskCollab will collect applicable sales tax based on your billing address.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Data Privacy',
      icon: Lock,
      summary: 'How we handle your data',
      content: [
        'We collect and process personal data as described in our Privacy Policy. By using the Service, you consent to such collection and processing.',
        'TaskCollab implements industry-standard security measures to protect your data, including encryption at rest (AES-256) and in transit (TLS 1.3).',
        'We will not access or share your private content except: (1) with your consent, (2) to provide the Service, (3) when required by law, or (4) to investigate potential violations.',
      ],
      subSections: [
        {
          title: 'Data Portability',
          content: 'You can export all your data at any time via the Export feature. We support JSON, CSV, and PDF formats for data download.'
        },
        {
          title: 'Data Deletion',
          content: 'Upon account deletion, your data is permanently removed from our active systems within 30 days. Backup archives may retain data for up to 90 days.'
        }
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: Gavel,
      summary: 'How accounts can be terminated',
      content: [
        'You may cancel your account at any time from your account settings. Upon cancellation, you will lose access to your data after 30 days unless you export it.',
        'TaskCollab may suspend or terminate your access for violations of these terms, illegal activity, or extended periods of inactivity (24+ months).',
        'Upon termination, all licenses granted to you will terminate immediately. Sections regarding intellectual property, liability limitations, and dispute resolution will survive termination.',
      ],
      subSections: [
        {
          title: 'Appeals Process',
          content: 'If your account is terminated for policy violations, you may appeal by contacting appeals@taskcollab.com within 30 days of termination.'
        }
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: ShieldCheck,
      summary: 'Legal responsibilities and limits',
      content: [
        'To the maximum extent permitted by law, TaskCollab shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.',
        'Our total liability for any claim arising from these terms or your use of the Service is limited to the amount you paid us in the 12 months preceding the claim, or $100 if you use a free plan.',
        'We provide the Service "as is" without warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      ],
      subSections: [
        {
          title: 'Force Majeure',
          content: 'We will not be liable for delays or failures in performance resulting from causes beyond our reasonable control, including natural disasters, war, terrorism, or internet outages.'
        }
      ]
    },
    {
      id: 'law',
      title: 'Governing Law',
      icon: Globe,
      summary: 'Legal jurisdiction',
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.',
        'Any dispute arising from these Terms shall be resolved exclusively in the state or federal courts located in San Francisco County, California.',
        'For users outside the United States, you consent to the jurisdiction of California courts for any disputes arising from these Terms or your use of the Service.',
      ],
      subSections: [
        {
          title: 'International Compliance',
          content: 'If you use the Service from outside the United States, you are responsible for complying with applicable local laws, including export control laws.'
        },
        {
          title: 'Dispute Resolution',
          content: 'Before filing a lawsuit, you agree to attempt to resolve any dispute through informal negotiations. If unresolved after 30 days, either party may initiate binding arbitration.'
        }
      ]
    }
  ]

  const versionHistory: LegalUpdate[] = [
    { date: '2026-05-21', version: '2.4.0', changes: ['Updated SLA uptime commitments', 'Added AI features section', 'Clarified data retention policies'] },
    { date: '2026-02-15', version: '2.3.0', changes: ['Added Enterprise terms', 'Updated refund policy', 'Enhanced security disclosure'] },
    { date: '2025-11-01', version: '2.2.0', changes: ['GDPR compliance updates', 'New data portability features', 'Third-party integration terms'] },
    { date: '2025-08-10', version: '2.1.0', changes: ['Simplified language for key sections', 'Added acceptable use examples', 'Updated contact information'] },
    { date: '2025-05-01', version: '2.0.0', changes: ['Complete terms revision', 'Added billing protections', 'Enhanced user rights'] },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6"
          >
            <FileText className="w-4 h-4" />
            <span>Effective Date: {new Date().toLocaleDateString()}</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Terms of Service
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto"
          >
            Please read these terms carefully before using TaskCollab. By using our service, you agree to these terms.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to TaskCollab. These Terms of Service form a legally binding agreement between you and 
                TaskCollab Inc. regarding your use of our platform, website, and related services. We've designed 
                these terms to be clear and fair while protecting both our users and our company.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Legally Compliant
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Regularly Updated
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> User-Friendly
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Plan Features & Availability</h3>
            </div>
            <FeatureAvailabilityCard />
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-3 mb-8">
          {sections.map((section, index) => (
            <TermSectionCard
              key={section.id}
              section={section}
              index={index}
              isExpanded={expandedSections[section.title]}
              onToggle={() => toggleSection(section.title)}
            />
          ))}
        </div>

        {/* Acceptable Use Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Acceptable Use Guidelines</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Clear examples of permitted and prohibited activities</p>
          </div>
          <div className="p-5">
            <AcceptableUseTable />
          </div>
        </motion.div>

        {/* Version History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <VersionHistory updates={versionHistory} />
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <ContactCard />
          
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6" />
              <h3 className="text-xl font-bold">Legal Compliance</h3>
            </div>
            <p className="text-green-100 text-sm mb-4">
              TaskCollab is committed to legal compliance and user protection. We adhere to:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>GDPR (EU Privacy Law)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>CCPA (California Privacy)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>SOC 2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            © {currentYear} TaskCollab, Inc. All rights reserved. | Terms last updated on {new Date().toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            For legal inquiries, please contact legal@taskcollab.com | For DCMA notices, contact dmca@taskcollab.com
          </p>
        </div>
      </div>
    </div>
  )
}