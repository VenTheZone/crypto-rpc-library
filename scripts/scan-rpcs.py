#!/usr/bin/env python3
"""JS bundle RPC scanner + concurrent tester. One file, no deps beyond stdlib+aiohttp."""
import asyncio, aiohttp, json, re, sys, time, os
from collections import defaultdict
from pathlib import Path

# ponytail: limit per chain, raise with --limit N
DEFAULT_LIMIT = 50
CONCURRENT = 10  # ponytail: 10 parallel, tune if rate-limited
TESTS = 5
TIMEOUT_SECS = 3

# DEX frontends per chain — the comprehensive list
DEXS = {
    "ethereum": [
        ("Aave", "https://app.aave.com"),
        ("Uniswap", "https://app.uniswap.org"),
        ("Sushi", "https://www.sushi.com/swap"),
        ("Curve", "https://curve.fi"),
        ("1inch", "https://app.1inch.io"),
        ("CowSwap", "https://cowswap.exchange"),
        ("Balancer", "https://balancer.fi"),
        ("Yearn", "https://yearn.fi"),
        ("Clipper", "https://clipper.exchange"),
        ("DODO", "https://dodoex.io"),
        ("KyberSwap", "https://kyberswap.com/swap/ethereum"),
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("Bancor", "https://app.bancor.network"),
        ("Frax", "https://app.frax.finance"),
        ("Badger", "https://app.badger.com"),
        ("Morpho", "https://morpho.org"),
        ("Pendle", "https://pendle.finance"),
        ("Connext", "https://connext.network"),
        ("Hop", "https://hop.exchange"),
        ("Across", "https://across.to"),
        ("Stargate", "https://stargate.finance"),
        ("Socket", "https://socket.tech"),
        ("LiFi", "https://li.fi"),
        ("Firebird", "https://firebird.finance"),
        ("Synapse", "https://synapseprotocol.com"),
        ("Wormhole", "https://wormhole.com"),
        ("Multichain", "https://multichain.xyz"),
        ("Socket", "https://app.socket.tech"),
        ("Bungee", "https://bungee.exchange"),
        ("Rango", "https://rango.exchange"),
        ("ChainHop", "https://chainhop.exchange"),
        ("O3Swap", "https://o3swap.com"),
        ("ParaSwap", "https://paraswap.io"),
        ("Matcha", "https://matcha.xyz"),
        ("DEX Screener", "https://dexscreener.com/ethereum"),
        ("Gecko Terminal", "https://geckoterminal.com/ethereum"),
    ],
    "base": [
        ("Aerodrome", "https://aerodrome.finance"),
        ("Uniswap", "https://app.uniswap.org/swap/base"),
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("Sushi", "https://www.sushi.com/swap/base"),
        ("Curve", "https://curve.fi"),
        ("BaseSwap", "https://baseswap.fi"),
        ("SwapBase", "https://swapbase.io"),
        ("RocketSwap", "https://rocketswap.app"),
        ("Beets", "https://beets.fi"),
        ("Zora", "https://zora.co"),
        ("Velodrome", "https://velodrome.finance"),
    ],
    "arbitrum": [
        ("Uniswap", "https://app.uniswap.org/swap/arbitrum"),
        ("Sushi", "https://www.sushi.com/swap/arbitrum"),
        ("Camelot", "https://app.camelot.exchange"),
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("Curve", "https://curve.fi"),
        ("KyberSwap", "https://kyberswap.com/swap/arbitrum"),
        ("1inch", "https://app.1inch.io"),
        ("DODO", "https://dodoex.io"),
        ("TraderJoe", "https://traderjoexyz.com"),
        ("Radiant", "https://radiant.capital"),
        ("Vesta", "https://vestafinance.xyz"),
        ("WOO", "https://woo.org"),
        ("GMX", "https://gmx.io"),
        ("Gains", "https://gainsnetwork.io"),
        ("Dopex", "https://dopex.io"),
    ],
    "polygon": [
        ("Uniswap", "https://app.uniswap.org/swap/polygon"),
        ("Sushi", "https://www.sushi.com/swap/polygon"),
        ("QuickSwap", "https://quickswap.exchange"),
        ("Curve", "https://curve.fi"),
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("KyberSwap", "https://kyberswap.com/swap/polygon"),
        ("1inch", "https://app.1inch.io"),
        ("DODO", "https://dodoex.io"),
        ("Beets", "https://beets.fi"),
        ("MeshSwap", "https://meshswap.fi"),
        ("DFyn", "https://dfyn.network"),
    ],
    "optimism": [
        ("Velodrome", "https://velodrome.finance"),
        ("Uniswap", "https://app.uniswap.org/swap/optimism"),
        ("Sushi", "https://www.sushi.com/swap/optimism"),
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("Curve", "https://curve.fi"),
        ("KyberSwap", "https://kyberswap.com/swap/optimism"),
        ("1inch", "https://app.1inch.io"),
        ("Beets", "https://beets.fi"),
        ("Sonnet", "https://sonnet.xyz"),
        ("Rubicon", "https://rubicon.finance"),
    ],
    "bsc": [
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("Uniswap", "https://app.uniswap.org/swap/bsc"),
        ("Sushi", "https://www.sushi.com/swap/bsc"),
        ("DODO", "https://dodoex.io"),
        ("BiSwap", "https://biswap.org"),
        ("MDEX", "https://mdex.com"),
        ("ApeSwap", "https://apeswap.finance"),
        ("Biswap", "https://biswap.org"),
        ("BabySwap", "https://babyswap.finance"),
        ("Wault", "https://wault.finance"),
        ("Autofarm", "https://autofarm.network"),
        ["Beefy", "https://beefy.finance"],
    ],
    "avalanche": [
        ("TraderJoe", "https://traderjoexyz.com"),
        ("Pangolin", "https://pangolin.exchange"),
        ("Sushi", "https://www.sushi.com/swap/avalanche"),
        ("Curve", "https://curve.fi"),
        ("PancakeSwap", "https://pancakeswap.finance"),
        ("Beets", "https://beets.fi"),
        ("Lydia", "https://lydia.finance"),
        ("Wombat", "https://wombat.exchange"),
    ],
}

