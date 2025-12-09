import { analyticsData, getTopFeatures, generateAnalyticsReport } from '@data/analyticsData'
import PieChart from '../charts/PieChart'
import BarChart from '../charts/BarChart'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsModule() {
  const topFeatures = getTopFeatures(5)
  const report = generateAnalyticsReport()

  const moduleUsageData = {
    labels: Object.keys(analyticsData.moduleUsage).map(key => {
      const nameMap = {
        innovation: 'Innovation',
        market: 'Markt',
        business: 'Business',
        kiSystem: 'KI-System',
        technik: 'Technik',
        vertrieb: 'Vertrieb',
        data: 'Daten'
      }
      return nameMap[key] || key
    }),
    data: Object.values(analyticsData.moduleUsage)
  }

  const featureActivityData = {
    labels: topFeatures.map(f => f.name),
    datasets: [{
      label: 'Aktivität (%)',
      data: topFeatures.map(f => f.activity),
      backgroundColor: '#667eea'
    }]
  }

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header flex items-center gap-3">
        <BarChart3 size={36} />
        Analytics & Performance
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm font-semibold mb-2">Module</p>
          <p className="text-4xl font-bold">{analyticsData.stats.totalModules}</p>
          <p className="text-sm mt-2">Verfügbare Dashboards</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm font-semibold mb-2">Features</p>
          <p className="text-4xl font-bold">{analyticsData.stats.totalFeatures}+</p>
          <p className="text-sm mt-2">Funktionen integriert</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm font-semibold mb-2">Charts</p>
          <p className="text-4xl font-bold">{analyticsData.stats.totalCharts}</p>
          <p className="text-sm mt-2">Interaktive Visualisierungen</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm font-semibold mb-2">Integration</p>
          <p className="text-4xl font-bold">{analyticsData.stats.integrationLevel}%</p>
          <p className="text-sm mt-2">Vollständig konsolidiert</p>
        </div>
      </div>

      {/* System Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">System-Performance</h3>
        <div className="space-y-4">
          {Object.entries(analyticsData.performance).map(([key, value]) => {
            const labelMap = {
              dataIntegration: 'Datenintegration',
              visualization: 'Visualisierung',
              kiFeatures: 'KI-Features',
              exportFunctions: 'Export-Funktionen'
            }
            const label = labelMap[key] || key

            return (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className={`text-sm font-semibold ${
                    value >= 95 ? 'text-green-600' :
                    value >= 85 ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      value >= 95 ? 'bg-green-600' :
                      value >= 85 ? 'bg-blue-600' :
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Module Usage & Feature Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Modul-Nutzung</h3>
          <PieChart
            labels={moduleUsageData.labels}
            data={moduleUsageData.data}
          />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Feature-Aktivität</h3>
          <BarChart
            labels={featureActivityData.labels}
            datasets={featureActivityData.datasets}
            options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
          />
        </div>
      </div>

      {/* Analytics Report */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Analytics-Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Modul-Zugriffe (gesamt)</p>
            <p className="text-2xl font-bold text-blue-600">{report.totalModuleAccess}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Durchschn. Performance</p>
            <p className="text-2xl font-bold text-purple-600">{report.avgPerformance}%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Meistgenutztes Modul</p>
            <p className="text-lg font-bold text-green-600">
              {report.mostUsedModule[0]} ({report.mostUsedModule[1]}x)
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Top Features</p>
            <p className="text-sm font-semibold text-yellow-800">
              {report.topFeatures.map(f => f[0]).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Detaillierte Statistiken</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Feature</th>
                <th className="px-4 py-3 text-left">Kategorie</th>
                <th className="px-4 py-3 text-left">Aktivität</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(analyticsData.featureActivity).map(([feature, activity]) => (
                <tr key={feature} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{feature}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Core Feature
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${activity}%` }}
                        ></div>
                      </div>
                      <span>{activity}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      activity >= 90 ? 'bg-green-100 text-green-800' :
                      activity >= 75 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity >= 90 ? 'Excellent' : activity >= 75 ? 'Good' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
