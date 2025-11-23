/**
 * Market Configuration
 * Centralized configuration for pricing, competitors, and market data
 *
 * Benefits:
 * - Easy updates without code changes
 * - Single source of truth
 * - Environment-specific configurations possible
 * - Can be moved to backend/CMS in the future
 */

export const marketConfig = {
  // Last updated date (for tracking data freshness)
  lastUpdated: '2025-11',

  // Market Size (DACH Region)
  market: {
    tam: 63841, // Total Addressable Market (Architekturbüros + Schulen + Ingenieurbüros)
    samPercentage: 30, // SAM as percentage of TAM
    somPercentage: 5 // SOM as percentage of SAM
  },

  // Our Pricing
  pricing: {
    basic: {
      price: 49,
      currency: 'EUR',
      billingCycle: 'month',
      features: [
        'RT60-Messung',
        'Basis-Visualisierung',
        'PDF-Export',
        '1 Benutzer'
      ]
    },
    pro: {
      price: 125,
      currency: 'EUR',
      billingCycle: 'month',
      features: [
        'Alle Basic Features',
        'Erweiterte Analytics',
        'Multi-User (5)',
        'API-Zugang',
        'Priority Support'
      ],
      highlight: true // Our main offering
    }
  },

  // Competitors (verified Nov 2025)
  competitors: [
    {
      name: 'Autodesk Forma',
      price: 185,
      priceRange: null,
      currency: 'USD',
      billingCycle: 'month',
      category: 'Enterprise',
      features: [
        'BIM Integration',
        'Erweiterte Simulation',
        'Cloud-basiert',
        'Team Collaboration'
      ],
      marketPosition: 'Premium',
      lastVerified: '2025-11'
    },
    {
      name: 'PlanRadar',
      price: null,
      priceRange: { min: 26, max: 129 },
      currency: 'EUR',
      billingCycle: 'month',
      category: 'Mid-Market',
      features: [
        'Dokumentation',
        'Mängelverwaltung',
        'Mobile App',
        'Berichterstellung'
      ],
      marketPosition: 'Mid-Range',
      lastVerified: '2025-11'
    },
    {
      name: 'SketchUp',
      price: 119,
      priceRange: null,
      currency: 'USD',
      billingCycle: 'month',
      category: 'Design Tool',
      features: [
        '3D Modeling',
        'Rendering',
        'Extensions',
        'Mobile Viewer'
      ],
      marketPosition: 'Mid-Range',
      lastVerified: '2025-11'
    }
  ],

  // Technical Standards (DIN, ISO, VDI)
  standards: {
    din: [
      {
        number: 'DIN 18041',
        title: 'Hörsamkeit in Räumen',
        year: 2016,
        status: 'Aktuell',
        relevance: 'Primär'
      },
      {
        number: 'DIN 4109',
        title: 'Schallschutz im Hochbau',
        year: 2018,
        status: 'Aktuell',
        relevance: 'Sekundär'
      }
    ],
    iso: [
      {
        number: 'ISO 3382',
        title: 'Messung der Nachhallzeit',
        parts: ['3382-1', '3382-2', '3382-3'],
        year: 2009,
        status: 'Aktuell',
        relevance: 'Primär'
      }
    ],
    vdi: [
      {
        number: 'VDI 2569',
        title: 'Schallschutz und akustische Gestaltung',
        year: 2019,
        status: 'Aktuell',
        relevance: 'Sekundär'
      }
    ]
  }
}

/**
 * Helper Functions
 */

// Calculate SAM from TAM
export const calculateSAM = (customPercentage = null) => {
  const percentage = customPercentage || marketConfig.market.samPercentage
  return Math.round(marketConfig.market.tam * (percentage / 100))
}

// Calculate SOM from SAM
export const calculateSOM = (customPercentage = null) => {
  const sam = calculateSAM()
  const percentage = customPercentage || marketConfig.market.somPercentage
  return Math.round(sam * (percentage / 100))
}

// Get competitor by name
export const getCompetitor = (name) => {
  return marketConfig.competitors.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  )
}

// Get our average price
export const getOurAveragePrice = () => {
  const { basic, pro } = marketConfig.pricing
  return (basic.price + pro.price) / 2
}

// Compare our pricing with competitors
export const compareWithCompetitors = () => {
  const ourPrice = marketConfig.pricing.pro.price // Use Pro as reference
  const competitorPrices = marketConfig.competitors
    .map((c) => c.price || (c.priceRange ? (c.priceRange.min + c.priceRange.max) / 2 : null))
    .filter((p) => p !== null)

  const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length

  return {
    ourPrice,
    avgCompetitorPrice: Math.round(avgCompetitorPrice),
    advantage: Math.round(avgCompetitorPrice - ourPrice),
    advantagePercentage: Math.round(((avgCompetitorPrice - ourPrice) / avgCompetitorPrice) * 100)
  }
}

export default marketConfig
