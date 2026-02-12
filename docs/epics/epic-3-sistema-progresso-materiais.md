# Epic 3: Sistema de Progresso e Materiais

**Sprint:** 3 (Semanas 5-6)
**Prioridade:** P1 (Importante)
**Status:** Planejado
**Agentes:** @data-engineer, @dev, @qa

---

## 🎯 Objetivos

Implementar tracking de progresso completo e sistema de materiais de apoio:
- Persistência de progresso do aluno
- Dashboard de métricas e acompanhamento
- Sistema de materiais vinculados (docs, vídeos, exercícios)
- Perfil do aluno

## 📊 User Stories Incluídas

- US-03: Marcar checkpoints (backend completo)
- US-04: Ver progresso geral (completa)
- US-05: Acessar materiais (completa)
- US-06: Dashboard instrutor (completa)

## ✅ Acceptance Criteria

**Progresso do Aluno:**
- [ ] Sincronização automática de checkpoints com backend
- [ ] Cálculo de % de conclusão por semana
- [ ] Cálculo de % de conclusão total
- [ ] Histórico de progresso (gráfico temporal)
- [ ] Estimativa de tempo para conclusão
- [ ] Badges de conquista (primeira semana, 50%, conclusão)

**Dashboard Instrutor:**
- [ ] Visão geral de todos os alunos
- [ ] Métricas agregadas:
  - Taxa de conclusão média
  - Tempo médio por semana
  - Drop-off rate por semana
  - NPS (se implementado)
- [ ] Filtros por status (ativo, pausado, concluído)
- [ ] Exportação de dados (CSV)

**Sistema de Materiais:**
- [ ] CRUD de materiais por tópico
- [ ] Tipos de materiais:
  - Documentos (MD, PDF)
  - Vídeos (YouTube embeds)
  - Exercícios práticos (code snippets)
  - Links externos
- [ ] Preview de materiais inline
- [ ] Marcação de "material completado"
- [ ] Busca de materiais

**Perfil do Aluno:**
- [ ] Informações básicas (nome, email, foto)
- [ ] Estatísticas pessoais:
  - Data de início
  - Semana atual
  - % de conclusão
  - Streak (dias consecutivos)
- [ ] Edição de perfil
- [ ] Histórico de atividades

## 🛠 Technical Stack

```yaml
Frontend:
  - Recharts (gráficos)
  - React Player (vídeos)
  - React Markdown (preview MD)

Backend:
  - API routes para materiais
  - API routes para dashboard
  - Cron job para cálculo de métricas

Database:
  - Tabela materials (id, nodeId, type, title, url, content)
  - Tabela material_completions (id, studentId, materialId, completedAt)
  - Tabela student_badges (id, studentId, badgeType, earnedAt)
  - Tabela activity_log (id, studentId, action, metadata, timestamp)
```

## 🎨 Páginas e Componentes

```
app/
├── dashboard/
│   ├── page.tsx                    // Dashboard do aluno
│   ├── instructor/page.tsx         // Dashboard instrutor
│   └── components/
│       ├── ProgressChart.tsx
│       ├── BadgeCard.tsx
│       ├── StreakCounter.tsx
│       └── MetricsCard.tsx
├── profile/
│   └── page.tsx                    // Perfil do aluno
├── materials/
│   ├── [id]/page.tsx               // Visualização de material
│   └── components/
│       ├── MaterialCard.tsx
│       ├── VideoPlayer.tsx
│       └── MarkdownPreview.tsx
```

## 🔍 Quality Gates

**CodeRabbit Reviews:**
- [ ] Review de lógica de cálculo de progresso
- [ ] Validação de queries do banco (performance)
- [ ] Check de segurança (RBAC instrutor vs aluno)

**Quality Checks:**
- [ ] Testes de cálculo de métricas
- [ ] Testes de permissões (aluno não acessa dashboard instrutor)
- [ ] Performance de queries (< 100ms para dashboard)
- [ ] Testes E2E de fluxo completo

## 👥 Agentes Responsáveis

| Agente | Responsabilidade |
|--------|------------------|
| **@data-engineer** | Schema de dados, queries otimizadas, métricas |
| **@dev** | Implementação de dashboard, materiais, perfil |
| **@qa** | Testes de cálculos, validação de métricas, permissões |

## 🔗 Dependências

- **Epic 1:** API base e autenticação
- **Epic 2:** Componentes de checkpoints

## 📝 Stories Estimadas (8-10 stories)

1. Story 3.1: Tabelas de progresso e materiais (DB)
2. Story 3.2: API routes para materiais (CRUD)
3. Story 3.3: Sistema de badges
4. Story 3.4: Dashboard do aluno (UI)
5. Story 3.5: Dashboard instrutor (UI)
6. Story 3.6: Gráficos de progresso (Recharts)
7. Story 3.7: Perfil do aluno (CRUD)
8. Story 3.8: Sistema de materiais (upload + preview)
9. Story 3.9: Cron job de métricas agregadas
10. Story 3.10: Testes de permissões e segurança

## 📅 Cronograma

| Semana | Foco | Entregável |
|--------|------|------------|
| **Sem 5** | Progresso + Materiais | Dashboard funcional, materiais acessíveis |
| **Sem 6** | Dashboard Instrutor + QA | Métricas agregadas, testes completos |

## 📊 Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Dashboard aluno e instrutor funcionais
- [ ] Sistema de materiais completo
- [ ] Métricas calculadas corretamente
- [ ] Testes de segurança (RBAC) passando
- [ ] Performance queries < 100ms
- [ ] CodeRabbit review aprovado
