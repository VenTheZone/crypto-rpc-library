# DEX RPC Findings

> RPCs extracted from DEX frontends via manual recon

## Solana

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| Raydium | https://raydium-frontend.rpcpool.com/ | Origin: raydium.io | 131 | 3065 | ✅ | RPCPool |
| Meteora | https://jupiter-frontend.rpcpool.com/ | Origin: meteora.ag | 147 | 3192 | ✅ | RPCPool |
| Pump.fun | https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b | - | 71 | - | ✅ | Leaked key |
| Solend | https://solendf-solendf-67c7.rpcpool.com/ | - | 485 | - | ✅ | RPCPool |

## EVM

| DEX | RPC URL | Auth | RPS | TPS | Safe TX | Notes |
|-----|---------|------|-----|-----|---------|-------|
| Sushi | https://lb.drpc.live/ogrpc?dkey=Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh | DRPC key | 1992 | - | ✅ | Best RPS! |
| Monad | https://rpc.monad.xyz | - | 1066 | - | ✅ | New chain |
| Woofi | https://eth-mainnet.g.alchemy.com/v2/rJ3f0IWjZbpgEwnzrRS6yYO3WNH0jGle | Leaked | 543 | - | ✅ | Alchemy key |
| Aerodrome | https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsRbjBXa_TYR8LCNehXRfUMv | DRPC | 151 | 67 | ❌ | Has mempool |
| PancakeSwap | https://bsc.publicnode.com | - | 146 | 189 | ❌ | Has mempool |
| DODO | https://api.dodoex.io/frontend-rpc/1 | Leaked keys | 41 | - | ✅ | Multiple keys |

## Leaked API Keys Found

| DEX | Provider | Key | Status |
|-----|----------|-----|--------|
| Pump.fun | Helius | `1b8db865-a5a1-4535-9aec-01061440523b` | Restricted to pump.fun |
| Sushi | DRPC | `Ak765fp4zUm6uVwKu4annC-7Wt2ExFIR7p71FjlcW9mh` | Works |
| Woofi | Alchemy | `rJ3f0IWjZbpgEwnzrRS6yYO3WNH0jGle` | Works |
| DODO | DODO | Multiple keys in frontend | Works |

## Not Working / Not Found

### Solana
- jup.ag: Rate limited
- orca.so, phoenix.fi, lifinity.io, fluxbeam.xyz: No RPC in frontend
- drift.trade, marginfi.com, kamino.lend, port.finance: No RPC found

### EVM  
- Uniswap (rpc.porto.sh): Method not found
- Curve, Balancer, QuickSwap, Camelot: No RPC found
