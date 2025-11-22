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

export default function LineChart({ labels, datasets, options = {}, className = '' }) {
  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      tension: dataset.tension || 0.4,
      fill: dataset.fill !== undefined ? dataset.fill : true,
      borderWidth: dataset.borderWidth || 2,
      pointRadius: dataset.pointRadius || 4,
      pointHoverRadius: dataset.pointHoverRadius || 6
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
      <Line data={data} options={chartOptions} />
    </div>
  )
}
