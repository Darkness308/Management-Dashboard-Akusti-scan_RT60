import { useEffect, useCallback, useRef, useState } from 'react'

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
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  return useCallback((...args) => {
    const debouncedFn = debounce((...innerArgs) => callbackRef.current(...innerArgs), delay)
    return debouncedFn(...args)
  }, [delay])
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
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  return useCallback((...args) => {
    const throttledFn = throttle((...innerArgs) => callbackRef.current(...innerArgs), limit)
    return throttledFn(...args)
  }, [limit])
}

/**
 * Hook for debounced window resize handler
 * 
 * @param {Function} callback - Function to call on resize
 * @param {number} delay - Delay in milliseconds (default: 300)
 */
export function useDebouncedResize(callback, delay = 300) {
  const debouncedCallback = useDebounce(callback, delay)
  
  useEffect(() => {
    window.addEventListener('resize', debouncedCallback)
    
    // Call once on mount
    debouncedCallback()
    
    return () => {
      window.removeEventListener('resize', debouncedCallback)
    }
  }, [debouncedCallback])
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
