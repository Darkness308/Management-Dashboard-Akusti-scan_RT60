import { Target, BarChart3, Check, DollarSign } from 'lucide-react'

const iconMap = {
  Target,
  BarChart3,
  Check,
  DollarSign
}

export default function KPICard({ value, label, description, icon, color = 'blue' }) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100'
  }

  const IconComponent = iconMap[icon]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-semibold">{label}</p>
          <p className={`text-3xl font-bold ${colorMap[color]?.split(' ')[0] || 'text-blue-600'}`}>
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className={`w-12 h-12 ${colorMap[color]?.split(' ')[1] || 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
          {IconComponent && <IconComponent size={24} className={colorMap[color]?.split(' ')[0] || 'text-blue-600'} />}
        </div>
      </div>
    </div>
  )
}
