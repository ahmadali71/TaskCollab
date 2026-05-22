// src/pages/ResetPassword.tsx - Password Reset Page
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, Eye, EyeOff, CheckCircle2, RefreshCw, Shield, Check, 
  AlertCircle, ArrowLeft, Zap, Key, Fingerprint, Mail, 
  XCircle, ThumbsUp, Sparkles
} from 'lucide-react'

// ============================================
// PASSWORD STRENGTH UTILITIES
// ============================================

interface PasswordRequirement {
  label: string
  met: boolean
  icon?: React.ReactNode
}

const checkPasswordStrength = (password: string): {
  score: number
  label: string
  color: string
  bgColor: string
  requirements: PasswordRequirement[]
} => {
  let score = 0
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
  ]
  
  requirements.forEach(req => {
    if (req.met) score++
  })

  const config = {
    0: { label: 'Very Weak', color: 'text-red-500', bgColor: 'bg-red-500', width: '10%' },
    1: { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-500', width: '25%' },
    2: { label: 'Fair', color: 'text-orange-500', bgColor: 'bg-orange-500', width: '50%' },
    3: { label: 'Good', color: 'text-yellow-500', bgColor: 'bg-yellow-500', width: '75%' },
    4: { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500', width: '100%' },
    5: { label: 'Very Strong', color: 'text-emerald-500', bgColor: 'bg-emerald-500', width: '100%' },
  }

  return {
    score,
    label: config[score as keyof typeof config]?.label || 'Weak',
    color: config[score as keyof typeof config]?.color || 'text-red-500',
    bgColor: config[score as keyof typeof config]?.bgColor || 'bg-red-500',
    requirements
  }
}

// ============================================
// TOAST NOTIFICATION
// ============================================

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const ToastNotification: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: { bg: 'bg-green-500', icon: CheckCircle2 },
    error: { bg: 'bg-red-500', icon: AlertCircle },
    info: { bg: 'bg-blue-500', icon: Mail },
    warning: { bg: 'bg-yellow-500', icon: AlertCircle },
  }
  const { bg, icon: Icon } = config[toast.type]

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
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

// ============================================
// PASSWORD INPUT WITH STRENGTH METER
// ============================================

interface PasswordInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showStrength?: boolean
  error?: string
  autoFocus?: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter password',
  showStrength = false,
  error,
  autoFocus = false
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const strength = checkPasswordStrength(value)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200
            ${error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}
            focus:ring-2 focus:ring-blue-200 focus:outline-none`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      {showStrength && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: strength.score * 20 + '%' }}
                className={`h-full rounded-full ${strength.bgColor} transition-all duration-500`}
              />
            </div>
            <span className={`text-xs font-medium ${strength.color}`}>
              {strength.label}
            </span>
          </div>
        </motion.div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 flex items-center space-x-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// ============================================
// MAIN RESET PASSWORD COMPONENT
// ============================================

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ password: false, confirm: false })
  const [toasts, setToasts] = useState<Toast[]>([])
  const [resendCountdown, setResendCountdown] = useState(0)

  // Add toast notification
  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Validate passwords match
  const passwordsMatch = password === confirmPassword
  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
  
  // Get password requirements
  const strength = checkPasswordStrength(password)

  // Handle resend reset link
  const handleResendLink = async () => {
    if (resendCountdown > 0) return
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setResendCountdown(60)
      addToast('Reset link has been sent to your email', 'success')
      
      const interval = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!passwordsMatch) {
      setError('Passwords do not match')
      addToast('Passwords do not match', 'error')
      return
    }
    
    if (!isPasswordValid) {
      setError('Password does not meet security requirements')
      addToast('Password does not meet security requirements', 'error')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      addToast('Password reset successful! Redirecting to login...', 'success')
      setTimeout(() => navigate('/login'), 2500)
    }, 1500)
  }

  // Check if token is invalid
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-500 mb-6">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Request New Link
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-500 mb-6">
              Your password has been reset. Redirecting you to the login page...
            </p>
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-3 border-blue-200 border-t-blue-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="reset-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Key className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900"
              >
                Set New Password
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 mt-2"
              >
                Create a strong password for your account
              </motion.p>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordInput
                label="New Password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your new password"
                showStrength={true}
                autoFocus={true}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setTouched(prev => ({ ...prev, confirm: true }))}
                    placeholder="Confirm your new password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200
                      ${!passwordsMatch && confirmPassword && touched.confirm 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : passwordsMatch && confirmPassword 
                        ? 'border-green-300 bg-green-50 focus:border-green-500'
                        : 'border-gray-200 focus:border-blue-500'}
                      focus:ring-2 focus:ring-blue-200 focus:outline-none`}
                  />
                  {confirmPassword && passwordsMatch && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                  {confirmPassword && !passwordsMatch && touched.confirm && (
                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  )}
                </div>
                {confirmPassword && !passwordsMatch && touched.confirm && (
                  <p className="text-xs text-red-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Passwords do not match</span>
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">Password Requirements:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {strength.requirements.map((req, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center space-x-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                          ${req.met ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        {req.met && <Check className="w-3 h-3 text-white" />}
                      </motion.div>
                      <span className={`text-xs ${req.met ? 'text-gray-700' : 'text-gray-400'}`}>
                        {req.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Password Tips */}
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Password Tips:</p>
                    <ul className="text-xs text-amber-700 mt-1 space-y-1">
                      <li>• Use a combination of letters, numbers, and symbols</li>
                      <li>• Avoid using common words or personal information</li>
                      <li>• Make it at least 12 characters for extra security</li>
                      <li>• Don't reuse passwords from other accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold 
                  hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </motion.button>

              {/* Additional Links */}
              <div className="pt-4 text-center space-y-3">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Didn't receive the reset link? 
                    <button
                      type="button"
                      onClick={handleResendLink}
                      disabled={resendCountdown > 0}
                      className="ml-1 text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend email'}
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <div className="inline-flex items-center space-x-2 text-xs text-gray-400 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <Fingerprint className="w-3 h-3" />
              <span>Your password is encrypted and never shared</span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}