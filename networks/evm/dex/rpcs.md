# EVM DEX RPCs

> RPCs extracted from DEX frontends via manual recon

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| **Sushi** | `lb.drpc.live/ogrpc?dkey=...` | DRPC key | **1992** | - | ✅ | Best RPS! |
| **Monad** | `rpc.monad.xyz` | - | **1066** | - | ✅ | New chain |
| **Woofi** | `alchemy.com/v2/rJ3f0IW...` | Leaked | **543** | - | ✅ | Alchemy key |
| **Aerodrome** | `lb.drpc.live/base/...` | DRPC | 151 | 67 | ❌ | Has mempool |
| **PancakeSwap** | `bsc.publicnode.com` | - | 146 | 189 | ❌ | Has mempool |
| **DODO** | `api.dodoex.io/frontend-rpc` | Leaked | 41 | - | ✅ | API keys |

## Notable Findings
- **Sushi**: 1992 RPS - highest found!
- **Monad RPC**: 1066 RPS - new chain with high throughput
- **Leaked keys**: DODO, Woofi exposed API keys in frontend
