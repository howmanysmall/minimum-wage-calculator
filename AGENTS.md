# Agents Guide

This file provides guidance to agents when working with code in this repository.

## Commands

```bash
aube run dev          # Dev server
aube run build        # Type-check + Vite build
aube run test         # Run all tests (Vitest)
aube run test:watch   # Watch mode
aube run lint         # Oxlint + Biome lint
aube run oxc          # Oxlint with type-aware analysis
aube run format       # Oxfmt formatter
bash scripts/update-snapshots.sh  # Refresh HUD/USDA data snapshots
```

## Skills

Your React-related skills are the most important to activate when you are working with React.

## Architecture

**Stack:** Vite + React 18 + TypeScript + Aube + Node. Deployed as a static site to GitHub Pages.

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

```tsx
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

**Pre-commit pipeline:** `oxlint --fix` → `biome check --write` → `oxfmt` (JS/TS files).
