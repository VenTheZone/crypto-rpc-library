# DEX RPC Findings

> RPCs extracted from DEX frontends via manual recon

## Solana

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| Raydium | https://raydium-frontend.rpcpool.com/ | Origin: raydium.io | 131 | 3065 | ✅ | RPCPool |
| Meteora | https://jupiter-frontend.rpcpool.com/ | Origin: meteora.ag | 147 | 3192 | ✅ | RPCPool |
| Pump.fun | https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b | - | 71 | - | ✅ | Leaked key |
| Solend | https://solendf-solendf-67c7.rpcpool.com/ | - | 485 | - | ✅ | RPCPool |
| Jup.ag | https://mercuria-fronten-1cd8.mainnet.rpcpool.com/ | Origin: jup.ag | - | - | ✅ | Rate limited |
| Atrix | https://api.mainnet-beta.solana.com/ | - | - | - | - | Official Solana |
| Saber | https://mainnet.helius-rpc.com/?api-key=26bec238-00c2-4961-ba13-faa7c0a2d767 | - | - | - | ✅ | Leaked Helius key |

## EVM

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| Sushi | https://lb.drpc.live/ogrpc?dkey=Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh | DRPC key | **1992** | - | ✅ | Best RPS! |
| Monad | https://rpc.monad.xyz | - | **1066** | - | ✅ | New chain |
| Woofi | https://eth-mainnet.g.alchemy.com/v2/rJ3f0IWjZbpgEwnzrRS6yYO3WNH0jGle | Leaked | 543 | - | ✅ | Alchemy key |
| KyberSwap | https://ethereum-rpc.kyberswap.com/ | - | 64 | - | ✅ | |
| Convex | https://lb.drpc.org/ogrpc?network=ethereum&dkey=AqJ9UUriTEtThc6A58qm05kyTbyzoIwR8ICdwg8TMB_n | DRPC | 66 | - | ✅ | |
| Scroll | https://rpc.scroll.io | - | 74 | - | ✅ | |
| Aerodrome | https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsRbjBXa_TYR8LCNehXRfUMv | DRPC | 76 | - | ❌ | Base |
| PancakeSwap | https://bsc.publicnode.com | - | 146 | - | ❌ | BSC |
| PancakeSwap | https://rpc.monad.xyz | - | 75 | - | ✅ | Monad |
| PancakeSwap | https://rpc.linea.build | - | - | - | ✅ | Linea |
| PancakeSwap | https://arb1.arbitrum.io/rpc | - | - | - | ❌ | Arbitrum |
| PancakeSwap | https://base.publicnode.com | - | 47 | - | ❌ | Base |
| PancakeSwap | https://opbnb-mainnet-rpc.bnbchain.org | - | - | - | ✅ | opBNB |
| Velodrome | https://lb.drpc.live/optimism/Avibgvi26EjPsw76UtdwmsTjT116_TYR8LCOehXRfUMv | DRPC | - | - | ✅ | Optimism |
| Base.org | https://api.developer.coinbase.com/rpc/v1/base/beP_Dr64yMMTgTOl8ar_93ye9hO8Lw6A | Leaked | 16 | - | ✅ | Coinbase key |
| Zora | https://base-proxy.rpc-proxy.zora.co | - | 20 | - | ✅ | |
| DODO | https://api.dodoex.io/frontend-rpc/1 | Leaked keys | 41 | - | ✅ | Multiple keys |
| Reflexer | https://mainnet.infura.io/v3/645c2c65dd8f4be18a50a0bf011bab85 | Leaked | 19 | - | ✅ | Infura key |
| Clipper | https://ethereum.publicnode.com | - | - | - | ✅ | Public |
| KyberSwap | https://rpc.porto.sh | - | - | - | - | Blocked |

## Leaked API Keys Found

| DEX | Provider | Key | Status |
|-----|----------|-----|--------|
| Pump.fun | Helius | `1b8db865-a5a1-4535-9aec-01061440523b` | Restricted to pump.fun |
| Sushi | DRPC | `Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh` | Works |
| Woofi | Alchemy | `rJ3f0IWjZbpgEwnzrRS6yYO3WNH0jGle` | Works |
| DODO | DODO | Multiple keys in frontend | Works |
| Saber | Helius | `26bec238-00c2-4961-ba13-faa7c0a2d767` | Works |
| Convex | DRPC | `AqJ9UUriTEtThc6A58qm05kyTbyzoIwR8ICdwg8TMB_n` | Works |
| Reflexer | Infura | `645c2c65dd8f4be18a50a0bf011bab85` | Works |
| Base.org | Coinbase | `beP_Dr64yMMTgTOl8ar_93ye9hO8Lw6A` | Works |

## Not Working / Not Found

### Solana
- jup.ag: Rate limited
- orca.so, phoenix.fi, lifinity.io, fluxbeam.xyz: No RPC in frontend
- drift.trade, marginfi.com, kamino.lend, port.finance: No RPC found
- saber.so: `stableswap.rpcpool.com` - 403 forbidden
- larix.finance: `larix.rpcpool.com` - 403 forbidden

### EVM  
- Uniswap: Uses Infura (blocked)
- Curve, Balancer, Camelot, Synthetix: No RPC found
- Polygon, Avalanche, Fantom: Needs more scanning
