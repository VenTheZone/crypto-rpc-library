# crypto-rpc-library

Discover and test RPC endpoints across EVM chains.

## Quick Start

```bash
# Install dependency
pip install aiohttp

# Scan a chain (discovers from DEX JS bundles + known RPCs, tests RPS/latency/origin)
python3 scripts/scan-rpcs.py ethereum 50

# All chains
for chain in ethereum base arbitrum polygon optimism bsc avalanche; do
  python3 scripts/scan-rpcs.py "$chain" 50
done
```

## What It Does

1. **Discovers** RPCs from DEX frontend JS bundles (Uniswap, Sushi, PancakeSwap, etc.)
2. **Merges** known public RPCs per chain (drpc, PublicNode, Ankr, etc.)
3. **Validates** chain ID (filters cross-chain junk)
4. **Tests** RPS, latency, origin header requirements
5. **Organizes** into `working.md` / `dead.md` per chain, sorted by RPS

## Output

Per chain: `networks/evm/<chain>/working.md` and `dead.md`

```
| # | Source | RPC URL | Latency | RPS | Origin | Method |
|---|--------|---------|---------|-----|--------|--------|
| 1 | drpc | https://eth.drpc.org | 54ms | 62.9 | yes | js-bundle |
| 2 | PublicNode | https://ethereum-rpc.publicnode.com | 110ms | 10.1 | yes | js-bundle |
```

## Chains Supported

| Chain | Chain ID | Best RPC | RPS |
|-------|----------|----------|-----|
| Ethereum | 1 | drpc.org | 62.9 |
| Base | 8453 | drpc.org | 53.5 |
| Arbitrum | 42161 | Radiant | 388.8 |
| Polygon | 137 | drpc.org | 59.7 |
| Optimism | 10 | drpc.org | 10.7 |
| BSC | 56 | Chainstack | 13.8 |
| Avalanche | 43114 | drpc.org | 56.4 |

## Project Structure

```
crypto-rpc-library/
├── scripts/
│   ├── scan-rpcs.py      # Main scanner (discovery + test)
│   └── monitor-rpcs.py   # RPC monitoring
└── networks/
    └── evm/
        ├── ethereum/
        │   ├── working.md
        │   └── dead.md
        ├── base/
        ├── arbitrum/
        └── ...
```

## How Discovery Works

1. Fetches HTML from DEX frontends (36 DEXs per chain)
2. Extracts `<script src="...">` URLs
3. Fetches JS bundles, greps for RPC-like URLs
4. Filters: must start with `http`, exclude images/pages, require RPC keywords
5. Adds known public RPCs per chain
6. Tests each with `eth_chainId` to verify chain match
7. Measures RPS (5 sequential requests) and latency
8. Tests origin header requirement

## Mempool Access

| Chain | Public Mempool | Pending TXs | Notes |
|-------|---------------|-------------|-------|
| Ethereum | Yes | ~55K | Best for sandwich MEV |
| BSC | Yes | ~6K | PancakeSwap dominant |
| Polygon | Yes | ~65K | High throughput |
| Avalanche | Yes | ~36 | Low latency |
| Base/Arbitrum/Optimism | No | — | Sequencer-based L2 |

## API Keys Found

| Chain | Source | Provider | Key |
|-------|--------|----------|-----|
| Ethereum | Bancor | Infura | [REDACTED] |
| Arbitrum | Radiant | Custom | URL-embedded |

## Usage

```bash
# Full scan, all chains
for chain in ethereum base arbitrum polygon optimism bsc avalanche; do
  python3 scripts/scan-rpcs.py "$chain" 50
done

# Single chain, more RPCs
python3 scripts/scan-rpcs.py ethereum 100

# Quick test
python3 scripts/scan-rpcs.py base 10
```
