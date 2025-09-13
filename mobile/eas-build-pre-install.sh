#!/usr/bin/env bash
set -euo pipefail
echo "[mobile pre-install] Enabling Corepack and activating Yarn stable"
if command -v corepack >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare yarn@stable --activate || true
  echo "[mobile pre-install] Yarn: $(yarn --version 2>/dev/null || echo 'unavailable')"
else
  echo "[mobile pre-install] Corepack not found in PATH"
fi

