# Story 1.1: Setup do Projeto Next.js + TypeScript

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 2 pontos
**Agente Responsável:** @dev
**Status:** ✅ Concluído

---

## 📝 Descrição

Como desenvolvedor, preciso configurar a estrutura base do projeto Next.js com TypeScript, Tailwind CSS e ferramentas de qualidade (ESLint, Prettier) para ter uma fundação sólida para desenvolvimento.

## 🎯 Acceptance Criteria

- [x] Projeto Next.js 14+ criado com App Router
- [x] TypeScript 5+ configurado em strict mode
- [x] Tailwind CSS 3+ instalado e configurado
- [x] ESLint configurado com regras Next.js
- [x] Prettier configurado e integrado com ESLint
- [x] Estrutura de pastas criada conforme arquitetura:
  ```
  app/
  ├── layout.tsx
  ├── page.tsx
  lib/
  ├── types/
  │   └── index.ts
  public/
  ```
- [x] Scripts npm configurados:
  - `npm run dev` - Desenvolvimento
  - `npm run build` - Build
  - `npm run lint` - Linting
  - `npm run typecheck` - Type checking
- [x] .gitignore configurado
- [x] README.md atualizado com instruções de setup

## 🛠 Detalhes Técnicos

### Stack
- Next.js 14.1.0+
- React 18.2.0+
- TypeScript 5.3.0+
- Tailwind CSS 3+
- ESLint 8+
- Prettier 3+

### Configurações Importantes

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**tailwind.config.js:**
```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📋 File List

### Arquivos a Criar
- `app/layout.tsx` - Layout raiz da aplicação
- `app/page.tsx` - Página inicial
- `lib/types/index.ts` - Tipos TypeScript compartilhados
- `tailwind.config.js` - Configuração Tailwind
- `tsconfig.json` - Configuração TypeScript
- `.eslintrc.json` - Configuração ESLint
- `.prettierrc` - Configuração Prettier

### Arquivos a Modificar
- `package.json` - Adicionar scripts e dependências
- `README.md` - Documentar setup do projeto

## 🔍 Quality Gates

### CodeRabbit Integration
- [x] CodeRabbit irá revisar:
  - Configurações TypeScript (strict mode)
  - Configurações ESLint (regras Next.js)
  - Estrutura de pastas
  - README.md (clareza de instruções)

### Manual Checks
- [x] `npm run dev` inicia sem erros
- [x] `npm run build` compila com sucesso
- [x] `npm run lint` passa sem warnings
- [x] `npm run typecheck` passa sem erros
- [x] Tailwind CSS aplicado corretamente na página inicial

## 🧪 Testes

### Validação
```bash
# Instalar dependências
npm install

# Verificar dev server
npm run dev
# Acessar http://localhost:3000

# Verificar build
npm run build

# Verificar linting
npm run lint

# Verificar types
npm run typecheck
```

## 📚 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)

## ✅ Definition of Done

- [x] Todos os acceptance criteria completos
- [x] Projeto compila sem erros
- [x] Linting passa sem warnings
- [x] TypeScript em strict mode sem erros
- [x] README.md com instruções claras
- [x] CodeRabbit review aprovado
- [x] Commit criado: `feat: setup Next.js project with TypeScript and Tailwind`

---

**Criado em:** 2026-02-12
**Atualizado em:** 2026-02-12
