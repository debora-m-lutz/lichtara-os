import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { FileFinder } from './components/FileFinder'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lichtara OS Prototype v2
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Conscious Technology Integration Platform
          </p>
          <p className="text-sm text-gray-500">
            File Explorer - Implementing "find . -type f" functionality
          </p>
        </div>
        
        {/* File Finder Component */}
        <FileFinder />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)