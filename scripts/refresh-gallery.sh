#!/usr/bin/env bash
# Regenerate the landing-site template gallery posters end-to-end.
# Run whenever a template's design changes. Builds the site, serves it, captures
# a fresh poster screenshot for every template, then you rebuild to publish them.
#
#   bash scripts/refresh-gallery.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ building landing…"
pnpm --filter landing build >/dev/null

echo "→ starting preview…"
pnpm --filter landing preview >/tmp/landing-preview.log 2>&1 &
PREVIEW_PID=$!
trap 'kill $PREVIEW_PID 2>/dev/null || true' EXIT

# Wait for the server.
for _ in $(seq 1 15); do
  if curl -s -o /dev/null http://localhost:4321/; then break; fi
  sleep 1
done

echo "→ shooting 60 posters…"
BASE_URL=http://localhost:4321 node scripts/shoot-gallery.mjs

echo "→ rebuilding with fresh posters…"
pnpm --filter landing build >/dev/null
echo "✓ done — posters in sites/landing/public/templates/shots/"
