import { eventBus } from '@utils/eventBus'

/**
 * Base Agent Class
 * All specialized agents extend this base class
 */
export class BaseAgent {
  constructor(name) {
    this.name = name
    this.initialized = false
    this.listeners = []
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
    this.emit('agent:initialized', { agent: this.name })
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
   * Emit an event
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    eventBus.emit(eventName, { ...data, source: this.name })
  }

  /**
   * Listen to an event
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function
   */
  on(eventName, callback) {
    const unsubscribe = eventBus.on(eventName, callback)
    this.listeners.push(unsubscribe)
    return unsubscribe
  }

  /**
   * Listen to an event once
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function
   */
  once(eventName, callback) {
    eventBus.once(eventName, callback)
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
