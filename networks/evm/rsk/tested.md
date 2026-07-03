# Tested RPCs

*Last Updated: 2026-07-03*

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ |
| RSK | https://public-node.rsk.co | - | 66 | 2 | **yes** | no | working |

## Mempool Status

**✅ YES — Public mempool confirmed (tested 2026-07-03)**
- Pending: 11 | Queued: 0
- Method: `txpool_status`
- Client: rskj (Java implementation)

## Node Requirements

- Client: rskj (Java) — rsksmart/rskj
- Storage: ~300GB estimated (unverified — RSK docs return 404)
- RAM: 8 GB minimum (Java)
- Merged-mined with Bitcoin
- Low throughput: ~1 TPS, 30s block time
- ⚠️ Disk requirements NOT officially documented (dev.rootstock.io pages return 404)

## Notes

RSK is a Bitcoin sidechain with EVM compatibility. Very low transaction volume (2 TPS). The mempool is small (11 pending) reflecting low usage. RSK docs have been restructured — all node-operators URLs return 404.
