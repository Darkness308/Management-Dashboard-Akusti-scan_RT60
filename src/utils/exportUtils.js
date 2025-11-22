// Export Utilities - JSON, Markdown, Excel Export
import * as XLSX from 'xlsx'

/**
 * Download file helper
 */
const downloadFile = (filename, content, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Export dashboard data as JSON
 */
export const exportJSON = (data) => {
  const exportData = {
    overview: {
      tam: data.tam || 63841,
      sam: data.sam || 19152,
      som: data.som || 958,
      revenue: data.revenue || 1437000
    },
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    ...data
  }

  const json = JSON.stringify(exportData, null, 2)
  downloadFile('dashboard_export.json', json, 'application/json')
  return true
}

/**
 * Export dashboard data as Markdown
 */
export const exportMarkdown = (data) => {
  let md = '# Management Dashboard Export\n\n'
  md += `**Datum:** ${new Date().toLocaleDateString('de-DE')}\n\n`

  md += '## Marktdaten\n\n'
  md += `- **TAM**: ${data.tam || 63841} Unternehmen\n`
  md += `- **SAM**: ${data.sam || 19152} Unternehmen (30%)\n`
  md += `- **SOM**: ${data.som || 958} Unternehmen (5%)\n`
  md += `- **Umsatzpotenzial**: ${data.revenue || '1,4M'} €\n\n`

  md += '## Module\n\n'
  const modules = [
    'Innovation Mapping',
    'Marktanalyse',
    'Business Strategie',
    'KI-System',
    'Technik & Normen',
    'Vertrieb',
    'Datenintegration',
    'Analytics'
  ]
  modules.forEach(module => {
    md += `- ${module}\n`
  })

  md += '\n## Technische Details\n\n'
  md += '- **Framework**: React 18 + Vite\n'
  md += '- **Styling**: TailwindCSS\n'
  md += '- **Charts**: Chart.js\n'
  md += '- **Data**: SheetJS (XLSX)\n'

  downloadFile('dashboard_export.md', md, 'text/markdown')
  return true
}

/**
 * Export data as Excel
 */
export const exportExcel = (data, filename = 'dashboard_export.xlsx') => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new()

    // Overview sheet
    const overviewData = [
      ['Metrik', 'Wert'],
      ['TAM', data.tam || 63841],
      ['SAM', data.sam || 19152],
      ['SOM', data.som || 958],
      ['Umsatzpotenzial', data.revenue || 1437000]
    ]
    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Übersicht')

    // Market Growth sheet
    if (data.marketGrowth) {
      const wsMarket = XLSX.utils.json_to_sheet(data.marketGrowth)
      XLSX.utils.book_append_sheet(wb, wsMarket, 'Marktwachstum')
    }

    // Target Groups sheet
    if (data.targetGroups) {
      const wsTargets = XLSX.utils.json_to_sheet(data.targetGroups)
      XLSX.utils.book_append_sheet(wb, wsTargets, 'Zielgruppen')
    }

    // Write file
    XLSX.writeFile(wb, filename)
    return true
  } catch (error) {
    console.error('Excel export failed:', error)
    return false
  }
}

/**
 * Export chart as image (PNG)
 */
export const exportChartAsImage = (chartRef, filename = 'chart.png') => {
  if (!chartRef || !chartRef.current) {
    console.error('Chart reference not found')
    return false
  }

  try {
    const canvas = chartRef.current.canvas
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
    return true
  } catch (error) {
    console.error('Chart export failed:', error)
    return false
  }
}

/**
 * Export table data as CSV
 */
export const exportCSV = (data, filename = 'export.csv') => {
  if (!data || !data.headers || !data.rows) {
    console.error('Invalid data format')
    return false
  }

  try {
    let csv = data.headers.join(',') + '\n'
    data.rows.forEach(row => {
      csv += row.join(',') + '\n'
    })

    downloadFile(filename, csv, 'text/csv')
    return true
  } catch (error) {
    console.error('CSV export failed:', error)
    return false
  }
}

/**
 * Copy data to clipboard
 */
export const copyToClipboard = (text) => {
  try {
    navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Clipboard copy failed:', error)
    return false
  }
}

/**
 * Print current view
 */
export const printView = () => {
  window.print()
}

/**
 * Generate shareable link (example)
 */
export const generateShareLink = (data) => {
  const encoded = btoa(JSON.stringify(data))
  return `${window.location.origin}?data=${encoded}`
}

/**
 * Parse shared link data
 */
export const parseShareLink = () => {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('data')
  if (encoded) {
    try {
      return JSON.parse(atob(encoded))
    } catch (error) {
      console.error('Failed to parse shared data:', error)
      return null
    }
  }
  return null
}
