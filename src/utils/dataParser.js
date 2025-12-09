// Data Parser - Excel/CSV Upload & Parsing
import ExcelJS from 'exceljs'

/**
 * Parse CSV file
 * @param {File} file - CSV file to parse
 * @returns {Promise<{headers: Array, rows: Array}>}
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target.result
        const lines = text.trim().split(/\r?\n/)
        const headers = lines[0].split(',').map(h => h.trim())
        const rows = lines.slice(1).map(line => line.split(',').map(c => c.trim()))

        resolve({ headers, rows })
      } catch (error) {
        reject(new Error('CSV parsing failed: ' + error.message))
      }
    }

    reader.onerror = () => {
      reject(new Error('File reading failed'))
    }

    reader.readAsText(file)
  })
}

/**
 * Parse Excel file (XLSX, XLS)
 * @param {File} file - Excel file to parse
 * @returns {Promise<{headers: Array, rows: Array}>}
 */
export const parseExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    
    // Get first worksheet
    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
      throw new Error('No worksheet found in Excel file')
    }
    
    const rows = []
    worksheet.eachRow((row, rowNumber) => {
      rows.push(row.values.slice(1)) // Skip the first undefined element
    })
    
    if (rows.length === 0) {
      throw new Error('Excel file is empty')
    }
    
    const headers = rows[0]
    const dataRows = rows.slice(1)
    
    return { headers, rows: dataRows }
  } catch (error) {
    throw new Error('Excel parsing failed: ' + error.message)
  }
}

/**
 * Validate data structure
 * @param {Object} data - Data with headers and rows
 * @returns {boolean}
 */
export const validateData = (data) => {
  if (!data || !data.headers || !data.rows) return false
  if (!Array.isArray(data.headers) || !Array.isArray(data.rows)) return false
  if (data.headers.length === 0) return false
  return true
}

/**
 * Transform data to specific schema
 * @param {Object} data - Raw data
 * @param {Object} schema - Target schema
 * @returns {Object}
 */
export const transformData = (data, schema) => {
  // Simple transformation logic
  return data.rows.map(row => {
    const obj = {}
    data.headers.forEach((header, index) => {
      const key = schema[header] || header
      obj[key] = row[index]
    })
    return obj
  })
}

/**
 * Detect column types (numeric, string, date)
 * @param {Array} rows - Data rows
 * @param {number} colIndex - Column index
 * @returns {string} - 'number', 'string', 'date'
 */
export const detectColumnType = (rows, colIndex) => {
  const sample = rows.slice(0, Math.min(10, rows.length))
    .map(row => row[colIndex])
    .filter(val => val !== undefined && val !== null && val !== '')

  if (sample.length === 0) return 'string'

  // Check if numeric
  const isNumeric = sample.every(val => !isNaN(parseFloat(val)))
  if (isNumeric) return 'number'

  // Check if date (simple check)
  const isDate = sample.every(val => !isNaN(Date.parse(val)))
  if (isDate) return 'date'

  return 'string'
}

/**
 * Find numeric columns
 * @param {Object} data - Data with headers and rows
 * @returns {Array<number>} - Indices of numeric columns
 */
export const findNumericColumns = (data) => {
  const numericCols = []
  for (let i = 0; i < data.headers.length; i++) {
    if (detectColumnType(data.rows, i) === 'number') {
      numericCols.push(i)
    }
  }
  return numericCols
}

/**
 * Find label column (non-numeric, non-empty)
 * @param {Object} data - Data with headers and rows
 * @returns {number} - Index of label column
 */
export const findLabelColumn = (data) => {
  for (let i = 0; i < data.headers.length; i++) {
    const type = detectColumnType(data.rows, i)
    const allFilled = data.rows.every(row => row[i] !== undefined && row[i] !== '')
    if (type === 'string' && allFilled) {
      return i
    }
  }
  return 0 // Default to first column
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {Object} data - Data to save
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Storage save failed:', error)
    return false
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {Object|null}
 */
export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Storage load failed:', error)
    return null
  }
}

/**
 * Clear data from localStorage
 * @param {string} key - Storage key
 */
export const clearStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Storage clear failed:', error)
    return false
  }
}
