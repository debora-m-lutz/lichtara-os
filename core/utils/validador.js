/**
 * Validador para o MetaOS - Sistema de validação consciente
 */

export class Validador {
  constructor(config = {}) {
    this.config = {
      nivel_rigor: 'medio',
      validacao_energetica: true,
      ...config
    };
  }

  validarEstrutura(obj, esquema) {
    const erros = [];
    
    // Validar campos obrigatórios
    if (esquema.campos_obrigatorios) {
      esquema.campos_obrigatorios.forEach(campo => {
        if (!(campo in obj)) {
          erros.push(`Campo obrigatório ausente: ${campo}`);
        }
      });
    }
    
    // Validar tipos
    if (esquema.tipos) {
      Object.entries(esquema.tipos).forEach(([campo, tipo]) => {
        if (obj[campo] && typeof obj[campo] !== tipo) {
          erros.push(`Tipo inválido para ${campo}: esperado ${tipo}, recebido ${typeof obj[campo]}`);
        }
      });
    }
    
    return {
      valido: erros.length === 0,
      erros,
      energia_validacao: this.calcularEnergiaValidacao(obj, esquema)
    };
  }

  validarConciencia(entrada) {
    const validacoes = [];
    
    // Validar presença de intenção
    if (!entrada.intencao || entrada.intencao.trim() === '') {
      validacoes.push({
        tipo: 'intencao',
        valido: false,
        mensagem: 'Intenção não definida ou vazia'
      });
    } else {
      validacoes.push({
        tipo: 'intencao',
        valido: true,
        energia: this.avaliarEnergiaIntencao(entrada.intencao)
      });
    }
    
    // Validar coerência vibracional
    if (entrada.vibracao) {
      const coerencia = this.validarCoerenciaVibracional(entrada.vibracao);
      validacoes.push({
        tipo: 'vibracao',
        valido: coerencia.coerente,
        nivel_coerencia: coerencia.nivel,
        mensagem: coerencia.mensagem
      });
    }
    
    // Validar alinhamento temporal
    if (entrada.momento) {
      const alinhamento = this.validarAlinhamentoTemporal(entrada.momento);
      validacoes.push({
        tipo: 'temporal',
        valido: alinhamento.alinhado,
        sincronicidade: alinhamento.sincronicidade
      });
    }
    
    const todas_validas = validacoes.every(v => v.valido);
    
    return {
      consciencia_valida: todas_validas,
      validacoes,
      energia_consciencia: this.calcularEnergiaConsciencia(validacoes),
      recomendacoes: this.gerarRecomendacoes(validacoes)
    };
  }

  validarIntegracao(simbolico, tecnico) {
    const resultados = {
      compatibilidade: this.verificarCompatibilidade(simbolico, tecnico),
      sintonia_vibracional: this.verificarSintoniaVibracional(simbolico, tecnico),
      ponte_conceitual: this.verificarPonteConceitual(simbolico, tecnico),
      eficiencia_traducao: this.verificarEficienciaTraducao(simbolico, tecnico)
    };
    
    const score_integracao = Object.values(resultados).reduce((acc, result) => {
      return acc + (result.score || 0);
    }, 0) / Object.keys(resultados).length;
    
    return {
      integracao_valida: score_integracao >= 0.7,
      score_integracao,
      detalhes: resultados,
      energia_integracao: score_integracao * 100
    };
  }

  validarManifestacao(intencao, recursos, contexto) {
    const fatores = [];
    
    // Validar clareza da intenção
    const clareza = this.avaliarClarezaIntencao(intencao);
    fatores.push({
      nome: 'clareza_intencao',
      score: clareza.score,
      detalhes: clareza
    });
    
    // Validar adequação dos recursos
    const adequacao = this.avaliarAdequacaoRecursos(recursos, intencao);
    fatores.push({
      nome: 'adequacao_recursos',
      score: adequacao.score,
      detalhes: adequacao
    });
    
    // Validar contexto temporal
    const contexto_temporal = this.avaliarContextoTemporal(contexto);
    fatores.push({
      nome: 'contexto_temporal',
      score: contexto_temporal.score,
      detalhes: contexto_temporal
    });
    
    // Validar alinhamento energético
    const alinhamento = this.avaliarAlinhamentoEnergetico(intencao, recursos, contexto);
    fatores.push({
      nome: 'alinhamento_energetico',
      score: alinhamento.score,
      detalhes: alinhamento
    });
    
    const score_manifestacao = fatores.reduce((acc, fator) => acc + fator.score, 0) / fatores.length;
    
    return {
      manifestacao_viavel: score_manifestacao >= 0.6,
      probabilidade: score_manifestacao,
      fatores,
      energia_manifestacao: score_manifestacao * 150,
      recomendacoes_manifestacao: this.gerarRecomendacoesManifestacao(fatores)
    };
  }

