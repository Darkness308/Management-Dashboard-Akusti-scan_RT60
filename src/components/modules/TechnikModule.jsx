import { technikData, getRequiredHardware, getRequiredSoftware } from '@data/technikData'
import { Settings, Wrench, Check } from 'lucide-react'

export default function TechnikModule() {
  const requiredHw = getRequiredHardware()
  const requiredSw = getRequiredSoftware()

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header flex items-center gap-3">
        <Settings size={36} />
        Technik & Normen
      </h2>

      {/* Technical Requirements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Technische Anforderungen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hardware */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
              <Monitor className="w-6 h-6 mr-2" />
              Hardware
            </h4>
            <ul className="space-y-2">
              {technikData.hardware.map((hw, idx) => (
                <li key={idx} className="flex items-start">
                  <span className={`mr-2 ${hw.required ? 'text-red-600' : 'text-gray-400'}`}>
                    {hw.required ? '●' : '○'}
                  </span>
                  <div>
                    <span className="text-gray-700">{hw.name}</span>
                    <span className="ml-2 text-xs text-gray-500">({hw.category})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Software */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <Wrench size={20} />
              Software
            </h4>
            <ul className="space-y-2">
              {technikData.software.map((sw, idx) => (
                <li key={idx} className="flex items-start">
                  <span className={`mr-2 ${sw.required ? 'text-red-600' : 'text-gray-400'}`}>
                    {sw.required ? '●' : '○'}
                  </span>
                  <div>
                    <span className="text-gray-700">{sw.name}</span>
                    <span className="ml-2 text-xs text-gray-500">({sw.category})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>● = Erforderlich</strong> | <span className="text-gray-600">○ = Optional</span>
          </p>
        </div>
      </div>

      {/* Standards & Norms */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Relevante Normen & Standards</h3>
        <div className="space-y-3">
          {technikData.standards.map((standard, idx) => {
            const colorMap = {
              blue: 'bg-blue-100 text-blue-800',
              purple: 'bg-purple-100 text-purple-800',
              green: 'bg-green-100 text-green-800'
            }
            return (
              <div key={idx} className="flex items-start space-x-3">
                <span className={`${colorMap[standard.color]} px-3 py-1 rounded text-sm font-semibold shrink-0`}>
                  {standard.name}
                </span>
                <div>
                  <p className="text-gray-700 font-medium">{standard.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Kategorie: {standard.category}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compliance Checker */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Compliance-Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Check size={18} />
              Hardware-Anforderungen
            </h4>
            <p className="text-sm text-green-700">{requiredHw.length} Komponenten erforderlich</p>
            <ul className="mt-2 text-xs text-green-600 space-y-1">
              {requiredHw.map((hw, idx) => (
                <li key={idx}>• {hw.name}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Check size={18} />
              Software-Anforderungen
            </h4>
            <p className="text-sm text-green-700">{requiredSw.length} Komponenten erforderlich</p>
            <ul className="mt-2 text-xs text-green-600 space-y-1">
              {requiredSw.map((sw, idx) => (
                <li key={idx}>• {sw.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Technische Spezifikationen</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Komponente</th>
                <th className="px-4 py-3 text-left">Typ</th>
                <th className="px-4 py-3 text-left">Kategorie</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {technikData.hardware.map((item, idx) => (
                <tr key={`hw-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">Hardware</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.required ? 'Erforderlich' : 'Optional'}
                    </span>
                  </td>
                </tr>
              ))}
              {technikData.software.map((item, idx) => (
                <tr key={`sw-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">Software</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.required ? 'Erforderlich' : 'Optional'}
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
