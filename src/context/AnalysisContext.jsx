import React, { createContext, useContext, useReducer } from 'react'

const AnalysisContext = createContext()

const initialState = {
  uploadData: null,
  analysisData: null,
  loading: false,
  error: null,
  currentStep: 'upload' // upload, analysis, results
}

function analysisReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_UPLOAD_DATA':
      return { 
        ...state, 
        uploadData: action.payload, 
        loading: false, 
        error: null,
        currentStep: 'analysis' 
      }
    case 'SET_ANALYSIS_DATA':
      return { 
        ...state, 
        analysisData: action.payload, 
        loading: false, 
        error: null,
        currentStep: 'results' 
      }
    case 'RESET_STATE':
      return initialState
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload }
    default:
      return state
  }
}

export function AnalysisProvider({ children }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState)

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setUploadData: (data) => dispatch({ type: 'SET_UPLOAD_DATA', payload: data }),
    setAnalysisData: (data) => dispatch({ type: 'SET_ANALYSIS_DATA', payload: data }),
    resetState: () => dispatch({ type: 'RESET_STATE' }),
    setCurrentStep: (step) => dispatch({ type: 'SET_CURRENT_STEP', payload: step })
  }

  const value = {
    ...state,
    ...actions
  }

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}