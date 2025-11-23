// KI-System Data - Optimierungs-Strategien, Workflows, Templates

export const kiSystemData = {
  techniques: [
    {
      id: '002',
      name: 'Progressive Komplexitäts-Steigerung',
      successRate: 93,
      duration: 5,
      status: 'Flagship',
      description: '4-Stufen-Modell für optimale Verständlichkeit und Kontext-Persistenz',
      category: 'Strukturierung'
    },
    {
      id: '007',
      name: 'Adaptive Sprach-Optimierung',
      successRate: 95,
      duration: 2,
      status: 'Bewährt',
      description: 'Konsistente Sprachmuster für präzise KI-Ausgaben',
      category: 'Sprachsteuerung'
    },
    {
      id: '011',
      name: 'Meta-Reflexions-Trigger',
      successRate: 92,
      duration: 12,
      status: 'Bewährt',
      description: 'Aktivierung von Meta-Analyse durch Qualitätssicherungs-Fragen',
      category: 'Qualität'
    },
    {
      id: '016',
      name: 'API-Integration Optimization',
      successRate: 87,
      duration: 15,
      status: 'Bewährt',
      description: 'Intelligente Kostenoptimierung durch strategische Modell-Auswahl',
      category: 'Effizienz'
    },
    {
      id: '003',
      name: 'Context-Window Maximierung',
      successRate: 88,
      duration: 8,
      status: 'Aktiv',
      description: 'Optimale Nutzung des verfügbaren Kontext-Fensters',
      category: 'Effizienz'
    },
    {
      id: '009',
      name: 'Prompt-Engineering Framework',
      successRate: 91,
      duration: 10,
      status: 'Aktiv',
      description: 'Strukturierte Prompt-Entwicklung nach Best Practices',
      category: 'Strukturierung'
    },
    {
      id: '013',
      name: 'Output-Format Standardisierung',
      successRate: 89,
      duration: 6,
      status: 'Aktiv',
      description: 'Konsistente Ausgabeformate für nachgelagerte Prozesse',
      category: 'Qualität'
    },
    {
      id: '018',
      name: 'Multi-Step Reasoning Chain',
      successRate: 90,
      duration: 14,
      status: 'Aktiv',
      description: 'Schrittweise Problemlösung mit Zwischenergebnissen',
      category: 'Qualität'
    }
  ],

  workflows: [
    {
      id: 'ki-optimization',
      name: 'KI-Optimierungs-Workflow',
      duration: 19,
      successRate: 91,
      description: 'Systematische Verbesserung der KI-Ausgabe-Qualität',
      steps: ['#002', '#007', '#011']
    },
    {
      id: 'business-enhancement',
      name: 'Business-Enhancement',
      duration: 20,
      successRate: 89,
      description: 'Professionelle Ergebnisse mit Qualitätsverbesserungen',
      steps: ['#007', '#016', '#002']
    },
    {
      id: 'efficiency-boost',
      name: 'Effizienz-Optimierung',
      duration: 18,
      successRate: 87,
      description: 'Maximale Kosteneffizienz bei hoher Qualität',
      steps: ['#016', '#003', '#013']
    }
  ],

  stats: {
    totalTechniques: 20,
    totalWorkflows: 6,
    totalTemplates: 8
  }
}

// Get top techniques by success rate
export const getTopTechniques = (count = 4) => {
  return [...kiSystemData.techniques]
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, count)
}

// Get recommended workflow by goal
export const getRecommendedWorkflow = (goal = 'optimization') => {
  const mapping = {
    optimization: 'ki-optimization',
    business: 'business-enhancement',
    efficiency: 'efficiency-boost'
  }
  const workflowId = mapping[goal] || 'ki-optimization'
  return kiSystemData.workflows.find(w => w.id === workflowId)
}

// Get techniques by category
export const getTechniquesByCategory = (category) => {
  return kiSystemData.techniques.filter(t => t.category === category)
}

export default kiSystemData
