#!/bin/bash
# RPC Monitor Wrapper - runs the monitor and handles logging/rotations

set -euo pipefail

# Configuration
PROJECT_ROOT="$HOME/.picord/workspace/crypto-rpc-library"
cd "$PROJECT_ROOT"

# Ensure logs directory exists
mkdir -p logs

# Run monitor with concurrency 25, not dry-run
# You can adjust concurrency or add --chain to monitor specific chains
python3 scripts/monitor-rpcs.py --concurrency 25 2>&1 | tee -a logs/monitor_cron_$(date +%Y-%m-%d).log

# Optional: rotate old monitor logs (keep last 30 days)
find logs/monitor_*.log -type f -mtime +30 -delete 2>/dev/null || true
find logs/monitor_cron_*.log -type f -mtime +30 -delete 2>/dev/null || true

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cron job completed" >> logs/monitor_cron_status.log
