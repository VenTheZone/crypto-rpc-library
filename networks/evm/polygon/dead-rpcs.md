# Dead RPCs - POLYGON

> Last Updated: 2026-04-21
> These RPCs are confirmed dead (RPS=0 or connection errors)

| Name | URL | Last Known RPS | Date Confirmed Dead | Error |
|------|-----|----------------|---------------------|-------|
| Polygon | `https://polygon-rpc.com` | 0 | 2026-04-21 | Connection error |
| MaticVigil | `https://rpc-mainnet.maticvigil.com` | 0 | 2026-04-21 | Connection error |
| BlockPi | `https://polygon.blockpi.network/v1/rpc/public` | 0 | 2026-04-21 | Rate limited |
| PublicNode | `https://polygon-rpc.publicnode.com` | 0 | 2026-04-21 | Connection error |
| QuickNode | `https://*.quiknode.pro/` | 0 | 2026-04-21 | Requires API key |
| Alchemy | `https://polygon-mainnet.g.alchemy.com/v2/demo` | 0 | 2026-04-21 | Requires API key |
| Infura | `https://polygon-mainnet.infura.io/v3/` | 0 | 2026-04-21 | Requires API key |

## Notes

These RPCs failed during live testing on 2026-04-21. Some may require:
- API keys (Alchemy, Infura, QuickNode, NodeReal, GetBlock, Pocket)
- Rate limit adjustments (BlockPi)
- Network connectivity fixes

Consider removing from tested.md if consistently dead across multiple audits.
