/**
 * Environment Configuration
 * Centralized access to environment variables with type checking and defaults
 */

/**
 * Get environment variable as string
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not set
 * @returns {string}
 */
export const getEnv = (key, defaultValue = '') => {
  return import.meta.env[key] || defaultValue
}

/**
 * Get environment variable as boolean
 * @param {string} key - Environment variable key
 * @param {boolean} defaultValue - Default value if not set
 * @returns {boolean}
 */
export const getBoolEnv = (key, defaultValue = false) => {
  const value = import.meta.env[key]
  if (value === undefined) return defaultValue
  return value === 'true' || value === '1' || value === true
}

/**
 * Get environment variable as number
 * @param {string} key - Environment variable key
 * @param {number} defaultValue - Default value if not set
 * @returns {number}
 */
export const getNumberEnv = (key, defaultValue = 0) => {
  const value = import.meta.env[key]
  if (value === undefined) return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Get environment variable as array (comma-separated)
 * @param {string} key - Environment variable key
 * @param {string[]} defaultValue - Default value if not set
 * @returns {string[]}
 */
export const getArrayEnv = (key, defaultValue = []) => {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  return value.split(',').map(v => v.trim()).filter(Boolean)
}

/**
 * Application Configuration
 */
export const appConfig = {
  env: getEnv('VITE_APP_ENV', 'development'),
  name: getEnv('VITE_APP_NAME', 'Management Dashboard RT60'),
  version: getEnv('VITE_APP_VERSION', '1.0.0'),
  description: getEnv('VITE_APP_DESCRIPTION', 'Akusti Scan RT60 Management Dashboard'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE
}

/**
 * API Configuration
 */
export const apiConfig = {
  baseUrl: getEnv('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  timeout: getNumberEnv('VITE_API_TIMEOUT', 30000)
}

/**
 * Feature Flags
 */
export const featureFlags = {
  analytics: getBoolEnv('VITE_ENABLE_ANALYTICS', true),
  pwa: getBoolEnv('VITE_ENABLE_PWA', true),
  notifications: getBoolEnv('VITE_ENABLE_NOTIFICATIONS', true),
  debugMode: getBoolEnv('VITE_ENABLE_DEBUG_MODE', false)
}

/**
 * Performance Monitoring Configuration
 */
export const performanceConfig = {
  enabled: getBoolEnv('VITE_ENABLE_PERFORMANCE_MONITORING', true),
  samplingRate: getNumberEnv('VITE_PERFORMANCE_SAMPLING_RATE', 0.1)
}

/**
 * Analytics Configuration
 */
export const analyticsConfig = {
  enabled: getBoolEnv('VITE_ANALYTICS_ENABLED', false),
  id: getEnv('VITE_ANALYTICS_ID', '')
}

/**
 * Sentry Error Tracking Configuration
 */
export const sentryConfig = {
  enabled: getBoolEnv('VITE_SENTRY_ENABLED', false),
  dsn: getEnv('VITE_SENTRY_DSN', ''),
  environment: getEnv('VITE_SENTRY_ENVIRONMENT', 'development')
}

/**
 * Storage Configuration
 */
export const storageConfig = {
  prefix: getEnv('VITE_STORAGE_PREFIX', 'rt60_dashboard_'),
  version: getNumberEnv('VITE_STORAGE_VERSION', 1)
}

/**
 * Export Configuration
 */
export const exportConfig = {
  maxFileSize: getNumberEnv('VITE_EXPORT_MAX_FILE_SIZE', 10485760), // 10MB
  formats: getArrayEnv('VITE_EXPORT_FORMATS', ['pdf', 'excel', 'word', 'json', 'txt', 'md'])
}

/**
 * Data Upload Configuration
 */
export const uploadConfig = {
  maxFileSize: getNumberEnv('VITE_UPLOAD_MAX_FILE_SIZE', 5242880), // 5MB
  allowedExtensions: getArrayEnv('VITE_UPLOAD_ALLOWED_EXTENSIONS', ['.csv', '.xlsx', '.xls', '.json'])
}

/**
 * Cache Configuration
 */
export const cacheConfig = {
  enabled: getBoolEnv('VITE_CACHE_ENABLED', true),
  ttl: getNumberEnv('VITE_CACHE_TTL', 3600000), // 1 hour
  maxSize: getNumberEnv('VITE_CACHE_MAX_SIZE', 52428800) // 50MB
}

/**
 * Agent System Configuration
 */
export const agentConfig = {
  enabled: getBoolEnv('VITE_AGENT_SYSTEM_ENABLED', true),
  debug: getBoolEnv('VITE_AGENT_SYSTEM_DEBUG', false)
}

/**
 * PWA Configuration
 */
export const pwaConfig = {
  cacheName: getEnv('VITE_PWA_CACHE_NAME', 'rt60-dashboard-v1'),
  offlinePage: getEnv('VITE_PWA_OFFLINE_PAGE', '/offline.html')
}

/**
 * Get all configuration
 * @returns {Object} Complete configuration object
 */
export const getAllConfig = () => ({
  app: appConfig,
  api: apiConfig,
  features: featureFlags,
  performance: performanceConfig,
  analytics: analyticsConfig,
  sentry: sentryConfig,
  storage: storageConfig,
  export: exportConfig,
  upload: uploadConfig,
  cache: cacheConfig,
  agent: agentConfig,
  pwa: pwaConfig
})

/**
 * Log configuration (development only)
 */
if (appConfig.isDev && featureFlags.debugMode) {
  console.log('[Config] Application Configuration:', getAllConfig())
}

export default {
  app: appConfig,
  api: apiConfig,
  features: featureFlags,
  performance: performanceConfig,
  analytics: analyticsConfig,
  sentry: sentryConfig,
  storage: storageConfig,
  export: exportConfig,
  upload: uploadConfig,
  cache: cacheConfig,
  agent: agentConfig,
  pwa: pwaConfig,
  getAll: getAllConfig
}
