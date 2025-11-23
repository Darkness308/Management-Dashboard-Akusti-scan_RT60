import { BaseAgent } from './BaseAgent'
import { EVENTS } from '@/store/useDashboardStore'
import { trackModuleUsage, generateAnalyticsReport } from '@data/analyticsData'

/**
 * Analytics Agent
 * Tracks performance, usage statistics & dashboard analytics
 */
export class AnalyticsAgent extends BaseAgent {
  constructor() {
    super('AnalyticsAgent')
    this.metrics = {
      moduleViews: {},
      featureUsage: {},
      performance: {}
    }
  }

  async init() {
    await super.init()

    // Listen to analytics events
    this.on(EVENTS.ANALYTICS_TRACKED, (data) => {
      this.trackEvent(data)
    })

    this.on(EVENTS.MODULE_CHANGED, (data) => {
      this.trackModuleView(data.module)
    })
  }

  /**
   * Track a generic event
   * @param {Object} data - Event data
   */
  trackEvent(data) {
    this.log('Tracking event:', data)
    // Could send to analytics service here
  }

  /**
   * Track module view
   * @param {string} moduleName - Module name
   */
  trackModuleView(moduleName) {
    if (!this.metrics.moduleViews[moduleName]) {
      this.metrics.moduleViews[moduleName] = 0
    }
    this.metrics.moduleViews[moduleName]++

    trackModuleUsage(moduleName)
    this.log(`Module view tracked: ${moduleName}`)
  }

  /**
   * Get analytics report
   * @returns {Object} Analytics report
   */
  getReport() {
    return {
      ...generateAnalyticsReport(),
      customMetrics: this.metrics
    }
  }

  /**
   * Track performance metric
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   */
  trackPerformance(metric, value) {
    this.metrics.performance[metric] = value
    this.emit(EVENTS.PERFORMANCE_UPDATED, { metric, value })
  }
}

export const analyticsAgent = new AnalyticsAgent()
export default analyticsAgent
