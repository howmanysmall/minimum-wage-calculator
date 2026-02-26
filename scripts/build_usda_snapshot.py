#!/usr/bin/env python3
"""Build USDA food snapshot JSON from the USDA monthly report page."""

from __future__ import annotations

import argparse
import html
import json
import re
import urllib.request
from pathlib import Path


def fetch_text(url: str) -> str:
    with urllib.request.urlopen(url, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def clean_html_text(raw: str) -> str:
    text = re.sub(r"<[^>]+>", "", raw)
    text = html.unescape(text)
    text = text.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_currency(value: str) -> float:
    cleaned = value.replace(",", "")
    cleaned = re.sub(r"[^0-9.\-]", "", cleaned)
    if not cleaned:
        raise ValueError(f"Unable to parse currency value: {value!r}")
    return float(cleaned)


def extract_table_after_heading(page_html: str, heading_pattern: str) -> str:
    heading_match = re.search(heading_pattern, page_html, re.IGNORECASE)
    if not heading_match:
        raise ValueError(f"Heading not found for pattern: {heading_pattern}")

    segment = page_html[heading_match.end() :]
    table_match = re.search(r"<table[^>]*>.*?</table>", segment, re.IGNORECASE | re.DOTALL)
    if not table_match:
        raise ValueError(f"Table not found after heading pattern: {heading_pattern}")

    return table_match.group(0)


def table_rows(table_html: str) -> list[list[str]]:
    rows: list[list[str]] = []
    for row_html in re.findall(r"<tr[^>]*>(.*?)</tr>", table_html, re.IGNORECASE | re.DOTALL):
        cells_raw = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row_html, re.IGNORECASE | re.DOTALL)
        if not cells_raw:
            continue
        cells = [clean_html_text(cell) for cell in cells_raw]
        rows.append(cells)
    return rows


def parse_thrifty_rows(rows: list[list[str]]) -> dict[str, int]:
    section = ""
    female_20_50 = None
    male_20_50 = None
    child_9_11 = None

    for cells in rows:
        label = cells[0].lower() if cells else ""

        if label == "female":
            section = "female"
            continue
        if label == "male":
            section = "male"
            continue
        if label == "child":
            section = "child"
            continue

        if len(cells) < 3:
            continue

        if label == "20-50 years":
            try:
                monthly = parse_currency(cells[2])
            except ValueError:
                continue
            if section == "female":
                female_20_50 = monthly
            elif section == "male":
                male_20_50 = monthly

        if label == "9-11 years" and section == "child":
            try:
                child_9_11 = parse_currency(cells[2])
            except ValueError:
                continue

    if female_20_50 is None or male_20_50 is None or child_9_11 is None:
        raise ValueError("Missing required Thrifty table values for 20-50 years and/or 9-11 years.")

    return {
        "adult": int(round((female_20_50 + male_20_50) / 2)),
        "child": int(round(child_9_11)),
    }


def parse_three_level_rows(rows: list[list[str]]) -> dict[str, dict[str, int]]:
    section = ""
    female_20_50 = None
    male_20_50 = None
    child_9_11 = None

    for cells in rows:
        label = cells[0].lower() if cells else ""

        if label == "female":
            section = "female"
            continue
        if label == "male":
            section = "male"
            continue
        if label == "child":
            section = "child"
            continue

        if len(cells) < 7:
            continue

        try:
            row_values = {
                "low": parse_currency(cells[2]),
                "moderate": parse_currency(cells[4]),
                "liberal": parse_currency(cells[6]),
            }
        except ValueError:
            continue

        if label == "20-50 years":
            if section == "female":
                female_20_50 = row_values
            elif section == "male":
                male_20_50 = row_values

        if label == "9-11 years" and section == "child":
            child_9_11 = row_values

    if female_20_50 is None or male_20_50 is None or child_9_11 is None:
        raise ValueError("Missing required three-level values for 20-50 years and/or 9-11 years.")

    adult = {
        tier: int(round((female_20_50[tier] + male_20_50[tier]) / 2))
        for tier in ("low", "moderate", "liberal")
    }
    child = {
        tier: int(round(child_9_11[tier]))
        for tier in ("low", "moderate", "liberal")
    }

    return {"adult": adult, "child": child}


def parse_usda_food_snapshot(source_url: str) -> dict:
    page_html = fetch_text(source_url)

    month_year_match = re.search(
        r"Cost of Food at Home at Three Levels:\s*U\.S\. Average,\s*([A-Za-z]+)\s+(\d{4})",
        page_html,
        re.IGNORECASE,
    )
    if not month_year_match:
        raise ValueError("Unable to find latest month/year label on USDA page.")

    source_month = month_year_match.group(1)
    source_year = int(month_year_match.group(2))

    thrifty_table = extract_table_after_heading(
        page_html,
        rf"Thrifty Food Plan:\s*{re.escape(source_month)}\s+{source_year}",
    )
    three_level_table = extract_table_after_heading(
        page_html,
        rf"Cost of Food at Home at Three Levels:\s*U\.S\. Average,\s*{re.escape(source_month)}\s+{source_year}",
    )

    thrifty = parse_thrifty_rows(table_rows(thrifty_table))
    three_levels = parse_three_level_rows(table_rows(three_level_table))

    adult_per_person = {
        "thrifty": thrifty["adult"],
        "low": three_levels["adult"]["low"],
        "moderate": three_levels["adult"]["moderate"],
        "liberal": three_levels["adult"]["liberal"],
    }

    child_per_person = {
        "thrifty": thrifty["child"],
        "low": three_levels["child"]["low"],
        "moderate": three_levels["child"]["moderate"],
        "liberal": three_levels["child"]["liberal"],
    }

    return {
        "sourceYear": source_year,
        "sourceMonth": source_month,
        "sourceUrl": source_url,
        "notes": (
            "Derived from USDA latest monthly report tables. Adult values are average of female/male 20-50 years; "
            "child values use 9-11 years row."
        ),
        "singleAdult": adult_per_person,
        "adultPerPerson": adult_per_person,
        "childPerPerson": child_per_person,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build USDA food snapshot JSON from monthly report page")
    parser.add_argument("--output", required=True, type=Path, help="Output JSON path")
    parser.add_argument(
        "--source-url",
        required=True,
        help="USDA monthly report page URL (e.g. /research/cnpp/usda-food-plans/cost-food-monthly-reports)",
    )
    args = parser.parse_args()

    payload = parse_usda_food_snapshot(args.source_url)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as output_file:
        json.dump(payload, output_file, ensure_ascii=True, separators=(",", ":"))

    print(f"Wrote USDA food snapshot ({payload['sourceMonth']} {payload['sourceYear']}) -> {args.output}")


if __name__ == "__main__":
    main()
