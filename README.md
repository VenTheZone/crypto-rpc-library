# crypto-rpc

CLI tool for finding and testing cryptocurrency RPC endpoints across multiple chains.

## What it does

- **Discovers** RPC endpoints from DEX frontends
- **Tests** performance (RPS, TPS, mempool access)
- **Documents** findings in markdown reports

## Quick Start

```bash
# Build
go build -o bin/crypto-rpc ./cmd/crypto-rpc

# Discover RPCs from DEX frontends
./bin/crypto-rpc discover-dex solana    # Solana DEXs
./bin/crypto-rpc discover-dex evm       # EVM DEXs

# Test RPCs from a file
./bin/crypto-rpc test -i input.md -o output.md
```

## How to Search for RPCs

### Method 1: DEX Frontend Interception

Scan DEX websites to extract RPC endpoints from their frontend code.

```bash
# EVM chains (requires Node.js and Playwright)
node scripts/intercept-evm-rpcs.js <chain_name> <chain_id>

# Examples
node scripts/intercept-evm-rpcs.js base 8453
node scripts/intercept-evm-rpcs.js arbitrum 42161
node scripts/intercept-evm-rpcs.js ethereum 1
```

This captures:
- JSON-RPC calls in network traffic
- API keys embedded in JS bundles
- WebSocket endpoints

**Patterns found in DEX code:**
- `*.quiknode.pro/*` — QuickNode endpoints
- `*.drpc.org/*` — DRPC endpoints
- `rpc.ankr.com/*` — Ankr
- `*.infura.io/*` — Infura
- `*.alchemy.com/*` — Alchemy

### Method 2: Public Lists

See [docs/reference/rpc-summary.md](docs/reference/rpc-summary.md) for pre-tested RPCs by chain.

### Method 3: Manual Discovery

Check DEX frontends directly:
1. Open browser DevTools → Network tab
2. Filter by "rpc" or "jsonrpc"
3. Look for `eth_chainId`, `getBlock` calls
4. Copy the endpoint URL

## How to Test RPCs

### Test with the CLI

Create an input file with RPCs:

```markdown
| RPC | Chain | Type | Origin |
|-----|-------|------|--------|
| https://rpc.example.com | base | public | |
```

Run tests:

```bash
./bin/crypto-rpc test -i input.md -o results.md
```

Tests include:
- **RPS** — Requests per second (12 concurrent, 2.5s burst)
- **TPS** — Transactions per second (block production rate)
- **Mempool** — `txpool_content` or `txpool_status` availability
- **Latency** — Response time measurements

### Test with Node.js Scripts

```bash
# Full RPS/TPS/Mempool test for EVM chains
node scripts/test-evm-full.js base

# Uses intercept output or manual RPC list
```

### What tests measure

| Metric | Meaning | Why it matters |
|--------|---------|----------------|
| RPS | Throughput under load | Bundle submission speed |
| TPS | Network block capacity | Chain congestion |
| Mempool | `txpool_*` available | Private mempool hunting |
| Latency | Round-trip time | Speed of execution |

## Features

- **Automated discovery** — Scan DEX sites for RPC endpoints
- **Performance testing** — Measure RPS, TPS, latency
- **Security checks** — Detect mempool visibility (safe for bundles)
- **Multi-chain** — Solana, EVM chains (Base, Arbitrum, Ethereum, etc.)
- **Origin headers** — Custom headers for RPCs that require them (e.g., Helius)

## Documentation

- [Full docs](docs/INDEX.md)
- [RPC summary by chain](docs/reference/rpc-summary.md)
- [DEX findings](docs/reference/findings.md)
- [Discovery guide](docs/guides/rpc-discovery.md)

## Project Structure

```
crypto-rpc-library/
├── cmd/crypto-rpc/       # Go CLI source
├── scripts/              # Discovery & test scripts
│   ├── intercept-evm-rpcs.js
│   └── test-evm-full.js
├── networks/             # Results by chain
│   ├── evm/
│   └── solana/
└── docs/                 # Documentation
```

## Chains Supported

| Chain | CLI | Discovery Script |
|-------|-----|------------------|
| Solana | `./bin/crypto-rpc discover-dex solana` | Built-in |
| Base | — | `node scripts/intercept-evm-rpcs.js base 8453` |
| Arbitrum | — | `node scripts/intercept-evm-rpcs.js arbitrum 42161` |
| Ethereum | — | `node scripts/intercept-evm-rpcs.js ethereum 1` |
| Optimism | — | `node scripts/intercept-evm-rpcs.js optimism 10` |
| BSC | — | `node scripts/intercept-evm-rpcs.js bsc 56` |

Add more chains by using the appropriate chain ID.
