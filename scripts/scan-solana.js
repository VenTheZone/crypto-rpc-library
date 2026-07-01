const { chromium } = require('playwright');

// Categories: DEX aggregators, AMMs, lending, yield, NFTs, wallets, data, infra
const CATEGORIES = {
  aggregators: ['https://orca.so', 'https://jup.ag', 'https://drift.trade', 'https://kamino.lend', 'https://marginfi.com', 'https://port.finance', 'https://francium.io', 'https://apricot.app', 'https://ratio.money', 'https://tulip.money'],
  lending: ['https://solend.fi', 'https://mango.markets', 'https://vault.so', 'https://cyclum.fi', 'https://ratex.solana.com', 'https://defi.solana.com', 'https://jetprotocol.io', 'https://saber.so', 'https://swaprum.io', 'https://oxygen.fi'],
  dex: ['https://raydium.io', 'https://pancakeswap.finance', 'https://meteora.ag', 'https://lifinity.io', 'https://step.finance', 'https://dexlab.space', 'https://aldrin.com', 'https://serumswap.xyz'],
  nft: ['https://magiceden.io', 'https://opensea.io', 'https://tensor.trade', 'https://exchange.art', 'https://digitaleyes.market', 'https://solportal.io', 'https://solsea.io', 'https://solanalysis.com', 'https://howrare.is', 'https://beta.solanart.io'],
  wallets: ['https://phantom.app', 'https://solflare.com', 'https://backpack.app', 'https://glow.app', 'https://slope.finance', 'https://martianwallet.xyz', 'https://nightly.app', 'https://neonwallet.com', 'https://solet.app', 'https://xbull.app'],
  other: ['https://solanabeach.io', 'https://explorer.solana.com', 'https://solscan.io', 'https://stepn.com', 'https://audius.co', 'https://hnt.to', 'https://media.network', 'https://staratlas.com', 'https://genopets.me', 'https://degenape.io'],
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
            reqUrl.includes('helius') ||
            reqUrl.includes('alchemy') ||
            reqUrl.includes('quicknode') ||
            reqUrl.includes('solana') ||
            reqUrl.includes('rpcpool') ||
            reqUrl.includes('triton') ||
            reqUrl.includes('puya') ||
            reqUrl.includes('mainnet-beta') ||
            reqUrl.includes('frontends') ||
            reqUrl.includes('serum')) {
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
