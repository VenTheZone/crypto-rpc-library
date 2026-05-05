# Solana DEX RPCs

> RPCs extracted from DEX frontends via manual recon

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| Raydium | https://raydium-frontend.rpcpool.com/ | Origin: raydium.io | 131 | 3065 | ✅ | RPCPool |
| Raydium | https://api-v3.raydium.io/main/rpcs | - | - | - | - | REST API |
| Meteora | https://jupiter-frontend.rpcpool.com/ | Origin: meteora.ag | 147 | 3192 | ✅ | RPCPool |
| Pump.fun | https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b | - | 71 | - | ✅ | Leaked key |
| Solend | https://solendf-solendf-67c7.rpcpool.com/ | - | 485 | - | ✅ | RPCPool |
| Jup.ag | https://mercuria-fronten-1cd8.mainnet.rpcpool.com/ | Origin: jup.ag | - | - | ✅ | Rate limited |
| Atrix | https://api.mainnet-beta.solana.com/ | - | - | - | - | Official Solana |
| Saber | https://mainnet.helius-rpc.com/?api-key=26bec238-00c2-4961-ba13-faa7c0a2d767 | - | - | - | ✅ | Leaked Helius key |

## Leaked API Keys Found (Solana)

| DEX | Provider | Key | Status |
|-----|----------|-----|--------|
| Pump.fun | Helius | `1b8db865-a5a1-4535-9aec-01061440523b` | Restricted to pump.fun |
| Saber | Helius | `26bec238-00c2-4961-ba13-faa7c0a2d767` | Works |

## Not Working / Not Found
- jup.ag: Uses RPCPool (mercuria-fronten-1cd8) - rate limited
- orca.so: REST API only
- phoenix.fi: No RPC found  
- lifinity.io: No RPC found
- fluxbeam.xyz: No RPC found
- drift.trade: No RPC found
- marginfi.com: REST API only
- kamino.lend: Domain not resolving
- port.finance: No RPC found
- saber.so: `stableswap.rpcpool.com` - 403 forbidden
- larix.finance: `larix.rpcpool.com` - 403 forbidden
