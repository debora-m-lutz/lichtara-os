/**
 * Logger para o MetaOS - Sistema de logging consciente
 */

export class Logger {
  constructor(modulo, debug = false) {
    this.modulo = modulo;
    this.debug = debug;
    this.historico = [];
  }

  info(mensagem, dados = null) {
    const log = this.criarLog('INFO', mensagem, dados);
    this.adicionarAoHistorico(log);
    
    if (this.debug) {
      console.log(`🌟 [${log.timestamp}] [${this.modulo}] ${mensagem}`, dados || '');
    }
  }

  error(mensagem, erro = null) {
    const log = this.criarLog('ERROR', mensagem, erro);
    this.adicionarAoHistorico(log);
    
    console.error(`❌ [${log.timestamp}] [${this.modulo}] ${mensagem}`, erro || '');
  }

  warn(mensagem, dados = null) {
    const log = this.criarLog('WARN', mensagem, dados);
    this.adicionarAoHistorico(log);
    
    if (this.debug) {
      console.warn(`⚠️ [${log.timestamp}] [${this.modulo}] ${mensagem}`, dados || '');
    }
  }

  debug(mensagem, dados = null) {
    if (!this.debug) return;
    
    const log = this.criarLog('DEBUG', mensagem, dados);
    this.adicionarAoHistorico(log);
    console.log(`🔍 [${log.timestamp}] [${this.modulo}] ${mensagem}`, dados || '');
  }

  consciente(mensagem, vibracao = null) {
    const log = this.criarLog('CONSCIENTE', mensagem, { vibracao });
    this.adicionarAoHistorico(log);
    
    if (this.debug) {
      console.log(`✨ [${log.timestamp}] [${this.modulo}] ${mensagem}`, vibracao || '');
    }
  }

  criarLog(nivel, mensagem, dados) {
    return {
      timestamp: new Date().toISOString(),
      modulo: this.modulo,
      nivel,
      mensagem,
      dados,
      energia_consciente: this.calcularEnergiaConsciente(nivel, mensagem)
    };
  }

  adicionarAoHistorico(log) {
    this.historico.push(log);
    
    // Manter apenas os últimos 100 logs
    if (this.historico.length > 100) {
      this.historico.shift();
    }
  }

  calcularEnergiaConsciente(nivel, mensagem) {
    const fatores = {
      'INFO': 1,
      'DEBUG': 0.5,
      'WARN': 0.8,
      'ERROR': 1.2,
      'CONSCIENTE': 2
    };
    
    const fator_base = fatores[nivel] || 1;
    const fator_mensagem = mensagem.length / 100;
    
    return Math.min(10, fator_base + fator_mensagem);
  }

  getHistorico(filtro = null) {
    if (!filtro) return this.historico;
    
    return this.historico.filter(log => {
      if (filtro.nivel && log.nivel !== filtro.nivel) return false;
      if (filtro.modulo && log.modulo !== filtro.modulo) return false;
      if (filtro.desde && new Date(log.timestamp) < new Date(filtro.desde)) return false;
      return true;
    });
  }

  limparHistorico() {
    this.historico = [];
  }

  getEstatisticas() {
    const niveis = {};
    let energia_total = 0;
    
    this.historico.forEach(log => {
      niveis[log.nivel] = (niveis[log.nivel] || 0) + 1;
      energia_total += log.energia_consciente;
    });
    
    return {
      total_logs: this.historico.length,
      niveis,
      energia_total_consciente: energia_total,
      energia_media: this.historico.length > 0 ? energia_total / this.historico.length : 0
    };
  }
}