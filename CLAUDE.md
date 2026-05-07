# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## Visão Geral do Projeto

**vai-no-ru** é um sistema de automação de reservas para o Restaurante Universitário (RU) da UPF. Estudantes fazem login via Google OAuth, preenchem um formulário semanal e o sistema processa as reservas automaticamente via cron job. Também exibe o cardápio diário e as reservas feitas pelo aluno.

## Comandos

Todos os comandos utilizam **Bun** como gerenciador de pacotes e runtime.

```bash
# Desenvolvimento
bun dev            # Roda todos os workspaces simultaneamente
bun dev:web        # Apenas o frontend (servidor Vite)
bun dev:server     # Apenas o backend (servidor Elysia)

# Verificação de tipos
bun typecheck      # tsc --build em todos os workspaces

# Formatação
bun format         # Prettier write
bun format:check   # Prettier check (seguro para CI)

# Lint (apenas frontend)
cd apps/web && bun lint

# Rodar o servidor diretamente
cd apps/server && bun run src/index.ts
```

Nenhum test runner está configurado.

## Arquitetura

Monorepo com Bun workspaces:

```
apps/server      → Backend Elysia (Bun-native)
apps/web         → Frontend React 19 + Vite
packages/shared  → Schemas Zod & tipos (fonte única da verdade)
```

### Pacote Compartilhado (`packages/shared`)

O pacote `@repo/shared` é **central para a arquitetura**. Todos os schemas Zod vivem aqui e são compartilhados entre a validação do frontend e do backend:

- `ruFormSchema` — campos do formulário de reserva
- `refeicaoEnum`, `perfilEnum` — valores dos enums de dropdowns
- `cardapioDiaSchema`, `getCardapioQuerySchema` — tipos do cardápio
- `GOOGLE_ENTRIES` — mapeamento dos IDs de entrada do Google Forms

Os tipos TypeScript são derivados via `z.infer<>`. Nunca duplique definições de schema entre os `apps/`.

### Backend (`apps/server`)

- **Framework:** Elysia (Bun-first, similar ao Express mas com I/O nativo do Bun)
- **Banco de dados:** SQLite via bindings nativos do Bun (`instance.db` na raiz do servidor) - futuramente será atualizado para usar uma ORM como o Prisma
- **Auth:** Google OAuth (`google-auth-library`) → emite JWT (`@elysiajs/jwt`); rotas protegidas usam guard Bearer token via `onBeforeHandle`
- **Estrutura:** `routes/` → `services/` (lógica de negócio) → SQLite; rotas são enxutas, serviços contêm a lógicas
- **Cron:** `@elysiajs/cron` executa `ru-automation.ts` às 9:30 e 15:30 nos dias de semana para processar reservas pendentes

Endpoints principais:

- `POST /auth/google` — verifica token Google, cria/atualiza usuário, retorna JWT
- `POST /reserva` — cria/atualiza reservas (JWT obrigatório)
- `GET /cardapio` — consulta cardápio com filtros (público)

### Frontend (`apps/web`)

- **Framework:** React 19 + Vite + TypeScript
- **UI:** Material-UI (MUI) v7 com tema centralizado em `src/styles/theme.ts`
- **Roteamento:** React Router; auth guard em `src/routes/routes.tsx` — verifica Zustand store, redireciona não-autenticados para `/login`
- **Estado:** Zustand (`src/store/auth/authStore.ts`) com persistência em `localStorage` para JWT + dados do usuário
- **Data fetching:** TanStack React Query com query keys centralizadas em `src/api/queryKeys.ts`
- **HTTP:** Axios client em `src/api/api.ts` com interceptor que injeta Bearer JWT automaticamente em todas as requisições
- **Formulários:** React Hook Form + Zod resolver; lógica de formulário extraída em custom hooks (ex: `useFormulario.ts`)
- **Notificações:** Sistema de toast customizado via `ToastContext` + hook `useToast`

Fluxo de dados: Google OAuth popup → token → `POST /auth/google` → JWT armazenado no Zustand → interceptor Axios anexa JWT em todas as requisições subsequentes.

## Convenções

- **Conventional commits** com escopos em português: `feat(cardapio):`, `fix(reserva):`, `refactor(auth):` etc.
- **Path alias:** `@/` mapeia para `apps/web/src/`; `@repo/shared` mapeia para `packages/shared`
- **TypeScript strict mode** habilitado em todos os workspaces
- **Prettier:** single quotes, semicolons, indentação de 2 espaços, trailing commas, print width de 80 caracteres
- **ESLint flat config** (v9+) no frontend; convenção de prefixo underscore para variáveis intencionalmente não utilizadas
