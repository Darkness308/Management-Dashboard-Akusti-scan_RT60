import { BaseAgent } from './BaseAgent'
import { EVENTS } from '@utils/eventBus'

/**
 * Dashboard Orchestrator - Main Agent
 * Coordinates all sub-agents and manages global state
 */
export class DashboardOrchestrator extends BaseAgent {
  constructor() {
    super('DashboardOrchestrator')
    this.state = {
      activeModule: 'overview',
      globalData: {},
      agents: []
    }
  }

  async init() {
    await super.init()

    // Setup event listeners
    this.setupEventListeners()

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
    this.state.agents.push(agent)
    this.log(`Registered agent: ${agent.name}`)
  }

  /**
   * Initialize all registered agents
   */
  async initializeAgents() {
    this.log('Initializing all sub-agents...')
    for (const agent of this.state.agents) {
      await agent.init()
    }
    this.log('All sub-agents initialized')
  }

  /**
   * Switch active module
   * @param {string} moduleName - Module name
   */
  switchModule(moduleName) {
    this.state.activeModule = moduleName
    this.emit(EVENTS.MODULE_CHANGED, { module: moduleName })
    this.log(`Switched to module: ${moduleName}`)
  }

  /**
   * Update global data
   * @param {Object} data - Data to merge into global state
   */
  updateGlobalData(data) {
    this.state.globalData = { ...this.state.globalData, ...data }
    this.emit(EVENTS.DATA_CHANGED, { data: this.state.globalData })
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state }
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
    this.log(`Exporting dashboard as ${format}`)
    this.emit(EVENTS.DATA_EXPORTED, {
      format,
      data: this.state.globalData
    })
  }
}

// Create and export singleton instance
export const orchestrator = new DashboardOrchestrator()
export default orchestrator
