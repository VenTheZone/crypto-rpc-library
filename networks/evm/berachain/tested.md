# Berachain Mainnet RPCs — Tested 2026-04-17

> Chain ID: 80094

## Working RPCs

| Name | URL | RPS | TPS | Tx/Block | Mempool | Safe TX | Origin | Status |
|------|-----|----:|----:|---------:|:-------:|:-------:|--------|--------|
| Berachain Official | https://rpc.berachain.com | 89 | 8 | 8 | yes (3/51) | ❌ | - | working |
| Kodiak | https://rpc.kodiak.finance | - | 10 | 10 | yes (3/50) | ❌ | - | working |
| dRPC | https://berachain.drpc.org | - | - | 8 | yes (8/78) | ❌ | - | working |
| Ankr | https://rpc.ankr.com/berachain | - | - | - | unknown | ❓ | - | needs-key |

## Failed RPCs

| Name | URL | Status | Error |
|------|-----|--------|-------|
| PublicNode | https://berachain-evm-rpc.publicnode.com | ❌ | 404 Not Found |
| Thirdweb | https://bera.rpc.thirdweb.com | ❌ | 429 Rate Limited |

## Security Findings

⚠️ **No MEV-safe public RPCs found** - all tested endpoints expose the mempool via `txpool_content`:

- **Official RPC**: 3 pending, 51 queued
- **Kodiak**: 3 pending, 50 queued
- **dRPC**: 8 pending, 78 queued

**Ankr** likely safe (follows their pattern) but **requires API key** - could not test without authentication.

### Mempool Status Summary

| Provider | Mempool | Pending | Queued | Safe TX |
|----------|---------|---------|--------|---------|
| Official | Exposed | 3 | 51 | ❌ |
| Kodiak | Exposed | 3 | 50 | ❌ |
| dRPC | Exposed | 8 | 78 | ❌ |
| Ankr | Unknown | - | - | ❓ |

## Performance Summary

### Berachain Official
- **RPS**: 89 (good throughput)
- **TPS**: 8 transactions per block
- **Mempool**: Exposed ⚠️
- **Safe for bundles**: ❌ No
- **Origin required**: No

### Kodiak
- **RPS**: Rate limited (concurrent requests throttled)
- **TPS**: 10 transactions per block
- **Mempool**: Exposed ⚠️
- **Safe for bundles**: ❌ No
- **Origin required**: No

### dRPC
- **Mempool**: Exposed ⚠️
- **Safe for bundles**: ❌ No
- **Origin required**: No

## Safe RPC Options

| Provider | Status | Notes |
|----------|--------|-------|
| **Ankr** | 🔑 Needs API key | Likely MEV-safe (Ankr blocks mempool), requires key |
| **Private node** | ❌ Not public | Run mev-geth with private mempool |
| **Flashbots Protect** | ❌ Not on Berachain | No public endpoint yet |
| **Merkle.io** | 🔑 Needs auth | Private pool service, requires credentials |

## Recommendations

| Use Case | Recommendation |
|----------|---------------|
| General queries | Berachain Official (89 RPS, fastest) |
| Bundle submission | ⚠️ No safe public option - mempool exposed |
| MEV protection | ❌ Not available OR get Ankr API key |

## Discovery Sources

- DEX frontends: Kodiak Finance (`app.kodiak.finance`)
- Discovery file: `networks/evm/berachain-discovered-raw.json`
- Test script: `networks/evm/berachain/test-rpcs.js`

## How to Test

```bash
# Run the test suite
cd networks/evm/berachain
node test-rpcs.js

# Quick mempool check
curl -X POST https://rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'
```

## Chain Info

```bash
# Verify chain ID
curl -X POST https://rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# Returns: 0x1389e (80094)
```
