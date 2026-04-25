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

---

# RPC Library Audit - 2026-04-25

## Summary
- Chains audited: 26
- Total RPCs tested: 112
- Working: 64 | Dead: 12 truly dead, 34 needs-auth | New: 0
- Health Score: 57%

## Per-Chain Results

| Chain | Total | Working | Dead | Health | Top Performer | RPS | MEV-Safe |
|-------|-------|---------|------|--------|---------------|-----|----------|
| bnb | 6 | 6 | 0 | 100% | Ankr | 138 | yes |
| fantom | 5 | 5 | 0 | 100% | DRPC | 131 | yes |
| gnosis | 3 | 2 | 1 | 67% | Ankr | 151 | yes |
| zksync | 5 | 3 | 2 | 60% | zkSync | 229 | yes |
| solana | 18 | 14 | 1 | 78% | Solana Official | 672 | yes |
| optimism | 9 | 6 | 3 | 67% | DRPC | 176 | yes |
| ethereum | 20 | 13 | 7 | 65% | Tenderly | 366 | yes |
| polygon | 10 | 3 | 7 | 30% | Ankr | 195 | yes |
| linea | 5 | 2 | 3 | 40% | Blast | 190 | yes |
| scroll | 4 | 2 | 2 | 50% | Scroll | 86 | yes |
| arbitrum | 10 | 4 | 6 | 40% | DRPC | 173 | yes |
| base | 16 | 9 | 7 | 56% | Tenderly | 111 | yes |
| mantle | 4 | 2 | 2 | 50% | BlockPi | 84 | yes |
| celo | 4 | 2 | 2 | 50% | Celo | 82 | yes |

## Top Performers (by RPS)
1. **Solana Official**: 672 RPS (MEV-safe)
2. **QuickNode Solana**: 633 RPS (API key required)
3. **Solana DRPC**: 552 RPS (MEV-safe, public)
4. **Ethereum Tenderly**: 366 RPS (MEV-safe)
5. **Ethereum OmniTrade**: 329 RPS (MEV-safe)
6. **zksync zkSync**: 229 RPS (MEV-safe)
7. **Polygon Ankr**: 195 RPS (MEV-safe)
8. **Linea Blast**: 190 RPS (MEV-safe)
9. **Polygon Blast**: 189 RPS (MEV-safe)
10. **Optimism DRPC**: 176 RPS (MEV-safe)

## New Dead RPCs Confirmed

### Polygon
| RPC | URL | Error |
|-----|-----|-------|
| MaticVigil | https://rpc-mainnet.maticvigil.com | "Our RPC has been shut down - thank you for 4 years of support!" |
| Polygon Official | https://polygon-rpc.com | API key disabled, tenant disabled |
| BlockPi | https://polygon.blockpi.network/v1/rpc/public | No response |
| PublicNode | https://polygon-rpc.publicnode.com | No response |

### Other Dead RPCs

| Chain | RPC | URL | Status |
|-------|-----|-----|--------|
| aurora | Ankr | network.aurora.dev | dead |
| astar | Astar | astar.public-rpc.com | dead |
| astar | Ankr | rpc.ankr.com/astar | dead |
| callisto | Callisto | - | dead |
| godwoken | Godwoken | - | dead |
| klaytn | Old endpoint | public-node-kaia.com | rebranded to Kaia |

## Needs Auth (Not Dead)
Many premium providers require API keys - these are NOT dead, just inaccessible without proper authentication:
- Alchemy (ethereum, arbitrum, polygon, optimism, etc)
- Infura (ethereum, arbitrum, polygon, optimism)
- QuickNode (ethereum, arbitrum, polygon, optimism, base, etc)
- BlockPi (arbitrum, polygon, optimism, linea, etc)
- Ankr pro endpoints (cronos, etc, moonbeam, etc)

## Changes Made

