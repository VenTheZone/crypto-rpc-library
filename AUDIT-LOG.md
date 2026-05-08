# Crypto-RPC Library Audit Log

## 2026-05-09

### Summary
- Chains audited: 16 (8 priority + 8 secondary rotation)
- Total RPCs tested: 108 (across tested chains)
- Working: 79 | Dead: 8 | Needs-Key: 21 | Slow: 3
- New discoveries: 0

### Priority Chains Tested
| Chain | Total | Working | Dead | Needs-Key | Slow | Top RPS |
|-------|-------|---------|------|-----------|------|---------|
| bnb | 8 | 8 | 0 | 0 | 0 | OnFinality:164 |
| ethereum | 20 | 14 | 0 | 5 | 1 | Tenderly:309 |
| arbitrum | 6 | 6 | 0 | 0 | 0 | Arbitrum Official:164 |
| base | 19 | 14 | 1 | 3 | 1 | Aerodrome dRPC:222 |
| polygon | 6 | 3 | 0 | 3 | 0 | DRPC:198 |
| avalanche | 4 | 4 | 0 | 0 | 0 | DRPC:143 |
| optimism | 8 | 6 | 0 | 2 | 0 | Blast:158 |
| solana | 20 | 13 | 3 | 3 | 1 | RPC Pool Drift:305 |

### Secondary Chains Tested (Day 9 rotation: cronos,etc,moonbeam,taiko,ronin,harmony,iotex,klaytn)
| Chain | Total | Working | Dead | Needs-Key | Slow | Top RPS |
|-------|-------|---------|------|-----------|------|---------|
| cronos | 2 | 1 | 0 | 1 | 0 | Cronos:64 |
| etc | 2 | 1 | 0 | 1 | 0 | Ethereum Classic:38 |
| moonbeam | 3 | 2 | 1 | 0 | 0 | Ankr:173 |
| taiko | 1 | 1 | 0 | 0 | 0 | Taiko:140 |
| ronin | 1 | 1 | 0 | 0 | 0 | Ronin:36 |
| harmony | 2 | 2 | 0 | 0 | 0 | Harmony:151 |
| iotex | 4 | 2 | 1 | 1 | 0 | OnFinality:131 |
| klaytn | 2 | 1 | 1 | 0 | 0 | Ankr:40 |

### Dead RPCs (Live-Verified)
| Chain | Name | URL | Error |
|-------|------|-----|-------|
| base | Coinbase CDP | https://api.developer.coinbase.com/rpc/v1/ | 404 page not found |
| iotex | ~~IoTeX Old~~ | ~~https://rpc.iotex.io~~ | Cloudflare error 1016 |
| klaytn | Klaytn | https://klaytn.blockchainapi.or.kr/mainnet/klaytn | DNS resolution failure |
| moonbeam | BlockPi | https://moonbeam.blockpi.network/v1/rpc/public | Empty response |
| solana | Helius Drift | https://kora-8cwrc2-fast-mainnet.helius-rpc.com/ | DNS resolution failure |
| solana | Helius Jupiter | https://grateful-jerrie-fast-mainnet.helius-rpc.com | Cloudflare block page |
| solana | Phantom | https://solana-mainnet.phantom.app/ | Cloudflare block page, not public |

### Resurrected RPCs (Previously Dead, Now Alive)
| Chain | Name | URL | Evidence |
|-------|------|-----|----------|
| base | MeowRPC | https://base.meowrpc.com | eth_blockNumber responds, RPS=0 but functional |
| solana | PublicNode | https://solana-rpc.publicnode.com | getHealth returns ok |

### Needs-Key Endpoints (Verified)
- base: QuickNode 1/2/3 (UNAUTHORIZED)
- cronos: Ankr (API key required)
- etc: Ankr (API key required)
- solana: Helius Kamino (403), QuickNode (UNAUTHORIZED), DRPC (freetier restricted)

### Issues Found
- `crypto-rpc report` binary still panics on parser.go:135 (dead-rpcs.md varying column counts)
- DEX discovery found 0 new endpoints (scanned 10-20 DEXes per chain)
- General discover command times out at 120s
- Several Solana Helius endpoints decommissioned (DNS dead)

### Changes Made
- Updated 16 tested.md files with live test results
- Sorted all updated tested.md files by RPS descending
- Corrected status columns: dead/needs-key/slow/working
- Created dead-rpcs.md for iotex, klaytn, moonbeam chains
- Updated dead-rpcs.md for base, solana (removed false positives, added verified dead)
- Re-generated NETWORKS.md report (binary panics, done manually)
- 2 RPCs resurrected from dead: MeowRPC (base), PublicNode (solana)

## 2026-05-06

### Summary
- Chains audited: 41
- Total RPCs tested: 164
- Working: 132 (80.5%)
- Dead: 2 (berachain:1, zksync:1)
- Slow: 1 (base:1)
- Needs-Key: 29

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
- 29 RPCs marked needs-key across chains

### Changes Made
- Sorted all 41 tested.md files by RPS (descending)
- Updated "Last Updated" timestamps to 2026-05-06
- Generated NETWORKS.md report manually (binary report crashes)
- Removed stale duplicate directories (networks/arbitrum, networks/avalanche)
- Restored dead-rpcs.md files from .bak after binary operations
