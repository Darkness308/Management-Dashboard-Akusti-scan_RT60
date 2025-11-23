/**
 * Event-Bus System for Agent Communication
 *
 * @deprecated This event bus is deprecated. Use Zustand store instead.
 * @see {@link ../store/useDashboardStore.js}
 *
 * Migration Guide:
 * - Replace `eventBus.emit(event, data)` with `useDashboardStore.getState().emit(event, data)`
 * - Replace `eventBus.on(event, callback)` with `useDashboardStore.getState().subscribe(event, callback)`
 * - All agents should import EVENTS from '@/store/useDashboardStore' instead
 *
 * This file is kept for backwards compatibility but will be removed in the next major version.
 */
class EventBus {
  constructor() {
    this.events = {}
    this.debug = false // Set to true for debugging
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} eventName - Name of the event
   * @param {*} data - Data to pass to listeners
   */
  emit(eventName, data) {
    if (this.debug) {
      console.log(`[EventBus] Emitting: ${eventName}`, data)
    }

    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[EventBus] Error in listener for ${eventName}:`, error)
        }
      })
    }
  }

  /**
   * Register a listener for an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)

    if (this.debug) {
      console.log(`[EventBus] Registered listener for: ${eventName}`)
    }

    // Return unsubscribe function
    return () => this.off(eventName, callback)
  }

  /**
   * Unregister a listener for an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function to remove
   */
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)

      if (this.debug) {
        console.log(`[EventBus] Removed listener for: ${eventName}`)
      }
    }
  }

  /**
   * Register a one-time listener for an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   */
  once(eventName, callback) {
    const onceCallback = (data) => {
      callback(data)
      this.off(eventName, onceCallback)
    }
    this.on(eventName, onceCallback)
  }

  /**
   * Clear all listeners for an event or all events
   * @param {string} [eventName] - Optional event name to clear
   */
  clear(eventName) {
    if (eventName) {
      delete this.events[eventName]
      if (this.debug) {
        console.log(`[EventBus] Cleared all listeners for: ${eventName}`)
      }
    } else {
      this.events = {}
      if (this.debug) {
        console.log('[EventBus] Cleared all listeners')
      }
    }
  }

  /**
   * Enable/disable debug mode
   * @param {boolean} enabled - Enable debug logging
   */
  setDebug(enabled) {
    this.debug = enabled
  }

  /**
   * Get list of all registered events
   * @returns {string[]} Array of event names
   */
  getEvents() {
    return Object.keys(this.events)
  }

  /**
   * Get number of listeners for an event
   * @param {string} eventName - Name of the event
   * @returns {number} Number of listeners
   */
  getListenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0
  }
}

// Create and export singleton instance
export const eventBus = new EventBus()

/**
 * Event names constants for type safety
 * @deprecated Import EVENTS from '@/store/useDashboardStore' instead
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

export default eventBus