### Files Modified (24 tested.md files updated)
Updated with fresh RPS/TPS values from live tests:
- networks/evm/bnb/tested.md
- networks/evm/ethereum/tested.md
- networks/evm/arbitrum/tested.md
- networks/evm/polygon/tested.md
- networks/evm/optimism/tested.md
- networks/evm/fantom/tested.md
- networks/evm/celo/tested.md
- networks/evm/scroll/tested.md
- networks/evm/linea/tested.md
- networks/evm/mantle/tested.md
- networks/evm/gnosis/tested.md
- networks/evm/zksync/tested.md
- networks/evm/cronos/tested.md
- networks/evm/etc/tested.md
- networks/evm/moonbeam/tested.md
- networks/evm/taiko/tested.md
- networks/evm/ronin/tested.md
- networks/evm/harmony/tested.md
- networks/evm/iotex/tested.md
- networks/evm/klaytn/tested.md
- networks/evm/aurora/tested.md
- networks/evm/astar/tested.md
- networks/evm/bittorrent/tested.md
- networks/evm/fuse/tested.md
- networks/evm/callisto/tested.md
- networks/evm/godwoken/tested.md

### New Files Created
- networks/evm/polygon/dead-rpcs.md
- networks/evm/astar/dead-rpcs.md
- networks/evm/aurora/dead-rpcs.md
- networks/evm/callisto/dead-rpcs.md
- networks/evm/godwoken/dead-rpcs.md
- networks/evm/klaytn/dead-rpcs.md

### Files Not Updated (Parser Errors)
- networks/solana/tested.md - Parser panic (index out of range)
- networks/evm/base/tested.md - Parser panic (custom table format)
- networks/evm/avalanche/tested.md - Parser panic (custom format)
- networks/evm/berachain/tested.md - Parser panic (custom format)

## MemPalace Updates

### Rooms Updated
- audit-log: Today's audit summary (26 chains, 112 RPCs tested)
- chain-health: Per-chain health status
- dead-rpcs: Graveyard with 12 confirmed dead endpoints
- collection-stats: Currently 57% health score

### Tunnels Created
- Linked to TheBigSandwich wing (BNB RPC data)

## Recommendations

### For TheBigSandwich (BNB MEV Bot)
- **Primary**: Ankr (138 RPS, MEV-safe)
- **Backup**: PancakeSwap Alpha (91 RPS, MEV-safe)
- **Avoid**: PublicNode, Binance (mempool exposed)
- All 6 BNB RPCs are working - healthy chain

### For Solana Operations
- **Best Public**: Solana Official (672 RPS) or DRPC (552 RPS)
- **Caution**: Many RPC Pool endpoints are IP-restricted to specific DEX infra
- Solana RPCs are simpler - no mempool exposure concerns

### For Ethereum MEV
- **Best**: Tenderly (366 RPS) - MEV-safe, fastest
- **Fast**: OmniTrade (329 RPS), Kukus (288 RPS)
- Many public endpoints showing 0 RPS - consider API key access for premium providers

### Chains Needing Attention
- **Polygon**: 70% dead - MaticVigil shut down, official disabled
- **Astar**: 100% dead - both endpoints confirmed dead
- **Arbitrum**: 60% need keys - only 4 working public endpoints

---

# RPC Library Audit - 2026-04-26

## Summary
- Chains audited: 12 (8 priority + 8 secondary for day 26)
- Total RPCs tested: 85
- Working: 49 | Needs-auth/No-response: 36
- Health Score: 57.6%

## Per-Chain Results

