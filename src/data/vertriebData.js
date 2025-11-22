// Vertrieb & Zielgruppen Data

export const vertriebData = {
  targetGroups: [
    {
      id: 'architektur',
      name: 'Architekturbüros',
      percentage: 35,
      size: 'Large',
      priority: 'High',
      channels: ['Direktvertrieb', 'Partner-Netzwerk'],
      color: 'blue'
    },
    {
      id: 'schulen',
      name: 'Schulen & Bildung',
      percentage: 25,
      size: 'Medium',
      priority: 'High',
      channels: ['Direktvertrieb', 'Online-Marketing'],
      color: 'purple'
    },
    {
      id: 'oeffentlich',
      name: 'Öffentliche Träger',
      percentage: 20,
      size: 'Large',
      priority: 'Medium',
      channels: ['Direktvertrieb', 'Ausschreibungen'],
      color: 'green'
    },
    {
      id: 'unternehmen',
      name: 'Unternehmen',
      percentage: 20,
      size: 'Medium',
      priority: 'Medium',
      channels: ['App Store', 'Online-Marketing'],
      color: 'yellow'
    }
  ],

  salesChannels: [
    {
      id: 'direkt',
      name: 'Direktvertrieb',
      description: 'Sales Team für große Kunden',
      effectiveness: 85,
      cost: 'High',
      color: 'blue'
    },
    {
      id: 'appstore',
      name: 'App Store',
      description: 'Apple App Store & Enterprise',
      effectiveness: 70,
      cost: 'Low',
      color: 'purple'
    },
    {
      id: 'partner',
      name: 'Partner-Netzwerk',
      description: 'Architektur-Verbände & Planer',
      effectiveness: 75,
      cost: 'Medium',
      color: 'green'
    },
    {
      id: 'online',
      name: 'Online-Marketing',
      description: 'SEO, SEM, Content Marketing',
      effectiveness: 65,
      cost: 'Medium',
      color: 'yellow'
    }
  ]
}

// Segment target groups
export const segmentTargetGroups = () => {
  return {
    high: vertriebData.targetGroups.filter(g => g.priority === 'High'),
    medium: vertriebData.targetGroups.filter(g => g.priority === 'Medium'),
    low: vertriebData.targetGroups.filter(g => g.priority === 'Low')
  }
}

// Optimize channel mix
export const optimizeChannelMix = () => {
  return vertriebData.salesChannels
    .sort((a, b) => b.effectiveness - a.effectiveness)
}

// Calculate conversion rates (estimated)
export const calculateConversionRates = () => {
  return {
    direktvertrieb: 12,
    appStore: 3,
    partner: 8,
    online: 2
  }
}

// Generate lead score
export const generateLeadScore = (lead) => {
  let score = 0

  // Target group match
  const targetGroup = vertriebData.targetGroups.find(g => g.id === lead.segment)
  if (targetGroup?.priority === 'High') score += 40
  else if (targetGroup?.priority === 'Medium') score += 25

  // Company size
  if (lead.companySize === 'Large') score += 30
  else if (lead.companySize === 'Medium') score += 20
  else score += 10

  // Budget
  if (lead.budget >= 10000) score += 20
  else if (lead.budget >= 5000) score += 10

  // Engagement
  score += Math.min(lead.engagement || 0, 10)

  return Math.min(score, 100)
}

export default vertriebData
