#!/usr/bin/env bash
set -euo pipefail
echo "[pre-install] Enabling Corepack and activating Yarn 4.1.1"
corepack enable
corepack prepare yarn@4.1.1 --activate
echo "[pre-install] Yarn version: $(yarn --version || true)"

