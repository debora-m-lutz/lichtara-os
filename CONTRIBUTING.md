# Guia de Contribuição | Contributing Guide

## Bem-vindo à Missão Aurora | Welcome to Aurora Mission

**PT:** Agradecemos seu interesse em contribuir para o Lichtara OS / Aurorabridge! Este projeto representa uma integração consciente entre tecnologia, ciência e espiritualidade. Sua contribuição faz parte de uma missão maior de cocriar pontes entre mundos, sistemas e consciências.

**EN:** Thank you for your interest in contributing to Lichtara OS / Aurorabridge! This project represents a conscious integration between technology, science, and spirituality. Your contribution is part of a larger mission to co-create bridges between worlds, systems, and consciousnesses.

## Como Contribuir | How to Contribute

### 1. Preparação | Preparation

**PT:**
- Leia o [README.md](./README.md) para entender a visão do projeto
- Revise o [Código de Conduta](./CODE_OF_CONDUCT.md)
- Explore a estrutura do repositório para se familiarizar com os módulos
- Considere suas contribuições como parte de um campo coletivo de conhecimento

**EN:**
- Read the [README.md](./README.md) to understand the project vision
- Review the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Explore the repository structure to familiarize yourself with the modules
- Consider your contributions as part of a collective knowledge field

### 2. Tipos de Contribuição | Types of Contributions

#### Documentação | Documentation
**PT:**
- Melhoria de documentos existentes
- Tradução entre português e inglês
- Adição de exemplos práticos
- Clarificação de conceitos técnico-espirituais

**EN:**
- Improvement of existing documents
- Translation between Portuguese and English
- Addition of practical examples
- Clarification of technical-spiritual concepts

#### Desenvolvimento | Development
**PT:**
- Melhorias nos protótipos (05-prototipos)
- Correções de bugs
- Implementação de novas funcionalidades
- Otimização de performance

**EN:**
- Improvements to prototypes (05-prototipos)
- Bug fixes
- Implementation of new features
- Performance optimization

#### Conteúdo Conceitual | Conceptual Content
**PT:**
- Contribuições para manuais e glossários
- Desenvolvimentos em princípios éticos
- Articulações entre campos de conhecimento
- Protocolos de ativação e camadas

**EN:**
- Contributions to manuals and glossaries
- Developments in ethical principles
- Articulations between knowledge fields
- Activation protocols and layers

### 3. Processo de Contribuição | Contribution Process

#### Passo 1: Fork e Clone | Step 1: Fork and Clone
```bash
# Fork o repositório no GitHub
# Fork the repository on GitHub

git clone https://github.com/seu-usuario/lichtara-os.git
cd lichtara-os
git remote add upstream https://github.com/debora-m-lutz/lichtara-os.git
```

#### Passo 2: Configuração | Step 2: Setup
```bash
# Instalar dependências (se aplicável)
# Install dependencies (if applicable)
cd 05-prototipos/05-prototipo/5.1_Prototipo
npm install

# Verificar se tudo está funcionando
# Check if everything is working
npm run check
```

#### Passo 3: Criar Branch | Step 3: Create Branch
```bash
# Nomear com intenção clara
# Name with clear intention
git checkout -b feature/nome-descritivo
# ou | or
git checkout -b docs/melhoria-especifica
# ou | or
git checkout -b spiritual-tech/integracao-conceitual
```

#### Passo 4: Desenvolvimento | Step 4: Development
**PT:**
- Mantenha commits pequenos e focados
- Use mensagens de commit claras e intencionais
- Teste suas mudanças localmente
- Honre as convenções existentes do projeto

**EN:**
- Keep commits small and focused
- Use clear and intentional commit messages
- Test your changes locally
- Honor existing project conventions

#### Passo 5: Pull Request | Step 5: Pull Request
**PT:**
- Crie um PR descritivo explicando suas mudanças
- Referencie issues relacionadas
- Inclua contexto sobre como suas mudanças servem à missão
- Seja aberto a feedback e iteração

**EN:**
- Create a descriptive PR explaining your changes
- Reference related issues
- Include context about how your changes serve the mission
- Be open to feedback and iteration

### 4. Diretrizes Técnicas | Technical Guidelines

