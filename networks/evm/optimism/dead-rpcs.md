# Dead RPCs - OPTIMISM

> Last Updated: 2026-04-21
> These RPCs are confirmed dead (RPS=0 or connection errors)

| Name | URL | Last Known RPS | Date Confirmed Dead | Error |
|------|-----|----------------|---------------------|-------|
| BlockPi | `https://optimism.blockpi.network/v1/rpc/public` | 0 | 2026-04-21 | Rate limited |
| QuickNode | `https://*.quiknode.pro/` | 0 | 2026-04-21 | Requires API key |
| Alchemy | `https://opt-mainnet.g.alchemy.com/v2/demo` | 0 | 2026-04-21 | Requires API key |
| Infura | `https://optimism-mainnet.infura.io/v3/` | 0 | 2026-04-21 | Requires API key |

## Notes

These RPCs failed during live testing on 2026-04-21. Some may require:
- API keys (Alchemy, Infura, QuickNode, NodeReal, GetBlock, Pocket)
- Rate limit adjustments (BlockPi)
- Network connectivity fixes

Consider removing from tested.md if consistently dead across multiple audits.
