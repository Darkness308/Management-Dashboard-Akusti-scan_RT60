export default function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: '🏠' },
    { id: 'innovation', label: 'Innovation', icon: '🚀' },
    { id: 'market', label: 'Markt', icon: '🌍' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'ki-system', label: 'KI-System', icon: '🤖' },
    { id: 'technik', label: 'Technik', icon: '⚙️' },
    { id: 'vertrieb', label: 'Vertrieb', icon: '📈' },
    { id: 'data', label: 'Daten', icon: '📂' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ]

  return (
    <nav className="bg-white shadow-md sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
