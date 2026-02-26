#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HUD_YEAR="2026"
HUD_URL="https://www.huduser.gov/portal/datasets/fmr/fmr2026/fy2026_safmrs.xlsx"
USDA_URL="https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports"
TMP_DIR="${TMPDIR:-/tmp}"
HUD_XLSX_PATH="$TMP_DIR/fy2026_safmrs.xlsx"

printf 'Downloading HUD SAFMR workbook...\n'
curl -L --fail "$HUD_URL" -o "$HUD_XLSX_PATH"

printf 'Building ZIP rent snapshot JSON...\n'
python3 "$ROOT_DIR/scripts/build_hud_snapshot.py" \
	--input "$HUD_XLSX_PATH" \
	--output "$ROOT_DIR/src/data/zip_rent_safmr_2026.json" \
	--year "$HUD_YEAR" \
	--source-url "$HUD_URL"

printf 'Building USDA food snapshot JSON...\n'
python3 "$ROOT_DIR/scripts/build_usda_snapshot.py" \
	--output "$ROOT_DIR/src/data/food_usda_2026_01.json" \
	--source-url "$USDA_URL"

cat >"$ROOT_DIR/src/data/version.json" <<JSON
{
  "rentAsOf": "HUD SAFMR FY ${HUD_YEAR} (2BR)",
  "foodAsOf": "USDA Food Plans latest monthly report snapshot",
  "appBuiltAt": "$(date -u +%F)"
}
JSON

printf 'Done. Snapshots and src/data/version.json were updated.\n'
