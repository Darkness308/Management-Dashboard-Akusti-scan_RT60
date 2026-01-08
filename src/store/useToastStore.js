import { create } from 'zustand'

/**
 * Toast Store for managing notifications
 */
const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    // Use crypto.randomUUID if available, otherwise fallback to timestamp + random
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newToast = {
      id,
      type: 'info', // info, success, warning, error
      message: '',
      duration: 5000,
      ...toast
    }
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))
    
    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }
    
    return id
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },
  
  clearAllToasts: () => {
    set({ toasts: [] })
  }
}))

export default useToastStore
