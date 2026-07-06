# Polygon (Matic) — RPC Endpoints

Chain ID: 137
RPC: EVM (geth-compatible)
Native token: MATIC
Block time: ~2.3s

## Mempool: ✅ YES (65,722 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| QuikNode (Sushi) | `https://crimson-wider-silence.quiknode.pro/50060fe02eaca407606719d97f4f204f28da43ed` | — | ✅ 65,722 | No | working |
| QuikNode (Uniswap) | `https://late-alpha-diagram.matic.quiknode.pro/9d224a0c49ee6cd1b4d88e7a2897a057385e6b40` | — | ✅ 9,178 | No | working |
| PublicNode | `https://polygon-bor.publicnode.com` | 144ms | ✅ 1,750 | No | working |
| dRPC | `https://polygon.drpc.org` | 59ms | ❌ | No | working |
| 1RPC | `https://1rpc.io/matic` | 355ms | ❌ | No | working |

## WebSocket Endpoints

| Name | URL | Pending | Origin |
|------|-----|---------|--------|
| QuikNode (Sushi) | `wss://crimson-wider-silence.quiknode.pro/50060fe02eaca407606719d97f4f204f28da43ed` | ✅ | No |
| QuikNode (Uniswap) | `wss://late-alpha-diagram.matic.quiknode.pro/9d224a0c49ee6cd1b4d88e7a2897a057385e6b40` | ✅ | No |

## API Keys

| Provider | Key | Source | Mempool |
|----------|-----|--------|---------|
| QuikNode | `50060fe02eaca407606719d97f4f204f28da43ed` | Sushi | ✅ |
| QuikNode | `9d224a0c49ee6cd1b4d88e7a2897a057385e6b40` | Uniswap | ✅ |

## Notes

- QuikNode keys from DEX discovery have highest pending counts
- PublicNode is most reliable public endpoint
- No Origin headers required for any endpoint

## Discovered (JS Bundles, 2026-07-06)

| Source | RPC URL |
|--------|--------|
| Polygon-Bor-PublicNode | `https://polygon-bor.publicnode.com` |
| Polygon-RPC.com | `https://polygon-rpc.com` |
| Polygon-dRPC | `https://polygon.drpc.org` |
