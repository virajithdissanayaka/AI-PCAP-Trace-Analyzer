import { Link, useLocation } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'

const Navbar = () => {
  const location = useLocation()
  const { currentStep, resetState } = useAnalysis()

  const navItems = [
    { path: '/upload', label: 'Upload', step: 'upload' },
    { path: '/analysis', label: 'Analysis', step: 'analysis' },
    { path: '/results', label: 'Results', step: 'results' }
  ]

  const isStepAccessible = (step) => {
    const stepOrder = ['upload', 'analysis', 'results']
    const currentStepIndex = stepOrder.indexOf(currentStep)
    const targetStepIndex = stepOrder.indexOf(step)
    return targetStepIndex <= currentStepIndex
  }

  const isCurrentStep = (path) => location.pathname === path

  const handleNewAnalysis = () => {
    resetState()
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/upload" 
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              onClick={handleNewAnalysis}
            >
              PCAP Analyzer
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <span className="hidden md:block text-sm text-gray-500">
              Network Traffic Analysis Tool
            </span>
          </div>

          {/* Navigation Steps */}
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const accessible = isStepAccessible(item.step)
              const current = isCurrentStep(item.path)
              const completed = currentStep === 'results' && item.step !== 'results'

              return (
                <div key={item.path} className="flex items-center">
                  {accessible ? (
                    <Link
                      to={item.path}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                        ${current 
                          ? 'bg-primary-600 text-white shadow-lg' 
                          : completed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <span className={`
                        flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                        ${current 
                          ? 'bg-primary-700 text-white' 
                          : completed
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-400 text-white'
                        }
                      `}>
                        {completed ? '✓' : index + 1}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div className="px-4 py-2 rounded-lg font-medium text-gray-400 cursor-not-allowed flex items-center space-x-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-gray-300 text-gray-500">
                        {index + 1}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  )}
                  
                  {index < navItems.length - 1 && (
                    <div className="mx-2 text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* New Analysis Button */}
          <button
            onClick={handleNewAnalysis}
            className="btn-secondary text-sm"
          >
            New Analysis
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar