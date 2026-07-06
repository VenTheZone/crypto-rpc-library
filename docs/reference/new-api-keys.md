# New API Keys Found

> **Date:** 2026-07-06
> **Source:** DEX frontend interception (Uniswap, Sushi, CowSwap)

## QuikNode Keys (Mempool Access ✅)

### Polygon

| Key | Source | Pending | Queued | URL |
|-----|--------|---------|--------|-----|
| `50060fe02eaca407606719d97f4f204f28da43ed` | Sushi | 65,722 | 8,151 | `wss://crimson-wider-silence.quiknode.pro/...` |
| `9d224a0c49ee6cd1b4d88e7a2897a057385e6b40` | Uniswap | 9,178 | 530 | `wss://late-alpha-diagram.matic.quiknode.pro/...` |

### BSC

| Key | Source | Pending | Queued | URL |
|-----|--------|---------|--------|-----|
| `31c09f2ad734e43f4fece25a5db045a9322ce119` | Uniswap | 30 | 714 | `wss://palpable-summer-choice.bsc.quiknode.pro/...` |
| `a0d86563bc5d99e49d7d72ca422da0e761b4e257` | Sushi | 9 | 383 | `wss://quiet-burned-dust.bsc.quiknode.pro/...` |

## QuikNode Keys (No Mempool)

| Chain | Key | Source |
|-------|-----|--------|
| Avalanche | `d5190f99f23c05fab0604cf98fe636e96497565a` | Uniswap |
| Base | `cab818b8d9cfa00a7a07cd42520ae78417394e58` | Uniswap |
| Optimism | `1da322086e67b0922a98f95694761ec8c5c7ce7c` | Uniswap |
| Celo | `7752451997e54dc2fd84f08a768cbe037e2d9cc9` | Uniswap |
| Blast | `7dbc66327a8e5c04361bd9357e33efd62d5e9524` | Uniswap |

## Alchemy Key (Needs Origin Whitelist)

| Key | Source | Status |
|-----|--------|--------|
| `iSJh-3-MlrW4nPlMH6AnpLkLKujMmqE3` | CowSwap | ❌ Origin whitelist required |

## Usage

```bash
# Polygon via Sushi QuikNode (65K pending)
curl -X POST "https://crimson-wider-silence.quiknode.pro/50060fe02eaca407606719d97f4f204f28da43ed" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}' | jq '.result.pending | keys | length'

# BSC via Uniswap QuikNode
curl -X POST "https://palpable-summer-choice.bsc.quiknode.pro/31c09f2ad734e43f4fece25a5db045a9322ce119" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"txpool_content","params":[]}' | jq '.result.pending | keys | length'
```
