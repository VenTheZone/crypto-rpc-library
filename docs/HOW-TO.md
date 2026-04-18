# How to Use This RPC Library

A practical guide for finding, testing, and using RPC endpoints across EVM chains.

## Quick Start

### 1. Find RPCs for a Chain

```bash
# Discover RPCs from DEX frontends
node scripts/intercept-evm-rpcs.js <chain> <chainId>

# Example: Find Base RPCs
node scripts/intercept-evm-rpcs.js base 8453

# Example: Find Berachain RPCs
node scripts/intercept-evm-rpcs.js berachain 80094
```

This scans DEX frontends (Uniswap, PancakeSwap, etc.) and extracts RPC URLs.

### 2. Test the RPCs

```bash
# Create test script for the chain
cd networks/evm/<chain>
node test-rpcs.js
```

Or use the generic test script:

```bash
node scripts/test-evm-full.js --chain base --chain-id 8453 --input networks/evm/base/input.md
```

### 3. Use the Results

Check `networks/evm/<chain>/tested.md` for:
- Working RPCs with RPS/latency
- MEV-safe RPCs (no mempool exposure)
- Failed endpoints to avoid

## What Each Script Does

### Discovery Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `intercept-evm-rpcs.js` | Scans DEX frontends for RPCs | `*-discovered-raw.json` |
| `scan-evm-chains.js` | Batch scan multiple chains | `data/rpc-database.json` |
| `scan-evm-dex.js` | Scans specific DEX | Raw RPC list |

### Testing Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `test-evm-full.js` | Comprehensive test (RPS, mempool, latency) | Markdown report |
| `test-mempool-chains.js` | Test mempool exposure across chains | Security report |
| `test-origin-spoof.js` | Check Origin header requirements | Auth report |

### Test Metrics Explained

**RPS (Requests Per Second)**
- Measures throughput under load
- Tests 12 concurrent requests
- Falls back to 6 if rate-limited

**Latency**
- Single request response time
- Lower = faster for read operations

**Mempool**
- `txpool_content` returns pending/queued transactions
- `-32601` = method not found = SAFE
- Empty object = safe (method exists but no tx)
- Non-empty = EXPOSED (MEV risk)

**Safe TX**
- ✅ No mempool access = can't be frontrun
- ❌ Mempool exposed = transactions visible to bots

## Testing a New Chain

### Step 1: Create Chain Directory

```bash
mkdir -p networks/evm/<chain>/scripts
cd networks/evm/<chain>
```

### Step 2: Discover RPCs

```bash
node ../../../scripts/intercept-evm-rpcs.js <chain> <chain-id>
```

### Step 3: Create Test Script

Copy and modify an existing test script:

```bash
cp ../base/test-rpcs.js ./test-rpcs.js
# Edit RPCS array with discovered endpoints
```

### Step 4: Run Tests

```bash
node test-rpcs.js | tee tested.md
```

### Step 5: Commit Results

```bash
git add .
git commit -m "feat(<chain>): add RPC discovery and testing

- Discovered X RPCs from DEX scanning
- Tested Y endpoints, Z working
- Found W MEV-safe RPCs"
git push
```

## Understanding Results

### MEV Safety

MEV-safe RPCs don't expose `txpool_content`. This means:
- Your transactions aren't visible in the mempool before confirmation
- Bots can't frontrun or sandwich your trades
- Better for large trades, liquidations, time-sensitive ops

### RPS Tiers

| Tier | RPS | Use Case |
|------|----:|----------|
| Ultra | 200+ | High-frequency trading |
| Fast | 100-200 | Production backends |
| Good | 50-100 | Most applications |
| Okay | 20-50 | Personal use |
| Slow | <20 | Fallback only |

### Latency Guidelines

| Latency | Quality |
|---------|---------|
| <50ms | Excellent |
| 50-100ms | Very good |
| 100-200ms | Good |
| 200-500ms | Acceptable |
| >500ms | Slow |

## Common Issues

### 403 Forbidden
- RPC requires Origin header
- Try adding `-H "Origin: https://app.uniswap.org"`

### 429 Rate Limited
- Reduce concurrent requests
- Add delays between batches
- Use API key if available

### DNS Errors
- RPC is down or deprecated
- Remove from active list

### 401 Unauthorized
- Needs API key (Ankr, Infura, etc.)
- Mark as "needs-key" in docs

## MEV-Safe by Chain

| Chain | Safe RPCs | Best Option |
|-------|-----------|-------------|
| **Base** | 3 | Tenderly (111 RPS) |
| **Ethereum** | Many | Flashbots Protect |
| **Avalanche** | 2 | Avalanche Official (49 RPS) |
| **Berachain** | 0 | None public yet |
| **Polygon** | Many | Private Mempool RPC |
| **Arbitrum** | Several | dRPC MEV protection |

## Advanced Usage

### Custom Test Parameters

Edit the test script to change:
- Concurrent requests (default: 12)
- Timeout values
- Which methods to test

### Adding DEX Sources

Edit `intercept-evm-rpcs.js`:

```javascript
const DEX_BY_CHAIN = {
  yourchain: [
    { name: 'YourDEX', url: 'https://yourdex.fi/swap' },
  ]
};
```

### Batch Testing

```bash
# Test multiple chains
for chain in base avalanche berachain; do
  cd networks/evm/$chain && node test-rpcs.js && cd ../../..
done
```

## Troubleshooting

```bash
# Check if RPC is up
curl -X POST <rpc-url> \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'

# Check mempool
curl -X POST <rpc-url> \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'

# Check chain ID
curl -X POST <rpc-url> \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

## Need Help?

- Check existing `tested.md` files for working patterns
- Look at `networks/evm/base/test-rpcs.js` as reference
- Test mempool exposure before trusting an RPC for sensitive transactions
