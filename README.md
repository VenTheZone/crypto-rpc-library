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

## Workflow: Search → Collect → Test

Full workflow goes in 3 steps:

```
1. SEARCH (find RPCs) → 2. COLLECT (make input.md) → 3. TEST (run analysis)
```

Once you have tested results, commit them to `networks/<chain>/tested.md`.

**New to the library?** Read [docs/HOW-TO.md](docs/HOW-TO.md) for detailed usage instructions.

---

## Step 1: Search for RPCs

### What search does

Discovery scripts visit DEX frontends, capture network traffic, and extract RPC endpoints plus embedded API keys from JavaScript bundles.

**Output:** JSON file with discovered RPCs in `data/<chain>-discovered.json`

### Search methods

| Method | Command | Best for |
|--------|---------|----------|
| **DEX Interception** | `node scripts/intercept-evm-rpcs.js <chain> <chain_id>` | EVM chains (Base, Arbitrum, ETH) |
| **Solana Built-in** | `./bin/crypto-rpc discover-dex solana` | Solana DEXs (Raydium, Jupiter, etc.) |
| **Manual** | DevTools Network tab | One-off RPCs from any site |

### DEX Interception (EVM chains)

```bash
# Run interception
node scripts/intercept-evm-rpcs.js base 8453

# Output saved to:
# data/evm/base-discovered.json
```

This captures:
- JSON-RPC calls from DEX frontends
- API keys in JS bundles (QuickNode, Alchemy, etc.)
- WebSocket endpoints

**Common API key patterns:**
| Provider | Pattern in code |
|----------|-----------------|
| QuickNode | `*.quiknode.pro/<40-char-key>` |
| Alchemy | `*.alchemy.com/v2/<32-char-key>` |
| Infura | `*.infura.io/v3/<32-char-key>` |
| Ankr | `rpc.ankr.com/<chain>/<64-char-key>` |
| DRPC | `lb.drpc.live/<chain>/<40-char-key>` |

### Manual discovery

1. Open DEX in browser
2. DevTools → Network tab → filter by `rpc` or `jsonrpc`
3. Look for `eth_chainId`, `eth_getBlock` calls
4. Copy Request URL → this is the RPC endpoint

---

## Step 2: Create input.md

The test command expects a markdown table with RPCs to analyze.

### Input format

```markdown
| Name | URL | Auth | Origin |
|------|-----|------|--------|
| QuickNode Base | https://xxx.quiknode.pro/xxx | - | - |
| Helius Jupiter | https://rpc.helius.xyz | - | https://jup.ag |
| Alchemy ETH | https://eth.llamarpc.com | Bearer XXX | - |
```

**Columns:**
- `Name` — Label for this RPC (appears in results)
- `URL` — Full endpoint URL
- `Auth` — API key/header if needed (`-` if public)
- `Origin` — Custom Origin header for RPCs that require it (`-` if not needed)

### Where input.md comes from

**From discovery output:**
```bash
# 1. Run discovery
node scripts/intercept-evm-rpcs.js base 8453

# 2. Manually copy promising URLs from output into input.md
# (Discovery outputs raw JSON — cherry pick the good ones)
```

**From pre-tested lists:**
```bash
# Copy from existing tested results
cat networks/evm/base/tested.md | grep -E "^\|.*http" > input.md
```

**Hand-crafted:**
Paste RPCs you found via DevTools or documentation.

---

## Step 3: Test RPCs

### What test does

The CLI runs performance and security checks against each RPC in your input file.

**Input:** `input.md` (markdown table with RPCs)  
**Output:** `results.md` (markdown table with test results)

### Run the test

```bash
./bin/crypto-rpc test -i input.md -o results.md
```

### What gets measured

| Test | What it does | Why it matters |
|------|--------------|----------------|
| **RPS** | 12 concurrent requests for 2.5s | Your throughput under load |
| **TPS** | Transactions per block over 5s | Chain capacity |
| **Mempool** | Tries `txpool_content`, `txpool_status` | Can you see pending TXs? |
| **Latency** | Single request round-trip | Speed of execution |
| **Safe TX** | Mempool NOT visible | Private RPC = safe for bundles |

