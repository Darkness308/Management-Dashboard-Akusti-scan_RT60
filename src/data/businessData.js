// Business Strategy Data - Pricing, Competitors, Revenue

export const businessData = {
  pricing: {
    basic: {
      price: 49,
      name: 'Basic',
      period: 'Monat',
      features: [
        'Raumerfassung',
        'RT60-Messung',
        'Basis-Berichte'
      ]
    },
    professional: {
      price: 125,
      name: 'Professional',
      period: 'Monat',
      popular: true,
      features: [
        'Alle Basic Features',
        'KI-Optimierung',
        'BIM-Integration',
        'Export-Funktionen'
      ]
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

  competitors: [
    { name: 'Autodesk Forma', price: 185, currency: '$', hasAI: true },
    { name: 'PlanRadar', price: '26-129', currency: '€', hasAI: true },
    { name: 'Archicad AI', price: 234, currency: '$', hasAI: true },
    { name: 'Unser Modell', price: 125, currency: '€', hasAI: true, highlight: true }
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
