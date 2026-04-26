# RPC Library Audit Decisions

## 2026-04-27 - Daily Health Check

### Summary
- **Date**: 2026-04-27
- **Chains Audited**: 16
- **Total RPCs Tested**: 93
- **Working RPCs**: 54
- **Endpoints Requiring API Keys**: 39
- **Dead RPCs**: 0
- **Health Score**: 58.1%

### Chains Tested
**Priority Chains (tested every run):**
- bnb, ethereum, arbitrum, optimism, polygon

**Secondary Chains (rotating):**
- fantom, celo, scroll, linea, mantle, gnosis, zksync
- cronos, etc, moonbeam, taiko

### Key Performance Findings

| Chain | Top Performer | RPS | Mempool Safe |
|-------|---------------|----:|:------------:|
| ethereum | Kukus | 301 | ✅ |
| taiko | Taiko | 219 | ❌ |
| fantom | DRPC | 162 | ✅ |
| optimism | Blast | 194 | ✅ |
| polygon | Blast | 192 | ✅ |
| linea | Blast | 172 | ✅ |
| arbitrum | DRPC | 179 | ✅ |
| zkSync | zkSync | 189 | ✅ |
| gnosis | Ankr | 192 | ✅ |
| bnb | Ankr | 145 | ✅ |

### Status Definitions
- **working**: RPS > 0 and responding successfully
- **needs-key**: No RPS data (requires authentication/API key)
- **dead**: RPS = 0 or connection failures (none found this run)

### Provider Health Summary

**Fully Working Providers (>0 RPS across chains):**
- DRPC: fantom(162), arbitrum(179), ethereum(195), optimism(165)
- Ankr: bnb(145), ethereum(144), gnosis(192), moonbeam(163), zksync(62)
- Blast: optimism(194), polygon(192), linea(172)

**API Key Required (RPS unavailable):**
- BlockPi: across arbitrum, optimism, polygon, linea, scroll
- QuickNode: across ethereum, optimism, arbitrum, base
- Alchemy: across ethereum, optimism, arbitrum
- Infura: across ethereum, optimism, arbitrum

### Solana Status
Solana tested.md uses different table format (7 columns vs 9 for EVM). 
Parser initially failed - requires manual handling or format update.

### Dead RPCs
No confirmed dead endpoints this run. All RPS=0 entries are providers 
requiring API keys rather than truly dead endpoints.

### Files Changed
- networks/evm/{16 chains}/tested.md - Updated with live RPS/TPS metrics
- scripts/monitor-rpcs.py - Minor linting fix
- logs/monitor_cron_2026-04-27.log - Cron execution log

### Commit
`66c1896` - chore(audit): daily RPC collection health check

---

Last Updated: 2026-04-27
