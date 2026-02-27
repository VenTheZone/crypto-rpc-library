# Base RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Discovery Method:** Playwright interception on 20+ DEX frontends
> **DEXs Scanned:** Aerodrome, Uniswap, PancakeSwap, BaseSwap, Sushi, DodoEx, KyberSwap, Maverick, Curve, Matcha, 1inch, Paraswap, Odos, OpenOcean, Jumper, LI.FI, SynFutures, Equalizer, RocketSwap
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster)
> - **TPS** = Network transactions per second (Base throughput ~67-127 TPS)
> - **Mempool** = `yes` = TX visible to MEV bots (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for private TX
> - **Found On** = DEX/domain where discovered

---

## ⚡ TOP PERFORMERS (2000+ RPS)

| Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| **QuickNode 3** | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | **2498** | 75 | no | **yes** | pancakeswap.finance |
| **QuickNode 2** | `https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2` | **2495** | 85 | no | **yes** | pancakeswap.finance |
| **QuickNode 1** | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | **2062** | 82 | no | **yes** | pancakeswap.finance |

---

## 🚀 HIGH PERFORMANCE (500+ RPS)

| Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| **DRPC Aerodrome** | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | **1441** | 75 | yes | no | aerodrome.finance |
| **Ankr Pro** | `https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2` | **726** | 76 | no | **yes** | pancakeswap.finance |
| **DRPC Base** | `https://base.drpc.org` | **330** | 100 | yes | no | baseswap.fi |

---

## ✅ GOOD PERFORMANCE (50-300 RPS)

| Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| 1rpc.io | `https://1rpc.io/base` | 214 | 77 | no | **yes** | 1rpc.io (public) |
| MeowRPC | `https://base.meowrpc.com` | 180 | 0 | no | **yes** | pancakeswap.finance |
| Tenderly | `https://base.gateway.tenderly.co` | **68** | 117 | no | **yes** | pancakeswap.finance |
| Nodies POKT | `https://base-pokt.nodies.app` | **60** | 105 | no | **yes** | pancakeswap.finance |
| Nodies | `https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb` | 52 | 109 | no | **yes** | pancakeswap.finance |
| PublicNode | `https://base.publicnode.com` | 56 | 119 | no | **yes** | pancakeswap.finance |
| Base Official | `https://mainnet.base.org` | 43 | 113 | no | **yes** | base.org (official) |
| Dev Access | `https://developer-access-mainnet.base.org` | 30 | 119 | no | **yes** | mainnet.base.org |
| Coinbase CDP | `https://api.developer.coinbase.com/rpc/v1/base/pE-_rU5q_IliJGUVkVI-82ZoyiCeCSFx` | 18 | 118 | no | **yes** | api.developer.coinbase.com |
| LlamaRPC | `https://base.llamarpc.com` | 10 | 0 | no | **yes** | pancakeswap.finance |

---

## 📊 FOR MEV / MEMPOOL ACCESS

| Name | URL | RPS | TPS | Found On |
| ---- | --- | ---- | ---- | -------- |
| DRPC Aerodrome | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | 1441 | 75 | aerodrome.finance |
| DRPC Base | `https://base.drpc.org` | 330 | 100 | baseswap.fi |

---

## ❌ NOT WORKING / NEEDS AUTH

| Name | URL | Error | Found On |
| ---- | --- | ----- | -------- |
| BlockPi | `https://base.blockpi.network/v1/rpc/public` | Auth required | PancakeSwap |
| Equalizer | `https://base.equalizer.exchange` | Not JSON-RPC | Equalizer |
| Privy | `https://base-mainnet.rpc.privy.systems` | Wrong chain | PancakeSwap |
| Gelato | `https://rpc.basecamp.t.raas.gelato.cloud` | Wrong chain | PancakeSwap |
| KyberSwap | `https://base-rpc.kyberswap.com` | Returns HTML | KyberSwap |

---

## 🔍 DISCOVERY SOURCES SUMMARY

| DEX / Domain | RPCs Found | Best RPS | Notable |
| ------------ | ---------- | -------- | ------- |
| **pancakeswap.finance** | 10+ | 2498 | QuickNode keys, Ankr, Tenderly, Nodies |
| **aerodrome.finance** | 1 | 1441 | DRPC with mempool |
| **baseswap.fi** | 1 | 330 | DRPC Base |
| **mainnet.base.org** | 2 | 43 | Official + Dev subdomain |
| **1rpc.io** | 1 | 214 | Public endpoint |

---

## 🧪 MEMPOOL TESTING METHOD

```bash
# Test if RPC exposes mempool:
curl -X POST $RPC_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'

# Error -32601 = NO mempool access (Safe TX)
# Returns pending/queued = HAS mempool (For MEV)
```

---

## 📝 QUICK REFERENCE

### Best for Speed (Safe TX)
```
https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559
```
**2498 RPS** - Found on pancakeswap.finance

### Best for MEV (Has Mempool)
```
https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO
```
**1441 RPS** - Found on aerodrome.finance

### Best Public (No Auth)
```
https://1rpc.io/base
```
**214 RPS** - Public endpoint

### New Discovery - Tenderly
```
https://base.gateway.tenderly.co
```
**68 RPS** - Found on pancakeswap.finance
