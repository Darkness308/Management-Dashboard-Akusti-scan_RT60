// Market Analysis Data - TAM/SAM/SOM & Growth
import marketConfig, { calculateSAM as configCalculateSAM, calculateSOM as configCalculateSOM } from '@/config/market.config'

export const marketData = {
  tam: marketConfig.market.tam,
  sam: configCalculateSAM(),
  samPercentage: marketConfig.market.samPercentage,
  som: configCalculateSOM(),
  somPercentage: marketConfig.market.somPercentage,
  revenuePerCustomer: 1500,

  marketGrowth: [
    { year: '2022', volume: 150 },
    { year: '2023', volume: 210 },
    { year: '2024', volume: 280 },
    { year: '2025', volume: 360 },
    { year: '2026', volume: 450 }
  ],

  targetGroups: [
    { name: 'Architekturbüros', percentage: 35, color: '#667eea' },
    { name: 'Schulen', percentage: 25, color: '#764ba2' },
    { name: 'Öffentliche Träger', percentage: 20, color: '#f093fb' },
    { name: 'Unternehmen', percentage: 20, color: '#4facfe' }
  ]
}

// Calculate TAM
export const calculateTAM = () => marketData.tam

// Calculate SAM
export const calculateSAM = (percentage = marketData.samPercentage) => {
  return Math.round(marketData.tam * (percentage / 100))
}

// Calculate SOM
export const calculateSOM = (percentage = marketData.somPercentage) => {
  return Math.round(calculateSAM() * (percentage / 100))
}

// Forecast Revenue
export const forecastRevenue = (customers, pricePerYear = marketData.revenuePerCustomer) => {
  return customers * pricePerYear
}

// Get Market Growth Rate
export const getMarketGrowthRate = () => {
  const data = marketData.marketGrowth
  const first = data[0].volume
  const last = data[data.length - 1].volume
  const years = data.length - 1
  return ((last / first) ** (1 / years) - 1) * 100
}

export default marketData
