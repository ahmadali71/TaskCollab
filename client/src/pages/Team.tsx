// src/pages/Team.tsx - Complete Team Management Page with Dark Mode & 3D Effects
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform
} from 'framer-motion';
import {
  Users, Search, Plus, X, Mail, Phone, MapPin, Calendar,
  CheckCircle2, Activity, Briefcase, Flame, TrendingUp,
  UserPlus, MessageSquare, Share2, ChevronRight, Edit, Trash2,
  Filter, RefreshCw, Clock, Award, MoreVertical, Eye,
  Crown, Shield, Save, AlertCircle,
  Download, Star, Target, Copy, Check,
  FileText, Link2, Moon, Sun
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Activity {
  id: string;
  type: 'task_completed' | 'task_created' | 'comment' | 'review' | 'meeting' | 'login' | 'file_upload';
  description: string;
  timestamp: string;
  taskId?: string;
  metadata?: Record<string, any>;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
  color: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface Skill {
  name: string;
  level: number;
  endorsements: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
}

interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  progress: number;
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  department: string;
  status: 'online' | 'idle' | 'busy' | 'offline';
  joinDate: string;
  lastActive: string;
  location: string;
  timezone: string;
  skills: Skill[];
  projects: Project[];
  tasksCompleted: number;
  tasksInProgress: number;
  tasksOverdue: number;
  productivity: number;
  productivityTrend: number[];
  hoursThisWeek: number;
  hoursTarget: number;
  recentActivity: Activity[];
  badges: Badge[];
  certifications: Certification[];
  contactInfo: {
    email: string;
    phone: string;
    slack: string;
    github: string;
    linkedin?: string;
    twitter?: string;
  };
  performanceReviews: {
    quarter: string;
    rating: number;
    feedback: string;
  }[];
  manager?: string;
  team?: string[];
  isAdmin: boolean;
  isManager: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeamStats {
  totalMembers: number;
  onlineNow: number;
  avgProductivity: number;
  tasksCompletedThisWeek: number;
  totalProjects: number;
  teamStreak: number;
  totalHoursLogged: number;
  activeProjectsCount: number;
  completionRate: number;
  satisfactionScore: number;
}

interface Department {
  id: string;
  name: string;
  lead: string;
  leadAvatar?: string;
  memberCount: number;
  color: string;
  budget?: number;
  objectives?: string[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
};

const getProductivityColor = (score: number): string => {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#3b82f6';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getProductivityLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  return 'Needs Improvement';
};

const getSkillLevelColor = (level: number): string => {
  if (level >= 80) return 'bg-green-500';
  if (level >= 60) return 'bg-blue-500';
  if (level >= 40) return 'bg-yellow-500';
  return 'bg-gray-400';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Social Share URLs
const getTwitterShareUrl = (text: string, url: string): string => {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
};

const getLinkedInShareUrl = (url: string): string => {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
};

const getFacebookShareUrl = (url: string): string => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
};

// ============================================
// CUSTOM SOCIAL ICON COMPONENTS
// ============================================

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.142-12.401c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.3-.536-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const SlackIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5.282 9.532a1.93 1.93 0 0 1-1.93-1.93 1.93 1.93 0 0 1 1.93-1.93h1.93v1.93a1.93 1.93 0 0 1-1.93 1.93zm.97-4.834h.96V1.928a1.93 1.93 0 1 0-3.86 0v2.77h2.9zm7.177 4.834a1.93 1.93 0 0 1-1.93-1.93 1.93 1.93 0 0 1 1.93-1.93h1.93v1.93a1.93 1.93 0 0 1-1.93 1.93zm.97-4.834h.96V1.928a1.93 1.93 0 1 0-3.86 0v2.77h2.9zM5.282 14.76a1.93 1.93 0 0 1 1.93 1.93 1.93 1.93 0 0 1-1.93 1.93h-1.93v-1.93a1.93 1.93 0 0 1 1.93-1.93zm-1.93.97h2.9v-.96a1.93 1.93 0 1 0-3.86 0v.96h.96zm14.354-.97a1.93 1.93 0 0 1 1.93 1.93 1.93 1.93 0 0 1-1.93 1.93h-1.93v-1.93a1.93 1.93 0 0 1 1.93-1.93zm1.93.97h-2.9v.96a1.93 1.93 0 1 0 3.86 0v-.96h-.96z"/>
  </svg>
);

// ============================================
// 3D CARD COMPONENT (with dark mode support)
// ============================================

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glow?: boolean;
  onClick?: () => void;
}

const Card3D: React.FC<Card3DProps> = ({ children, className = '', depth = 20, glow = false, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ scale: 1.02, z: 20 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${glow ? 'hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20' : ''} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  );
};

// ============================================
// STATUS INDICATOR (with dark mode)
// ============================================

interface StatusIndicatorProps {
  status: TeamMember['status'];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md', showLabel = false, animated = true }) => {
  const config = {
    online: { color: 'bg-green-500', label: 'Online', pulse: true },
    idle: { color: 'bg-yellow-500', label: 'Idle', pulse: false },
    busy: { color: 'bg-red-500', label: 'Busy', pulse: true },
    offline: { color: 'bg-gray-400 dark:bg-gray-600', label: 'Offline', pulse: false },
  };
  const c = config[status];
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };

  if (showLabel) {
    return (
      <div className="flex items-center space-x-1.5">
        <span className={`${sizes[size]} rounded-full ${c.color} ${animated && c.pulse ? 'animate-pulse' : ''}`} />
        <span className="text-xs text-gray-600 dark:text-gray-400">{c.label}</span>
      </div>
    );
  }

  return (
    <span className="relative flex items-center">
      <span className={`${sizes[size]} rounded-full ${c.color}`}>
        {animated && c.pulse && (
          <span className={`absolute inset-0 ${sizes[size]} rounded-full ${c.color} animate-ping opacity-75`} />
        )}
      </span>
    </span>
  );
};

