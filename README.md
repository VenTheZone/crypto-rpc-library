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

See [DOCS.md](DOCS.md) for full documentation.

## Features

- **Automated Discovery**: Scan DEX websites and extract RPC endpoints from frontend code
- **Performance Testing**: Measure RPS (requests per second) and TPS (transactions per second)
- **Security Checks**: Detect mempool visibility (safe for bundles vs not)
- **Multi-chain**: Support for Solana and EVM chains
