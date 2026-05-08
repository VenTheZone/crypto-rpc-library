# RPC Library Audit - 2026-05-09

## Summary
- Chains audited: 16 (8 priority + 8 secondary rotation Day 9)
- Total RPCs tested: 108
- Working: 79 | Dead: 8 | Needs-Key: 21 | Slow: 3
- Health Score: 73.1%
- New RPCs discovered: 0

## Dead RPCs Confirmed (Live-Verified with curl)
| Chain | Name | URL | Last RPS | Error |
|-------|------|-----|----------|-------|
| base | Coinbase CDP | https://api.developer.coinbase.com/rpc/v1/ | 0 | 404 page not found |
| iotex | ~~IoTeX Old~~ | ~~https://rpc.iotex.io~~ | 0 | Cloudflare error 1016, DNS issues |
| klaytn | Klaytn | https://klaytn.blockchainapi.or.kr/mainnet/klaytn | 0 | DNS resolution failure |
| moonbeam | BlockPi | https://moonbeam.blockpi.network/v1/rpc/public | 0 | Empty response, no data returned |
| solana | Helius Drift | https://kora-8cwrc2-fast-mainnet.helius-rpc.com/ | 0 | DNS resolution failure |
| solana | Helius Jupiter | https://grateful-jerrie-fast-mainnet.helius-rpc.com | 0 | Cloudflare block page |
| solana | Phantom | https://solana-mainnet.phantom.app/... | 0 | Cloudflare block page, not public |

## Resurrected RPCs (Previously Marked Dead, Now Alive)
| Chain | Name | URL | Evidence |
|-------|------|-----|----------|
| base | MeowRPC | https://base.meowrpc.com | eth_blockNumber responds, functional (slow) |
| solana | PublicNode | https://solana-rpc.publicnode.com | getHealth returns ok |

## Needs-Key Endpoints (Verified with curl)
| Chain | Name | URL | Error |
|-------|------|-----|-------|
| base | QuickNode 1 | https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/ | UNAUTHORIZED |
| base | QuickNode 2 | https://fittest-wild-frog.base-mainnet.quiknode.pro/ | UNAUTHORIZED |
| base | QuickNode 3 | https://warmhearted-falling-shape.base-mainnet.quiknode.pro/ | UNAUTHORIZED |
| cronos | Ankr | https://rpc.ankr.com/cronos | API key required |
| etc | Ankr | https://rpc.ankr.com/ethereumclassic | API key required |
| ethereum | Alchemy | https://eth-mainnet.g.alchemy.com/v2/demo | Demo key limited |
| ethereum | Infura | https://mainnet.infura.io/v3/ | API key required |
| ethereum | QuickNode | https://*.quiknode.pro/ | API key required |
| ethereum | NodeReal | https://eth-mainnet.nodereal.io/v1/ | API key required |
| ethereum | GetBlock | https://eth.getblock.io/ | API key required |
| iotex | ~~Ankr~~ | ~~https://rpc.ankr.com/iotex~~ | API key required, no longer public |
| optimism | QuickNode | https://*.quiknode.pro/ | API key required |
| optimism | Infura | https://optimism-mainnet.infura.io/v3/ | API key required |
| polygon | Alchemy | https://polygon-mainnet.g.alchemy.com/v2/demo | Demo key limited |
| polygon | Infura | https://polygon-mainnet.infura.io/v3/ | API key required |
| polygon | QuickNode | https://*.quiknode.pro/ | API key required |
| solana | Helius Kamino | https://helius-rpc.kamino.com/ | 403 Forbidden |
| solana | QuickNode | https://alien-newest-vineyard.solana-mainnet.quiknode.pro/... | UNAUTHORIZED |
| solana | DRPC | https://solana.drpc.org | Freetier restricted |

## New RPCs Added
None discovered this cycle. DEX frontend scan returned 0 new endpoints across BNB, Solana, Ethereum.

## Changes Made
- Updated 16 tested.md files with live test results (c=25 concurrency)
- Sorted all updated tested.md files by RPS (descending)
- Corrected status columns across all tested chains: working/dead/needs-key/slow
- Created dead-rpcs.md for iotex, klaytn, moonbeam (new graveyard files)
- Updated dead-rpcs.md for base, solana (removed false positives, added verified dead)
- Resurrected 2 RPCs from dead: MeowRPC (base), PublicNode (solana)
- Re-generated NETWORKS.md report (binary report panics, done manually)
- Updated AUDIT-LOG.md with today's results

## Key Observations
1. Solana Helius DEX endpoints (Drift, Jupiter) confirmed dead via DNS — rotated/stale keys
2. Coinbase CDP base endpoint dead (404) — possibly deprecated
3. MeowRPC base was false-positive dead from prior audit — actually alive but slow
4. PublicNode solana was false-positive dead — actually alive but slow
5. Ankr endpoints on smaller chains (iotex, cronos, etc) now require API keys — trend toward gated access
6. `crypto-rpc report` binary still panics on parser.go:135 — upstream bug
7. `crypto-rpc discover` general scan times out at 120s — needs longer timeout
8. Health score dropped from 78.3% to 65% due to reclassification (needs-key separated from dead)
