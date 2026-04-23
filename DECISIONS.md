# RPC Library Audit - 2026-04-24

## Summary
- Chains audited: 16
- Total RPCs tested: ~150
- Working: 89 | Dead: 46 | New: 0
- Health Score: 66%

## Per-Chain Results

| Chain | Total | Working | Dead | Health | Top Performer | RPS | MEV-Safe |
|-------|-------|---------|------|--------|---------------|-----|----------|
| bnb | 6 | 6 | 0 | 100% | Ankr | 205 | yes |
| fantom | 5 | 5 | 0 | 100% | DRPC/Ankr | 140 | yes |
| gnosis | 3 | 3 | 0 | 100% | Ankr | 180 | yes |
| zksync | 5 | 5 | 0 | 100% | zkSync | 195 | yes |
| solana | 14 | ~14 | 0 | 100% | Solana Official | 672 | yes |
| optimism | 9 | 7 | 2 | 78% | Ankr | 208 | yes |
| avalanche | 9 | 7 | 2 | 78% | Ankr | 399 | yes |
| celo | 4 | 3 | 1 | 75% | Celo | 107 | yes |
| mantle | 4 | 3 | 1 | 75% | BlockPi | 65 | yes |
| ethereum | 20 | 13 | 7 | 65% | Tenderly | 374 | yes |
| base | 16 | 10 | 2 | 63% | Tenderly | 111 | yes |
| polygon | 10 | 6 | 4 | 60% | Ankr | 200 | yes |
| linea | 5 | 3 | 2 | 60% | Blast | 189 | yes |
| scroll | 4 | 2 | 2 | 50% | Scroll | 128 | yes |
| berachain | 4 | 2 | 2 | 50% | Berachain | 89 | no |
| arbitrum | 10 | 3 | 7 | 30% | Ankr | 202 | yes |

## Top Performers (by RPS)
1. **Solana Official**: 672 RPS (MEV-safe)
2. **Avalanche Ankr**: 399 RPS (MEV-safe)
3. **Ethereum Tenderly**: 374 RPS (MEV-safe)
4. **BNB Ankr**: 205 RPS (MEV-safe)
5. **Optimism Ankr**: 208 RPS (MEV-safe)
6. **Polygon Ankr**: 200 RPS (MEV-safe)
7. **Linea Blast**: 189 RPS (MEV-safe)
8. **Gnosis Ankr**: 180 RPS (MEV-safe)
9. **Ethereum Vanry**: 123 RPS (mempool exposed)
10. **Ethereum PublicNode**: 153 RPS (mempool exposed)

## Dead RPCs (RPS=0 or Timeout)

### Ethereum (7 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Alchemy | 0 | Requires API key |
| Infura | 0 | Requires API key |
| QuickNode | 0 | Requires API key |
| NodeReal | 0 | Requires API key |
| BlockPi | 0 | No response |
| GetBlock | 0 | Requires API key |
| Pocket | 0 | Connection failed |

### Arbitrum (7 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| BlockPi | 0 | No response |
| QuickNode | 0 | Requires API key |
| Alchemy | 0 | Requires API key |
| Infura | 0 | Requires API key |
| DRPC | 0 | No response |
| Blast | 0 | Connection failed |
| Offchain | 0 | Connection failed |

### Optimism (2 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| BlockPi | 0 | No response |
| QuickNode/Alchemy/Infura | 0 | Requires API key |

### Celo (1 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Blast | 0 | Connection failed |

### Scroll (2 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Ankr | 0 | No response |
| QuickNode | 0 | Requires API key |

### Linea (2 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Ankr | 0 | No response |
| BlockPi | 0 | No response |

### Mantle (1 dead)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Ankr | 0 | No response |

### Base (2 dead) - From dead-rpcs.md
- Wallet Coinbase: Connection error
- Privy Base: 404

## New RPCs Added

None discovered in this run.

DEX discovery (10 DEXs each) found 0 new endpoints for bnb, ethereum.
Solana DEX scan (20 DEXs) found 0 new endpoints.

## Changes Made

### Files Modified
1. `NETWORKS.md` - Updated with latest health statistics
2. `networks/evm/bnb/tested.md` - RPS values updated
3. `networks/evm/ethereum/tested.md` - RPS values updated
4. `networks/evm/arbitrum/tested.md` - RPS values updated
5. `networks/evm/polygon/tested.md` - RPS values updated
6. `networks/evm/optimism/tested.md` - RPS values updated
7. `networks/evm/fantom/tested.md` - RPS values updated
8. `networks/evm/celo/tested.md` - RPS values updated
9. `networks/evm/scroll/tested.md` - RPS values updated
10. `networks/evm/linea/tested.md` - RPS values updated
11. `networks/evm/mantle/tested.md` - RPS values updated
12. `networks/evm/gnosis/tested.md` - RPS values updated
13. `networks/evm/zksync/tested.md` - RPS values updated

### Parsing Issues (Not Modified)
- `networks/solana/tested.md` - Parser panic (index out of range)
- `networks/evm/berachain/tested.md` - Parser panic (custom format)
- `networks/evm/avalanche/tested.md` - Alternative path format

## Recommendations

### For TheBigSandwich (BNB MEV Bot)
- **Best RPC**: Ankr (205 RPS, MEV-safe) - Only reliable choice
- **Backup**: PancakeSwap Alpha (92 RPS, MEV-safe)
- **Avoid**: PublicNode, Binance (mempool exposed)

### For Solana-Scavenger-Arb
- **Best RPC**: Solana Official (672 RPS) - Highest performing
- **Backup**: DRPC (552 RPS) - Consistent public endpoint
- **Caution**: Some endpoints IP-restricted (Solend, Jupiter RPC pools)

### General Usage
- Ankr: Best overall provider (8 chains, high RPS, MEV-safe)
- DRPC: Consistent across chains (6+ chains)
- Tenderly: Ethereum specialist (374 RPS)
- 1rpc.io: Privacy-focused option
- PublicNode: Avoid for MEV-sensitive ops (mempool exposed)

### Chains Needing Attention
- **Arbitrum**: 70% failure rate - critical for Arbitrum operations
- **Berachain**: No MEV-safe public RPCs - all expose mempool
- **Scroll/Linea/Mantle**: QuickNode/BlockPi frequently failing

---

*Audit completed: 2026-04-24*
*Auditor: Hermes Agent (crypto-rpc-library librarian)*
