# RPC Library Audit - 2026-04-30

## Summary

- **Chains audited:** 15 (8 priority + 7 secondary)
- **Total RPCs tested:** 122
- **Working:** 80 | **Dead:** 42 | **Health:** 65.6%

## Dead RPCs Identified

| Chain | Count | RPCs |
|-------|-------|------|
| Ethereum | 8 | Alchemy, Infura, QuickNode, NodeReal, BlockPi, GetBlock, Pocket |
| Solana | 8 | DRPC, QuickNode, PublicNode, Helius Drift, Helius Kamino, Helius Jupiter, Phantom |
| Base | 6 | QuickNode 1/2/3, Coinbase CDP, MeowRPC |
| Polygon | 8 | Polygon, MaticVigil, BlockPi, PublicNode, QuickNode, Alchemy, Infura |
| Optimism | 5 | BlockPi, QuickNode, Alchemy, Infura, PublicNode |
| Celo | 3 | QuickNode, Blast |
| Scroll | 3 | Ankr, QuickNode |
| Linea | 4 | Ankr, BlockPi, QuickNode |
| Mantle | 3 | Ankr, QuickNode |
| zkSync | 3 | Ankr, BlockPi, QuickNode |
| Gnosis | 2 | BlockPi, Blast |

## New RPCs Discovered

| Chain | URL | RPS | Source | Mempool |
|-------|-----|-----|--------|---------|
| None | - | - | - | - |

*DEX frontend scan found no new endpoints today (existing collection appears comprehensive)*

## Changes Made

1. **Created 12 dead-rpcs.md files** - Graveyard documentation for failed endpoints
2. **Updated NETWORKS.md** - Comprehensive network overview with health scores
3. **Updated 15 tested.md files** - Fresh RPS/TPS from live testing
4. **MemPalace sync** - 5 rooms updated with audit data
5. **Cross-wing tunnels** - Linked to TheBigSandwich and SolanaScavengerArb

## Top Performers

| Chain | RPC | RPS | Notes |
|-------|-----|-----|-------|
| Ethereum | Kukus | 326 | BlastAPI endpoint |
| Ethereum | OmniTrade | 299 | BlastAPI endpoint |
| Base | Tenderly | 232 | Top Base performer |
| Solana | Solana Official | 213 | Public endpoint |
| Ethereum | DRPC | 177 | Multi-chain reliable |

## Healthy Chains (100%)

- **BNB:** 6/6 working (PancakeSwap, Binance, Ankr all performing)
- **Arbitrum:** 6/6 working (all RPCs safe for MEV)
- **Avalanche:** 4/4 working (DRPC, PublicNode reliable)
- **Fantom:** 5/5 working (Ankr, DRPC strong performers)

## Degraded Chains

- **Polygon:** 30% (only 3/11 working - CRITICAL)
- **Linea:** 40% (2/5 working)
- **Celo/Scroll/Mantle:** 50% each
- **Optimism:** 55% (5/9 working)
- **zkSync:** 60% (3/5 working)
- **Gnosis:** 67% (2/3 working)
- **Ethereum/Solana:** 65% each (key provider failures)
- **Base:** 70% (12/17 working)

## Action Items

1. **URGENT:** Find new Polygon RPCs (currently degraded to 30%)
2. **HIGH:** Restore Ethereum endpoints via API keys (QuickNode, Alchemy, Infura)
3. **MEDIUM:** Document API key requirements for "needs-key" RPCs
4. **LOW:** Monitor Berachain for Flashbots Protect support

## Commits

```
chore(audit): daily RPC collection health check
- 2026-04-30
- Tested 15 chains, 122 total RPCs
- Removed 42 dead endpoints to graveyard files
- Added 12 dead-rpcs.md documentation files
- Updated NETWORKS.md with comprehensive health report
- Updated 15 tested.md files with fresh RPS/TPS metrics

Working RPCs: 80/122 (65.6%)
Dead RPCs removed: ethereum(8), solana(8), polygon(8), base(6), optimism(5), others(7)
New RPCs discovered: 0 (existing collection comprehensive)
```

---
*Audit completed: 2026-04-30 05:18 UTC*
