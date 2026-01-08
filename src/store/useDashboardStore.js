import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Dashboard Store (Zustand)
 * Replaces the old Event-Bus pattern with modern state management
 */
const useDashboardStore = create(
  devtools(
    (set, get) => ({
      // Global State
      activeModule: 'overview',
      globalData: {},
      uploadedData: null,
      agents: [],

      // Agent System State
      agentSystemReady: false,

      // Analytics State
      moduleViews: {},
      performanceMetrics: [],

      // Actions
      switchModule: (moduleName) => {
        set({ activeModule: moduleName })

        // Track module view
        const { moduleViews } = get()
        set({
          moduleViews: {
            ...moduleViews,
            [moduleName]: (moduleViews[moduleName] || 0) + 1
          }
        })
      },

      updateGlobalData: (data) => {
        set({ globalData: { ...get().globalData, ...data } })
      },

      setUploadedData: (data) => {
        set({ uploadedData: data })
      },

      clearUploadedData: () => {
        set({ uploadedData: null })
      },

      // Agent System Actions
      initializeAgentSystem: () => {
        set({ agentSystemReady: true })
      },

      registerAgent: (agent) => {
        set((state) => ({
          agents: [...state.agents, agent]
        }))
      },

      // Analytics Actions
      trackEvent: (event) => {
        const { performanceMetrics } = get()
        set({
          performanceMetrics: [
            ...performanceMetrics,
            { ...event, timestamp: Date.now() }
          ]
        })
      },

      trackModuleView: (moduleName) => {
        const { moduleViews } = get()
        set({
          moduleViews: {
            ...moduleViews,
            [moduleName]: (moduleViews[moduleName] || 0) + 1
          }
        })
      },

      getModuleViewCount: (moduleName) => {
        return get().moduleViews[moduleName] || 0
      },

      // Get analytics report
      getAnalyticsReport: () => {
        const { moduleViews, performanceMetrics } = get()
        return {
          totalViews: Object.values(moduleViews).reduce((a, b) => a + b, 0),
          moduleViews,
          eventCount: performanceMetrics.length,
          performanceMetrics
        }
      },

      // Reset store (for testing)
      reset: () => {
        set({
          activeModule: 'overview',
          globalData: {},
          uploadedData: null,
          agents: [],
          agentSystemReady: false,
          moduleViews: {},
          performanceMetrics: []
        })
      }
    }),
    {
      name: 'dashboard-store',
      enabled: import.meta.env.DEV
    }
  )
)

export default useDashboardStore
