# Crypto-RPC Library — Network Registry

> **Last Updated:** 2026-04-24
> Auto-generated from live RPC health checks

## 📊 Collection Overview

| Metric | Value |
|--------|-------|
| **Chains Covered** | 16 |
| **Total RPCs** | ~150 |
| **Working** | 89 |
| **Dead** | ~46 |
| **Health Score** | 66% |

---

## 🔗 Chain Summary

| Chain | Total | Working | Dead | Health | Top Performer | RPS | MEV-Safe |
|-------|-------|---------|------|--------|---------------|-----|----------|
| arbitrum | 10 | 3 | 7 | 30% | Ankr | 202 | ✅ yes |
| avalanche | 9 | 7 | 2 | 78% | Ankr | 399 | ✅ yes |
| base | 16 | 10 | 2 | 63% | Tenderly | 111 | ✅ yes |
| berachain | 4 | 2 | 2 | 50% | Berachain | 89 | ❌ no |
| bnb | 6 | 6 | 0 | 100% | Ankr | 205 | ✅ yes |
| celo | 4 | 3 | 1 | 75% | Celo | 107 | ✅ yes |
| ethereum | 20 | 13 | 10 | 65% | Tenderly | 374 | ✅ yes |
| fantom | 5 | 5 | 0 | 100% | DRPC | 140 | ✅ yes |
| gnosis | 3 | 3 | 0 | 100% | Ankr | 180 | ✅ yes |
| linea | 5 | 3 | 2 | 60% | Blast | 189 | ✅ yes |
| mantle | 4 | 3 | 1 | 75% | BlockPi | 65 | ✅ yes |
| optimism | 9 | 7 | 2 | 78% | Ankr | 208 | ✅ yes |
| polygon | 10 | 6 | 4 | 60% | Ankr | 200 | ✅ yes |
| scroll | 4 | 2 | 2 | 50% | Scroll | 128 | ✅ yes |
| solana | 14 | ~14 | 0 | 100% | Solana Official | 672 | ✅ yes |
| zksync | 5 | 5 | 0 | 100% | zkSync | 195 | ✅ yes |

---

## ⚠️ Critical Findings

### Perfect Health Chains (100% working)
- **bnb**: 6/6 working - Ankr (205 RPS), Binance (151 RPS), PancakeSwap variants
- **fantom**: 5/5 working - DRPC (140 RPS), Ankr (140 RPS), 1rpc.io (123 RPS)
- **gnosis**: 3/3 working - Ankr (180 RPS), Gnosis Official (56 RPS)
- **solana**: All endpoints responding - Solana Official (672 RPS), DRPC (552 RPS)
- **zksync**: 5/5 working - zkSync Official (195 RPS), Blast (190 RPS)

### Chains with Parsing Issues (tested via alternative format)
- **base**: Uses custom header format with latency/mempool exposure data
- **avalanche**: Uses separate path (networks/avalanche/ vs networks/evm/avalanche/)

### Provider Performance Summary

#### Top Performers by RPS
1. **Avalanche - Ankr**: 399 RPS (MEV-safe)
2. **Optimism - Ankr**: 208 RPS (MEV-safe)
3. **BNB - Ankr**: 205 RPS (MEV-safe)
4. **Polygon - Ankr**: 200 RPS (MEV-safe)
5. **zkSync - zkSync**: 195 RPS (MEV-safe)
6. **Linea - Blast**: 189 RPS (MEV-safe)
7. **Gnosis - Ankr**: 180 RPS (MEV-safe)
8. **Ethereum - Tenderly**: 374 RPS (MEV-safe)
9. **Arbitrum - Ankr**: 202 RPS (MEV-safe)
10. **Solana - Solana Official**: 672 RPS (MEV-safe)

#### Mempool Safety Analysis
- **Fully MEV-Safe**: Ankr, 1rpc.io, Blast, Cloudflare, Tenderly, Official RPCs
- **Mempool Exposed**: PublicNode (most chains), DRPC (some chains), Fantom RPCs

### Problematic Providers
| Provider | Issue | Chains Affected |
|----------|-------|-----------------|
| QuickNode | Requires valid API key | All chains (0 RPS in tests) |
| Alchemy | Requires valid API key | All chains (0 RPS in tests) |
| Infura | Requires valid API key | All chains (0 RPS in tests) |
| BlockPi | Mixed results - some chains 0 RPS | Scroll, Linea, Arbitrum |
| Blast | Intermittent failures | Arbitrum, Celo, Linea |

