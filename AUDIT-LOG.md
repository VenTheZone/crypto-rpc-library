# Crypto-RPC Library Audit Log

## 2026-05-06

### Summary
- Chains audited: 41
- Total RPCs tested: 164
- Working: 132 (80.5%)
- Dead: 2 (berachain:1, zksync:1)
- Slow: 1 (base:1)
- Needs-key: 29

### Per-Chain Health

| Chain | Total | Working | Dead | Slow | Needs-Key | Top RPS |
|-------|-------|---------|------|------|-----------|---------|
| arbitrum | 6 | 6 | 0 | 0 | 0 | QuickNode:175 |
| astar | 2 | 2 | 0 | 0 | 0 | -:0 |
| aurora | 2 | 2 | 0 | 0 | 0 | Aurora:38 |
| avalanche | 4 | 4 | 0 | 0 | 0 | PublicNode:112 |
| base | 19 | 14 | 0 | 1 | 4 | OnFinality:180 |
| berachain | 6 | 4 | 1 | 0 | 1 | dRPC:149 |
| bittorrent | 2 | 2 | 0 | 0 | 0 | Bittorrent:69 |
| bnb | 8 | 8 | 0 | 0 | 0 | OnFinality:140 |
| callisto | 1 | 1 | 0 | 0 | 0 | -:0 |
| celo | 3 | 2 | 0 | 0 | 1 | Celo:85 |
| cronos | 2 | 2 | 0 | 0 | 0 | Cronos:37 |
| etc | 2 | 2 | 0 | 0 | 0 | Ethereum Classic:39 |
| ethereum | 20 | 15 | 0 | 0 | 5 | Tenderly:266 |
| fantom | 5 | 5 | 0 | 0 | 0 | DRPC:142 |
| fuse | 2 | 2 | 0 | 0 | 0 | Fuse:43 |
| gnosis | 2 | 2 | 0 | 0 | 0 | Ankr:173 |
| godwoken | 1 | 1 | 0 | 0 | 0 | -:0 |
| harmony | 2 | 2 | 0 | 0 | 0 | Ankr:150 |
| huobi | 2 | 2 | 0 | 0 | 0 | -:0 |
| iotex | 2 | 2 | 0 | 0 | 0 | OnFinality:157 |
| karura | 1 | 1 | 0 | 0 | 0 | -:0 |
| kcc | 1 | 1 | 0 | 0 | 0 | -:0 |
| klaytn | 2 | 2 | 0 | 0 | 0 | Ankr:36 |
| lightlink | 1 | 1 | 0 | 0 | 0 | -:0 |
| linea | 4 | 2 | 0 | 0 | 2 | Blast:148 |
| mantle | 4 | 2 | 0 | 0 | 2 | BlockPi:68 |
| metagov | 1 | 1 | 0 | 0 | 0 | -:0 |
| moonbeam | 3 | 3 | 0 | 0 | 0 | Ankr:199 |
| moonriver | 2 | 2 | 0 | 0 | 0 | Moonriver:32 |
| oasis | 1 | 1 | 0 | 0 | 0 | -:0 |
| optimism | 8 | 6 | 0 | 0 | 2 | Alchemy:185 |
| polygon | 6 | 3 | 0 | 0 | 3 | DRPC:190 |
| ronin | 1 | 1 | 0 | 0 | 0 | Ronin:36 |
| rsk | 1 | 1 | 0 | 0 | 0 | RSK:23 |
| scroll | 4 | 2 | 0 | 0 | 2 | Scroll:106 |
| solana | 20 | 14 | 0 | 0 | 6 | Ironforge 1:387 |
| syscoin | 2 | 2 | 0 | 0 | 0 | Ankr:427 |
| taiko | 1 | 1 | 0 | 0 | 0 | Taiko:124 |
| tomochain | 1 | 1 | 0 | 0 | 0 | -:0 |
| velas | 2 | 2 | 0 | 0 | 0 | -:0 |
| zksync | 5 | 3 | 1 | 0 | 1 | zkSync:210 |

### Dead RPCs
- berachain: 1 dead endpoint
- zksync: 1 dead endpoint

### Issues Found
- `crypto-rpc report` binary panics on non-standard table formats (parser.go:135 index out of range)
- Duplicate directories `networks/arbitrum/` and `networks/avalanche/` (outside evm/) contained stale data — removed
- dead-rpcs.md files with varying column counts cause parser crash
- 29 RPCs marked needs-key across chains (ethereum:5, solana:6, base:4, polygon:3, linea:2, mantle:2, optimism:2, scroll:2, berachain:1, celo:1, zksync:1)

### Changes Made
- Sorted all 41 tested.md files by RPS (descending)
- Updated "Last Updated" timestamps to 2026-05-06
- Generated NETWORKS.md report manually (binary report crashes)
- Removed stale duplicate directories (networks/arbitrum, networks/avalanche)
- Restored dead-rpcs.md files from .bak after binary operations
