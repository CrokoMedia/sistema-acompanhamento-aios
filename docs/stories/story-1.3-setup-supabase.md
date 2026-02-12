# Story 1.3: Setup Supabase e Conexão

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 3 pontos
**Agente Responsável:** @dev
**Status:** Não Iniciado
**Dependências:** Story 1.1

---

## 📝 Descrição

Como desenvolvedor, preciso conectar o projeto ao Supabase PostgreSQL para ter um banco de dados gerenciado e pronto para uso.

## 🎯 Acceptance Criteria

- [ ] Projeto Supabase criado (dashboard.supabase.com)
- [ ] Supabase Client instalado (`@supabase/supabase-js`)
- [ ] Cliente Supabase configurado em `lib/db/client.ts`
- [ ] Variáveis de ambiente configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (para operações server-side)
- [ ] Conexão testada e funcionando
- [ ] Row Level Security (RLS) habilitado
- [ ] Helper functions criadas para operações comuns

## 🛠 Detalhes Técnicos

### Stack
- Supabase Client v2+
- PostgreSQL 15+ (gerenciado pelo Supabase)

### Configuração

**lib/db/client.ts:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client para operações server-side (com service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

## 📋 File List

### Arquivos a Criar
- `lib/db/client.ts` - Cliente Supabase
- `lib/db/types.ts` - Tipos do banco (gerados automaticamente)

### Arquivos a Modificar
- `.env.local` - Adicionar credenciais Supabase
- `.env.local.example` - Documentar variáveis
- `package.json` - Adicionar @supabase/supabase-js

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - Nunca expor service role key no client-side
  - Uso correto de env variables
  - Error handling em conexões

### Security Checks
- [ ] Service role key NUNCA exposta no client
- [ ] RLS habilitado em todas as tabelas (será configurado na Story 1.4)
- [ ] Anon key documentada como pública

## 🧪 Testes

### Setup Supabase
```bash
# 1. Criar projeto em dashboard.supabase.com
# 2. Copiar Project URL e anon key
# 3. Copiar service_role key (Settings > API)
# 4. Configurar .env.local

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Validação
```typescript
// Testar conexão
import { supabase } from '@/lib/db/client';

const { data, error } = await supabase
  .from('_test')
  .select('*')
  .limit(1);

console.log('Conexão OK:', !error);
```

## 📚 Referências

- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Client](https://supabase.com/docs/reference/javascript/introduction)

## ✅ Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Projeto Supabase criado
- [ ] Cliente configurado e testado
- [ ] Variáveis de ambiente documentadas
- [ ] Security checks aprovados
- [ ] CodeRabbit review aprovado
- [ ] Commit: `feat: setup Supabase connection`

---

**Criado em:** 2026-02-12
