import { useState } from 'react'

const AIAnalysis = ({ analysisData }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['summary']))

  if (!analysisData || !analysisData.analysis) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
        <p className="text-gray-500">Run analysis to see AI insights.</p>
      </div>
    )
  }

  const { ai_insights, technical_analysis, analysis_timestamp, packets_analyzed } = analysisData.analysis

  const toggleSection = (sectionName) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName)
    } else {
      newExpanded.add(sectionName)
    }
    setExpandedSections(newExpanded)
  }

  const isSectionExpanded = (sectionName) => expandedSections.has(sectionName)

  // Analysis sections configuration
  const sections = [
    {
      key: 'summary',
      title: 'Summary',
      icon: '📊',
      content: ai_insights?.summary || 'No summary available',
      color: 'border-blue-200 bg-blue-50'
    },
    {
      key: 'protocol_compliance',
      title: 'Protocol Compliance',
      icon: '✅',
      content: ai_insights?.protocol_compliance || 'No protocol compliance analysis available',
      color: 'border-green-200 bg-green-50'
    },
    {
      key: 'performance',
      title: 'Performance Analysis',
      icon: '⚡',
      content: ai_insights?.performance_analysis || 'No performance analysis available',
      color: 'border-yellow-200 bg-yellow-50'
    },
    {
      key: 'errors',
      title: 'Errors Found',
      icon: '❌',
      content: ai_insights?.errors_found && ai_insights.errors_found.length > 0 
        ? ai_insights.errors_found.join('\n') 
        : 'No errors detected',
      color: 'border-red-200 bg-red-50',
      isEmpty: !ai_insights?.errors_found || ai_insights.errors_found.length === 0
    },
    {
      key: 'security',
      title: 'Security Concerns',
      icon: '🔒',
      content: ai_insights?.security_concerns || 'No security concerns identified',
      color: 'border-purple-200 bg-purple-50',
      isEmpty: !ai_insights?.security_concerns
    },
    {
      key: 'recommendations',
      title: 'Recommendations',
      icon: '💡',
      content: ai_insights?.recommendations && ai_insights.recommendations.length > 0
        ? ai_insights.recommendations.join('\n')
        : 'No specific recommendations available',
      color: 'border-indigo-200 bg-indigo-50',
      isEmpty: !ai_insights?.recommendations || ai_insights.recommendations.length === 0
    }
  ]

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch (error) {
      return timestamp
    }
  }

  const renderTechnicalAnalysis = () => {
    if (!technical_analysis) return null

    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Size Analysis */}
          {technical_analysis.size_analysis && (
            <div className="card">
              <h4 className="font-medium text-gray-900 mb-3">Size Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bytes:</span>
                  <span className="font-medium">{technical_analysis.size_analysis.total_bytes?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Size:</span>
                  <span className="font-medium">{technical_analysis.size_analysis.average_size} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Size:</span>
                  <span className="font-medium">{technical_analysis.size_analysis.min_size} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Size:</span>
                  <span className="font-medium">{technical_analysis.size_analysis.max_size} bytes</span>
                </div>
              </div>

              {/* Size Distribution */}
              {technical_analysis.size_analysis.size_distribution && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Size Distribution</h5>
                  <div className="space-y-1">
                    {Object.entries(technical_analysis.size_analysis.size_distribution).map(([range, count]) => (
                      <div key={range} className="flex justify-between text-xs">
                        <span className="text-gray-600">{range} bytes:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Protocol Distribution */}
          {technical_analysis.packet_distribution?.protocol_counts && (
            <div className="card">
              <h4 className="font-medium text-gray-900 mb-3">Protocol Distribution</h4>
              <div className="space-y-2">
                {Object.entries(technical_analysis.packet_distribution.protocol_counts).map(([protocol, count]) => (
                  <div key={protocol} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{protocol}:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{width: `${(count / packets_analyzed) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Port Usage */}
          {technical_analysis.packet_distribution?.port_usage && (
            <div className="card md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Port Usage</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(technical_analysis.packet_distribution.port_usage).map(([port, count]) => (
                  <div key={port} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary-600">{port}</div>
                    <div className="text-xs text-gray-600">Port</div>
                    <div className="text-sm font-medium">{count} packets</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">AI Analysis Results</h2>
          <div className="text-sm text-gray-500">
            {formatTimestamp(analysis_timestamp)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{packets_analyzed}</div>
            <div className="text-sm text-primary-700">Packets Analyzed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analysisData.protocol}</div>
            <div className="text-sm text-green-700">Protocol Used</div>
          </div>
        </div>
      </div>

      {/* AI Insights Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        
        {sections.map((section) => (
          <div key={section.key} className={`border-l-4 ${section.color} rounded-lg overflow-hidden`}>
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full px-4 py-3 text-left hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{section.icon}</span>
                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                  {section.isEmpty && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Empty
                    </span>
                  )}
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${isSectionExpanded(section.key) ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {isSectionExpanded(section.key) && (
              <div className="px-4 pb-4">
                <div className="pl-8 prose prose-sm max-w-none">
                  {section.content.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 text-gray-700 leading-relaxed">
                      {line.trim() || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Technical Analysis */}
      {renderTechnicalAnalysis()}

      {/* Analysis Metadata */}
      {analysisData.metadata && (
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Metadata</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Protocol:</span>
              <span className="ml-2 font-medium">{analysisData.metadata.protocol}</span>
            </div>
            <div>
              <span className="text-gray-600">Analysis Type:</span>
              <span className="ml-2 font-medium">{analysisData.metadata.analysisType}</span>
            </div>
            {analysisData.metadata.originalData && (
              <>
                <div>
                  <span className="text-gray-600">Original Filename:</span>
                  <span className="ml-2 font-medium">{analysisData.metadata.originalData.filename}</span>
                </div>
                <div>
                  <span className="text-gray-600">Success:</span>
                  <span className={`ml-2 font-medium ${analysisData.success ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.success ? 'Yes' : 'No'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAnalysis