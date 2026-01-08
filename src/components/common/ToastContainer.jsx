import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import useToastStore from '@/store/useToastStore'

/**
 * Toast Notification Component
 * Displays temporary notifications to the user
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />
      case 'error':
        return <AlertCircle className="text-red-600" size={20} />
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />
      case 'info':
      default:
        return <Info className="text-blue-600" size={20} />
    }
  }

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  if (toasts.length === 0) return null

  return (
    <div 
      className="fixed top-20 right-4 z-50 space-y-2 max-w-md"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg
            animate-slide-up
            ${getToastStyles(toast.type)}
          `}
          role="alert"
        >
          <div className="flex-shrink-0 mt-0.5">
            {getToastIcon(toast.type)}
          </div>
          
          <div className="flex-1 text-sm">
            {toast.title && (
              <p className="font-semibold mb-1">{toast.title}</p>
            )}
            <p>{toast.message}</p>
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Schließen"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

/**
 * Hook to use toast notifications
 */
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast)

  return {
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    custom: (options) => addToast(options)
  }
}
