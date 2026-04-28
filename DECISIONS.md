# RPC Library Audit - 2026-04-29

## Summary

| Metric | Value |
|--------|-------|
| Chains audited | 16 (8 priority + 8 secondary in rotation)
| Total RPCs tested | 122 |
| Working | 70 |
| Dead | 52 |
| Collection health | 57.4% |

## Chains Tested

### Priority Chains (8)
- bnb, ethereum, solana, arbitrum, base, polygon, avalanche, optimism

### Secondary Rotation (Day 119 - Group 1)
- fantom, celo, scroll, linea, mantle, berachain, gnosis, zksync

## Top Performers by RPS

| Chain | RPC | RPS |
|-------|-----|-----|
| solana | Ironforge 2 | 567 |
| ethereum | OmniTrade | 309 |
| base | Tenderly | 288 |
| ethereum | Kukus | 258 |
| ethereum | Tenderly | 216 |
| solana | Solana Official | 193 |
| polygon | DRPC | 196 |
| base | Nodies | 63-67 |

## Dead RPCs Confirmed

Many endpoints showing RPS=0 are not "dead" but rather require API keys or have connection issues:
- Alchemy endpoints (need key)
- Infura endpoints (need key)
- QuickNode endpoints (need key/token)
- BlockPi public endpoints (timeout/no response)

## Parser Issues

- `berachain/tested.md` has 9-column table format causing index out of range panic in crypto-rpc tool
- Need to standardize table format or update parser to handle variable columns

## Changes Made

- Updated 15 tested.md files with live RPS/TPS/Mempool data
- Tested all priority chains + Day 1 rotation secondary chains
- Berachain skipped due to format incompatibility
- Generated logs in `logs/` directory

---

# Previous RPC Library Audit Decisions

## 2026-04-28 - Daily Health Check

### Summary
- **Chains Audited**: 16
- **Total RPCs Tested**: 109
- **Working**: 75
- **Dead**: 34
- **Collection Health**: 68.8%

### Dead RPCs Marked

| Chain | Name | URL | Last RPS | Error |
|-------|------|-----|----------|-------|
| Cronos | Ankr | https://rpc.ankr.com/cronos | 0 | Connection error |
| ETC | Ankr | https://rpc.ankr.com/etc | 0 | Connection error |
| Moonbeam | BlockPi | https://moonbeam.blockpi.network/v1/rpc/public | 0 | Timeout |
| IoTeX | IoTeX Old | https://api.iotex.one | 0 | Deprecated |

### Changes Made

- Fixed table format in arbitrum, avalanche, base, solana tested.md files
- Updated all tested.md files with live RPS/TPS/Mempool data
- Tested 16 chains total (8 priority + 8 secondary rotation)
- Created graveyard files for confirmed dead RPCs
- Regenerated NETWORKS.md report

---

## 2026-04-27 - Daily Health Check

### Summary
- **Date**: 2026-04-27
- **Chains Audited**: 16
- **Total RPCs Tested**: 93
- **Working RPCs**: 54
- **Endpoints Requiring API Keys**: 39
- **Dead RPCs**: 0
- **Health Score**: 58.1%

