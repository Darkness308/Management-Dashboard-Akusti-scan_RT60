// KPI Data for Dashboard Overview

export const kpiData = {
  tam: {
    value: 63841,
    label: 'TAM Marktgröße',
    description: 'Unternehmen DACH',
    icon: 'target',
    color: 'blue'
  },
  sam: {
    value: 19152,
    label: 'SAM (30%)',
    description: 'Adressierbare Kunden',
    icon: 'bar-chart',
    color: 'purple'
  },
  som: {
    value: 958,
    label: 'SOM (5%)',
    description: 'Realistische Kunden',
    icon: 'check-circle',
    color: 'green'
  },
  revenue: {
    value: '1,4M €',
    label: 'Umsatzpotenzial',
    description: 'bei 1.500€/Jahr',
    icon: 'euro',
    color: 'yellow'
  }
}

export const getKPICards = () => {
  return Object.values(kpiData)
}
