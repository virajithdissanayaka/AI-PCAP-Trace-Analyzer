import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import { exportToJson } from '../utils/api'
import PacketTable from '../components/PacketTable'
import AIAnalysis from '../components/AIAnalysis'

const ResultsPage = () => {
  const navigate = useNavigate()
  const { uploadData, analysisData, resetState } = useAnalysis()
  const [activeTab, setActiveTab] = useState('packets')

  // Redirect if no analysis data
  useEffect(() => {
    if (!analysisData || !uploadData) {
      navigate('/upload')
    }
  }, [analysisData, uploadData, navigate])

  const handleExportResults = () => {
    if (!analysisData || !uploadData) return

    const exportData = {
      metadata: {
        filename: uploadData.filename,
        exportDate: new Date().toISOString(),
        totalPackets: uploadData.packet_count,
        analysisProtocol: analysisData.protocol
      },
      uploadSummary: uploadData.summary,
      protocolsDetected: uploadData.protocols_detected,
      packets: uploadData.packets,
      analysis: analysisData.analysis,
      technicalAnalysis: analysisData.analysis?.technical_analysis
    }

    exportToJson(exportData, `pcap_analysis_${uploadData.filename?.replace('.pcap', '') || 'results'}`)
  }

  const handleNewAnalysis = () => {
    resetState()
    navigate('/upload')
  }

  if (!analysisData || !uploadData) {
    return null // Will redirect to upload
  }

  const tabs = [
    { id: 'packets', label: 'Packet Analysis', icon: '📦' },
    { id: 'insights', label: 'AI Insights', icon: '🧠' }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
            <p className="text-gray-600 mt-1">
              Complete analysis of <span className="font-medium">{uploadData.filename}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportResults}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export JSON</span>
            </button>
            
            <button
              onClick={handleNewAnalysis}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-blue-600">
              {analysisData.packet_count || uploadData.packet_count}
            </div>
            <div className="text-sm text-gray-600">Packets Analyzed</div>
          </div>
          
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-green-600">
              {analysisData.protocol || 'AUTO'}
            </div>
            <div className="text-sm text-gray-600">Protocol</div>
          </div>
          
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-purple-600">
              {uploadData.protocols_detected?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Protocols Found</div>
          </div>
          
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-orange-600">
              {analysisData.analysis?.ai_insights?.errors_found?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Errors Detected</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'packets' && (
          <div>
            <PacketTable packets={uploadData.packets || []} itemsPerPage={50} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            <AIAnalysis analysisData={analysisData} />
          </div>
        )}
      </div>

      {/* Analysis Summary Footer */}
      <div className="mt-12 card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Complete</h3>
            <p className="text-gray-600 mb-4">
              Your PCAP file has been successfully analyzed. The results include detailed packet information,
              protocol analysis, and AI-powered insights to help you understand your network traffic.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Packets parsed and analyzed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Protocol compliance checked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">AI insights generated</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          onClick={() => navigate('/analysis')}
          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          ← Back to Analysis Settings
        </button>
        
        <span className="text-gray-300">|</span>
        
        <button
          onClick={handleNewAnalysis}
          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          Start New Analysis →
        </button>
      </div>
    </div>
  )
}

export default ResultsPage