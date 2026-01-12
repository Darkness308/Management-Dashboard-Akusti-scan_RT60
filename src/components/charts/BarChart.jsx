import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { defaultChartOptions } from '@utils/chartHelpers'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function BarChart({ labels, datasets, options = {}, className = '' }) {
  // Memoize chart data to prevent unnecessary re-renders
  const data = useMemo(() => ({
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderWidth: dataset.borderWidth || 0,
      borderRadius: dataset.borderRadius || 8
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
      <Bar data={data} options={chartOptions} />
    </div>
  )
}

BarChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  datasets: PropTypes.arrayOf(PropTypes.shape({
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
    borderRadius: PropTypes.number
  })).isRequired,
  options: PropTypes.object,
  className: PropTypes.string
}

// Export memoized component to prevent re-renders when props don't change
export default memo(BarChart)
