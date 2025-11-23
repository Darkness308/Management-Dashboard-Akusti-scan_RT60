import { useState, useEffect } from 'react'
import { moduleIcons } from '@/config/icons.config'

export default function Navigation({ activeTab, onTabChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Übersicht', Icon: moduleIcons.overview },
    { id: 'innovation', label: 'Innovation', Icon: moduleIcons.innovation },
    { id: 'market', label: 'Markt', Icon: moduleIcons.market },
    { id: 'business', label: 'Business', Icon: moduleIcons.business },
    { id: 'ki-system', label: 'KI-System', Icon: moduleIcons['ki-system'] },
    { id: 'technik', label: 'Technik', Icon: moduleIcons.technik },
    { id: 'vertrieb', label: 'Vertrieb', Icon: moduleIcons.vertrieb },
    { id: 'data', label: 'Daten', Icon: moduleIcons.data },
    { id: 'analytics', label: 'Analytics', Icon: moduleIcons.analytics }
  ]

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeTab])

  const handleTabClick = (tabId) => {
    onTabChange(tabId)
    setIsMobileMenuOpen(false)
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <nav className="bg-white shadow-md sticky top-20 z-40" role="navigation" aria-label="Hauptnavigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-wrap gap-2" role="tablist">
          {tabs.map(tab => {
            const Icon = tab.Icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${tab.label} Modul ${isActive ? '(aktiv)' : ''}`}
              >
                <Icon className="inline-block w-4 h-4 mr-1" aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Header with Hamburger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              {activeTabData?.Icon && <activeTabData.Icon className="w-5 h-5" />}
              <span>{activeTabData?.label}</span>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue"
              aria-label="Navigationsmenü"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            id="mobile-navigation-menu"
            className={`overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? 'max-h-96 mt-3' : 'max-h-0'
            }`}
            role="menu"
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="flex flex-col gap-2 pb-2">
              {tabs.map(tab => {
                const Icon = tab.Icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`nav-btn text-left ${isActive ? 'active' : ''}`}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`${tab.label} Modul ${isActive ? '(aktiv)' : ''}`}
                  >
                    <Icon className="inline-block w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-[-1] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}
