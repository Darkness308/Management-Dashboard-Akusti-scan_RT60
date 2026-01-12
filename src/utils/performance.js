/**
 * Performance Monitoring Utilities
 * Provides tools to measure and log performance metrics
 */
import { logger } from './logger'

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
    
    logger.debug(`⏱️ [Performance] ${label}: ${duration.toFixed(2)}ms`)
    
    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    logger.error(`❌ [Performance] ${label} failed after ${duration.toFixed(2)}ms`, error)
    
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
        
        logger.debug(`⏱️ [Performance] ${name}: ${duration.toFixed(2)}ms`)
        
        return duration
      }
    } catch (error) {
      logger.warn(`⚠️ [Performance] Could not measure ${name}:`, error.message)
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
    navigation.domContentLoadedEventEnd !== null &&
    navigation.domContentLoadedEventStart !== null
    ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
    : null

  const loadComplete = navigation &&
    navigation.loadEventEnd !== null &&
    navigation.loadEventStart !== null
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
 * Validate and format memory metrics
 * @param {Object} memory - Memory object from performance API
 * @returns {Object|null} Formatted memory metrics
 */
const formatMemoryMetrics = (memory) => {
  if (!memory || !memory.usedJSHeapSize) {
    return null
  }
  
  return {
    usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
    totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
    limitMB: (memory.limit / 1024 / 1024).toFixed(2)
  }
}

/**
 * Log performance metrics to console (development only)
 */
export const logPerformanceMetrics = () => {
  if (!import.meta.env.DEV) return
  
  const metrics = getPerformanceMetrics()
  
  if (!metrics) {
    logger.info('📊 [Performance] Metrics not available')
    return
  }
  
  logger.group('📊 Performance Metrics')
  logger.info(`DOM Content Loaded: ${metrics.domContentLoaded?.toFixed(2)}ms`)
  logger.info(`Load Complete: ${metrics.loadComplete?.toFixed(2)}ms`)
  logger.info(`DOM Interactive: ${metrics.domInteractive?.toFixed(2)}ms`)
  logger.info(`First Paint: ${metrics.firstPaint?.toFixed(2)}ms`)
  logger.info(`First Contentful Paint: ${metrics.firstContentfulPaint?.toFixed(2)}ms`)
  
  const memoryMetrics = formatMemoryMetrics(metrics.memory)
  if (memoryMetrics) {
    logger.info(`Memory Used: ${memoryMetrics.usedMB}MB / ${memoryMetrics.totalMB}MB (Limit: ${memoryMetrics.limitMB}MB)`)
  }
  
  logger.groupEnd()
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
