# EVM DEX RPCs

> RPCs extracted from DEX frontends via manual recon

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| **Sushi** | `lb.drpc.live/ogrpc?dkey=...` | DRPC key | **1992** | - | ✅ | Best RPS! |
| **Monad** | `rpc.monad.xyz` | - | **1066** | - | ✅ | New chain |
| **Woofi** | `alchemy.com/v2/rJ3f0IW...` | Leaked | **543** | - | ✅ | Alchemy key |
| **KyberSwap** | `ethereum-rpc.kyberswap.com` | - | 64 | - | ✅ | |
| **Convex** | `lb.drpc.org/ogrpc?dkey=...` | DRPC | 66 | - | ✅ | New DRPC key |
| **Scroll** | `rpc.scroll.io` | - | 74 | - | ✅ | |
| **PancakeSwap** | `rpc.monad.xyz` | - | 75 | - | ✅ | Monad |
| **PancakeSwap** | `rpc.linea.build` | - | - | - | ✅ | Linea |
| **PancakeSwap** | `arb1.arbitrum.io/rpc` | - | - | - | ❌ | Arbitrum |
| **PancakeSwap** | `base.publicnode.com` | - | 47 | - | ❌ | Base |
| **PancakeSwap** | `opbnb-mainnet-rpc.bnbchain.org` | - | - | - | ✅ | opBNB |
| **PancakeSwap** | `bsc.publicnode.com` | - | 146 | - | ❌ | BSC |
| **Velodrome** | `lb.drpc.live/optimism/...` | DRPC | - | - | ✅ | Optimism |
| **Aerodrome** | `lb.drpc.live/base/...` | DRPC | 76 | - | ❌ | Base |
| **Zora** | `base-proxy.rpc-proxy.zora.co` | - | 20 | - | ✅ | |
| **DODO** | `api.dodoex.io/frontend-rpc` | Leaked | 41 | - | ✅ | API keys |
| **Reflexer** | `mainnet.infura.io/v3/...` | Leaked | 19 | - | ✅ | Infura key |

## Not Working / Not Found
- Uniswap: Uses Infura (blocked)
- Curve.fi: No direct RPC found
- Balancer: No direct RPC found
- TraderJoe: No RPC found in frontend
- Camelot: No RPC found
- Synthetix: No RPC found
- Perps: No RPC found

## Notable Findings
- **Sushi**: 1992 RPS - highest found!
- **Monad RPC**: 1066 RPS - new chain with high throughput
- **Leaked keys**: DODO, Woofi exposed API keys in frontend
