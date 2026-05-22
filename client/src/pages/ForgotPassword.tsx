// src/pages/ForgotPassword.tsx - Password Recovery Page
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, ArrowLeft, CheckCircle2, Send, RefreshCw, 
  AlertCircle, Shield, Clock, MessageCircle, 
  Phone, Key, Lock, Eye, EyeOff, UserCheck,
  Fingerprint, Smartphone, Globe, HelpCircle
} from 'lucide-react'

// Types
interface ResetMethod {
  id: string
  name: string
  icon: React.ElementType
  description: string
  placeholder: string
  type: 'email' | 'phone' | 'username'
}

interface SecurityQuestion {
  id: string
  question: string
}

// Countdown Timer Component
const CountdownTimer: React.FC<{ seconds: number; onComplete: () => void }> = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, onComplete])

  return (
    <div className="text-center">
      <p className="text-sm text-gray-500">
        Resend code in <span className="font-semibold text-blue-600">{timeLeft}</span> seconds
      </p>
    </div>
  )
}

// Verification Code Input Component
const VerificationCodeInput: React.FC<{ onComplete: (code: string) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = Array(6).fill(null).map(() => useRef<HTMLInputElement>(null))

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every(c => c !== '') && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleSubmit = async (verificationCode: string) => {
    setIsVerifying(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsVerifying(false)
    onComplete(verificationCode)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-purple-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Verify Your Identity</h2>
        <p className="text-sm text-gray-500 mt-2">
          Enter the 6-digit verification code sent to your email
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            autoFocus={index === 0}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => handleSubmit(code.join(''))}
          disabled={code.some(c => c === '') || isVerifying}
          className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Verify
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// Security Questions Component
const SecurityQuestions: React.FC<{ onVerify: () => void; onBack: () => void }> = ({ onVerify, onBack }) => {
  const [answers, setAnswers] = useState({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')

  const questions: SecurityQuestion[] = [
    { id: '1', question: 'What was your first pet\'s name?' },
    { id: '2', question: 'What city were you born in?' },
    { id: '3', question: 'What was your first car?' }
  ]

  const handleSubmit = async () => {
    setError('')
    if (Object.keys(answers).length < 3) {
      setError('Please answer all security questions')
      return
    }
    
    setIsVerifying(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsVerifying(false)
    onVerify()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Security Verification</h2>
        <p className="text-sm text-gray-500 mt-2">Answer your security questions</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {questions.map(q => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{q.question}</label>
            <input
              type="text"
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="Your answer"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isVerifying}
          className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verify Identity
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// Success Component
const SuccessScreen: React.FC<{ email: string; onReset: () => void }> = ({ email, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
      <p className="text-gray-600 mt-3">
        We've sent a password reset link to{' '}
        <span className="font-semibold text-blue-600">{email}</span>
      </p>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-3 text-left">
          <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Link expires in 1 hour</p>
            <p>For security, the reset link will expire after 60 minutes.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or{' '}
          <button onClick={onReset} className="text-blue-500 hover:text-blue-600 font-medium">
            try again
          </button>
        </p>
        
        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            Back to Login
          </Link>
          <button
            onClick={() => window.location.href = 'mailto:support@taskcollab.com'}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Main Component
export default function ForgotPassword() {
  const [step, setStep] = useState<'method' | 'verify' | 'security' | 'success'>('method')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [resetMethod, setResetMethod] = useState<ResetMethod['type']>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCount, setResendCount] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false)

  const resetMethods: ResetMethod[] = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Send reset link to email', placeholder: 'you@example.com', type: 'email' },
    { id: 'phone', name: 'Phone', icon: Smartphone, description: 'Send code via SMS', placeholder: '+1 234 567 8900', type: 'phone' },
    { id: 'username', name: 'Username', icon: UserCheck, description: 'Use security questions', placeholder: 'your_username', type: 'username' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    let identifier = ''
    if (resetMethod === 'email') identifier = email
    else if (resetMethod === 'phone') identifier = phone
    else identifier = username

    if (!identifier.trim()) {
      setError(`Please enter your ${resetMethod}`)
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (resetMethod === 'username') {
      setShowSecurityQuestions(true)
      setStep('security')
    } else {
      setStep('verify')
    }
    
    setIsLoading(false)
  }

  const handleResendCode = () => {
    if (!canResend) return
    setResendCount(prev => prev + 1)
    setCanResend(false)
    // Simulate resending code
    setTimeout(() => setCanResend(true), 60000)
  }

  const handleVerificationComplete = (code: string) => {
    setStep('success')
  }

  const handleSecurityVerify = () => {
    setStep('success')
  }

  const handleReset = () => {
    setStep('method')
    setEmail('')
    setUsername('')
    setPhone('')
    setError('')
    setResendCount(0)
    setShowSecurityQuestions(false)
  }

  const getMethodIcon = (method: ResetMethod['type']) => {
    switch(method) {
      case 'email': return <Mail className="w-5 h-5" />
      case 'phone': return <Smartphone className="w-5 h-5" />
      case 'username': return <UserCheck className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        {step !== 'success' && (
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to login</span>
          </Link>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                    <p className="text-gray-500 mt-2">Choose how to reset your password</p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {/* Reset Method Selection */}
                  <div className="grid gap-3">
                    {resetMethods.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setResetMethod(method.type)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          resetMethod === method.type
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          resetMethod === method.type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                        {resetMethod === method.type && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Input Field */}
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {resetMethod === 'email' && 'Email Address'}
                        {resetMethod === 'phone' && 'Phone Number'}
                        {resetMethod === 'username' && 'Username'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {getMethodIcon(resetMethod)}
                        </div>
                        <input
                          type={resetMethod === 'email' ? 'email' : 'text'}
                          value={resetMethod === 'email' ? email : resetMethod === 'phone' ? phone : username}
                          onChange={(e) => {
                            if (resetMethod === 'email') setEmail(e.target.value)
                            else if (resetMethod === 'phone') setPhone(e.target.value)
                            else setUsername(e.target.value)
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder={resetMethods.find(m => m.type === resetMethod)?.placeholder}
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Continue</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Help Text */}
                  <div className="text-center text-xs text-gray-400">
                    <p>We'll send you a verification code or link to reset your password.</p>
                  </div>
                </motion.div>
              )}

              {step === 'verify' && (
                <div className="space-y-4">
                  <VerificationCodeInput
                    onComplete={handleVerificationComplete}
                    onBack={() => setStep('method')}
                  />
                  
                  <div className="text-center pt-4">
                    {!canResend ? (
                      <CountdownTimer seconds={60} onComplete={() => setCanResend(true)} />
                    ) : (
                      <button
                        onClick={handleResendCode}
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Resend verification code
                      </button>
                    )}
                    {resendCount > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        Resend attempts: {resendCount}/3
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 'security' && (
                <SecurityQuestions
                  onVerify={handleSecurityVerify}
                  onBack={() => setStep('method')}
                />
              )}

              {step === 'success' && (
                <SuccessScreen
                  email={resetMethod === 'email' ? email : 'your email'}
                  onReset={handleReset}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help Links */}
        <div className="text-center mt-6 space-x-4">
          <Link to="/help" className="text-sm text-gray-500 hover:text-gray-700">
            Need help?
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-700">
            Contact Support
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/security" className="text-sm text-gray-500 hover:text-gray-700">
            Security Tips
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

// Missing import for useRef
import { useRef } from 'react'