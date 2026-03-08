# Crypto RPC Library - Documentation

> CLI tool to discover and test cryptocurrency RPC endpoints from DEX frontends.

## Documentation Structure

```
docs/
├── INDEX.md              # This file - documentation index
├── guides/
│   └── rpc-discovery.md  # How to discover RPCs from DEX frontends
├── reference/
│   ├── rpc-summary.md    # Best RPCs by chain (quick reference)
│   ├── findings.md       # DEX-recovered RPCs and leaked keys
│   └── new-l2-rpcs.md    # New L2 chains tested results
└── plans/                # Design and implementation plans
```

---

## Quick Links

### Reference Docs
- [RPC Summary](reference/rpc-summary.md) - Best performing RPCs per chain
- [DEX Findings](reference/findings.md) - RPCs extracted from DEX frontends
- [New L2 Chains](reference/new-l2-rpcs.md) - Blast, Scroll, zkSync, Linea, Mantle, etc.

### Guides
- [RPC Discovery Method](guides/rpc-discovery.md) - How to discover RPCs from DEX frontends

### Chain Test Results

#### EVM Chains
| Chain | Results |
|-------|---------|
| [Ethereum](../networks/evm/ethereum/tested.md) | Mainnet RPCs |
| [BNB Chain](../networks/evm/bnb/tested.md) | BSC RPCs |
| [Polygon](../networks/evm/polygon/tested.md) | MATIC RPCs |
| [Arbitrum](../networks/evm/arbitrum/tested.md) | ARB RPCs |
| [Optimism](../networks/evm/optimism/tested.md) | OP RPCs |
| [Base](../networks/evm/base/tested.md) | Base RPCs |
| [Avalanche](../networks/avalanche/tested.md) | AVAX RPCs |
| [Fantom](../networks/evm/fantom/tested.md) | FTM RPCs |
| [zkSync Era](../networks/evm/zksync/tested.md) | zkSync RPCs |
| [Linea](../networks/evm/linea/tested.md) | Linea RPCs |
| [Mantle](../networks/evm/mantle/tested.md) | MNT RPCs |
| [Scroll](../networks/evm/scroll/tested.md) | Scroll RPCs |
| [Celo](../networks/evm/celo/tested.md) | CELO RPCs |
| [EVM DEXs](../networks/evm/dex/tested.md) | Cross-chain DEX RPCs |

#### Solana
| Category | Results |
|----------|---------|
| [Solana RPCs](../networks/solana/tested.md) | Mainnet RPCs |
| [Solana DEXs](../networks/solana/dex/tested.md) | DEX-specific RPCs |

---

## Usage

### Discover RPCs from DEX Frontends
```bash
# Discover Solana DEXs
./bin/crypto-rpc discover-dex solana

# Discover EVM DEXs
./bin/crypto-rpc discover-dex evm
```

### Test RPCs
```bash
./bin/crypto-rpc test -i <input.md> -o <output.md>
```

### Input File Format

RPC test input files are markdown tables with the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| Name | Yes | RPC name/identifier |
| URL | Yes | RPC endpoint URL |
| Auth | No | Authentication header (e.g., `Bearer xxx`) |
| Origin | No | Custom Origin header (e.g., `https://jup.ag`) |

Example:
```markdown
| Name | URL | Auth | Origin |
| ---- | --- | ---- | ------ |
| Helius Jupiter | https://rpc.helius.xyz/?api-key=XXX | - | https://jup.ag |
```

> **Note:** Some RPC providers (like Helius) require specific Origin headers to work correctly. Use the Origin column to specify the expected origin domain.

---

## Best RPCs by Category

### Highest RPS (Free)
| Chain | RPC | RPS |
|-------|-----|-----|
| BNB | Ankr | 1196 |
| Base | Ankr | 700+ |
| Optimism | Ankr | 637 |
| Linea | Blast | 583 |

### Safe TX (No Mempool)
- Solana: All (no mempool)
- Ankr, Blast, BlockPi: All chains
- Ethereum: Blast, Cloudflare

### DEX RPCs Found
- Raydium: rpcpool.com (131 RPS)
- Meteora: rpcpool.com (147 RPS)
- Pump.fun: Helius (71 RPS)
- Apeswap: Ankr (420 RPS)

---

## Data Files

Raw discovery data (JSON) is stored in the `data/` directory:

```
data/
├── evm/
│   ├── base-discovered.json
│   ├── berachain-discovered.json
│   └── ...
└── solana/
    └── solana-discovered.json
```
