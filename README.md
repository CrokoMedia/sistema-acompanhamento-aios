# Sistema de Acompanhamento AIOS 8 Semanas

Plataforma interativa de aprendizado em formato de mapa mental para ensinar iniciantes a usar o Synkra AIOS.

## 📋 Visão Geral

Sistema que transforma usuários sem experiência prévia em desenvolvedores capazes de criar aplicações full stack usando agentes de IA especializados, através de um programa estruturado de 8 semanas.

## 🏗 Arquitetura

- **Frontend:** Next.js 14+ com React 18 e TypeScript
- **Backend:** Next.js API Routes com NextAuth.js
- **Database:** Supabase PostgreSQL
- **AI:** Anthropic Claude API
- **Deploy:** Vercel

## 📁 Estrutura do Projeto

```
sistema-acompanhamento-aios/
├── .aios-core/          # Framework AIOS
├── docs/
│   ├── prd/            # Product Requirements Documents
│   ├── epics/          # Epic definitions
│   ├── stories/        # User stories
│   └── architecture/   # Architecture docs
├── app/                # Next.js app (a ser criado)
├── lib/                # Utilities (a ser criado)
└── aios.config.yaml    # AIOS configuration
```

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Rodar testes
npm test

# Build para produção
npm run build
```

## 📖 Documentação

- [PRD Principal](docs/prd/sistema-acompanhamento-8-semanas.md)
- [Epics](docs/epics/)
- [Stories](docs/stories/)
- [Arquitetura](docs/architecture/)

## 🤖 Agentes AIOS

Este projeto utiliza os seguintes agentes:
- @analyst - Análise e requisitos
- @pm - Product management
- @po - Product owner
- @architect - Arquitetura técnica
- @dev - Desenvolvimento
- @qa - Quality assurance
- @data-engineer - Engenharia de dados
- @ux-design-expert - UX/UI Design
- @devops - DevOps e infraestrutura

## 📜 License

MIT - Pazos Media
