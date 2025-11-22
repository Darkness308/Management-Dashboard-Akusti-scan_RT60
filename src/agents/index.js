/**
 * Agent System - Central Export
 * All agents are exported from here for easy imports
 */

// Base & Orchestrator
export { BaseAgent } from './BaseAgent'
export { DashboardOrchestrator, orchestrator } from './DashboardOrchestrator'

// Sub-Agents
export { DataIntegrationAgent, dataIntegrationAgent } from './DataIntegrationAgent'
export { AnalyticsAgent, analyticsAgent } from './AnalyticsAgent'

// Initialize all agents
import { orchestrator } from './DashboardOrchestrator'
import { dataIntegrationAgent } from './DataIntegrationAgent'
import { analyticsAgent } from './AnalyticsAgent'

/**
 * Initialize the entire agent system
 */
export async function initializeAgentSystem() {
  console.log('[Agent System] Initializing...')

  // Initialize orchestrator
  await orchestrator.init()

  // Register sub-agents
  orchestrator.registerAgent(dataIntegrationAgent)
  orchestrator.registerAgent(analyticsAgent)

  // Initialize all agents
  await orchestrator.initializeAgents()

  console.log('[Agent System] All agents initialized successfully')

  return orchestrator
}

export default {
  orchestrator,
  dataIntegrationAgent,
  analyticsAgent,
  initializeAgentSystem
}
