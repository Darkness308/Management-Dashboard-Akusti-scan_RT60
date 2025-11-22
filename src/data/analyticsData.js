// Analytics & Performance Data

export const analyticsData = {
  moduleUsage: {
    innovation: 15,
    market: 18,
    business: 20,
    kiSystem: 22,
    technik: 10,
    vertrieb: 8,
    data: 7
  },

  featureActivity: {
    charts: 95,
    upload: 75,
    export: 85,
    kiTools: 88,
    analytics: 92
  },

  performance: {
    dataIntegration: 95,
    visualization: 100,
    kiFeatures: 88,
    exportFunctions: 92
  },

  stats: {
    totalModules: 11,
    totalFeatures: 45,
    totalCharts: 12,
    integrationLevel: 100
  }
}

// Track module usage
let usageTracker = { ...analyticsData.moduleUsage }

export const trackModuleUsage = (moduleName) => {
  if (usageTracker[moduleName] !== undefined) {
    usageTracker[moduleName]++
  }
  return usageTracker
}

// Get performance metrics
export const getPerformanceMetrics = () => {
  return analyticsData.performance
}

// Generate analytics report
export const generateAnalyticsReport = () => {
  const totalUsage = Object.values(usageTracker).reduce((sum, val) => sum + val, 0)
  const avgPerformance = Object.values(analyticsData.performance).reduce((sum, val) => sum + val, 0) /
    Object.keys(analyticsData.performance).length

  return {
    totalModuleAccess: totalUsage,
    avgPerformance: avgPerformance.toFixed(1),
    mostUsedModule: Object.entries(usageTracker).sort((a, b) => b[1] - a[1])[0],
    topFeatures: Object.entries(analyticsData.featureActivity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }
}

// Get top features
export const getTopFeatures = (count = 5) => {
  return Object.entries(analyticsData.featureActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, activity]) => ({ name, activity }))
}

export default analyticsData
