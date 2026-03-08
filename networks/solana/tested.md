# Solana RPCs - Complete Tested List

> **Last Updated:** 2026-03-08
> **Discovery Method:** Playwright interception on 16 Solana DEX frontends
> **DEXs Scanned:** Jupiter, Raydium, Orca, Meteora, Drift, Zeta, Kamino, MarginFi, Solend, Phoenix, Tensor, Pump.fun, Moonshot, 1inch, OpenOcean
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster)
> - **TPS** = Network transactions per second (Solana ~3000 TPS)
> - **Slots/s** = Slots per second (Solana targets ~800 slots/s)
> - **Safe TX** = All Solana RPCs are safe (no mempool)
> - **Found On** = DEX/domain where discovered

---

## ⚡ TOP PERFORMERS (300+ RPS)

| Name | URL | RPS | TPS | Safe TX | Notes |
| ---- | --- | ---- | ---- | ------- | ----- |
| **RPC Pool Solend** | `https://solendf-solendf-67c7.rpcpool.com/` | **835** | - | **yes** | IP-restricted to Solend infra |
| **Solana Official** | `https://api.mainnet-beta.solana.com` | **672** | - | **yes** | Very fast! |
| **DRPC** | `https://solana.drpc.org` | **552** | - | **yes** | Public endpoint |
| **QuickNode** | `https://alien-newest-vineyard.solana-mainnet.quiknode.pro/ebe5e35661d7edb7a5e48ab84bd9d477e472a40b/` | **633** | 3027 | **yes** | API key endpoint |
| **Ironforge 1** | `https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP` | **330** | - | **yes** | API key endpoint |
| **PublicNode** | `https://solana-rpc.publicnode.com` | **208** | 3038 | **yes** | Good TPS |
| **Ironforge 2** | `https://rpc.ironforge.network/mainnet?apiKey=01JAFT6YB7SJS7N3N85PKEZ5MF` | **178** | - | **yes** | API key endpoint |

---

## 🚀 GOOD PERFORMANCE (50-300 RPS)

| Name | URL | RPS | TPS | Safe TX | Notes |
| ---- | --- | ---- | ---- | ------- | ----- |
| Helius Solend | `https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df` | **87** | 3025 | **yes** | Found on Solend |
| Helius Tensor | `https://lauraine-qytyxk-fast-mainnet.helius-rpc.com` | **85** | 3028 | **yes** | Found on Tensor |
| Helius Drift | `https://kora-8cwrc2-fast-mainnet.helius-rpc.com/` | **82** | 3029 | **yes** | Found on Drift |
| Helius Kamino | `https://helius-rpc.kamino.com/02996efe-bbc3-405f-8d87-845794261033` | **79** | 3030 | **yes** | Found on Kamino |
| Helius Jupiter | `https://grateful-jerrie-fast-mainnet.helius-rpc.com` | **47** | 3036 | **yes** | Found on Jupiter (needs `Origin: https://jup.ag`) |
| Triton | `https://triton.mainnet.rpcpool.com` | **70** | - | **yes** | |
| RPC Pool Jupiter | `https://mercuria-fronten-1cd8.mainnet.rpcpool.com/` | **70** | - | **yes** | IP-restricted |
| RPC Pool Jupiter 2 | `https://jupiter-frontend.rpcpool.com/` | **70** | - | **yes** | IP-restricted |
| RPC Pool Drift | `https://drift-drift_ma-39b5.mainnet.rpcpool.com/` | **70** | - | **yes** | IP-restricted |
| RPC Pool Kamino | `https://kamino.mainnet.rpcpool.com/` | **69** | - | **yes** | IP-restricted |
| BlockPi | `https://solana.blockpi.network/v1/rpc/public` | **63** | - | **yes** | |
| Phantom | `https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ` | **56** | - | **yes** | Found on Phantom |
| Helius Pump | `https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b` | **38** | - | **yes** | Found on Pump.fun |

---

## ❌ FAILED / UNAVAILABLE

| Name | URL | Error | Found On |
| ---- | --- | ----- | -------- |
| Alchemy | `https://solana-mainnet.g.alchemy.com/v2/ZT3c4pYf1inIrB0GVDNR7nx4LwyED5Ci` | App inactive | Jupiter |

---

## 🔌 WEBSOCKET ENDPOINTS

| Name | URL | Found On |
| ---- | --- | -------- |
| Jupiter WS | `wss://jupiter-frontend.rpcpool.com` | Jupiter |
| Drift WS | `wss://drift-drift_ma-39b5.mainnet.rpcpool.com/whirligig` | Drift |
| Kamino WS | `wss://kamino.mainnet.rpcpool.com/whirligig` | Kamino |
| Solana Official WS | `wss://api.mainnet-beta.solana.com` | Official |

---

## 📝 QUICK REFERENCE

### Best for Speed (No API Key)
```
https://api.mainnet-beta.solana.com
```
**672 RPS** - Solana Official endpoint

### Best Public
```
https://solana.drpc.org
```
**552 RPS** - DRPC public endpoint

### Best with API Key
```
https://alien-newest-vineyard.solana-mainnet.quiknode.pro/ebe5e35661d7edb7a5e48ab84bd9d477e472a40b/
```
**633 RPS** - QuickNode endpoint

---

## 🧪 TESTING NOTES

- **Mempool:** Solana does NOT have a traditional mempool like EVM chains
- **Safe TX:** ALL Solana RPCs are safe for sending transactions
- **TPS:** Measured via `getRecentPerformanceSamples` method (~3000 TPS typical)
- **Health:** Use `getHealth` method to check RPC status
- **Origin Headers:** Some RPCs require specific Origin headers (e.g., Helius Jupiter needs `https://jup.ag`)
- **RPC Pool:** Most endpoints are IP-restricted to specific DEX infrastructure