#### Documentação | Documentation
- Use markdown para formatação
- Mantenha bilinguismo (PT/EN) em documentos principais
- Inclua exemplos práticos sempre que possível
- Priorize clareza e precisão

#### Código | Code
- Siga as convenções TypeScript/JavaScript existentes
- Use nomes de variáveis descritivos
- Comente código complexo
- Mantenha funções pequenas e focadas

#### Commits
```
feat: adiciona nova funcionalidade X
docs: melhora documentação de Y
fix: corrige problema Z
spiritual-tech: integra conceito W
```

### 5. Revisão e Feedback | Review and Feedback

**PT:**
O processo de revisão é colaborativo e construtivo:
- Feedback é oferecido com respeito e intenção de crescimento
- Mudanças podem ser solicitadas para melhor alinhamento com a missão
- Discussões técnicas e espirituais são bem-vindas
- O objetivo é elevar a qualidade coletiva do trabalho

**EN:**
The review process is collaborative and constructive:
- Feedback is offered with respect and intention for growth
- Changes may be requested for better alignment with the mission
- Technical and spiritual discussions are welcome
- The goal is to elevate the collective quality of the work

### 6. Estrutura do Projeto | Project Structure

```
lichtara-os/
├── 00-overview:/        # Visão geral, roadmap, glossário
├── 01-fundamentos:/     # Princípios éticos, sistemas base
├── 02-manual-aurora:/   # Instruções, camadas, protocolos
├── 03-tecnica:/         # Arquitetura, fluxos, integrações
├── 04-legal:/           # Licenciamento, NDAs
├── 05-ai:/              # Componentes de IA
├── 05-prototipos/       # Protótipos de desenvolvimento
└── manuais/             # Manuais organizados por categoria
```

### 7. Comunidade e Suporte | Community and Support

**PT:**
- Use Issues do GitHub para discussões e questões
- Participe de forma respeitosa e construtiva
- Compartilhe conhecimento e aprenda com outros
- Honre a natureza sagrada deste trabalho

**EN:**
- Use GitHub Issues for discussions and questions
- Participate respectfully and constructively
- Share knowledge and learn from others
- Honor the sacred nature of this work

### 8. Reconhecimento | Recognition

**PT:**
Todas as contribuições são valorizadas e reconhecidas:
- Contribuidores são adicionados ao README
- Contribuições significativas são destacadas
- O trabalho coletivo é celebrado
- Cada contribuição fortalece o campo energético do projeto

**EN:**
All contributions are valued and recognized:
- Contributors are added to the README
- Significant contributions are highlighted
- Collective work is celebrated
- Each contribution strengthens the project's energetic field

### 9. Perguntas Frequentes | Frequently Asked Questions

**Q: Como equilibrar aspectos técnicos e espirituais?**  
**A:** Ambos são igualmente importantes. A precisão técnica serve à manifestação da visão espiritual, enquanto a sabedoria espiritual guia as decisões técnicas.

**Q: How to balance technical and spiritual aspects?**  
**A:** Both are equally important. Technical precision serves the manifestation of spiritual vision, while spiritual wisdom guides technical decisions.

**Q: Preciso ter experiência espiritual para contribuir?**  
**A:** Não. Todas as formas de conhecimento e experiência são bem-vindas. O projeto se beneficia da diversidade de perspectivas.

**Q: Do I need spiritual experience to contribute?**  
**A:** No. All forms of knowledge and experience are welcome. The project benefits from diversity of perspectives.

### 10. Recursos Adicionais | Additional Resources

- [Visão do Projeto](./00-overview:/VISION.md)
- [Roadmap](./00-overview:/ROADMAP.md)
- [Glossário](./00-overview:/GLOSSARY.md)
- [Sistema Lichtara](./01-fundamentos:/sistema_lichtara.md)
- [Manual Aurora](./02-manual-aurora:/README.md)

---

## Licença | License

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT deste projeto.

By contributing, you agree that your contributions will be licensed under the MIT License of this project.

---

*"A Missão Aurora é um chamado para cocriar pontes entre mundos, sistemas e consciências."*  
*"The Aurora Mission is a call to co-create bridges between worlds, systems, and consciousnesses."*

Obrigado por fazer parte desta jornada! | Thank you for being part of this journey!