# Solana RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Discovery Method:** Playwright interception on 16 Solana DEX frontends
> **DEXs Scanned:** Jupiter, Raydium, Orca, Meteora, Drift, Zeta, Kamino, MarginFi, Solend, Phoenix, Tensor, Pump.fun, Moonshot, 1inch, OpenOcean
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster)
> - **TPS** = Network transactions per second (Solana ~3000-5000 TPS)
> - **Slots/s** = Slots per second (Solana targets ~800 slots/s)
> - **Safe TX** = All Solana RPCs are safe (no mempool)
> - **Found On** = DEX/domain where discovered

---

## ⚡ TOP PERFORMERS (300+ RPS)

| Name | URL | RPS | TPS | Slots/s | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| **DRPC** | `https://solana.drpc.org` | **446** | - | - | **yes** | DRPC (public) |
| **Helius Solend** | `https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df` | **357** | 0 | - | **yes** | Solend |
| **Helius Tensor** | `https://lauraine-qytyxk-fast-mainnet.helius-rpc.com` | **349** | 0 | - | **yes** | Tensor |
| **Helius Drift** | `https://kora-8cwrc2-fast-mainnet.helius-rpc.com/` | **321** | 0 | - | **yes** | Drift |

---

## 🚀 GOOD PERFORMANCE (100-300 RPS)

| Name | URL | RPS | TPS | Slots/s | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| **Helius Kamino** | `https://helius-rpc.kamino.com/02996efe-bbc3-405f-8d87-845794261033` | **223** | 3055 | 3 | **yes** | Kamino |
| **Solana Official** | `https://api.mainnet-beta.solana.com` | **165** | 0 | - | **yes** | Official |
| **PublicNode** | `https://solana-rpc.publicnode.com` | **102** | 3239 | - | **yes** | PublicNode |

---

## ✅ WORKING (Under 100 RPS)

| Name | URL | RPS | TPS | Slots/s | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| Triton | `https://triton.mainnet.rpcpool.com` | 76 | - | - | **yes** | RPC Pool |
| BlockPi | `https://solana.blockpi.network/v1/rpc/public` | 67 | - | - | **yes** | BlockPi |
| QuickNode | `https://alien-newest-vineyard.solana-mainnet.quiknode.pro/ebe5e35661d7edb7a5e48ab84bd9d477e472a40b/` | 34 | 3033 | 3 | **yes** | Raydium |

---

## ❌ BLOCKED / NEEDS AUTH

| Name | URL | Error | Found On |
| ---- | --- | ----- | -------- |
| RPC Pool Jupiter | `https://mercuria-fronten-1cd8.mainnet.rpcpool.com/` | IP blocked | Jupiter |
| RPC Pool Jupiter 2 | `https://jupiter-frontend.rpcpool.com/` | IP blocked | Jupiter |
| RPC Pool Drift | `https://drift-drift_ma-39b5.mainnet.rpcpool.com/` | IP blocked | Drift |
| RPC Pool Kamino | `https://kamino.mainnet.rpcpool.com/` | IP blocked | Kamino |
| RPC Pool Solend | `https://solendf-solendf-67c7.rpcpool.com/` | IP blocked | Solend |
| Ironforge 1 | `https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP` | Firewall blocked | Jupiter |
| Ironforge 2 | `https://rpc.ironforge.network/mainnet?apiKey=01JAFT6YB7SJS7N3N85PKEZ5MF` | Firewall blocked | Jupiter |
| Alchemy | `https://solana-mainnet.g.alchemy.com/v2/ZT3c4pYf1inIrB0GVDNR7nx4LwyED5Ci` | App inactive | Jupiter |
| Helius Pump | `https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b` | Unauthorized | Pump.fun |
| Helius Jupiter | `https://grateful-jerrie-fast-mainnet.helius-rpc.com` | Changed | Jupiter |
| Phantom | `https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ` | Changed | Phantom |

---

## 🔌 WEBSOCKET ENDPOINTS

| Name | URL | Found On |
| ---- | --- | -------- |
| Jupiter WS | `wss://jupiter-frontend.rpcpool.com` | Jupiter |
| Drift WS | `wss://drift-drift_ma-39b5.mainnet.rpcpool.com/whirligig` | Drift |
| Kamino WS | `wss://kamino.mainnet.rpcpool.com/whirligig` | Kamino |
| Solana Official WS | `wss://api.mainnet-beta.solana.com` | Official |

---

## 🔍 DISCOVERY SOURCES SUMMARY

| DEX / Domain | RPCs Found | Best RPS | Notes |
| ------------ | ---------- | -------- | ----- |
| **Solend** | 1 | 357 | Helius with key |
| **Tensor** | 1 | 349 | Helius endpoint |
| **Drift** | 1 | 321 | Helius with key |
| **Kamino** | 1 | 223 | Helius + RPC Pool (blocked) |
| **DRPC** | 1 | 446 | Public endpoint |
| **Jupiter** | 0 | - | All endpoints IP-blocked |

---

## 📝 QUICK REFERENCE

### Best for Speed
```
https://solana.drpc.org
```
**446 RPS** - Public DRPC endpoint

### Best with API Key
```
https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df
```
**357 RPS** - Found on Solend

### Best Official
```
https://api.mainnet-beta.solana.com
```
**165 RPS** - Official Solana endpoint

---

## 🧪 TESTING NOTES

- **Mempool:** Solana does NOT have a traditional mempool like EVM chains
- **Safe TX:** ALL Solana RPCs are safe for sending transactions
- **TPS:** Measured via `getRecentPerformanceSamples` method
- **Health:** Use `getHealth` method to check RPC status
- **RPC Pool:** Most endpoints are IP-restricted to specific DEX infrastructure
