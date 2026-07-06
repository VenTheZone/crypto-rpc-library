# Ethereum — RPC Endpoints

Chain ID: 1
RPC: EVM (geth-compatible)
Native token: ETH
Block time: ~12s

## Mempool: ✅ YES (55,149 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://ethereum-rpc.publicnode.com` | 146ms | ✅ 55,149 | No | working |
| 1RPC | `https://1rpc.io/eth` | 603ms | ✅ (status only) | No | working |
| dRPC | `https://eth.drpc.org` | — | ❌ | No | working |
| Cloudflare | `https://cloudflare-eth.com` | — | ❌ | No | working |

## WebSocket Endpoints

| Name | URL | Pending | Origin |
|------|-----|---------|--------|
| PublicNode | `wss://ethereum-rpc.publicnode.com` | ✅ | No |
| dRPC | `wss://eth.drpc.org` | ✅ | No |

## API Keys

No new keys found. Public endpoints sufficient.

## Notes

- PublicNode is best: 55K pending, 146ms latency
- 1rpc only supports txpool_status, not txpool_content
- No Origin headers required for any endpoint
