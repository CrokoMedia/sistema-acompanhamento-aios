# Story 1.6: Implementar API Routes de Estudantes

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 3 pontos
**Agente Responsável:** @dev
**Status:** Não Iniciado
**Dependências:** Story 1.4

---

## 📝 Descrição

Como desenvolvedor, preciso implementar endpoints CRUD para gerenciar perfis de estudantes, permitindo que usuários visualizem e atualizem seus próprios dados de forma segura.

## 🎯 Acceptance Criteria

- [ ] GET `/api/students/[id]` implementado - Buscar estudante por ID
- [ ] PATCH `/api/students/[id]` implementado - Atualizar dados do estudante
- [ ] DELETE `/api/students/[id]` implementado - Deletar conta do estudante
- [ ] Validação de permissões: usuário só acessa próprio perfil
- [ ] Input validation com Zod schema
- [ ] Error handling robusto para todos os endpoints
- [ ] Session validation via NextAuth
- [ ] Responses padronizados (success/error)
- [ ] Logs de auditoria para operações críticas (DELETE)

## 🛠 Detalhes Técnicos

### Stack
- Next.js App Router API Routes
- NextAuth.js (session management)
- Zod (input validation)
- Supabase Client

### Estrutura de Arquivos

```
app/
└── api/
    └── students/
        └── [id]/
            └── route.ts
lib/
├── validations/
│   └── student.ts
└── types/
    └── api.ts
```

### Implementação Completa

**lib/validations/student.ts:**
```typescript
import { z } from 'zod';

export const updateStudentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  current_week: z.number().min(1).max(8).optional(),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
```

**lib/types/api.ts:**
```typescript
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface StudentResponse {
  id: string;
  email: string;
  name: string;
  current_week: number;
  created_at: string;
  updated_at: string;
}
```

**app/api/students/[id]/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabase } from '@/lib/db/client';
import { updateStudentSchema } from '@/lib/validations/student';
import { z } from 'zod';

// GET /api/students/[id] - Buscar estudante
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticação
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar permissão (usuário só acessa próprio perfil)
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Não autorizado a acessar este perfil' },
        { status: 403 }
      );
    }

    // Buscar estudante
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Erro ao buscar estudante:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar estudante' },
        { status: 500 }
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: student });
  } catch (error) {
    console.error('Erro no endpoint GET /api/students/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/students/[id] - Atualizar estudante
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Não autorizado a atualizar este perfil' },
        { status: 403 }
      );
    }

    // Validar input
    const body = await request.json();
    const validatedData = updateStudentSchema.parse(body);

    // Atualizar estudante
    const { data: student, error } = await supabase
      .from('students')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar estudante:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar estudante' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: student,
      message: 'Perfil atualizado com sucesso'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro no endpoint PATCH /api/students/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Deletar estudante
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Não autorizado a deletar este perfil' },
        { status: 403 }
      );
    }

    // Log de auditoria
    console.warn(`AUDIT: Usuário ${params.id} solicitou deleção de conta`);

    // Deletar estudante (cascade deleta week_progress e checkpoints)
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erro ao deletar estudante:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar estudante' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Conta deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro no endpoint DELETE /api/students/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

## 📋 File List

### Arquivos a Criar
- `app/api/students/[id]/route.ts` - API routes CRUD
- `lib/validations/student.ts` - Schemas Zod
- `lib/types/api.ts` - TypeScript types para API

### Arquivos a Modificar
- `package.json` - Adicionar zod (se não instalado)

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - **Segurança:** Validação de permissões (user só acessa próprio perfil)
  - **Validação:** Input validation com Zod
  - **Error Handling:** Try-catch em todos os endpoints
  - **SQL Injection:** Uso correto de Supabase client (parametrizado)
  - **Logs:** Auditoria em operações críticas (DELETE)
  - **Type Safety:** TypeScript types corretos

### Manual Checks
- [ ] Endpoint GET retorna dados apenas do próprio usuário
- [ ] Endpoint PATCH valida inputs corretamente
- [ ] Endpoint DELETE requer confirmação dupla no frontend
- [ ] Error responses são informativos mas não expõem detalhes internos
- [ ] Status codes HTTP corretos (401, 403, 404, 500)

## 🧪 Testes

### Setup
```bash
# Instalar dependências
npm install zod

# Iniciar servidor
npm run dev
```

### Validação Manual

**1. Testar GET - Buscar estudante:**
```bash
# Login primeiro para obter session cookie
# Depois testar com curl ou Postman

curl -X GET http://localhost:3000/api/students/[YOUR_USER_ID] \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json"

# Resposta esperada (200):
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nome do Usuário",
    "current_week": 1,
    "created_at": "2026-02-12T...",
    "updated_at": "2026-02-12T..."
  }
}

# Testar acesso negado (outro usuário):
# Status 403: "Não autorizado a acessar este perfil"
```

**2. Testar PATCH - Atualizar estudante:**
```bash
curl -X PATCH http://localhost:3000/api/students/[YOUR_USER_ID] \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome",
    "current_week": 2
  }'

# Resposta esperada (200):
{
  "data": { ... },
  "message": "Perfil atualizado com sucesso"
}

# Testar validação (nome muito curto):
curl -X PATCH http://localhost:3000/api/students/[YOUR_USER_ID] \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{"name": "A"}'

# Resposta esperada (400):
{
  "error": "Dados inválidos",
  "details": [...]
}
```

**3. Testar DELETE - Deletar estudante:**
```bash
curl -X DELETE http://localhost:3000/api/students/[YOUR_USER_ID] \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json"

# Resposta esperada (200):
{
  "message": "Conta deletada com sucesso"
}

# Verificar cascade delete:
# - week_progress deletado
# - checkpoints deletados
```

### Cenários de Teste
- [ ] ✅ GET com session válida retorna dados
- [ ] ❌ GET sem session retorna 401
- [ ] ❌ GET tentando acessar outro usuário retorna 403
- [ ] ✅ PATCH com dados válidos atualiza perfil
- [ ] ❌ PATCH com dados inválidos retorna 400 com detalhes Zod
- [ ] ❌ PATCH sem permissão retorna 403
- [ ] ✅ DELETE remove estudante e dados relacionados
- [ ] ❌ DELETE sem permissão retorna 403

## 📚 Referências

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [NextAuth.js Session Management](https://next-auth.js.org/getting-started/client#usesession)
- [Zod Validation](https://zod.dev/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/select)

## ⚠️ Notas Importantes

- **Segurança:** Nunca permitir usuário acessar/modificar dados de outro usuário
- **Cascade Delete:** DELETE em `students` automaticamente deleta `week_progress` e `checkpoints` (ON DELETE CASCADE configurado na Story 1.4)
- **Auditoria:** Logs de DELETE são críticos para troubleshooting
- **Rate Limiting:** Considerar implementar rate limiting em produção (Story futura)

## ✅ Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] CRUD completo implementado (GET, PATCH, DELETE)
- [ ] Validação de permissões funcionando
- [ ] Input validation com Zod
- [ ] Error handling robusto
- [ ] Testes manuais aprovados (todos os cenários)
- [ ] Logs de auditoria implementados
- [ ] CodeRabbit review aprovado
- [ ] Commit criado: `feat: implement students CRUD API routes`

---

**Criado em:** 2026-02-12
**Atualizado em:** 2026-02-12
