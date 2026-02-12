# Story 1.4: Criar Schema de Database

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 (Crítico)
**Estimativa:** 5 pontos
**Agente Responsável:** @dev
**Colaborador:** @architect (revisão do schema)
**Status:** Não Iniciado
**Dependências:** Story 1.3

---

## 📝 Descrição

Como desenvolvedor, preciso criar o schema completo do banco de dados com todas as tabelas necessárias para armazenar dados de estudantes, progresso e checkpoints.

### 👥 Workflow de Colaboração

**Fase 1: Design do Schema (@architect - opcional)**
- Revisar requisitos do PRD
- Validar modelo de dados proposto (tabelas, relacionamentos, constraints)
- Aprovar estrutura antes da implementação

**Fase 2: Implementação (@dev - responsável principal)**
- Escrever migration SQL
- Configurar RLS policies
- Criar indexes
- Gerar TypeScript types
- Executar migration no Supabase
- Validar com dados de teste

> **Nota:** O @dev pode implementar diretamente seguindo o design especificado abaixo. Revisão do @architect é recomendada mas não bloqueante.

## 🎯 Acceptance Criteria

- [ ] Tabela `students` criada com colunas:
  - `id` (UUID, PK)
  - `email` (TEXT, UNIQUE, NOT NULL)
  - `name` (TEXT, NOT NULL)
  - `current_week` (INTEGER, DEFAULT 1)
  - `created_at` (TIMESTAMP, DEFAULT NOW())
  - `updated_at` (TIMESTAMP, DEFAULT NOW())
- [ ] Tabela `week_progress` criada com colunas:
  - `id` (UUID, PK)
  - `student_id` (UUID, FK -> students.id)
  - `week_number` (INTEGER, NOT NULL)
  - `status` (ENUM: 'not_started', 'in_progress', 'completed')
  - `completed_at` (TIMESTAMP, NULL)
  - `created_at` (TIMESTAMP, DEFAULT NOW())
- [ ] Tabela `checkpoints` criada com colunas:
  - `id` (UUID, PK)
  - `week_progress_id` (UUID, FK -> week_progress.id)
  - `title` (TEXT, NOT NULL)
  - `completed` (BOOLEAN, DEFAULT FALSE)
  - `completed_at` (TIMESTAMP, NULL)
  - `created_at` (TIMESTAMP, DEFAULT NOW())
- [ ] Tabela `map_nodes` criada com colunas:
  - `id` (UUID, PK)
  - `week` (INTEGER, NOT NULL)
  - `title` (TEXT, NOT NULL)
  - `type` (ENUM: 'concept', 'exercise', 'checkpoint', 'material')
  - `content` (TEXT)
  - `parent_id` (UUID, FK -> map_nodes.id, NULL)
  - `created_at` (TIMESTAMP, DEFAULT NOW())
- [ ] Row Level Security (RLS) policies configuradas
- [ ] Indexes criados para performance:
  - `students.email`
  - `week_progress.student_id`
  - `checkpoints.week_progress_id`
  - `map_nodes.week`
- [ ] Triggers de `updated_at` configurados
- [ ] Migration SQL gerada e documentada

## 🛠 Detalhes Técnicos

### SQL Migration

**migrations/001_initial_schema.sql:**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  current_week INTEGER DEFAULT 1 CHECK (current_week >= 1 AND current_week <= 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Week Progress table
CREATE TYPE week_status AS ENUM ('not_started', 'in_progress', 'completed');

CREATE TABLE week_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 8),
  status week_status DEFAULT 'not_started',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, week_number)
);

-- Checkpoints table
CREATE TABLE checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_progress_id UUID NOT NULL REFERENCES week_progress(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Map Nodes table
CREATE TYPE node_type AS ENUM ('concept', 'exercise', 'checkpoint', 'material');

CREATE TABLE map_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 8),
  title TEXT NOT NULL,
  type node_type NOT NULL,
  content TEXT,
  parent_id UUID REFERENCES map_nodes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_week_progress_student ON week_progress(student_id);
CREATE INDEX idx_checkpoints_week_progress ON checkpoints(week_progress_id);
CREATE INDEX idx_map_nodes_week ON map_nodes(week);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_nodes ENABLE ROW LEVEL SECURITY;

-- Students can only see their own data
CREATE POLICY "Students can view own data"
  ON students FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Students can update own data"
  ON students FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Week progress policies
CREATE POLICY "Students can view own progress"
  ON week_progress FOR SELECT
  USING (student_id::text = auth.uid()::text);

CREATE POLICY "Students can update own progress"
  ON week_progress FOR UPDATE
  USING (student_id::text = auth.uid()::text);

-- Checkpoints policies
CREATE POLICY "Students can view own checkpoints"
  ON checkpoints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM week_progress
      WHERE week_progress.id = checkpoints.week_progress_id
      AND week_progress.student_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Students can update own checkpoints"
  ON checkpoints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM week_progress
      WHERE week_progress.id = checkpoints.week_progress_id
      AND week_progress.student_id::text = auth.uid()::text
    )
  );

-- Map nodes are public (read-only for students)
CREATE POLICY "Map nodes are public"
  ON map_nodes FOR SELECT
  TO authenticated
  USING (true);
```

### TypeScript Types

**lib/db/types.ts:**
```typescript
export type WeekStatus = 'not_started' | 'in_progress' | 'completed';
export type NodeType = 'concept' | 'exercise' | 'checkpoint' | 'material';

export interface Student {
  id: string;
  email: string;
  name: string;
  current_week: number;
  created_at: string;
  updated_at: string;
}

export interface WeekProgress {
  id: string;
  student_id: string;
  week_number: number;
  status: WeekStatus;
  completed_at: string | null;
  created_at: string;
}

export interface Checkpoint {
  id: string;
  week_progress_id: string;
  title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface MapNode {
  id: string;
  week: number;
  title: string;
  type: NodeType;
  content: string | null;
  parent_id: string | null;
  created_at: string;
}
```

## 📋 File List

### Arquivos a Criar
- `migrations/001_initial_schema.sql` - Migration SQL
- `lib/db/types.ts` - TypeScript types
- `lib/db/schema.ts` - Schema documentation

### Arquivos a Modificar
- `README.md` - Documentar estrutura do banco

## 🔍 Quality Gates

### CodeRabbit Integration
- [ ] CodeRabbit irá revisar:
  - RLS policies (segurança)
  - Foreign keys e constraints
  - Indexes para performance
  - Naming conventions

### Database Checks
- [ ] Todas as tabelas criadas
- [ ] RLS habilitado em todas as tabelas
- [ ] Policies testadas
- [ ] Indexes funcionando
- [ ] Triggers executando

## 🧪 Testes

### Executar Migration
```bash
# No Supabase Dashboard:
# SQL Editor > New Query > Colar migration > Run
```

### Validação
```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Verificar policies
SELECT tablename, policyname FROM pg_policies;

-- Inserir dados de teste
INSERT INTO students (email, name)
VALUES ('test@example.com', 'Test User');
```

## 📚 Referências

- [Supabase Database](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)

## ✅ Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Migration executada com sucesso
- [ ] RLS policies testadas
- [ ] Indexes criados
- [ ] Types TypeScript gerados
- [ ] Dados de teste inseridos
- [ ] CodeRabbit review aprovado
- [ ] Commit: `feat: create database schema with RLS`

---

**Criado em:** 2026-02-12
