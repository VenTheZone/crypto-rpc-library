# RPC Library Audit - 2026-05-06

## Summary
- Chains audited: 41
- Total RPCs tested: 164
- Working: 132 | Dead: 2 | Slow: 1 | Needs-key: 29

## Dead RPCs

| Chain | URL | Last RPS | Error |
|-------|-----|----------|-------|
| berachain | (see networks/evm/berachain/dead-rpcs.md) | 0 | dead |
| zksync | (see networks/evm/zksync/dead-rpcs.md) | 0 | dead |

## New RPCs Added
- None discovered this audit cycle (discovery commands not run due to binary parser issues)

## Changes Made
- Sorted all 41 tested.md files by RPS (descending)
- Updated "Last Updated" timestamps to 2026-05-06
- Generated NETWORKS.md report manually (binary `crypto-rpc report` crashes on non-standard table formats)
- Removed stale duplicate directories: networks/arbitrum/, networks/avalanche/ (outside evm/, contained outdated data)
- Restored 21 dead-rpcs.md files from .bak
- Created AUDIT-LOG.md for persistent audit tracking

## Technical Issues
- `crypto-rpc report` binary panics: parseTableRow index out of range [6] with length 6
  - Root cause: non-standard table formats in dex/tested-dex.md (7 cols), backup files (2-5 cols)
  - Workaround: manually generated NETWORKS.md from parsed tested.md data
  - Fix needed: parser should handle variable column counts or skip non-conforming files
