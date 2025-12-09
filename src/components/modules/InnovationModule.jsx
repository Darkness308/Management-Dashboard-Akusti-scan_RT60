import { innovationData } from '@data/innovationData'
import BarChart from '../charts/BarChart'

export default function InnovationModule() {
  const chartData = {
    labels: innovationData.sectors.map(s => s.name),
    datasets: [{
      label: 'Relevanz',
      data: innovationData.sectors.map(s => s.relevance),
      backgroundColor: innovationData.sectors.map(s => s.color)
    }]
  }

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header">Innovation Mapping</h2>
      <p className="text-gray-600">Analyse der Cross-Sektor-Synergien & zukünftigen Wachstumsfelder</p>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-lg">Primärer Sektor</th>
                <th className="px-4 py-3 text-left">Emerging Tech</th>
                <th className="px-4 py-3 text-left">Potenzial</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Relevanz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {innovationData.sectors.map((sector, index) => (
                <tr key={index} className="table-row">
                  <td className="px-4 py-3 font-semibold">{sector.name}</td>
                  <td className="px-4 py-3">{sector.emergingTech}</td>
                  <td className="px-4 py-3">{sector.potential}</td>
                  <td className="px-4 py-3">
                    <span className={`badge badge-${sector.color === '#667eea' ? 'blue' : 'purple'}`}>
                      {sector.relevance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Relevanz-Übersicht</h3>
        <BarChart
          labels={chartData.labels}
          datasets={chartData.datasets}
          options={{ scales: { y: { max: 5 } } }}
        />
      </div>
    </section>
  )
}
