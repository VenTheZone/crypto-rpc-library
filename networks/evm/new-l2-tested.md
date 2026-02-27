# New L2 Chains RPCs - Complete Tested List

> **Last Updated:** 2026-02-27
> **Chains:** Berachain, Blast, Scroll, zkSync Era, Linea, Mantle, Mode

---

## ⚡ TOP PERFORMERS (500+ RPS)

| Chain | Name | URL | RPS | Mempool | Safe TX | Found On |
|-------|------|-----|-----|---------|---------|----------|
| **Blast** | Official | `https://rpc.blast.io` | **2159** | no | **yes** | blast.io |
| **Scroll** | Official | `https://rpc.scroll.io` | **509** | no | **yes** | scroll.io |

---

## 🚀 GOOD PERFORMANCE (200-500 RPS)

| Chain | Name | URL | RPS | Mempool | Safe TX | Found On |
|-------|------|-----|-----|---------|---------|----------|
| zkSync | DRPC | `https://zksync.drpc.org` | **338** | no | **yes** | DRPC |
| Mantle | DRPC | `https://mantle.drpc.org` | **332** | no | **yes** | DRPC |
| Blast | DRPC | `https://blast.drpc.org` | **292** | no | **yes** | DRPC |
| Scroll | DRPC | `https://scroll.drpc.org` | **285** | no | **yes** | DRPC |
| Linea | DRPC | `https://linea.drpc.org` | **280** | no | **yes** | DRPC |
| Mode | DRPC | `https://mode.drpc.org` | **269** | no | **yes** | DRPC |

---

## ✅ WORKING (Under 200 RPS)

| Chain | Name | URL | RPS | Mempool | Safe TX | Found On |
|-------|------|-----|-----|---------|---------|----------|
| Mantle | Official | `https://rpc.mantle.xyz` | 162 | no | **yes** | mantle.xyz |
| Mode | Official | `https://mainnet.mode.network` | 48 | no | **yes** | mode.network |
| Berachain | Official | `https://rpc.berachain.com` | 39 | **yes** | no | berachain.com |
| zkSync | Official | `https://mainnet.era.zksync.io` | 34 | no | **yes** | zksync.io |
| Linea | Official | `https://rpc.linea.build` | 33 | no | **yes** | linea.build |

---

## 🔥 FOR MEV (Has Mempool)

| Chain | Name | URL | RPS | Found On |
|-------|------|-----|-----|----------|
| **Berachain** | Official | `https://rpc.berachain.com` | 39 | berachain.com |

> ⚠️ Berachain is the ONLY new L2 with mempool access!

---

## ❌ NOT WORKING

| Chain | Name | URL | Error |
|-------|------|-----|-------|
| Berachain | PublicNode | `https://berachain-evm-rpc.publicnode.com` | No response |
| Berachain | Thirdweb | `https://bera.rpc.thirdweb.com` | Timeout |
| Blast | PublicNode | `https://blast-evm-rpc.publicnode.com` | No response |
| Blast | Ankr | `https://rpc.ankr.com/blast` | No response |
| Scroll | PublicNode | `https://scroll-evm-rpc.publicnode.com` | No response |
| Mantle | Moon Key | `https://rpc-moon.sepolia.mantle.xyz/v1/...` | Wrong chain (sepolia) |

---

## 📊 SUMMARY BY CHAIN

| Chain | Chain ID | Best RPC | RPS | Has Mempool |
|-------|----------|----------|-----|-------------|
| **Blast** | 81457 | Official | 2159 | no |
| **Scroll** | 534352 | Official | 509 | no |
| **zkSync Era** | 324 | DRPC | 338 | no |
| **Mantle** | 5000 | DRPC | 332 | no |
| **Linea** | 59144 | DRPC | 280 | no |
| **Mode** | 34443 | DRPC | 269 | no |
| **Berachain** | 80094 | Official | 39 | **yes** |

---

## 📝 QUICK REFERENCE

### Fastest New L2
```
https://rpc.blast.io
```
**2159 RPS** - Blast Official

### Best for MEV
```
https://rpc.berachain.com
```
**39 RPS, has mempool** - Berachain Official

### Reliable Cross-Chain
```
https://{chain}.drpc.org
```
**250-350 RPS** - Works on all L2s
