# RPC Discovery & Testing Workflow Guide

> How to find, test, and document cryptocurrency RPC endpoints

---

## Table of Contents
1. [Finding RPCs](#1-finding-rpcs)
2. [Discovery Methods](#2-discovery-methods)
3. [Testing Procedures](#3-testing-procedures)
4. [Documentation Standards](#4-documentation-standards)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Finding RPCs

### 1.1 Where to Look

**Primary Sources:**
- **DEX Frontends** - Jupiter, Raydium, Orca, Meteora, Drift, Kamino
- **Wallet Apps** - Phantom, Solflare, Backpack, Glow
- **Analytics Sites** - DEX Screener, Birdeye, Step Finance
- **Official Chain Docs** - GitHub repos, official documentation

**Secondary Sources:**
- JavaScript bundles (search for `rpc`, `helius`, `alchemy`)
- Network tab in browser DevTools
- WebSocket connection logs
- Config files in open source repos

### 1.2 Patterns to Search

```javascript
// Common URL patterns
*.helius-rpc.com
*.helius.xyz
*.rpcpool.com
*.quiknode.pro
*.g.alchemy.com
*solana-mainnet*
*fast-mainnet*
api.mainnet-beta.solana.com
```

---

## 2. Discovery Methods

### 2.1 Browser Network Analysis

1. Open DEX website in Chrome/Firefox
2. Open DevTools → Network tab
3. Filter by "rpc" or "api"
4. Refresh page and watch requests
5. Look for:
   - POST requests to endpoints
   - WebSocket connections (wss://)
   - Headers including Origin/Referer

### 2.2 JavaScript Extraction

```javascript
// In browser console
const scripts = document.querySelectorAll('script[src]');
scripts.forEach(s => {
  fetch(s.src)
    .then(r => r.text())
    .then(t => {
      const matches = t.match(/https?:\/\/[^\s"']+(?:rpc|helius)[^\s"']*/g);
      if (matches) console.log(matches);
    });
});
```

### 2.3 Using Discovery Scripts

```bash
# Run the discovery scanner
node scripts/run-solana-discovery.js

# Individual category scans
node scripts/scan-solana-dex.js
node scripts/scan-solana-wallets.js
node scripts/scan-solana-nft.js
```

### 2.4 Manual Search Checklist

- [ ] Check main DEX frontends
- [ ] Inspect network requests
- [ ] Look at JavaScript bundles
- [ ] Check wallet connection settings
- [ ] Search GitHub for exposed configs

---

## 3. Testing Procedures

### 3.1 Quick Health Check

```bash
curl -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth","params":[]}'
```

Expected: `{"jsonrpc":"2.0","result":"ok","id":1}`

### 3.2 Testing with Custom Origin

For restricted RPCs (Helius, RPC Pool, etc.):

```bash
curl -X POST https://grateful-jerrie-fast-mainnet.helius-rpc.com \
  -H "Content-Type: application/json" \
  -H "Origin: https://jup.ag" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth","params":[]}'
```

### 3.3 RPS Test (Requests Per Second)

```bash
# Run 20 parallel requests
for i in {1..20}; do
  curl -s -X POST https://api.mainnet-beta.solana.com \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}' &
done
wait
```

### 3.4 Full Automated Test

```bash
# Test all collected RPCs with origin spoofing
node scripts/test-solana-rpcs-with-origin.js

# Test specific RPC
node scripts/test-new-solana-rpcs.js
```

### 3.5 What Each Method Tests

| Method | Purpose |
|--------|---------|
| `getHealth` | Basic availability |
| `getSlot` | Current block height |
| `getVersion` | Node version info |
| `getRecentPerformanceSamples` | TPS metrics |

---

## 4. Documentation Standards

### 4.1 Working RPC Format

```markdown
| RPC | RPS | TPS | Needs Origin | Source |
|-----|-----|-----|--------------|--------|
| `https://endpoint.here` | 100 | 3000 | Yes/No | Jupiter |
```

**Required Fields:**
- Full endpoint URL
- RPS (requests per second)
- TPS (transactions per second) 
- Origin requirement (Yes/No + which origin)
- Source (where found)

### 4.2 Dead RPC Format

```
https://dead-endpoint.com | Source: Jupiter | Error: timeout/unresponsive
```

**Required:**
- URL
- Original source
- Why it's dead

### 4.3 Categorization

**By Performance:**
- **Top Performers** - RPS > 50, TPS > 2000
- **Working** - Responds to health check
- **Restricted** - Requires origin/auth

**By Type:**
- Public (no auth)
- Origin-restricted
- API key required

### 4.4 File Naming Convention

```
Working-Solana-RPC.md     # Current working list
deadrpc.txt              # Failed endpoints
solana-discovered.json   # Raw discovery data
solana-new-rpcs.json     # Newly found awaiting test
```

---

## 5. Troubleshooting

### 5.1 "403 Forbidden" Errors

**Cause:** Missing Origin header  
**Fix:** Add `-H "Origin: https://jup.ag"`

### 5.2 "429 Too Many Requests"

**Cause:** Rate limiting  
**Fix:** Add delays between requests (300ms)

### 5.3 "Connection Timeout"

**Cause:** RPC is dead or IP blocked  
**Fix:** Try with VPN, mark as dead

### 5.4 CORS Errors in Browser

**Cause:** Cross-origin restrictions  
**Fix:** Use curl/server-side testing, not browser

---

## Quick Reference Commands

```bash
# Full audit (test all, generate reports)
node scripts/audit-all-solana-rpcs.js

# Discovery scan
node scripts/run-solana-discovery.js

# Test with origin spoofing
node scripts/test-solana-rpcs-with-origin.js

# Health check single RPC
curl -X POST URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

---

## Checklist for New RPC

- [ ] Discovered from reputable source
- [ ] Health check passes
- [ ] RPS tested (10+ concurrent requests)
- [ ] TPS tested (if available)
- [ ] Origin requirement documented
- [ ] Added to Working-Solana-RPC.md
- [ ] Source attribution included

---

*Last updated: 2026-04-11*
