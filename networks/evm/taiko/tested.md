# Tested RPCs

*Last Updated: 2026-07-03*

| Name | URL | Auth Header | RPS | TPS | Mempool | Safe TX | Status |
| ---- | --- | ----------- | --- | --- | ------- | ------- | ------ |
| Taiko | https://rpc.taiko.xyz | - | 85 | 1 | **yes** | no | working |

## Mempool Status

**✅ YES — Public mempool confirmed (tested 2026-07-03)**
- Pending: 3,872 | Queued: 3
- Method: `txpool_status`
- Client: op-geth + taiko-client (ZK-rollup on Ethereum L1)

## Node Requirements

- Client: taiko-geth (minimally modified go-ethereum fork)
- **Minimum storage: 2 TB SSD** (official docs)
- RAM: 16 GB minimum
- Pruning: geth defaults to full mode; no explicit prune toggle in simple-taiko-node
- ⚠️ Does NOT fit on 492GB disk

## Notes

Taiko is a Type 1 ZK-rollup on Ethereum. Node syncs L2 state derived from L1 blob data. Storage requirements grow over time. The 2TB minimum is from official docs (docs.taiko.xyz).
