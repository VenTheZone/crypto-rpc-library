# Working Solana RPCs

> Generated: 2026-04-11T03:10:44.606Z  
> Working: 13 | Dead: 127

## Top Performers (mainnet only)

| RPC | RPS | TPS | Needs Origin | Source |
|-----|-----|-----|--------------|--------|
| `https://api.mainnet-beta.solana.com` | 345 | 2982 | No | Jupiter |
| `https://alien-newest-vineyard.solana-mainnet.quiknode.pro/...` | 70 | 3103 | No | Jupiter |
| `https://grateful-jerrie-fast-mainnet.helius-rpc.com` | 34 | 3023 | **Jupiter** | Jupiter |

## Additional Working RPCs

| RPC | Needs Origin | Source |
|-----|--------------|--------|
| `https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP` | **Orca** | Orca |
| `https://kora-8cwrc2-fast-mainnet.helius-rpc.com/` | No | Drift |
| `https://rpc.ironforge.network/mainnet?apiKey=01JTPF9HNNCBJ3ZF028K2JA3T3` | No | MarginFi |
| `https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df` | No | Solend |
| `https://lauraine-qytyxk-fast-mainnet.helius-rpc.com` | No | Tensor |
| `https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b` | **Pump.fun** | Pump.fun |
| `https://mainnet.helius-rpc.com/?api-key=26bec238-00c2-4961-ba13-faa7c0a2d767` | No | Discovery |

## Usage

Add Origin header when required:
```bash
curl -X POST 'https://grateful-jerrie-fast-mainnet.helius-rpc.com' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://jup.ag' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth","params":[]}'
```

**Legend:**
- **Bold** origin names = required header
- RPS/TPS tested with 10 concurrent requests
- Additional RPCs health-checked only
