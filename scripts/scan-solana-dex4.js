const { chromium } = require('playwright');

const DEXES = [
  'https://www.geckoterminal.com/solana/pools',
  'https://coinmarketcap.com/solana/pools/',
  'https://www.coingecko.com/en/dex/solana',
  'https://www.dextools.io/app/solana/pairs',
  'https://solscan.io',
  'https://solanabeach.io',
  'https://solana.com/ecosystem?category=defi',
];

async function scan() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  for (const url of DEXES) {
    console.log(`\n=== Scanning ${url} ===`);
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
          reqUrl.includes('serum') ||
          reqUrl.includes('frontends')) {
        rpcs.push(reqUrl);
      }
    });
    
    try {
      await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    if (rpcs.length > 0) {
      console.log('RPC requests:');
      [...new Set(rpcs)].forEach(r => console.log(`  ${r}`));
    } else {
      console.log('  No RPC found');
    }
    
    await page.close();
  }
  
  await browser.close();
}

scan().catch(console.error);
