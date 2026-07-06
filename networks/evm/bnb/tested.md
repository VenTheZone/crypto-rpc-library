# BSC (Binance Smart Chain) — RPC Endpoints

Chain ID: 56
RPC: EVM (geth-compatible)
Native token: BNB
Block time: ~3s

## Mempool: ✅ YES (6,003 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://bsc-rpc.publicnode.com` | 250ms | ✅ 6,003 | No | working |
| Binance | `https://bsc-dataseed.binance.org` | 329ms | ✅ 38 | No | working |
| QuikNode (Uniswap) | `https://palpable-summer-choice.bsc.quiknode.pro/31c09f2ad734e43f4fece25a5db045a9322ce119` | — | ✅ 30 | No | working |
| QuikNode (Sushi) | `https://quiet-burned-dust.bsc.quiknode.pro/a0d86563bc5d99e49d7d72ca422da0e761b4e257` | — | ✅ 9 | No | working |
| 1RPC | `https://1rpc.io/bnb` | 144ms | ❌ | No | working |

## WebSocket Endpoints

| Name | URL | Pending | Origin |
|------|-----|---------|--------|
| QuikNode (Uniswap) | `wss://palpable-summer-choice.bsc.quiknode.pro/31c09f2ad734e43f4fece25a5db045a9322ce119` | ✅ | No |
| QuikNode (Sushi) | `wss://quiet-burned-dust.bsc.quiknode.pro/a0d86563bc5d99e49d7d72ca422da0e761b4e257` | ✅ | No |

## API Keys

| Provider | Key | Source | Mempool |
|----------|-----|--------|---------|
| QuikNode | `31c09f2ad734e43f4fece25a5db045a9322ce119` | Uniswap | ✅ |
| QuikNode | `a0d86563bc5d99e49d7d72ca422da0e761b4e257` | Sushi | ✅ |

## Notes

- PublicNode is fastest public endpoint (250ms)
- QuikNode keys have lower pending but still work
- No Origin headers required for any endpoint
