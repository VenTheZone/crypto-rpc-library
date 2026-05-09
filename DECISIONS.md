# RPC Library Audit - 2026-05-10

## Summary
- Chains audited: 16 (8 priority + 8 rotation day 2)
- Total RPCs tested: 108
- Working: 78 | Dead: 13 (confirmed) | Needs-Key: 17
- Collection-wide: 41 chains, 166 RPCs, 107 working (64%)
- New RPCs discovered: 0

## Dead RPCs Confirmed (Live Test)
| Chain | Name | URL | Last RPS | Error |
|-------|------|-----|----------|-------|
| solana | PublicNode | https://solana-rpc.publicnode.com | 0 | Timeout |
| solana | Helius Kamino | https://helius-rpc.kamino.com/ | 0 | Timeout |
| solana | DRPC | https://solana.drpc.org | 0 | Timeout |
| solana | Helius Drift | https://kora-8cwrc2-fast-mainnet.helius-rpc.com/ | 0 | Timeout |
| solana | Helius Jupiter | https://grateful-jerrie-fast-mainnet.helius-rpc.com | 0 | Timeout |
| base | MeowRPC | https://base.meowrpc.com | 0 | No response |
| cronos | Ankr | https://rpc.ankr.com/cronos | 0 | No response |
| etc | Ankr | https://rpc.ankr.com/ethereumclassic | 0 | No response |
| iotex | IoTeX Official | https://iotexrpc.com | 0 | No response |
| iotex | Ankr | https://rpc.ankr.com/iotex | 0 | No response |
| iotex | IoTeX Old | https://rpc.iotex.io | 0 | No response |
| klaytn | Klaytn | https://klaytn.blockchainapi.or.kr/mainnet/klaytn | 0 | No response |
| moonbeam | BlockPi | https://moonbeam.blockpi.network/v1/rpc/public | 0 | No response |

## Needs-Key RPCs (RPS=0, requires API key)
- ethereum: Alchemy, Infura, QuickNode, NodeReal, GetBlock
- optimism: Alchemy, QuickNode, Infura
- polygon: Alchemy, Infura, QuickNode
- base: QuickNode 1/2/3, Coinbase CDP, MeowRPC
- solana: QuickNode, Phantom

## New RPCs Discovered
None — DEX discovery and general discovery returned 0 new endpoints.

## Changes Made
- Updated 16 tested.md files with live RPS/TPS/Mempool/SafeTX data
- Corrected status columns: working/needs-key/dead
- Sorted all tested.md by RPS (descending)
- Added "Last Updated: 2026-05-10" timestamps
- Regenerated NETWORKS.md (binary report crashes, manual generation)
- Updated dead-rpcs.md for 7 chains (base, cronos, etc, iotex, klaytn, moonbeam, solana)
- Updated central deadrpc.txt with new confirmed dead endpoints
- MemPalace: audit-log, chain-health, discovery-findings, dead-rpcs, collection-stats rooms updated
- Tunnel created: crypto-rpc-library/chain-health → SolanaScavengerArb/rpc-config (Solana degradation alert)
