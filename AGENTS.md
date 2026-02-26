# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Commands

```bash
bun run dev          # Dev server
bun run build        # Type-check + Vite build
bun run test         # Run all tests (Bun test runner)
bun run test:watch   # Watch mode
bun run lint         # Oxlint + Biome lint
bun run oxc          # Oxlint with type-aware analysis
bun run format       # Oxfmt formatter
bash scripts/update-snapshots.sh  # Refresh HUD/USDA data snapshots
```

## Skills

Your React-related skills are the most important to activate when you are working with React.

- `react-doctor` - Reviews React code for issues and outputs a score with diagnostics.
- `vercel-composition-patterns` - Guides you on React composition patterns to avoid boolean prop proliferation and improve maintainability.
- `vercel-react-best-practices` - Provides best practices for writing React code that is clean, efficient, and maintainable.
- `web-design-guidelines` - Offers guidelines for creating user-friendly and accessible web designs.

## Architecture

**Stack:** Vite + React 18 + TypeScript + Bun. Deployed as a static site to GitHub Pages.

### Calculation Engine

The core is a pure function `calculateRequiredWage(input: WageInput): WageResult` in `src/lib/calc.ts`. It computes:

```text
monthlyBudget = sum of all costs
monthlyGrossRequired = monthlyBudget × (1 + savingsRate + retirementRate)
hourlyRequired = (monthlyGrossRequired × 12) / annualWorkHours
```

### Data Layer

Static JSON snapshots imported at compile time:

- `src/data/zip_rent_safmr_2026.json` — HUD SAFMR 2BR rent by ZIP (6.7 MB)
- `src/data/food_usda_2026_01.json` — USDA food costs by household/tier

`src/lib/data-lookup.ts` provides the facade: `lookupZipRent(zip)`, `getHouseholdFoodBaseline(profile)`, `normalizeZip(value)`. Snapshots are refreshed via Python scripts in `scripts/`.

### State Management

Five custom hooks in `src/hooks/` own distinct domains — `useAssumptionsState`, `useProfileState`, `useCostsState`, `useLocationState`, `useResultState`. `<App>` composes these and passes specific interfaces down to leaf components. No prop drilling; each section is independently testable.

### Component Tree

```text
<App>
  <AppHeader>
  <CalculatorLayout>
    <CalculatorForm>
      <ProfileSection>      ← household size / food tier
      <LocationSection>     ← ZIP input
      <MonthlyCostsSection> ← 6 cost inputs
      <AssumptionsSection>  ← rates + work hours
    <ResultsPanel>
```

## Code Conventions

**Linting:** Oxlint (primary) + Biome (secondary). Key rules enforced:

- No barrel files (`index.ts` re-exports)
- No default exports (except `vite.config.ts`)
- No `null` (prefer `undefined`)
- Kebab-case filenames
- Max 120 chars/line, 120 lines/function, 7 parameters

**Custom Oxlint rule:** `require-named-effect-functions` (in `plugins/oxc/`) — React effect hooks (`useEffect`, `useLayoutEffect`, `useInsertionEffect`) must use named function declarations, not inline arrow functions.

**Commits:** Conventional Commits format enforced by commitlint.

**Pre-commit pipeline:** `oxc --fix` → `biome check --write` → `oxfmt` (JS/TS files).

## Bun Usage

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
