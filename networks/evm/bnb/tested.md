# Tested RPCs

*Last Updated: 2026-07-03*

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ |
| 1rpc.io/bnb | https://1rpc.io/bnb | - | 144 | 253 | **yes** | no | working |
| Ankr | https://rpc.ankr.com/bsc | `Authorization: Bearer ***` | 132 | - | no | **yes** | working |
| OnFinality | https://bnb.api.onfinality.io/public | - | 130 | - | no | **yes** | working |
| Binance | https://bsc-dataseed.binance.org | - | 129 | 121 | **yes** | no | working |
| PublicNode | https://bsc-rpc.publicnode.com | - | 123 | 96 | **yes** | no | working |
| PancakeSwap | https://bscrpc.pancakeswap.finance | - | 95 | 125 | no | **yes** | working |
| PancakeSwap Alpha | https://bscrpc-alpha.pancakeswap.finance | - | 87 | 99 | no | **yes** | working |
| LlamaRPC | https://bsc.llamarpc.com | - | 31 | 73 | **yes** | no | working |

## Mempool Status

**✅ YES — Public mempool confirmed (tested 2026-07-03)**
- Pending: 40 | Queued: 3,707
- Method: `txpool_status`
- Client: Geth (BSC fork)
- Multiple RPCs expose mempool

## Node Requirements

- Client: Geth (BSC fork) — bnb-chain/bsc
- **Minimum storage: 3 TB+** (Geth snap sync, pruned)
- RAM: 16 GB minimum
- No reth client exists for BSC
- ⚠️ Does NOT fit on 492GB disk

## Notes

BSC has high throughput (128 blocks/day). Geth snap sync requires ~3TB even in pruned mode. The mempool has large queued backlog (3,707) due to high chain activity.
