# Base RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Discovery Method:** Playwright interception on DEX frontends
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster for your app)
> - **TPS** = Network transactions per second (Base network throughput ~75-127 TPS)
> - **Mempool** = `yes` = your TX visible to MEV bots (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for sending private TX
> - **Found On** = DEX/domain where we discovered this RPC (JS bundle or network interception)

---

## ⚡ FASTEST RPCs (With Leaked API Keys from DEX Frontends)

| Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
| ---- | --- | ---- | ---- | ------- | ------- | -------- |
| **QuickNode 3** | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | **2498** | 75 | no | **yes** | pancakeswap.finance (JS bundle) |
| **QuickNode 2** | `https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2` | **2495** | 85 | no | **yes** | pancakeswap.finance (JS bundle) |
| **QuickNode 1** | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | **2062** | 82 | no | **yes** | pancakeswap.finance (JS bundle) |
| **DRPC Aerodrome** | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | **1441** | 75 | yes | no | aerodrome.finance (network interception) |
| **Ankr Pro** | `https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2` | **726** | 76 | no | **yes** | pancakeswap.finance (JS bundle) |
| **DRPC Base** | `https://base.drpc.org` | **330** | 100 | yes | no | baseswap.fi (network interception) |

---

## 🔒 Safe TX RPCs (No Mempool - Best for Private TX)

> These RPCs do NOT expose mempool - your transactions won't be visible to MEV bots

| Name | URL | RPS | TPS | Found On |
| ---- | --- | ---- | ---- | -------- |
| QuickNode 3 | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | 2498 | 75 | pancakeswap.finance |
| QuickNode 2 | `https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2` | 2495 | 85 | pancakeswap.finance |
| QuickNode 1 | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | 2062 | 82 | pancakeswap.finance |
| Ankr Pro | `https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2` | 726 | 76 | pancakeswap.finance |
| 1rpc.io | `https://1rpc.io/base` | 214 | 77 | 1rpc.io (public) |
| MeowRPC | `https://base.meowrpc.com` | 180 | 0 | pancakeswap.finance (network interception) |
| Nodies | `https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb` | 61 | 127 | pancakeswap.finance |
| PublicNode | `https://base.publicnode.com` | 56 | 119 | pancakeswap.finance (network interception) |
| Base Official | `https://mainnet.base.org` | 43 | 113 | base.org (official) |
| Dev Access | `https://developer-access-mainnet.base.org` | 30 | 119 | mainnet.base.org (subdomain) |
| Coinbase CDP | `https://api.developer.coinbase.com/rpc/v1/base/pE-_rU5q_IliJGUVkVI-82ZoyiCeCSFx` | 18 | 118 | api.developer.coinbase.com |
| LlamaRPC | `https://base.llamarpc.com` | 10 | 0 | pancakeswap.finance |

---

## 📊 For MEV / Mempool Access

> These RPCs expose mempool - you can see pending transactions

| Name | URL | RPS | TPS | Found On |
| ---- | --- | ---- | ---- | -------- |
| DRPC Aerodrome | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | 1441 | 75 | aerodrome.finance |
| DRPC Base | `https://base.drpc.org` | 330 | 100 | baseswap.fi |
| PublicNode | `https://base.publicnode.com` | 56 | 119 | pancakeswap.finance |

---

## 🔍 Discovery Sources Summary

| DEX / Domain | RPCs Found | Notable Endpoints |
| ------------ | ---------- | ----------------- |
| **pancakeswap.finance** | 8 | QuickNode (3), Ankr Pro, MeowRPC, PublicNode, Nodies, LlamaRPC |
| **aerodrome.finance** | 1 | DRPC with mempool access |
| **baseswap.fi** | 1 | DRPC Base |
| **mainnet.base.org** | 2 | Base Official, Dev Access subdomain |
| **api.developer.coinbase.com** | 1 | Coinbase CDP |
| **1rpc.io** | 1 | Public endpoint |

---

## 🧪 Mempool Testing Method

```
# Method 1: txpool_content (full transactions)
curl -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'

# Method 2: txpool_inspect (summary)
curl -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_inspect","params":[]}'

# Method 3: txpool_status (counts only)
curl -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_status","params":[]}'
```

**Result interpretation:**
- Returns `{"result":{"pending":{},"queued":{}}}` = **Has mempool**
- Returns `{"error":{"code":-32601}}` = **No mempool** (method not found)

---

## 📝 Quick Reference

### Best for Speed (Safe TX)
```
https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559
```
**2498 RPS** - Found on pancakeswap.finance JS bundle

### Best for MEV (Has Mempool)
```
https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO
```
**1441 RPS** - Found on aerodrome.finance via network interception

### Best Public (No Auth)
```
https://1rpc.io/base
```
**214 RPS** - Public endpoint, no API key needed
