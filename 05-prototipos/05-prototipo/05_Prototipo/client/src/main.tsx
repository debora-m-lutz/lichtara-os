import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">FINCE</h1>
          <p className="text-gray-600">Frequência Inteligente de Navegação Consciente</p>
        </div>
        
        <div className="space-y-4">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Escreva sua pergunta aqui..."
            id="pergunta"
          />
          
          <button
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => {
              const pergunta = (document.getElementById('pergunta') as HTMLTextAreaElement)?.value;
              if (pergunta) {
                console.log('Pergunta enviada:', pergunta);
                // TODO: Implementar integração com API
              }
            }}
          >
            Enviar
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Lichtara OS Prototype v1 - Sistema de Integração Tecnológica Consciente
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);