# Story 1.10: Testes de Integração API

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P1 | **Estimativa:** 5 pts | **Agente:** @qa, @dev
**Status:** Não Iniciado | **Dependências:** Story 1.5, 1.6, 1.7

---

## 📝 Descrição
Criar suite de testes de integração para todos os endpoints API com coverage mínimo de 80%.

## 🎯 Acceptance Criteria
- [ ] Testes para `/api/auth/*`
- [ ] Testes para `/api/students/*`
- [ ] Testes para `/api/progress/*`
- [ ] Testes para `/api/checkpoints/*`
- [ ] Coverage > 80%
- [ ] Setup de banco de dados de teste
- [ ] Cleanup automático após testes

## 🛠 Stack de Testes
- Jest
- Supertest (HTTP assertions)
- @supabase/supabase-js (test client)

## 🧪 Exemplo de Teste

**tests/integration/api/students.test.ts:**
```typescript
import { createMocks } from 'node-mocks-http';
import { GET, PATCH } from '@/app/api/students/[id]/route';

describe('/api/students/[id]', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Setup: criar usuário de teste
    testUserId = 'test-uuid';
  });

  afterAll(async () => {
    // Cleanup: deletar dados de teste
  });

  describe('GET', () => {
    it('should return student data', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await GET(req as any, { params: { id: testUserId } });

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.id).toBe(testUserId);
    });

    it('should return 401 for unauthorized access', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await GET(req as any, { params: { id: 'other-user-id' } });
      expect(res._getStatusCode()).toBe(401);
    });
  });
});
```

## 📋 File List
- `tests/integration/api/auth.test.ts` (criar)
- `tests/integration/api/students.test.ts` (criar)
- `tests/integration/api/progress.test.ts` (criar)
- `tests/integration/api/checkpoints.test.ts` (criar)
- `jest.config.js` (atualizar)
- `tests/setup.ts` (criar - setup/teardown)

## 🔍 Quality Gates
### Coverage Mínimo
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## 🧪 Comandos
```bash
# Rodar todos os testes
npm test

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

## ✅ Definition of Done
- [ ] Suite completa de testes criada
- [ ] Coverage > 80%
- [ ] Testes passando no CI
- [ ] Documentação de testes
- [ ] Commit: `test: add API integration tests with 80%+ coverage`

---
**Criado em:** 2026-02-12
