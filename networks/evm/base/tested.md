# Base — RPC Endpoints

Chain ID: 8453
RPC: EVM (OP Stack)
Native token: ETH
Block time: ~2s

## Mempool: ❌ NONE (Centralized Sequencer)

Base is an OP Stack chain with a centralized sequencer (Coinbase).
**No public mempool.** txpool_status returns 0 pending, 0 queued.
No sandwich MEV possible via mempool monitoring.
Sequencer picks transactions directly — no decentralized tx pool.

## HTTP Endpoints

| Name | URL | Latency | Mempool | WSS |
|------|-----|---------|:-------:|:---:|
| dRPC | https://base.drpc.org | **75ms** | ❌ | ❌ Rate limited |
| PublicNode | https://base-rpc.publicnode.com | 161ms | ❌ | ✅ wss://ethereum-rpc.publicnode.com |
| Mainnet Base | https://mainnet.base.org | 307ms | ❌ | ❌ |
| 1RPC | https://1rpc.io/base | 298ms | ❌ | ❌ |

## WebSocket Endpoints

| Name | URL | Subscribe (pending txs) | RPS |
|------|-----|:-----------------------:|----:|
| dRPC | wss://base.drpc.org | ❌ Rate limited | — |
| PublicNode | wss://ethereum-rpc.publicnode.com | ✅ | 14 |

## Failed / Rate-Limited

- rpc.ankr.com/base — needs auth

## Notes

- OP Stack = centralized sequencer = NO public mempool
- WSS subscribe works on PublicNode but RPS is low (14)
- dRPC blocks WSS under load
- Tested 2026-07-03: txpool_content returns pending:{}, queued:{} on all RPCs