  // Métodos auxiliares
  calcularEnergiaValidacao(obj, esquema) {
    const complexidade = Object.keys(obj).length;
    const rigor_esquema = Object.keys(esquema).length;
    return Math.min(100, (complexidade + rigor_esquema) * 5);
  }

  avaliarEnergiaIntencao(intencao) {
    const palavras_poder = ['manifestar', 'criar', 'transformar', 'alinhar', 'integrar'];
    const pontuacao = palavras_poder.reduce((acc, palavra) => {
      return acc + (intencao.toLowerCase().includes(palavra) ? 10 : 0);
    }, 0);
    
    return Math.min(100, pontuacao + intencao.length);
  }

  validarCoerenciaVibracional(vibracao) {
    if (Array.isArray(vibracao)) {
      const frequencias = vibracao.map(v => v.frequencia_interpretada || 440);
      const media = frequencias.reduce((a, b) => a + b) / frequencias.length;
      const desvio = Math.sqrt(frequencias.reduce((sum, f) => sum + Math.pow(f - media, 2), 0) / frequencias.length);
      const coerencia = 1 - (desvio / media);
      
      return {
        coerente: coerencia > 0.7,
        nivel: coerencia,
        mensagem: coerencia > 0.7 ? 'Vibrações coerentes' : 'Dissonância vibracional detectada'
      };
    }
    
    return {
      coerente: true,
      nivel: 0.8,
      mensagem: 'Validação vibracional básica'
    };
  }

  validarAlinhamentoTemporal(momento) {
    const agora = new Date();
    const momento_ref = new Date(momento);
    const diferenca = Math.abs(agora - momento_ref);
    
    // Considerar alinhado se estiver em uma janela de 1 hora
    const alinhado = diferenca <= 3600000;
    const sincronicidade = Math.max(0, 1 - (diferenca / 3600000));
    
    return {
      alinhado,
      sincronicidade,
      diferenca_temporal: diferenca
    };
  }

  calcularEnergiaConsciencia(validacoes) {
    return validacoes.reduce((acc, validacao) => {
      return acc + (validacao.energia || (validacao.valido ? 20 : 5));
    }, 0);
  }

  gerarRecomendacoes(validacoes) {
    const recomendacoes = [];
    
    validacoes.forEach(validacao => {
      if (!validacao.valido) {
        switch (validacao.tipo) {
          case 'intencao':
            recomendacoes.push('Clarificar e definir intenção de forma mais precisa');
            break;
          case 'vibracao':
            recomendacoes.push('Harmonizar frequências vibracionais');
            break;
          case 'temporal':
            recomendacoes.push('Aguardar momento mais alinhado temporalmente');
            break;
        }
      }
    });
    
    if (recomendacoes.length === 0) {
      recomendacoes.push('Todas as validações passaram - prosseguir com confiança');
    }
    
    return recomendacoes;
  }

  verificarCompatibilidade(simbolico, tecnico) {
    // Verificar se há correspondências entre símbolos e especificações técnicas
    const simbolos = simbolico.simbolos || [];
    const specs = tecnico.especificacoes_processadas || [];
    
    let correspondencias = 0;
    simbolos.forEach(sim => {
      specs.forEach(spec => {
        if (spec.saida_tecnica?.execution_context?.includes('lichtara') && sim.representacao_tecnica) {
          correspondencias++;
        }
      });
    });
    
    const score = Math.min(1, correspondencias / Math.max(simbolos.length, specs.length, 1));
    
    return {
      score,
      correspondencias,
      compativel: score > 0.5
    };
  }

  verificarSintoniaVibracional(simbolico, tecnico) {
    const nivel_coerencia = simbolico.nivel_coerencia || 0;
    const eficiencia_tecnica = tecnico.performance?.eficiencia === 'alta' ? 1 : 
                             tecnico.performance?.eficiencia === 'media' ? 0.7 : 0.4;
    
    const sintonia = (nivel_coerencia + eficiencia_tecnica) / 2;
    
    return {
      score: sintonia,
      nivel_coerencia,
      eficiencia_tecnica,
      sintonizado: sintonia > 0.6
    };
  }

