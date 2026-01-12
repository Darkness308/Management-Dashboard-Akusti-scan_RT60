/**
 * Logger Utility
 * Centralized logging system that only logs in development
 * and can be configured for different log levels
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
}

class Logger {
  constructor() {
    this.level = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR
    this.enabled = import.meta.env.DEV
  }

  /**
   * Set logging level
   * @param {string} level - 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
   */
  setLevel(level) {
    this.level = LOG_LEVELS[level] ?? LOG_LEVELS.INFO
  }

  /**
   * Enable/disable logging
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled
  }

  /**
   * Debug log (lowest priority)
   */
  debug(message, ...args) {
    if (this.enabled && this.level <= LOG_LEVELS.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  }

  /**
   * Info log
   */
  info(message, ...args) {
    if (this.enabled && this.level <= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, ...args)
    }
  }

  /**
   * Log with custom prefix
   */
  log(prefix, message, ...args) {
    if (this.enabled && this.level <= LOG_LEVELS.INFO) {
      console.log(`[${prefix}] ${message}`, ...args)
    }
  }

  /**
   * Warning log
   */
  warn(message, ...args) {
    if (this.enabled && this.level <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  }

  /**
   * Error log (always logged in production too)
   */
  error(message, ...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args)
    }
  }

  /**
   * Group logs together
   */
  group(title) {
    if (this.enabled && this.level <= LOG_LEVELS.INFO) {
      console.group(title)
    }
  }

  /**
   * End log group
   */
  groupEnd() {
    if (this.enabled && this.level <= LOG_LEVELS.INFO) {
      console.groupEnd()
    }
  }

  /**
   * Table log for structured data
   */
  table(data) {
    if (this.enabled && this.level <= LOG_LEVELS.INFO) {
      console.table(data)
    }
  }

  /**
   * Time measurement start
   */
  time(label) {
    if (this.enabled && this.level <= LOG_LEVELS.DEBUG) {
      console.time(label)
    }
  }

  /**
   * Time measurement end
   */
  timeEnd(label) {
    if (this.enabled && this.level <= LOG_LEVELS.DEBUG) {
      console.timeEnd(label)
    }
  }
}

// Export singleton instance
export const logger = new Logger()
export default logger
