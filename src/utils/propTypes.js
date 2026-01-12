import PropTypes from 'prop-types'

/**
 * Shared PropTypes for Chart Components
 * Reusable prop type definitions for all chart components
 */

/**
 * Dataset PropType for charts
 * Used by LineChart, BarChart, and other chart components
 */
export const datasetPropType = PropTypes.shape({
  label: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  backgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  borderColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  tension: PropTypes.number,
  fill: PropTypes.bool,
  pointRadius: PropTypes.number,
  pointHoverRadius: PropTypes.number
})

/**
 * Common chart props
 */
export const chartPropTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  datasets: PropTypes.arrayOf(datasetPropType).isRequired,
  options: PropTypes.object,
  className: PropTypes.string
}

/**
 * KPI Card color options
 */
export const kpiColorPropType = PropTypes.oneOf(['blue', 'purple', 'green', 'yellow'])

/**
 * Icon name options (from lucide-react)
 */
export const iconNamePropType = PropTypes.oneOf([
  'Target',
  'BarChart3',
  'Check',
  'DollarSign',
  'TrendingUp',
  'Users',
  'Award',
  'Zap'
])

export default {
  datasetPropType,
  chartPropTypes,
  kpiColorPropType,
  iconNamePropType
}
