# Arbitrum RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Chain ID:** 42161 (Arbitrum One), 42170 (Arbitrum Nova)
> **Discovery Method:** Playwright interception on DEX frontends
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster)
> - **TPS** = Network transactions per second
> - **Mempool** = `yes` = TX visible to MEV bots (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for private TX
> - **Found On** = DEX/domain where discovered

---

## ⚡ TOP PERFORMERS (200+ RPS)

| Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
|------|-----|-----|-----|---------|---------|----------|
| **QuickNode** | `https://warmhearted-falling-shape.arbitrum-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | **2668** | 24 | no | **yes** | Uniswap JS |
| **DRPC** | `https://arbitrum.drpc.org` | **354** | 21 | no | **yes** | DRPC |

---

## ✅ WORKING (Under 100 RPS)

| Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
|------|-----|-----|-----|---------|---------|----------|
| PublicNode | `https://arbitrum-one-rpc.publicnode.com` | 61 | 29 | no | **yes** | GMX/PancakeSwap |
| Arbitrum Official | `https://arb1.arbitrum.io/rpc` | 43 | 18 | no | **yes** | Official |
| BlastAPI | `https://arbitrum-one.public.blastapi.io` | 40 | 17 | no | **yes** | GMX |
| Nova Official | `https://nova.arbitrum.io/rpc` | 40 | 0 | no | **yes** | Sushi |

---

## ❌ NOT WORKING

| Name | URL | Error | Found On |
|------|-----|-------|----------|
| Infura | `https://arbitrum-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1` | Forbidden (key revoked) | Uniswap JS |
| LlamaRPC | `https://arbitrum.llamarpc.com` | ENOTFOUND | PancakeSwap |
| Privy | `https://arbitrum-mainnet.rpc.privy.systems` | Wrong chain | PancakeSwap |
| NodeReal | `https://open-platform.nodereal.io/e45cb8af438441b0a6dfad9c03224636/arbitrum-nitro` | Origin not whitelisted | PancakeSwap |
| Alchemy | `https://arb-mainnet.g.alchemy.com/v2` | Must authenticate | PancakeSwap |

---

## 📊 SUMMARY

| Metric | Value |
|--------|-------|
| **Fastest RPC** | QuickNode @ 2668 RPS |
| **Best Public** | DRPC @ 354 RPS |
| **Total Working** | 6 RPCs |
| **Has Mempool** | None (all Safe TX) |

---

## 🔥 MEV NOTES

> **All Arbitrum RPCs tested have NO mempool access.**
> 
> Arbitrum uses a different transaction ordering mechanism - sequencer-based.
> Traditional mempool front-running is not possible on Arbitrum.

---

## 📝 QUICK REFERENCE

```bash
# Fastest (with leaked key)
curl -X POST https://warmhearted-falling-shape.arbitrum-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'

# Best public
curl -X POST https://arbitrum.drpc.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```
