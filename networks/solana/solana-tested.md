# Solana RPCs

> **Note:** 
> - **RPS** = Requests per second YOU can send to this RPC
> - **TPS** = Network-wide transactions (from `getRecentPerformanceSamples`), NOT your throughput
> - **Realistic TX/sec** = ~RPS ÷ 3 (each TX needs ~3 RPC calls: blockhash + send + confirm)
> - Solana has no mempool - all RPCs are **Safe TX = yes**

| Name | URL | Auth Header | RPS | Realistic TX/sec | Network TPS | Status |
| ---- | --- | ----------- | --- | ---------------- | ----------- | ------ |
| Official | https://api.mainnet-beta.solana.com | - | 424 | ~140 | - | working |
| DRPC | https://solana.drpc.org | `Authorization: Bearer <key>` | 232 | ~77 | - | needs-key |
| PublicNode | https://solana-rpc.publicnode.com | - | 235 | ~78 | ~3,400 | working |
| Triton | https://triton.mainnet.rpcpool.com | - | 145 | ~48 | - | working |
| Helius | https://mainnet.helius-rpc.com | `Authorization: Bearer <key>` | - | 300+ | - | needs-key |
| BlockPi | https://solana.blockpi.network/v1/rpc/public | - | 63 | ~21 | - | working |
| Ankr | https://rpc.ankr.com/solana | `Authorization: Bearer <key>` | - | - | - | needs-key |
| QuickNode | https://*.solana-mainnet.quiknode.pro | `Authorization: Bearer <key>` | - | 500+ | - | needs-key |
| 1rpc.io | https://1rpc.io/solana | - | - | - | - | rate-limited |
| Blast | https://solana.public-rpc.com | - | - | - | - | rate-limited |
| GetBlock | https://solana.getblock.io | - | - | - | - | rate-limited |
| Alchemy | https://solana-mainnet.g.alchemy.com/v2/demo | - | - | - | - | rate-limited |
| GenesysGo | https://ssc-dao.genesysgo.net | - | - | - | - | rate-limited |
| Serium | https://api.serum-vial.io/v1 | - | - | - | - | rate-limited |

## Method Availability

| Method | Free Tier | Paid Tier |
| ------ | --------- | --------- |
| `getHealth` | ✅ All | ✅ All |
| `getSlot` | ✅ All | ✅ All |
| `getRecentPerformanceSamples` | ⚠️ PublicNode only | ✅ Most |
| `sendTransaction` | ✅ All | ✅ All |

## For High-Volume Bots

To send 1,000+ TX/sec, use **multiple RPCs load-balanced** or **paid tier**:

```go
rpcs := []string{
    "https://api.mainnet-beta.solana.com",    // 424 RPS
    "https://solana-rpc.publicnode.com",       // 235 RPS  
    "https://triton.mainnet.rpcpool.com",      // 145 RPS
}
// Total: ~800 RPS = ~260 TX/sec with free tier
```

**Paid options for high throughput:**
- **Helius** - 1,000+ RPS, good for MEV
- **QuickNode** - Dedicated nodes, 500+ RPS
- **DRPC** - Flexible tiers
