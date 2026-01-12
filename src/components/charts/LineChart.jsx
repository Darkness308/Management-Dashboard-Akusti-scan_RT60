import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { defaultChartOptions } from '@utils/chartHelpers'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function LineChart({ labels, datasets, options = {}, className = '' }) {
  // Memoize chart data to prevent unnecessary re-renders
  const data = useMemo(() => ({
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      tension: dataset.tension || 0.4,
      fill: dataset.fill !== undefined ? dataset.fill : true,
      borderWidth: dataset.borderWidth || 2,
      pointRadius: dataset.pointRadius || 4,
      pointHoverRadius: dataset.pointHoverRadius || 6
    }))
  }), [labels, datasets])

  // Memoize chart options
  const chartOptions = useMemo(() => ({
    ...defaultChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    ...options
  }), [options])

  return (
    <div className={className}>
      <Line data={data} options={chartOptions} />
    </div>
  )
}

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  datasets: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    tension: PropTypes.number,
    fill: PropTypes.bool,
    borderWidth: PropTypes.number,
    pointRadius: PropTypes.number,
    pointHoverRadius: PropTypes.number
  })).isRequired,
  options: PropTypes.object,
  className: PropTypes.string
}

// Export memoized component to prevent re-renders when props don't change
export default memo(LineChart)
