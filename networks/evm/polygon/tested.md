# Polygon (Matic) — RPC Endpoints

Chain ID: 137
RPC: EVM (geth-compatible)
Native token: MATIC
Block time: ~2.3s

## Working Endpoints

| Name | URL | Latency | Mempool |
|------|-----|---------|:-------:|
| dRPC | https://polygon.drpc.org | **59ms** | ❌ |
| Tenderly Gateway | https://gateway.tenderly.co/public/polygon | 388ms | ❌ |
| 1RPC | https://1rpc.io/matic | 355ms | ❌ |

## Failed / Rate-Limited

- polygon-rpc.com — rate-limited from this IP
- polygon-mainnet.publicnode.com — rate-limited
- rpc.ankr.com/polygon — needs auth
- polygon.llamarpc.com — not found
- rpc-mainnet.maticvigil.com — rate-limited

## Notes

Polygon has aggressive rate-limiting for direct curl RPC requests.
dRPC is best option at 59ms with no auth needed.
No public RPC here exposes mempool.
