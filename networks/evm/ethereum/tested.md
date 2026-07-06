# Ethereum — Tested RPC Endpoints

> **Last tested:** 2026-07-06

## Mempool Status

| Chain | Mempool | Pending | RPC |
|-------|---------|---------|-----|
| **Ethereum** | ✅ yes | 55,029 | PublicNode |

## Working Endpoints

| Name | URL | Origin | Auth | RPS | Latency | Mempool |
|------|-----|--------|------|-----|---------|---------|
| PublicNode | `https://ethereum.publicnode.com` | - | - | 6.7 | 151ms | ✅ 55K pending |
| Nodesmith | `https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc` | - | - | 48.2 | 47ms | ❌ |
| Ankr | `https://rpc.ankr.com/eth` | - | - | 18.0 | 75ms | ❌ |
| Alchemy | `https://eth-mainnet.g.alchemy.com/v2/iSJh-3-MlrW4nPlMH6AnpLkLKujMmqE3` | - | API key | 16.2 | 86ms | ❌ |
| dRPC (Sushi key) | `https://lb.drpc.live/ogrpc?network=ethereum&dkey=Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh` | - | API key | 9.0 | 94ms | ❌ |
| WalletConnect | `https://rpc.walletconnect.org/v1/json-rpc` | - | - | 1.1 | 766ms | ❌ |

## Discovered API Keys

| Provider | Key | Source | Status |
|----------|-----|--------|--------|
| Alchemy | `iSJh-3-MlrW4nPlMH6AnpLkLKujMmqE3` | CowSwap | Needs Origin whitelist (useless for mempool) |
| dRPC | `Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh` | Sushi | No mempool |

## Notes

- **Mempool**: Only PublicNode exposes `txpool_content` (~55K pending)
- **Alchemy key**: From CowSwap discovery, needs Origin whitelist — cannot use for mempool
- **dRPC key**: From Sushi discovery, no mempool access on Ethereum
- **No Origin headers** required for any public RPC
- **Best for sandwich**: PublicNode (only mempool source)
- **Best RPS**: Nodesmith (48.2 RPS, no mempool)
