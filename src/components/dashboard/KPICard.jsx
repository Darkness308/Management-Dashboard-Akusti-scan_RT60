import { Target, BarChart3, Check, DollarSign } from 'lucide-react'
import PropTypes from 'prop-types'
import { kpiColorPropType, iconNamePropType } from '@utils/propTypes'

const iconMap = {
  Target,
  BarChart3,
  Check,
  DollarSign
}

export default function KPICard({ value, label, description, icon, color = 'blue' }) {
  const colorMap = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
    green: { text: 'text-green-600', bg: 'bg-green-100' },
    yellow: { text: 'text-yellow-600', bg: 'bg-yellow-100' }
  }

  const colors = colorMap[color] || colorMap.blue
  const IconComponent = iconMap[icon]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-semibold">{label}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          {IconComponent && <IconComponent size={24} className={colors.text} />}
        </div>
      </div>
    </div>
  )
}

KPICard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: iconNamePropType,
  color: kpiColorPropType
}
