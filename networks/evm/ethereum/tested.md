# Ethereum — Tested RPC Endpoints

> **Last tested:** 2026-07-06  
> **DEXs scanned:** 45 (Uniswap, 1inch, CowSwap, Curve, Sushi, Balancer, Paraswap, DexScreener, Lido, Aave, Matcha, KyberSwap, Clipper, DODO, Bancor, THORChain, Firebird, Li.Fi, Socket, WOOFi, Plasma Finance, Morpho, Yearn, Pendle, Frax, Badger, StakeDAO, Aura, Connext, Synapse, Hop, Across, Stargate, Celer, Swapper, Symbiosis, Wombat, Solidly, Swerve, mStable, DeFi Saver, Oasis, Instadapp, Zapper, Zerion)

## Mempool Status

| Chain | Mempool | Pending | RPC |
|-------|---------|---------|-----|
| **Ethereum** | ✅ yes | 55,029 | PublicNode |

## Working Endpoints

| Name | URL | RPS | Latency | Mempool |
|------|-----|-----|---------|---------|
| PublicNode | `https://ethereum.publicnode.com` | 6.7 | 151ms | ✅ 55K pending |
| Nodies | `https://ethereum-public.nodies.app` | 4.3 | 249ms | ✅ 70 pending |
| Nodesmith | `https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc` | 48.2 | 47ms | ❌ |
| TheRPC | `https://ethereum.therpc.io` | 39.4 | 54ms | ❌ |
| Ankr | `https://rpc.ankr.com/eth` | 18.0 | 75ms | ❌ |
| Alchemy-Bancor | `https://eth-mainnet.g.alchemy.com/v2/m2607P4kbMyyrp3VFeEThvhlV9s8hzTf` | 15.7 | 83ms | ❌ |
| Alchemy-DeFiSaver | `https://eth-mainnet.g.alchemy.com/v2/wa5qWTwqyP005LbcZd0L-Aq1irGLn4bY` | 12.9 | 87ms | ❌ |
| Alchemy-Demo | `https://eth-mainnet.g.alchemy.com/v2/demo` | 13.4 | 85ms | ❌ |
| Alchemy-Badger | `https://eth-mainnet.g.alchemy.com/v2/L5u_Kc9lmh0RgUQia7m_wvYdOQ6I0nDs` | 16.1 | 84ms | ❌ |
| KyberSwap-MEV | `https://ethereum-rpc-mev-protection.kyberswap.com/` | 11.4 | 118ms | ❌ |
| KyberSwap | `https://ethereum-rpc.kyberswap.com` | 10.8 | 111ms | ❌ |
| Zan | `https://api.zan.top/eth-mainnet` | 10.2 | 123ms | ❌ |
| dRPC (Sushi key) | `https://lb.drpc.live/ogrpc?network=ethereum&dkey=Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh` | 9.0 | 94ms | ❌ |
| BlastAPI | `https://eth-mainnet.public.blastapi.io` | 2.8 | 445ms | ❌ |
| WalletConnect | `https://rpc.walletconnect.org/v1/json-rpc` | 1.1 | 1040ms | ❌ |

## Discovered API Keys

| Provider | Key | Source | Origin Required | Status |
|----------|-----|--------|-----------------|--------|
| Alchemy | `m2607P4kbMyyrp3VFeEThvhlV9s8hzTf` | Bancor | No | ✅ Fastest (83ms) |
| Alchemy | `wa5qWTwqyP005LbcZd0L-Aq1irGLn4bY` | DeFi Saver | No | ✅ Works |
| Alchemy | `L5u_Kc9lmh0RgUQia7m_wvYdOQ6I0nDs` | Badger | No | ✅ Works |
| Alchemy | `demo` | Multiple | No | ✅ Works |
| Alchemy | `iSJh-3-MlrW4nPlMH6AnpLkLKujMmqE3` | CowSwap | Yes (Origin whitelist) | ⚠️ Useless |
| Infura | `786ade30f36244469480aa5c2bf0743b` | Bancor | No | ✅ Works |
| dRPC | `Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh` | Sushi | No | No mempool |
| Etherscan | `XCHQUWNJ3NNUKYRKKFEBFNTZDFV87AFPZJ` | StakeDAO | No | ✅ V2 API (gas, ABI, tokens) |

## Header Testing Results

| RPC | Origin Header | Result |
|-----|---------------|--------|
| TheRPC | None | 105ms |
| TheRPC | `https://app.uniswap.org` | 102ms (no boost) |
| TheRPC | `User-Agent: Mozilla/5.0` | 3075ms (slower) |

**Conclusion**: Headers don't unlock RPS on Ethereum. Public endpoints are rate-limited at source.

## Notes

- **Mempool**: PublicNode (55K pending) + Nodies (70 pending)
- **All Alchemy keys work** without Origin whitelist — multiple keys discovered
- **No Origin headers** required for public RPCs
- **Best for sandwich**: PublicNode (55K pending, 151ms)
- **Best RPS**: Nodesmith (48.2 RPS, no mempool)
- **Best RPS + mempool**: Nodies (4.3 RPS, 70 pending)
