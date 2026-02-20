# crypto-rpc

Discover and test cryptocurrency RPC endpoints.

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
