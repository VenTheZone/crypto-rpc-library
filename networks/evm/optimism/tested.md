# Tested RPCs

*Last Updated: 2026-07-03*

## Mempool: ❌ NONE (Centralized Sequencer)

Optimism is an OP Stack chain with a centralized sequencer.
**No public mempool.** No sandwich MEV possible via mempool monitoring.

| Name | URL | RPS | TPS | Mempool | Safe TX | Status |
| ---- | --- | ---: | ---: | ------- | ------- | ------ |
| Ankr | https://rpc.ankr.com/optimism | 158 | - | ❌ | **yes** | working |
| DRPC | https://optimism.drpc.org | 155 | - | ❌ | **yes** | working |
| PublicNode | https://optimism-rpc.publicnode.com | 128 | 14 | ❌ | **yes** | working |
| Blast | https://optimism-mainnet.public.blastapi.io | 99 | - | ❌ | **yes** | working |
| Optimism | https://mainnet.optimism.io | 90 | 23 | ❌ | **yes** | working |
| Alchemy | https://optimism-mainnet.g.alchemy.com/v2/demo | - | - | ❌ | **yes** | needs-key |
| QuickNode | https://*.quiknode.pro/ | - | - | ❌ | **yes** | needs-key |
| Infura | https://optimism-mainnet.infura.io/v3/ | - | - | ❌ | **yes** | needs-key |

## Notes

- OP Stack = centralized sequencer = NO public mempool
- All RPCs marked "no" for mempool — confirmed 2026-07-03
