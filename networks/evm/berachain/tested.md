# Tested RPCs

*Last Updated: 2026-07-03*

## Mempool: ✅ YES (46 pending, 131 queued — tested 2026-07-03)

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Status |
| ---- | --- | ----------- | ---: | --: | ------- | ------- | ------ |
| dRPC | https://berachain.drpc.org | - | 149 | 5 | yes | no | working |
| Berachain Official | https://rpc.berachain.com | - | 101 | 5 | yes | no | working |
| Thirdweb | https://bera.rpc.thirdweb.com | - | 65 | - | no | **yes** | working |
| Kodiak | https://rpc.kodiak.finance | - | 25 | - | no | **yes** | slow |
| PublicNode | https://berachain-evm-rpc.publicnode.com | - | - | - | no | **yes** | dead |

## Node Requirements

- Client: reth + beacond (consensus)
- Disk: ~140GB pruned (reth ~50GB snapshot + beacond)
- RAM: 16GB+
- Official reth support: ✅
- DEXs: BEX (Balancer V2), Kodiak (Uni V2+V3)
- Flashloans: BeraBorrow (Bend fork)

## Notes

- txpool_status: pending=0x2e (46), queued=0x83 (131)
- Low mempool activity but growing DeFi ecosystem
- Low competition for MEV compared to ETH
