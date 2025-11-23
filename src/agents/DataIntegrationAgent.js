import { BaseAgent } from './BaseAgent'
import { EVENTS } from '@/store/useDashboardStore'
import { parseCSV, parseExcel, saveToStorage, loadFromStorage, clearStorage } from '@utils/dataParser'

/**
 * Data Integration Agent
 * Handles Excel/CSV upload, parsing & data transformation
 */
export class DataIntegrationAgent extends BaseAgent {
  constructor() {
    super('DataIntegrationAgent')
    this.uploadedData = null
  }

  async init() {
    await super.init()

    // Load persisted data
    const stored = loadFromStorage('uploadData')
    if (stored) {
      this.uploadedData = stored
      this.log('Loaded persisted data from storage')
    }
  }

  /**
   * Parse and upload file
   * @param {File} file - File to upload
   * @returns {Promise<Object>} Parsed data
   */
  async uploadFile(file) {
    try {
      this.log(`Uploading file: ${file.name}`)

      let data
      const fileName = file.name.toLowerCase()

      if (fileName.endsWith('.csv')) {
        data = await parseCSV(file)
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        data = await parseExcel(file)
      } else {
        throw new Error('Unsupported file format')
      }

      this.uploadedData = data
      saveToStorage('uploadData', data)

      this.emit(EVENTS.DATA_UPLOADED, {
        fileName: file.name,
        headers: data.headers,
        rowCount: data.rows.length
      })

      return data
    } catch (error) {
      this.error('File upload failed', error)
      throw error
    }
  }

  /**
   * Clear uploaded data
   */
  clearData() {
    this.uploadedData = null
    clearStorage('uploadData')
    this.emit(EVENTS.DATA_DELETED, {})
    this.log('Data cleared')
  }

  /**
   * Get uploaded data
   * @returns {Object|null} Uploaded data
   */
  getData() {
    return this.uploadedData
  }
}

export const dataIntegrationAgent = new DataIntegrationAgent()
export default dataIntegrationAgent
