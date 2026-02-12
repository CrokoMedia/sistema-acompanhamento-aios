# Story 1.9: Setup CI/CD Pipeline

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 | **Estimativa:** 3 pts | **Agente:** @devops, @qa
**Status:** Não Iniciado | **Dependências:** Story 1.1

---

## 📝 Descrição
Configurar GitHub Actions para CI/CD com lint, typecheck, testes e deploy automático.

## 🎯 Acceptance Criteria

### CI Pipeline
- [ ] Workflow CI criado (`.github/workflows/ci.yml`)
- [ ] Jobs configurados:
  - Lint (ESLint)
  - Typecheck (TypeScript)
  - Build (Next.js)
  - Tests (Jest)
- [ ] CI roda em todos os PRs
- [ ] Status badges no README

### Vercel Deployment (CD)
- [ ] Projeto conectado ao Vercel via GitHub integration
- [ ] Deploy automático de production (branch `main`)
- [ ] Preview deployments em todos os PRs
- [ ] Environment variables configuradas no Vercel:
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- [ ] Domain configurado (opcional)
- [ ] Build settings configurados (Next.js framework auto-detected)

## 🛠 Configuração

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          SKIP_ENV_VALIDATION: true

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

---

## 🚀 Vercel Deployment Configuration

### Setup Inicial

**1. Conectar Repositório ao Vercel:**
```bash
# Opção 1: Via Vercel Dashboard
# - Acessar https://vercel.com
# - New Project > Import Git Repository
# - Selecionar repositório GitHub
# - Vercel detecta Next.js automaticamente

# Opção 2: Via Vercel CLI (opcional)
npm i -g vercel
vercel login
vercel link
```

**2. Configurar Environment Variables:**

No Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Environment | Value |
|----------|------------|-------|
| `NEXTAUTH_SECRET` | Production, Preview | `<gerado com openssl rand -base64 32>` |
| `NEXTAUTH_URL` | Production | `https://your-domain.vercel.app` |
| `NEXTAUTH_URL` | Preview | `https://your-project-git-{branch}-{scope}.vercel.app` (auto) |
| `NEXT_PUBLIC_SUPABASE_URL` | All | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | `eyJxxx...` |
| `SUPABASE_SERVICE_ROLE_KEY` | All | `eyJxxx...` (⚠️ Sensitive) |
| `GOOGLE_CLIENT_ID` | All | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | All | `GOCSPX-xxx` (⚠️ Sensitive) |

> **Nota:** Use diferentes secrets para Preview e Production se possível (melhor segurança)

**3. Build Settings (Auto-detected):**
```yaml
Framework Preset: Next.js
Build Command: next build (auto)
Output Directory: .next (auto)
Install Command: npm install (auto)
Node Version: 20.x (ou especificar em package.json)
```

**4. Configurar Google OAuth Redirect URIs:**

No Google Cloud Console, adicionar:
- Production: `https://your-domain.vercel.app/api/auth/callback/google`
- Preview: `https://*-{scope}.vercel.app/api/auth/callback/google` (wildcard)

### Deployment Workflow

**Automático via GitHub Integration:**

1. **PR criado** → Vercel cria Preview Deployment
   - URL: `https://project-git-{branch}-{scope}.vercel.app`
   - Comment automático no PR com link
   - CI roda em paralelo

2. **Push para `main`** → Production Deployment
   - URL: `https://your-domain.vercel.app`
   - Deploy após CI passar (opcional: configurar em Project Settings)

3. **Rollback** (se necessário):
   - Vercel Dashboard > Deployments > Previous Deployment > Promote to Production

### Vercel Configuration File (Opcional)

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-domain.vercel.app"
  },
  "build": {
    "env": {
      "SKIP_ENV_VALIDATION": "1"
    }
  }
}
```

> **Nota:** `vercel.json` é opcional - Vercel detecta Next.js automaticamente

## 📋 File List
- `.github/workflows/ci.yml` (criar)
- `vercel.json` (opcional - criar se precisar customização)
- `README.md` (atualizar com badges e deploy URL)

## 🧪 Validação

### Testar CI Pipeline
```bash
# 1. Criar branch de teste
git checkout -b test/ci-pipeline

# 2. Fazer mudança trivial
echo "# CI Test" >> README.md

# 3. Commit e push
git add .
git commit -m "test: trigger CI pipeline"
git push -u origin test/ci-pipeline

# 4. Criar PR no GitHub
gh pr create --title "Test CI Pipeline" --body "Testing CI workflow"

# 5. Verificar no GitHub Actions tab:
# - ✅ lint job passou
# - ✅ typecheck job passou
# - ✅ build job passou
# - ✅ test job passou
```

### Testar Vercel Deployment

**Preview Deployment (PR):**
1. ✅ Vercel bot comenta no PR com preview URL
2. ✅ Acessar preview URL
3. ✅ Testar funcionalidades básicas
4. ✅ Verificar environment variables carregadas

**Production Deployment (main):**
```bash
# 1. Merge PR
gh pr merge --squash

# 2. Verificar Vercel Dashboard:
# - Production deployment iniciado
# - Build logs sem erros
# - Deployment status: Ready

# 3. Acessar production URL
# 4. Testar autenticação (Google OAuth)
# 5. Verificar logs no Vercel Dashboard
```

### Checklist de Validação
- [ ] CI workflow executando em PRs
- [ ] Todos os 4 jobs (lint, typecheck, build, test) passando
- [ ] Preview deployment criado automaticamente em PRs
- [ ] Preview URL acessível e funcional
- [ ] Production deployment em push para main
- [ ] Environment variables configuradas corretamente
- [ ] Google OAuth funcionando em preview e production
- [ ] Status badges visíveis no README
- [ ] Rollback funciona (testar uma vez)

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js Deployment on Vercel](https://nextjs.org/docs/deployment)
- [GitHub Actions for Next.js](https://github.com/vercel/next.js/tree/canary/.github/workflows)

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - Workflow YAML syntax
  - Job dependencies e order
  - Cache estratégias
  - Environment variable handling

### Manual Checks
- [ ] CI passa antes de permitir merge
- [ ] Preview deployments funcionais
- [ ] Production deployment automático
- [ ] Environment variables nunca commitadas
- [ ] Rollback testado e funcionando

## ⚠️ Notas Importantes

- **Environment Variables:** NUNCA commitar secrets no repositório
- **Preview URLs:** São públicas - não usar dados sensíveis em previews
- **Build Time:** Primeira build pode demorar ~3-5min (cache subsequente ~1-2min)
- **Vercel Limits (Hobby Plan):**
  - 100 GB bandwidth/mês
  - 100 builds/dia
  - Serverless function execution: 100 GB-hours/mês
- **Google OAuth:** Adicionar todos os preview domains em Authorized redirect URIs (ou usar wildcard)

## ✅ Definition of Done

### CI Pipeline
- [ ] Workflow CI criado e funcionando
- [ ] Todos os jobs (lint, typecheck, build, test) passando
- [ ] CI executando em todos os PRs
- [ ] Status badges no README

### Vercel Deployment
- [ ] Projeto conectado ao Vercel
- [ ] Production deployment funcionando
- [ ] Preview deployments em PRs
- [ ] Environment variables configuradas
- [ ] Google OAuth testado em preview e production
- [ ] Rollback testado

### Documentação
- [ ] README atualizado com:
  - Status badges (CI)
  - Deploy URL (production)
  - Instruções de deployment
- [ ] Commit: `ci: setup GitHub Actions and Vercel deployment`

---
**Criado em:** 2026-02-12
**Atualizado em:** 2026-02-12
