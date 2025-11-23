import { BaseAgent } from './BaseAgent'
import { EVENTS } from '@/store/useDashboardStore'

/**
 * Dashboard Orchestrator - Main Agent
 * Coordinates all sub-agents and manages global state via Zustand store
 */
export class DashboardOrchestrator extends BaseAgent {
  constructor() {
    super('DashboardOrchestrator')
  }

  async init() {
    await super.init()

    // Setup event listeners
    this.setupEventListeners()

    // Initialize agent system in store
    const store = this.getStore()
    store.initializeAgentSystem()

    this.log('Dashboard Orchestrator initialized')
  }

  setupEventListeners() {
    // Listen to module changes
    this.on(EVENTS.MODULE_CHANGED, (data) => {
      this.handleModuleChange(data)
    })

    // Listen to data uploads
    this.on(EVENTS.DATA_UPLOADED, (data) => {
      this.handleDataUploaded(data)
    })

    // Listen to errors
    this.on(EVENTS.ERROR_OCCURRED, (data) => {
      this.handleError(data)
    })
  }

  /**
   * Register a sub-agent
   * @param {BaseAgent} agent - Agent instance
   */
  registerAgent(agent) {
    const store = this.getStore()
    store.registerAgent(agent)
    this.log(`Registered agent: ${agent.name}`)
  }

  /**
   * Initialize all registered agents
   */
  async initializeAgents() {
    this.log('Initializing all sub-agents...')
    const store = this.getStore()
    const agents = store.agents
    for (const agent of agents) {
      await agent.init()
    }
    this.log('All sub-agents initialized')
  }

  /**
   * Switch active module
   * @param {string} moduleName - Module name
   */
  switchModule(moduleName) {
    const store = this.getStore()
    store.switchModule(moduleName)
    this.emit(EVENTS.MODULE_CHANGED, { module: moduleName })
    this.log(`Switched to module: ${moduleName}`)
  }

  /**
   * Update global data
   * @param {Object} data - Data to merge into global state
   */
  updateGlobalData(data) {
    const store = this.getStore()
    store.updateGlobalData(data)
    this.emit(EVENTS.DATA_CHANGED, { data: store.globalData })
  }

  /**
   * Get current state from store
   * @returns {Object} Current state
   */
  getCurrentState() {
    const store = this.getStore()
    return {
      activeModule: store.activeModule,
      globalData: store.globalData,
      agents: store.agents,
      agentSystemReady: store.agentSystemReady
    }
  }

  /**
   * Handle module change event
   */
  handleModuleChange(data) {
    this.log('Module changed:', data.module)
    // Track analytics
    this.emit(EVENTS.ANALYTICS_TRACKED, {
      type: 'module_view',
      module: data.module
    })
  }

  /**
   * Handle data uploaded event
   */
  handleDataUploaded(data) {
    this.log('Data uploaded:', data.fileName)
    this.updateGlobalData({ uploadedData: data })
  }

  /**
   * Handle error event
   */
  handleError(data) {
    this.error(`Error from ${data.agent || 'unknown'}:`, data.message)
    // Could show notification here
    this.emit(EVENTS.NOTIFICATION_SHOW, {
      type: 'error',
      message: data.message
    })
  }

  /**
   * Export dashboard data
   * @param {string} format - Export format (json, markdown, excel)
   */
  exportDashboard(format) {
    const store = this.getStore()
    this.log(`Exporting dashboard as ${format}`)
    this.emit(EVENTS.DATA_EXPORTED, {
      format,
      data: store.globalData
    })
  }
}

// Create and export singleton instance
export const orchestrator = new DashboardOrchestrator()
export default orchestrator
