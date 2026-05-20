# Minimum Wage Calculator

Mobile-first website that computes a required minimum hourly wage based on the formula:

- `B_r = H_r + F_p + T_t + I_p + U_p + M_p`
- `W_min,r = (B_r * (1 + s + k)) / H`

Where:

- `H_r`: fair market rent (ZIP auto fill from HUD SAFMR 2BR snapshot)
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
- Vitest
- Static deployment ready for GitHub Pages

## Run Locally

```bash
ni
nr dev
```

## Test

```bash
nr test
```

## Lint

```bash
nr lint
```

To run Oxlint by itself:

```bash
nr oxc .
```

## Build

```bash
nr build
```

`ni` and `nr` come from `@antfu/ni`. In this repo they resolve to the same install and script commands you would otherwise run through `aube`.

## Data Snapshots

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

GitHub Pages deploys through GitHub Actions. The main workflow lives at `.github/workflows/deploy.yml`, and the shared setup steps live under `.github/actions/`.

- Pushes to `main` deploy automatically.
- To deploy immediately from CLI, run:

```bash
nr publish:pages
```

- To publish a different branch/ref:

```bash
nr publish:pages -- my-branch
```

- CI validation runs from `.github/workflows/ci.yml`.
- One-time repo setting: in GitHub `Settings -> Pages`, set Source to `GitHub Actions`.

## Source Links

- HUD FMR/SAFMR: <https://www.huduser.gov/portal/datasets/fmr.html>
- HUD FY 2026 SAFMR workbook: <https://www.huduser.gov/portal/datasets/fmr/fmr2026/fy2026_safmrs.xlsx>
- USDA food plan reports: <https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports>
