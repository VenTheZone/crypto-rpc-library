# Gnosis Chain (xDai) — RPC Endpoints

Chain ID: 100  
RPC: EVM (geth-compatible)  
Native token: xDai  
Block time: ~5s

## Mempool: ✅ YES (16 pending, 547 queued — tested 2026-07-03)

Gnosis has a public mempool but very low activity (16 pending txs).
Lowest disk requirement: ~30GB pruned (Erigon), ~50GB full.

## Tested Endpoints

| Name | URL | Latency | Mempool | Status |
|------|-----|---------|:-------:|--------|
| Ankr | https://rpc.ankr.com/gnosis | **34ms** | ❓ | ✅ working |
| dRPC | https://gnosis.drpc.org | **59ms** | ❓ | ✅ working |
| PublicNode | https://gnosis-rpc.publicnode.com | **120ms** | ✅ | ✅ working |
| Official Gateway | https://rpc.gnosischain.com | **358ms** | ❓ | ✅ working |
| 1rpc.io | https://1rpc.io/gnosis | **427ms** | ❓ | ✅ working |
| Tenderly | https://gnosis.gateway.tenderly.co | **346ms** | ❓ | ✅ working |
| LlamaRPC | https://gnosis.llamarpc.com | ❌ | - | timeout |
| PublicNode (old) | https://gnosis-mainnet.publicnode.com | ❌ | - | 404 |

## Node Requirements

- Client: Erigon (primary), also Geth, Nethermind
- Disk: ~30GB pruned (Erigon), ~50GB full
- RAM: 4GB+ (lightest chain)
- Reth: Third-party (gnosis-reth exists, not official)

## Top Picks

- **Ankr** — 34ms, fastest from this server
- **dRPC** — 59ms, mempool support possible
- **PublicNode** — 120ms, confirmed mempool access via txpool_status

## Notes

- txpool_status: pending=16, queued=547
- Very low MEV volume — good for testing, not production
- Fits easily on minimal hardware (4GB RAM, 30GB disk)
- Tested 2026-07-03: PublicNode txpool_status returns real data
