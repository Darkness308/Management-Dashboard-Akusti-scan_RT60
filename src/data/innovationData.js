// Innovation Mapping - Cross-Sektor-Synergien

export const innovationData = {
  sectors: [
    {
      id: 'raumakustik',
      name: 'Raumakustik / Bauphysik',
      emergingTech: 'Smart-Building, IoT, Sensorintegration',
      potential: 'Automatisierte RT60-Messungen',
      relevance: 5,
      color: '#667eea'
    },
    {
      id: 'proptech',
      name: 'PropTech',
      emergingTech: 'BIM, CAD, Digital Twin',
      potential: 'Integration von BIM-Schnittstellen',
      relevance: 5,
      color: '#764ba2'
    },
    {
      id: 'bildung',
      name: 'Bildung / Schulen',
      emergingTech: 'Förderprogramme, E-Learning',
      potential: 'Digitale Raumoptimierung',
      relevance: 4,
      color: '#f093fb'
    },
    {
      id: 'arvr',
      name: 'AR/VR & Spatial Computing',
      emergingTech: 'Apple Vision Pro, 3D-Simulation',
      potential: 'Echtzeit-Auralisation',
      relevance: 4,
      color: '#4facfe'
    }
  ]
}

// Get sectors sorted by relevance
export const getSectorsByRelevance = () => {
  return [...innovationData.sectors].sort((a, b) => b.relevance - a.relevance)
}

// Filter by minimum relevance
export const filterByRelevance = (minScore) => {
  return innovationData.sectors.filter(sector => sector.relevance >= minScore)
}

// Get top sectors
export const getTopSectors = (count = 3) => {
  return getSectorsByRelevance().slice(0, count)
}

export default innovationData
