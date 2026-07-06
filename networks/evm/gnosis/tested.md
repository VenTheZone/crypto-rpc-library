# Gnosis — RPC Endpoints

Chain ID: 100
RPC: EVM (geth-compatible)
Native token: xDai/GNO
Block time: ~5s

## Mempool: ✅ YES (9 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://gnosis-rpc.publicnode.com` | 134ms | ✅ 9 | No | working |
| dRPC | `https://gnosis.drpc.org` | 59ms | ❌ | No | working |
| Ankr | `https://rpc.ankr.com/gnosis` | 34ms | ❌ | No | working |

## API Keys

No new keys found. Public endpoints sufficient.

## Notes

- PublicNode is best: 9 pending, 134ms latency
- Ankr is fastest (34ms) but no mempool
- No Origin headers required for any endpoint