### Output format

```markdown
| Name | URL | RPS | TPS | Mempool | Safe TX | Status |
|------|-----|----:|----:|:-------:|:-------:|--------|
| QuickNode | https://... | 358 | 80 | no | ✅ | working |
| PublicNode | https://... | 144 | 68 | yes | ❌ | working |
```

**Reading the results:**
- **RPS** — Higher = faster for submitting bundles
- **Mempool = yes** — RPC exposes pending transactions (MEV risk)
- **Safe TX = ✅** — RPC has no mempool visibility (safe for bundles)
- **Status = working** — RPC responded to tests

### Full workflow example

```bash
# 1. SEARCH — Find RPCs from PancakeSwap
node scripts/intercept-evm-rpcs.js base 8453

# 2. COLLECT — Create input.md from discovery
cat > input.md << 'EOF'
| Name | URL | Auth | Origin |
|------|-----|------|--------|
| QuickNode 1 | https://warmhearted...quiknode.pro/... | - | - |
| PublicNode | https://base.publicnode.com | - | - |
EOF

# 3. TEST — Run analysis
./bin/crypto-rpc test -i input.md -o results.md

# 4. COMMIT — Save results
cp results.md networks/evm/base/tested.md
git add networks/evm/base/tested.md && git commit -m "test(base): add new RPCs from PancakeSwap"
```

### Alternative: Node.js test script

```bash
# For EVM chains — does same tests, outputs JSON
node scripts/test-evm-full.js base
```

Use this when you want raw JSON output instead of markdown tables.

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
| **Gnosis** | — | `node scripts/intercept-evm-rpcs.js gnosis 100` |

**Gnosis tested:** [networks/evm/gnosis/tested.md](networks/evm/gnosis/tested.md)  
Top picks: `rpc.ankr.com/gnosis` (34ms), `gnosis.drpc.org` (59ms), `gnosis-rpc.publicnode.com` (120ms).

---

## Light Chain RPC Nodes (No Staking)

Deploy local RPC nodes on server (16GB RAM, 4 cores, 389GB free, 16GB swap). No staking required — just RPC.

### Chains with Public Mempool (MEV-capable)

| Chain | Min RAM | Min Disk | Client | Mempool | MEV Volume |
|-------|---------|----------|--------|---------|------------|
| **Ethereum** | 16GB | ~224GB | reth `--minimal` | ✅ 171K pending | Very high |
| **Berachain** | 16GB | ~140GB | reth + beacond | ✅ 46 pending | Growing |
| **Gnosis** | 4GB | ~30GB | Erigon | ✅ 16 pending | Very low |

### Chains WITHOUT Public Mempool (No sandwich MEV)

| Chain | Min RAM | Min Disk | Client | Why no mempool |
|-------|---------|----------|--------|----------------|
| **Base** | 8-16GB | ~100GB | op-reth | OP Stack centralized sequencer |
| **Optimism** | 8-16GB | ~100GB | op-reth | OP Stack centralized sequencer |
| **Mantle** | 8-16GB | ~100GB | op-reth | OP Stack centralized sequencer |
| **Blast** | 8-16GB | ~100GB | op-geth | OP Stack centralized sequencer |
| **Polygon PoS** | 8GB | ~100GB | bor snap | Bor + Heimdall, no public txpool |
| **BSC** | 4-8GB | ~3TB+ | geth | Too heavy, no pruned option |
| **Arbitrum** | 8-16GB | ~200GB | nitro | Sequencer-based |

### Notes

- **Only 3 chains have public mempools**: Ethereum, Berachain, Gnosis
- **OP Stack chains (Base, Optimism, Mantle, Blast) have NO public mempool** — centralized sequencer picks txs directly
- **BSC** needs 3TB+ even pruned — won't fit on 492GB disk
- **Gnosis** is lightest (30GB) but very low MEV volume
- **Ethereum** is best for MEV: 171K pending txs, most liquid
- Server disk left: 389GB — fits Ethereum (224GB) + Gnosis (30GB) easily