// ============================================
// PRODUCTIVITY SPARKLINE
// ============================================

interface ProductivitySparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showPoints?: boolean;
}

const ProductivitySparkline: React.FC<ProductivitySparklineProps> = ({ data, color, height = 30, width = 100, showPoints = true }) => {
  if (!data.length) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const finalColor = color || getProductivityColor(data[data.length - 1]);

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPathD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={areaPathD} fill={`${finalColor}15`} stroke="none" />
      <path d={pathD} fill="none" stroke={finalColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {showPoints && points.map((point, idx) => (
        <circle key={idx} cx={point.x} cy={point.y} r={idx === points.length - 1 ? 3 : 1.5} fill={finalColor} />
      ))}
    </svg>
  );
};

// ============================================
// SKILL TAG WITH LEVEL (with dark mode)
// ============================================

interface SkillTagProps {
  skill: Skill;
  size?: 'sm' | 'md';
  onClick?: () => void;
  showLevel?: boolean;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, size = 'md', onClick, showLevel = false }) => {
  const sizes = { sm: 'px-1.5 py-0.5 text-xs', md: 'px-2 py-1 text-sm' };
  const levelColor = getSkillLevelColor(skill.level);
  
  return (
    <div
      onClick={onClick}
      className={`${sizes[size]} rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors cursor-pointer flex items-center space-x-1`}
    >
      <span>{skill.name}</span>
      {showLevel && (
        <div className="flex items-center space-x-0.5 ml-1">
          <div className={`w-1.5 h-1.5 rounded-full ${levelColor}`} />
          <span className="text-xs text-gray-500 dark:text-gray-400">{skill.level}%</span>
        </div>
      )}
      {skill.endorsements > 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({skill.endorsements})</span>
      )}
    </div>
  );
};

// ============================================
// TOAST NOTIFICATION (with dark mode)
// ============================================

