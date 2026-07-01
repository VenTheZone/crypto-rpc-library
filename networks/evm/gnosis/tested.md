# Gnosis Chain (xDai) — RPC Endpoints

Chain ID: 100  
RPC: EVM (geth-compatible)  
Native token: xDai  

## Tested Endpoints

| Name | URL | Latency | Status |
|------|-----|---------|--------|
| Ankr | https://rpc.ankr.com/gnosis | **34ms** | ✅ working |
| dRPC | https://gnosis.drpc.org | **59ms** | ✅ working |
| PublicNode | https://gnosis-rpc.publicnode.com | **120ms** | ✅ working |
| Official Gateway | https://rpc.gnosischain.com | **358ms** | ✅ working |
| 1rpc.io | https://1rpc.io/gnosis | **427ms** | ✅ working |
| Tenderly | https://gnosis.gateway.tenderly.co | **346ms** | ✅ working |
| LlamaRPC | https://gnosis.llamarpc.com | ❌ | timeout |
| PublicNode (old) | https://gnosis-mainnet.publicnode.com | ❌ | 404 |
| xDai legacy | https://rpc.xdaichain.com | ❌ | timeout |

## Top Picks

- **Ankr** — 34ms, fastest from this server (GCP us-west1)
- **dRPC** — 59ms, mempool support possible
- **PublicNode** — 120ms, stable

## Notes

- Ankr is closest (34ms), likely same GCP region
- No local node needed at these latencies for mempool work
- Gnosis block time ~5s
