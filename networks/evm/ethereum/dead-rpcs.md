# Dead RPCs - ETHEREUM

> Last Updated: 2026-04-21
> These RPCs are confirmed dead (RPS=0 or connection errors)

| Name | URL | Last Known RPS | Date Confirmed Dead | Error |
|------|-----|----------------|---------------------|-------|
| Alchemy | `https://eth-mainnet.g.alchemy.com/v2/demo` | 0 | 2026-04-21 | Requires API key |
| Infura | `https://mainnet.infura.io/v3/` | 0 | 2026-04-21 | Requires API key |
| QuickNode | `https://*.quiknode.pro/` | 0 | 2026-04-21 | Requires API key |
| NodeReal | `https://eth-mainnet.nodereal.io/v1/` | 0 | 2026-04-21 | Requires API key |
| BlockPi | `https://ethereum.blockpi.network/v1/rpc/public` | 0 | 2026-04-21 | Rate limited |
| GetBlock | `https://eth.getblock.io/` | 0 | 2026-04-21 | Requires API key |
| Pocket | `https://eth-rpc.gateway.pokt.network` | 0 | 2026-04-21 | Requires API key |

## Notes

These RPCs failed during live testing on 2026-04-21. Some may require:
- API keys (Alchemy, Infura, QuickNode, NodeReal, GetBlock, Pocket)
- Rate limit adjustments (BlockPi)
- Network connectivity fixes

Consider removing from tested.md if consistently dead across multiple audits.
