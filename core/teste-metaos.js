#!/usr/bin/env node

/**
 * Teste básico do MetaOS
 * Verifica se o sistema está funcionando corretamente
 */

import { MetaOS } from './metaos-core.js';

async function testeBasico() {
  console.log('🧪 Iniciando teste básico do MetaOS...\n');
  
  let sucessos = 0;
  let falhas = 0;
  
  function assert(condicao, mensagem) {
    if (condicao) {
      console.log(`✅ ${mensagem}`);
      sucessos++;
    } else {
      console.log(`❌ ${mensagem}`);
      falhas++;
    }
  }
  
  try {
    // Teste 1: Criação do MetaOS
    console.log('--- Teste 1: Criação do MetaOS ---');
    const metaos = new MetaOS({ debug: false });
    assert(metaos !== null, 'MetaOS criado com sucesso');
    assert(metaos.estado === 'inicializando', 'Estado inicial correto');
    
    // Teste 2: Inicialização
    console.log('\n--- Teste 2: Inicialização ---');
    await metaos.inicializar();
    assert(metaos.estado === 'operacional', 'MetaOS inicializado corretamente');
    
    const estado = metaos.getEstado();
    assert(estado.nucleos.simbolico.estado === 'ativo', 'Núcleo Simbólico ativo');
    assert(estado.nucleos.tecnico.estado === 'ativo', 'Núcleo Técnico ativo');
    assert(estado.nucleos.vivo.estado === 'ativo', 'Núcleo Vivo ativo');
    
    // Teste 3: Função 1 - Unificar linguagem
    console.log('\n--- Teste 3: Unificar Linguagem ---');
    const entrada_simples = {
      conceitos_espirituais: ['manifestação', 'canal'],
      especificacoes_tecnicas: [{ tipo: 'api', metodo: 'POST' }]
    };
    
    const resultado_linguagem = await metaos.unificarLinguagem(entrada_simples);
    assert(resultado_linguagem.linguagem_integrada !== undefined, 'Linguagem unificada gerada');
    assert(resultado_linguagem.nucleos_utilizados.length === 3, 'Todos os núcleos utilizados');
    
    // Teste 4: Função 2 - Registrar códigos vivos
    console.log('\n--- Teste 4: Registrar Códigos Vivos ---');
    const entrada_codigos = {
      codigos_conscientes: [{ nome: 'teste', codigo: 'test()' }],
      estados_vibracionais: [{ estado: 'teste', frequencia: 440 }]
    };
    
    const resultado_codigos = await metaos.registrarCodigosVivos(entrada_codigos);
    assert(resultado_codigos.codigos_atualizados !== undefined, 'Códigos registrados');
    assert(resultado_codigos.sincronizado === true, 'Códigos sincronizados');
    
    // Teste 5: Função 3 - Suporte operativo
    console.log('\n--- Teste 5: Suporte Operativo ---');
    const entrada_suporte = {
      intencoes_manifestadoras: [{ intencao: 'teste', energia_necessaria: 10 }],
      recursos_disponiveis: { cpu_necessaria: 10, memoria_necessaria: 50 }
    };
    
    const resultado_suporte = await metaos.oferecerSuporteOperativo(entrada_suporte);
    assert(resultado_suporte.suporte_estruturado !== undefined, 'Suporte operativo gerado');
    assert(resultado_suporte.probabilidade_manifestacao !== undefined, 'Probabilidade calculada');
    
    // Teste 6: Parada do sistema
    console.log('\n--- Teste 6: Parada do Sistema ---');
    await metaos.parar();
    assert(metaos.estado === 'parado', 'MetaOS parado corretamente');
    
    // Resultado final
    console.log('\n=== RESULTADO DOS TESTES ===');
    console.log(`✅ Sucessos: ${sucessos}`);
    console.log(`❌ Falhas: ${falhas}`);
    console.log(`📊 Taxa de sucesso: ${((sucessos / (sucessos + falhas)) * 100).toFixed(1)}%`);
    
    if (falhas === 0) {
      console.log('\n🎉 Todos os testes passaram! MetaOS está funcionando corretamente.');
      return true;
    } else {
      console.log('\n⚠️ Alguns testes falharam. Verificar implementação.');
      return false;
    }
    
  } catch (error) {
    console.error('\n💥 Erro durante os testes:', error);
    return false;
  }
}

// Executar teste se este arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testeBasico().then(sucesso => {
    process.exit(sucesso ? 0 : 1);
  }).catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}

export { testeBasico };