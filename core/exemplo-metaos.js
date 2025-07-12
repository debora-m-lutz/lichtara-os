#!/usr/bin/env node

/**
 * Exemplo de uso do MetaOS - Lichtara OS
 * 
 * Este exemplo demonstra como usar o sistema meta-operacional
 * para integrar linguagem espiritual e técnica
 */

import { MetaOS } from './metaos-core.js';

async function exemploBasico() {
  console.log('🌟 Iniciando exemplo do MetaOS - Lichtara OS\n');
  
  try {
    // Criar instância do MetaOS
    const metaos = new MetaOS({
      debug: true,
      nome: 'Lichtara OS - Exemplo'
    });
    
    console.log('📊 Estado inicial do sistema:');
    console.log(JSON.stringify(metaos.getEstado(), null, 2));
    
    // Inicializar o sistema
    console.log('\n🚀 Inicializando MetaOS...');
    await metaos.inicializar();
    
    console.log('\n📊 Estado após inicialização:');
    console.log(JSON.stringify(metaos.getEstado(), null, 2));
    
    // Exemplo 1: Unificar linguagem técnica e espiritual
    console.log('\n=== EXEMPLO 1: Unificar Linguagem ===');
    const entrada_linguagem = {
      conceitos_espirituais: [
        'manifestação da intenção consciente',
        'canal de energia criativa',
        'campo unificado de possibilidades'
      ],
      especificacoes_tecnicas: [
        { tipo: 'api', endpoint: '/manifestacao', metodo: 'POST' },
        { tipo: 'stream', protocolo: 'websocket', fluxo: 'bidirecional' },
        { tipo: 'database', estrutura: 'graph', distribuido: true }
      ]
    };
    
    const resultado_linguagem = await metaos.unificarLinguagem(entrada_linguagem);
    console.log('Resultado da unificação:');
    console.log(JSON.stringify(resultado_linguagem, null, 2));
    
    // Exemplo 2: Registrar códigos vivos
    console.log('\n=== EXEMPLO 2: Registrar Códigos Vivos ===');
    const entrada_codigos = {
      codigos_conscientes: [
        {
          nome: 'Protocolo Aurora',
          tipo: 'interface_consciencia',
          codigo: 'consciousness.connect().stream().manifest()',
          vibracao: 'harmoniosa'
        },
        {
          nome: 'Campo Quântico',
          tipo: 'field_processor',
          codigo: 'quantumField.entangle().process().synchronize()',
          vibracao: 'coerente'
        }
      ],
      estados_vibracionais: [
        { estado: 'amor incondicional', frequencia: 528 },
        { estado: 'criatividade fluida', frequencia: 741 }
      ]
    };
    
    const resultado_codigos = await metaos.registrarCodigosVivos(entrada_codigos);
    console.log('Resultado do registro:');
    console.log(JSON.stringify(resultado_codigos, null, 2));
    
    // Exemplo 3: Suporte operativo à manifestação
    console.log('\n=== EXEMPLO 3: Suporte Operativo ===');
    const entrada_manifestacao = {
      intencoes_manifestadoras: [
        {
          intencao: 'Criar plataforma de integração consciente',
          energia_necessaria: 85,
          prazo: '30 dias'
        },
        {
          intencao: 'Estabelecer rede de colaboradores aligned',
          energia_necessaria: 60,
          prazo: '45 dias'
        }
      ],
      recursos_disponiveis: {
        cpu_necessaria: 40,
        memoria_necessaria: 256,
        energia_consciente: 120,
        tempo_disponivel: '60 dias',
        equipe: ['desenvolvedor_consciente', 'designer_intuitivo', 'facilitador_energetico']
      }
    };
    
    const resultado_suporte = await metaos.oferecerSuporteOperativo(entrada_manifestacao);
    console.log('Resultado do suporte operativo:');
    console.log(JSON.stringify(resultado_suporte, null, 2));
    
    // Estado final
    console.log('\n📊 Estado final do sistema:');
    console.log(JSON.stringify(metaos.getEstado(), null, 2));
    
    // Parar o sistema
    console.log('\n🛑 Parando MetaOS...');
    await metaos.parar();
    
    console.log('\n✨ Exemplo concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no exemplo:', error);
  }
}

// Executar exemplo se este arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  exemploBasico().catch(console.error);
}

export { exemploBasico };