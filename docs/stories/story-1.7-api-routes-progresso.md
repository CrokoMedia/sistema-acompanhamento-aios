# Story 1.7: Implementar API Routes de Progresso

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 5 pontos
**Agente Responsável:** @dev
**Status:** Não Iniciado
**Dependências:** Story 1.4

---

## 📝 Descrição

Como estudante, preciso de endpoints para gerenciar meu progresso semanal e marcar checkpoints completados, para acompanhar minha evolução no curso e visualizar meu status no mapa de aprendizado.

## 🎯 Acceptance Criteria

- [ ] GET `/api/progress/[studentId]` - Buscar progresso completo do estudante
- [ ] POST `/api/progress/[studentId]/week/[weekNumber]` - Iniciar nova semana
- [ ] PATCH `/api/progress/[studentId]/week/[weekNumber]` - Atualizar status da semana
- [ ] GET `/api/checkpoints?weekProgressId=[id]` - Listar checkpoints de uma semana
- [ ] PATCH `/api/checkpoints/[id]` - Marcar checkpoint como completo/incompleto
- [ ] POST `/api/checkpoints` - Criar novo checkpoint
- [ ] Validação de permissões: usuário só acessa próprio progresso
- [ ] Cálculo automático de % de conclusão de cada semana
- [ ] Atualização automática de `completed_at` quando status = 'completed'
- [ ] Validação: não permitir iniciar semana N+2 se N não está completa
- [ ] Input validation com Zod

## 🛠 Detalhes Técnicos

### Stack
- Next.js App Router API Routes
- NextAuth.js (session management)
- Supabase Client (com joins para checkpoints)
- Zod (validation)

### Estrutura de Arquivos

```
app/
└── api/
    ├── progress/
    │   └── [studentId]/
    │       ├── route.ts (GET - buscar progresso)
    │       └── week/
    │           └── [weekNumber]/
    │               └── route.ts (POST - iniciar, PATCH - atualizar)
    └── checkpoints/
        ├── route.ts (GET - listar, POST - criar)
        └── [id]/
            └── route.ts (PATCH - atualizar)
lib/
├── validations/
│   └── progress.ts
└── utils/
    └── progress-calculator.ts
```

### Schemas de Validação

**lib/validations/progress.ts:**
```typescript
import { z } from 'zod';

export const weekStatusSchema = z.enum(['not_started', 'in_progress', 'completed']);

export const createWeekProgressSchema = z.object({
  week_number: z.number().min(1).max(8),
});

export const updateWeekProgressSchema = z.object({
  status: weekStatusSchema,
});

export const createCheckpointSchema = z.object({
  week_progress_id: z.string().uuid(),
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
});

export const updateCheckpointSchema = z.object({
  completed: z.boolean(),
});
```

### Utilitários

**lib/utils/progress-calculator.ts:**
```typescript
import { Checkpoint } from '@/lib/db/types';

export function calculateWeekCompletion(checkpoints: Checkpoint[]): number {
  if (checkpoints.length === 0) return 0;

  const completedCount = checkpoints.filter(cp => cp.completed).length;
  return Math.round((completedCount / checkpoints.length) * 100);
}

export function shouldAutoComplete(checkpoints: Checkpoint[]): boolean {
  return calculateWeekCompletion(checkpoints) === 100;
}
```

### Implementação Completa

**app/api/progress/[studentId]/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabase } from '@/lib/db/client';
import { calculateWeekCompletion } from '@/lib/utils/progress-calculator';

