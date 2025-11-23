import useDashboardStore, { EVENTS } from '@/store/useDashboardStore'

/**
 * Base Agent Class
 * All specialized agents extend this base class
 * Uses Zustand store for state management and event communication
 */
export class BaseAgent {
  constructor(name) {
    this.name = name
    this.initialized = false
    this.listeners = []
  }

  /**
   * Get store instance
   */
  getStore() {
    return useDashboardStore.getState()
  }

  /**
   * Initialize the agent
   * Override in subclasses for custom initialization
   */
  async init() {
    if (this.initialized) {
      console.warn(`[${this.name}] Already initialized`)
      return
    }

    console.log(`[${this.name}] Initializing...`)
    this.initialized = true
    this.emit(EVENTS.AGENT_INITIALIZED, { agent: this.name })
  }

  /**
   * Cleanup the agent
   */
  destroy() {
    console.log(`[${this.name}] Destroying...`)
    this.listeners.forEach(unsubscribe => unsubscribe())
    this.listeners = []
    this.initialized = false
  }

  /**
   * Emit an event via Zustand store
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    const store = this.getStore()
    store.emit(eventName, { ...data, source: this.name })
  }

  /**
   * Subscribe to an event via Zustand store
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function
   */
  on(eventName, callback) {
    const store = this.getStore()
    const unsubscribe = store.subscribe(eventName, callback)
    this.listeners.push(unsubscribe)
    return unsubscribe
  }

  /**
   * Subscribe to an event once
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function
   */
  once(eventName, callback) {
    const onceCallback = (data) => {
      callback(data)
      // Unsubscribe after first call
      const index = this.listeners.findIndex(l => l === unsubscribe)
      if (index !== -1) {
        unsubscribe()
        this.listeners.splice(index, 1)
      }
    }
    const unsubscribe = this.on(eventName, onceCallback)
  }

  /**
   * Log a message
   * @param {string} message - Message to log
   * @param {*} data - Optional data
   */
  log(message, data) {
    console.log(`[${this.name}] ${message}`, data || '')
  }

  /**
   * Log an error
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  error(message, error) {
    console.error(`[${this.name}] ERROR: ${message}`, error)
    this.emit('error:occurred', {
      agent: this.name,
      message,
      error: error?.message || error
    })
  }
}

export default BaseAgent