const InfoIconComponent: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ToastNotification: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'bg-green-500', icon: CheckCircle2 },
    error: { bg: 'bg-red-500', icon: AlertCircle },
    info: { bg: 'bg-blue-500', icon: InfoIconComponent },
    warning: { bg: 'bg-yellow-500', icon: AlertCircle },
  };
  const { bg, icon: Icon } = config[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 50, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg text-white ${bg} min-w-[280px]`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm flex-1">{toast.message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ============================================
// ANIMATED COUNTER
// ============================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 0.8, format = (v) => v.toString() }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = displayValue;
    const change = value - startValue;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / (duration * 1000));
      const current = startValue + change * progress;
      setDisplayValue(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{format(Math.round(displayValue))}</span>;
};

// ============================================
// MEMBER CARD (GRID VIEW) with dark mode
// ============================================

interface MemberCardProps {
  member: TeamMember;
  onSelect: (member: TeamMember) => void;
  onQuickMessage?: (member: TeamMember) => void;
  isSelected: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onSelect, onQuickMessage, isSelected }) => {
  const productivityColor = getProductivityColor(member.productivity);
  const productivityLabel = getProductivityLabel(member.productivity);
  const lastActiveRelative = formatRelativeTime(member.lastActive);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => onSelect(member)}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute top-4 right-4">
        <StatusIndicator status={member.status} />
      </div>

      <div className="absolute top-4 left-4 flex space-x-1">
        {member.isAdmin && (
          <span title="Admin">
            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </span>
        )}
        {member.isManager && !member.isAdmin && (
          <span title="Manager">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-4 mt-2">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {member.avatar}
          </div>
          {member.status === 'online' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </motion.div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">{member.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{member.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <p className="text-base font-bold text-gray-900 dark:text-white">{member.tasksCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Done</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <p className="text-base font-bold text-gray-900 dark:text-white">{member.tasksInProgress}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <p className="text-base font-bold text-red-500 dark:text-red-400">{member.tasksOverdue}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Productivity</span>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-semibold" style={{ color: productivityColor }}>{member.productivity}%</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">({productivityLabel})</span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${member.productivity}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="h-full rounded-full"
            style={{ backgroundColor: productivityColor }}
          />
        </div>
      </div>

      <div className="mb-3">
        <ProductivitySparkline data={member.productivityTrend} color={productivityColor} height={24} width={200} />
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {member.skills.slice(0, 2).map(skill => (
          <SkillTag key={skill.name} skill={skill} size="sm" showLevel={false} />
        ))}
        {member.skills.length > 2 && (
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            +{member.skills.length - 2}
          </span>
        )}
      </div>

      {member.badges.length > 0 && (
        <div className="flex -space-x-1 mb-2">
          {member.badges.slice(0, 4).map(badge => (
            <div
              key={badge.id}
              className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs shadow-sm"
              title={`${badge.name}: ${badge.description}`}
            >
              {badge.icon}
            </div>
          ))}
          {member.badges.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
              +{member.badges.length - 4}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500">Last active: {lastActiveRelative}</span>
        {onQuickMessage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickMessage(member);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Quick message"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// MEMBER LIST ITEM (with dark mode)
// ============================================

interface MemberListItemProps {
  member: TeamMember;
  onSelect: (member: TeamMember) => void;
  onQuickMessage?: (member: TeamMember) => void;
}

const MemberListItem: React.FC<MemberListItemProps> = ({ member, onSelect, onQuickMessage }) => {
  const productivityColor = getProductivityColor(member.productivity);
  const lastActiveRelative = formatRelativeTime(member.lastActive);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
      className="flex items-center p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 group"
      onClick={() => onSelect(member)}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {member.avatar}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <StatusIndicator status={member.status} size="sm" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
            {member.isAdmin && (
              <span title="Admin">
                <Crown className="w-3.5 h-3.5 text-purple-500" />
              </span>
            )}
            {member.isManager && !member.isAdmin && (
              <span title="Manager">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
              </span>
            )}
            {member.badges.slice(0, 2).map(badge => (
              <span key={badge.id} className="text-xs" title={badge.name}>{badge.icon}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.role} • {member.department}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center hidden md:block min-w-[60px]">
          <p className="font-semibold text-gray-900 dark:text-white">{member.tasksCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
        </div>
        <div className="text-center hidden lg:block min-w-[70px]">
          <p className="font-semibold" style={{ color: productivityColor }}>{member.productivity}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Productivity</p>
        </div>
        <div className="text-center hidden xl:block min-w-[80px]">
          <p className="text-sm text-gray-600 dark:text-gray-400">{member.hoursThisWeek}/{member.hoursTarget}h</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">This week</p>
        </div>
        <div className="text-right min-w-[80px] hidden sm:block">
          <p className="text-xs text-gray-500 dark:text-gray-400">{lastActiveRelative}</p>
        </div>
        {onQuickMessage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickMessage(member);
            }}
            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Quick message"
          >
            <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </div>
    </motion.div>
  );
};

// ============================================
// EDIT MEMBER MODAL (with dark mode)
// ============================================

interface EditMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: TeamMember) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>({});
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    if (member) {
      setFormData(member);
      setSkillsInput(member.skills.map(s => s.name).join(', '));
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member && formData) {
      const updatedMember = {
        ...member,
        ...formData,
        skills: skillsInput.split(',').map(s => ({ 
          name: s.trim(), 
          level: 50, 
          endorsements: 0 
        })).filter(s => s.name),
        updatedAt: new Date().toISOString(),
      };
      onSave(updatedMember);
      onClose();
    }
  };

  if (!isOpen || !member) return null;

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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Member Profile</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="QA">QA</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status || 'online'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="idle">Idle</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Zone</label>
                <input
                  type="text"
                  value={formData.timezone || ''}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, TypeScript, UI Design, Python"
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Separate skills with commas</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isAdmin || false}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Admin</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isManager || false}
                  onChange={(e) => setFormData({ ...formData, isManager: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Manager</span>
              </label>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// MEMBER DETAIL MODAL (with dark mode)
// ============================================

interface MemberDetailModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (member: TeamMember) => void;
  onMessage: (member: TeamMember) => void;
  onShare: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ 
  member, isOpen, onClose, onEdit, onMessage, onShare, onDelete 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'badges' | 'projects' | 'performance'>('overview');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('overview');
      setShowShareMenu(false);
    }
  }, [isOpen]);

  if (!member || !isOpen) return null;

  const productivityColor = getProductivityColor(member.productivity);
  const joinDateFormatted = formatDate(member.joinDate);

  const handleCopyProfileLink = async () => {
    const shareUrl = `${window.location.origin}/team/member/${member.id}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShare(member);
  };

  const handleShareToSocial = (platform: string) => {
    const text = `Check out ${member.name}'s profile on TaskCollab!`;
    const url = `${window.location.origin}/team/member/${member.id}`;
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = getTwitterShareUrl(text, url);
        break;
      case 'linkedin':
        shareUrl = getLinkedInShareUrl(url);
        break;
      case 'facebook':
        shareUrl = getFacebookShareUrl(url);
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };

  const handleEditClick = () => {
    onEdit(member);
    onClose();
  };

  const handleMessageClick = () => {
    onMessage(member);
    onClose();
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleDeleteClick = () => {
    if (onDelete && window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      onDelete(member);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <button
                onClick={handleEditClick}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Edit member"
              >
                <Edit className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleMessageClick}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Message member"
              >
                <MessageSquare className="w-4 h-4 text-white" />
              </button>
              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Share profile"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 border dark:border-gray-700"
                  >
                    <button
                      onClick={handleCopyProfileLink}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy link'}</span>
                    </button>
                    <button
                      onClick={() => handleShareToSocial('twitter')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <TwitterIcon className="w-4 h-4 text-blue-400" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShareToSocial('linkedin')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <LinkedInIcon className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShareToSocial('facebook')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <FacebookIcon className="w-4 h-4 text-blue-600" />
                      <span>Facebook</span>
                    </button>
                    <hr className="my-1 dark:border-gray-700" />
                    <button
                      onClick={handleDeleteClick}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Member</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
                {member.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <StatusIndicator status={member.status} size="lg" />
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h2>
                {member.isAdmin && <span title="Admin"><Crown className="w-5 h-5 text-purple-500" /></span>}
                {member.isManager && !member.isAdmin && <span title="Manager"><Shield className="w-5 h-5 text-blue-500" /></span>}
              </div>
              <p className="text-gray-500 dark:text-gray-400">{member.role}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{member.department}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <StatusIndicator status={member.status} showLabel animated={false} />
              </div>
            </div>

            <div className="flex border-b dark:border-gray-700 mb-5 overflow-x-auto">
              {(['overview', 'activity', 'badges', 'projects', 'performance'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : 
                   tab === 'activity' ? 'Activity' : 
                   tab === 'badges' ? 'Badges & Awards' :
                   tab === 'projects' ? 'Projects' : 'Performance'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 truncate">{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 truncate">{member.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 truncate">Joined {joinDateFormatted}</span>
                    </div>
                    {member.contactInfo.slack && (
                      <div className="flex items-center space-x-2 text-sm col-span-2">
                        <SlackIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 truncate">{member.contactInfo.slack}</span>
                      </div>
                    )}
                    {member.contactInfo.github && (
                      <div className="flex items-center space-x-2 text-sm">
                        <GithubIcon className="w-4 h-4 text-gray-700 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 truncate">{member.contactInfo.github}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hours This Week</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{member.hoursThisWeek} / {member.hoursTarget} hrs</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(member.hoursThisWeek / member.hoursTarget) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className={`h-full rounded-full ${
                          member.hoursThisWeek >= member.hoursTarget ? 'bg-green-500' :
                          member.hoursThisWeek >= member.hoursTarget * 0.7 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map(skill => (
                        <SkillTag key={skill.name} skill={skill} size="md" showLevel />
                      ))}
                    </div>
                  </div>

                  {member.manager && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Reports to:</span> {member.manager}
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Productivity Insight</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: productivityColor }}>{member.productivity}%</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.productivity >= 90
                        ? `${member.name} is an exceptional performer with consistently high output.`
                        : member.productivity >= 75
                        ? `${member.name} maintains good productivity levels and meets targets reliably.`
                        : member.productivity >= 60
                        ? `${member.name} is showing average productivity. Consider additional support or task adjustments.`
                        : `${member.name} may need performance review or workload adjustment.`}
                    </p>
                    <div className="mt-3">
                      <ProductivitySparkline data={member.productivityTrend} color={productivityColor} height={30} width={400} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 max-h-96 overflow-y-auto"
                >
                  {member.recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No recent activity</div>
                  ) : (
                    member.recentActivity.map(activity => {
                      const activityIcon = {
                        task_completed: <CheckCircle2 className="w-4 h-4" />,
                        task_created: <Plus className="w-4 h-4" />,
                        comment: <MessageSquare className="w-4 h-4" />,
                        review: <Eye className="w-4 h-4" />,
                        meeting: <Users className="w-4 h-4" />,
                        login: <Activity className="w-4 h-4" />,
                        file_upload: <FileText className="w-4 h-4" />,
                      }[activity.type] || <Activity className="w-4 h-4" />;
                      
                      const activityColor = {
                        task_completed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                        task_created: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                        comment: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                        review: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                        meeting: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                        login: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                        file_upload: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
                      }[activity.type] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';

                      return (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activityColor}`}>
                            {activityIcon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{activity.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                              {activity.taskId && (
                                <span className="text-xs text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">View Task</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {activeTab === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 max-h-96 overflow-y-auto"
                >
                  {member.badges.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No badges earned yet</div>
                  ) : (
                    member.badges.map(badge => {
                      const levelColors = {
                        bronze: 'from-amber-600 to-amber-700',
                        silver: 'from-gray-400 to-gray-500',
                        gold: 'from-yellow-400 to-yellow-600',
                        platinum: 'from-cyan-400 to-blue-500',
                      };
                      const levelColor = badge.level ? levelColors[badge.level] : 'from-yellow-400 to-orange-500';
                      
                      return (
                        <div key={badge.id} className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${levelColor} bg-opacity-10 rounded-xl border shadow-sm`}>
                          <div className="text-3xl">{badge.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{badge.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Earned {formatDate(badge.earnedDate)}</p>
                          </div>
                          <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {member.projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No active projects</div>
                  ) : (
                    member.projects.map(project => (
                      <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                            <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{project.role}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>Started: {formatDate(project.startDate)}</span>
                          {project.endDate && <span>End: {formatDate(project.endDate)}</span>}
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.progress}% complete</p>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'performance' && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {member.performanceReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No performance reviews yet</div>
                  ) : (
                    member.performanceReviews.map((review, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{review.quarter}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.feedback}</p>
                      </div>
                    ))
                  )}
                  
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{member.tasksCompleted}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tasks Completed</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{member.productivity}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Productivity</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{member.badges.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Badges Earned</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex space-x-3 mt-6 pt-6 border-t dark:border-gray-700">
              <button
                onClick={handleMessageClick}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              <button
                onClick={handleShareClick}
                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium flex items-center justify-center space-x-2 transition-colors text-gray-700 dark:text-gray-300"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// STAT CARD (with dark mode)
// ============================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'orange' | 'red' | 'pink' | 'teal';
  trend?: number;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, trend, delay = 0 }) => {
  const colorGradients: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-pink-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <Card3D className="p-4" depth={10}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="flex items-center space-x-3"
      >
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorGradients[color]} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </p>
          <div className="flex items-center space-x-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            {trend !== undefined && (
              <span className={`text-xs flex items-center ${trend >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Card3D>
  );
};

// ============================================
// DEPARTMENT CARD (with dark mode)
// ============================================

interface DepartmentCardProps {
  department: Department;
  isActive: boolean;
  onClick: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, isActive, onClick }) => {
  return (
    <Card3D
      className={`p-4 cursor-pointer transition-all ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
      depth={12}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: department.color }} />
        <span className="text-xs text-gray-500 dark:text-gray-400">{department.memberCount} members</span>
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white">{department.name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">Lead: {department.lead}</p>
      {department.objectives && department.objectives.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{department.objectives[0]}</p>
        </div>
      )}
    </Card3D>
  );
};

// ============================================
// INVITE MEMBER MODAL (with dark mode)
// ============================================

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string, department: string) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [department, setDepartment] = useState('Engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onInvite(email, role, department);
      setEmail('');
      onClose();
    }
  };

  if (!isOpen) return null;

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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Team Member</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option>Developer</option>
                <option>Senior Developer</option>
                <option>Designer</option>
                <option>Product Manager</option>
                <option>QA Engineer</option>
                <option>Team Lead</option>
                <option>DevOps Engineer</option>
                <option>Data Scientist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>QA</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Send Invitation</span>
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
              An email invitation will be sent with instructions to join.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// MAIN TEAM COMPONENT
// ============================================

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'productivity' | 'tasksCompleted' | 'recent'>('productivity');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    addToast(`Switched to ${newDarkMode ? 'dark' : 'light'} mode`, 'success');
  };

  const [stats, setStats] = useState<TeamStats>({
    totalMembers: 0,
    onlineNow: 0,
    avgProductivity: 0,
    tasksCompletedThisWeek: 0,
    totalProjects: 0,
    teamStreak: 12,
    totalHoursLogged: 0,
    activeProjectsCount: 0,
    completionRate: 0,
    satisfactionScore: 0,
  });

  const departments: Department[] = useMemo(() => [
    { id: 'd1', name: 'Design', lead: 'Alice Johnson', memberCount: 0, color: '#3b82f6', objectives: ['Launch new design system', 'Improve UX metrics'] },
    { id: 'd2', name: 'Engineering', lead: 'Bob Smith', memberCount: 0, color: '#10b981', objectives: ['Reduce technical debt', 'Improve CI/CD'] },
    { id: 'd3', name: 'Product', lead: 'Eve Wilson', memberCount: 0, color: '#8b5cf6', objectives: ['Launch Q4 roadmap', 'Customer feedback integration'] },
    { id: 'd4', name: 'QA', lead: 'Diana Prince', memberCount: 0, color: '#f59e0b', objectives: ['Automation coverage 80%', 'Bug reduction'] },
    { id: 'd5', name: 'Marketing', lead: 'Frank Miller', memberCount: 0, color: '#ec4899', objectives: ['Brand awareness campaign'] },
    { id: 'd6', name: 'Sales', lead: 'Grace Lee', memberCount: 0, color: '#14b8a6', objectives: ['Q4 revenue targets'] },
  ], []);

  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    members.forEach(m => roles.add(m.role));
    return Array.from(roles);
  }, [members]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefreshed(new Date());
      addToast('Team data refreshed successfully', 'success');
    }, 500);
  }, [addToast]);

  // Initialize mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@taskcollab.com',
          phone: '+1 (555) 123-4567',
          avatar: 'AJ',
          role: 'Lead Designer',
          department: 'Design',
          status: 'online',
          joinDate: '2024-03-15',
          lastActive: new Date().toISOString(),
          location: 'San Francisco, CA',
          timezone: 'PST',
          skills: [
            { name: 'UI Design', level: 95, endorsements: 12 },
            { name: 'Figma', level: 98, endorsements: 15 },
            { name: 'User Research', level: 85, endorsements: 8 },
            { name: 'Prototyping', level: 90, endorsements: 10 },
            { name: 'Design Systems', level: 88, endorsements: 7 }
          ],
          projects: [
            { id: 'p1', name: 'Dashboard Redesign', role: 'Lead Designer', startDate: '2024-08-01', progress: 75, color: '#3b82f6' },
            { id: 'p2', name: 'Mobile App', role: 'UI Designer', startDate: '2024-09-15', progress: 45, color: '#8b5cf6' }
          ],
          tasksCompleted: 245,
          tasksInProgress: 3,
          tasksOverdue: 0,
          productivity: 92,
          productivityTrend: [85, 87, 88, 90, 91, 92],
          hoursThisWeek: 38,
          hoursTarget: 40,
          recentActivity: [
            { id: 'a1', type: 'task_completed', description: 'Completed dashboard wireframes', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
            { id: 'a2', type: 'comment', description: 'Commented on API documentation', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
            { id: 'a3', type: 'review', description: 'Reviewed mobile app designs', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
            { id: 'a4', type: 'login', description: 'Logged in from new device', timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
          ],
          badges: [
            { id: 'b1', name: 'Top Performer', icon: '🏆', description: 'Highest productivity for 3 months', earnedDate: '2024-04-01', color: '#f59e0b', level: 'gold' },
            { id: 'b2', name: 'Early Bird', icon: '🌅', description: 'First to complete daily tasks', earnedDate: '2024-03-15', color: '#3b82f6', level: 'silver' },
            { id: 'b3', name: 'Team Player', icon: '🤝', description: 'Collaborated on 50+ tasks', earnedDate: '2024-02-20', color: '#10b981', level: 'bronze' },
          ],
          certifications: [
            { id: 'c1', name: 'Advanced Figma', issuer: 'Figma', issueDate: '2024-01-15', credentialId: 'FIG-12345' }
          ],
          contactInfo: { email: 'alice@taskcollab.com', phone: '+1 (555) 123-4567', slack: '@alice', github: 'alicej', linkedin: 'alice-johnson' },
          performanceReviews: [
            { quarter: 'Q2 2024', rating: 5, feedback: 'Exceptional performance and leadership skills.' },
            { quarter: 'Q1 2024', rating: 5, feedback: 'Consistently delivers high-quality work.' }
          ],
          manager: 'Sarah Chen',
          isAdmin: false,
          isManager: true,
          createdAt: '2024-03-15',
          updatedAt: '2024-11-01',
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@taskcollab.com',
          phone: '+1 (555) 234-5678',
          avatar: 'BS',
          role: 'Senior Developer',
          department: 'Engineering',
          status: 'busy',
          joinDate: '2024-01-10',
          lastActive: new Date(Date.now() - 5 * 60000).toISOString(),
          location: 'New York, NY',
          timezone: 'EST',
          skills: [
            { name: 'React', level: 95, endorsements: 20 },
            { name: 'Node.js', level: 90, endorsements: 15 },
            { name: 'TypeScript', level: 88, endorsements: 12 },
            { name: 'PostgreSQL', level: 85, endorsements: 10 },
            { name: 'AWS', level: 80, endorsements: 8 }
          ],
          projects: [
            { id: 'p3', name: 'API Development', role: 'Lead Developer', startDate: '2024-07-01', progress: 90, color: '#10b981' },
            { id: 'p4', name: 'CI/CD Pipeline', role: 'DevOps Lead', startDate: '2024-08-15', progress: 60, color: '#f59e0b' }
          ],
          tasksCompleted: 189,
          tasksInProgress: 5,
          tasksOverdue: 1,
          productivity: 87,
          productivityTrend: [80, 82, 84, 85, 86, 87],
          hoursThisWeek: 42,
          hoursTarget: 40,
          recentActivity: [
            { id: 'a5', type: 'task_completed', description: 'Set up CI/CD pipeline', timestamp: new Date(Date.now() - 10 * 3600000).toISOString() },
            { id: 'a6', type: 'task_created', description: 'Created API optimization task', timestamp: new Date(Date.now() - 30 * 3600000).toISOString() },
          ],
          badges: [
            { id: 'b4', name: 'Code Wizard', icon: '🧙', description: 'Resolved 100+ complex issues', earnedDate: '2024-05-01', color: '#8b5cf6', level: 'gold' },
            { id: 'b5', name: 'Night Owl', icon: '🦉', description: 'Most active during late hours', earnedDate: '2024-04-15', color: '#6366f1', level: 'silver' },
          ],
          certifications: [
            { id: 'c2', name: 'AWS Solutions Architect', issuer: 'Amazon', issueDate: '2024-03-10', credentialId: 'AWS-98765' }
          ],
          contactInfo: { email: 'bob@taskcollab.com', phone: '+1 (555) 234-5678', slack: '@bob', github: 'bobsmith', twitter: '@bobdev' },
          performanceReviews: [
            { quarter: 'Q2 2024', rating: 4, feedback: 'Great technical skills, improving collaboration.' }
          ],
          manager: 'Mike Johnson',
          isAdmin: false,
          isManager: false,
          createdAt: '2024-01-10',
          updatedAt: '2024-11-01',
        },
        {
          id: '3',
          name: 'Charlie Brown',
          email: 'charlie@taskcollab.com',
          phone: '+1 (555) 345-6789',
          avatar: 'CB',
          role: 'Backend Developer',
          department: 'Engineering',
          status: 'online',
          joinDate: '2024-06-01',
          lastActive: new Date().toISOString(),
          location: 'Austin, TX',
          timezone: 'CST',
          skills: [
            { name: 'Python', level: 92, endorsements: 14 },
            { name: 'Django', level: 88, endorsements: 10 },
            { name: 'PostgreSQL', level: 85, endorsements: 9 },
            { name: 'Redis', level: 75, endorsements: 5 },
            { name: 'Docker', level: 82, endorsements: 7 }
          ],
          projects: [
            { id: 'p3', name: 'API Development', role: 'Backend Developer', startDate: '2024-08-01', progress: 85, color: '#10b981' }
          ],
          tasksCompleted: 156,
          tasksInProgress: 2,
          tasksOverdue: 0,
          productivity: 78,
          productivityTrend: [70, 72, 74, 75, 77, 78],
          hoursThisWeek: 35,
          hoursTarget: 40,
          recentActivity: [
            { id: 'a7', type: 'task_completed', description: 'Optimized database queries', timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
          ],
          badges: [
            { id: 'b6', name: 'Bug Hunter', icon: '🐛', description: 'Found and fixed 50+ bugs', earnedDate: '2024-03-01', color: '#ef4444', level: 'silver' },
          ],
          certifications: [],
          contactInfo: { email: 'charlie@taskcollab.com', phone: '+1 (555) 345-6789', slack: '@charlie', github: 'charlieb' },
          performanceReviews: [
            { quarter: 'Q3 2024', rating: 3, feedback: 'Solid contributor, needs to improve documentation.' }
          ],
          manager: 'Bob Smith',
          isAdmin: false,
          isManager: false,
          createdAt: '2024-06-01',
          updatedAt: '2024-11-01',
        },
        {
          id: '4',
          name: 'Diana Prince',
          email: 'diana@taskcollab.com',
          phone: '+1 (555) 456-7890',
          avatar: 'DP',
          role: 'QA Engineer',
          department: 'QA',
          status: 'idle',
          joinDate: '2024-09-01',
          lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
          location: 'Seattle, WA',
          timezone: 'PST',
          skills: [
            { name: 'Testing', level: 95, endorsements: 18 },
            { name: 'Selenium', level: 90, endorsements: 12 },
            { name: 'Cypress', level: 88, endorsements: 10 },
            { name: 'JIRA', level: 85, endorsements: 8 },
            { name: 'TestRail', level: 82, endorsements: 6 }
          ],
          projects: [
            { id: 'p1', name: 'Dashboard Redesign', role: 'QA Lead', startDate: '2024-09-01', progress: 70, color: '#3b82f6' },
            { id: 'p2', name: 'Mobile App', role: 'QA Engineer', startDate: '2024-09-15', progress: 40, color: '#8b5cf6' }
          ],
          tasksCompleted: 210,
          tasksInProgress: 1,
          tasksOverdue: 0,
          productivity: 95,
          productivityTrend: [90, 91, 92, 93, 94, 95],
          hoursThisWeek: 40,
          hoursTarget: 40,
          recentActivity: [
            { id: 'a8', type: 'review', description: 'Tested mobile app release', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
            { id: 'a9', type: 'task_completed', description: 'Completed test suite update', timestamp: new Date(Date.now() - 25 * 3600000).toISOString() },
          ],
          badges: [
            { id: 'b7', name: 'Quality Champion', icon: '🛡️', description: 'Zero bugs in production for 6 months', earnedDate: '2024-05-01', color: '#10b981', level: 'platinum' },
            { id: 'b8', name: 'Perfect Attendance', icon: '💯', description: 'No missed deadlines ever', earnedDate: '2024-01-01', color: '#3b82f6', level: 'gold' },
          ],
          certifications: [
            { id: 'c3', name: 'ISTQB Certified Tester', issuer: 'ISTQB', issueDate: '2024-02-15', credentialId: 'ISTQB-45678' }
          ],
          contactInfo: { email: 'diana@taskcollab.com', phone: '+1 (555) 456-7890', slack: '@diana', github: 'dianap', linkedin: 'diana-prince' },
          performanceReviews: [
            { quarter: 'Q3 2024', rating: 5, feedback: 'Exceptional attention to detail and quality.' }
          ],
          manager: 'Eve Wilson',
          isAdmin: false,
          isManager: true,
          createdAt: '2024-09-01',
          updatedAt: '2024-11-01',
        },
        {
          id: '5',
          name: 'Eve Wilson',
          email: 'eve@taskcollab.com',
          phone: '+1 (555) 567-8901',
          avatar: 'EW',
          role: 'Product Manager',
          department: 'Product',
          status: 'offline',
          joinDate: '2024-02-01',
          lastActive: new Date(Date.now() - 60 * 60000).toISOString(),
          location: 'Chicago, IL',
          timezone: 'CST',
          skills: [
            { name: 'Product Strategy', level: 92, endorsements: 15 },
            { name: 'Agile', level: 95, endorsements: 18 },
            { name: 'Roadmapping', level: 90, endorsements: 12 },
            { name: 'Analytics', level: 85, endorsements: 10 },
            { name: 'Stakeholder Management', level: 88, endorsements: 11 }
          ],
          projects: [
            { id: 'p1', name: 'Dashboard Redesign', role: 'Product Owner', startDate: '2024-08-01', progress: 75, color: '#3b82f6' },
            { id: 'p2', name: 'Mobile App', role: 'Product Manager', startDate: '2024-09-15', progress: 45, color: '#8b5cf6' }
          ],
          tasksCompleted: 98,
          tasksInProgress: 0,
          tasksOverdue: 2,
          productivity: 72,
          productivityTrend: [68, 69, 70, 71, 72, 72],
          hoursThisWeek: 30,
          hoursTarget: 40,
          recentActivity: [
            { id: 'a10', type: 'meeting', description: 'Led stakeholder meeting', timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
          ],
          badges: [
            { id: 'b9', name: 'Visionary', icon: '🔮', description: 'Planned 4 successful quarters', earnedDate: '2024-04-01', color: '#8b5cf6', level: 'gold' },
          ],
          certifications: [
            { id: 'c4', name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', issueDate: '2024-01-20', credentialId: 'CSPO-12345' }
          ],
          contactInfo: { email: 'eve@taskcollab.com', phone: '+1 (555) 567-8901', slack: '@eve', github: 'evew', linkedin: 'eve-wilson' },
          performanceReviews: [
            { quarter: 'Q2 2024', rating: 4, feedback: 'Strong product vision, improve delivery timelines.' }
          ],
          manager: 'CEO Office',
          isAdmin: true,
          isManager: true,
          createdAt: '2024-02-01',
          updatedAt: '2024-11-01',
        },
      ];

      setMembers(mockMembers);
      
      const onlineNow = mockMembers.filter(m => m.status === 'online').length;
      const avgProd = Math.round(mockMembers.reduce((s, m) => s + m.productivity, 0) / mockMembers.length);
      const totalTasks = mockMembers.reduce((s, m) => s + m.tasksCompleted, 0);
      const allProjects = new Set(mockMembers.flatMap(m => m.projects.map(p => p.name)));
      const totalHours = mockMembers.reduce((s, m) => s + m.hoursThisWeek, 0);
      const completionRate = Math.round((mockMembers.filter(m => m.tasksOverdue === 0).length / mockMembers.length) * 100);
      
      setStats({
        totalMembers: mockMembers.length,
        onlineNow,
        avgProductivity: avgProd,
        tasksCompletedThisWeek: totalTasks,
        totalProjects: allProjects.size,
        teamStreak: 12,
        totalHoursLogged: totalHours,
        activeProjectsCount: 8,
        completionRate,
        satisfactionScore: 92,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = useMemo(() => {
    return members
      .filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             m.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesDept = filterDepartment === 'all' || m.department === filterDepartment;
        const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
        const matchesRole = filterRole === 'all' || m.role === filterRole;
        return matchesSearch && matchesDept && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'productivity') return b.productivity - a.productivity;
        if (sortBy === 'tasksCompleted') return b.tasksCompleted - a.tasksCompleted;
        if (sortBy === 'recent') return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        return 0;
      });
  }, [members, searchQuery, filterDepartment, filterStatus, filterRole, sortBy]);

  const handleMemberSelect = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  }, []);

  const handleEditMember = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  }, []);

  const handleSaveMember = useCallback((updatedMember: TeamMember) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    addToast(`${updatedMember.name}'s profile has been updated`, 'success');
  }, [addToast]);

  const handleMessageMember = useCallback((member: TeamMember) => {
    addToast(`Opening conversation with ${member.name}...`, 'info');
  }, [addToast]);

  const handleShareMember = useCallback((member: TeamMember) => {
    const shareUrl = `${window.location.origin}/team/member/${member.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      addToast(`Profile link for ${member.name} copied to clipboard!`, 'success');
    }).catch(() => {
      addToast(`Failed to copy link.`, 'error');
    });
  }, [addToast]);

  const handleDeleteMember = useCallback((member: TeamMember) => {
    setMembers(prev => prev.filter(m => m.id !== member.id));
    addToast(`${member.name} has been removed from the team`, 'success');
    setStats(prev => ({
      ...prev,
      totalMembers: prev.totalMembers - 1,
      onlineNow: member.status === 'online' ? prev.onlineNow - 1 : prev.onlineNow,
    }));
  }, [addToast]);

  const handleInviteMember = useCallback((email: string, role: string, department: string) => {
    addToast(`Invitation sent to ${email} for ${role} role in ${department}`, 'success');
  }, [addToast]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterDepartment('all');
    setFilterStatus('all');
    setFilterRole('all');
    setSortBy('productivity');
  }, []);

  const toggleMemberSelection = useCallback((memberId: string) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-500 dark:text-gray-400"
        >
          Loading team data...
        </motion.p>
      </div>
    );
  }

  const departmentsWithCounts = departments.map(dept => ({
    ...dept,
    memberCount: members.filter(m => m.department === dept.name).length
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <Users className="w-7 h-7 text-blue-500" />
              Team
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 mt-1"
            >
              {stats.totalMembers} members • {stats.onlineNow} online now • Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </motion.p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            <button
              onClick={refreshData}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                aria-label="List view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Invite Member</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-4">
          <StatCard label="Members" value={stats.totalMembers} icon={Users} color="blue" trend={5} delay={0} />
          <StatCard label="Online" value={stats.onlineNow} icon={Activity} color="green" trend={3} delay={0.05} />
          <StatCard label="Avg Productivity" value={`${stats.avgProductivity}%`} icon={TrendingUp} color="purple" trend={2} delay={0.1} />
          <StatCard label="Tasks Done" value={stats.tasksCompletedThisWeek} icon={CheckCircle2} color="indigo" trend={12} delay={0.15} />
          <StatCard label="Projects" value={stats.totalProjects} icon={Briefcase} color="orange" delay={0.2} />
          <StatCard label="Streak" value={`${stats.teamStreak}d`} icon={Flame} color="red" delay={0.25} />
          <StatCard label="Hours Logged" value={stats.totalHoursLogged} icon={Clock} color="teal" trend={8} delay={0.3} />
          <StatCard label="Completion" value={`${stats.completionRate}%`} icon={Target} color="pink" trend={4} delay={0.35} />
        </div>

        {/* Departments */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {departmentsWithCounts.map(dept => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              isActive={filterDepartment === dept.name}
              onClick={() => setFilterDepartment(filterDepartment === dept.name ? 'all' : dept.name)}
            />
          ))}
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, role, department, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-shadow"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl border flex items-center space-x-2 transition-colors ${
                  showFilters || filterDepartment !== 'all' || filterStatus !== 'all' || filterRole !== 'all' || sortBy !== 'productivity'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(filterDepartment !== 'all' || filterStatus !== 'all' || filterRole !== 'all' || sortBy !== 'productivity') && (
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {Number(filterDepartment !== 'all') + Number(filterStatus !== 'all') + Number(filterRole !== 'all') + Number(sortBy !== 'productivity')}
                  </span>
                )}
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Department</label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Departments</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="online">Online</option>
                      <option value="busy">Busy</option>
                      <option value="idle">Idle</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Role</label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Roles</option>
                      {allRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="productivity">Highest Productivity</option>
                      <option value="tasksCompleted">Most Tasks Completed</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="recent">Recently Active</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selection Info Bar */}
        {selectedMembers.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-400">
              {selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => addToast(`Opening group message for ${selectedMembers.size} members...`, 'info')}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Message Selected
              </button>
              <button
                onClick={() => setSelectedMembers(new Set())}
                className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Members Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredMembers.map(member => {
                const isSelected = selectedMembers.has(member.id);
                return (
                  <div key={member.id} className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMemberSelection(member.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <MemberCard
                      member={member}
                      onSelect={handleMemberSelect}
                      onQuickMessage={handleMessageMember}
                      isSelected={selectedMember?.id === member.id}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
            {filteredMembers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No members found</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <Card3D className="overflow-hidden" depth={15}>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No members found</h3>
                </div>
              ) : (
                filteredMembers.map(member => (
                  <div key={member.id} className="flex items-center">
                    <div className="pl-4">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => toggleMemberSelection(member.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <MemberListItem
                        member={member}
                        onSelect={handleMemberSelect}
                        onQuickMessage={handleMessageMember}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card3D>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4">
          <p>Showing {filteredMembers.length} of {members.length} members</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            </span>
            <button
              onClick={refreshData}
              className="flex items-center space-x-1 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MemberDetailModal
        member={selectedMember}
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onEdit={handleEditMember}
        onMessage={handleMessageMember}
        onShare={handleShareMember}
        onDelete={handleDeleteMember}
      />
      <EditMemberModal
        member={selectedMember}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveMember}
      />
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteMember}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}