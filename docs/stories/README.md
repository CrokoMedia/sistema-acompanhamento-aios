# Stories - Epic 1: Setup e Infraestrutura

**Total de Stories:** 10
**Epic:** Epic 1 - Setup e Infraestrutura
**Sprint:** 1 (Semanas 1-2)
**Status Geral:** Planejamento Concluído ✅

---

## 📋 Índice de Stories

| ID | Story | Agente | Estimativa | Status | Dependências |
|----|-------|--------|------------|--------|--------------|
| **1.1** | Setup do Projeto Next.js + TypeScript | @dev | 2 pts | Não Iniciado | - |
| **1.2** | Configurar NextAuth.js com Providers | @dev | 3 pts | Não Iniciado | 1.1 |
| **1.3** | Setup Supabase e Conexão | @dev | 3 pts | Não Iniciado | 1.1 |
| **1.4** | Criar Schema de Database | @architect, @dev | 5 pts | Não Iniciado | 1.3 |
| **1.5** | Implementar API Routes de Autenticação | @dev | 3 pts | Não Iniciado | 1.2, 1.4 |
| **1.6** | Implementar API Routes de Estudantes | @dev | 3 pts | Não Iniciado | 1.4 |
| **1.7** | Implementar API Routes de Progresso | @dev | 5 pts | Não Iniciado | 1.4 |
| **1.8** | Configurar CodeRabbit | @qa | 2 pts | Não Iniciado | GitHub repo |
| **1.9** | Setup CI/CD Pipeline | @devops, @qa | 3 pts | Não Iniciado | 1.1 |
| **1.10** | Testes de Integração API | @qa, @dev | 5 pts | Não Iniciado | 1.5, 1.6, 1.7 |

**Total de Pontos:** 34 pontos

---

## 📊 Breakdown por Semana

### Semana 1: Fundação (Auth + DB)
- Story 1.1: Setup Next.js ⏱️ 2 pts
- Story 1.2: NextAuth.js ⏱️ 3 pts
- Story 1.3: Supabase ⏱️ 3 pts
- Story 1.4: Database Schema ⏱️ 5 pts
- Story 1.5: Auth API Routes ⏱️ 3 pts

**Subtotal:** 16 pts

**Entregas da Semana 1:**
- ✅ Projeto Next.js configurado
- ✅ Login com Google OAuth funcional
- ✅ Banco de dados PostgreSQL com schema completo
- ✅ Registro e login com email/senha

---

### Semana 2: API + Quality Assurance
- Story 1.6: Students API ⏱️ 3 pts
- Story 1.7: Progress API ⏱️ 5 pts
- Story 1.8: CodeRabbit ⏱️ 2 pts
- Story 1.9: CI/CD ⏱️ 3 pts
- Story 1.10: Integration Tests ⏱️ 5 pts

**Subtotal:** 18 pts

**Entregas da Semana 2:**
- ✅ API completa de estudantes e progresso
- ✅ CodeRabbit revisando automaticamente
- ✅ CI/CD pipeline funcionando
- ✅ Testes de integração com 80%+ coverage

---

## 🎯 Ordem de Execução Recomendada

### Fase 1: Foundation (Paralela)
```
1.1 (Setup Next.js) → DEVE SER PRIMEIRO
  ├─→ 1.2 (NextAuth.js)
  ├─→ 1.3 (Supabase)
  └─→ 1.9 (CI/CD)
```

### Fase 2: Database (Sequencial)
```
1.3 (Supabase) → 1.4 (Schema)
```

### Fase 3: Authentication (Sequencial)
```
1.2 (NextAuth) + 1.4 (Schema) → 1.5 (Auth API)
```

### Fase 4: API Development (Paralela)
```
1.4 (Schema) → 1.6 (Students API)
1.4 (Schema) → 1.7 (Progress API)
```

### Fase 5: Quality Assurance (Paralela após APIs)
```
1.5 + 1.6 + 1.7 → 1.10 (Integration Tests)
GitHub Repo → 1.8 (CodeRabbit)
```

---

## 🚀 Como Executar as Stories

### Opção 1: Executar Story Individual
```bash
@dev
*develop story-1.1-setup-nextjs-typescript.md
```

### Opção 2: Executar Epic Completo (Recomendado)
```bash
@pm
*execute-epic docs/epics/epic-1-setup-infraestrutura.md
```

---

## 📚 Arquivos das Stories

- [Story 1.1 - Setup Next.js](./story-1.1-setup-nextjs-typescript.md)
- [Story 1.2 - NextAuth.js](./story-1.2-configurar-nextauth.md)
- [Story 1.3 - Supabase](./story-1.3-setup-supabase.md)
- [Story 1.4 - Database Schema](./story-1.4-criar-schema-database.md)
- [Story 1.5 - Auth API Routes](./story-1.5-api-routes-autenticacao.md)
- [Story 1.6 - Students API Routes](./story-1.6-api-routes-students.md)
- [Story 1.7 - Progress API Routes](./story-1.7-api-routes-progresso.md)
- [Story 1.8 - CodeRabbit](./story-1.8-configurar-coderabbit.md)
- [Story 1.9 - CI/CD Pipeline](./story-1.9-setup-cicd-pipeline.md)
- [Story 1.10 - Integration Tests](./story-1.10-testes-integracao-api.md)

---

## ✅ Definition of Done (Epic 1)

Todas as stories devem estar completas para considerar o Epic concluído:

- [ ] Todas as 10 stories marcadas como "Concluídas"
- [ ] Todos os acceptance criteria validados
- [ ] CodeRabbit review aprovado em todos os PRs
- [ ] CI/CD pipeline passando
- [ ] Coverage de testes > 80%
- [ ] Deploy em staging funcionando
- [ ] Documentação atualizada

---

**Criado em:** 2026-02-12
**Próximo Passo:** Delegar para @po validar stories ou para @dev começar desenvolvimento
