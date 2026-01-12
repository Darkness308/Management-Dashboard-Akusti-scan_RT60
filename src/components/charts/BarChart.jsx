import { memo, useMemo } from 'react'
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
import { chartPropTypes } from '@utils/propTypes'

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

BarChart.propTypes = chartPropTypes

// Export memoized component to prevent re-renders when props don't change
export default memo(BarChart)
