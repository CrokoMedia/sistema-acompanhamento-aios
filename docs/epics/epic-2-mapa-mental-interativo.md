# Epic 2: Mapa Mental Interativo

**Sprint:** 2 (Semanas 3-4)
**Prioridade:** P0 (Crítico)
**Status:** Planejado
**Agentes:** @ux-design-expert, @dev, @qa

---

## 🎯 Objetivos

Criar a interface visual do mapa mental com navegação interativa:
- Renderizar mapa mental das 8 semanas
- Implementar navegação expansível (expand/collapse)
- Sistema de checkpoints clicáveis
- Responsividade mobile-first

## 📊 User Stories Incluídas

- US-01: Visualização do mapa completo (completa)
- US-02: Expandir/colapsar nós (completa)
- US-03: Marcar checkpoints como concluídos (UI)

## ✅ Acceptance Criteria

- [ ] Componente `MindMap` renderiza estrutura de 8 semanas
- [ ] Navegação hierárquica funcional:
  - Click em semana expande/colapsa tópicos
  - Animação suave de transição
  - Estado de expansão persiste na sessão
- [ ] Checkpoints interativos:
  - Checkbox clicável em cada nó
  - Atualização visual imediata
  - Sincronização com backend (debounce 500ms)
- [ ] Visualização de progresso:
  - Barra de progresso por semana
  - % de conclusão total visível
  - Indicadores visuais (cores) para status
- [ ] Responsividade:
  - Mobile (< 768px): Visualização em lista
  - Tablet (768-1024px): Mapa simplificado
  - Desktop (> 1024px): Mapa completo expandido
- [ ] Acessibilidade (WCAG 2.1 AA):
  - Navegação por teclado (Tab, Enter, Space)
  - Screen reader support
  - Contraste de cores adequado
- [ ] Performance:
  - Renderização inicial < 2s
  - Interações < 100ms
  - Lazy loading de conteúdo detalhado

## 🎨 Componentes React

```
MindMap/
├── MindMapContainer.tsx       // Container principal
├── WeekNode.tsx               // Nó de semana
├── TopicNode.tsx              // Nó de tópico
├── CheckpointNode.tsx         // Nó de checkpoint
├── ProgressBar.tsx            // Barra de progresso
├── NavigationControls.tsx     // Controles de zoom/navegação
└── hooks/
    ├── useMindMapData.ts      // Hook para dados
    ├── useCheckpointToggle.ts // Hook para checkpoints
    └── useProgressTracking.ts // Hook para progresso
```

## 🎨 Design System

```typescript
// Tokens de design
const designTokens = {
  colors: {
    week: {
      notStarted: '#94a3b8',    // gray-400
      inProgress: '#3b82f6',    // blue-500
      completed: '#10b981',      // green-500
    },
    checkpoint: {
      unchecked: '#e5e7eb',     // gray-200
      checked: '#059669',        // green-600
    }
  },
  spacing: {
    nodeGap: '1rem',
    levelIndent: '2rem',
  },
  animation: {
    expandDuration: '300ms',
    expandEasing: 'ease-in-out',
  }
}
```

## 🔍 Quality Gates

**CodeRabbit Reviews:**
- [ ] Review de componentes React
- [ ] Análise de performance (re-renders)
- [ ] Validação de acessibilidade
- [ ] Check de responsividade

**Quality Checks:**
- [ ] Testes de componentes (React Testing Library)
- [ ] Testes de integração (Playwright)
- [ ] Lighthouse score > 90 (Performance, Accessibility)
- [ ] Storybook com todos os estados dos componentes

## 👥 Agentes Responsáveis

| Agente | Responsabilidade |
|--------|------------------|
| **@ux-design-expert** | Design de interface, UX flow, acessibilidade |
| **@dev** | Implementação de componentes React |
| **@qa** | Testes visuais, acessibilidade, responsividade |

## 🔗 Dependências

- **Epic 1:** API de progresso e checkpoints
- **Externas:** Biblioteca de gráficos (opcional: D3.js, React Flow)

## 📝 Stories Estimadas (10-12 stories)

1. Story 2.1: Componente MindMapContainer base
2. Story 2.2: Componente WeekNode com expand/collapse
3. Story 2.3: Componente TopicNode
4. Story 2.4: Componente CheckpointNode clicável
5. Story 2.5: Hook useMindMapData (fetch + cache)
6. Story 2.6: Hook useCheckpointToggle (otimistic UI)
7. Story 2.7: Barra de progresso por semana
8. Story 2.8: Barra de progresso geral
9. Story 2.9: Responsividade mobile
10. Story 2.10: Navegação por teclado
11. Story 2.11: Testes de componentes
12. Story 2.12: Testes E2E (Playwright)

## 📅 Cronograma

| Semana | Foco | Entregável |
|--------|------|------------|
| **Sem 3** | Componentes Core | Mapa renderizando, navegação básica |
| **Sem 4** | Interatividade + QA | Checkpoints funcionais, responsivo, testes |

## 📊 Definition of Done

- [ ] Todos os acceptance criteria completos
- [ ] Mapa mental totalmente funcional e interativo
- [ ] Lighthouse score > 90
- [ ] Testes de acessibilidade passando
- [ ] Responsivo em mobile/tablet/desktop
- [ ] CodeRabbit review aprovado
- [ ] Documentação de componentes (Storybook)
