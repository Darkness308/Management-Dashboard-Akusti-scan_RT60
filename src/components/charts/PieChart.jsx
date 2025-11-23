import { memo, useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { defaultChartOptions } from '@utils/chartHelpers'

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const defaultColors = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#4facfe',
  '#43e97b',
  '#fa709a',
  '#fee140'
]

function PieChart({ labels, data: chartData, backgroundColor, options = {}, className = '' }) {
  // Memoize chart data to prevent unnecessary re-renders
  const data = useMemo(() => ({
    labels,
    datasets: [{
      data: chartData,
      backgroundColor: backgroundColor || defaultColors,
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }), [labels, chartData, backgroundColor])

  // Memoize chart options
  const chartOptions = useMemo(() => ({
    ...defaultChartOptions,
    ...options
  }), [options])

  return (
    <div className={className}>
      <Pie data={data} options={chartOptions} />
    </div>
  )
}

// Export memoized component to prevent re-renders when props don't change
export default memo(PieChart)
