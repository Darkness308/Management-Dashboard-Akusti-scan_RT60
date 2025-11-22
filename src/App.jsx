import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Overview from './components/dashboard/Overview'
import InnovationModule from './components/modules/InnovationModule'
import MarketModule from './components/modules/MarketModule'
import PlaceholderModule from './components/modules/PlaceholderModule'

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
        return (
          <PlaceholderModule
            title="Business Strategie"
            icon="💼"
            description="Preisstrategie, Wettbewerbsanalyse & Umsatzmodellierung"
          />
        )

      case 'ki-system':
        return (
          <PlaceholderModule
            title="KI-System"
            icon="🤖"
            description="20 KI-Manipulations-Techniken, Workflows & Templates"
          />
        )

      case 'technik':
        return (
          <PlaceholderModule
            title="Technik & Normen"
            icon="⚙️"
            description="Technische Anforderungen & Standards (DIN, ISO, VDI)"
          />
        )

      case 'vertrieb':
        return (
          <PlaceholderModule
            title="Vertrieb & Zielgruppen"
            icon="📈"
            description="Zielgruppen-Segmentierung & Vertriebskanal-Management"
          />
        )

      case 'data':
        return (
          <PlaceholderModule
            title="Datenintegration"
            icon="📂"
            description="Excel/CSV Upload, Parsing & Daten-Transformation"
          />
        )

      case 'analytics':
        return (
          <PlaceholderModule
            title="Analytics & Performance"
            icon="📊"
            description="Performance-Tracking, Nutzungsstatistiken & Dashboard-Analytics"
          />
        )

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
