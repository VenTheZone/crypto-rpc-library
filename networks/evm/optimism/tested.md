# Optimism — RPC Endpoints

Chain ID: 10
RPC: EVM (geth-compatible)
Native token: ETH
Block time: ~2s

## Mempool: ❌ NO (0 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://optimism-rpc.publicnode.com` | — | ❌ | No | working |
| dRPC | `https://optimism.drpc.org` | — | ❌ | No | working |
| Official | `https://mainnet.optimism.io` | — | ❌ | No | working |
| QuikNode (Uniswap) | `https://thrumming-tame-leaf.optimism.quiknode.pro/1da322086e67b0922a98f95694761ec8c5c7ce7c` | — | ❌ | No | working |

## API Keys

| Provider | Key | Source | Mempool |
|----------|-----|--------|---------|
| QuikNode | `1da322086e67b0922a98f95694761ec8c5c7ce7c` | Uniswap | ❌ |

## Notes

- OP Stack sequencer — no public mempool
- All RPCs return 0 pending txs
- No Origin headers required for any endpoint

## Discovered (JS Bundles, 2026-07-06)

| Source | RPC URL |
|--------|--------|
| OP-BlockPI | `https://optimism.public.blockpi.network/v1/rpc/public` |
| OP-KyberSwap | `https://optimism-rpc.kyberswap.com` |
| OP-PublicNode | `https://optimism-rpc.publicnode.com` |
| OP-dRPC | `https://optimism.drpc.org` |
