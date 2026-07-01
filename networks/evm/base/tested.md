# Base — RPC Endpoints

Chain ID: 8453
RPC: EVM (OP Stack)
Native token: ETH
Block time: ~2s

## Working Endpoints

| Name | URL | Latency | Mempool |
|------|-----|---------|:-------:|
| dRPC | https://base.drpc.org | **75ms** | ✅ |
| PublicNode | https://base-rpc.publicnode.com | 161ms | ✅ |
| Mainnet Base | https://mainnet.base.org | 307ms | ❌ |
| 1RPC | https://1rpc.io/base | 298ms | ❌ |

## Failed / Rate-Limited

- rpc.ankr.com/base — needs auth

## Notes

Base dRPC has mempool access (75ms best latency). Good for MEV.
PublicNode also exposes mempool (161ms).
Publicnode needs origin spoofing for some methods.
