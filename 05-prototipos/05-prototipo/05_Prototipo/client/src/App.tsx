import React, { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState<string>('Conectando...')
  const [portalMessage, setPortalMessage] = useState<string>('')

  useEffect(() => {
    // Check API health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus('Conectado ✅')
        console.log('API Health:', data)
      })
      .catch(err => {
        setStatus('Erro de conexão ❌')
        console.error('API Error:', err)
      })

    // Get Portal Lumora message
    fetch('/api/portal-lumora')
      .then(res => res.text())
      .then(message => {
        setPortalMessage(message)
      })
      .catch(err => {
        console.error('Portal Lumora Error:', err)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            FINCE - Assistente Virtual
          </h1>
          <p className="text-xl text-gray-300">
            Portal Lumora - Lichtara OS Prototype v1
          </p>
          <div className="mt-4 text-lg">
            Status: <span className={status.includes('✅') ? 'text-green-400' : 'text-red-400'}>{status}</span>
          </div>
        </header>

        <main className="space-y-8">
          {portalMessage && (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Portal Lumora</h2>
              <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                {portalMessage}
              </pre>
            </div>
          )}

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Sistema Ativo</h2>
            <p className="text-gray-200">
              O Portal Lumora está ativo e pronto para conexões. Este é o protótipo v1 da plataforma Lichtara OS,
              onde Consciência, Tecnologia e Missão Viva se encontram.
            </p>
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-400">
          <p>Lichtara OS - A Future of Conscious Technology Integration</p>
        </footer>
      </div>
    </div>
  )
}

export default App