# Chain-specific RPC patterns for filtering
CHAIN_PATTERNS = {
    "ethereum": ["eth", "mainnet"],
    "base": ["base"],
    "arbitrum": ["arb", "arbitrum"],
    "polygon": ["polygon", "matic"],
    "optimism": ["optimism", "op-mainnet", "optimistic"],
    "bsc": ["bsc", "bnb", "opbnb"],
    "avalanche": ["avax", "avalanche"],
}


async def fetch_js_bundle(session, url):
    """Fetch page HTML, extract script URLs."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10),
                               headers={"User-Agent": "Mozilla/5.0"}) as resp:
            html = await resp.text()
            scripts = re.findall(r'src=["\']([^"\']*\.js[^"\']*)', html)
            return scripts
    except Exception:
        return []


async def fetch_bundle_and_extract(session, script_url):
    """Fetch a JS bundle, extract RPC URLs."""
    rpcs = set()
    try:
        async with session.get(script_url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
            js = await resp.text()
            # Match URLs that look like RPCs (exclude images, etherscan pages, etc.)
            for match in re.findall(r'["\']([^"\']+)["\']', js):
                ml = match.lower()
                # Must start with http
                if not match.startswith('http'):
                    continue
                # Exclude non-RPC patterns
                if any(x in ml for x in ['/token/', '/address/', '.svg', '.png', '.jpg',
                                         'etherscan.io', 'blockscout', 'blastscan',
                                         'geckoterminal', 'dexscreener', '/swap',
                                         '/bridge', '/pool', '/app', '/trade']):
                    continue
                # Must look like an RPC endpoint
                if any(x in ml for x in ['rpc', 'node', 'provider', 'infura', 'alchemy',
                                         'ankr', 'drpc', 'publicnode', 'blast', 'quicknode',
                                         'llamarpc', 'flashbots', '1rpc', 'blockpi',
                                         'nodereal', 'getblock', 'chainlist']):
                    rpcs.add(match.rstrip('/'))
    except Exception:
        pass
    return rpcs


async def discover_rpcs(session, chain):
    """Discover RPCs from DEX JS bundles."""
    dexs = DEXS.get(chain, [])
    all_rpcs = {}  # rpc_url -> source_dex

    tasks = []
    for name, url in dexs:
        scripts = await fetch_js_bundle(session, url)
        for script_url in scripts:
            if script_url.startswith("//"):
                script_url = "https:" + script_url
            elif not script_url.startswith("http"):
                from urllib.parse import urljoin
                script_url = urljoin(url, script_url)
            tasks.append((name, script_url))

    # Fetch bundles concurrently
    sem = asyncio.Semaphore(10)
    async def limited_fetch(name, script_url):
        async with sem:
            rpcs = await fetch_bundle_and_extract(session, script_url)
            for rpc in rpcs:
                if rpc not in all_rpcs:
                    all_rpcs[rpc] = name

    await asyncio.gather(*[limited_fetch(n, u) for n, u in tasks])
    return all_rpcs


async def test_rpc(session, url, origin=None):
    """Test a single RPC: latency + RPS."""
    payload = json.dumps({"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1})
    headers = {"Content-Type": "application/json"}
    if origin:
        headers["Origin"] = origin
        headers["Referer"] = origin + "/"

    try:
        # Latency (single request)
        t0 = time.monotonic()
        async with session.post(url, data=payload, headers=headers,
                                timeout=aiohttp.ClientTimeout(total=TIMEOUT_SECS)) as resp:
            body = await resp.json(content_type=None)
            latency = int((time.monotonic() - t0) * 1000)
            if "result" not in body:
                return None, None, f"NO_RESULT:{body.get('error',{}).get('message','')}"

        # RPS (5 requests)
        t0 = time.monotonic()
        for _ in range(TESTS):
            async with session.post(url, data=payload, headers=headers,
                                    timeout=aiohttp.ClientTimeout(total=TIMEOUT_SECS)) as resp:
                await resp.json(content_type=None)
        elapsed_ms = (time.monotonic() - t0) * 1000
        rps = round(TESTS * 1000 / elapsed_ms, 1) if elapsed_ms > 0 else 0

        return latency, rps, "OK"
    except Exception as e:
        return None, None, f"FAIL:{type(e).__name__}"


async def test_all(session, rpcs, chain, limit):
    """Test all RPCs concurrently, return working + dead."""
    origin_map = {
        "ethereum": "https://app.uniswap.org",
        "base": "https://aerodrome.finance",
        "arbitrum": "https://app.uniswap.org",
        "polygon": "https://app.uniswap.org",
        "optimism": "https://velodrome.finance",
        "bsc": "https://pancakeswap.finance",
        "avalanche": "https://traderjoexyz.com",
    }
    origin = origin_map.get(chain)

    # Test first `limit` RPCs
    rpc_list = list(rpcs.items())[:limit]  # ponytail: dict.items() = (url, source)
    sem = asyncio.Semaphore(CONCURRENT)
    results = []

    async def limited_test(url, source):
        async with sem:
            lat, rps, status = await test_rpc(session, url, origin)
            results.append((source, url, lat, rps, status))

    await asyncio.gather(*[limited_test(url, src) for url, src in rpc_list])

    working = [(s, u, l, r, st) for s, u, l, r, st in results if st == "OK" and r is not None]
    dead = [(s, u, st) for s, u, l, r, st in results if st != "OK"]
    working.sort(key=lambda x: -x[3])  # sort by RPS desc
    return working, dead


async def main():
    chain = sys.argv[1] if len(sys.argv) > 1 else "ethereum"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_LIMIT

    print(f"Scanning {chain} (limit={limit})")

    async with aiohttp.ClientSession() as session:
        # Discover
        print("Discovering RPCs from JS bundles...")
        rpcs = await discover_rpcs(session, chain)
        print(f"Found {len(rpcs)} unique RPCs")

        # Test
        print(f"Testing top {min(limit, len(rpcs))} RPCs (concurrent={CONCURRENT})...")
        working, dead = await test_all(session, rpcs, chain, limit)
        print(f"Working: {len(working)}, Dead: {len(dead)}")

        # Output
        out_dir = Path(__file__).parent.parent / "networks" / "evm" / chain
        out_dir.mkdir(parents=True, exist_ok=True)

        # working.md
        with open(out_dir / "working.md", "w") as f:
            f.write(f"# {chain.upper()} — Working RPCs\n\n")
            f.write(f"| # | Source | RPC URL | Latency | RPS | Origin | Method |\n")
            f.write(f"|---|--------|---------|---------|-----|--------|--------|\n")
            for i, (src, url, lat, rps, _) in enumerate(working, 1):
                f.write(f"| {i} | {src} | `{url}` | {lat}ms | {rps} | yes | js-bundle |\n")
            f.write(f"\n**{len(working)} working RPCs**\n")

        # dead.md
        with open(out_dir / "dead.md", "w") as f:
            f.write(f"# {chain.upper()} — Dead RPCs\n\n")
            f.write(f"| Source | RPC URL | Status |\n")
            f.write(f"|--------|---------|--------|\n")
            for src, url, status in dead[:50]:
                f.write(f"| {src} | `{url}` | {status} |\n")
            f.write(f"\n**{len(dead)} dead RPCs**\n")

        # Print top 10
        print(f"\nTop 10 {chain} RPCs by RPS:")
        for i, (src, url, lat, rps, _) in enumerate(working[:10], 1):
            print(f"  {i}. {rps} RPS | {lat}ms | {src} | {url}")


if __name__ == "__main__":
    asyncio.run(main())
