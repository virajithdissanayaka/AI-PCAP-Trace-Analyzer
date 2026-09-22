import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import { analyzePackets } from '../utils/api'
import { ButtonSpinner } from '../components/LoadingSpinner'

const AnalysisPage = () => {
  const navigate = useNavigate()
  const { uploadData, setAnalysisData, setError, setLoading, loading, error } = useAnalysis()
  const [selectedProtocol, setSelectedProtocol] = useState('AUTO')
  const [analysisType, setAnalysisType] = useState('comprehensive')

  // Available protocols for analysis
  const protocols = [
    { value: 'AUTO', label: 'Auto Detect', description: 'Automatically detect the best protocol' },
    { value: 'GSM SMS', label: 'GSM SMS', description: 'Global System for Mobile SMS messages' },
    { value: 'SMPP', label: 'SMPP', description: 'Short Message Peer-to-Peer Protocol' },
    { value: 'SCTP', label: 'SCTP', description: 'Stream Control Transmission Protocol' },
    { value: 'TCP', label: 'TCP', description: 'Transmission Control Protocol' },
    { value: 'UDP', label: 'UDP', description: 'User Datagram Protocol' }
  ]

  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive Analysis', description: 'Full analysis including AI insights' },
    { value: 'basic', label: 'Basic Analysis', description: 'Quick packet parsing and summary' },
    { value: 'security', label: 'Security Focus', description: 'Emphasis on security concerns and vulnerabilities' }
  ]

  // Redirect if no upload data
  useEffect(() => {
    if (!uploadData) {
      navigate('/upload')
    }
  }, [uploadData, navigate])

  const handleAnalysis = async () => {
    if (!uploadData || !uploadData.packets) {
      setError('No packet data available for analysis')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload = {
        packets: uploadData.packets,
        protocol: selectedProtocol,
        analysisType: analysisType,
        metadata: {
          filename: uploadData.filename,
          originalPacketCount: uploadData.packet_count
        }
      }

      console.log('Starting analysis with payload:', payload)

      const result = await analyzePackets(payload)

      if (result.success) {
        console.log('Analysis successful:', result)
        setAnalysisData(result)
        navigate('/results')
      } else {
        throw new Error(result.message || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error.response?.data?.message || error.message || 'Failed to analyze packets')
    }
  }

  if (!uploadData) {
    return null // Will redirect to upload
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Configure Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Choose your analysis settings to get the most relevant insights from your PCAP data.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Summary */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded File Summary</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{uploadData.packet_count}</div>
            <div className="text-sm text-blue-700">Packets Found</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {uploadData.protocols_detected?.length || 0}
            </div>
            <div className="text-sm text-green-700">Protocols Detected</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(uploadData.summary?.total_size_bytes / 1024) || 0}KB
            </div>
            <div className="text-sm text-purple-700">Total Size</div>
          </div>
        </div>

        {/* Detected Protocols */}
        {uploadData.protocols_detected && uploadData.protocols_detected.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Detected Protocols</h3>
            <div className="flex flex-wrap gap-2">
              {uploadData.protocols_detected.map((protocol) => (
                <span 
                  key={protocol}
                  className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
                >
                  {protocol}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {uploadData.summary && (
          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Average Packet Size:</span>
              <span className="ml-2 font-medium">{uploadData.summary.average_packet_size} bytes</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{uploadData.summary.duration_seconds}s</span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Configuration */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        {/* Protocol Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Protocol Selection</h2>
          <p className="text-gray-600 mb-6">
            Choose the protocol to focus the analysis on, or select AUTO to let the system decide.
          </p>
          
          <div className="space-y-3">
            {protocols.map((protocol) => (
              <label key={protocol.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="protocol"
                  value={protocol.value}
                  checked={selectedProtocol === protocol.value}
                  onChange={(e) => setSelectedProtocol(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  disabled={loading}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {protocol.label}
                    {protocol.value === 'AUTO' && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{protocol.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Analysis Type */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Type</h2>
          <p className="text-gray-600 mb-6">
            Select the depth and focus of the analysis to be performed.
          </p>
          
          <div className="space-y-3">
            {analysisTypes.map((type) => (
              <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="analysisType"
                  value={type.value}
                  checked={analysisType === type.value}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  disabled={loading}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {type.label}
                    {type.value === 'comprehensive' && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Preview */}
      <div className="card mb-8 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Preview</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">What will be analyzed:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Packet structure and metadata</li>
              <li>• Protocol compliance and errors</li>
              <li>• Network performance metrics</li>
              <li>• Security vulnerabilities</li>
              {selectedProtocol === 'GSM SMS' && (
                <li>• SMS content decoding and analysis</li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">You will receive:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Detailed packet table with pagination</li>
              <li>• AI-powered insights and recommendations</li>
              <li>• Protocol-specific analysis</li>
              <li>• Exportable JSON results</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/upload')}
          className="btn-secondary"
          disabled={loading}
        >
          ← Back to Upload
        </button>

        <button
          onClick={handleAnalysis}
          disabled={loading || !uploadData}
          className="btn-primary flex items-center space-x-2"
        >
          {loading && <ButtonSpinner />}
          <span>{loading ? 'Analyzing...' : 'Start Analysis'}</span>
        </button>
      </div>

      {/* Progress Indicator */}
      {loading && (
        <div className="mt-6 card bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Analysis in Progress</h4>
              <p className="text-sm text-blue-700">
                Processing {uploadData.packet_count} packets with {selectedProtocol} protocol analysis...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisPage