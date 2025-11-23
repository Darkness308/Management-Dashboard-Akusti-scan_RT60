// Business Strategy Data - Pricing, Competitors, Revenue
import marketConfig from '@/config/market.config'

// Import pricing from centralized config
const { pricing, competitors } = marketConfig

export const businessData = {
  pricing: {
    basic: {
      price: pricing.basic.price,
      name: 'Basic',
      period: 'Monat',
      features: pricing.basic.features
    },
    professional: {
      price: pricing.pro.price,
      name: 'Professional',
      period: 'Monat',
      popular: pricing.pro.highlight,
      features: pricing.pro.features
    },
    enterprise: {
      price: 'Custom',
      name: 'Enterprise',
      period: 'Individuelle Preise',
      features: [
        'Alle Pro Features',
        'API-Zugang',
        'White-Label',
        'Support 24/7'
      ]
    }
  },

  // Map competitors from config to display format
  competitors: [
    ...competitors.map(c => ({
      name: c.name,
      price: c.priceRange ? `${c.priceRange.min}-${c.priceRange.max}` : c.price,
      currency: c.currency === 'USD' ? '$' : '€',
      hasAI: true
    })),
    {
      name: 'Unser Modell',
      price: pricing.pro.price,
      currency: '€',
      hasAI: true,
      highlight: true
    }
  ],

  revenueProjections: [
    { year: 1, revenue: 360000, customers: 240 },
    { year: 2, revenue: 720000, customers: 480 },
    { year: 3, revenue: 1200000, customers: 800 },
    { year: 5, revenue: 2400000, customers: 1600 }
  ]
}

// Compare with competitors
export const compareCompetitors = () => {
  const ourPrice = businessData.competitors.find(c => c.highlight)?.price || 125
  const avgCompetitorPrice = businessData.competitors
    .filter(c => !c.highlight && typeof c.price === 'number')
    .reduce((sum, c) => sum + c.price, 0) / 3

  return {
    ourPrice,
    avgCompetitorPrice,
    advantage: ((avgCompetitorPrice - ourPrice) / avgCompetitorPrice * 100).toFixed(1)
  }
}

// Calculate LTV (Lifetime Value)
export const calculateLTV = (avgMonthlyPrice = 125, avgRetentionMonths = 24) => {
  return avgMonthlyPrice * avgRetentionMonths
}

// Calculate CAC (Customer Acquisition Cost) - estimated
export const calculateCAC = (marketingSpend = 50000, customersAcquired = 240) => {
  return Math.round(marketingSpend / customersAcquired)
}

export default businessData
