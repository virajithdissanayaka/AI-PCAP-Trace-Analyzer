import { useState, useRef } from 'react'
import { ButtonSpinner } from './LoadingSpinner'

const FileUpload = ({ onFileSelect, loading = false, accept = '.pcap,.pcapng' }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFileSelection(file)
    }
  }

  const handleFileSelection = (file) => {
    // Validate file type
    const allowedExtensions = ['.pcap', '.pcapng']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedExtensions.includes(fileExtension)) {
      alert('Please select a valid PCAP file (.pcap or .pcapng)')
      return
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (file.size > maxSize) {
      alert('File size too large. Please select a file smaller than 100MB.')
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={loading}
      />

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <ButtonSpinner className="w-8 h-8 text-primary-600" />
            <p className="text-gray-600">Uploading and processing file...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary-100 rounded-full">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload PCAP File
                </h3>
                <p className="text-gray-500">
                  Drag and drop your .pcap or .pcapng file here, or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: .pcap, .pcapng (max 100MB)
                </p>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-700">
                      {formatFileSize(selectedFile.size)} • Ready for upload
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* File requirements */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Supported formats: PCAP, PCAPNG</p>
        <p>• Maximum file size: 100MB</p>
        <p>• Files are processed securely and not stored permanently</p>
      </div>
    </div>
  )
}

export default FileUpload