  verificarPonteConceitual(simbolico, tecnico) {
    // Verificar se há ponte conceitual entre domínios
    const arquetipos = simbolico.arquetipos_ativados || [];
    const tipos_tecnicos = tecnico.especificacoes_processadas?.map(s => s.tipo) || [];
    
    const pontes = arquetipos.filter(arq => 
      tipos_tecnicos.some(tipo => tipo.includes('objeto') || tipo.includes('funcao'))
    );
    
    const score = pontes.length / Math.max(arquetipos.length, 1);
    
    return {
      score,
      pontes_identificadas: pontes,
      ponte_estabelecida: score > 0.3
    };
  }

  verificarEficienciaTraducao(simbolico, tecnico) {
    // Verificar eficiência da tradução entre domínios
    const simbolos_traduzidos = simbolico.simbolos?.filter(s => s.traducao) || [];
    const specs_processadas = tecnico.especificacoes_processadas || [];
    
    const eficiencia = simbolos_traduzidos.length / Math.max(specs_processadas.length, 1);
    
    return {
      score: Math.min(1, eficiencia),
      simbolos_traduzidos: simbolos_traduzidos.length,
      eficiente: eficiencia > 0.7
    };
  }

  avaliarClarezaIntencao(intencao) {
    const fatores = {
      especificidade: intencao.length > 20 ? 1 : intencao.length / 20,
      palavras_acao: this.contarPalavrasAcao(intencao) / 3,
      estrutura_clara: intencao.includes(' para ') || intencao.includes(' através ') ? 1 : 0.5
    };
    
    const score = Object.values(fatores).reduce((a, b) => a + b) / Object.keys(fatores).length;
    
    return {
      score: Math.min(1, score),
      fatores,
      clara: score > 0.7
    };
  }

  avaliarAdequacaoRecursos(recursos, intencao) {
    const energia_necessaria = intencao.energia_necessaria || 50;
    const energia_disponivel = recursos.recursos_sistema?.energia_consciente?.nivel || 0;
    
    const adequacao = energia_disponivel / energia_necessaria;
    
    return {
      score: Math.min(1, adequacao),
      energia_necessaria,
      energia_disponivel,
      adequado: adequacao >= 1
    };
  }

  avaliarContextoTemporal(contexto) {
    const agora = new Date();
    const hora = agora.getHours();
    
    // Algumas horas são melhores para manifestação (baseado em crenças espirituais)
    const horas_favoraveis = [6, 7, 8, 18, 19, 20, 21]; // Aurora e crepúsculo
    const favoravel = horas_favoraveis.includes(hora);
    
    return {
      score: favoravel ? 1 : 0.7,
      hora_atual: hora,
      favoravel,
      energia_temporal: favoravel ? 'alta' : 'media'
    };
  }

  avaliarAlinhamentoEnergetico(intencao, recursos, contexto) {
    const fatores = [
      intencao.energia_necessaria ? Math.min(1, 100 / intencao.energia_necessaria) : 1,
      recursos.recursos_sistema?.energia_consciente?.nivel > 50 ? 1 : 0.5,
      contexto.momento ? 1 : 0.8
    ];
    
    const score = fatores.reduce((a, b) => a + b) / fatores.length;
    
    return {
      score,
      fatores,
      alinhado: score > 0.7
    };
  }

  gerarRecomendacoesManifestacao(fatores) {
    const recomendacoes = [];
    
    fatores.forEach(fator => {
      if (fator.score < 0.6) {
        switch (fator.nome) {
          case 'clareza_intencao':
            recomendacoes.push('Refinar e clarificar a intenção');
            break;
          case 'adequacao_recursos':
            recomendacoes.push('Aguardar recursos adequados ou reduzir escopo');
            break;
          case 'contexto_temporal':
            recomendacoes.push('Aguardar momento mais propício');
            break;
          case 'alinhamento_energetico':
            recomendacoes.push('Trabalhar alinhamento energético antes de manifestar');
            break;
        }
      }
    });
    
    if (recomendacoes.length === 0) {
      recomendacoes.push('Condições ideais para manifestação - prosseguir');
    }
    
    return recomendacoes;
  }

  contarPalavrasAcao(texto) {
    const palavras_acao = ['criar', 'manifestar', 'transformar', 'integrar', 'alinhar', 'desenvolver', 'implementar'];
    return palavras_acao.filter(palavra => texto.toLowerCase().includes(palavra)).length;
  }
}