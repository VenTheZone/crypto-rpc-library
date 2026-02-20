# crypto-rpc Design

A Go CLI tool for discovering and testing cryptocurrency RPC endpoints across multiple chains.

## Overview

**Purpose:** Automate discovery, testing, and documentation of RPC endpoints for bug hunting and MEV research.

**Audience:** Personal use

**Output:** Markdown tables

## Project Structure

```
crypto-rpc/
├── cmd/
│   └── crypto-rpc/
│       └── main.go          # CLI entrypoint
├── internal/
│   ├── discover/            # RPC discovery (DexScreener, subfinder, httpx)
│   ├── test/                # RPS, TPS, mempool testing
│   ├── dedup/               # Filter already-known RPCs
│   └── report/              # Markdown table generation
├── networks/                # RPC data storage
│   ├── evm/
│   │   ├── bnb.md
│   │   ├── fantom.md
│   │   └── ...
│   ├── solana/
│   └── sui/
├── go.mod
└── go.sum
```

## CLI Commands

### discover

Discover new RPC endpoints for a chain.

```
crypto-rpc discover [flags]
  --chain string      Chain to discover (bnb, eth, solana, sui, all)
  --source string     Discovery source (dexscreener, file, stdin)
  --output string     Output markdown file (default: networks/<chain>/discovered.md)
  --dedup string      Directory of known RPCs to exclude
```

### test

Test RPC endpoints for RPS, TPS, mempool availability, and auth requirements.

```
crypto-rpc test [flags]
  --input string      Input markdown file with RPCs to test
  --output string     Output markdown file with results
  --tests string      Comma-separated tests: rps,tps,mempool,auth (default: all)
  --concurrency int   Concurrent requests (default: 50)
```

### report

Generate aggregate reports from tested RPCs.

```
crypto-rpc report [flags]
  --input string      Input directory or file
  --output string     Output aggregated markdown
  --format string     Table format (default: github)
```

### Example Workflow

```bash
# Discover new RPCs for BNB, dedup against known ones
crypto-rpc discover --chain bnb --dedup networks/evm/ --output networks/evm/bnb-new.md

# Test discovered RPCs
crypto-rpc test --input networks/evm/bnb-new.md --output networks/evm/bnb-tested.md

# Generate aggregate report
crypto-rpc report --input networks/evm/ --output NETWORKS.md
```

## Markdown Table Format

### Structure

```markdown
# BNB Chain RPCs

| Name        | URL                            | Auth Header                   | RPS  | TPS | Mempool | Status    |
| ----------- | ------------------------------ | ----------------------------- | ---- | --- | ------- | --------- |
| 1rpc.io/bnb | https://1rpc.io/bnb            | `Origin: https://1rpc.io`     | 2857 | 57  | yes     | working   |
| Ankr        | https://rpc.ankr.com/bnb       | `Authorization: Bearer <key>` | -    | -   | no      | needs-key |
| PublicNode  | https://bsc-rpc.publicnode.com | -                             | 25   | 57  | yes     | working   |
```

### Column Definitions

| Column      | Description                                              |
| ----------- | -------------------------------------------------------- |
| Name        | Short identifier for the RPC provider                    |
| URL         | Full RPC endpoint URL                                    |
| Auth Header | Required headers (Origin, Authorization, etc.) or `-`    |
| RPS         | Requests per second (concurrent test)                    |
| TPS         | Transactions per second (block-based measurement)        |
| Mempool     | `yes` / `no` - whether mempool access is available       |
| Status      | `working`, `needs-key`, `rate-limited`, `dead`, `untested` |

### Auth Header Formats

- `-` = no auth needed
- `` `Origin: https://foo.com` `` = simple header
- `` `Authorization: Bearer <key>` `` = requires API key

## Discovery Pipeline

```
┌──────────────────┐
│   DexScreener    │  Fetch DEX list, extract domains
│      API         │  (e.g., jup.ag, raydium.com)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    subfinder     │  Enumerate subdomains
│  (shell out)     │  (api.jup.ag, rpc.raydium.com)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      httpx       │  Probe live HTTPS endpoints
│  (shell out)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Go internal    │  Detect RPC type:
│   RPC detector   │  - eth_chainId → EVM
└────────┬─────────┘  - getHealth → Solana
         │            - sui_getLatestCheckpointSequenceNumber → Sui
         ▼
┌──────────────────┐
│   Go internal    │  Filter against known-rpcs/
│     dedup        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Output:        │  networks/<chain>/discovered.md
│   Markdown       │
└──────────────────┘
```

## Testing Logic

### RPS (Requests Per Second)

1. Send 50 concurrent `eth_blockNumber` (or chain equivalent) requests
2. Measure total time
3. Calculate: `RPS = requests / seconds`
4. Detect rate limiting (429 responses, error messages)

### TPS (Transactions Per Second)

1. Get current block number (block A)
2. Wait 10 seconds
3. Get new block number (block B)
4. Calculate: `TPS = (block B - block A) / 10 * avg_tx_per_block`
   - Alternative: count actual transactions via `eth_getBlockByNumber`

### Mempool Detection

| Chain   | Method                          | Result                     |
| ------- | ------------------------------- | -------------------------- |
| EVM     | `txpool_content`                | non-empty = yes            |
| Solana  | No traditional mempool          | check `getSignaturesForAddress` |
| Sui     | No public mempool               | always no                  |

### Auth Detection

1. Try request without headers
2. If 401/403: try common headers (Origin, Referer)
3. If still fails: mark as `needs-key`
4. Record working header in Auth column

## Chain Support

### EVM Chains

- Ethereum
- BNB Chain
- Polygon
- Arbitrum
- Optimism
- Base
- Fantom
- Avalanche

### Non-EVM Chains

- Solana
- Sui
- Aptos

## Dependencies

### External (shell out)

- `subfinder` - subdomain enumeration
- `httpx` - HTTP probing

### Internal (Go)

- `cobra` - CLI framework (optional, or use stdlib)
- `net/http` - HTTP client
- `encoding/json` - JSON-RPC handling
- `sync` - concurrent testing

## Status Values

| Status       | Description                              |
| ------------ | ---------------------------------------- |
| `working`    | RPC responds correctly to basic queries  |
| `needs-key`  | Requires API key not provided            |
| `rate-limited` | Rate limited during testing            |
| `dead`       | No response or invalid responses         |
| `untested`   | Not yet tested                           |
