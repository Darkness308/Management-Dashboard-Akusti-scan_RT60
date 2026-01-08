import { kiSystemData, getTopTechniques } from '@data/kiSystemData'
import { Brain } from 'lucide-react'

export default function KISystemModule() {
  const topTechniques = getTopTechniques(4)

  const getCategoryColor = (category) => {
    const colors = {
      'Strukturierung': 'blue',
      'Sprachsteuerung': 'purple',
      'Qualität': 'green',
      'Effizienz': 'yellow'
    }
    return colors[category] || 'gray'
  }

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header flex items-center gap-3">
        <Brain size={36} />
        KI-System & Techniken
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Techniken</h3>
          <p className="text-4xl font-bold">{kiSystemData.stats.totalTechniques}</p>
          <p className="text-sm mt-2">KI-Manipulations-Techniken</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Workflows</h3>
          <p className="text-4xl font-bold">{kiSystemData.stats.totalWorkflows}</p>
          <p className="text-sm mt-2">Optimierte Workflow-Kombinationen</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Templates</h3>
          <p className="text-4xl font-bold">{kiSystemData.stats.totalTemplates}</p>
          <p className="text-sm mt-2">Business-Templates</p>
        </div>
      </div>

      {/* Top Techniques */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Top KI-Techniken</h3>
        <div className="space-y-4">
          {topTechniques.map((tech, idx) => {
            const color = getCategoryColor(tech.category)
            return (
              <div key={idx} className={`border-l-4 border-${color}-500 pl-4 py-2`}>
                <h4 className="font-bold">#{tech.id} {tech.name}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`badge badge-${color}`}>{tech.category}</span>
                  <span className="text-sm text-gray-600">Erfolg: {tech.successRate}%</span>
                  <span className="text-sm text-gray-600">Dauer: {tech.duration} Min</span>
                  <span className="text-sm text-gray-600">Status: {tech.status}</span>
                </div>
                <p className="text-sm mt-1 text-gray-700">{tech.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* All Techniques Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Alle Techniken</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Kategorie</th>
                <th className="px-4 py-3 text-left">Erfolgsrate</th>
                <th className="px-4 py-3 text-left">Dauer</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kiSystemData.techniques.map((tech, idx) => (
                <tr key={idx} className="table-row">
                  <td className="px-4 py-3 font-mono">#{tech.id}</td>
                  <td className="px-4 py-3 font-semibold">{tech.name}</td>
                  <td className="px-4 py-3">
                    <span className={`badge badge-${getCategoryColor(tech.category)}`}>
                      {tech.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tech.successRate}%</td>
                  <td className="px-4 py-3">{tech.duration} Min</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      tech.status === 'Flagship' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {tech.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Workflows */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Empfohlene Workflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kiSystemData.workflows.map((workflow, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition"
            >
              <h4 className="font-bold text-lg mb-2">{workflow.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
                Dauer: {workflow.duration} Min | Erfolg: {workflow.successRate}%
              </p>
              <p className="text-xs text-gray-500 mb-2">{workflow.description}</p>
              <div className="flex flex-wrap gap-1">
                {workflow.steps.map((step, sIdx) => (
                  <span key={sIdx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {step}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
