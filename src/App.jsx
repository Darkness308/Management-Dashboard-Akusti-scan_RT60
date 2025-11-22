import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Overview from './components/dashboard/Overview'
import InnovationModule from './components/modules/InnovationModule'
import MarketModule from './components/modules/MarketModule'
import BusinessModule from './components/modules/BusinessModule'
import KISystemModule from './components/modules/KISystemModule'
import TechnikModule from './components/modules/TechnikModule'
import VertriebModule from './components/modules/VertriebModule'
import DataModule from './components/modules/DataModule'
import AnalyticsModule from './components/modules/AnalyticsModule'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onModuleClick={handleTabChange} />

      case 'innovation':
        return <InnovationModule />

      case 'market':
        return <MarketModule />

      case 'business':
        return <BusinessModule />

      case 'ki-system':
        return <KISystemModule />

      case 'technik':
        return <TechnikModule />

      case 'vertrieb':
        return <VertriebModule />

      case 'data':
        return <DataModule />

      case 'analytics':
        return <AnalyticsModule />

      default:
        return <Overview onModuleClick={handleTabChange} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-7xl mx-auto w-full p-6 flex-grow">
        {renderContent()}
      </main>

      <Footer />
    </div>
  )
}

export default App
