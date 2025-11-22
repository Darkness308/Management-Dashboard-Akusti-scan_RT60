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

export default function PieChart({ labels, data: chartData, backgroundColor, options = {}, className = '' }) {
  const defaultColors = [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#4facfe',
    '#43e97b',
    '#fa709a',
    '#fee140'
  ]

  const data = {
    labels,
    datasets: [{
      data: chartData,
      backgroundColor: backgroundColor || defaultColors,
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }

  const chartOptions = {
    ...defaultChartOptions,
    ...options
  }

  return (
    <div className={className}>
      <Pie data={data} options={chartOptions} />
    </div>
  )
}
