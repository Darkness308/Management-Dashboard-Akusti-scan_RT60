import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

/**
 * Event names constants for type safety
 */
export const EVENTS = {
  // Data Events
  DATA_UPLOADED: 'data:uploaded',
  DATA_CHANGED: 'data:changed',
  DATA_DELETED: 'data:deleted',
  DATA_EXPORTED: 'data:exported',

  // Module Events
  MODULE_CHANGED: 'module:changed',
  MODULE_LOADED: 'module:loaded',
  MODULE_ERROR: 'module:error',

  // Analytics Events
  ANALYTICS_TRACKED: 'analytics:tracked',
  PERFORMANCE_UPDATED: 'performance:updated',

  // UI Events
  NOTIFICATION_SHOW: 'notification:show',
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close',

  // Error Events
  ERROR_OCCURRED: 'error:occurred',

  // Agent Events
  AGENT_INITIALIZED: 'agent:initialized',
  AGENT_ACTION: 'agent:action'
}

/**
 * Dashboard Store (Zustand)
 * Replaces the old Event-Bus pattern with modern state management
 * Includes event system for agent communication
 */
const useDashboardStore = create(
  subscribeWithSelector(
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

        // Event System State
        events: {},
        eventSubscribers: new Map(),
        lastEvent: null,

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

      // Event System Actions
      emit: (eventName, data) => {
        const event = {
          name: eventName,
          data,
          timestamp: Date.now()
        }

        // Update lastEvent to trigger subscribers
        set({ lastEvent: event })

        // Execute subscribers
        const subscribers = get().eventSubscribers.get(eventName) || []
        subscribers.forEach(callback => {
          try {
            callback(data)
          } catch (error) {
            console.error(`[Store] Error in subscriber for ${eventName}:`, error)
          }
        })
      },

      subscribe: (eventName, callback) => {
        const subscribers = get().eventSubscribers
        const eventSubs = subscribers.get(eventName) || []
        eventSubs.push(callback)
        subscribers.set(eventName, eventSubs)

        // Return unsubscribe function
        return () => {
          const subs = get().eventSubscribers.get(eventName) || []
          const filtered = subs.filter(cb => cb !== callback)
          get().eventSubscribers.set(eventName, filtered)
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
          performanceMetrics: [],
          events: {},
          lastEvent: null
        })
        // Clear all subscribers
        get().eventSubscribers.clear()
      }
      }),
      {
        name: 'dashboard-store',
        enabled: import.meta.env.DEV
      }
    )
  )
)

export default useDashboardStore