| Chain | Total | Working | Dead/Key | Health | Top Performer | RPS | MEV-Safe |
|-------|-------|---------|--------|--------|---------------|-----|----------|
| bnb | 6 | 6 | 0 | **100%** | Ankr | 167 | ✅ |
| fantom | 5 | 5 | 0 | **100%** | Ankr | 139 | ✅ |
| zksync | 5 | 3 | 2 | 60% | zkSync | 284 | ✅ |
| optimism | 9 | 5 | 4 | 56% | DRPC | 167 | ✅ |
| gnosis | 3 | 2 | 1 | 67% | Ankr | 201 | ✅ |
| ethereum | 20 | 13 | 7 | 65% | OmniTrade | 343 | ✅ |
| arbitrum | 10 | 4 | 6 | 40% | DRPC | 192 | ✅ |
| polygon | 10 | 3 | 7 | 30% | Ankr | 190 | ✅ |
| celo | 4 | 2 | 2 | 50% | Celo | 70 | ✅ |
| scroll | 4 | 2 | 2 | 50% | Scroll | 108 | ✅ |
| linea | 5 | 2 | 3 | 40% | Blast | 186 | ✅ |
| mantle | 4 | 2 | 2 | 50% | BlockPi | 34 | ✅ |

## Top Performers (by RPS)
1. **OmniTrade (Ethereum)**: 343 RPS (MEV-safe)
2. **zkSync**: 284 RPS (MEV-safe)
3. **Tenderly (Ethereum)**: 282 RPS (MEV-safe)
4. **Ankr (Gnosis)**: 201 RPS (MEV-safe)
5. **DRPC (Arbitrum)**: 192 RPS (MEV-safe)

## Changes Made

### Files Updated (12 tested.md files)
Updated with fresh RPS/TPS values from live tests:
- networks/evm/bnb/tested.md (6 RPCs updated)
- networks/evm/ethereum/tested.md (13/20 working updated)
- networks/evm/arbitrum/tested.md (4/10 working updated)
- networks/evm/polygon/tested.md (3/10 working updated)
- networks/evm/optimism/tested.md (5/9 working updated)
- networks/evm/fantom/tested.md (5/5 working updated)
- networks/evm/celo/tested.md (2/4 working updated)
- networks/evm/scroll/tested.md (2/4 working updated)
- networks/evm/linea/tested.md (2/5 working updated)
- networks/evm/mantle/tested.md (2/4 working updated)
- networks/evm/gnosis/tested.md (2/3 working updated)
- networks/evm/zksync/tested.md (3/5 working updated)

### Discovery Results
- DEX discovery (BNB, Ethereum): 0 new endpoints found
- Solana DEX discovery: 0 new endpoints found
- No new RPCs added today

## Parser Issues

The following chains use custom table formats and cannot be auto-updated:
- networks/solana/tested.md (evm format mismatch)
- networks/evm/base/tested.md (custom sections)
- networks/evm/avalanche/tested.md (alt path format)
- networks/evm/berachain/tested.md (extra Origin column)

## Recommendations

### For TheBigSandwich (BNB MEV Bot)
- **Primary**: Ankr (167 RPS, MEV-safe) - Updated RPS
- **Backup**: PancakeSwap Alpha (99 RPS, MEV-safe) - Updated RPS
- **Avoid**: PublicNode, Binance (mempool exposed)
- All 6 BNB RPCs working - healthy chain

### For Ethereum MEV
- **Best**: OmniTrade (343 RPS) - MEV-safe, fastest public
- **Fast**: Tenderly (282 RPS)
- **Alternative**: Kukus (247 RPS), DRPC (171 RPS)

### Chains Requiring Attention
- **Polygon**: Only 30% working - many need API keys
- **Arbitrum**: Only 40% working - many need API keys
- **Celo/Scroll/Mantle**: 50% working - secondary providers need keys

---

*Audit completed: 2026-04-26*
*Auditor: Hermes Agent (crypto-rpc-library librarian)*

---

# RPC Library Audit - 2026-04-26 (Run 2)

## Summary
- Chains audited: 14 (8 priority + 8 secondary - solana/avalanche skipped due to parser)
- Total RPCs tested: ~97 tested, ~65 working
- Working: 65 | Dead: 30 (21 needs-auth, 9 truly dead) | New: 0
- Health Score: 67%