// GET /api/progress/[studentId] - Buscar progresso completo
export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Validar permissão
    if (session.user.id !== params.studentId) {
      return NextResponse.json(
        { error: 'Não autorizado a acessar este progresso' },
        { status: 403 }
      );
    }

    // Buscar progresso com checkpoints
    const { data: progress, error } = await supabase
      .from('week_progress')
      .select(`
        *,
        checkpoints (*)
      `)
      .eq('student_id', params.studentId)
      .order('week_number');

    if (error) {
      console.error('Erro ao buscar progresso:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      );
    }

    // Calcular % de conclusão para cada semana
    const progressWithCompletion = progress.map(week => ({
      ...week,
      completion_percentage: calculateWeekCompletion(week.checkpoints),
    }));

    return NextResponse.json({ data: progressWithCompletion });
  } catch (error) {
    console.error('Erro no endpoint GET /api/progress/[studentId]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

**app/api/progress/[studentId]/week/[weekNumber]/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabase } from '@/lib/db/client';
import { updateWeekProgressSchema } from '@/lib/validations/progress';
import { z } from 'zod';

// POST /api/progress/[studentId]/week/[weekNumber] - Iniciar semana
export async function POST(
  request: Request,
  { params }: { params: { studentId: string; weekNumber: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.studentId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    const weekNumber = parseInt(params.weekNumber);

    // Validar semana anterior (se não for semana 1)
    if (weekNumber > 1) {
      const { data: previousWeek } = await supabase
        .from('week_progress')
        .select('status')
        .eq('student_id', params.studentId)
        .eq('week_number', weekNumber - 1)
        .single();

      if (!previousWeek || previousWeek.status !== 'completed') {
        return NextResponse.json(
          { error: 'Complete a semana anterior antes de iniciar esta' },
          { status: 400 }
        );
      }
    }

    // Criar week_progress
    const { data: weekProgress, error } = await supabase
      .from('week_progress')
      .insert({
        student_id: params.studentId,
        week_number: weekNumber,
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) {
      // Verificar se já existe
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Semana já iniciada' },
          { status: 409 }
        );
      }
      console.error('Erro ao criar week_progress:', error);
      return NextResponse.json(
        { error: 'Erro ao iniciar semana' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: weekProgress,
      message: `Semana ${weekNumber} iniciada com sucesso`
    }, { status: 201 });
  } catch (error) {
    console.error('Erro no endpoint POST /api/progress/.../week/[weekNumber]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/progress/[studentId]/week/[weekNumber] - Atualizar status
export async function PATCH(
  request: Request,
  { params }: { params: { studentId: string; weekNumber: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.studentId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = updateWeekProgressSchema.parse(body);

    const weekNumber = parseInt(params.weekNumber);

    // Preparar update data
    const updateData: any = { status };

    // Se marcando como completed, adicionar timestamp
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    // Atualizar week_progress
    const { data: weekProgress, error } = await supabase
      .from('week_progress')
      .update(updateData)
      .eq('student_id', params.studentId)
      .eq('week_number', weekNumber)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar week_progress:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar semana' },
        { status: 500 }
      );
    }

    // Se completou, atualizar current_week do estudante
    if (status === 'completed' && weekNumber < 8) {
      await supabase
        .from('students')
        .update({ current_week: weekNumber + 1 })
        .eq('id', params.studentId);
    }

    return NextResponse.json({
      data: weekProgress,
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro no endpoint PATCH /api/progress/.../week/[weekNumber]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

**app/api/checkpoints/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabase } from '@/lib/db/client';
import { createCheckpointSchema } from '@/lib/validations/progress';
import { z } from 'zod';

// GET /api/checkpoints?weekProgressId=[id] - Listar checkpoints
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const weekProgressId = searchParams.get('weekProgressId');

    if (!weekProgressId) {
      return NextResponse.json(
        { error: 'weekProgressId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar permissão via week_progress
    const { data: weekProgress } = await supabase
      .from('week_progress')
      .select('student_id')
      .eq('id', weekProgressId)
      .single();

    if (!weekProgress || weekProgress.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Buscar checkpoints
    const { data: checkpoints, error } = await supabase
      .from('checkpoints')
      .select('*')
      .eq('week_progress_id', weekProgressId)
      .order('created_at');

    if (error) {
      console.error('Erro ao buscar checkpoints:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar checkpoints' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: checkpoints });
  } catch (error) {
    console.error('Erro no endpoint GET /api/checkpoints:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/checkpoints - Criar checkpoint
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createCheckpointSchema.parse(body);

    // Verificar permissão
    const { data: weekProgress } = await supabase
      .from('week_progress')
      .select('student_id')
      .eq('id', validatedData.week_progress_id)
      .single();

    if (!weekProgress || weekProgress.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Criar checkpoint
    const { data: checkpoint, error } = await supabase
      .from('checkpoints')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar checkpoint:', error);
      return NextResponse.json(
        { error: 'Erro ao criar checkpoint' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: checkpoint,
      message: 'Checkpoint criado com sucesso'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro no endpoint POST /api/checkpoints:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

**app/api/checkpoints/[id]/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { supabase } from '@/lib/db/client';
import { updateCheckpointSchema } from '@/lib/validations/progress';
import { shouldAutoComplete } from '@/lib/utils/progress-calculator';
import { z } from 'zod';

// PATCH /api/checkpoints/[id] - Marcar checkpoint
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

    const body = await request.json();
    const { completed } = updateCheckpointSchema.parse(body);

    // Verificar permissão
    const { data: checkpoint } = await supabase
      .from('checkpoints')
      .select('week_progress_id, week_progress(student_id)')
      .eq('id', params.id)
      .single();

    if (!checkpoint || checkpoint.week_progress.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Atualizar checkpoint
    const { data: updatedCheckpoint, error } = await supabase
      .from('checkpoints')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar checkpoint:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar checkpoint' },
        { status: 500 }
      );
    }

    // Verificar auto-complete da semana
    const { data: allCheckpoints } = await supabase
      .from('checkpoints')
      .select('*')
      .eq('week_progress_id', checkpoint.week_progress_id);

    if (allCheckpoints && shouldAutoComplete(allCheckpoints)) {
      await supabase
        .from('week_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', checkpoint.week_progress_id);
    }

    return NextResponse.json({
      data: updatedCheckpoint,
      message: completed ? 'Checkpoint marcado como completo' : 'Checkpoint desmarcado'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro no endpoint PATCH /api/checkpoints/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

## 📋 File List

### Arquivos a Criar
- `app/api/progress/[studentId]/route.ts` - GET progresso completo
- `app/api/progress/[studentId]/week/[weekNumber]/route.ts` - POST iniciar, PATCH atualizar
- `app/api/checkpoints/route.ts` - GET listar, POST criar
- `app/api/checkpoints/[id]/route.ts` - PATCH atualizar
- `lib/validations/progress.ts` - Schemas Zod
- `lib/utils/progress-calculator.ts` - Cálculo de %

### Arquivos a Modificar
- `package.json` - Garantir zod instalado

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - **Segurança:** Validação de permissões em todos os endpoints
  - **Validação:** Schemas Zod corretos
  - **Lógica de Negócio:** Validação de semana anterior antes de iniciar nova
  - **Auto-complete:** Lógica de marcar semana completa automaticamente
  - **Performance:** Joins eficientes (week_progress + checkpoints)
  - **Error Handling:** Try-catch e mensagens apropriadas
  - **Type Safety:** TypeScript types corretos

### Business Logic Checks
- [ ] Não permitir iniciar semana N+2 sem completar N
- [ ] Auto-complete semana quando todos checkpoints marcados
- [ ] Atualizar `current_week` do estudante ao completar semana
- [ ] Timestamps (`completed_at`) corretos

## 🧪 Testes

### Validação Manual

**1. Buscar progresso completo:**
```bash
curl -X GET http://localhost:3000/api/progress/[YOUR_USER_ID] \
  -H "Cookie: next-auth.session-token=..."

# Resposta esperada:
{
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "week_number": 1,
      "status": "in_progress",
      "checkpoints": [...],
      "completion_percentage": 50
    }
  ]
}
```

**2. Iniciar semana:**
```bash
curl -X POST http://localhost:3000/api/progress/[USER_ID]/week/1 \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json"

# Resposta: Status 201
{
  "data": { ... },
  "message": "Semana 1 iniciada com sucesso"
}

# Tentar iniciar semana 3 sem completar 2:
# Status 400: "Complete a semana anterior antes de iniciar esta"
```

**3. Atualizar status da semana:**
```bash
curl -X PATCH http://localhost:3000/api/progress/[USER_ID]/week/1 \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Resposta:
{
  "data": {
    "status": "completed",
    "completed_at": "2026-02-12T..."
  },
  "message": "Status atualizado com sucesso"
}
```

**4. Listar checkpoints:**
```bash
curl -X GET "http://localhost:3000/api/checkpoints?weekProgressId=[WEEK_PROGRESS_ID]" \
  -H "Cookie: next-auth.session-token=..."

# Resposta:
{
  "data": [
    {
      "id": "uuid",
      "title": "Completar exercício 1",
      "completed": false
    }
  ]
}
```

**5. Marcar checkpoint:**
```bash
curl -X PATCH http://localhost:3000/api/checkpoints/[CHECKPOINT_ID] \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Resposta:
{
  "data": { ... },
  "message": "Checkpoint marcado como completo"
}

# Se era último checkpoint, semana auto-completa
```

### Cenários de Teste
- [ ] ✅ GET progresso retorna todas as semanas com checkpoints
- [ ] ✅ POST iniciar semana 1 funciona
- [ ] ❌ POST iniciar semana 3 sem completar 2 falha
- [ ] ✅ PATCH atualizar status adiciona `completed_at`
- [ ] ✅ Completar semana atualiza `current_week` do estudante
- [ ] ✅ GET checkpoints retorna apenas da semana especificada
- [ ] ✅ PATCH checkpoint marca/desmarca corretamente
- [ ] ✅ Marcar último checkpoint auto-completa semana
- [ ] ❌ Acessar progresso de outro usuário retorna 403

## 📚 Referências

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Supabase Joins](https://supabase.com/docs/guides/database/joins-and-nesting)
- [Zod Enums](https://zod.dev/?id=zod-enums)

## ⚠️ Notas Importantes

- **Regra de Negócio:** Estudante deve completar semanas sequencialmente (não pode pular)
- **Auto-complete:** Quando todos os checkpoints estão marcados, semana é automaticamente marcada como 'completed'
- **Performance:** Endpoint `/api/progress/[studentId]` retorna TODAS as semanas + checkpoints - considerar paginação em produção se houver muitas semanas
- **Cálculo de %:** Baseado em checkpoints completados / total de checkpoints

## ✅ Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Endpoints de progresso implementados (GET, POST, PATCH)
- [ ] Endpoints de checkpoints implementados (GET, POST, PATCH)
- [ ] Validação de semana sequencial funcionando
- [ ] Cálculo de % conclusão implementado
- [ ] Auto-complete de semana funcionando
- [ ] Input validation com Zod
- [ ] Validação de permissões em todos os endpoints
- [ ] Testes manuais aprovados (todos os cenários)
- [ ] CodeRabbit review aprovado
- [ ] Commit criado: `feat: implement progress and checkpoints API routes`

---

**Criado em:** 2026-02-12
**Atualizado em:** 2026-02-12
