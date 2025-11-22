import { kpiData } from '@data/kpiData'
import { marketData } from '@data/marketData'
import KPICard from './KPICard'
import ModuleGrid from './ModuleGrid'
import LineChart from '../charts/LineChart'
import DoughnutChart from '../charts/DoughnutChart'

export default function Overview({ onModuleClick }) {
  const kpis = Object.values(kpiData)

  const marketGrowthData = {
    labels: marketData.marketGrowth.map(d => d.year),
    datasets: [{
      label: 'Marktvolumen (Mio €)',
      data: marketData.marketGrowth.map(d => d.volume),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)'
    }]
  }

  const targetGroupData = {
    labels: marketData.targetGroups.map(g => g.name),
    data: marketData.targetGroups.map(g => g.percentage),
    backgroundColor: marketData.targetGroups.map(g => g.color)
  }

  return (
    <section className="space-y-8">
      <h2 className="text-4xl font-bold section-header">Dashboard Übersicht</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            value={kpi.value}
            label={kpi.label}
            description={kpi.description}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Module Grid */}
      <ModuleGrid onModuleClick={onModuleClick} />

      {/* Quick Stats Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Marktwachstum</h3>
          <LineChart
            labels={marketGrowthData.labels}
            datasets={marketGrowthData.datasets}
          />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 Zielgruppen</h3>
          <DoughnutChart
            labels={targetGroupData.labels}
            data={targetGroupData.data}
            backgroundColor={targetGroupData.backgroundColor}
          />
        </div>
      </div>
    </section>
  )
}
