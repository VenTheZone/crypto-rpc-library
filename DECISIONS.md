# RPC Library Audit - 2026-05-04

## Summary
- Chains audited: 16
- Total RPCs tested: 87
- Working: 62 | Dead: 15 | New: 6 | Needs-key: 10
- Health score: 71%

## Dead RPCs Removed

| Chain | URL | Last RPS | Error |
|-------|-----|----------|-------|
| ETH | https://eth-erpc.pokt.com/ | 0 | DNS failure (NXDOMAIN) |
| ETH | https://public.blockpi.io/v1/rpc/eth | 0 | 521 Server Down |
| Polygon | https://polygon-rpc.com/ | 0 | 403 Forbidden (API key disabled) |
| Polygon | https://rpc-mainnet.maticvigil.com/ | 0 | Permanently shut down |
| Polygon | https://polygon-bor-rpc.publicnode.com/ | 0 | 30s timeout |
| Polygon | https://public.blockpi.io/v1/rpc/matic | 0 | 521 Server Down |
| Celo | https://celo-mainnet.blastapi.io/ | 0 | DNS failure |
| Linea | https://public.blockpi.io/v1/rpc/linea | 0 | 521 Server Down |
| Optimism | https://public.blockpi.io/v1/rpc/optimism | 0 | 521 Server Down |
| Gnosis | https://public.blockpi.io/v1/rpc/gnosis | 0 | 521 Server Down |

## New RPCs Added

| Chain | URL | RPS | Source | Mempool |
|-------|-----|-----|--------|---------|
| BNB | https://bsc-pokt.nodereal.io/v1/onfinality | 208 | DEX discovery | MEV-safe |
| BNB | https://bsc.llamarpc.com | 29 | General discovery | Exposed |
| ETH | https://rpc.flashbots.net/ | 172 | DEX discovery | MEV-safe |
| ETH | https://eth.bloxroutenetwork.com/ | 100 | DEX discovery | MEV-safe |
| Base | https://base-pokt.nodereal.io/v1/onfinality | 135 | DEX discovery | MEV-safe |
| Base | https://base.llamarpc.com | 73 | General discovery | Unknown |

## Key Findings
- BlockPi public free tier deprecated across ALL chains (returning 521 errors)
- Polygon-rpc.com disabled by Chainstack — was the default MetaMask endpoint
- MaticVigil permanently shut down — removed from Polygon collection
- POKT Gateway DNS no longer resolves for Ethereum
- Flashbots Protect RPC: excellent MEV-safe option for Ethereum (172 RPS)
- OnFinality BNB: new top performer (208 RPS, MEV-safe)
- LlamaRPC: new free tier provider discovered for BNB, Base, ETH

## Status Changes (working → needs-key)
- Ethereum: Alchemy, Infura, QuickNode, NodeReal, GetBlock
- Polygon: Infura, QuickNode
- Optimism: QuickNode, Infura
- Base: QuickNode 1/2/3, Coinbase CDP
- Scroll: Ankr, BlockPi
- Linea: Ankr
- Mantle: Ankr, BlockPi
- ZkSync: BlockPi
- Celo: QuickNode
- Solana: QuickNode, DRPC

## Changes Made
- Updated 16 tested.md files (dead RPCs removed, new RPCs added, status changes)
- Created dead-rpcs.md for: eth, polygon, celo, linea, optimism, gnosis
- Updated NETWORKS.md report
- Updated MEMORY.md with audit log
- Sorted all RPCs by RPS (descending) within each tested.md
- Updated "Last Updated" timestamps in all tested.md headers

