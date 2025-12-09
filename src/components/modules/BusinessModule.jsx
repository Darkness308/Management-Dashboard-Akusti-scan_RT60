import { businessData, compareCompetitors } from '@data/businessData'
import BarChart from '../charts/BarChart'
import { Briefcase, Lightbulb, Check, X } from 'lucide-react'

export default function BusinessModule() {
  const comparison = compareCompetitors()

  const competitorChartData = {
    labels: businessData.competitors.map(c => c.name),
    datasets: [{
      label: 'Preis (€)',
      data: businessData.competitors.map(c => typeof c.price === 'number' ? c.price : 100),
      backgroundColor: businessData.competitors.map(c =>
        c.highlight ? '#22c55e' : '#e5e7eb'
      )
    }]
  }

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header flex items-center gap-3">
        <Briefcase size={36} />
        Business Strategie
      </h2>

      {/* Pricing & Competition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Preisstrategie-Benchmarking</h3>
          <BarChart
            labels={competitorChartData.labels}
            datasets={competitorChartData.datasets}
          />

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <Lightbulb size={18} />
              Preisvorteil: {comparison.advantage}% günstiger als Durchschnitt
            </p>
            <p className="text-xs text-green-600 mt-1">
              Unser Preis: {comparison.ourPrice}€ | Wettbewerber Ø: {Math.round(comparison.avgCompetitorPrice)}€
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Wettbewerbsanalyse</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Anbieter</th>
                  <th className="px-3 py-2 text-left">Preis/Monat</th>
                  <th className="px-3 py-2 text-left">KI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {businessData.competitors.map((comp, idx) => (
                  <tr key={idx} className={comp.highlight ? 'bg-green-50' : ''}>
                    <td className="px-3 py-2 font-semibold">{comp.name}</td>
                    <td className="px-3 py-2 font-semibold text-green-600">
                      {comp.price} {comp.currency}
                    </td>
                    <td className="px-3 py-2">
                      {comp.hasAI ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-600" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue Projections */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Umsatzprognose</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {businessData.revenueProjections.map((proj, idx) => (
            <div key={idx} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Jahr {proj.year}</p>
              <p className="text-2xl font-bold text-purple-600">
                {(proj.revenue / 1000000).toFixed(1)}M €
              </p>
              <p className="text-xs text-gray-500 mt-1">{proj.customers} Kunden</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Preismodelle</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(businessData.pricing).map((tier, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-lg p-6 text-center ${
                tier.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
            >
              {tier.popular && (
                <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                  BELIEBT
                </div>
              )}
              <h4 className="font-bold text-lg mb-2">{tier.name}</h4>
              <p className="text-3xl font-bold text-purple-600 mb-2">{tier.price}</p>
              <p className="text-sm text-gray-600 mb-4">{tier.period}</p>
              <ul className="text-sm text-left space-y-2">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <Check size={16} className="text-green-600 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
