#!/usr/bin/env python3
"""Build ZIP -> 2BR rent snapshot from HUD SAFMR workbook."""

from __future__ import annotations

import argparse
import json
import zipfile
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NAMESPACES = {"a": MAIN_NS}


def load_shared_strings(workbook: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in workbook.namelist():
        return []

    root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for si in root.findall("a:si", NAMESPACES):
        text = "".join((node.text or "") for node in si.findall(".//a:t", NAMESPACES))
        strings.append(text)
    return strings


def read_cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    value_node = cell.find("a:v", NAMESPACES)
    if value_node is None or value_node.text is None:
        return ""

    if cell.attrib.get("t") == "s":
        return shared_strings[int(value_node.text)]

    return value_node.text


def parse_hud_safmr(input_xlsx: Path, source_year: int, source_url: str) -> dict:
    with zipfile.ZipFile(input_xlsx) as workbook:
        shared_strings = load_shared_strings(workbook)
        sheet = ET.fromstring(workbook.read("xl/worksheets/sheet1.xml"))
        rows = sheet.findall(".//a:sheetData/a:row", NAMESPACES)

    records: list[dict] = []
    # Column A: ZIP Code, B: Area Code, C: Area Name, J: SAFMR 2BR
    for row in rows[1:]:
        cells = {cell.attrib.get("r", ""): read_cell_value(cell, shared_strings) for cell in row.findall("a:c", NAMESPACES)}

        row_id = row.attrib.get("r", "")
        zip_code = cells.get(f"A{row_id}", "").strip()
        area_code = cells.get(f"B{row_id}", "").strip()
        area_name = cells.get(f"C{row_id}", "").strip()
        two_bedroom_raw = cells.get(f"J{row_id}", "").strip()

        if not (zip_code and len(zip_code) == 5 and zip_code.isdigit()):
            continue

        try:
            two_bedroom = int(round(float(two_bedroom_raw)))
        except ValueError:
            continue

        records.append(
            {
                "zip": zip_code,
                "hudAreaCode": area_code,
                "hudAreaName": area_name,
                "twoBedroom": two_bedroom,
                "sourceYear": source_year,
            }
        )

    return {
        "sourceYear": source_year,
        "sourceUrl": source_url,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "recordCount": len(records),
        "records": records,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build ZIP 2BR rent snapshot from HUD SAFMR workbook")
    parser.add_argument("--input", required=True, type=Path, help="Path to fyXXXX_safmrs.xlsx")
    parser.add_argument("--output", required=True, type=Path, help="Output JSON path")
    parser.add_argument("--year", required=True, type=int, help="HUD SAFMR source year")
    parser.add_argument("--source-url", required=True, help="HUD source URL")
    args = parser.parse_args()

    payload = parse_hud_safmr(args.input, args.year, args.source_url)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as output_file:
        json.dump(payload, output_file, ensure_ascii=True, separators=(",", ":"))

    print(f"Wrote {payload['recordCount']} ZIP rent records -> {args.output}")


if __name__ == "__main__":
    main()
