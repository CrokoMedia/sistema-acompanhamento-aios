# Story 1.8: Configurar CodeRabbit

**Epic:** Epic 1 - Setup e Infraestrutura
**Prioridade:** P0 | **Estimativa:** 2 pts | **Agente:** @qa
**Status:** Não Iniciado | **Dependências:** Repositório GitHub criado

---

## 📝 Descrição
Configurar CodeRabbit para code review automático em todos os PRs.

## 🎯 Acceptance Criteria
- [ ] CodeRabbit instalado no repositório GitHub
- [ ] Arquivo `.coderabbit.yaml` criado na raiz
- [ ] Configuração em português (pt-BR)
- [ ] Review automático habilitado
- [ ] High-level summary habilitado
- [ ] Bloqueio de merge em issues críticos configurado (opcional)

## 🛠 Configuração

**.coderabbit.yaml:**
```yaml
# CodeRabbit Configuration
language: pt-BR
early_access: true

reviews:
  auto_review:
    enabled: true
    drafts: false

  request_changes_workflow: true
  high_level_summary: true
  poem: false
  review_status: true

  tools:
    shellcheck:
      enabled: true

    github-checks:
      enabled: true
      timeout_ms: 90000

  path_filters:
    - "!**/*.md"
    - "!**/package-lock.json"
    - "!**/pnpm-lock.yaml"

chat:
  auto_reply: true

knowledge_base:
  learnings:
    scope: auto

  opt_out: false
```

## 📋 File List
- `.coderabbit.yaml` (criar na raiz do projeto)

## 🧪 Testes
1. Criar PR de teste
2. Verificar se CodeRabbit comenta automaticamente
3. Validar idioma português
4. Confirmar que resume mudanças (high-level summary)

## 📚 Referências
- [CodeRabbit Docs](https://docs.coderabbit.ai/)
- [Configuration Options](https://docs.coderabbit.ai/guides/configure-coderabbit)

## ✅ Definition of Done
- [ ] `.coderabbit.yaml` criado
- [ ] CodeRabbit instalado e ativo
- [ ] PR de teste aprovado com review automático
- [ ] Commit: `chore: configure CodeRabbit for automated code reviews`

---
**Criado em:** 2026-02-12
