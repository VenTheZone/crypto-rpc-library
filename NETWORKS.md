# Crypto-RPC Library — Network Overview

> Auto-generated on 2026-05-06
> Total RPCs: 164 | Working: 132 | Dead: 2 | Slow: 1 | Needs Key: 29
> Health Score: 80.5%

## Per-Chain Summary

| Chain | Total | Working | Dead | Slow | Needs-Key | Top RPC | Top RPS | Avg RPS | Mempool |
|-------|-------|---------|------|------|-----------|---------|---------|---------|---------|
| arbitrum | 6 | 6 | 0 | 0 | 0 | QuickNode | 175 | 114 | 0 |
| astar | 2 | 2 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| aurora | 2 | 2 | 0 | 0 | 0 | Aurora | 38 | 19 | 0 |
| avalanche | 4 | 4 | 0 | 0 | 0 | PublicNode | 112 | 82 | 2 |
| base | 19 | 14 | 0 | 1 | 4 | OnFinality | 180 | 116 | 3 |
| berachain | 6 | 4 | 1 | 0 | 1 | dRPC | 149 | 95 | 2 |
| bittorrent | 2 | 2 | 0 | 0 | 0 | Bittorrent | 69 | 34 | 0 |
| bnb | 8 | 8 | 0 | 0 | 0 | OnFinality | 140 | 91 | 4 |
| callisto | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| celo | 3 | 2 | 0 | 0 | 1 | Celo | 85 | 71 | 0 |
| cronos | 2 | 2 | 0 | 0 | 0 | Cronos | 37 | 18 | 0 |
| etc | 2 | 2 | 0 | 0 | 0 | Ethereum Classic | 39 | 19 | 1 |
| ethereum | 20 | 15 | 0 | 0 | 5 | Tenderly | 266 | 144 | 3 |
| fantom | 5 | 5 | 0 | 0 | 0 | DRPC | 142 | 71 | 3 |
| fuse | 2 | 2 | 0 | 0 | 0 | Fuse | 43 | 21 | 0 |
| gnosis | 2 | 2 | 0 | 0 | 0 | Ankr | 173 | 149 | 0 |
| godwoken | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| harmony | 2 | 2 | 0 | 0 | 0 | Ankr | 150 | 122 | 0 |
| huobi | 2 | 2 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| iotex | 2 | 2 | 0 | 0 | 0 | OnFinality | 157 | 104 | 0 |
| karura | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| kcc | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| klaytn | 2 | 2 | 0 | 0 | 0 | Ankr | 36 | 18 | 0 |
| lightlink | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| linea | 4 | 2 | 0 | 0 | 2 | Blast | 148 | 131 | 0 |
| mantle | 4 | 2 | 0 | 0 | 2 | BlockPi | 68 | 50 | 0 |
| metagov | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| moonbeam | 3 | 3 | 0 | 0 | 0 | Ankr | 199 | 93 | 0 |
| moonriver | 2 | 2 | 0 | 0 | 0 | Moonriver | 32 | 16 | 0 |
| oasis | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| optimism | 8 | 6 | 0 | 0 | 2 | Alchemy | 185 | 143 | 2 |
| polygon | 6 | 3 | 0 | 0 | 3 | DRPC | 190 | 155 | 0 |
| ronin | 1 | 1 | 0 | 0 | 0 | Ronin | 36 | 36 | 0 |
| rsk | 1 | 1 | 0 | 0 | 0 | RSK | 23 | 23 | 1 |
| scroll | 4 | 2 | 0 | 0 | 2 | Scroll | 106 | 103 | 0 |
| solana | 20 | 14 | 0 | 0 | 6 | Ironforge 1 | 387 | 142 | 0 |
| syscoin | 2 | 2 | 0 | 0 | 0 | Ankr | 427 | 223 | 1 |
| taiko | 1 | 1 | 0 | 0 | 0 | Taiko | 124 | 124 | 1 |
| tomochain | 1 | 1 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| velas | 2 | 2 | 0 | 0 | 0 | - | 0 | 0 | 0 |
| zksync | 5 | 3 | 1 | 0 | 1 | zkSync | 210 | 128 | 0 |

## Priority Chains (Top 5 Performers)

### BNB

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| OnFinality | https://bnb.api.onfinality.io/public | 140 | - | ❌ | ✅ |
| Ankr | https://rpc.ankr.com/bsc | 134 | - | ❌ | ✅ |
| Binance | https://bsc-dataseed.binance.org | 130 | 123 | ✅ | ❌ |
| PublicNode | https://bsc-rpc.publicnode.com | 109 | 121 | ✅ | ❌ |
| PancakeSwap Alpha | https://bscrpc-alpha.pancakeswap.finance | 85 | 112 | ❌ | ✅ |

### ETHEREUM

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| Tenderly | https://mainnet.gateway.tenderly.co | 266 | - | ❌ | ✅ |
| Kukus | https://eth-mainnet.public.blastapi.io | 259 | 75 | ❌ | ✅ |
| Blast | https://eth-mainnet.public.blastapi.io | 251 | - | ❌ | ✅ |
| DRPC | https://eth.drpc.org | 186 | 75 | ❌ | ✅ |
| PublicNode | https://ethereum-rpc.publicnode.com | 164 | 116 | ✅ | ❌ |

### SOLANA

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| Ironforge 1 | https://rpc.ironforge.network/mainnet | 387 | - | ❌ | ✅ |
| RPC Pool Jupiter | https://mercuria-fronten-1cd8.mainnet.rpcpool.com/ | 224 | - | ❌ | ✅ |
| RPC Pool Kamino | https://kamino.mainnet.rpcpool.com/ | 221 | - | ❌ | ✅ |
| Solana Official | https://api.mainnet-beta.solana.com | 197 | - | ❌ | ✅ |
| Triton | https://triton.mainnet.rpcpool.com | 182 | - | ❌ | ✅ |