---

## 📁 Directory Structure

```
networks/
├── evm/
│   ├── bnb/              # BNB Chain (6 working, 0 dead)
│   ├── ethereum/         # Ethereum Mainnet (13 working, 7 dead)
│   ├── arbitrum/         # Arbitrum One (3 working, 7 dead)
│   ├── base/             # Base (10 working, 2 dead)
│   ├── berachain/        # Berachain (2 working, 2 dead)
│   ├── polygon/          # Polygon PoS (6 working, 4 dead)
│   ├── avalanche/        # Avalanche C-Chain (7 working, 2 dead)
│   ├── optimism/         # Optimism (7 working, 2 dead)
│   ├── fantom/           # Fantom (5 working, 0 dead)
│   ├── celo/             # Celo (3 working, 1 dead)
│   ├── scroll/           # Scroll (2 working, 2 dead)
│   ├── linea/            # Linea (3 working, 2 dead)
│   ├── mantle/           # Mantle (3 working, 1 dead)
│   ├── gnosis/           # Gnosis Chain (3 working, 0 dead)
│   ├── zksync/           # zkSync Era (5 working, 0 dead)
│   └── ...               # More chains
├── solana/               # Solana Mainnet (14 working)
└── avalanche/            # Duplicate - needs consolidation
```

---

## 🔧 Dead RPC Graveyard

Dead RPCs tracked per chain:

| Chain | Dead RPCs File |
|-------|------------------|
| arbitrum | [dead-rpcs.md](networks/evm/arbitrum/dead-rpcs.md) |
| avalanche | [dead-rpcs.md](networks/evm/avalanche/dead-rpcs.md) |
| base | [dead-rpcs.md](networks/evm/base/dead-rpcs.md) |
| berachain | [dead-rpcs.md](networks/evm/berachain/dead-rpcs.md) |
| celo | [dead-rpcs.md](networks/evm/celo/dead-rpcs.md) |
| ethereum | [dead-rpcs.md](networks/evm/ethereum/dead-rpcs.md) |
| gnosis | [dead-rpcs.md](networks/evm/gnosis/dead-rpcs.md) |
| klaytn | [dead-rpcs.md](networks/evm/klaytn/dead-rpcs.md) |
| linea | [dead-rpcs.md](networks/evm/linea/dead-rpcs.md) |
| mantle | [dead-rpcs.md](networks/evm/mantle/dead-rpcs.md) |
| optimism | [dead-rpcs.md](networks/evm/optimism/dead-rpcs.md) |
| polygon | [dead-rpcs.md](networks/evm/polygon/dead-rpcs.md) |
| scroll | [dead-rpcs.md](networks/evm/scroll/dead-rpcs.md) |
| zksync | [dead-rpcs.md](networks/evm/zksync/dead-rpcs.md) |

---

## 📝 Testing Methodology

- **RPS**: Requests per second (25 concurrent requests, `-c 25`)
- **TPS**: Transactions per second (network throughput)
- **Mempool**: Whether `txpool_content` returns pending transactions
- **Safe TX**: Mempool-safe (no MEV exposure risk via txpool)
- **Test Frequency**: Priority chains daily, secondary chains rotated
- **Priority Chains**: bnb, ethereum, solana, arbitrum, base, polygon, avalanche, optimism

---

## 🎯 Recommendations

### Best RPCs by Use Case

| Use Case | Recommended RPC | Chain | RPS | Safe? |
|----------|-----------------|-------|-----|-------|
| **High Speed** | Ankr | Avalanche | 399 | ✅ |
| **MEV Protection** | 1rpc.io | Any EVM | ~100-140 | ✅ |
| **Low Latency** | Tenderly | Ethereum | 374 | ✅ |
| **Official/Gov** | Official RPCs | All | Varies | Usually ✅ |
| **Free Tier** | PublicNode | Most | ~50-150 | ❌ (exposed) |
| **Solana Degen** | Solana Official | Solana | 672 | ✅ |

### Chains Needing Attention
- **Arbitrum**: 70% failure rate - BlockPi, DRPC, Blast failing
- **Base**: Some parsing issues - verify table format
- **Berachain**: All public RPCs expose mempool (MEV risk)

---

*Generated by crypto-rpc-library auditor — 2026-04-24*
*Audit: 16 chains tested, 89 working RPCs confirmed*
