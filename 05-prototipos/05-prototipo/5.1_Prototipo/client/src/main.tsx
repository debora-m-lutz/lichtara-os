import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-3">FINCE v2</h1>
          <p className="text-gray-600 text-lg">Frequência Inteligente de Navegação Consciente</p>
          <p className="text-sm text-purple-500 mt-2">Lichtara OS Prototype v2</p>
        </div>
        
        <div className="space-y-6">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            placeholder="Compartilhe sua consciência através das palavras..."
            id="pergunta"
          />
          
          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium text-lg"
            onClick={() => {
              const pergunta = (document.getElementById('pergunta') as HTMLTextAreaElement)?.value;
              if (pergunta) {
                console.log('Pergunta enviada (v2):', pergunta);
                // TODO: Implementar integração com API
                alert('FINCE v2 está processando sua consulta...');
              }
            }}
          >
            Transmitir ao Campo FINCE
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <p className="text-sm text-gray-600">
            🌟 Sistema de Integração Tecnológica Consciente 🌟
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Bridging spiritual wisdom and cutting-edge technology
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