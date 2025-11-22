import { marketData } from '@data/marketData'
import LineChart from '../charts/LineChart'
import DoughnutChart from '../charts/DoughnutChart'

export default function MarketModule() {
  const growthData = {
    labels: marketData.marketGrowth.map(d => d.year),
    datasets: [{
      label: 'Marktvolumen (Mio €)',
      data: marketData.marketGrowth.map(d => d.volume),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.2)'
    }]
  }

  const targetData = {
    labels: marketData.targetGroups.map(g => g.name),
    data: marketData.targetGroups.map(g => g.percentage),
    backgroundColor: ['#4ade80', '#22c55e', '#16a34a', '#15803d']
  }

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header">🌍 Marktanalyse</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Marktwachstum & Trends</h3>
          <LineChart labels={growthData.labels} datasets={growthData.datasets} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Zielgruppen-Segmentierung</h3>
          <DoughnutChart labels={targetData.labels} data={targetData.data} backgroundColor={targetData.backgroundColor} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">TAM / SAM / SOM Analyse</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="metric-card p-6 rounded-lg">
            <p className="text-sm font-semibold text-gray-600">TAM (Total Addressable Market)</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{marketData.tam.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Gesamtmarkt DACH-Region</p>
          </div>
          <div className="metric-card p-6 rounded-lg">
            <p className="text-sm font-semibold text-gray-600">SAM (Serviceable Available Market)</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{marketData.sam.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">30% adressierbar</p>
          </div>
          <div className="metric-card p-6 rounded-lg">
            <p className="text-sm font-semibold text-gray-600">SOM (Serviceable Obtainable Market)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{marketData.som.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">5% realistisch erreichbar</p>
          </div>
        </div>
      </div>
    </section>
  )
}
