# crypto-rpc

Discover and test cryptocurrency RPC endpoints.

## Chains with Mempool (NOT Safe for Bundles)

These chains have visible mempool - your transactions are visible to MEV bots:

| Chain | RPC Provider | RPS | URL |
| ----- | ----------- | --- | ----- |
| Ethereum | DRPC | 594 | https://eth.drpc.org |
| Ethereum | PublicNode | 45 | https://ethereum-rpc.publicnode.com |
| Ethereum | 1rpc.io | 51 | https://1rpc.io/eth |
| BNB Chain | DRPC | 400 | https://bsc.drpc.org |
| BNB Chain | PublicNode | 51 | https://bsc-rpc.publicnode.com |
| BNB Chain | Binance | 28 | https://bsc-dataseed.binance.org |
| Avalanche | DRPC | 430 | https://avalanche.drpc.org |
| Avalanche | PublicNode | 103 | https://avalanche-c-chain-rpc.publicnode.com |
| Fantom | 1rpc.io | 15 | https://1rpc.io/ftm |
| Fantom | Fantom | 10 | https://rpc.fantom.network |
| Optimism | PublicNode | 99 | https://optimism-rpc.publicnode.com |
| Base | DRPC | 175 | https://base.drpc.org |
| Base | PublicNode | 45 | https://base-rpc.publicnode.com |
| Ethereum Classic | Etc | 22 | https://etc.etcdesktop.com |
| RSK | RSK | 23 | https://public-node.rsk.co |
| Syscoin | Syscoin | 19 | https://rpc.syscoin.org |
| Taiko | Taiko | 65 | https://rpc.taiko.xyz |

## Installation

```bash
go build -o bin/crypto-rpc ./cmd/crypto-rpc
```

## Usage

### Discover RPCs

```bash
crypto-rpc discover --chain bnb --output networks/evm/bnb-new.md
```

### Test RPCs

```bash
crypto-rpc test --input networks/evm/bnb-new.md --output networks/evm/bnb-tested.md
```

### Generate Report

```bash
crypto-rpc report --input networks/ --output NETWORKS.md
```

## Requirements

- Go 1.21+
- [subfinder](https://github.com/projectdiscovery/subfinder)
- [httpx](https://github.com/projectdiscovery/httpx)

## Output Format

Markdown tables with columns:

| Name | URL | Auth Header | RPS | TPS | Mempool | Status |
|------|-----|-------------|-----|-----|---------|--------|

### Status Values

- `working` - RPC responds correctly
- `needs-key` - Requires API key
- `rate-limited` - Rate limited during testing
- `dead` - No response
- `untested` - Not yet tested

## Auth Headers

Specify auth headers inline in markdown:

- `-` = no auth needed
- `` `Origin: https://foo.com` `` = simple header
- `` `Authorization: Bearer <key>` `` = requires API key
