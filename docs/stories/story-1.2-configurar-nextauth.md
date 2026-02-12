# Story 1.2: Configurar NextAuth.js com Providers

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 3 pontos
**Agente Responsável:** @dev
**Status:** Não Iniciado
**Dependências:** Story 1.1

---

## 📝 Descrição

Como usuário do sistema, quero fazer login usando email/senha ou Google OAuth para acessar a plataforma de forma segura.

## 🎯 Acceptance Criteria

- [ ] NextAuth.js 4+ instalado e configurado
- [ ] Provider de Credentials (email/senha) configurado
- [ ] Provider de Google OAuth configurado
- [ ] API Route `/api/auth/[...nextauth]` criada
- [ ] Página de login criada em `app/(auth)/login/page.tsx`
- [ ] Página de registro criada em `app/(auth)/register/page.tsx`
- [ ] Middleware de autenticação configurado
- [ ] Session management funcionando
- [ ] Variáveis de ambiente configuradas:
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- [ ] Proteção de rotas implementada

## 🛠 Detalhes Técnicos

### Stack
- NextAuth.js 4.24+
- bcrypt (para hash de senhas)
- Google OAuth 2.0

### Estrutura de Arquivos

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
lib/
├── auth/
│   └── auth-options.ts
middleware.ts
```

### Configuração NextAuth

**lib/auth/auth-options.ts:**
```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Validar com Supabase (Story 1.3)
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

**middleware.ts:**
```typescript
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

## 📋 File List

### Arquivos a Criar
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `app/(auth)/login/page.tsx` - Página de login
- `app/(auth)/register/page.tsx` - Página de registro
- `lib/auth/auth-options.ts` - Configuração NextAuth
- `middleware.ts` - Middleware de proteção de rotas
- `.env.local.example` - Template de variáveis de ambiente

### Arquivos a Modificar
- `.env.local` - Adicionar variáveis NextAuth e Google OAuth
- `package.json` - Adicionar next-auth e bcrypt

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - Segurança: Nunca expor secrets em código
  - Hash de senhas (bcrypt)
  - Validação de credentials
  - Proteção de rotas (middleware)
  - Error handling

### Security Checks
- [ ] NEXTAUTH_SECRET gerado com `openssl rand -base64 32`
- [ ] Senhas nunca armazenadas em plain text
- [ ] Google OAuth configurado corretamente no Console
- [ ] Variáveis de ambiente nunca commitadas

## 🧪 Testes

### Manual Testing
```bash
# 1. Configurar Google OAuth
# - Criar projeto em https://console.cloud.google.com
# - Configurar OAuth consent screen
# - Criar credenciais OAuth 2.0
# - Adicionar http://localhost:3000/api/auth/callback/google em Authorized redirect URIs

# 2. Configurar .env.local
NEXTAUTH_SECRET=<gerado com openssl>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<do Google Console>
GOOGLE_CLIENT_SECRET=<do Google Console>

# 3. Testar login
npm run dev
# Acessar http://localhost:3000/login
# Testar login com Google
# Testar login com email/senha (após Story 1.3)
```

### Validação
- [ ] Login com Google redireciona corretamente
- [ ] Session criada após login bem-sucedido
- [ ] Middleware bloqueia rotas protegidas
- [ ] Logout funciona corretamente
- [ ] UI de login responsiva

## 📚 Referências

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
- [NextAuth.js with App Router](https://next-auth.js.org/configuration/initialization#route-handlers-app)

## ⚠️ Notas Importantes

- A validação de credentials com banco de dados será implementada na Story 1.3 (após Supabase setup)
- Por enquanto, o provider de Credentials retornará `null` em `authorize()`
- OAuth do Google funcionará completamente após esta story

## ✅ Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Login com Google funcional
- [ ] Páginas de login/registro criadas
- [ ] Middleware protegendo rotas
- [ ] Variáveis de ambiente documentadas
- [ ] Security checks aprovados
- [ ] CodeRabbit review aprovado
- [ ] Commit: `feat: configure NextAuth.js with Google OAuth`

---

**Criado em:** 2026-02-12
**Atualizado em:** 2026-02-12
