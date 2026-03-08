# Project Memory

## Solana RPC Testing

### Origin Header Support
- **Some Helius RPCs require specific Origin headers** to bypass Cloudflare blocking
- Example: `grateful-jerrie-fast-mainnet.helius-rpc.com` needs `Origin: https://jup.ag`
- Added `Origin` field to RPC struct and parser (columns: Name, URL, Auth, **Origin**, RPS, TPS, Mempool, SafeTX, Status)
- Default Origin for Solana: `https://solana.com`

### Best Free Solana RPCs (Mar 2026)
| RPC             | RPS | TPS  | Notes                |
| --------------- | --- | ---- | -------------------- |
| Solana Official | 672 | -    | api.mainnet-beta.solana.com |
| QuickNode       | 633 | 3027 | Public endpoint      |
| DRPC            | 552 | -    | solana.drpc.org      |
| PublicNode      | 208 | 3038 | Best TPS             |
| Ironforge       | 330 | -    | API key required     |

### DEX-Dedicated Helius RPCs
- Found on DEX frontends (Jupiter, Kamino, Tensor, Drift, Solend, Pump)
- API keys work for standard JSON-RPC only
- **NOT compatible with LaserStream gRPC** - requires separate Professional plan ($999/mo)
- IP-restricted in many cases

## Solana gRPC / Yellowstone

### No Free Public gRPC Endpoints
All Solana gRPC providers require paid access:

| Provider      | Endpoint                                | Access Required        |
| ------------- | --------------------------------------- | ---------------------- |
| Helius        | `laserstream-mainnet-*.helius-rpc.com`    | Professional plan $999/mo |
| Triton/RPCPool | `grpc.rpcpool.com`                       | Paid subscription      |
| Jito          | `mainnet.block-engine.jito.wtf`           | Account + tip access   |
| PublicNode    | `yellowstone-grpc.publicnode.com`         | Requires auth/proto    |

### gRPC Testing Tools
- `grpcurl` for CLI testing: `go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest`
- Test health: `grpcurl endpoint:443 grpc.health.v1.Health/Check`
- Many endpoints block reflection - need proto files

### DEX gRPC Scanning
- Created `scripts/scan-grpc.sh` to scan DEX frontends for gRPC endpoints
- Found Jito block-engine in Tensor's frontend
- Most DEX-dedicated endpoints are JSON-RPC only, no gRPC

## EVM Chains
(To be documented after testing)

## Testing Methodology

### RPS Testing
- Concurrent requests over 5 seconds
- Measure successful responses per second
- Default concurrency: 50

### TPS Testing (Solana)
- Uses `getRecentPerformanceSamples` method
- Calculates: total transactions / 60 seconds
- Fallback: `getSlot` sampling

### Mempool Detection
- Solana: No mempool (all RPCs safe)
- EVM: Check `txpool_content` method
