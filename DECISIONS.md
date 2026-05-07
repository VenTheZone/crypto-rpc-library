# RPC Library Audit - 2026-05-08

## Summary
- Chains audited: 17
- Total RPCs tested: 103
- Working: 72 | Dead: 25 | Slow: 2 | Needs-Key: 9
- Health score: 69.9%

## Dead RPCs Identified

| Chain | Name | URL | Last RPS | Error |
|-------|------|-----|----------|-------|
| ethereum | Alchemy | https://eth-mainnet.g.alchemy.com/v2/demo | 0 | needs API key |
| ethereum | Infura | https://mainnet.infura.io/v3/ | 0 | needs API key |
| ethereum | QuickNode | https://*.quiknode.pro/ | 0 | wildcard URL |
| ethereum | NodeReal | https://eth-mainnet.nodereal.io/v1/ | 0 | needs API key |
| ethereum | GetBlock | https://eth.getblock.io/ | 0 | needs API key |
| solana | Helius Drift | https://kora-8cwrc2-fast-mainnet.helius-rpc.com/ | 0 | connection refused |
| solana | Helius Kamino | https://helius-rpc.kamino.com/ | 0 | connection refused |
| solana | PublicNode | https://solana-rpc.publicnode.com | 0 | timeout |
| solana | Helius Jupiter | https://grateful-jerrie-fast-mainnet.helius-rpc.com | 0 | connection refused |
| solana | QuickNode | https://alien-newest-vineyard.solana-mainnet.quiknode.pro/... | 0 | incomplete URL |
| solana | DRPC | https://solana.drpc.org | 0 | timeout |
| solana | Phantom | https://solana-mainnet.phantom.app/... | 0 | incomplete URL |
| base | MeowRPC | https://base.meowrpc.com | 0 | no response |
| base | QuickNode 3 | https://warmhearted-falling-shape.base-mainnet.quiknode.pro/ | 0 | expired endpoint |
| base | QuickNode 2 | https://fittest-wild-frog.base-mainnet.quiknode.pro/ | 0 | expired endpoint |
| base | QuickNode 1 | https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/ | 0 | expired endpoint |
| base | Coinbase CDP | https://api.developer.coinbase.com/rpc/v1/ | 0 | needs API key |
| polygon | Alchemy | https://polygon-mainnet.g.alchemy.com/v2/demo | 0 | needs API key |
| polygon | Infura | https://polygon-mainnet.infura.io/v3/ | 0 | needs API key |
| polygon | QuickNode | https://*.quiknode.pro/ | 0 | wildcard URL |
| optimism | Alchemy | https://opt-mainnet.g.alchemy.com/v2/demo | 0 | needs API key |
| optimism | QuickNode | https://*.quiknode.pro/ | 0 | wildcard URL |
| optimism | Infura | https://optimism-mainnet.infura.io/v3/ | 0 | needs API key |
| moonriver | Ankr | https://rpc.ankr.com/moonriver | 0 | endpoint down |
| lightlink | LightLink | https://rpc.lightlink.io | 0 | no response |
| metagov | Metadium | https://api.metadium.com/ext/bc/C/rpc | 0 | no response |
| oasis | Oasis | https://rpc.ankr.com/oasis | 0 | endpoint down |
| tomochain | TomoChain | https://rpc.tomochain.com | 0 | chain deprecated |
| velas | Velas | https://mainnet.velas.com | 0 | chain inactive |
| velas | Ankr | https://rpc.ankr.com/velas | 0 | endpoint down |
| godwoken | Godwoken | https://v1.mainnet.godwoken.io | 0 | chain deprecated |

## New RPCs Added
None discovered this audit cycle. DEX discovery found 0 new endpoints across BNB, Ethereum, Solana.

## Changes Made
- Updated tested.md for 17 chains with live RPS/TPS/Mempool/SafeTX data
- Created dead-rpcs.md graveyard files for 12 chains
- Generated NETWORKS.md report with per-chain summaries
- Updated Last Updated timestamps in tested.md headers
- BNB: 8/8 working, Ankr top performer (203 RPS)
- Ethereum: 15/20 working, Kukus/Blast top (296/287 RPS), 5 needs-key
- Solana: 13/20 working, RPC Pool Solend top (311 RPS), 7 dead
- Base: 14/19 working, Ankr Pro top (203 RPS), 5 dead

## Bug Found
- `crypto-rpc report` panics on parseTableRow (index out of range [6] with length 6)
- Bug in internal/markdown/parser.go:135
