#!/bin/bash
# Fetch JS bundles from DEX frontends, grep for RPC URLs
# Usage: ./fetch-js-rpcs.sh <chain> <chainId>
CHAIN="${1:-ethereum}"
CHAIN_ID="${2:-1}"
OUTPUT="/tmp/${CHAIN}_js_rpcs.txt"

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
echo "# DISCOVERED $CHAIN RPCs (JS bundles)"
echo "# ========================================"
echo ""
echo "| Source | RPC URL |"
echo "|--------|---------|"
sort -u "$OUTPUT" | while IFS='|' read -r src rpc; do
  echo "| $src | $rpc |"
done
