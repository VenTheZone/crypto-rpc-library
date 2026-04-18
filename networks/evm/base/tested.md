# Base Mainnet RPCs — Tested 2026-04-18

> Chain ID: 8453

## MEV-Safe RPCs (Recommended)

| Name | URL | RPS | Latency | Mempool | Safe | Tier |
|------|-----|----:|--------:|:-------:|:----:|------|
| **Tenderly** | `https://base.gateway.tenderly.co` | 111 | 79ms | no | ✅ | ⭐ Fastest safe |
| Nodies | `https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb` | 50 | 211ms | no | ✅ | Free |
| Nodies POKT | `https://base-pokt.nodies.app` | 32 | 329ms | no | ✅ | Free |

## Working RPCs (Mempool Exposed)

| Name | URL | RPS | Latency | Mempool | Pending/Queued | Tier |
|------|-----|----:|--------:|:-------:|---------------:|------|
| Aerodrome dRPC | `https://lb.drpc.live/base/...` | 124 | 62ms | yes | 124/10018 | Fast |
| DRPC | `https://base.drpc.org` | 80 | 95ms | yes | 110/10065 | Fast |
| QuickNode 3 | `https://warmhearted-falling-shape.base...` | 76 | 130ms | no | - | Tier 1 |
| QuickNode 2 | `https://fittest-wild-frog.base...` | 73 | 133ms | no | - | Tier 1 |
| QuickNode 1 | `https://thrumming-thrumming-pool.base...` | 69 | 132ms | no | - | Tier 1 |
| Base Official | `https://mainnet.base.org` | 69 | 137ms | no | - | Official |
| Base Preconf | `https://mainnet-preconf.base.org` | 68 | 124ms | no | - | Preconf |
| Ankr Pro | `https://rpc.ankr.com/base/...` | 75 | 140ms | yes | 0/0 | Needs key |
| 1rpc.io | `https://1rpc.io/base` | 59 | 169ms | yes | 0/0 | ⚠️ Empty pool |
| PublicNode | `https://base.publicnode.com` | 54 | 159ms | yes | **26429/10** | ⚠️ Massive exposure |
| Dev Access | `https://developer-access-mainnet.base.org` | 40 | 132ms | no | - | Dev |
| Coinbase CDP | `https://api.developer.coinbase.com/...` | 47 | 134ms | no | - | CDP |
| LlamaRPC | `https://base.llamarpc.com` | 47 | 220ms | yes | 0/0 | Slow |
| MeowRPC | `https://base.meowrpc.com` | - | 204ms | no | - | Free |

## Failed RPCs

| Name | URL | Error |
|------|-----|-------|
| Wallet Coinbase | `https://rpc.wallet.coinbase.com` | Connection error |
| Privy Base | `https://base-mainnet.rpc.privy.systems` | 404 |

## Quick Pick

| Need | RPC | RPS | Safe? |
|------|-----|----:|-------|
| **Speed + Safe** | Tenderly | 111 | ✅ |
| **Free + Safe** | Nodies | 50 | ✅ |
| Max speed | Aerodrome dRPC | 124 | ❌ (mempool exposed) |
| Low latency | Tenderly | 79ms | ✅ |
| Official | Base Official | 69 | No (but no mempool) |

## Security Analysis

### MEV-Safe (No Mempool Access)
- **Tenderly**: Fastest safe option (111 RPS, 79ms)
- **Nodies**: Free, reliable, but slower (50 RPS)
- **Nodies POKT**: Backup option (32 RPS)

### Mempool Exposed (MEV Risk)
| Provider | Notes |
|----------|-------|
| **PublicNode** | ⚠️ **26,429 pending tx visible** - highest risk |
| **DRPC / Aerodrome** | 10k+ queued, actively used |
| **1rpc.io / Ankr** | Empty pools but method exists |

### No Mempool Method (Safe-ish)
- QuickNode instances
- Base Official / Preconf / Dev Access
- MeowRPC

These return "method not found" for `txpool_content`, meaning they don't expose the mempool even if the method technically exists.

## Test Script

```bash
# Run the full test suite
cd networks/evm/base
node test-rpcs.js

# Quick mempool check
curl -X POST https://base.gateway.tenderly.co \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'
# Returns: {"jsonrpc":"2.0","id":1,"error":{"code":-32601,...}}
# -32601 = method not found = safe
```

## How to Use

### For MEV Protection (Bundles, large trades)
```javascript
const SAFE_RPC = 'https://base.gateway.tenderly.co';
```

### For Speed ( accepts mempool exposure)
```javascript
const FAST_RPC = 'https://lb.drpc.live/base/YOUR_KEY';
```

### For Free Tier
```javascript
const FREE_SAFE = 'https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb';
const FREE_FAST = 'https://base.meowrpc.com';
```

## Comparison with Berachain

| Feature | Base | Berachain |
|---------|------|-----------|
| **MEV-Safe RPCs** | 3 (Tenderly, Nodies) | 0 |
| **Fastest Safe** | 111 RPS (Tenderly) | N/A |
| **Ecosystem** | Mature (Flashbots/dRPC support) | Early (no private mempool) |
| **Paid options** | Many | Ankr, BlockPI |

Base has mature MEV protection infrastructure. Berachain is still early - no public Flashbots/dRPC Protect endpoints yet.
