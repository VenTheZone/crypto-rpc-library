# crypto-rpc

CLI tool to discover and test cryptocurrency RPC endpoints from DEX frontends.

## Quick Start

```bash
# Build
go build -o bin/crypto-rpc ./cmd/crypto-rpc

# Discover RPCs from DEX frontends
./bin/crypto-rpc discover-dex solana   # Solana DEXs
./bin/crypto-rpc discover-dex evm     # EVM DEXs

# Test RPCs
./bin/crypto-rpc test -i input.md -o output.md
```

## Documentation

See [docs/INDEX.md](docs/INDEX.md) for full documentation.

### Quick Links
- [RPC Summary](docs/reference/rpc-summary.md) - Best RPCs by chain
- [DEX Findings](docs/reference/findings.md) - RPCs from DEX frontends
- [Discovery Guide](docs/guides/rpc-discovery.md) - How to discover RPCs

## Features

- **Automated Discovery**: Scan DEX websites and extract RPC endpoints from frontend code
- **Performance Testing**: Measure RPS (requests per second) and TPS (transactions per second)
- **Security Checks**: Detect mempool visibility (safe for bundles vs not)
- **Multi-chain**: Support for Solana and EVM chains
- **Origin Header Support**: Specify custom Origin headers for RPCs that require it (e.g., Helius Jupiter)
