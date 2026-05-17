# CLAUDE.md

Este arquivo fornece orientações ao Claude Code ao trabalhar com este repositório.

## Visão Geral

**vai-no-ru** — automação de reservas para o RU da UPF. Estudantes fazem login via Google OAuth, preenchem formulário semanal e o sistema processa reservas via cron job. Exibe cardápio diário e reservas do aluno.

## Comandos

Todos os comandos usam **Bun**.

```bash
bun dev            # todos os workspaces simultaneamente
bun dev:web        # apenas frontend (Vite)
bun dev:server     # apenas backend (Elysia)
bun typecheck      # tsc --build em todos os workspaces
bun format         # Prettier write
bun format:check   # Prettier check (seguro para CI)
cd apps/web && bun lint
```

## Arquitetura

Monorepo Bun workspaces:

```
apps/server      → Backend Elysia (Bun-native)
apps/web         → Frontend React 19 + Vite
packages/shared  → Schemas Zod & tipos (fonte única da verdade)
```

**`@repo/shared` é central.** Todos os schemas Zod vivem aqui, compartilhados entre frontend e backend. Tipos derivados via `z.infer<>`. **Nunca duplique schemas entre `apps/`.**

## Convenções

- **Conventional commits** com escopos em português: `feat(cardapio):`, `fix(reserva):` etc.
- **Path alias:** `@/` → `apps/web/src/`; `@repo/shared` → `packages/shared`
- **TypeScript strict mode** em todos os workspaces
- **Prettier:** single quotes, semicolons, 2 espaços, trailing commas, 80 chars
- **ESLint flat config** (v9+) no frontend; prefixo `_` para vars intencionalmente não usadas
- **Nomes em português** — variáveis e funções devem ter nomes em português

## Subagents disponíveis

Use os subagents para tarefas específicas:

- `frontend-engineer` — lógica de frontend (hooks, estado, React Query, formulários)
- `ui-engineer` — componentes MUI v7, tema, layout
- `backend-engineer` — rotas Elysia, services, auth, cron
- `db-specialist` — SQLite, queries, migração futura para Prisma
- `qa-specialist` — testes Vitest, qualidade de código
- `cto` — arquitetura, revisão estrutural, decisões técnicas
- `cicd-engineer` — Docker, docker-compose, GitHub Actions (CI/CD)
- `security-engineer` — revisão de segurança pós-implementação, vulnerabilidades, auth/JWT/CORS
