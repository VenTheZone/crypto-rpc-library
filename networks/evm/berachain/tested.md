# Berachain Mainnet RPCs — Tested 2026-04-17

> Chain ID: 80094

## Working RPCs

| Name | URL | RPS | TPS | Mempool | Safe TX | Notes |
|------|-----|----:|----:|:-------:|:-------:|-------|
| Berachain Official | `https://rpc.berachain.com` | 93 | 1 | yes | ❌ | Public RPC with mempool exposure |
| Kodiak | `https://rpc.kodiak.finance` | — | — | no | ✅ | No mempool = MEV safe; needs RPS/TPS re-test |

## Failed RPCs

| Name | URL | Status | Error |
|------|-----|--------|-------|
| PublicNode | `https://berachain-evm-rpc.publicnode.com` | ❌ | 404 Not Found |
| Thirdweb | `https://bera.rpc.thirdweb.com` | ❌ | Invalid chain |

## Discovery Sources

- Uniswap frontend: `app.uniswap.org`
- Sushi frontend: `www.sushi.com/swap`
- Kodiak frontend: `app.kodiak.finance`

## Key Findings

### Kodiak RPC
- **Safe for bundles**: No mempool access (`txpool_content` returns -32601)
- **Performance**: Needs RPS/TPS re-test (rate limiting encountered during testing)
- **Origin**: Not required
- **Use case**: Safe for MEV bundle submission

### Official RPC
- **Performance**: 93 RPS, 1 TPS
- **Mempool**: Exposed (can see pending transactions)
- **Use case**: General queries, not safe for time-sensitive transactions

## Testing Details

```bash
# Chain ID verification
curl -X POST https://rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# Expected: {"result":"0x1389e"} (80094)

# Mempool check
curl -X POST https://rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}'
# Returns pending/queued = mempool exposed
# Returns -32601 = no mempool (safe)
```

## API Keys Found

None required for tested RPCs.

## Todo

- [ ] Re-test Kodiak RPS/TPS with rate limit handling
- [ ] Test additional Berachain DEXs (BeraSwap, HoneySwap)
- [ ] Check GraphQL endpoints from Goldsky
