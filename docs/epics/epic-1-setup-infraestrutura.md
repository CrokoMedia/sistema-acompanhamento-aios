# Epic 1: Setup e Infraestrutura

**Sprint:** 1 (Semanas 1-2)
**Prioridade:** P0 (Crítico)
**Status:** Planejado
**Agentes:** @architect, @dev, @qa

---

## 🎯 Objetivos

Estabelecer a fundação técnica completa do sistema:
- Configurar autenticação com NextAuth.js
- Implementar banco de dados PostgreSQL com Supabase
- Criar API base com Next.js App Router
- Setup de ambiente de desenvolvimento

## 📊 User Stories Incluídas

- US-01: Visualização do mapa (fundação técnica)
- Parte de US-04: Progresso geral (estrutura de dados)

## ✅ Acceptance Criteria

- [ ] NextAuth.js configurado com providers (email/senha, Google OAuth)
- [ ] Supabase PostgreSQL conectado e funcionando
- [ ] Schema de database implementado:
  - Tabela `students` (id, name, email, currentWeek, createdAt)
  - Tabela `week_progress` (id, studentId, weekNumber, status, completedAt)
  - Tabela `checkpoints` (id, weekProgressId, title, completed, completedAt)
  - Tabela `map_nodes` (id, week, title, type, content, parentId)
- [ ] API Routes criadas:
  - `/api/auth/[...nextauth]` - Autenticação
  - `/api/students/[id]` - CRUD estudantes
  - `/api/progress/[studentId]` - Progresso
  - `/api/checkpoints` - Checkpoints
- [ ] Middleware de autenticação funcionando
- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Testes de integração API (mínimo 80% coverage)
- [ ] CodeRabbit configurado no repositório
- [ ] CI/CD pipeline básico (GitHub Actions)

## 🛠 Technical Stack

```yaml
Frontend:
  - Next.js 14+ (App Router)
  - React 18+
  - TypeScript 5+
  - Tailwind CSS 3+

Backend:
  - Next.js API Routes
  - NextAuth.js 4+
  - Supabase Client
  - Prisma ORM (ou Drizzle)

Database:
  - Supabase PostgreSQL
  - Row Level Security (RLS) configurado

DevOps:
  - GitHub Actions
  - Vercel (staging + production)
  - CodeRabbit (code review)
```

## 🎨 Estrutura de Pastas

```
sistema-acompanhamento-aios/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── students/[id]/route.ts
│   │   ├── progress/[studentId]/route.ts
│   │   └── checkpoints/route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── layout.tsx
├── lib/
│   ├── db/
│   │   ├── client.ts
│   │   └── schema.ts
│   ├── auth/
│   │   └── auth-options.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
└── .env.local
```

## 🔍 Quality Gates (Story 6.1.2.8)

**CodeRabbit Integration:**
- [ ] CodeRabbit instalado no repositório GitHub
- [ ] Configuração `.coderabbit.yaml` criada
- [ ] Review automático em todos os PRs
- [ ] Bloqueio de merge se issues críticos detectados

**Quality Checks:**
- [ ] ESLint + Prettier configurados
- [ ] TypeScript strict mode habilitado
- [ ] Testes unitários (Jest + React Testing Library)
- [ ] Testes de integração API (Supertest)
- [ ] Coverage mínimo: 80%

## 👥 Agentes Responsáveis

| Agente | Responsabilidade |
|--------|------------------|
| **@architect** | Design de arquitetura, escolha de stack, schema DB |
| **@dev** | Implementação de auth, API routes, DB setup |
| **@qa** | Testes, validação de quality gates, CodeRabbit config |

## 🔗 Dependências

- **Externas:** Contas Supabase, Vercel, GitHub
- **Internas:** Nenhuma (primeiro epic)

## 📝 Stories Estimadas (8-10 stories)

1. Story 1.1: Setup do projeto Next.js + TypeScript
2. Story 1.2: Configurar NextAuth.js com providers
3. Story 1.3: Setup Supabase e conexão
4. Story 1.4: Criar schema de database
5. Story 1.5: Implementar API routes de autenticação
6. Story 1.6: Implementar API routes de estudantes
7. Story 1.7: Implementar API routes de progresso
8. Story 1.8: Configurar CodeRabbit
9. Story 1.9: Setup CI/CD pipeline
10. Story 1.10: Testes de integração API

## 📅 Cronograma

| Semana | Foco | Entregável |
|--------|------|------------|
| **Sem 1** | Auth + DB | Login funcional, DB schema criado |
| **Sem 2** | API + QA | API completa, testes passando, CodeRabbit ativo |

## 📊 Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Código revisado e aprovado pelo CodeRabbit
- [ ] Testes passando (unit + integration)
- [ ] Coverage > 80%
- [ ] Deploy em staging funcionando
- [ ] Documentação técnica atualizada
- [ ] Review de código aprovado por @qa
