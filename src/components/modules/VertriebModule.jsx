import { vertriebData, optimizeChannelMix } from '@data/vertriebData'
import DoughnutChart from '../charts/DoughnutChart'
import BarChart from '../charts/BarChart'

export default function VertriebModule() {
  const optimizedChannels = optimizeChannelMix()

  const targetGroupChartData = {
    labels: vertriebData.targetGroups.map(g => g.name),
    data: vertriebData.targetGroups.map(g => g.percentage)
  }

  const channelEffectivenessData = {
    labels: vertriebData.salesChannels.map(c => c.name),
    datasets: [{
      label: 'Effektivität (%)',
      data: vertriebData.salesChannels.map(c => c.effectiveness),
      backgroundColor: vertriebData.salesChannels.map(c => {
        const colorMap = { blue: '#667eea', purple: '#764ba2', green: '#22c55e', yellow: '#eab308' }
        return colorMap[c.color] || '#667eea'
      })
    }]
  }

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header">📈 Vertrieb & Zielgruppen</h2>

      {/* Target Groups & Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Target Groups */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Primäre Zielgruppen</h3>
          <div className="space-y-3 mb-4">
            {vertriebData.targetGroups.map((group, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">{group.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`badge badge-${group.color}`}>{group.percentage}%</span>
                  <span className="text-xs text-gray-500">{group.priority}</span>
                </div>
              </div>
            ))}
          </div>
          <DoughnutChart
            labels={targetGroupChartData.labels}
            data={targetGroupChartData.data}
          />
        </div>

        {/* Sales Channels */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Vertriebskanäle</h3>
          <div className="space-y-3">
            {vertriebData.salesChannels.map((channel, idx) => (
              <div key={idx} className={`p-3 border-l-4 border-${channel.color}-500`}>
                <h4 className="font-semibold">{channel.name}</h4>
                <p className="text-sm text-gray-600">{channel.description}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className="text-xs text-gray-500">Effektivität: {channel.effectiveness}%</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    channel.cost === 'High' ? 'bg-red-100 text-red-800' :
                    channel.cost === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Kosten: {channel.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Effectiveness */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Kanal-Effektivität</h3>
        <BarChart
          labels={channelEffectivenessData.labels}
          datasets={channelEffectivenessData.datasets}
          options={{ scales: { y: { max: 100 } } }}
        />
      </div>

      {/* Optimized Channel Mix */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Optimierter Kanal-Mix</h3>
        <p className="text-gray-600 mb-4">
          Empfohlene Vertriebskanäle sortiert nach Effektivität:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizedChannels.map((channel, idx) => (
            <div key={idx} className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg">#{idx + 1} {channel.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                </div>
                <span className={`badge badge-${channel.color}`}>
                  {channel.effectiveness}%
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Kosten: {channel.cost}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Group Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Zielgruppen-Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">Zielgruppe</th>
                <th className="px-4 py-3 text-left">Anteil</th>
                <th className="px-4 py-3 text-left">Größe</th>
                <th className="px-4 py-3 text-left">Priorität</th>
                <th className="px-4 py-3 text-left">Empfohlene Kanäle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vertriebData.targetGroups.map((group, idx) => (
                <tr key={idx} className="table-row">
                  <td className="px-4 py-3 font-semibold">{group.name}</td>
                  <td className="px-4 py-3">{group.percentage}%</td>
                  <td className="px-4 py-3">{group.size}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      group.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {group.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {group.channels.map((ch, chIdx) => (
                        <span key={chIdx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {ch}
                        </span>
                      ))}
                    </div>
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
