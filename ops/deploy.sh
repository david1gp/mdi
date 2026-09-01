#!/usr/bin/env bash
set -euo pipefail

echo "Running the local @adaptive-ds/mdi deployment preflight."
bun run build
bun test
