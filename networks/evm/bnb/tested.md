# BNB Chain RPCs

> **Note:**
> - **RPS** = Requests per second YOU can send
> - **TPS** = Transactions per second (block-based measurement)
> - **Realistic TX/sec** = ~RPS ÷ 2 for simple sends, ~RPS ÷ 5 for bundle TX
> - **Mempool** = `yes` = your TX visible to others (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for sending/bundles

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Source | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ | ------ |
| PancakeSwap | https://bscrpc.pancakeswap.finance | - | 27 | 97 | no | **yes** | PancakeSwap DEX | working |
| PancakeSwap Alpha | https://bscrpc-alpha.pancakeswap.finance | - | 28 | 68 | no | **yes** | PancakeSwap DEX | working |
| PublicNode | https://bsc-rpc.publicnode.com | - | 51 | 88 | yes | no | PublicNode | working |
| Binance | https://bsc-dataseed.binance.org | - | 28 | 119 | yes | no | Binance Official | working |
| 1rpc.io/bnb | https://1rpc.io/bnb | - | 31 | 86 | yes | no | 1rpc.io | working |
| Ankr | https://rpc.ankr.com/bsc | `Authorization: Bearer <key>` | - | - | no | **yes** | Ankr Provider | needs-key |

## For Bundle/Sandwich TX on BNB

**Safe RPCs (no mempool):**
- PancakeSwap (27 RPS, 97 TPS)
- Ankr (requires API key)

**Avoid for bundles:**
- 1rpc.io, Binance, PublicNode (all have mempool = TX visible)

## Recommended Setup

```
Bundle TX → PancakeSwap RPC (no mempool)
MEV detection → 1rpc.io or Binance (has mempool)
```
