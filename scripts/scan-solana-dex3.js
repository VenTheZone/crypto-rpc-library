const { chromium } = require('playwright');

const DEXES = [
  'https://kamino.lend',
  'https://drift.trade',
  'https://francium.io',
  'https://apricot.app',
  'https://ratio.money',
  'https://solfarm.io',
  'https://saber.so',
  'https://mercuria.finance',
  'https://tulip.money',
  'https://larix.finance'
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
          reqUrl.includes('mainnet-beta')) {
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
