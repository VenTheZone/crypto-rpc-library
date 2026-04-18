# Avalanche C-Chain RPCs — Tested 2026-04-18

> Chain ID: 43114

## Working RPCs

### MEV-Safe (Recommended)

| Name | URL | RPS | Latency | Mempool | Safe |
|------|-----|----:|--------:|:-------:|:----:|
| **Avalanche Official** | `https://api.avax.network/ext/bc/C/rpc` | 49 | 203ms | no | ✅ |
| **1rpc.io** | `https://1rpc.io/avax/c` | 35 | 220ms | no | ✅ |

### Mempool Exposed

| Name | URL | RPS | Latency | Mempool | Pending/Queued | Safe |
|------|-----|----:|--------:|:-------:|---------------:|:----:|
| DRPC | `https://avalanche.drpc.org` | 91 | 110ms | yes | 9/9 | ❌ |
| PublicNode | `https://avalanche-evm.publicnode.com` | 53 | 183ms | yes | 0/0 | ❌ |

## Failed RPCs

| Name | URL | Error |
|------|-----|-------|
| Avalanche Public | `https://avalanche.public-rpc.com` | 403 Forbidden |
| Ankr | `https://rpc.ankr.com/avalanche` | Connection error |
| BlastAPI | `https://avalanche-mainnet.blastapi.io` | DNS error (ENOTFOUND) |
| Infura | `https://avalanche-mainnet.infura.io/...` | 401 Unauthorized |
| LlamaRPC | `https://avalanche.llamarpc.com` | DNS error (ENOTFOUND) |

## Quick Pick

| Need | RPC | RPS | Safe? |
|------|-----|----:|-------|
| **Recommended** | Avalanche Official | 49 | ✅ |
| **Fastest** | DRPC | 91 | ❌ (mempool exposed) |
| **Alternative safe** | 1rpc.io | 35 | ✅ |
| Free + Fast | PublicNode | 53 | ❌ |

## Security Analysis

### MEV-Safe RPCs
Both safe options hide the mempool (return -32601 for `txpool_content`):

- **Avalanche Official**: 49 RPS, reliable, official infrastructure
- **1rpc.io**: 35 RPS, privacy-focused provider

### Mempool Exposed
| Provider | Notes |
|----------|-------|
| **DRPC** | Fast (91 RPS, 110ms) but shows 9 pending + 9 queued |
| **PublicNode** | Empty pool currently but method exists |

## Test Script

```bash
# Run the test suite
cd networks/evm/avalanche
node test-rpcs.js

# Quick mempool check
curl -X POST https://api.avax.network/ext/bc/C/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'
# Returns: {"jsonrpc":"2.0","id":1,"error":{"code":-32601,...}}
# -32601 = method not found = safe
```

## How to Use

### For MEV Protection
```javascript
const SAFE_RPC = 'https://api.avax.network/ext/bc/C/rpc';
```

### For Speed (accept mempool exposure)
```javascript
const FAST_RPC = 'https://avalanche.drpc.org';
```

## Comparison with Other Chains

| Chain | Working | MEV-Safe | Best Safe RPS |
|-------|---------|----------|---------------|
| **Base** | 17 | 3 | 111 (Tenderly) |
| **Berachain** | 2 | 0 | N/A |
| **Avalanche** | 4 | 2 | 49 (Official) |

Avalanche has fewer public RPCs than Base, but better MEV-safety than Berachain. Both working safe options are reliable.
