import { useState, useEffect, lazy, Suspense } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Overview from './components/dashboard/Overview'
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt'
import PWAStatus from './components/pwa/PWAStatus'
import PerformanceMonitor from './components/performance/PerformanceMonitor'
import { initializeAgentSystem, orchestrator } from './agents'

// Lazy load modules for better performance and code splitting
const InnovationModule = lazy(() => import('./components/modules/InnovationModule'))
const MarketModule = lazy(() => import('./components/modules/MarketModule'))
const BusinessModule = lazy(() => import('./components/modules/BusinessModule'))
const KISystemModule = lazy(() => import('./components/modules/KISystemModule'))
const TechnikModule = lazy(() => import('./components/modules/TechnikModule'))
const VertriebModule = lazy(() => import('./components/modules/VertriebModule'))
const DataModule = lazy(() => import('./components/modules/DataModule'))
const AnalyticsModule = lazy(() => import('./components/modules/AnalyticsModule'))

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [agentSystemReady, setAgentSystemReady] = useState(false)

  // Initialize Agent System
  useEffect(() => {
    const initAgents = async () => {
      try {
        await initializeAgentSystem()
        setAgentSystemReady(true)
        console.log('[App] Agent system initialized successfully')
      } catch (error) {
        console.error('[App] Failed to initialize agent system:', error)
      }
    }

    initAgents()

    // Cleanup on unmount
    return () => {
      if (orchestrator.initialized) {
        orchestrator.destroy()
      }
    }
  }, [])

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)

    // Notify orchestrator about module change
    if (agentSystemReady) {
      orchestrator.switchModule(tabId)
    }
  }

  // Loading component for lazy-loaded modules
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-blue border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Modul wird geladen...</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onModuleClick={handleTabChange} />

      case 'innovation':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <InnovationModule />
          </Suspense>
        )

      case 'market':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MarketModule />
          </Suspense>
        )

      case 'business':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <BusinessModule />
          </Suspense>
        )

      case 'ki-system':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <KISystemModule />
          </Suspense>
        )

      case 'technik':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TechnikModule />
          </Suspense>
        )

      case 'vertrieb':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <VertriebModule />
          </Suspense>
        )

      case 'data':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DataModule />
          </Suspense>
        )

      case 'analytics':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AnalyticsModule />
          </Suspense>
        )

      default:
        return <Overview onModuleClick={handleTabChange} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex-grow">
        {renderContent()}
      </main>

      <Footer />

      {/* PWA Components */}
      <PWAStatus />
      <PWAInstallPrompt />

      {/* Performance Monitoring (Dev only) */}
      <PerformanceMonitor />
    </div>
  )
}

export default App
