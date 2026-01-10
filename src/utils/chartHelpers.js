// Chart Helpers - Chart.js Configuration & Utilities

/**
 * Default chart options for consistency
 */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          size: 12
        },
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      borderRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      }
    }
  }
}

/**
 * Line chart configuration
 */
export const lineChartConfig = (labels, datasets, options = {}) => {
  return {
    type: 'line',
    data: { labels, datasets },
    options: {
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
  }
}

/**
 * Bar chart configuration
 */
export const barChartConfig = (labels, datasets, options = {}) => {
  return {
    type: 'bar',
    data: { labels, datasets },
    options: {
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
  }
}

/**
 * Doughnut/Pie chart configuration
 */
export const doughnutChartConfig = (labels, data, options = {}) => {
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      ...defaultChartOptions,
      cutout: '60%',
      ...options
    }
  }
}

/**
 * Pie chart configuration
 */
export const pieChartConfig = (labels, data, options = {}) => {
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a',
          '#fee140'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      ...defaultChartOptions,
      ...options
    }
  }
}

/**
 * Create gradient for charts
 */
export const createGradient = (ctx, color1, color2) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  return gradient
}

/**
 * Color palette for consistent styling
 */
export const colorPalette = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#3b82f6',
  light: '#f3f4f6',
  dark: '#111827'
}

/**
 * Generate gradient datasets
 */
export const generateGradientDataset = (label, data, color1 = '#667eea') => {
  return {
    label,
    data,
    borderColor: color1,
    backgroundColor: `${color1}20`,
    tension: 0.4,
    fill: true,
    borderWidth: 2,
    pointBackgroundColor: color1,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }
}

/**
 * Format number for display
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format currency
 */
export const formatCurrency = (num, currency = '€') => {
  return `${formatNumber(num)} ${currency}`
}

/**
 * Update chart data dynamically
 */
export const updateChartData = (chartRef, newData) => {
  if (chartRef && chartRef.current) {
    chartRef.current.data.datasets.forEach((dataset, i) => {
      dataset.data = newData[i] || dataset.data
    })
    chartRef.current.update()
  }
}

/**
 * Destroy chart safely
 */
export const destroyChart = (chartRef) => {
  if (chartRef && chartRef.current) {
    chartRef.current.destroy()
    chartRef.current = null
  }
}
