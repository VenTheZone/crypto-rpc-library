# Base RPCs

> **Note:**
> - **RPS** = Requests per second YOU can send
> - **TPS** = Network transactions per second
> - **Mempool** = `yes` = your TX visible (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for sending

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Source | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ | ------ |
| Blast | https://base.drpc.org | - | 175 | 88 | yes | no | DRPC | working |
| Ankr | https://rpc.ankr.com/base | `Authorization: Bearer <key>` | - | - | no | **yes** | Ankr Provider | needs-key |
| 1rpc.io/base | https://1rpc.io/base | - | 45 | 136 | no | **yes** | 1rpc.io | working |
| PublicNode | https://base-rpc.publicnode.com | - | 45 | 76 | yes | no | PublicNode | working |
| Base Official | https://mainnet.base.org | - | 31 | 125 | no | **yes** | Base Official | working |

## For Safe TX on Base

**Safe (no mempool):**
- 1rpc.io/base (45 RPS, 136 TPS)
- Base Official (31 RPS, 125 TPS)
- Ankr (requires API key)

**For MEV detection:**
- Blast, PublicNode (have mempool)
