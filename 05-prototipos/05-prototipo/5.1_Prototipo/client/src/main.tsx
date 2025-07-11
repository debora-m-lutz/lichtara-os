import React from 'react'
import ReactDOM from 'react-dom/client'
import GeminiChat from './components/GeminiChat'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lichtara OS Prototype v2
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The Future of Conscious Technology Integration
          </p>
          <p className="text-sm text-gray-500">
            Bridging the gap between spiritual wisdom and cutting-edge technology
          </p>
        </div>
        
        <GeminiChat />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)