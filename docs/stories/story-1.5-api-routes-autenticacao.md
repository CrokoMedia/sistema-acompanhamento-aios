# Story 1.5: Implementar API Routes de Autenticação

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 3 pontos
**Agente Responsável:** @dev
**Status:** Não Iniciado
**Dependências:** Story 1.2, Story 1.4

---

## 📝 Descrição

Como usuário, quero fazer login e registro com email/senha para acessar o sistema de forma segura com meus dados armazenados no banco.

## 🎯 Acceptance Criteria

- [ ] Endpoint `/api/auth/register` implementado (POST)
- [ ] Endpoint `/api/auth/login` atualizado para validar com Supabase
- [ ] Hash de senhas gerenciado pelo Supabase Auth (bcrypt automático)
- [ ] Validação de email duplicado
- [ ] Criação de student record após registro
- [ ] Rollback de auth user se criação de student falhar
- [ ] Session JWT configurada corretamente
- [ ] Error handling robusto
- [ ] Validação de input (email formato, senha mínima)

## 🛠 Detalhes Técnicos

**app/api/auth/register/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user exists
    const { data: existing } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    // NOTE: Supabase Auth handles password hashing internally using bcrypt
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password, // Supabase will hash this automatically
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    // Create student record
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        id: authData.user.id,
        email,
        name,
        current_week: 1,
      })
      .select()
      .single();

    if (studentError) {
      // Rollback: delete auth user if student creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: studentError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Atualizar lib/auth/auth-options.ts:**
```typescript
import { supabaseAdmin } from '@/lib/db/client';

CredentialsProvider({
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    // Authenticate with Supabase Auth
    // Supabase handles password verification internally
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (authError || !authData.user) {
      return null;
    }

    // Get student data
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!student) {
      return null;
    }

    return {
      id: student.id,
      email: student.email,
      name: student.name,
    };
  }
})
```

### 🔐 Gerenciamento de Senhas

**Importante:** Esta implementação usa **Supabase Auth** para gerenciamento completo de autenticação:

- ✅ **Hash automático:** Supabase Auth hasheia senhas usando bcrypt internamente
- ✅ **Verificação segura:** `signInWithPassword()` valida credenciais de forma segura
- ✅ **Sem dependência externa:** Não é necessário instalar `bcrypt` manualmente
- ✅ **Best practices:** Supabase segue padrões de segurança da indústria

**Por que não usar bcrypt manualmente?**
1. Evita double-hashing (hash do hash)
2. Supabase Auth já implementa bcrypt com salt rounds adequados
3. Simplifica o código e reduz dependências
4. Mantém consistência com o sistema de autenticação

## 📋 File List

### Arquivos a Criar
- `app/api/auth/register/route.ts`

### Arquivos a Modificar
- `lib/auth/auth-options.ts`
- `package.json` (adicionar zod se ainda não instalado)

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - **Segurança de Senhas:** Uso correto do Supabase Auth (sem double-hashing)
  - **Input Validation:** Zod schema para email/password/name
  - **Error Handling:** Try-catch e rollback em caso de falha
  - **SQL Injection:** Uso correto do Supabase client (parametrizado)
  - **Transações:** Rollback de auth user se student creation falhar
  - **Email Duplicado:** Validação antes de criar usuário

## 🧪 Testes

### Manual Testing
```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678","name":"Test User"}'

# Login
# Usar formulário de login
```

## ✅ Definition of Done

- [ ] Registro funcional
- [ ] Login com credentials funcional
- [ ] Senhas hasheadas
- [ ] Validação de input
- [ ] Error handling
- [ ] CodeRabbit review aprovado
- [ ] Commit: `feat: implement auth API routes`

---

**Criado em:** 2026-02-12
