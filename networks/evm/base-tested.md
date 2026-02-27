# Base RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Discovery Method:** Playwright interception on PancakeSwap, Aerodrome, BaseSwap, Sushi, KyberSwap
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster for your app)
> - **TPS** = Network transactions per second (Base network throughput ~75-127 TPS)
> - **Mempool** = `yes` = your TX visible to MEV bots (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for sending private TX

---

## ⚡ FASTEST RPCs (With Leaked API Keys from DEX Frontends)

| Name | URL | RPS | TPS | Mempool | Safe TX |
| ---- | --- | ---- | ---- | ------- | ------- |
| **QuickNode 3** | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | **2498** | 75 | no | **yes** |
| **QuickNode 2** | `https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2` | **2495** | 85 | no | **yes** |
| **QuickNode 1** | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | **2062** | 82 | no | **yes** |
| **DRPC Aerodrome** | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | **1441** | 75 | yes | no |
| **Ankr Pro** | `https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2` | **726** | 76 | no | **yes** |
| **DRPC Base** | `https://base.drpc.org` | **330** | 100 | yes | no |

---

## 🔒 Safe TX RPCs (No Mempool - Best for Private TX)

> These RPCs do NOT expose mempool - your transactions won't be visible to MEV bots

| Name | URL | RPS | TPS | Source |
| ---- | --- | ---- | ---- | ------ |
| QuickNode 3 | `https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559` | 2498 | 75 | PancakeSwap |
| QuickNode 2 | `https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2` | 2495 | 85 | PancakeSwap |
| QuickNode 1 | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | 2062 | 82 | PancakeSwap |
| Ankr Pro | `https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2` | 726 | 76 | PancakeSwap |
| 1rpc.io | `https://1rpc.io/base` | 214 | 77 | 1rpc.io |
| MeowRPC | `https://base.meowrpc.com` | 180 | 0 | MeowRPC |
| Nodies | `https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb` | 61 | 127 | PancakeSwap |
| PublicNode | `https://base.publicnode.com` | 56 | 119 | PublicNode |
| Base Official | `https://mainnet.base.org` | 43 | 113 | Official |
| Dev Access | `https://developer-access-mainnet.base.org` | 30 | 119 | PancakeSwap |
| Coinbase CDP | `https://api.developer.coinbase.com/rpc/v1/base/pE-_rU5q_IliJGUVkVI-82ZoyiCeCSFx` | 18 | 118 | PancakeSwap |
| LlamaRPC | `https://base.llamarpc.com` | 10 | 0 | LlamaRPC |

---

## 📊 For MEV / Mempool Access

> These RPCs expose mempool - you can see pending transactions

| Name | URL | RPS | TPS | Notes |
| ---- | --- | ---- | ---- | ----- |
| DRPC Aerodrome | `https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO` | 1441 | 75 | Has mempool |
| DRPC Base | `https://base.drpc.org` | 330 | 100 | Has mempool |
| PublicNode | `https://base.publicnode.com` | 56 | 119 | Has mempool |

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
**2498 RPS** - Leaked from PancakeSwap frontend

### Best for MEV (Has Mempool)
```
https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO
```
**1441 RPS** - From Aerodrome, exposes mempool

### Best Public (No Auth)
```
https://1rpc.io/base
```
**214 RPS** - No API key needed
