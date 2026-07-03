# Tested RPCs

*Last Updated: 2026-07-03*

## Mempool: ✅ YES (171K pending, 7.8K queued — tested 2026-07-03)

Ethereum L1 has the most liquid public mempool. Best chain for sandwich MEV.

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Status |
| ---- | --- | ----------- | ---: | --: | ------- | ------- | ------ |
| Kukus | https://eth-mainnet.public.blastapi.io | - | 298 | 32 | no | **yes** | working |
| DRPC | https://eth.drpc.org | - | 180 | - | yes | no | working |
| Flashbots | https://rpc.flashbots.net | - | 163 | 53 | no | **yes** | working |
| PublicNode | https://ethereum-rpc.publicnode.com | - | 158 | 66 | yes | no | working |
| 1rpc.io/eth | https://1rpc.io/eth | - | 138 | 37 | yes | no | working |
| Cloudflare | https://cloudflare-eth.com | - | 108 | - | no | **yes** | working |
| OnFinality | https://eth.api.onfinality.io/public | - | 104 | - | no | **yes** | working |
| BloXroute | https://eth.rpc.blxrbdn.com | - | 88 | - | no | **yes** | working |
| LLamaRPC | https://eth.llamarpc.com | - | 67 | - | no | **yes** | working |
| Rei | https://rpc.rei.network | - | 39 | 20 | no | **yes** | working |
| Alchemy | https://eth-mainnet.g.alchemy.com/v2/demo | - | - | - | no | **yes** | needs-key |
| Infura | https://mainnet.infura.io/v3/ | Bearer *** | - | - | no | **yes** | needs-key |
| QuickNode | https://*.quiknode.pro/ | - | - | - | no | **yes** | needs-key |
| NodeReal | https://eth-mainnet.nodereal.io/v1/ | Bearer *** | - | - | no | **yes** | needs-key |

## WebSocket Endpoints

| Name | URL | Subscribe (pending txs) | RPS |
|------|-----|:-----------------------:|----:|
| dRPC | wss://eth.drpc.org | ✅ | **128** |
| PublicNode | wss://ethereum-rpc.publicnode.com | ✅ | 14 |
| Alchemy | wss://eth-mainnet.g.alchemy.com/v2/<KEY> | ✅ | — (needs-key) |
| Infura | wss://mainnet.infura.io/ws/v3/<KEY> | ✅ | — (needs-key) |

## Notes

- dRPC WSS is best: 128 RPS with eth_subscribe for pending txs
- PublicNode WSS works but low RPS (14)
- 1rpc blocks WSS connections
- txpool_status: pending=0x19e77 (171,159), queued=0x1e75 (7,797)
- Local reth --minimal: 224GB disk, zero relay fees for bundle submission
