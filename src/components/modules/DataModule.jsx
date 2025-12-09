import { useState, useEffect } from 'react'
import { FolderOpen } from 'lucide-react'
import {
  parseCSV,
  parseExcel,
  findNumericColumns,
  findLabelColumn,
  saveToStorage,
  loadFromStorage,
  clearStorage
} from '@utils/dataParser'
import BarChart from '../charts/BarChart'

export default function DataModule() {
  const [uploadedData, setUploadedData] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage('uploadData')
    if (stored) {
      setUploadedData(stored)
      setStatusMessage('Gespeicherte Daten geladen')
    }
  }, [])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    setStatusMessage('Datei wird verarbeitet...')

    try {
      let data
      const fileName = file.name.toLowerCase()

      if (fileName.endsWith('.csv')) {
        data = await parseCSV(file)
        setStatusMessage(`✅ CSV-Datei "${file.name}" erfolgreich eingelesen`)
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        data = await parseExcel(file)
        setStatusMessage(`✅ Excel-Datei "${file.name}" erfolgreich eingelesen`)
      } else {
        throw new Error('Dateiformat nicht unterstützt. Bitte CSV oder Excel hochladen.')
      }

      setUploadedData(data)
      saveToStorage('uploadData', data)
    } catch (error) {
      setStatusMessage(`❌ Fehler: ${error.message}`)
      console.error('File upload error:', error)
    } finally {
      setIsLoading(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleClearData = () => {
    if (window.confirm('Möchten Sie wirklich alle hochgeladenen Daten löschen?')) {
      clearStorage('uploadData')
      setUploadedData(null)
      setStatusMessage('Daten wurden gelöscht')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Create a synthetic event
      const syntheticEvent = {
        target: { files: [files[0]] }
      }
      await handleFileUpload(syntheticEvent)
    }
  }

  // Prepare chart data if we have uploaded data
  const getChartData = () => {
    if (!uploadedData) return null

    const numericCols = findNumericColumns(uploadedData)
    const labelCol = findLabelColumn(uploadedData)

    if (numericCols.length === 0) return null

    const labels = uploadedData.rows.map(row => row[labelCol] || `Row ${uploadedData.rows.indexOf(row) + 1}`)
    const datasets = numericCols.slice(0, 2).map((colIdx, i) => ({
      label: uploadedData.headers[colIdx],
      data: uploadedData.rows.map(row => parseFloat(row[colIdx]) || 0),
      backgroundColor: i === 0 ? '#667eea' : '#764ba2'
    }))

    return { labels, datasets }
  }

  const chartData = getChartData()

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header">Datenintegration & Analyse</h2>

      {/* File Upload */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Datei-Upload</h3>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            id="fileInput"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <FolderOpen className="w-24 h-24 mx-auto mb-4 text-purple-600" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {isLoading ? 'Wird verarbeitet...' : 'Datei hochladen oder hierher ziehen'}
            </p>
            <p className="text-sm text-gray-500 mb-4">Excel (.xlsx, .xls) oder CSV-Dateien</p>
            <button
              onClick={() => document.getElementById('fileInput').click()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Verarbeite...' : 'Datei auswählen'}
            </button>
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            disabled={!uploadedData}
          >
            🗑️ Daten löschen
          </button>
        </div>

        {statusMessage && (
          <p className={`text-sm mt-4 ${statusMessage.startsWith('✅') ? 'text-green-600' : statusMessage.startsWith('❌') ? 'text-red-600' : 'text-gray-600'}`}>
            {statusMessage}
          </p>
        )}
      </div>

      {/* Uploaded Data Table */}
      {uploadedData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Hochgeladene Daten</h3>
          <p className="text-sm text-gray-600 mb-4">
            {uploadedData.rows.length} Zeilen × {uploadedData.headers.length} Spalten
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="table-header">
                <tr>
                  {uploadedData.headers.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uploadedData.rows.slice(0, 10).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {uploadedData.rows.length > 10 && (
            <p className="text-sm text-gray-500 mt-4">
              ... und {uploadedData.rows.length - 10} weitere Zeilen
            </p>
          )}
        </div>
      )}

      {/* Data Visualization */}
      {chartData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Daten-Visualisierung</h3>
          <BarChart
            labels={chartData.labels}
            datasets={chartData.datasets}
          />
        </div>
      )}

      {/* Upload Instructions */}
      {!uploadedData && (
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3 text-blue-900">💡 Anleitung</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Unterstützte Formate: Excel (.xlsx, .xls) und CSV</li>
            <li>• Die erste Zeile sollte Spaltenüberschriften enthalten</li>
            <li>• Numerische Spalten werden automatisch für Visualisierungen erkannt</li>
            <li>• Daten werden im Browser gespeichert (LocalStorage)</li>
            <li>• Maximale Dateigröße: Abhängig vom Browser (üblicherweise ~5-10MB)</li>
          </ul>
        </div>
      )}
    </section>
  )
}
