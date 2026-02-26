#!/usr/bin/env bash

set -euo pipefail

ref="${1:-main}"

if ! command -v gh >/dev/null 2>&1; then
	printf "GitHub CLI (gh) is required to trigger deployment.\n" >&2
	exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
	printf "Run 'gh auth login' before publishing.\n" >&2
	exit 1
fi

gh workflow run deploy.yml --ref "$ref"

printf "Triggered GitHub Pages deployment for ref '%s'.\n" "$ref"
printf "Track progress with: gh run list --workflow deploy.yml --limit 1\n"
