# RPC Discovery Method - DEX Frontend Interception

> **Purpose:** Discover RPC endpoints and API keys by intercepting network requests from DEX websites
> **Works on:** All EVM chains (Base, ETH, Arbitrum, Optimism, BSC, Polygon, etc.)

---

## 🎯 Quick Start

```bash
# Run the interceptor script
node scripts/intercept-evm-rpcs.js <chain_name> <chain_id>

# Example for Base:
node scripts/intercept-evm-rpcs.js base 8453

# Example for Arbitrum:
node scripts/intercept-evm-rpcs.js arbitrum 42161
```

---

## 📋 Methodology

### Step 1: Identify Top DEXs by Volume
1. Go to CoinGecko: `https://www.coingecko.com/en/exchanges/decentralized/<chain>`
2. List top 5-10 DEXs by 24h volume
3. Note their URLs

### Step 2: Intercept Network Requests
Use Playwright to capture:
- JSON-RPC calls (look for `eth_`, `net_`, `web3_` methods)
- JS bundle URLs (often contain embedded API keys)

### Step 3: Extract RPC URLs & API Keys
Patterns to search for in JS bundles:
```
- *.quiknode.pro/*      → QuickNode endpoints
- *.drpc.org/*          → DRPC endpoints  
- *.publicnode.com/*    → PublicNode
- *.llamarpc.com/*      → LlamaRPC
- rpc.ankr.com/*        → Ankr
- *.infura.io/*         → Infura
- *.alchemy.com/*       → Alchemy
```

### Step 4: Test Discovered RPCs
```bash
node scripts/test-evm-full.js <chain_name>
```

Tests:
- **RPS** - Requests per second (concurrency test)
- **TPS** - Network transactions per second
- **Mempool** - `txpool_content` / `txpool_status` methods

---

## 🔧 Reusable Scripts

### `intercept-evm-rpcs.js`
Generic interceptor for any EVM chain:

```javascript
const { chromium } = require('playwright');

const CHAIN = process.argv[2] || 'base';
const CHAIN_ID = process.argv[3] || '8453';

// DEX URLs - UPDATE FOR EACH CHAIN
const DEX_SITES = {
  base: [
    'https://aerodrome.finance/swap',
    'https://app.uniswap.org/swap?chain=base',
    'https://pancakeswap.finance/swap?chain=base',
    'https://baseswap.fi/swap',
  ],
  ethereum: [
    'https://app.uniswap.org/swap',
    'https://app.1inch.io/swap',
    'https://cowswap.exchange',
    'https://app.curve.fi',
  ],
  arbitrum: [
    'https://app.uniswap.org/swap?chain=arbitrum',
    'https://pancakeswap.finance/swap?chain=arbitrum',
    'https://app.camelot.exchange',
    'https://app.gmx.io',
  ],
  // Add more chains...
};

// ... rest of interceptor logic
```

### `test-evm-full.js`
Full RPS/TPS/Mempool test for any EVM chain:

```javascript
// RPS Test: 12 concurrent requests for 2.5s
async function testRPS(url, concurrency = 12, duration = 2500) { ... }

// TPS Test: Block production over 5s
async function testTPS(url) {
  // Get block before wait
  // Wait 5 seconds
  // Get block after wait
  // Count transactions
}

// Mempool Test: 3 methods
async function testMempool(url) {
  // Try txpool_content first
  // Fallback to txpool_inspect
  // Fallback to txpool_status
  // -32601 error = no mempool
}
```

---

## 📊 Chain IDs Reference

| Chain     | Chain ID | Top DEXs                        |
| --------- | -------- | ------------------------------- |
| Ethereum  | 1        | Uniswap, 1inch, Curve, Sushi    |
| Base      | 8453     | Aerodrome, Uniswap, PancakeSwap |
| Arbitrum  | 42161    | Uniswap, GMX, Camelot           |
| Optimism  | 10       | Uniswap, Velodrome              |
| BSC       | 56       | PancakeSwap, Thena              |
| Polygon   | 137      | Uniswap, QuickSwap              |
| Avalanche | 43114    | Trader Joe, Uniswap             |

---

## 🔑 API Key Patterns

Search for these in JS bundles:

```regex
# QuickNode
https?://[a-z-]+\.quiknode\.pro/[a-f0-9]{40}

# Ankr
https?://rpc\.ankr\.com/\w+/[a-f0-9]{64}

# DRPC
https?://lb\.drpc\.live/\w+/[A-Za-z0-9_-]{40,}

# Infura
https?://\w+\.infura\.io/v3/[a-f0-9]{32}

# Alchemy
https?://[-\w]+\.alchemy\.com/v2/[a-f0-9]{32}
```

---

## ⚠️ Notes

1. **API keys may rotate** - DEXs can change keys anytime
2. **Rate limits apply** - Even with working keys
3. **Terms of Service** - Using leaked keys may violate ToS
4. **Mempool access is rare** - Most endpoints don't expose it

---

## 📁 File Structure

```
crypto-rpc-library/
├── scripts/
│   ├── intercept-evm-rpcs.js    # Generic interceptor
│   ├── test-evm-full.js          # Generic RPS/TPS/Mempool test
│   └── intercept-base-dex-rpcs.js # Base-specific (example)
├── networks/
│   └── evm/
│       ├── base-tested.md        # Results
│       ├── base-api-keys-found.md
│       └── base-discovered-raw.json
└── methods/
    └── rpc-discovery-method.md   # This file
```
