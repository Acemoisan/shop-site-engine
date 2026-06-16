#!/usr/bin/env bash
# Unattended trial loop: every 10 min, audit the next 2 sites (rotating through
# sites.json) and append results to results/. Runs the first batch immediately.
set -u
cd "C:/Users/aidan/Space/Studio0rbit/Websites/.claude/worktrees/site-audit-build/packages/audit" || exit 1
N=8        # number of sites in sites.json
PAIR=2     # sites per tick
i=0
mkdir -p test-runs/results
echo "=== loop started $(date -u +%FT%TZ) pid=$$ ===" >> test-runs/results/loop.log
while true; do
  a=$(( i % N )); b=$(( (i + 1) % N ))
  echo "--- batch start $(date -u +%FT%TZ) indices=$a,$b ---" >> test-runs/results/loop.log
  pnpm tsx test-runs/runner.ts "$a" "$b" >> test-runs/results/loop.log 2>&1
  echo "--- batch done  $(date -u +%FT%TZ) ---" >> test-runs/results/loop.log
  i=$(( (i + PAIR) % N ))
  sleep 600
done
