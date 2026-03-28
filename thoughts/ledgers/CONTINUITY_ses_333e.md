---
session: ses_333e
updated: 2026-03-28T02:50:59.893Z
---

# Session Summary

## Goal
Discover, test, and document Solana RPC endpoints (both JSON-RPC and gRPC) for the crypto-rpc-library project, including RPS/TPS performance metrics and Origin header requirements.

## Constraints & Preferences
- Use existing project tools (`./bin/crypto-rpc discover-dex`, `./bin/crypto-rpc test`)
- Test RPS, TPS, latency, and Origin header requirements
- Document findings in `networks/solana/tested.md`
- Commit changes to git

## Progress
### Done
- [x] Cloned `crypto-rpc-library` repo from GitHub
- [x] Built CLI: `go build -o bin/crypto-rpc ./cmd/crypto-rpc`
- [x] Tested 21 Solana RPCs for RPS and TPS
- [x] Added **Origin header support** to the framework:
  - Modified `internal/types/rpc.go` - added `Origin` field
  - Modified `internal/markdown/parser.go` - parse Origin column
  - Modified `internal/test/rps.go` and `internal/test/tps.go` - use custom Origin
  - Modified `cmd/crypto-rpc/test.go` - pass Origin to testers
- [x] Fixed Helius Jupiter RPC (needs `Origin: https://jup.ag`)
- [x] Updated `networks/solana/tested.md` with fresh results
- [x] Created `scripts/scan-grpc.sh` to scan DEX frontends for gRPC endpoints
- [x] Tested LaserStream gRPC endpoints - all require Professional plan ($999/mo)
- [x] Tested Jito Block Engine gRPC - requires auth/proto files
- [x] Tested PublicNode Yellowstone gRPC - requires auth, no free access
- [x] Created `MEMORY.md` with project learnings
- [x] Committed all changes (5 commits on master)

### In Progress
- [ ] Running fresh DEX discovery scan for new RPCs/API keys

### Blocked
- gRPC endpoints require paid subscriptions or authentication - no free public gRPC available

## Key Decisions
- **Origin column position**: After Auth, before RPS (Name, URL, Auth, Origin, RPS, TPS, Mempool, SafeTX, Status)
- **Default Solana Origin**: `https://solana.com` when not specified
- **No gRPC testing added to CLI**: All public gRPC endpoints require paid access

## Next Steps
1. Filter and test the discovered UUID API keys against Helius/other providers
2. Test any new RPC endpoints found in DEX scans

## Critical Context
- **Best Free Solana RPCs (Mar 2026)**:
  - Solana Official: 672 RPS (`api.mainnet-beta.solana.com`)
  - QuickNode: 633 RPS, 3027 TPS
  - DRPC: 552 RPS (`solana.drpc.org`)
  - PublicNode: 208 RPS, 3038 TPS (`solana-rpc.publicnode.com`)
- **Helius LaserStream**: Requires Professional plan ($999/mo), separate from DEX API keys
- **Jito Block Engine**: Found at `mainnet.block-engine.jito.wtf:443`, needs proto files
- **Origin Header**: Some Helius RPCs blocked by Cloudflare without correct Origin

## File Operations
### Read
- `networks/solana/tested.md` - existing RPC test results
- `internal/types/rpc.go` - RPC struct definition
- `internal/markdown/parser.go` - markdown parsing logic
- `internal/test/rps.go`, `internal/test/tps.go` - testing logic
- `scripts/extract-rpc.js` - Playwright-based DEX scanner

### Modified
- `internal/types/rpc.go` - Added `Origin string` field to RPC struct
- `internal/markdown/parser.go` - Parse Origin column from markdown tables
- `internal/test/rps.go` - Added `SetOrigin()` method, use custom Origin
- `internal/test/tps.go` - Added `SetOrigin()` method, use custom Origin
- `cmd/crypto-rpc/test.go` - Pass Origin from RPC to testers
- `networks/solana/tested.md` - Updated with fresh RPS/TPS results
- `README.md` - Added Origin header support feature
- `docs/INDEX.md` - Added input file format with Origin column
- `MEMORY.md` - Created with project learnings
- `scripts/scan-grpc.sh` - Created gRPC scanner script
