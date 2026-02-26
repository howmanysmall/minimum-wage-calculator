#!/usr/bin/env bash

bun build \
	--target=bun \
	--outfile=./plugins/oxc/small-rules.js \
	./plugins/oxc/typescript/small-rules/index.ts \
	--format esm
