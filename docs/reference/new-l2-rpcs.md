# New L2 Chains RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Chains:** Berachain, Blast, Scroll, zkSync Era, Linea, Mantle, Mode
> **Discovery Method:** Playwright interception on DEX frontends
> 
> **Metrics:**
> - **RPS** = Requests per second YOU can send (higher = faster)
> - **TPS** = Network transactions per second
> - **Mempool** = `yes` = TX visible to MEV bots (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for private TX
> - **Found On** = DEX/domain where discovered

---

## ⚡ TOP PERFORMERS (500+ RPS)

| Chain | Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
|-------|------|-----|-----|-----|---------|---------|----------|
| **Blast** | Official | `https://rpc.blast.io` | **2159** | 35 | no | **yes** | blast.io |
| **Scroll** | Official | `https://rpc.scroll.io` | **509** | 42 | no | **yes** | scroll.io |

---

## 🚀 GOOD PERFORMANCE (200-500 RPS)

| Chain | Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
|-------|------|-----|-----|-----|---------|---------|----------|
| zkSync | DRPC | `https://zksync.drpc.org` | **338** | 28 | no | **yes** | DRPC |
| Mantle | DRPC | `https://mantle.drpc.org` | **332** | 31 | no | **yes** | DRPC |
| Blast | DRPC | `https://blast.drpc.org` | **292** | 35 | no | **yes** | DRPC |
| Scroll | DRPC | `https://scroll.drpc.org` | **285** | 42 | no | **yes** | DRPC |
| Linea | DRPC | `https://linea.drpc.org` | **280** | 25 | no | **yes** | DRPC |
| Mode | DRPC | `https://mode.drpc.org` | **269** | 22 | no | **yes** | DRPC |

---

## ✅ WORKING (Under 200 RPS)

| Chain | Name | URL | RPS | TPS | Mempool | Safe TX | Found On |
|-------|------|-----|-----|-----|---------|---------|----------|
| Mantle | Official | `https://rpc.mantle.xyz` | 162 | 31 | no | **yes** | mantle.xyz |
| Mode | Official | `https://mainnet.mode.network` | 48 | 22 | no | **yes** | mode.network |
| Berachain | Official | `https://rpc.berachain.com` | 39 | 12 | **yes** | no | berachain.com |
| zkSync | Official | `https://mainnet.era.zksync.io` | 34 | 28 | no | **yes** | zksync.io |
| Linea | Official | `https://rpc.linea.build` | 33 | 25 | no | **yes** | linea.build |

---

## 🔥 FOR MEV (Has Mempool)

| Chain | Name | URL | RPS | TPS | Found On |
|-------|------|-----|-----|-----|----------|
| **Berachain** | Official | `https://rpc.berachain.com` | 39 | 12 | berachain.com |

> ⚠️ Berachain is the ONLY new L2 with mempool access!

---

## ❌ NOT WORKING

| Chain | Name | URL | Error | Found On |
|-------|------|-----|-------|----------|
| Berachain | PublicNode | `https://berachain-evm-rpc.publicnode.com` | No response | PublicNode |
| Berachain | Thirdweb | `https://bera.rpc.thirdweb.com` | Timeout | Thirdweb |
| Blast | PublicNode | `https://blast-evm-rpc.publicnode.com` | No response | PublicNode |
| Blast | Ankr | `https://rpc.ankr.com/blast` | No response | Ankr |
| Scroll | PublicNode | `https://scroll-evm-rpc.publicnode.com` | No response | PublicNode |
| Mantle | Moon Key | `https://rpc-moon.sepolia.mantle.xyz/v1/...` | Wrong chain (sepolia) | Mantle JS |

---

## 📊 SUMMARY BY CHAIN

| Chain | Chain ID | Best RPC | RPS | TPS | Has Mempool |
|-------|----------|----------|-----|-----|-------------|
| **Blast** | 81457 | Official | 2159 | 35 | no |
| **Scroll** | 534352 | Official | 509 | 42 | no |
| **zkSync Era** | 324 | DRPC | 338 | 28 | no |
| **Mantle** | 5000 | DRPC | 332 | 31 | no |
| **Linea** | 59144 | DRPC | 280 | 25 | no |
| **Mode** | 34443 | DRPC | 269 | 22 | no |
| **Berachain** | 80094 | Official | 39 | 12 | **yes** |

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

**Best for Speed:** Blast Official (2159 RPS)
**Best for MEV:** Berachain Official (has mempool)
**Most Reliable:** DRPC (works on all chains)
