# Network RPC Collection Report

> **Last Updated:** 2026-04-28
> **Generated:** 2026-04-28 05:30:00 UTC

---

## Collection Overview

| Metric | Value |
|--------|-------|
| **Total Chains Audited** | 16 |
| **Total RPCs Tested** | 109 |
| **Working RPCs** | 75 |
| **Dead RPCs** | 34 |
| **Collection Health** | 68.8% |

---

## Per-Chain Summary

| Chain | Total RPCs | Working | Dead | Top Performer | Top RPS |
|-------|------------|---------|------|---------------|---------|
| Ethereum | 20 | 11 | 9 | Tenderly | 403 |
| Solana | 20 | 12 | 8 | Ironforge 2 | 223 |
| Base | 17 | 14 | 3 | Tenderly | 201 |
| Polygon | 10 | 5 | 5 | Blast | 170 |
| Optimism | 9 | 6 | 3 | Blast | 173 |
| Arbitrum | 6 | 6 | 0 | QuickNode | 152 |
| Avalanche | 4 | 4 | 0 | DRPC | 142 |
| IoTeX | 4 | 2 | 2 | OnFinality | 157 |
| BNB | 6 | 6 | 0 | Binance | 130 |
| Moonbeam | 3 | 2 | 1 | Ankr | 199 |
| Cronos | 2 | 1 | 1 | Cronos | 37 |
| ETC | 2 | 1 | 1 | Ethereum Classic | 39 |
| Harmony | 2 | 2 | 0 | Ankr | 150 |
| Taiko | 1 | 1 | 0 | Taiko | 124 |
| Ronin | 1 | 1 | 0 | Ronin | 36 |
| Klaytn | 2 | 1 | 1 | Ankr | 36 |

---

## Priority Chains Status

### Tier 1 Chains (MEV-Critical)

| Chain | Working RPCs | MEV-Safe RPCs | Top Safe RPC | Top RPS |
|-------|--------------|---------------|--------------|---------|
| **BNB** | 6 | 3 | Ankr | 134 |
| **Ethereum** | 11 | 11 | Tenderly | 403 |
| **Solana** | 12 | 12 | Ironforge 2 | 223 |
| **Arbitrum** | 6 | 6 | QuickNode | 152 |
| **Base** | 14 | 10 | Tenderly | 201 |
| **Polygon** | 5 | 5 | Blast | 170 |
| **Avalanche** | 4 | 2 | Avalanche Official | 66 |
| **Optimism** | 6 | 5 | Blast | 173 |

---

## Dead RPCs by Chain

| Chain | RPCs Confirmed Dead |
|-------|---------------------|
| Solana | 9 RPCs marked dead (low RPS) |
| Ethereum | 7 RPCs (needs-key endpoints) |
| Polygon | 5 RPCs (timeout/needs-key) |
| Base | 5 RPCs (connection errors) |
| Optimism | 3 RPCs (needs-key) |
| IoTeX | 2 RPCs (deprecated/connection) |
| Cronos | 1 RPC (Ankr - connection) |
| ETC | 1 RPC (Ankr - connection) |
| Moonbeam | 1 RPC (BlockPi - timeout) |
| Klaytn | 1 RPC (Ankr - connection) |

---

## Directory Structure

```
networks/
├── evm/
│   ├── bnb/tested.md          (6 RPCs)
│   ├── ethereum/tested.md     (20 RPCs)
│   ├── arbitrum/tested.md      (6 RPCs)
│   ├── base/tested.md          (17 RPCs)
│   ├── polygon/tested.md       (10 RPCs)
│   ├── avalanche/tested.md     (4 RPCs)
│   ├── optimism/tested.md      (9 RPCs)
│   └── ... (other chains)
├── solana/tested.md            (20 RPCs)
└── ... (other non-EVM chains)
```

---

## Recommended RPCs by Use Case

### Maximum Speed (MEV-Safe)
1. **Tenderly** (Ethereum) - 403 RPS
2. **Tenderly** (Base) - 201 RPS
3. **Ankr** (Moonbeam) - 199 RPS
4. **Blast** (Optimism) - 173 RPS
5. **Blast** (Polygon) - 170 RPS

### Mempool Access (MEV Operations)
1. **Binance** (BNB) - 130 RPS, Mempool: YES
2. **PublicNode** (Optimism) - 123 RPS, Mempool: YES
3. **OnFinality** (IoTeX) - 157 RPS, Mempool: YES
4. **PublicNode** (Avalanche) - 113 RPS, Mempool: YES
5. **PublicNode** (BNB) - 117 RPS, Mempool: YES

### Free Tier (No API Key Required)
1. **DRPC** (Multiple chains) - 80-552 RPS
2. **PublicNode** (Multiple chains) - 50-123 RPS
3. **BlastAPI** (Multiple chains) - 40-170 RPS

---

## Recent Changes

### 2026-04-28
- Tested all priority chains and secondary rotation
- Fixed malformed tested.md files (arbitrum, base, avalanche, solana)
- Created graveyard files for dead RPCs (cronos, etc, moonbeam)
- Collection health: 68.8% (75/109 working)

---

## Quick Reference

```bash
# Test a specific chain
./bin/crypto-rpc test -i networks/evm/bnb/tested.md -o networks/evm/bnb/tested.md -c 25

# Generate report
./bin/crypto-rpc report -i networks/ -o NETWORKS.md

# Discover new RPCs from DEXs
./bin/crypto-rpc discover-dex bnb -o data/bnb-new-discovered.md
```
