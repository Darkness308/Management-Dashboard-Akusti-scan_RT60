// KI-System Data - Techniken, Workflows, Templates

export const kiSystemData = {
  techniques: [
    {
      id: '002',
      name: 'Progressive Komplexitäts-Eskalation',
      successRate: 93,
      duration: 5,
      status: 'Flagship',
      description: '4-Stufen-Modell für optimale Verständlichkeit und Token-Persistenz',
      category: 'Strukturierung'
    },
    {
      id: '007',
      name: 'Sublimale Sprachliche Ansteckung',
      successRate: 95,
      duration: 2,
      status: 'Bewährt',
      description: 'Übertragung spezifischer Sprachmuster auf KI-Ausgaben',
      category: 'Sprachsteuerung'
    },
    {
      id: '011',
      name: 'Meta-Reflexions-Trigger',
      successRate: 92,
      duration: 12,
      status: 'Bewährt',
      description: 'Aktivierung von Meta-Analyse durch Rückfragen',
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
    }
  ],

  workflows: [
    {
      id: 'ki-transformation',
      name: 'KI-Transformation Workflow',
      duration: 19,
      successRate: 91,
      description: 'Vollständige KI-Persönlichkeits-Transformation',
      steps: ['#002', '#007', '#011']
    },
    {
      id: 'business-enhancement',
      name: 'Business-Enhancement',
      duration: 20,
      successRate: 89,
      description: 'Professionelle Ergebnisse mit Verbesserungen',
      steps: ['#007', '#016', '#002']
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
export const getRecommendedWorkflow = (goal = 'transformation') => {
  const mapping = {
    transformation: 'ki-transformation',
    business: 'business-enhancement'
  }
  const workflowId = mapping[goal] || 'ki-transformation'
  return kiSystemData.workflows.find(w => w.id === workflowId)
}

// Get techniques by category
export const getTechniquesByCategory = (category) => {
  return kiSystemData.techniques.filter(t => t.category === category)
}

export default kiSystemData
