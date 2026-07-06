#!/bin/bash
# Fetch JS bundles from DEX frontends, grep for RPC URLs, test RPS + origin headers
# Usage: ./fetch-js-rpcs.sh <chain> <chainId>
CHAIN="${1:-ethereum}"
CHAIN_ID="${2:-1}"
OUTPUT="/tmp/${CHAIN}_js_rpcs.txt"
RESULTS="/tmp/${CHAIN}_js_results.txt"

# ponytail: payload reused across tests
PAYLOAD='{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
TESTS=5

echo "# $CHAIN JS Bundle RPC Discovery + Test"
echo "Chain ID: $CHAIN_ID"
echo ""

test_rpc() {
  local url="$1"
  local origin="$2"
  local label="${3:-none}"
  local start end elapsed rps latency
  
  start=$(date +%s%N)
  local resp
  if [ -n "$origin" ]; then
    resp=$(curl -s --max-time 5 -X POST -H "Content-Type: application/json" -H "Origin: $origin" -d "$PAYLOAD" "$url" 2>/dev/null)
  else
    resp=$(curl -s --max-time 5 -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$url" 2>/dev/null)
  fi
  end=$(date +%s%N)
  elapsed=$(( (end - start) / 1000000 ))
  
  if echo "$resp" | grep -q '"result"'; then
    latency="$elapsed"
    # RPS: 5 sequential requests
    local rps_start rps_end
    rps_start=$(date +%s%N)
    for i in $(seq 2 $TESTS); do
      curl -s --max-time 5 -X POST -H "Content-Type: application/json" ${origin:+-H "Origin: $origin"} -d "$PAYLOAD" "$url" >/dev/null 2>&1
    done
    rps_end=$(date +%s%N)
    local rps_elapsed=$(( (rps_end - rps_start) / 1000000 ))
    if [ "$rps_elapsed" -gt 0 ]; then
      rps=$(echo "scale=1; $TESTS * 1000 / $rps_elapsed" | bc 2>/dev/null || echo "?")
    else
      rps="?"
    fi
    echo "$label | $latency | $rps"
    return 0
  else
    echo "$label | FAIL | -"
    return 1
  fi
}

echo "# $CHAIN JS Bundle RPC Discovery"
echo "Chain ID: $CHAIN_ID"
echo "Output: $OUTPUT"
echo ""

> "$OUTPUT"

# DEX URLs - match intercept-evm-rpcs.js
declare -A DEXS
case "$CHAIN" in
  ethereum)
    DEXS=(
      ["Uniswap"]="https://app.uniswap.org/swap"
      ["1inch"]="https://app.1inch.io/swap"
      ["CowSwap"]="https://cowswap.exchange"
      ["Curve"]="https://curve.fi"
      ["Sushi"]="https://www.sushi.com/swap"
      ["Balancer"]="https://balancer.fi"
      ["Paraswap"]="https://paraswap.io"
      ["Aave"]="https://app.aave.com"
      ["KyberSwap"]="https://kyberswap.com/swap/ethereum"
      ["Clipper"]="https://clipper.exchange"
      ["DODO"]="https://dodoex.io"
      ["Bancor"]="https://app.bancor.network"
      ["Frax"]="https://app.frax.finance"
      ["Badger"]="https://app.badger.com"
      ["Yearn"]="https://yearn.fi"
      ["Morpho"]="https://morpho.org"
    )
    ;;
  base)
    DEXS=(
      ["Aerodrome"]="https://aerodrome.finance/swap"
      ["Uniswap"]="https://app.uniswap.org/swap?chain=base"
      ["PancakeSwap"]="https://pancakeswap.finance/swap?chain=base"
      ["BaseSwap"]="https://baseswap.fi/swap"
    )
    ;;
  arbitrum)
    DEXS=(
      ["Uniswap"]="https://app.uniswap.org/swap?chain=arbitrum"
      ["Camelot"]="https://app.camelot.exchange"
      ["Sushi"]="https://www.sushi.com/swap?chainIds=42161"
    )
    ;;
  polygon)
    DEXS=(
      ["Uniswap"]="https://app.uniswap.org/swap?chain=polygon"
      ["QuickSwap"]="https://quickswap.exchange"
      ["Sushi"]="https://www.sushi.com/swap?chainIds=137"
    )
    ;;
  optimism)
    DEXS=(
      ["Uniswap"]="https://app.uniswap.org/swap?chain=optimism"
      ["Velodrome"]="https://app.velodrome.finance/swap"
      ["Sushi"]="https://www.sushi.com/swap?chainIds=10"
    )
    ;;
  bsc)
    DEXS=(
      ["PancakeSwap"]="https://pancakeswap.finance/swap"
      ["Sushi"]="https://www.sushi.com/swap?chainIds=56"
    )
    ;;
  avalanche)
    DEXS=(
      ["TraderJoe"]="https://traderjoexyz.com/avalanche/swap"
      ["Pangolin"]="https://pangolin.exchange"
    )
    ;;
  *)
    echo "Unknown chain: $CHAIN"
    exit 1
    ;;
