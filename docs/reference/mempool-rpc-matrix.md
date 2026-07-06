# Mempool RPC Matrix

> **Last Updated:** 2026-07-06
> **Method:** `txpool_content` / `txpool_status` tested against public RPCs

## Chains with Public Mempool (7)

| Chain | RPC | Pending | Queued | Latency | Method |
|-------|-----|---------|--------|---------|--------|
| **Ethereum** | `https://ethereum-rpc.publicnode.com` | 55,149 | 4,825 | 146ms | `txpool_content` |
| **Ethereum** | `https://1rpc.io/eth` | — | — | 603ms | `txpool_status` |
| **Polygon** | `https://polygon-bor.publicnode.com` | 1,750 | 2 | 144ms | `txpool_content` |
| **Polygon** | QuikNode (Sushi) `50060fe...` | 65,722 | 8,151 | — | `txpool_status` |
| **Polygon** | QuikNode (Uniswap) `9d224a0...` | 9,178 | 530 | — | `txpool_status` |
| **BSC** | `https://bsc-rpc.publicnode.com` | 6,003 | 697 | 250ms | `txpool_content` |
| **BSC** | `https://bsc-dataseed.binance.org` | 38 | 1,286 | 329ms | `txpool_content` |
| **BSC** | QuikNode (Uniswap) `31c09f2...` | 30 | 714 | — | `txpool_status` |
| **BSC** | QuikNode (Sushi) `a0d8656...` | 9 | 383 | — | `txpool_status` |
| **Taiko** | `https://rpc.taiko.xyz` | 2,626 | 0 | 395ms | `txpool_content` |
| **Avalanche** | `https://avalanche-c-chain.publicnode.com` | 36 | 0 | 139ms | `txpool_status` |
| **Berachain** | `https://rpc.berachain.com` | 34 | 0 | 738ms | `txpool_content` |
| **Gnosis** | `https://gnosis-rpc.publicnode.com` | 9 | 176 | 134ms | `txpool_content` |

## Chains WITHOUT Mempool

| Chain | Status | Reason |
|-------|--------|--------|
| Base | ❌ | OP Stack sequencer, 0 pending |
| Optimism | ❌ | OP Stack sequencer, 0 pending |
| Fantom | ❌ | 0 pending |
| RSK | ❌ | 0 pending |
| Arbitrum | ❌ | Sequencer-based L2 |
| All other L2s | ❌ | No txpool endpoint |

## Quick Test

```bash
# Polygon (highest pending)
curl -s -X POST "https://polygon-bor.publicnode.com" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}' | jq '.result.pending | keys | length'

# BSC
curl -s -X POST "https://bsc-rpc.publicnode.com" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}' | jq '.result.pending | keys | length'
```

## Notes

- No Origin headers required for any public RPC
- `txpool_content` returns full pending txs; `txpool_status` returns counts only
- Some RPCs only support `txpool_status` (Avalanche)
- QuikNode keys from DEX discovery have higher pending counts
- Latency tested from Singapore server (2026-07-06)