## Dead RPCs by Chain
| Chain | Dead RPCs | Reason |
|-------|-----------|--------|
| ethereum | 7 | Alchemy, Infura, QuickNode, BlockPi, GetBlock, Pocket, NodeReal |
| arbitrum | 6 | QuickNode, Alchemy, Infura, Blast, Offchain, BlockPi |
| polygon | 7 | Polygon(official), MaticVigil, BlockPi, PublicNode, QuickNode, Alchemy, Infura |
| optimism | 4 | BlockPi, QuickNode, Alchemy, Infura |
| cronos | 1 | Ankr |
| etc | 1 | Ankr |
| moonbeam | 1 | BlockPi |
| iotex | 2 | Old IoTeX endpoint, Ankr |
| klaytn | 1 | Official Klaytn endpoint |

## New RPCs Discovered
- DEX discovery: 0 new endpoints (BNB, ETH, Solana)
- General discovery: 0 new endpoints

## Top Performers (Live Data)
| Rank | Provider | Chain | RPS | MEV-Safe |
|------|----------|-------|-----|----------|
| 1 | Tenderly | ethereum | 351 | ✅ |
| 2 | Binance | bnb | 147 | ❌ |
| 3 | DRPC | optimism | 184 | ❌ |
| 4 | Blast | polygon | 191 | ✅ |
| 5 | DRPC | arbitrum | 177 | ✅ |
| 6 | DRPC | ethereum | 176 | ❌ |
| 7 | Ankr | polygon | 178 | ✅ |
| 8 | Ankr | optimism | 165 | ✅ |
| 9 | Harmony | harmony | 161 | ✅ |
| 10 | Ankr | harmony | 166 | ✅ |

## Changes Made
### Updated Files (14 tested.md + code improvements)
1. networks/evm/bnb/tested.md - Updated live RPS/TPS values
2. networks/evm/ethereum/tested.md - Updated live RPS/TPS values  
3. networks/evm/arbitrum/tested.md - Updated live RPS/TPS values
4. networks/evm/polygon/tested.md - Updated live RPS/TPS values
5. networks/evm/optimism/tested.md - Updated live RPS/TPS values
6. networks/evm/cronos/tested.md - Updated live RPS/TPS values
7. networks/evm/etc/tested.md - Updated live RPS/TPS values
8. networks/evm/moonbeam/tested.md - Updated live RPS/TPS values
9. networks/evm/taiko/tested.md - Updated live RPS/TPS values
10. networks/evm/ronin/tested.md - Updated live RPS/TPS values
11. networks/evm/harmony/tested.md - Updated live RPS/TPS values
12. networks/evm/iotex/tested.md - Updated live RPS/TPS values
13. networks/evm/klaytn/tested.md - Updated live RPS/TPS values
14. deadrpc.txt - Updated graveyard with new dead RPCs
15. cmd/crypto-rpc/test.go - Fixed mempool origin propagation
16. internal/test/mempool.go - Added Origin header support
17. internal/test/tps.go - Minor fixes
18. scripts/monitor-rpcs.py - Synced

## Parser Issues
- Solana: Index out of range [6] - table format mismatch
- Avalanche: Index out of range [5] - table format mismatch
- Base: Custom format with latency columns
- Berachain: Extra Origin column

These chains need manual format updates.

## MemPalace Updated
- Rooms: audit-log, chain-health, dead-rpcs, collection-stats
- Tunnels: Created to TheBigSandwich and SolanaScavengerArb

## Recommendations

### For TheBigSandwich (BNB MEV Bot)
- **Primary**: Ankr (135 RPS, MEV-safe)
- **Backup**: PancakeSwap Alpha (82 RPS, MEV-safe)
- **Fast but Risky**: Binance (147 RPS, mempool exposed)

### Code Fix
- Mempool tester now properly propagates Origin headers (fixes txpool_content calls for Helius Jupiter, etc.)

*Audit completed: 2026-04-26 (2nd run of day)*
*Auditor: Hermes Agent (crypto-rpc-library librarian)*