esac

for name in "${!DEXS[@]}"; do
  url="${DEXS[$name]}"
  echo "## $name: $url"
  
  # Fetch HTML
  html=$(curl -sL --max-time 10 "$url" 2>/dev/null)
  if [ -z "$html" ]; then
    echo "  Error: fetch failed"
    continue
  fi
  
  # Extract script URLs
  scripts=$(echo "$html" | grep -oP 'src="[^"]*\.js[^"]*"' | sed 's/src="//;s/"//' | head -20)
  if [ -z "$scripts" ]; then
    echo "  No scripts found"
    continue
  fi
  
  count=0
  while IFS= read -r js; do
    # Make absolute URL
    case "$js" in
      http*) js_url="$js" ;;
      *) js_url="$(echo "$url" | sed 's|/swap.*||;s|/$||')$js" ;;
    esac
    
    # Fetch JS and grep for RPCs
    rpcs=$(curl -sL --max-time 10 "$js_url" 2>/dev/null | \
      grep -oP '"https?://[^"]*"' | \
      grep -iE 'rpc|alchemy|infura|ankr|blast|quicknode|publicnode|drpc|etherscan' | \
      grep -v '\$' | grep -v 'testnet' | grep -v 'sepolia' | grep -v 'goerli' | \
      sort -u)
    
    if [ -n "$rpcs" ]; then
      while IFS= read -r rpc; do
        # Clean quotes
        rpc=$(echo "$rpc" | tr -d '"')
        echo "$name | $rpc" >> "$OUTPUT"
        count=$((count + 1))
      done <<< "$rpcs"
    fi
  done <<< "$scripts"
  
  echo "  Found $count RPCs"
done

echo ""
echo "# ========================================"
echo "# DISCOVERED + TESTED $CHAIN RPCs"
echo "# ========================================"
echo ""
echo "| Source | RPC URL | Latency | RPS | Origin Tested |"
echo "|--------|---------|---------|-----|---------------|"

> "$RESULTS"

# Dedup by URL base
sort -u "$OUTPUT" | while IFS='|' read -r src rpc; do
  rpc=$(echo "$rpc" | tr -d ' \t')
  base=$(echo "$rpc" | sed 's|/$||')
  
  # Test without origin
  result=$(test_rpc "$rpc" "" "none")
  no_origin=$(echo "$result" | awk -F'|' '{print $2"|"$3}')
  
  # Test with origin (DEX domain)
  case "$src" in
    Uniswap) origin="https://app.uniswap.org" ;;
    1inch) origin="https://app.1inch.io" ;;
    CowSwap) origin="https://cowswap.exchange" ;;
    Curve) origin="https://curve.fi" ;;
    Sushi) origin="https://www.sushi.com" ;;
    Aave) origin="https://app.aave.com" ;;
    KyberSwap) origin="https://kyberswap.com" ;;
    Clipper) origin="https://clipper.exchange" ;;
    DODO) origin="https://dodoex.io" ;;
    Bancor) origin="https://app.bancor.network" ;;
    Frax) origin="https://app.frax.finance" ;;
    Badger) origin="https://app.badger.com" ;;
    Yearn) origin="https://yearn.fi" ;;
    PancakeSwap) origin="https://pancakeswap.finance" ;;
    Aerodrome) origin="https://aerodrome.finance" ;;
    *) origin="" ;;
  esac
  
  if [ -n "$origin" ]; then
    origin_result=$(test_rpc "$rpc" "$origin" "$origin")
    origin_info=$(echo "$origin_result" | awk -F'|' '{print $2"|"$3}')
  else
    origin_info="-|-"
  fi
  
  echo "| $src | \`$rpc\` | $no_origin | $origin_info |" >> "$RESULTS"
done

cat "$RESULTS"
