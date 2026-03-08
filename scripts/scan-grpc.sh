#!/bin/bash
# Scan Solana DEX websites for gRPC endpoints

set -e

echo "=== Scanning Solana DEXs for gRPC endpoints ==="

# Common gRPC patterns to look for
GRPC_PATTERNS=(
    "grpc"
    "grpc-web"
    ":443"
    "laserstream"
    "stream"
    ".proto"
)

# DEX URLs to scan
DEXS=(
    "https://jup.ag"
    "https://raydium.io"
    "https://drift.trade"
    "https://kamino.finance"
    "https://tensor.trade"
    "https://pump.fun"
    "https://orca.so"
    "https://meteora.ag"
    "https://phoenix.trade"
    "https://marginfi.com"
)

# Temp directory
mkdir -p /tmp/grpc-scan
cd /tmp/grpc-scan

for dex in "${DEXS[@]}"; do
    name=$(echo "$dex" | sed 's|https://||' | sed 's|http://||' | cut -d'/' -f1)
    echo ""
    echo "--- Scanning $name ---"
    
    # Fetch main page
    curl -sL "$dex" -o "${name}.html" 2>/dev/null || continue
    
    # Fetch JS files
    js_files=$(grep -oE 'src="[^"]*\.js[^"]*"' "${name}.html" 2>/dev/null | sed 's/src="//g' | sed 's/"//g' | head -20)
    
    for js in $js_files; do
        # Handle relative URLs
        if [[ "$js" == http* ]]; then
            url="$js"
        else
            url="${dex}${js}"
        fi
        
        js_name=$(echo "$url" | md5sum | cut -d' ' -f1)
        curl -sL "$url" -o "${name}_${js_name}.js" 2>/dev/null || continue
        
        # Search for gRPC patterns
        for pattern in "${GRPC_PATTERNS[@]}"; do
            if grep -qi "$pattern" "${name}_${js_name}.js" 2>/dev/null; then
                echo "Found '$pattern' in $url"
                grep -oi "[a-z0-9.-]*${pattern}[a-z0-9.-]*" "${name}_${js_name}.js" 2>/dev/null | sort -u | head -5
            fi
        done
    done
done

echo ""
echo "=== Extracting potential gRPC hosts ==="

# Extract all helius-rpc.com and other RPC hosts
for f in *.js; do
    grep -oE '[a-z0-9-]+\.(helius-rpc\.com|rpcpool\.com|quicknode\.com|blockpi\.network|ironforge\.network)[^a-z]' "$f" 2>/dev/null
done | sort -u

echo ""
echo "=== Done ==="
