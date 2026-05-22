import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { clsx } from 'clsx'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose: (id: string) => void
  duration?: number
}

function Toast({ id, type, title, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={clsx(
        'flex items-start space-x-3 p-4 rounded-lg border shadow-lg animate-slide-in',
        bgColors[type]
      )}
    >
      {icons[type]}
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}

export default Toast