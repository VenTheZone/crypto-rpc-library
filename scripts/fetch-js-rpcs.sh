#!/bin/bash
# Fetch JS bundles from DEX frontends, grep for RPC URLs, test RPS + origin headers
# Usage: ./fetch-js-rpcs.sh <chain> <chainId> [limit]
CHAIN="${1:-ethereum}"
CHAIN_ID="${2:-1}"
LIMIT="${3:-30}"
OUTPUT="/tmp/${CHAIN}_js_rpcs.txt"
TESTED="/tmp/${CHAIN}_tested.txt"
TESTS=5
TIMEOUT=3