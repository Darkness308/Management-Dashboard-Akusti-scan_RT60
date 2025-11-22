// Technik & Normen Data

export const technikData = {
  hardware: [
    { name: 'iPad Pro mit LiDAR Scanner', required: true, category: 'Device' },
    { name: 'iOS 15+ kompatibel', required: true, category: 'OS' },
    { name: 'Mikrofon für RT60-Messung', required: true, category: 'Sensor' },
    { name: 'Mindestens 4GB RAM', required: true, category: 'Specs' }
  ],

  software: [
    { name: 'Swift / SwiftUI', required: true, category: 'Framework' },
    { name: 'ARKit für Raumerfassung', required: true, category: 'SDK' },
    { name: 'Core ML für KI-Features', required: true, category: 'ML' },
    { name: 'Chart.js für Visualisierung', required: false, category: 'Library' }
  ],

  standards: [
    {
      id: 'DIN-18041',
      name: 'DIN 18041',
      description: 'Hörsamkeit in Räumen - Anforderungen, Empfehlungen und Hinweise für die Planung',
      category: 'Raumakustik',
      color: 'blue'
    },
    {
      id: 'ISO-3382',
      name: 'ISO 3382',
      description: 'Messung von Raumakustischen Parametern',
      category: 'Messung',
      color: 'purple'
    },
    {
      id: 'VDI-2081',
      name: 'VDI 2081',
      description: 'Geräuscherzeugung und Lärmminderung in RLT-Anlagen',
      category: 'Lärmschutz',
      color: 'green'
    }
  ]
}

// Get required hardware
export const getRequiredHardware = () => {
  return technikData.hardware.filter(h => h.required)
}

// Get required software
export const getRequiredSoftware = () => {
  return technikData.software.filter(s => s.required)
}

// Get relevant standards
export const getRelevantStandards = () => {
  return technikData.standards
}

// Check compliance
export const checkCompliance = (config) => {
  const requiredHw = getRequiredHardware()
  const requiredSw = getRequiredSoftware()

  const hwCompliant = requiredHw.every(hw => config.hardware?.includes(hw.name))
  const swCompliant = requiredSw.every(sw => config.software?.includes(sw.name))

  return {
    compliant: hwCompliant && swCompliant,
    hardware: hwCompliant,
    software: swCompliant
  }
}

export default technikData
