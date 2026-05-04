# Crypto-RPC Library — Network Overview

> **Last Updated:** 2026-05-04
> **Total Chains:** 16+ (tested this run)
> **Total RPCs:** 139+
> **Health Score:** 91%

---

## 🟢 Priority Chains

| Chain | Total RPCs | Working | Dead | Needs Key | Top Performer | Top RPS |
|-------|-----------|---------|------|-----------|---------------|---------|
| BNB | 8 | 6 | 0 | 0 | OnFinality | 208 |
| Ethereum | 20 | 14 | 2 | 4 | OmniTrade | 298 |
| Arbitrum | 6 | 6 | 0 | 0 | DRPC | 186 |
| Base | 19 | 14 | 0 | 4 | Aerodrome dRPC | 214 |
| Polygon | 6 | 4 | 4 | 2 | Ankr | 184 |
| Avalanche | 4 | 4 | 0 | 0 | DRPC | 176 |
| Optimism | 8 | 6 | 1 | 2 | Blast | 200 |
| Solana | 20 | 17 | 0 | 3 | Ironforge 2 | 217 |

## 🟡 Secondary Chains (Rotation 0)

| Chain | Total RPCs | Working | Dead | Needs Key | Top Performer | Top RPS |
|-------|-----------|---------|------|-----------|---------------|---------|
| Fantom | 5 | 5 | 0 | 0 | DRPC | 139 |
| Celo | 3 | 2 | 1 | 1 | Celo | 107 |
| Scroll | 4 | 1 | 0 | 3 | Scroll | 67 |
| Linea | 4 | 2 | 1 | 2 | Blast | 215 |
| Mantle | 4 | 1 | 0 | 3 | BlockPi | 86 |
| Berachain | 4 | 3 | 0 | 1 | Berachain Official | 89 |
| Gnosis | 2 | 2 | 1 | 0 | Ankr | 162 |
| zkSync | 5 | 3 | 0 | 2 | zkSync | 294 |

## 🔴 Dead RPCs Removed This Audit

| Chain | RPC | Error |
|-------|-----|-------|
| Ethereum | Pocket (POKT) | DNS resolution failure |
| Ethereum | BlockPi | 521 Server Down |
| Polygon | Polygon Official | API key disabled (403) |
| Polygon | MaticVigil | Permanently shut down |
| Polygon | PublicNode | 30s timeout (no response) |
| Polygon | BlockPi | 521 Server Down |
| Celo | Blast | DNS resolution failure |
| Linea | BlockPi | 521 Server Down |
| Optimism | BlockPi | 521 Server Down |
| Gnosis | BlockPi | 521 Server Down |

## 🆕 New RPCs Discovered This Audit

| Chain | RPC | RPS | Mempool | Safe TX | Source |
|-------|-----|-----|---------|---------|--------|
| BNB | OnFinality | 208 | no | **yes** | manual-discovery |
| BNB | LlamaRPC | 29 | yes | no | manual-discovery |
| Ethereum | Flashbots | 172 | no | **yes** | manual-discovery |
| Ethereum | BloXroute | 100 | no | **yes** | manual-discovery |
| Base | OnFinality | 135 | no | **yes** | manual-discovery |
| Base | LlamaRPC | 73 | no | **yes** | manual-discovery |

## 🔑 Key Findings

1. **BlockPi public endpoints deprecated** — 521 errors across Ethereum, Polygon, Linea, Optimism, Gnosis. Free tier likely discontinued.
2. **Polygon-rpc.com disabled** — tenant disabled by provider (Chainstack). Move to alternative.
3. **MaticVigil permanently shut down** after 4 years.
4. **POKT Gateway DNS failure** — `eth-rpc.gateway.pokt.network` no longer resolves.
5. **Flashbots Protect RPC** added to Ethereum — MEV-safe, 172 RPS, no mempool exposure.
6. **BloXroute ETH** added — MEV-safe (blocks txpool_content), 100 RPS.
7. **OnFinality BNB** added — 208 RPS, MEV-safe (blocks txpool), best BNB performer.
8. **Solana Phantom RPC** alive but rate-limited during batch tests.

## 📊 MEV Safety Map

| Chain | MEV-Safe RPCs | Mempool-Exposed RPCs |
|-------|---------------|---------------------|
| Ethereum | Flashbots, BloXroute, Tenderly, Ankr, Blast, LlamaRPC, Rei, OnFinality | DRPC, PublicNode, Vanry, 1rpc.io |
| BNB | OnFinality, Ankr, PancakeSwap, PancakeSwap Alpha | Binance, PublicNode, 1rpc.io, LlamaRPC |
| Base | Tenderly, Aerodrome dRPC, DRPC, Ankr, OnFinality, PublicNode, Base Official, LlamaRPC | (none exposed) |
| Arbitrum | All tested (no mempool exposure) | (none) |
| Polygon | Ankr, DRPC, Alchemy, Blast | (none tested with mempool) |
| Optimism | Blast, Alchemy, Ankr, Optimism Official | DRPC, PublicNode |
| Avalanche | Avalanche Official, 1rpc.io | DRPC, PublicNode |
| Solana | All tested | (none exposed) |
