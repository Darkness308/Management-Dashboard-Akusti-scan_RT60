import { exportJSON, exportMarkdown } from '@utils/exportUtils'
import { BarChart3 } from 'lucide-react'

export default function Header({ onExport }) {
  const handleExport = () => {
    const confirmed = window.confirm('Dashboard-Daten exportieren?\n\nOK = JSON Export\nAbbrechen = Markdown Export')

    if (confirmed) {
      exportJSON({})
      alert('JSON Export erstellt')
    } else {
      exportMarkdown({})
      alert('Markdown Export erstellt')
    }

    if (onExport) onExport()
  }

  return (
    <header className="gradient-bg shadow-lg sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto py-4 px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center" aria-hidden="true">
              <BarChart3 className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Management Dashboard</h1>
              <p className="text-sm text-purple-100">Akusti-Scan RT60 - Konsolidierte Ansicht</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleExport}
              className="bg-white text-purple-700 px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition"
              aria-label="Dashboard-Daten exportieren"
            >
              📥 Export
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
