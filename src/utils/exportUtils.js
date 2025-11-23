// Export Utilities - JSON, Markdown, Excel, PDF, Word, TXT Export
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow } from 'docx'
import html2canvas from 'html2canvas'

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

/**
 * Export dashboard data as PDF
 */
export const exportPDF = async (data, options = {}) => {
  try {
    const doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Title
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text('Management Dashboard Export', 20, 20)

    // Date
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 20, 30)

    // Overview Section
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Marktdaten Übersicht', 20, 45)

    const overviewData = [
      ['Metrik', 'Wert'],
      ['TAM (Total Addressable Market)', `${data.tam || 63841} Unternehmen`],
      ['SAM (Serviceable Available Market)', `${data.sam || 19152} Unternehmen`],
      ['SOM (Serviceable Obtainable Market)', `${data.som || 958} Unternehmen`],
      ['Umsatzpotenzial (Jahr 1)', `${(data.revenue || 1437000).toLocaleString('de-DE')} €`]
    ]

    doc.autoTable({
      head: [overviewData[0]],
      body: overviewData.slice(1),
      startY: 50,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10
      }
    })

    // Modules Section
    let finalY = doc.lastAutoTable.finalY + 15

    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Implementierte Module', 20, finalY)

    const modulesData = [
      ['Modul', 'Beschreibung'],
      ['Innovation', 'Cross-Sector Synergien & Innovation Mapping'],
      ['Markt', 'TAM/SAM/SOM Analyse & Marktwachstum'],
      ['Business', 'Pricing Strategy & Wettbewerbsanalyse'],
      ['KI-System', '20 KI-Techniken & Workflows'],
      ['Technik', 'Hardware/Software & DIN/ISO/VDI Normen'],
      ['Vertrieb', 'Zielgruppen & Vertriebskanäle'],
      ['Daten', 'Import/Export & Datenvisualisierung'],
      ['Analytics', 'Performance Metriken & Usage Statistics']
    ]

    doc.autoTable({
      head: [modulesData[0]],
      body: modulesData.slice(1),
      startY: finalY + 5,
      theme: 'grid',
      headStyles: {
        fillColor: [118, 75, 162],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9
      }
    })

    // Additional data if provided
    if (data.customData) {
      finalY = doc.lastAutoTable.finalY + 15

      if (finalY > 270) {
        doc.addPage()
        finalY = 20
      }

      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Zusätzliche Daten', 20, finalY)

      if (Array.isArray(data.customData)) {
        doc.autoTable({
          head: [data.customData[0]],
          body: data.customData.slice(1),
          startY: finalY + 5,
          theme: 'grid',
          headStyles: {
            fillColor: [102, 126, 234],
            textColor: 255
          }
        })
      }
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont(undefined, 'normal')
      doc.text(
        `Seite ${i} von ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }

    // Save PDF
    doc.save(options.filename || 'dashboard_export.pdf')
    return true
  } catch (error) {
    console.error('PDF export failed:', error)
    return false
  }
}

/**
 * Export dashboard data as Word (.docx)
 */
export const exportWord = async (data, filename = 'dashboard_export.docx') => {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: 'Management Dashboard Export',
              heading: HeadingLevel.HEADING_1,
              spacing: {
                after: 200
              }
            }),

            // Date
            new Paragraph({
              children: [
                new TextRun({
                  text: `Datum: ${new Date().toLocaleDateString('de-DE')}`,
                  italics: true
                })
              ],
              spacing: {
                after: 400
              }
            }),

            // Overview Section
            new Paragraph({
              text: 'Marktdaten Übersicht',
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 200,
                after: 200
              }
            }),

            // Overview Table
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Metrik', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Wert', bold: true })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('TAM (Total Addressable Market)')] }),
                    new TableCell({ children: [new Paragraph(`${data.tam || 63841} Unternehmen`)] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('SAM (Serviceable Available Market)')] }),
                    new TableCell({ children: [new Paragraph(`${data.sam || 19152} Unternehmen`)] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('SOM (Serviceable Obtainable Market)')] }),
                    new TableCell({ children: [new Paragraph(`${data.som || 958} Unternehmen`)] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Umsatzpotenzial (Jahr 1)')] }),
                    new TableCell({ children: [new Paragraph(`${(data.revenue || 1437000).toLocaleString('de-DE')} €`)] })
                  ]
                })
              ]
            }),

            // Modules Section
            new Paragraph({
              text: 'Implementierte Module',
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200
              }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: '• Innovation: ', bold: true }),
                new TextRun('Cross-Sector Synergien & Innovation Mapping')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Markt: ', bold: true }),
                new TextRun('TAM/SAM/SOM Analyse & Marktwachstum')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Business: ', bold: true }),
                new TextRun('Pricing Strategy & Wettbewerbsanalyse')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• KI-System: ', bold: true }),
                new TextRun('20 KI-Techniken & Workflows')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Technik: ', bold: true }),
                new TextRun('Hardware/Software & DIN/ISO/VDI Normen')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Vertrieb: ', bold: true }),
                new TextRun('Zielgruppen & Vertriebskanäle')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Daten: ', bold: true }),
                new TextRun('Import/Export & Datenvisualisierung')
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Analytics: ', bold: true }),
                new TextRun('Performance Metriken & Usage Statistics')
              ]
            })
          ]
        }
      ]
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 100)

    return true
  } catch (error) {
    console.error('Word export failed:', error)
    return false
  }
}

/**
 * Export dashboard data as TXT
 */
export const exportTXT = (data, filename = 'dashboard_export.txt') => {
  try {
    let txt = 'MANAGEMENT DASHBOARD EXPORT\n'
    txt += '='.repeat(60) + '\n\n'
    txt += `Datum: ${new Date().toLocaleDateString('de-DE')}\n\n`

    txt += 'MARKTDATEN ÜBERSICHT\n'
    txt += '-'.repeat(60) + '\n'
    txt += `TAM (Total Addressable Market):      ${data.tam || 63841} Unternehmen\n`
    txt += `SAM (Serviceable Available Market):  ${data.sam || 19152} Unternehmen\n`
    txt += `SOM (Serviceable Obtainable Market): ${data.som || 958} Unternehmen\n`
    txt += `Umsatzpotenzial (Jahr 1):            ${(data.revenue || 1437000).toLocaleString('de-DE')} €\n\n`

    txt += 'IMPLEMENTIERTE MODULE\n'
    txt += '-'.repeat(60) + '\n'
    txt += '1. Innovation:\n'
    txt += '   Cross-Sector Synergien & Innovation Mapping\n\n'
    txt += '2. Markt:\n'
    txt += '   TAM/SAM/SOM Analyse & Marktwachstum\n\n'
    txt += '3. Business:\n'
    txt += '   Pricing Strategy & Wettbewerbsanalyse\n\n'
    txt += '4. KI-System:\n'
    txt += '   20 KI-Techniken & Workflows\n\n'
    txt += '5. Technik:\n'
    txt += '   Hardware/Software & DIN/ISO/VDI Normen\n\n'
    txt += '6. Vertrieb:\n'
    txt += '   Zielgruppen & Vertriebskanäle\n\n'
    txt += '7. Daten:\n'
    txt += '   Import/Export & Datenvisualisierung\n\n'
    txt += '8. Analytics:\n'
    txt += '   Performance Metriken & Usage Statistics\n\n'

    txt += '='.repeat(60) + '\n'
    txt += 'Generiert mit Management Dashboard v1.0.0\n'

    downloadFile(filename, txt, 'text/plain')
    return true
  } catch (error) {
    console.error('TXT export failed:', error)
    return false
  }
}

/**
 * Export current view as PDF screenshot
 */
export const exportViewAsPDF = async (elementId, filename = 'dashboard_view.pdf') => {
  try {
    const element = document.getElementById(elementId) || document.body

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(filename)

    return true
  } catch (error) {
    console.error('PDF screenshot export failed:', error)
    return false
  }
}
