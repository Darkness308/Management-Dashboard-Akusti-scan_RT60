import { useEffect, useState } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'
import useDashboardStore from '@/store/useDashboardStore'
import { performanceConfig } from '@/config/env.config'

/**
 * Web Vitals Performance Monitoring Hook
 * Tracks Core Web Vitals and reports them to the store
 *
 * Metrics tracked:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - INP (Interaction to Next Paint) - Interactivity (replaces FID)
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - FCP (First Contentful Paint) - First paint
 * - TTFB (Time to First Byte) - Server response
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState({
    lcp: null,
    inp: null,
    cls: null,
    fcp: null,
    ttfb: null
  })
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    // Skip if performance monitoring is disabled
    if (!performanceConfig.enabled) {
      return
    }

    setIsMonitoring(true)

    /**
     * Report metric to store and state
     */
    const reportMetric = (metric) => {
      const { name, value, rating, delta, id } = metric

      // Update local state
      setMetrics(prev => ({
        ...prev,
        [name.toLowerCase()]: {
          value: Math.round(value),
          rating,
          delta: Math.round(delta),
          id
        }
      }))

      // Report to store
      const store = useDashboardStore.getState()
      store.trackEvent({
        type: 'web_vital',
        name,
        value: Math.round(value),
        rating,
        delta: Math.round(delta),
        id,
        userAgent: navigator.userAgent
      })

      // Log in development
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${name}:`, {
          value: `${Math.round(value)}ms`,
          rating,
          delta: `${Math.round(delta)}ms`
        })
      }

      // Send to analytics service if enabled
      if (performanceConfig.enabled && shouldSample()) {
        sendToAnalytics(metric)
      }
    }

    /**
     * Check if this metric should be sampled
     */
    const shouldSample = () => {
      return Math.random() < performanceConfig.samplingRate
    }

    /**
     * Send metric to analytics service
     * Replace with your analytics implementation
     */
    const sendToAnalytics = (metric) => {
      // Example: Google Analytics 4
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: Math.round(metric.value),
          metric_delta: Math.round(metric.delta),
          metric_rating: metric.rating
        })
      }

      // Example: Custom analytics endpoint
      if (window.fetch && performanceConfig.endpoint) {
        fetch(performanceConfig.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metric: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
            timestamp: Date.now(),
            page: window.location.pathname
          })
        }).catch(err => console.error('[Performance] Failed to send metric:', err))
      }
    }

    // Register Web Vitals listeners
    onLCP(reportMetric)
    onINP(reportMetric)
    onCLS(reportMetric)
    onFCP(reportMetric)
    onTTFB(reportMetric)

    return () => {
      setIsMonitoring(false)
    }
  }, [])

  return {
    metrics,
    isMonitoring
  }
}

/**
 * Get performance rating color
 * @param {string} rating - Performance rating (good, needs-improvement, poor)
 * @returns {string} Tailwind color class
 */
export const getPerformanceColor = (rating) => {
  switch (rating) {
    case 'good':
      return 'text-green-600'
    case 'needs-improvement':
      return 'text-yellow-600'
    case 'poor':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

/**
 * Get performance rating background color
 * @param {string} rating - Performance rating
 * @returns {string} Tailwind background color class
 */
export const getPerformanceBgColor = (rating) => {
  switch (rating) {
    case 'good':
      return 'bg-green-100 border-green-300'
    case 'needs-improvement':
      return 'bg-yellow-100 border-yellow-300'
    case 'poor':
      return 'bg-red-100 border-red-300'
    default:
      return 'bg-gray-100 border-gray-300'
  }
}

/**
 * Format metric value for display
 * @param {number} value - Metric value in milliseconds
 * @param {string} name - Metric name
 * @returns {string} Formatted value
 */
export const formatMetricValue = (value, name) => {
  if (value === null || value === undefined) return 'N/A'

  // CLS is unitless
  if (name.toLowerCase() === 'cls') {
    return value.toFixed(3)
  }

  // Format time in ms or seconds
  if (value < 1000) {
    return `${Math.round(value)}ms`
  }
  return `${(value / 1000).toFixed(2)}s`
}

/**
 * Get metric description
 * @param {string} name - Metric name
 * @returns {string} Metric description
 */
export const getMetricDescription = (name) => {
  const descriptions = {
    lcp: 'Largest Contentful Paint - Loading performance',
    inp: 'Interaction to Next Paint - Interactivity',
    cls: 'Cumulative Layout Shift - Visual stability',
    fcp: 'First Contentful Paint - Initial render',
    ttfb: 'Time to First Byte - Server response'
  }
  return descriptions[name.toLowerCase()] || ''
}

/**
 * Get metric thresholds
 * @param {string} name - Metric name
 * @returns {Object} Thresholds for good/poor ratings
 */
export const getMetricThresholds = (name) => {
  const thresholds = {
    lcp: { good: 2500, poor: 4000 },
    inp: { good: 200, poor: 500 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 }
  }
  return thresholds[name.toLowerCase()] || { good: 0, poor: 0 }
}

export default usePerformance
