# Arbitrum — RPC Endpoints

Chain ID: 42161
RPC: EVM (geth-compatible)
Native token: ETH
Block time: ~0.25s

## Mempool: ❌ NO (sequencer-based L2)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://arbitrum-one-rpc.publicnode.com` | — | ❌ | No | working |
| dRPC | `https://arbitrum.drpc.org` | — | ❌ | No | working |
| Official | `https://arb1.arbitrum.io/rpc` | — | ❌ | No | working |
| QuikNode (Uniswap) | `https://maximum-sly-dew.celo-mainnet.quiknode.pro/7752451997e54dc2fd84f08a768cbe037e2d9cc9` | — | ❌ | No | working |

## API Keys

| Provider | Key | Source | Mempool |
|----------|-----|--------|---------|
| QuikNode | `7752451997e54dc2fd84f08a768cbe037e2d9cc9` | Uniswap | ❌ |

## Notes

- Sequencer-based L2 — no public mempool
- All RPCs return 0 pending txs
- No Origin headers required for any endpoint

## Discovered (JS Bundles, 2026-07-06)

| Source | RPC URL |
|--------|--------|
| Arb-KyberSwap | `https://arbitrum-rpc.kyberswap.com` |
| Arb-Nova | `https://nova.arbitrum.io/rpc` |
| Arb-PublicNode | `https://arbitrum-one-rpc.publicnode.com` |
| Arb-dRPC | `https://arbitrum.drpc.org` |
