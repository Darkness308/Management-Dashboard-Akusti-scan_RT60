/**
 * Performance Monitoring Utilities
 * Provides tools to measure and log performance metrics
 */

/**
 * Measure performance of a function
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns {*} Result of the function
 */
export const measurePerformance = async (label, fn) => {
  const startTime = performance.now()
  
  try {
    const result = await fn()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ [Performance] ${label}: ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (import.meta.env.DEV) {
      console.error(`❌ [Performance] ${label} failed after ${duration.toFixed(2)}ms`, error)
    }
    
    throw error
  }
}

/**
 * Create a performance mark
 * @param {string} name - Mark name
 */
export const mark = (name) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name)
  }
}

/**
 * Measure between two marks
 * @param {string} name - Measurement name
 * @param {string} startMark - Start mark name
 * @param {string} endMark - End mark name
 * @returns {number} Duration in milliseconds
 */
export const measure = (name, startMark, endMark) => {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark)
      const entries = performance.getEntriesByName(name, 'measure')
      
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration
        
        if (import.meta.env.DEV) {
          console.log(`⏱️ [Performance] ${name}: ${duration.toFixed(2)}ms`)
        }
        
        return duration
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`⚠️ [Performance] Could not measure ${name}:`, error.message)
      }
    }
  }
  
  return 0
}

/**
 * Get performance metrics
 * @returns {Object} Performance metrics
 */
export const getPerformanceMetrics = () => {
  if (typeof performance === 'undefined') {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0]
  const paint = performance.getEntriesByType('paint')

  const domContentLoaded = navigation &&
    navigation.domContentLoadedEventEnd != null &&
    navigation.domContentLoadedEventStart != null
    ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
    : null

  const loadComplete = navigation &&
    navigation.loadEventEnd != null &&
    navigation.loadEventStart != null
    ? navigation.loadEventEnd - navigation.loadEventStart
    : null

  const domInteractive = navigation?.domInteractive ?? null

  const firstPaintEntry = paint.find(p => p.name === 'first-paint')
  const firstPaint = firstPaintEntry ? firstPaintEntry.startTime : null

  const firstContentfulPaintEntry = paint.find(p => p.name === 'first-contentful-paint')
  const firstContentfulPaint = firstContentfulPaintEntry ? firstContentfulPaintEntry.startTime : null
  
  return {
    // Navigation timing
    domContentLoaded,
    loadComplete,
    domInteractive,
    
    // Paint timing
    firstPaint,
    firstContentfulPaint,
    
    // Memory (Chrome-only, non-standard API)
    // Note: performance.memory is only available in Chrome/Chromium browsers
    // and requires the --enable-precise-memory-info flag
    memory: (performance && typeof performance.memory === 'object') ? {
      usedJSHeapSize: typeof performance.memory.usedJSHeapSize === 'number'
        ? performance.memory.usedJSHeapSize
        : null,
      totalJSHeapSize: typeof performance.memory.totalJSHeapSize === 'number'
        ? performance.memory.totalJSHeapSize
        : null,
      limit: typeof performance.memory.jsHeapSizeLimit === 'number'
        ? performance.memory.jsHeapSizeLimit
        : null
    } : null
  }
}

/**
 * Log performance metrics to console (development only)
 */
export const logPerformanceMetrics = () => {
  if (!import.meta.env.DEV) return
  
  const metrics = getPerformanceMetrics()
  
  if (!metrics) {
    console.log('📊 [Performance] Metrics not available')
    return
  }
  
  console.group('📊 Performance Metrics')
  console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`)
  console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`)
  console.log(`DOM Interactive: ${metrics.domInteractive.toFixed(2)}ms`)
  console.log(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`)
  console.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`)
  
  if (metrics.memory) {
    const usedMB = (metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
    const totalMB = (metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
    const limitMB = (metrics.memory.limit / 1024 / 1024).toFixed(2)
    console.log(`Memory Used: ${usedMB}MB / ${totalMB}MB (Limit: ${limitMB}MB)`)
  }
  
  console.groupEnd()
}

/**
 * Monitor component render performance
 * @param {string} componentName - Name of the component
 * @returns {Function} Cleanup function
 */
export const monitorComponentPerformance = (componentName) => {
  const startMark = `${componentName}-start`
  const endMark = `${componentName}-end`
  const measureName = `${componentName}-render`
  
  mark(startMark)
  
  return () => {
    mark(endMark)
    measure(measureName, startMark, endMark)
  }
}

/**
 * Measure bundle size (approximate)
 * @returns {Object} Bundle size information
 */
export const getBundleSize = () => {
  if (typeof performance === 'undefined') {
    return null
  }

  const resources = performance.getEntriesByType('resource')
  
  const scripts = resources.filter(r => r.name.endsWith('.js'))
  const styles = resources.filter(r => r.name.endsWith('.css'))
  const total = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
  
  return {
    totalScripts: scripts.length,
    totalStyles: styles.length,
    totalSize: total,
    totalSizeMB: (total / 1024 / 1024).toFixed(2),
    scripts: scripts.map(s => ({
      name: s.name.split('/').pop(),
      size: s.transferSize,
      sizeMB: (s.transferSize / 1024 / 1024).toFixed(2)
    }))
  }
}

export default {
  measurePerformance,
  mark,
  measure,
  getPerformanceMetrics,
  logPerformanceMetrics,
  monitorComponentPerformance,
  getBundleSize
}
