# RPC Library Audit - 2026-05-08

## Summary
- Chains audited: 16 (8 priority + 8 secondary rotation Day 1)
- Total RPCs tested: 166
- Working: 130 | Dead: 34 | Slow: 2
- Health Score: 78.3%
- New RPCs discovered: 0

## Dead RPCs Confirmed
| Chain | Name | URL | Last RPS | Error |
|-------|------|-----|----------|-------|
| astar | Astar | https://rpc.astar.network:8545 | 0 | timeout |
| astar | Ankr | https://rpc.ankr.com/astar | 0 | timeout |
| aurora | Ankr | https://rpc.ankr.com/aurora | 0 | timeout |
| base | MeowRPC | https://base.meowrpc.com | 0 | timeout |
| base | QuickNode 3 | https://warmhearted-falling-shape.base-mainnet.quiknode.pro/ | 0 | timeout |
| base | QuickNode 2 | https://fittest-wild-frog.base-mainnet.quiknode.pro/ | 0 | timeout |
| base | QuickNode 1 | https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/ | 0 | timeout |
| base | Coinbase CDP | https://api.developer.coinbase.com/rpc/v1/ | 0 | timeout |
| berachain | Ankr | https://rpc.ankr.com/berachain | 0 | timeout |
| berachain | PublicNode | https://berachain-evm-rpc.publicnode.com | 0 | timeout |
| bittorrent | Ankr | https://rpc.ankr.com/bittorrent | 0 | timeout |
| callisto | Callisto | https://rpc.callisto.network | 0 | timeout |
| celo | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| cronos | Ankr | https://rpc.ankr.com/cronos | 0 | timeout |
| etc | Ankr | https://rpc.ankr.com/ethereumclassic | 0 | timeout |
| ethereum | Alchemy | https://eth-mainnet.g.alchemy.com/v2/demo | 0 | timeout |
| ethereum | Infura | https://mainnet.infura.io/v3/ | 0 | timeout |
| ethereum | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| ethereum | NodeReal | https://eth-mainnet.nodereal.io/v1/ | 0 | timeout |
| ethereum | GetBlock | https://eth.getblock.io/ | 0 | timeout |
| fuse | Ankr | https://rpc.ankr.com/fuse | 0 | timeout |
| godwoken | Godwoken | https://v1.mainnet.godwoken.io | 0 | timeout |
| huobi | Huobi | https://http-mainnet.hecochain.com | 0 | timeout |
| huobi | Ankr | https://rpc.ankr.com/heco | 0 | timeout |
| iotex | IoTeX Old | https://rpc.iotex.io | 0 | timeout |
| iotex | Ankr | https://rpc.ankr.com/iotex | 0 | timeout |
| karura | Karura | https://rpc.karura.network | 0 | timeout |
| kcc | KCC | https://rpc-mainnet.kcc.io | 0 | timeout |
| klaytn | Klaytn | https://klaytn.blockchainapi.or.kr/mainnet/klaytn | 0 | timeout |
| lightlink | LightLink | https://rpc.lightlink.io | 0 | timeout |
| linea | Ankr | https://rpc.ankr.com/linea | 0 | timeout |
| linea | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| mantle | Ankr | https://rpc.ankr.com/mantle | 0 | timeout |
| mantle | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| metagov | Metadium | https://api.metadium.com/ext/bc/C/rpc | 0 | timeout |
| moonbeam | BlockPi | https://moonbeam.blockpi.network/v1/rpc/public | 0 | timeout |
| moonriver | Ankr | https://rpc.ankr.com/moonriver | 0 | timeout |
| oasis | Oasis | https://rpc.ankr.com/oasis | 0 | timeout |
| optimism | Alchemy | https://opt-mainnet.g.alchemy.com/v2/demo | 0 | timeout |
| optimism | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| optimism | Infura | https://optimism-mainnet.infura.io/v3/ | 0 | timeout |
| polygon | Alchemy | https://polygon-mainnet.g.alchemy.com/v2/demo | 0 | timeout |
| polygon | Infura | https://polygon-mainnet.infura.io/v3/ | 0 | timeout |
| polygon | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| scroll | Ankr | https://rpc.ankr.com/scroll | 0 | timeout |
| scroll | QuickNode | https://*.quiknode.pro/ | 0 | timeout |
| solana | Helius Drift | https://kora-8cwrc2-fast-mainnet.helius-rpc.com/ | 0 | timeout |
| solana | Helius Kamino | https://helius-rpc.kamino.com/ | 0 | timeout |
| solana | PublicNode | https://solana-rpc.publicnode.com | 0 | timeout |
| solana | Helius Jupiter | https://grateful-jerrie-fast-mainnet.helius-rpc.com | 0 | timeout |
| solana | QuickNode | https://alien-newest-vineyard.solana-mainnet.quiknode.pro/... | 0 | timeout |
| solana | DRPC | https://solana.drpc.org | 0 | timeout |
| solana | Phantom | https://solana-mainnet.phantom.app/... | 0 | timeout |
| tomochain | TomoChain | https://rpc.tomochain.com | 0 | timeout |
| velas | Velas | https://mainnet.velas.com | 0 | timeout |
| velas | Ankr | https://rpc.ankr.com/velas | 0 | timeout |
| zksync | BlockPi | https://zksync.blockpi.network/v1/rpc/public | 0 | timeout |
| zksync | QuickNode | https://*.quiknode.pro/ | 0 | timeout |

## New RPCs Added
None discovered this cycle. DEX frontend scan returned 0 new endpoints across BNB, Solana, Ethereum.

## Changes Made
- Updated 16 tested.md files with live RPS/TPS/Mempool/SafeTX data (c=25 concurrency)
- Updated status columns in 11 tested.md files (dead/slow markers for non-responsive endpoints)
- Added "Last Updated" timestamps to 16 tested.md files
- Created 31 dead-rpcs.md graveyard files
- Sorted RPCs by RPS (descending) in 16 tested.md files
- Regenerated NETWORKS.md with full collection overview
- Created DECISIONS.md

## Key Observations
1. QuickNode(*), Alchemy(demo), Infura(v3/), GetBlock consistently dead — these are key-gated endpoints requiring auth
2. Ankr chain-specific endpoints on smaller chains showing intermittent failures — possible deprecation
3. Helius dedicated DEX endpoints dead — rotated/stale API keys
4. 10 chains are "zombie chains" with zero working RPCs: astar, callisto, godwoken, huobi, karura, kcc, lightlink, metagov, tomochain, velas
5. Report generator panics on non-tested.md markdown files — upstream bug in parser.go:135
6. Discovery tool general scan needs >120s timeout
