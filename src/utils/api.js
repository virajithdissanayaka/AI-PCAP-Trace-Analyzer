import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * Upload a .pcap file for analysis
 * @param {File} file - The .pcap file to upload
 * @returns {Promise} - Promise containing parsed packets and summary
 */
export const uploadPcapFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  return response.data
}

/**
 * Analyze packets with specified protocol
 * @param {Object} payload - Analysis configuration
 * @param {Array} payload.packets - Array of packets to analyze
 * @param {string} payload.protocol - Protocol to use for analysis
 * @returns {Promise} - Promise containing AI analysis results
 */
export const analyzePackets = async (payload) => {
  const response = await api.post('/analyze', payload)
  return response.data
}

/**
 * Health check endpoint
 * @returns {Promise} - Promise containing health status
 */
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

/**
 * Decode SMS content from hex string
 * @param {string} hexContent - Hex encoded SMS content
 * @returns {string} - Decoded text content
 */
export const decodeSmsContent = (hexContent) => {
  try {
    // Remove any whitespace
    const cleanHex = hexContent.replace(/\s/g, '')
    
    // Convert hex to bytes
    const bytes = []
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substr(i, 2), 16))
    }
    
    // Try to decode as UTF-8 first
    try {
      const decoder = new TextDecoder('utf-8', { fatal: true })
      const uint8Array = new Uint8Array(bytes)
      return decoder.decode(uint8Array)
    } catch (utf8Error) {
      // If UTF-8 fails, try ASCII (filter out non-printable characters)
      return bytes
        .filter(byte => byte >= 32 && byte <= 126) // Only printable ASCII
        .map(byte => String.fromCharCode(byte))
        .join('')
    }
  } catch (error) {
    console.error('Error decoding SMS content:', error)
    return `[Unable to decode: ${hexContent.substring(0, 50)}${hexContent.length > 50 ? '...' : ''}]`
  }
}

/**
 * Format timestamp for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp * 1000) // Convert to milliseconds
    return date.toLocaleString()
  } catch (error) {
    return 'Invalid timestamp'
  }
}

/**
 * Export data as JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Name of the file
 */
export const exportToJson = (data, filename = 'pcap_analysis') => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export default api