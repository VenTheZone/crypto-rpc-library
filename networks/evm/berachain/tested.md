# Berachain Mainnet RPCs — Tested 2026-04-17

> Chain ID: 80094

## Working RPCs

| Name | URL | RPS | TPS | Tx/Block | Mempool | Safe TX | Origin | Status |
|------|-----|----:|----:|---------:|:-------:|:-------:|--------|--------|
| Berachain Official | https://rpc.berachain.com | 89 | 8 | 8 | yes (3/51) | ❌ | - | working |
| Kodiak | https://rpc.kodiak.finance | - | 10 | 10 | yes (3/50) | ❌ | - | working |

## Failed RPCs

| Name | URL | Status | Error |
|------|-----|--------|-------|
| PublicNode | https://berachain-evm-rpc.publicnode.com | ❌ | 404 Not Found |
| Thirdweb | https://bera.rpc.thirdweb.com | ❌ | Connection error |

## Mempool Test Results

**Both working RPCs expose mempool** - neither is MEV-safe.

### Berachain Official
- Pending: 3 transactions
- Queued: 51 transactions
- Mempool accessible via `txpool_content`

### Kodiak
- Pending: 3 transactions  
- Queued: 50 transactions
- Rate limited on RPS test (concurrent requests return 429)

## Performance Summary

### Berachain Official
- **RPS**: 89 (good throughput)
- **TPS**: 8 transactions per block
- **Mempool**: Exposed ⚠️
- **Safe for bundles**: ❌ No
- **Origin required**: No

### Kodiak
- **RPS**: Rate limited (concurrent requests throttled)
- **TPS**: 10 transactions per block
- **Mempool**: Exposed ⚠️
- **Safe for bundles**: ❌ No
- **Origin required**: No

## Discovery Sources

- DEX frontends: Kodiak Finance (`app.kodiak.finance`)
- Discovery file: `networks/evm/berachain-discovered-raw.json`
- Test script: `networks/evm/berachain/test-rpcs.js`

## Key Findings

⚠️ **No MEV-safe RPCs found** - both working endpoints expose the mempool via `txpool_content`, meaning pending transactions are visible and can be frontrun.

## Recommendations

| Use Case | Recommendation |
|----------|---------------|
| General queries | Berachain Official (89 RPS, fastest) |
| Bundle submission | ⚠️ No safe option - mempool exposed |
| MEV protection | ❌ Not available on tested endpoints |

## How to Test

```bash
# Clone the repo and navigate to network
git clone https://github.com/DrMcE/meco-workers
cd meco-workers/networks/evm/berachain

# Install deps
npm i

# Run tests
node test-rpcs.js
```

## Chain Info

```bash
# Verify chain ID
curl -X POST https://rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# Returns: 0x1389e (80094)
```
