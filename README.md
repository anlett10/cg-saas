# CG SaaS — Full-Stack Todos (Class 10)

A teaching monorepo: **web**, **mobile**, and **API** share one database and one todo contract. Add, edit, complete, and delete todos on web and mobile.

Built with **Elysia v2**, **TanStack Start**, **Expo SDK 54**, **Tamagui**, **Drizzle + SQLite**, and **Eden Treaty**.

---

## What you'll learn

- How a **monorepo** splits apps (`web`, `mobile`, `api`) and shared packages (`db`, `todos`)
- How **two clients** talk to one **standalone API**
- How **Eden Treaty** gives type-safe API calls from web and mobile
- How **TypeBox schemas** keep server and clients in sync
- How **SSR vs client rendering** differs (home vs todos on web)

---

## Prerequisites

- [Bun](https://bun.sh) 1.4+
- For mobile: [Expo Go](https://expo.dev/go) from the App Store (SDK 54) on your iPhone
- For API: local **Elysia v2 (kiana)** at `../elysia` (see [API setup](#api-setup))

---

## Quick start

```bash
cp .env.example .env
bun install
bun run db:push          # create SQLite schema (first time)
bun run dev              # API :3001 + Web :3000 + Mobile (Expo)
```

| App | URL / command |
| --- | --- |
| **Web** | http://localhost:3000 |
| **API** | http://localhost:3001 |
| **Mobile** | Scan QR with **Expo Go** on your phone (same Wi‑Fi as your Mac) |

### Mobile on iPhone (Expo Go)

1. Install **Expo Go** from the App Store (SDK 54).
2. Start API + mobile (same Wi‑Fi as your Mac):

   ```bash
   bun run --filter @cg-saas/api dev
   bun run --filter @cg-saas/mobile dev
   ```

3. Scan the QR code with the **Camera** app → open in **Expo Go**.

**API URL (physical device):** You do **not** need to set your LAN IP manually. When Expo connects to Metro (e.g. `192.168.1.30:8081`), the app reads that host and calls the API at **`http://192.168.1.30:3001`** — same machine, different port. Check the subtitle in the app: `API: http://192.168.x.x:3001`.

To override, set in `.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3001
```

Phone and Mac must be on the **same Wi‑Fi**. The API listens on all interfaces by default (Bun on `:3001`).

Run apps individually:

```bash
bun run --filter @cg-saas/api dev
bun run --filter @cg-saas/web dev
bun run --filter @cg-saas/mobile dev
```

---

## Project structure

```
cg-saas/
├── apps/
│   ├── api/          # Elysia v2 server (:3001)
│   ├── web/          # TanStack Start (:3000)
│   └── mobile/       # Expo SDK 54 (React Native)
├── packages/
│   ├── db/           # Drizzle + SQLite
│   └── todos/        # Shared TypeBox schemas + parseTodo
├── local.db          # SQLite database (gitignored)
├── .env              # Shared env (see .env.example)
├── turbo.json        # Task orchestration
└── package.json      # Bun workspaces root
```

### Architecture

```
┌──────────────┐     ┌──────────────┐
│  Web         │     │  Mobile      │
│  TanStack    │     │  Expo        │
│  Start       │     │              │
└──────┬───────┘     └──────┬───────┘
       │  Eden Treaty       │
       └─────────┬──────────┘
                 ▼
       ┌──────────────────┐
       │  @cg-saas/api    │  Elysia v2  :3001
       └─────────┬────────┘
                 ▼
       ┌──────────────────┐
       │  @cg-saas/db     │  Drizzle → local.db
       └──────────────────┘

       @cg-saas/todos  ← shared contract (API + web + mobile)
```

---

## Environment variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL=file:../../local.db   # from apps/api — points to monorepo root
PORT=3001
CORS_ORIGIN=http://localhost:3000
VITE_API_URL=http://localhost:3001
EXPO_PUBLIC_API_URL=http://localhost:3001   # optional override; see mobile section
```

**Mobile API URL** (`apps/mobile/src/env.ts`):

| Context | Resolved URL |
| --- | --- |
| **iPhone / Expo Go (physical device)** | Auto: Metro host + port `3001` (e.g. Metro `192.168.1.30:8081` → API `http://192.168.1.30:3001`) |
| **iOS Simulator** | `http://localhost:3001` |
| **Android emulator** | `http://10.0.2.2:3001` (when env unset and no Expo dev host) |
| **Override** | Set `EXPO_PUBLIC_API_URL` to any reachable base URL |

Loopback values in `.env` (`localhost`, `127.0.0.1`) are replaced on a physical device when Expo provides a dev-server host.

---

## API setup

The API depends on **Elysia v2 (kiana)** from a local checkout:

```json
"elysia": "file:../../../elysia"
```

Clone or link the [Elysia kiana branch](https://github.com/elysiajs/elysia/tree/kiana) next to this repo:

```
COGRIND/
├── elysia/      ← kiana branch
└── cg-saas/     ← this project
```

---

## Where the code lives

### Shared packages

| Package | Role |
| --- | --- |
| `packages/db` | Drizzle schema, SQLite client, `db:push` / `db:studio` |
| `packages/todos` | `todoSchema`, request/response TypeBox schemas, `parseTodo()` |

### API (`apps/api`)

| File | Role |
| --- | --- |
| `src/index.ts` | Elysia app, health route, exports `type App` for Eden |
| `src/cors.ts` | Manual CORS plugin (`beforeHandle('global', …)`) |
| `src/routes/todos.ts` | CRUD at `/api/todos` |

### Web (`apps/web`)

| File | Role |
| --- | --- |
| `tamagui.config.ts` | Tamagui theme + Inter font (shared look with mobile) |
| `vite.config.ts` | `@tamagui/vite-plugin` + TanStack Start |
| `src/tamagui/` | Theme, fonts, `TamaguiAppProvider`, Button/Input/GradientBackground |
| `src/components/_backup/base-ui/` | Archived Base UI + Tailwind components (reference only) |
| `src/lib/api.ts` | Eden client (`getApiClient()` — SSR + browser) |
| `src/lib/todos/api.ts` | `getTodos`, `createTodo`, … + error handling |
| `src/routes/index.tsx` | Home + API health (SSR, Tamagui) |
| `src/routes/todos.tsx` | Todos page (`ssr: 'data-only'`) |
| `src/components/todos/*` | Tamagui UI: list, form, item |

### Mobile (`apps/mobile`)

| File | Role |
| --- | --- |
| `tamagui.config.ts` | Tamagui theme + Inter font |
| `babel.config.js` | `@tamagui/babel-plugin` + Reanimated |
| `src/providers/AppProvider.tsx` | `TamaguiProvider` + font loading |
| `src/env.ts` | Resolves API URL (Expo dev host → `:3001`, emulator fallbacks) |
| `src/lib/api.ts` | Eden client singleton |
| `src/lib/todos.ts` | CRUD via Treaty + `parseTodo` |
| `src/tamagui/` | Takeout-inspired theme, fonts, Button/Input/GradientBackground |
| `src/navigation/AppTabs.tsx` | Bottom tabs — Home + Todos |
| `src/screens/HomeScreen.tsx` | Welcome + API health (mirrors web `/`) |
| `src/screens/TodosScreen.tsx` | Full CRUD todos list |
| `App.tsx` | `NavigationContainer` + tab navigator |

---

## Eden Treaty pattern

Both clients import the server type and call the same routes:

```ts
import type { App } from "@cg-saas/api";
import { treaty } from "@elysia/eden";

// Web: getApiClient() — isomorphic for TanStack Start
// Mobile: api = treaty<App>(env.API_URL, { parseDate: false })

await api.api.todos.get();           // GET /api/todos
await api.api.todos.post({ title }); // POST /api/todos
await api.health.get();              // GET /health
```

`parseDate: false` keeps timestamps as ISO strings. `parseTodo()` validates responses at the boundary (shared with `@cg-saas/todos`).

---

## Follow one feature: "Add a todo" (web)

1. **Form submit** — `apps/web/src/components/todos/create-todo-form.tsx`
2. **`useCreateTodo()`** — `apps/web/src/hooks/use-todo-mutations.ts`
3. **`createTodo(title)`** — `apps/web/src/lib/todos/api.ts`
4. **Eden POST** — `apps/web/src/lib/api.ts` → `api.api.todos.post()`
5. **API route** — `apps/api/src/routes/todos.ts`
6. **Database** — `@cg-saas/db` via Drizzle
7. **`parseTodo()`** — `@cg-saas/todos`
8. React Query refreshes the list

---

## Commands

```bash
bun run dev              # all apps (turbo)
bun run build            # production build (api + web)
bun run type-check       # TypeScript all packages
bun run test             # vitest (web)

# Database
bun run db:push          # sync schema to local.db
bun run db:studio        # Drizzle Studio UI
bun run db:generate      # generate migrations
```

---

## Teaching order (suggested)

1. **API + DB** — Elysia routes, Drizzle, `@cg-saas/todos` schemas
2. **Web** — TanStack Start, Eden, todos UI
3. **Monorepo** — why `packages/` exist, Turbo, workspaces
4. **Mobile** — Expo + same Treaty client + shared schema

---

## Glossary

| Tool | Role |
| --- | --- |
| **Bun** | Runtime, package manager, workspaces |
| **Turbo** | Runs `dev` / `build` / `type-check` across packages |
| **Elysia v2** | API server framework |
| **Eden Treaty** | Type-safe HTTP client from `App` type |
| **TanStack Start** | React SSR framework (web) |
| **TanStack Query** | Data fetching + cache (web) |
| **Expo** | React Native toolchain (mobile) |
| **Tamagui** | Cross-platform UI kit (web + mobile) — [tamagui.dev](https://tamagui.dev) |
| **Drizzle** | TypeScript ORM |
| **SQLite** | File database (`local.db`) |
| **TypeBox** | JSON schema + validation (`@cg-saas/todos`) |

---

## Exercises

1. **Easy:** Change the todos page title (web + mobile).
2. **Easy:** Add a footer on the home page with your name.
3. **Medium:** Add pull-to-refresh feedback or a completed/total count on mobile.
4. **Medium:** Show completed vs total count on web.
5. **Harder:** Add a `priority` field — touch `packages/db`, `packages/todos`, API route, web UI.

---

## Learn more

- [Elysia](https://elysiajs.com) · [Eden Treaty](https://elysiajs.com/eden/overview)
- [TanStack Start](https://tanstack.com/start) · [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)
- [Expo SDK 54](https://docs.expo.dev) · [Tamagui + Expo](https://tamagui.dev/docs/guides/expo) · [Expo + Elysia](https://elysiajs.com/integrations/expo.html)
- [Drizzle ORM](https://orm.drizzle.team)
- [Turborepo](https://turbo.build)

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Expo Go “incompatible” | Mobile is SDK 54 — update Expo Go from App Store, restart `bun run --filter @cg-saas/mobile dev` |
| Tamagui / Metro errors after install | Clear cache: `bun run --filter @cg-saas/mobile dev -- -c` |
| `setup-expo-linear-gradient` warning | Ensure `index.ts` imports `@tamagui/native/setup-expo-linear-gradient` and `expo-linear-gradient` is installed |
| `[Reanimated] Reduced motion` warning | iPhone **Settings → Accessibility → Motion → Reduce Motion** — dev-only; app still works |
| Mobile can't load todos | Confirm subtitle shows `API: http://192.168.x.x:3001` (not `:8081`). API must be running. Same Wi‑Fi. Reload Expo Go. |
| API URL shows `:8081` | Wrong port — reload after code update; API uses `:3001`, Metro uses `:8081` |
| API DB errors | Check `.env` `DATABASE_URL=file:../../local.db`; run `bun run db:push` |
| CORS on web | Restart API after `.env` changes; CORS uses `beforeHandle('global')` |
| `expo/tsconfig.base` not found | Run `bun install`; mobile extends `./node_modules/expo/tsconfig.base.json` |
| Port in use | Stop processes on 3000 / 3001 before `bun run dev` |