### ARBITRUM

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| QuickNode | https://warmhearted-falling-shape.arbitrum-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559 | 175 | 20 | ❌ | ✅ |
| Arbitrum Official | https://arb1.arbitrum.io/rpc | 162 | 12 | ❌ | ✅ |
| BlastAPI | https://arbitrum-one.public.blastapi.io | 155 | 8 | ❌ | ✅ |
| DRPC | https://arbitrum.drpc.org | 127 | 4 | ❌ | ✅ |
| Nova Official | https://nova.arbitrum.io/rpc | 64 | - | ❌ | ✅ |

### BASE

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| OnFinality | https://base.api.onfinality.io/public | 180 | - | ❌ | ✅ |
| Aerodrome dRPC | https://lb.drpc.live/base/ | 172 | - | ❌ | ✅ |
| DRPC | https://base.drpc.org | 162 | 47 | ✅ | ❌ |
| Ankr Pro | https://rpc.ankr.com/base/ | 158 | - | ❌ | ✅ |
| Tenderly | https://base.gateway.tenderly.co | 156 | 60 | ❌ | ✅ |

### POLYGON

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| DRPC | https://polygon.drpc.org | 190 | 94 | ❌ | ✅ |
| Blast | https://polygon-mainnet.public.blastapi.io | 160 | - | ❌ | ✅ |
| Ankr | https://rpc.ankr.com/polygon | 116 | - | ❌ | ✅ |

### AVALANCHE

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| PublicNode | https://avalanche-evm.publicnode.com | 112 | 22 | ✅ | ❌ |
| DRPC | https://avalanche.drpc.org | 78 | 31 | ✅ | ❌ |
| Avalanche Official | https://api.avax.network/ext/bc/C/rpc | 71 | 86 | ❌ | ✅ |
| 1rpc.io | https://1rpc.io/avax/c | 67 | 71 | ❌ | ✅ |

### OPTIMISM

| Name | URL | RPS | TPS | Mempool | Safe TX |
|------|-----|-----|-----|---------|--------|
| Alchemy | https://opt-mainnet.g.alchemy.com/v2/demo | 185 | - | ❌ | ✅ |
| DRPC | https://optimism.drpc.org | 177 | 11 | ✅ | ❌ |
| Blast | https://optimism-mainnet.public.blastapi.io | 164 | - | ❌ | ✅ |
| Ankr | https://rpc.ankr.com/optimism | 145 | - | ❌ | ✅ |
| PublicNode | https://optimism-rpc.publicnode.com | 110 | 19 | ✅ | ❌ |

## All Chains by Health

- 🟢 **arbitrum**: 100% (6/6) — top RPS: 175
- 🟢 **astar**: 100% (2/2) — top RPS: 0
- 🟢 **aurora**: 100% (2/2) — top RPS: 38
- 🟢 **avalanche**: 100% (4/4) — top RPS: 112
- 🟢 **bittorrent**: 100% (2/2) — top RPS: 69
- 🟢 **bnb**: 100% (8/8) — top RPS: 140
- 🟢 **callisto**: 100% (1/1) — top RPS: 0
- 🟢 **cronos**: 100% (2/2) — top RPS: 37
- 🟢 **etc**: 100% (2/2) — top RPS: 39
- 🟢 **fantom**: 100% (5/5) — top RPS: 142
- 🟢 **fuse**: 100% (2/2) — top RPS: 43
- 🟢 **gnosis**: 100% (2/2) — top RPS: 173
- 🟢 **godwoken**: 100% (1/1) — top RPS: 0
- 🟢 **harmony**: 100% (2/2) — top RPS: 150
- 🟢 **huobi**: 100% (2/2) — top RPS: 0
- 🟢 **iotex**: 100% (2/2) — top RPS: 157
- 🟢 **karura**: 100% (1/1) — top RPS: 0
- 🟢 **kcc**: 100% (1/1) — top RPS: 0
- 🟢 **klaytn**: 100% (2/2) — top RPS: 36
- 🟢 **lightlink**: 100% (1/1) — top RPS: 0
- 🟢 **metagov**: 100% (1/1) — top RPS: 0
- 🟢 **moonbeam**: 100% (3/3) — top RPS: 199
- 🟢 **moonriver**: 100% (2/2) — top RPS: 32
- 🟢 **oasis**: 100% (1/1) — top RPS: 0
- 🟢 **ronin**: 100% (1/1) — top RPS: 36
- 🟢 **rsk**: 100% (1/1) — top RPS: 23
- 🟢 **syscoin**: 100% (2/2) — top RPS: 427
- 🟢 **taiko**: 100% (1/1) — top RPS: 124
- 🟢 **tomochain**: 100% (1/1) — top RPS: 0
- 🟢 **velas**: 100% (2/2) — top RPS: 0
- 🟡 **ethereum**: 75% (15/20) — top RPS: 266
- 🟡 **optimism**: 75% (6/8) — top RPS: 185
- 🟡 **base**: 74% (14/19) — top RPS: 180
- 🟡 **solana**: 70% (14/20) — top RPS: 387
- 🟡 **berachain**: 67% (4/6) — top RPS: 149
- 🟡 **celo**: 67% (2/3) — top RPS: 85
- 🟡 **zksync**: 60% (3/5) — top RPS: 210
- 🟡 **linea**: 50% (2/4) — top RPS: 148
- 🟡 **mantle**: 50% (2/4) — top RPS: 68
- 🟡 **polygon**: 50% (3/6) — top RPS: 190
- 🟡 **scroll**: 50% (2/4) — top RPS: 106

---
*Last updated: 2026-05-06*
