# RPC Library - Documentation

## Quick Links

### Solana
- [DEX RPCs (Manual)](networks/solana/dex/rpcs.md) - Manually tested DEX RPCs
- [All Tested RPCs](networks/solana/solana-tested.md)

### EVM Chains
- [Ethereum](networks/evm/eth-tested.md)
- [BNB Chain](networks/evm/bnb-tested.md)
- [Polygon](networks/evm/polygon/polygon-tested.md)
- [Arbitrum](networks/evm/arbitrum/arbitrum-tested.md)
- [Optimism](networks/evm/optimism/optimism-tested.md)
- [Base](networks/evm/base-tested.md)
- [Avalanche](networks/avalanche/avalanche-tested.md)
- [Fantom](networks/evm/fantom-tested.md)
- [zkSync Era](networks/evm/zksync/zksync-tested.md)
- [Linea](networks/evm/linea/linea-tested.md)
- [Mantle](networks/evm/mantle/mantle-tested.md)
- [Scroll](networks/evm/scroll/scroll-tested.md)
- [Celo](networks/evm/celo/celo-tested.md)

## Usage

### Discover RPCs from DEX Frontends
```bash
# Discover Solana DEXs
./bin/crypto-rpc discover-dex solana

# Discover EVM DEXs
./bin/crypto-rpc discover-dex evm
```

### Test RPCs
```bash
./bin/crypto-rpc test -i <input.md> -o <output.md>
```

## Best RPCs by Category

### Highest RPS (Free)
| Chain | RPC | RPS |
|-------|-----|-----|
| BNB | Ankr | 1196 |
| Base | Ankr | 700+ |
| Optimism | Ankr | 637 |
| Linea | Blast | 583 |

### Safe TX (No Mempool)
- Solana: All (no mempool)
- Ankr, Blast, BlockPi: All chains
- Ethereum: Blast, Cloudflare

### DEX RPCs Found
- Raydium: rpcpool.com (131 RPS)
- Meteora: rpcpool.com (147 RPS)
- Pump.fun: Helius (71 RPS)
- Apeswap: Ankr (420 RPS)
