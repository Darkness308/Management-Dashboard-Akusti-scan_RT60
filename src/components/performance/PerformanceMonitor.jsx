import { useState } from 'react'
import {
  usePerformance,
  getPerformanceColor,
  getPerformanceBgColor,
  formatMetricValue,
  getMetricDescription,
  getMetricThresholds
} from '@/hooks/usePerformance'
import { Activity, ChevronDown, ChevronUp, X } from 'lucide-react'

/**
 * Performance Monitor Component
 * Displays Web Vitals metrics in a collapsible panel
 */
export default function PerformanceMonitor() {
  const { metrics, isMonitoring } = usePerformance()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Only show in development or if explicitly enabled
  if (!import.meta.env.DEV && !import.meta.env.VITE_SHOW_PERFORMANCE_MONITOR) {
    return null
  }

  if (!isVisible) {
    return null
  }

  const metricsList = [
    { key: 'lcp', label: 'LCP' },
    { key: 'inp', label: 'INP' },
    { key: 'cls', label: 'CLS' },
    { key: 'fcp', label: 'FCP' },
    { key: 'ttfb', label: 'TTFB' }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-pointer rounded-t-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Performance Metrics
            </span>
            {isMonitoring && (
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVisible(false)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics List */}
        {isExpanded && (
          <div className="p-4 space-y-3">
            {metricsList.map(({ key, label }) => {
              const metric = metrics[key]
              if (!metric) {
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getMetricDescription(key)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">Measuring...</div>
                  </div>
                )
              }

              const thresholds = getMetricThresholds(key)
              const bgColor = getPerformanceBgColor(metric.rating)
              const textColor = getPerformanceColor(metric.rating)

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 rounded border ${bgColor}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-xs font-medium rounded ${textColor}`}
                      >
                        {metric.rating}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {getMetricDescription(key)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Good: &lt;{formatMetricValue(thresholds.good, key)} | Poor:
                      &gt;{formatMetricValue(thresholds.poor, key)}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-lg font-bold ${textColor}`}>
                      {formatMetricValue(metric.value, key)}
                    </div>
                    {metric.delta > 0 && (
                      <div className="text-xs text-gray-500">
                        Δ {formatMetricValue(metric.delta, key)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Summary (when collapsed) */}
        {!isExpanded && (
          <div className="px-4 py-2 flex items-center space-x-2">
            {metricsList.slice(0, 3).map(({ key, label }) => {
              const metric = metrics[key]
              if (!metric) return null

              const textColor = getPerformanceColor(metric.rating)
              return (
                <div key={key} className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">{label}:</span>
                  <span className={`text-xs font-medium ${textColor}`}>
                    {formatMetricValue(metric.value, key)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reopen button (when hidden) */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
          title="Show Performance Monitor"
        >
          <Activity className="w-5 h-5 text-blue-600" />
        </button>
      )}
    </div>
  )
}
