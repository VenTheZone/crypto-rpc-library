# Fantom RPCs

> **Note:**
> - **RPS** = Requests per second YOU can send
> - **TPS** = Network transactions per second
> - **Mempool** = `yes` = your TX visible (NOT safe for bundles)
> - **Safe TX** = `yes` = no mempool = safe for sending

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Source | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ | ------ |
| DRPC | https://fantom.drpc.org | - | 140 | - | no | **yes** | DRPC | working |
| Ankr | https://rpc.ankr.com/fantom | `Authorization: Bearer <key>` | - | - | no | **yes** | Ankr Provider | needs-key |
| 1rpc.io/ftm | https://1rpc.io/ftm | - | 15 | - | yes | no | 1rpc.io | working |
| Fantom RPC2 | https://rpc2.fantom.network | - | 10 | - | yes | no | Fantom Official | working |
| Fantom Official | https://rpc.fantom.network | - | 10 | - | yes | no | Fantom Official | working |

## For Safe TX on Fantom

**Safe (no mempool):**
- DRPC (140 RPS) - Best free option
- Ankr (requires API key)

**Avoid for bundles:**
- 1rpc.io, Fantom Official (have mempool)
