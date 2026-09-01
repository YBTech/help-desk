# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies
npm run install:all

# Run both client and server in dev mode (concurrently)
npm run dev

# Run server only
cd server && npm run dev        # tsx watch (hot reload)
cd server && npm run build      # tsc compile
cd server && npm start          # run compiled dist/

# Run client only
cd client && npm run dev        # Vite dev server
cd client && npm run build      # tsc + vite build
cd client && npm run lint       # ESLint
```

**Ports**: Frontend → http://localhost:5173, API → http://localhost:4000/api

## Architecture

### Server (`/server`)

Layered module architecture. Each feature (ticket, user) follows the same pattern:

```
modules/<feature>/
  <feature>.routes.ts       # Express router, mounts on /api/<feature>
  <feature>.controller.ts   # Parses req/res, calls service
  <feature>.service.ts      # Business logic, validation, throws domain errors
  <feature>.repository.ts   # Drizzle ORM queries against SQLite
  <feature>.schema.ts       # Zod schemas for input validation
  <feature>.types.ts        # TypeScript types/interfaces
```

Routes are aggregated in `src/routes.ts` and mounted at `/api` in `src/app.ts`.

**Database**: In-memory SQLite via `better-sqlite3` + Drizzle ORM. The DB is initialized fresh on every server start and seeded with data from `src/db/seed.ts`. Schema lives in `src/db/schema.ts`.

**Error handling**: Throw typed errors from `src/shared/errors.ts` (`NotFoundError`, `ValidationError`, `ConflictError`) — the `errorHandler` middleware in `src/middleware/errorHandler.ts` converts them to HTTP responses.

**SLA deadlines** are auto-calculated at ticket creation based on priority: urgent=4h, high=8h, medium=24h, low=72h.

**Status transitions** are enforced: `open → in_progress → resolved → closed`. Transitions can go backward: `in_progress → open`, `resolved → open`, `closed → open`.

### Client (`/client`)

Feature-based architecture under `src/features/<feature>/`. Shared code lives in `src/shared/`.

```
features/<feature>/
  components/    # React components (with .module.css colocated)
  hooks/         # Feature-specific custom hooks
  api/           # Axios calls to the backend
  types/         # Feature-specific TypeScript types
```

**Routing**: React Router v6 with `createBrowserRouter`. All routes share a `Layout` (Navbar + `<Outlet>`). Router defined in `src/app/router.tsx`.

**API calls**: Axios, base URL from `VITE_API_URL` env var (defaults to `http://localhost:4000/api`). Each feature has its own `api/` module; there is no centralized API client.

**Styling**: CSS Modules (`.module.css` files colocated with components).

## Seed Accounts

Login (no password) with: `admin`, `alice`, `bob`, `carol`, `dave`
