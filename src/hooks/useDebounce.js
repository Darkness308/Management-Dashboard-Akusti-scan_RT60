import { useEffect, useRef, useState } from 'react'

/**
 * Debounce function
 * Delays function execution until after a specified wait time has elapsed
 * since the last time it was invoked
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 * Ensures function is called at most once per specified time period
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Hook for debounced callbacks
 * 
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced callback
 */
export function useDebounce(callback, delay = 300) {
  const callbackRef = useRef(callback)
  const debouncedFnRef = useRef(null)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  // Create debounced function only once per delay value
  if (!debouncedFnRef.current || debouncedFnRef.current.delay !== delay) {
    debouncedFnRef.current = debounce((...args) => callbackRef.current(...args), delay)
    debouncedFnRef.current.delay = delay
  }
  
  return debouncedFnRef.current
}

/**
 * Hook for throttled callbacks
 * 
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Minimum time between calls
 * @returns {Function} Throttled callback
 */
export function useThrottle(callback, limit = 300) {
  const callbackRef = useRef(callback)
  const throttledFnRef = useRef(null)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  // Create throttled function only once per limit value
  if (!throttledFnRef.current || throttledFnRef.current.limit !== limit) {
    throttledFnRef.current = throttle((...args) => callbackRef.current(...args), limit)
    throttledFnRef.current.limit = limit
  }
  
  return throttledFnRef.current
}

/**
 * Hook for debounced window resize handler
 * 
 * @param {Function} callback - Function to call on resize
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @param {boolean} callOnMount - Whether to invoke the callback once on mount (default: true)
 */
export function useDebouncedResize(callback, delay = 300, callOnMount = true) {
  const debouncedCallback = useDebounce(callback, delay)
  
  useEffect(() => {
    window.addEventListener('resize', debouncedCallback)
    
    // Optionally call once on mount
    if (callOnMount) {
      debouncedCallback()
    }
    
    return () => {
      window.removeEventListener('resize', debouncedCallback)
    }
  }, [debouncedCallback, callOnMount])
}

/**
 * Hook for debounced value
 * Returns a debounced version of the value that only updates after the delay
 * 
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

export default {
  debounce,
  throttle,
  useDebounce,
  useThrottle,
  useDebouncedResize,
  useDebouncedValue
}
