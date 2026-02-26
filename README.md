# Minimum Wage Calculator

Mobile-first website that computes a required minimum hourly wage based on the formula:

- `B_r = H_r + F_p + T_t + I_p + U_p + M_p`
- `W_min,r = (B_r * (1 + s + k)) / H`

Where:

- `H_r`: fair market rent (ZIP autofill from HUD SAFMR 2BR snapshot)
- `F_p`: monthly food
- `T_t`: monthly transportation
- `I_p`: monthly internet + phone
- `U_p`: monthly utilities
- `M_p`: monthly health
- `s`: savings rate
- `k`: retirement contribution rate
- `H`: annual work hours

## Stack

- Vite + React + TypeScript
- Bun test runner (`bun test`)
- Static deployment ready for GitHub Pages

## Run locally

```bash
bun install
bun run dev
```

## Test

```bash
bun run test
```

## Lint

```bash
bun run lint
```

## Build

```bash
bun run build
```

## Data snapshots

- Rent: HUD SAFMR FY 2026 workbook (2BR extracted to ZIP-keyed JSON)
- Food: USDA latest monthly report page (adult/child monthly values extracted from official tables)

To refresh the HUD rent snapshot:

```bash
bash scripts/update-snapshots.sh
```

This refresh script updates both:

- `src/data/zip_rent_safmr_2026.json` from HUD SAFMR workbook
- `src/data/food_usda_2026_01.json` from USDA monthly report page tables
- `src/data/version.json` metadata timestamps and source labels

## Deployment

GitHub Actions workflow is included at `.github/workflows/deploy.yml` for GitHub Pages.

## Source links

- HUD FMR/SAFMR: <https://www.huduser.gov/portal/datasets/fmr.html>
- HUD FY 2026 SAFMR workbook: <https://www.huduser.gov/portal/datasets/fmr/fmr2026/fy2026_safmrs.xlsx>
- USDA food plan reports: <https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports>
