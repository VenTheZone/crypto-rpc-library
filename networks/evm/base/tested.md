# Base — RPC Endpoints

Chain ID: 8453
RPC: EVM (geth-compatible)
Native token: ETH
Block time: ~2s

## Mempool: ❌ NO (0 pending — tested 2026-07-06)

## Working Endpoints

| Name | URL | Latency | Mempool | Origin | Status |
|------|-----|---------|---------|--------|--------|
| PublicNode | `https://base-rpc.publicnode.com` | — | ❌ | No | working |
| dRPC | `https://base.drpc.org` | — | ❌ | No | working |
| Official | `https://mainnet.base.org` | — | ❌ | No | working |
| QuikNode (Uniswap) | `https://wandering-serene-patron.base-mainnet.quiknode.pro/cab818b8d9cfa00a7a07cd42520ae78417394e58` | — | ❌ | No | working |
| QuikNode (Sushi) | `https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | — | ❌ | No | working |

## API Keys

| Provider | Key | Source | Mempool |
|----------|-----|--------|---------|
| QuikNode | `cab818b8d9cfa00a7a07cd42520ae78417394e58` | Uniswap | ❌ |
| QuikNode | `afc8a0038cd744f30fd210e6f8c6b59ed5817bd7` | Sushi | ❌ |

## Notes

- OP Stack sequencer — no public mempool
- All RPCs return 0 pending txs
- No Origin headers required for any endpoint

## Discovered (JS Bundles, 2026-07-06)

| Source | RPC URL |
|--------|--------|
| Base-Coinbase | `https://rpc.wallet.coinbase.com` |
| Base-MeowRPC | `https://base.meowrpc.com` |
| Base-Privy | `https://base-mainnet.rpc.privy.systems` |
| Frax | `https://rpc.frax.com` |
| InkOnChain-Gelato | `https://rpc-gel.inkonchain.com` |
| InkOnChain-QND | `https://rpc-qnd.inkonchain.com` |
| Metall2 | `https://rpc.metall2.com` |
| PancakeSwap-BSC | `https://bscrpc.pancakeswap.finance` |
| Soneium | `https://rpc.soneium.org` |
