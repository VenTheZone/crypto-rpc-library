# RPC Library Audit - 2026-04-23

## Summary
- Chains audited: 15
- Total RPCs tested: 124
- Working: 78 | Dead: 46 | New: 0
- Health Score: 62.9%

## Per-Chain Results

| Chain | Total | Working | Dead | Top RPS |
|-------|-------|---------|------|---------|
| bnb | 6 | 5 | 1 | Binance (151) |
| ethereum | 20 | 10 | 10 | OmniTrade (360) |
| solana | 14 | 14 | 0 | RPC Pool Solend (835) |
| arbitrum | 10 | 4 | 6 | Ankr (183) |
| base | 16 | 14 | 2 | Tenderly (111) |
| polygon | 10 | 4 | 6 | DRPC (171) |
| avalanche | 9 | 4 | 5 | Avalanche Official (49) |
| optimism | 9 | 5 | 4 | DRPC (184) |
| fantom | 5 | 5 | 0 | DRPC (137) |
| celo | 4 | 2 | 2 | Ankr (111) |
| scroll | 4 | 2 | 2 | BlockPi (86) |
| linea | 5 | 2 | 3 | Blast (168) |
| mantle | 4 | 2 | 2 | BlockPi (100) |
| gnosis | 3 | 2 | 1 | Ankr (172) |
| zksync | 5 | 3 | 2 | zkSync (260) |

## Dead RPCs (RPS=0)

### Ethereum (7)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Alchemy | 0 | Requires API key |
| Infura | 0 | Requires API key |
| QuickNode | 0 | Requires API key |
| NodeReal | 0 | No response |
| BlockPi | 0 | No response |
| GetBlock | 0 | Requires API key |
| Pocket | 0 | Connection failed |

### Arbitrum (6)
| RPC | Last RPS | Error |
|-----|----------|-------|
| BlockPi | 0 | No response |
| QuickNode | 0 | Requires API key |
| Alchemy | 0 | Requires API key |
| Infura | 0 | Requires API key |
| Blast | 0 | Connection failed |
| Offchain | 0 | Connection failed |

### Optimism (4)
| RPC | Last RPS | Error |
|-----|----------|-------|
| BlockPi | 0 | No response |
| QuickNode | 0 | Requires API key |
| Alchemy | 0 | Requires API key |
| Infura | 0 | Requires API key |

### Celo (2)
| RPC | Last RPS | Error |
|-----|----------|-------|
| QuickNode | 0 | Requires API key |
| Blast | 0 | Connection failed |

### Scroll (2)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Ankr | 0 | No response |
| QuickNode | 0 | Requires API key |

### Linea (3)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Ankr | 0 | No response |
| BlockPi | 0 | No response |
| QuickNode | 0 | Requires API key |

### Mantle (2)
| RPC | Last RPS | Error |
|-----|----------|-------|
| Ankr | 0 | No response |
| QuickNode | 0 | Requires API key |

### Gnosis (1)
| RPC | Last RPS | Error |
|-----|----------|-------|
| BlockPi | 0 | No response |

### zkSync (2)
| RPC | Last RPS | Error |
|-----|----------|-------|
| BlockPi | 0 | No response |
| QuickNode | 0 | Requires API key |

## New RPCs Added

None discovered in this run.

## Top Performers (by RPS)
1. **Solana RPC Pool Solend**: 835 RPS (IP-restricted)
2. **zkSync Official**: 260 RPS
3. **Ethereum Tenderly**: 249 RPS
4. **Ethereum OmniTrade**: 360 RPS
5. **BNB Binance**: 151 RPS

## MEV-Safe RPCs (Recommended)

| Chain | RPC | RPS | Safe |
|-------|-----|-----|------|
| bnb | PancakeSwap | 77 | yes |
| bnb | PancakeSwap Alpha | 83 | yes |
| bnb | PublicNode | 126 | yes |
| ethereum | Tenderly | 249 | yes |
| ethereum | Blast | 156 | yes |
| ethereum | Cloudflare | 121 | yes |
| ethereum | OnFinality | 83 | yes |
| arbitrum | Ankr | 183 | yes |
| arbitrum | PublicNode | 123 | yes |
| optimism | Optimism | 100 | yes |
| optimism | Ankr | 171 | yes |
| fantom | DRPC | 137 | yes |
| fantom | Ankr | 130 | yes |
| zksync | zkSync | 260 | yes |

## Changes Made

### Files Modified (15 tested.md)
- networks/evm/bnb/tested.md
- networks/evm/ethereum/tested.md
- networks/evm/arbitrum/tested.md
- networks/evm/base/tested.md
- networks/evm/polygon/tested.md
- networks/evm/avalanche/tested.md
- networks/evm/optimism/tested.md
- networks/evm/fantom/tested.md
- networks/evm/celo/tested.md
- networks/evm/scroll/tested.md
- networks/evm/linea/tested.md
- networks/evm/mantle/tested.md
- networks/evm/gnosis/tested.md
- networks/evm/zksync/tested.md
- networks/solana/tested.md

### New Files Created (10 dead-rpcs.md)
- networks/evm/ethereum/dead-rpcs.md
- networks/evm/arbitrum/dead-rpcs.md
- networks/evm/optimism/dead-rpcs.md
- networks/evm/celo/dead-rpcs.md
- networks/evm/scroll/dead-rpcs.md
- networks/evm/linea/dead-rpcs.md
- networks/evm/mantle/dead-rpcs.md
- networks/evm/gnosis/dead-rpcs.md
- networks/evm/zksync/dead-rpcs.md

### Report Generated
- NETWORKS.md (full collection health report)

## Key Findings

1. **Fantom**: 100% health - all RPCs working
2. **Solana**: 100% health - best performer with 835 RPS endpoint
3. **Ethereum**: 50% health - many API-key providers failing
4. **BlockPi**: Systematic failures across 7+ chains
5. **QuickNode/Alchemy/Infura**: All require valid API keys

## MemPalace Updates
- Rooms updated: audit-log, chain-health, collection-stats, decisions, discovery-findings, dead-rpcs
- Tunnels created: TheBigSandwich (BSC RPC), Solana-Scavenger-Arb (Solana RPC)

## Recommendations

1. Obtain API keys for major providers (Alchemy, Infura, QuickNode) to verify actual performance
2. Focus on maintaining DRPC/Ankr/PublicNode as reliable public alternatives
3. Fantom chain showing excellent reliability - prioritize for MEV operations
4. Consider dropping BlockPi from standard rotations until stability improves

---
Audit completed: 2026-04-23 05:23 UTC
