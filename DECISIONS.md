# RPC Library Audit - 2026-04-21

## Summary
- Chains audited: 13
- Total RPCs tested: 70
- Working: 40 | Dead: 30 | New: 0
- Health Score: 57.1%

## Per-Chain Results

| Chain | Total | Working | Dead | Top RPS |
|-------|-------|---------|------|---------|
| bnb | 6 | 6 | 0 | Binance (146) |
| ethereum | 20 | 13 | 7 | Tenderly (369) |
| arbitrum | 10 | 4 | 6 | DRPC (197) |
| polygon | 10 | 3 | 7 | Blast (188) |
| optimism | 9 | 5 | 4 | Blast (192) |
| cronos | 2 | 1 | 1 | Cronos (96) |
| etc | 2 | 1 | 1 | ETC (35) |
| moonbeam | 3 | 2 | 1 | Ankr (113) |
| taiko | 1 | 1 | 0 | Taiko (195) |
| ronin | 1 | 1 | 0 | Ronin (36) |
| harmony | 2 | 2 | 0 | Ankr (160) |
| iotex | 2 | 0 | 2 | - |
| klaytn | 2 | 1 | 1 | Ankr (27) |

## Dead RPCs (RPS=0 or Error)

| Chain | RPC | Last RPS | Error |
|-------|-----|----------|-------|
| ethereum | Alchemy | 0 | No auth/key required |
| ethereum | Infura | 0 | Requires auth |
| ethereum | QuickNode | 0 | Requires auth |
| ethereum | NodeReal | 0 | Requires auth |
| ethereum | BlockPi | 0 | Rate limited |
| ethereum | GetBlock | 0 | Requires auth |
| ethereum | Pocket | 0 | Requires auth |
| arbitrum | BlockPi | 0 | Rate limited |
| arbitrum | QuickNode | 0 | Requires auth |
| arbitrum | Alchemy | 0 | Requires auth |
| arbitrum | Infura | 0 | Requires auth |
| arbitrum | Blast | 0 | Connection error |
| arbitrum | Offchain | 0 | Connection error |
| polygon | Polygon | 0 | Connection error |
| polygon | MaticVigil | 0 | Connection error |
| polygon | BlockPi | 0 | Rate limited |
| polygon | PublicNode | 0 | Connection error |
| polygon | QuickNode | 0 | Requires auth |
| polygon | Alchemy | 0 | Requires auth |
| polygon | Infura | 0 | Requires auth |
| optimism | BlockPi | 0 | Rate limited |
| optimism | QuickNode | 0 | Requires auth |
| optimism | Alchemy | 0 | Requires auth |
| optimism | Infura | 0 | Requires auth |
| cronos | Ankr | 0 | Connection error |
| etc | Ankr | 0 | Connection error |
| moonbeam | BlockPi | 0 | Rate limited |
| iotex | IoTeX | 0 | Connection error |
| iotex | Ankr | 0 | Connection error |
| klaytn | Klaytn | 0 | Connection error |

## New RPCs Discovered

No new RPCs discovered in this run. DEX discovery found 0 endpoints (subfinder tool not available).

## Key Findings

### Top Performers by RPS
1. **Tenderly (Ethereum)**: 369 RPS - MEV-safe, excellent performance
2. **Taiko**: 195 RPS - Fast but mempool exposed
3. **Blast (Optimism)**: 192 RPS - MEV-safe
4. **DRPC (Arbitrum)**: 197 RPS - Fast, mempool not exposed
5. **Blast (Polygon)**: 188 RPS - MEV-safe

### MEV-Safe RPCs (Recommended for Trading)
- **bnb**: PancakeSwap (80 RPS), PancakeSwap Alpha (58 RPS), Binance (146 RPS), Ankr (132 RPS)
- **ethereum**: Tenderly (369 RPS), OnFinality (181 RPS), Blast (153 RPS), Cloudflare (123 RPS), Ankr (113 RPS), PublicNode (140 RPS), OmniTrade (204 RPS), Kukus (214 RPS), LLamaRPC (6 RPS)
- **arbitrum**: Arbitrum (128 RPS), PublicNode (157 RPS), Ankr (147 RPS), DRPC (197 RPS)
- **polygon**: Ankr (144 RPS), DRPC (135 RPS), Blast (188 RPS)
- **optimism**: Optimism (95 RPS), Ankr (184 RPS), DRPC (160 RPS), Blast (192 RPS)

### Chains with Poor Health
- **IoTeX**: 0% health (2/2 dead)
- **Polygon**: 30% health (3/10 working)
- **Arbitrum**: 40% health (4/10 working)
- **Ethereum**: 65% health (13/20 working) - many require auth

### Auth-Required RPCs
Many premium RPCs (Alchemy, Infura, QuickNode, BlockPi) require API keys. These show RPS=0 in public testing but may work with authentication.

## Changes Made

### Files Modified
- networks/evm/bnb/tested.md - Updated with fresh RPS/TPS data
- networks/evm/ethereum/tested.md - Updated with fresh RPS/TPS data
- networks/evm/arbitrum/tested.md - Updated with fresh RPS/TPS data
- networks/evm/polygon/tested.md - Updated with fresh RPS/TPS data
- networks/evm/optimism/tested.md - Updated with fresh RPS/TPS data
- networks/evm/cronos/tested.md - Updated with fresh RPS/TPS data
- networks/evm/etc/tested.md - Updated with fresh RPS/TPS data
- networks/evm/moonbeam/tested.md - Updated with fresh RPS/TPS data
- networks/evm/taiko/tested.md - Updated with fresh RPS/TPS data
- networks/evm/ronin/tested.md - Updated with fresh RPS/TPS data
- networks/evm/harmony/tested.md - Updated with fresh RPS/TPS data
- networks/evm/iotex/tested.md - Updated with fresh RPS/TPS data
- networks/evm/klaytn/tested.md - Updated with fresh RPS/TPS data

### New Files
- data/bnb-new-discovered.md - Empty DEX discovery results
- data/solana-new-discovered.md - Empty DEX discovery results
- data/eth-new-discovered.md - Empty DEX discovery results
- data/bnb-discovered-raw.md - Empty general discovery
- data/solana-discovered-raw.md - Empty general discovery

## Notes

- Solana, Base, and Avalanche tested.md files use different formats and require manual handling
- Report generator failed due to format inconsistencies in Solana/Base/Avalanche files
- Consider standardizing all tested.md files to use the same table format

## Recommendations

1. **Add API keys** for Alchemy, Infura, QuickNode to test their actual performance
2. **Investigate IoTeX** - both RPCs failing, may need new endpoints
3. **Set up subfinder** for DEX discovery to find new RPCs automatically
4. **Standardize markdown formats** across all chains for better tooling support
5. **Consider removing** dead RPCs that have been failing consistently

---
Audit completed: 2026-04-21 13:09:06
