# Epic 4: AI Tutor e Gamificação

**Sprint:** 4 (Semanas 7-8)
**Prioridade:** P1 (Importante)
**Status:** Planejado
**Agentes:** @dev, @qa, @devops

---

## 🎯 Objetivos

Adicionar camada de inteligência com AI tutor e sistema de gamificação completo:
- Chat integrado com Claude AI (tutor virtual)
- Sistema de gamificação avançado
- Notificações e lembretes
- Polish final e deploy

## 📊 User Stories Incluídas

- US-07: Receber dicas do AI tutor (completa)
- Gamificação completa (badges, pontos, leaderboard)

## ✅ Acceptance Criteria

**AI Tutor (Claude Integration):**
- [ ] Chat integrado na interface
- [ ] Contexto do tutor:
  - Semana atual do aluno
  - Progresso recente
  - Últimas atividades
  - Dificuldades detectadas
- [ ] Funcionalidades do tutor:
  - Responder dúvidas sobre conteúdo
  - Sugerir próximos passos
  - Explicar conceitos complexos
  - Gerar exercícios personalizados
  - Dar feedback em código (se aluno colar snippet)
- [ ] Rate limiting (prevenir abuso):
  - Max 50 mensagens/dia por aluno
  - Throttle de 1 msg/minuto
- [ ] Histórico de conversas salvo
- [ ] UI de chat responsiva e acessível
- [ ] Custo controlado (tracking de tokens)

**Gamificação Avançada:**
- [ ] Sistema de pontos:
  - Checkpoint completado: 10 pts
  - Semana completada: 100 pts
  - Material completado: 5 pts
  - Streak de 7 dias: 50 pts bonus
- [ ] Badges:
  - 🎯 "Primeiro Passo" - Primeira semana
  - 🔥 "Persistente" - 7 dias consecutivos
  - ⚡ "Velocista" - Semana em < 3 dias
  - 🏆 "Graduado" - 8 semanas completas
  - 💎 "Perfeccionista" - 100% checkpoints
- [ ] Leaderboard:
  - Ranking por pontos
  - Filtros: global, mensal, semanal
  - Opt-in (privacidade)
- [ ] Streaks:
  - Contador de dias consecutivos
  - Notificação quando streak em risco

**Notificações:**
- [ ] Email notifications:
  - Lembrete semanal (segunda-feira)
  - Checkpoint próximo da conclusão
  - Streak em risco (24h inativo)
  - Novo material disponível
- [ ] Push notifications (PWA - opcional):
  - Mesmo conteúdo dos emails
- [ ] Centro de notificações in-app
- [ ] Preferências de notificação (opt-out)

**Polish e Deploy:**
- [ ] Loading states em todas as ações
- [ ] Error boundaries e tratamento de erros
- [ ] Toast notifications para feedback
- [ ] Onboarding tour (primeira vez)
- [ ] SEO otimizado (meta tags, OG images)
- [ ] Analytics configurado (Vercel Analytics + Posthog)
- [ ] Deploy em produção (Vercel)
- [ ] Domínio customizado configurado
- [ ] SSL/HTTPS funcionando
- [ ] Monitoring (Sentry para errors)

## 🛠 Technical Stack

```yaml
AI:
  - Anthropic Claude API (Sonnet 3.5)
  - Vercel AI SDK (streaming)

Notificações:
  - Resend (emails transacionais)
  - React Email (templates)
  - (Opcional) OneSignal (push)

Analytics:
  - Vercel Analytics
  - Posthog (events tracking)

Monitoring:
  - Sentry (error tracking)
  - Vercel Monitoring (performance)

Deploy:
  - Vercel (produção + preview)
  - GitHub Actions (CI/CD)
```

## 🎨 Componentes e Páginas

```
app/
├── chat/
│   ├── page.tsx                    // Interface de chat
│   └── components/
│       ├── ChatContainer.tsx
│       ├── MessageBubble.tsx
│       ├── StreamingResponse.tsx
│       └── ChatInput.tsx
├── gamification/
│   ├── leaderboard/page.tsx
│   └── components/
│       ├── BadgeGrid.tsx
│       ├── LeaderboardTable.tsx
│       └── StreakCounter.tsx
├── notifications/
│   └── page.tsx                    // Centro de notificações

lib/
├── ai/
│   ├── claude-client.ts
│   ├── context-builder.ts          // Constrói contexto do aluno
│   └── rate-limiter.ts
├── gamification/
│   ├── points-calculator.ts
│   ├── badge-unlocks.ts
│   └── leaderboard-builder.ts
└── notifications/
    ├── email-sender.ts
    └── templates/
        ├── weekly-reminder.tsx
        └── streak-warning.tsx
```

## 🔍 Quality Gates

**CodeRabbit Reviews:**
- [ ] Review de integração Claude (segurança de API key)
- [ ] Validação de rate limiting
- [ ] Check de custo (estimativa de tokens)
- [ ] Review de templates de email (HTML)

**Quality Checks:**
- [ ] Testes de chat (mock Claude API)
- [ ] Testes de cálculo de pontos
- [ ] Testes de unlock de badges
- [ ] Testes de envio de emails (preview mode)
- [ ] Load testing (50+ usuários simultâneos)
- [ ] Security audit (OWASP top 10)
- [ ] Lighthouse score > 95

## 🔒 Segurança e Custo

**Segurança:**
- [ ] API key do Claude em variável de ambiente (nunca expor)
- [ ] Validação de input (prevenir prompt injection)
- [ ] Sanitização de output do Claude
- [ ] Rate limiting por IP e por usuário

**Controle de Custo:**
- [ ] Limite de tokens por request (max 1000 tokens)
- [ ] Cache de respostas comuns
- [ ] Monitoring de uso mensal
- [ ] Alert se custo > $100/mês

## 👥 Agentes Responsáveis

| Agente | Responsabilidade |
|--------|------------------|
| **@dev** | Integração Claude, gamificação, notificações |
| **@qa** | Testes de segurança, load testing, validação final |
| **@devops** | Deploy, monitoring, DNS, SSL |

## 🔗 Dependências

- **Epic 1:** API base
- **Epic 2:** Componentes de UI
- **Epic 3:** Sistema de progresso (para contexto do AI)
- **Externas:** Conta Anthropic, Resend, Sentry

## 📝 Stories Estimadas (10-12 stories)

1. Story 4.1: Setup Claude API client
2. Story 4.2: Context builder para tutor
3. Story 4.3: Interface de chat (UI)
4. Story 4.4: Streaming de respostas
5. Story 4.5: Rate limiting e cost control
6. Story 4.6: Sistema de pontos
7. Story 4.7: Sistema de badges
8. Story 4.8: Leaderboard
9. Story 4.9: Email notifications (Resend)
10. Story 4.10: Centro de notificações
11. Story 4.11: Analytics e monitoring
12. Story 4.12: Deploy em produção + DNS

## 📅 Cronograma

| Semana | Foco | Entregável |
|--------|------|------------|
| **Sem 7** | AI Tutor + Gamificação | Chat funcional, badges funcionando |
| **Sem 8** | Notificações + Deploy | Sistema completo em produção |

## 📊 Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] AI Tutor funcionando com rate limiting
- [ ] Gamificação completa (pontos, badges, leaderboard)
- [ ] Notificações configuradas e testadas
- [ ] Deploy em produção funcionando
- [ ] Monitoring ativo (Sentry, Analytics)
- [ ] Security audit aprovado
- [ ] Lighthouse score > 95
- [ ] Documentação completa
