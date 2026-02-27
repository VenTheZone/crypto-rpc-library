# Best RPCs by Chain (Summary)

> Best performing free public RPCs per chain with tested RPS and TPS.

| Chain | Best RPC | RPS | TPS | Mempool | Safe TX | Notes |
| ----- | -------- | --- | --- | ------- | ------- | ----- |
| **Ethereum** | Ankr | 2107* | - | no | yes | *requires API key |
| **Ethereum** | Blast | 270 | - | no | yes | Free |
| **Ethereum** | DRPC | 594 | - | yes | no | Has mempool |
| **BNB Chain** | Ankr | 1196 | - | no | yes | *requires API key |
| **BNB Chain** | DRPC | 400 | 65 | yes | no | |
| **Solana** | Official | 424 | ~140 | - | yes | No mempool |
| **Solana** | PublicNode | 235 | ~78 | - | yes | |
| **Solana** | Triton | 145 | ~48 | - | yes | |
| **Polygon** | DRPC | 240 | 93 | no | yes | |
| **Polygon** | Ankr | 219 | - | no | yes | |
| **Polygon** | Blast | 212 | - | no | yes | |
| **Arbitrum** | DRPC | 345 | 46 | no | yes | |
| **Arbitrum** | Ankr | 306 | - | no | yes | |
| **Arbitrum** | PublicNode | 100 | 63 | no | yes | |
| **Optimism** | Ankr | 637 | - | no | yes | |
| **Optimism** | DRPC | 366 | 18 | no | yes | |
| **Optimism** | Blast | 343 | - | no | yes | |
| **Avalanche** | DRPC | 430 | 19 | yes | no | |
| **Avalanche** | Ankr | 399 | - | no | yes | |
| **Avalanche** | PublicNode | 103 | 25 | yes | no | |
| **Base** | Ankr | 700+ | - | no | yes | |
| **Base** | PublicNode | 150 | - | no | yes | |
| **Fantom** | Ankr | 300+ | - | no | yes | |
| **Fantom** | Fantom | 67 | 1 | no | yes | |
| **zkSync Era** | Blast | 503 | - | no | yes | |
| **zkSync Era** | zkSync | 66 | - | no | yes | |
| **zkSync Era** | Ankr | 215 | - | no | yes | |
| **Linea** | Blast | 583 | - | no | yes | |
| **Mantle** | Mantle | 311 | 1 | no | yes | |
| **Mantle** | BlockPi | 34 | - | no | yes | |
| **Scroll** | Scroll | 312 | 1 | no | yes | |
| **Scroll** | BlockPi | 34 | - | no | yes | |
| **Celo** | Ankr | 220 | 19 | no | yes | |
| **Celo** | Celo | 51 | 31 | no | yes | |
| **Gnosis** | Ankr | 293 | - | no | yes | |
| **Gnosis** | Gnosis | 34 | 1 | no | yes | |
| **Moonbeam** | Ankr | 404 | - | no | yes | |
| **Moonbeam** | Moonbeam | 29 | 10 | no | yes | |
| **Cronos** | Cronos | 78 | 180 | no | yes | |
| **Aurora** | Aurora | 40 | 9 | no | yes | |
| **Harmony** | Ankr | 404 | - | no | yes | |
| **Harmony** | Harmony | 18 | 30 | no | yes | |
| **Klaytn** | Ankr | 161 | 3 | no | yes | |
| **Fuse** | Fuse | 20 | 10 | no | yes | |
| **Astar** | - | 0 | - | - | - | No working RPCs found |
| **Ethereum Classic** | Etc | 22 | - | yes | no | Has mempool |
| **Syscoin** | Ankr | 427 | - | no | yes | |
| **Velas** | - | 0 | - | - | - | No working RPCs found |
| **Godwoken** | - | 0 | - | - | - | No working RPCs found |
| **Oasis** | - | 0 | - | - | - | No working RPCs found |
| **Bittorrent** | Bittorrent | 13 | 10 | no | yes | |
| **Huobi** | - | 0 | - | - | - | No working RPCs found |
| **Moonriver** | Moonriver | 32 | - | no | yes | |
| **KCC** | - | 0 | - | - | - | No working RPCs found |
| **RSK** | RSK | 23 | - | yes | no | Has mempool |
| **Ronin** | Ronin | 36 | 1 | no | yes | Axie Infinity |
| **Taiko** | Taiko | 65 | - | yes | no | Has mempool |

## Quick Reference

### Highest RPS (Free, No Auth)
| Chain | RPC | RPS |
| ----- | --- | --- |
| Ethereum | Blast | 270 |
| BNB | Ankr | 1196* |
| Optimism | Ankr | 637 |
| Base | Ankr | 700+ |
| Linea | Blast | 583 |
| zkSync | Blast | 503 |
| Moonbeam | Ankr | 404 |
| Harmony | Ankr | 404 |
| Avalanche | DRPC | 430 |

### Safe TX (No Mempool)
These RPCs have no visible mempool - safe for sensitive transactions:
- Ethereum: Blast, Cloudflare, Rei, OnFinality
- Solana: All (no traditional mempool)
- Polygon: DRPC, Ankr, Blast
- All Ankr/Blost/BlockPi endpoints are Safe TX

### For TPS Testing
Network-wide TPS (not your capacity):
- Cronos: 180 TPS
- Solana: ~3000+ TPS
- Polygon: 65 TPS
- Ethereum: 15 TPS
- Arbitrum: 50 TPS
