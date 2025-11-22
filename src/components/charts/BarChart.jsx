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

export default function BarChart({ labels, datasets, options = {}, className = '' }) {
  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderWidth: dataset.borderWidth || 0,
      borderRadius: dataset.borderRadius || 8
    }))
  }

  const chartOptions = {
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
  }

  return (
    <div className={className}>
      <Bar data={data} options={chartOptions} />
    </div>
  )
}
