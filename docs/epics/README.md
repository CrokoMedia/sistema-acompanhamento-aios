# Epics - Sistema de Acompanhamento AIOS 8 Semanas

Este diretório contém os 4 epics principais do projeto, alinhados aos 4 sprints de 2 semanas cada.

## 📋 Índice de Epics

| Epic | Sprint | Prioridade | Agentes | Arquivo |
|------|--------|------------|---------|---------|
| **Epic 1: Setup e Infraestrutura** | 1 (Sem 1-2) | P0 | @architect, @dev, @qa | [epic-1-setup-infraestrutura.md](./epic-1-setup-infraestrutura.md) |
| **Epic 2: Mapa Mental Interativo** | 2 (Sem 3-4) | P0 | @ux-design-expert, @dev, @qa | [epic-2-mapa-mental-interativo.md](./epic-2-mapa-mental-interativo.md) |
| **Epic 3: Sistema de Progresso** | 3 (Sem 5-6) | P1 | @data-engineer, @dev, @qa | [epic-3-sistema-progresso-materiais.md](./epic-3-sistema-progresso-materiais.md) |
| **Epic 4: AI Tutor e Gamificação** | 4 (Sem 7-8) | P1 | @dev, @qa, @devops | [epic-4-ai-tutor-gamificacao.md](./epic-4-ai-tutor-gamificacao.md) |

## 📊 Resumo Executivo

### Epic 1: Setup e Infraestrutura
**Objetivo:** Fundação técnica completa (Auth, DB, API)
- NextAuth.js configurado
- Supabase PostgreSQL
- API Routes completas
- CodeRabbit configurado
- **Stories:** 8-10

### Epic 2: Mapa Mental Interativo
**Objetivo:** Interface visual do mapa mental com navegação
- Componentes React interativos
- Expand/collapse de nós
- Checkpoints clicáveis
- Responsividade mobile-first
- **Stories:** 10-12

### Epic 3: Sistema de Progresso e Materiais
**Objetivo:** Tracking de progresso e materiais de apoio
- Dashboard aluno e instrutor
- Sistema de badges
- Materiais vinculados
- Métricas e analytics
- **Stories:** 8-10

### Epic 4: AI Tutor e Gamificação
**Objetivo:** AI tutor + gamificação + deploy
- Chat com Claude AI
- Sistema de pontos e leaderboard
- Notificações
- Deploy em produção
- **Stories:** 10-12

## 🎯 Próximos Passos

1. **Revisar epics** - Aprovar estrutura e escopo
2. **Criar stories** - Delegar para @sm usando `*draft`
3. **Executar Epic 1** - Começar desenvolvimento com `*execute-epic`

## 📅 Cronograma Total

| Sprint | Semanas | Epic | Entregas Principais |
|--------|---------|------|---------------------|
| **Sprint 1** | 1-2 | Epic 1 | Auth, DB, API, CI/CD |
| **Sprint 2** | 3-4 | Epic 2 | Mapa mental funcional |
| **Sprint 3** | 5-6 | Epic 3 | Dashboards, materiais |
| **Sprint 4** | 7-8 | Epic 4 | AI tutor, deploy |

## 🔗 Links Relacionados

- [PRD Principal](../prd/)
- [Stories](../stories/)
- [Arquitetura](../architecture/)
- [Configuração do Projeto](../../aios.config.yaml)
