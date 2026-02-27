# Ethereum RPCs

> **Note:**
> - **RPS** = Requests per second YOU can send
> - **TPS** = Network transactions per second (Ethereum ~15 TPS)
> - **Realistic TX/sec** = ~RPS ÷ 2 for simple sends
> - **Mempool** = `yes` = your TX visible to MEV bots (NOT safe)
> - **Safe TX** = `yes` = no mempool = safe for sending

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Source | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ | ------ |
| Ankr | https://rpc.ankr.com/eth | `Authorization: Bearer <key>` | 2107* | - | no | **yes** | Ankr Provider | needs-key |
| DRPC | https://eth.drpc.org | - | 594 | - | yes | no | DRPC | working |
| Blast | https://eth-mainnet.public.blastapi.io | - | 270 | - | no | **yes** | Blast API | working |
| Cloudflare | https://cloudflare-eth.com | - | 113 | - | no | **yes** | Cloudflare | working |
| Rei | https://rpc.rei.network | - | 94 | 20 | no | **yes** | Rei Network | working |
| OnFinality | https://eth.api.onfinality.io/public | - | 64 | 33 | no | **yes** | OnFinality | working |
| Vanry | https://ethereum.publicnode.com | - | 53 | - | yes | no | PublicNode | working |
| 1rpc.io/eth | https://1rpc.io/eth | - | 51 | 87 | yes | no | 1rpc.io | working |
| Tenderly | https://mainnet.gateway.tenderly.co | - | 48 | 22 | no | **yes** | Tenderly | working |
| PublicNode | https://ethereum-rpc.publicnode.com | - | 45 | - | yes | no | PublicNode | working |
| OmniTrade | https://eth-mainnet.public.blastapi.io | - | 35 | - | no | **yes** | Blast API | working |
| Kukus | https://eth-mainnet.public.blastapi.io | - | 39 | 10 | no | **yes** | Blast API | working |
| LLamaRPC | https://eth.llamarpc.com | - | 15 | 21 | no | **yes** | LlamaRPC | working |
| Alchemy | https://eth-mainnet.g.alchemy.com/v2/demo | - | - | - | no | **yes** | Alchemy | rate-limited |
| Infura | https://mainnet.infura.io/v3/ | `Authorization: Bearer <key>` | - | - | no | **yes** | Infura | needs-key |
| QuickNode | https://*.quiknode.pro/ | - | - | - | no | **yes** | QuickNode | needs-key |
| NodeReal | https://eth-mainnet.nodereal.io/v1/ | `Authorization: Bearer <key>` | - | - | no | **yes** | NodeReal | needs-key |
| BlockPi | https://ethereum.blockpi.network/v1/rpc/public | - | - | - | no | **yes** | BlockPi | rate-limited |
| GetBlock | https://eth.getblock.io/ | - | - | - | no | **yes** | GetBlock | rate-limited |
| Pocket | https://eth-rpc.gateway.pokt.network | - | - | - | no | **yes** | Pocket Network | rate-limited |

> *Ankr RPS requires API key. Demo tier is rate-limited.

## For Safe TX on Ethereum

**Best free options (no mempool):**
- Blast (270 RPS)
- Cloudflare (113 RPS)
- Rei (94 RPS)
- OnFinality (64 RPS)

**Avoid for sensitive TX:**
- DRPC, 1rpc.io, PublicNode (have mempool)
