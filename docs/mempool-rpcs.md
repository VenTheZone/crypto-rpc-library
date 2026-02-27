# Mempool RPCs - Chains with Public Mempool Access

> **Last Updated:** 2026-02-27
> **Purpose:** RPCs that expose pending transactions for MEV/front-running detection
> 
> **Mempool = `yes`** = Your TX is visible before confirmation (NOT safe for bundles)
> **Safe TX = `yes`** = No mempool access = private transactions

---

## 🔥 CHAINS WITH MEMPOOL ACCESS

### Top Performers (500+ RPS with Mempool)

| Chain | RPC | RPS | Pending TX | Safe TX |
|-------|-----|-----|------------|---------|
| **Base** | DRPC Aerodrome | 1093 | 172 | no |
| **BSC** | 1rpc.io | 683 | 35 | no |
| **Ethereum** | 1rpc.io | 515 | 260 | no |
| **Polygon** | 1rpc.io | 436 | 953 | no |

### Good Performers (100-500 RPS)

| Chain | RPC | RPS | Pending TX | Safe TX |
|-------|-----|-----|------------|---------|
| **Avalanche** | DRPC | 255 | 4736 | no |
| **Ethereum** | DRPC | 245 | 231 | no |
| **BSC** | Official | 89 | 42 | no |
| **Optimism** | PublicNode | 35 | 579 | no |
| **Berachain** | Official | 29 | 15 | no |

### Low Performance (Under 100 RPS)

| Chain | RPC | RPS | Pending TX | Safe TX |
|-------|-----|-----|------------|---------|
| Base | PublicNode | 68 | 138 | no |
| Polygon | DRPC | 52 | 908 | no |
| Polygon | Official | 52 | 922 | no |
| Polygon | PublicNode | 38 | 953 | no |
| Optimism | DRPC | 33 | 524 | no |
| Fantom | Official | 26 | 69 | no |
| BSC | PublicNode | 22 | 39 | no |
| Fantom | DRPC | 21 | 69 | no |
| Avalanche | PublicNode | 15 | 4582 | no |

---

## ❌ CHAINS WITHOUT MEMPOOL (Sequencer-based)

| Chain | Reason | Notes |
|-------|--------|-------|
| **Arbitrum** | Sequencer-based | No public mempool, ordered by sequencer |
| **zkSync Era** | Sequencer-based | No mempool access |
| **Scroll** | zkRollup | No mempool access |
| **Linea** | Sequencer-based | No mempool access |
| **Mode** | Optimism-based | No mempool access |

> **Note:** Some "Official" RPCs don't expose mempool, but public providers (DRPC, PublicNode) DO!

---

## 🔑 KEY DISCOVERIES

### 1. PublicNode Exposes Mempool on Most Chains
Even chains like **Optimism** and **Base** that are "sequencer-based" have mempool visible on PublicNode!

### 2. DRPC Also Exposes Mempool
DRPC endpoints show pending transactions on most chains.

### 3. Official RPCs Often Hide Mempool
- Base Official: No mempool
- Optimism Official: No mempool
- Avalanche Official: No mempool
- But DRPC/PublicNode on same chains: **Has mempool!**

### 4. 1rpc.io is Great for Mempool
Fast RPS with mempool on:
- Ethereum (515 RPS)
- BSC (683 RPS)
- Polygon (436 RPS)

---

## 🧪 MEMPOOL TESTING METHOD

```bash
# Test if RPC has mempool:
curl -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'

# Response with pending/queued = HAS MEMPOOL
# Error -32601 = NO MEMPOOL
```

---

## 📊 FOR MEV DEVELOPERS

### Best RPCs for MEV (High RPS + Mempool)

| Rank | Chain | RPC | RPS | Why |
|------|-------|-----|-----|-----|
| 1 | Base | DRPC Aerodrome | 1093 | Fast + mempool |
| 2 | BSC | 1rpc.io | 683 | Fast + mempool |
| 3 | Ethereum | 1rpc.io | 515 | Fast + mempool |
| 4 | Polygon | 1rpc.io | 436 | Fast + mempool |
| 5 | Avalanche | DRPC | 255 | Huge pending TX count |

### Pending TX Count (Mempool Size)

Higher = more opportunity to see transactions:

| Chain | RPC | Pending TX |
|-------|-----|------------|
| **Avalanche** | DRPC | 4736 |
| **Polygon** | 1rpc.io | 953 |
| **Optimism** | PublicNode | 579 |
| **Ethereum** | 1rpc.io | 260 |

---

## 📁 FILES

| File | Content |
|------|---------|
| `scripts/test-mempool-chains.js` | Mempool test script |
| `networks/*/tested.md` | Per-chain results |
