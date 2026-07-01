const { chromium } = require('playwright');

// Categories: L2 chains, DEX aggregators, major DeFi, specific DEXes, new chains
const CATEGORIES = {
  l2: ['https://app.mode.network', 'https://www.unichain.org', 'https://zora.co', 'https://scroll.io', 'https://www.metall2.com', 'https://swellnetwork.io', 'https://fraxtal.com', 'https://www.inkblockchain.com', 'https://www.manta.network', 'https://celestia.org', 'https://berachain.com', 'https://soniclabs.com'],
  l2_extra: ['https://taiko.xyz', 'https://blast.io', 'https://linea.build', 'https://zksync.io', 'https://base.org', 'https://arbitrum.io', 'https://optimism.io', 'https://www.metis.io', 'https://astar.network', 'https://polygon.technology'],
  dex: ['https://app.uniswap.org', 'https://app.sushi.com', 'https://curve.fi', 'https://balancer.fi', 'https://dodoex.io', 'https://clipper.exchange', 'https://kyberswap.com', 'https://pancakeswap.finance', 'https://traderjoexyz.com', 'https://spookyswap.finance', 'https://quickswap.exchange', 'https://matcha.xyz', 'https://paraswap.io', 'https://1inch.io', 'https://openocean.finance'],
  dex_extra: ['https://aerodrome.finance', 'https://velodrome.finance', 'https://swapr.eth.limo', 'https://honeyswap.org', 'https://ubeswap.org', 'https://zipswap.fi', 'https://xexchange.com', 'https://pulsex.com', 'https://wagmi.tc', 'https://gem.xyz', 'https://defillama.com', 'https://coingecko.com', 'https://dex.guru', 'https://geckoterminal.com', 'https://debank.com'],
  major: ['https://app.aave.com', 'https://compound.finance', 'https://makerdao.com', 'https://lido.fi', 'https://rocketpool.net', 'https://stargate.finance', 'https://layerzero.network', 'https://chain.link', 'https://thegraph.com', 'https://ens.domains', 'https://app.synthetix.io', 'https://gmx.io', 'https://dydx.exchange', 'https://polymarket.com', 'https://opensea.io'],
};

async function scan() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const [catName, urls] of Object.entries(CATEGORIES)) {
    console.log(`\n=== Category: ${catName} (${urls.length} sites) ===`);
    for (const url of urls) {
      console.log(`\n--- ${url} ---`);
      const page = await context.newPage();
      const rpcs = [];

      page.on('request', async (req) => {
        const reqUrl = req.url();
        if (reqUrl.includes('rpc') ||
            reqUrl.includes('infura') ||
            reqUrl.includes('alchemy') ||
            reqUrl.includes('quicknode') ||
            reqUrl.includes('ankr') ||
            reqUrl.includes('drpc') ||
            reqUrl.includes('publicnode') ||
            reqUrl.includes('chainstack') ||
            reqUrl.includes('portal') ||
            reqUrl.includes('mode') ||
            reqUrl.includes('unichain') ||
            reqUrl.includes('monad')) {
          rpcs.push(reqUrl);
        }
      });

      try {
        await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }

      if (rpcs.length > 0) {
        [...new Set(rpcs)].forEach(r => console.log(`  ${r}`));
      } else {
        console.log('  No RPC found');
      }

      await page.close();
    }
  }

  await browser.close();
}

scan().catch(console.error);
