# Avalanche — RPC Endpoints

Chain ID: 43114
RPC: EVM (geth-compatible)
Native token: AVAX
Block time: ~2s

## Mempool: ✅ YES (36 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://avalanche-c-chain.publicnode.com` | 139ms | ✅ 36 (status) | No | working |
| 1RPC | `https://1rpc.io/avax/c` | — | ❌ | No | working |
| QuikNode (Uniswap) | `https://sleek-still-patina.avalanche-mainnet.quiknode.pro/d5190f99f23c05fab0604cf98fe636e96497565a/ext/bc/C/rpc/` | — | ❌ | No | working |

## API Keys

| Provider | Key | Source | Mempool |
|----------|-----|--------|---------|
| QuikNode | `d5190f99f23c05fab0604cf98fe636e96497565a` | Uniswap | ❌ |

## Notes

- PublicNode is best: 36 pending, 139ms latency
- QuikNode key has no mempool (txpool_status returns 0x0)
- No Origin headers required for any endpoint
