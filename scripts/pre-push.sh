#!/usr/bin/env bash

# This is meant to simulate `ci.yaml`.

set -euo pipefail

nr biome ci
nr oxc .
nr type-check
nr build
