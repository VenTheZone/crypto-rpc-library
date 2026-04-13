# Base Mainnet RPCs — Tested 2026-04-12

**RPS** = your request throughput | **TPS** = chain throughput | **Mempool** = TX visible pre-confirmation | **Safe TX** = no mempool = private

## ⚡ Tier 1 — 300+ RPS

| Name | URL | RPS | TPS | Mempool | Safe | Latency | Source |
|------|-----|----:|----:|:-------:|:----:|--------:|--------|
| QuickNode 3 | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | 358 | 80 | no | ✅ | 32ms | PancakeSwap |
| QuickNode 2 | `https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2` | 355 | 88 | no | ✅ | 33ms | PancakeSwap |
| QuickNode 1 | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | 340 | 163 | no | ✅ | 34ms | PancakeSwap |

> ⚠️ Down from 2500+ RPS in Feb. Keys still work but rate-limited.

## 🚀 Tier 2 — 150-300 RPS

| Name | URL | RPS | TPS | Mempool | Safe | Latency | Source |
|------|-----|----:|----:|:-------:|:----:|--------:|--------|
| Tenderly | `https://base.gateway.tenderly.co` | 281 | - | no | ✅ | 34ms | PancakeSwap |
| DRPC | `https://base.drpc.org` | 281 | - | no | ✅ | 38ms | BaseSwap |
| MeowRPC | `https://base.meowrpc.com` | 193 | - | no | ✅ | 35ms | PancakeSwap |
| 1rpc.io | `https://1rpc.io/base` | 192 | 94 | ⚠️ yes | ❌ | 57ms | 1rpc.io |
| Ankr Pro | `https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2` | 191 | 87 | no | ✅ | 40ms | PancakeSwap |
| PublicNode | `https://base.publicnode.com` | 144 | 68 | ⚠️ yes | ❌ | 69ms | PublicNode |
| PublicNode alt | `https://base-rpc.publicnode.com` | 137 | - | ⚠️ yes | ❌ | 70ms | Chainlist |

## ✅ Tier 3 — 50-150 RPS

| Name | URL | RPS | TPS | Mempool | Safe | Latency | Source |
|------|-----|----:|----:|:-------:|:----:|--------:|--------|
| Base Preconf | `https://mainnet-preconf.base.org` | 124 | 77 | no | ✅ | 73ms | Base |
| Dev Access | `https://developer-access-mainnet.base.org` | 122 | - | no | ✅ | 72ms | Base |
| Base Official | `https://mainnet.base.org` | 72 | - | no | ✅ | 125ms | Base |
| Nodies | `https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb` | 72 | 82 | no | ✅ | 157ms | PancakeSwap |
| Nodies POKT | `https://base-pokt.nodies.app` | 68 | 93 | no | ✅ | 163ms | PancakeSwap |
| Coinbase CDP | `https://api.developer.coinbase.com/rpc/v1/base/pE-_rU5q_IliJGUVkVI-82ZoyiCeCSFx` | 48 | 56 | no | ✅ | 135ms | Coinbase |

## 🐌 Tier 4 — Under 50 RPS

| Name | URL | RPS | TPS | Mempool | Safe | Latency | Source |
|------|-----|----:|----:|:-------:|:----:|--------:|--------|
| LlamaRPC | `https://base.llamarpc.com` | 43 | - | no | ✅ | 163ms | LlamaRPC |
| Thirdweb | `https://8453.rpc.thirdweb.com` | 0 | 0 | no | ✅ | - | Thirdweb |

## ⚠️ Mempool-Only (MEV)

| Name | URL | RPS | Pending | Queued |
|------|-----|----:|-------:|-------:|
| 1rpc.io | `https://1rpc.io/base` | 192 | 0 | 3 |
| PublicNode | `https://base.publicnode.com` | 144 | 24182 | 0 |
| PublicNode alt | `https://base-rpc.publicnode.com` | 137 | ~24k | 0 |

## ❌ Dead

| Name | URL | Reason |
|------|-----|--------|
| DRPC Aerodrome | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | Key deactivated |
| Ankr Public | `https://rpc.ankr.com/base` | Auth required |
| BlastAPI | `https://base-mainnet.blastapi.io` | Discontinued |
| Coinbase Wallet | `https://rpc.wallet.coinbase.com` | Not JSON-RPC |
| BlockPi | `https://base.blockpi.network/v1/rpc/public` | 521 / auth |
| DodoEx | `https://api.dodoex.io/frontend-rpc/8453?...` | Returns HTML |
| KyberSwap | `https://base-rpc.kyberswap.com` | Returns HTML |
| Chainstack | `https://base-mainnet.core.chainstack.com` | Auth required |
| Grove | `https://base.rpc.grove.city/v1` | ENOTFOUND |
| Privy | `https://base-mainnet.rpc.privy.systems` | Wrong chain |

## Quick Pick

| Need | URL | RPS |
|------|-----|----:|
| Speed + Safe | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | 358 |
| Free + Safe | `https://base.meowrpc.com` | 193 |
| MEV / Mempool | `https://base.publicnode.com` | 144 |
| Best Latency | `https://base.gateway.tenderly.co` | 281 |
| Reliable | `https://mainnet.base.org` | 72 |

## Mempool Test

```bash
curl -X POST $URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'
# -32601 = no mempool (safe) | pending/queued = mempool exposed
```
