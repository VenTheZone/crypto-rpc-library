const { chromium } = require('playwright');

const DEXES = [
  'https://app.reflexer.finance',
  'https://compound.finance',
  'https://aave.com',
  'https://yearn.finance',
  'https://lido.fi',
  'https://rocketpool.net',
  'https://stake.lido.fi',
  'https://convexfinance.com',
  'https://ankr.com',
  'https://www.morphl2.io',
  'https://blast.io',
  'https://zora.coinbase.com',
  'https://optimism.io',
  'https://arbitrum.io',
  'https://base.org',
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
          reqUrl.includes('infura') || 
          reqUrl.includes('alchemy') || 
          reqUrl.includes('quicknode') ||
          reqUrl.includes('ankr') ||
          reqUrl.includes('drpc') ||
          reqUrl.includes('publicnode') ||
          reqUrl.includes('chainstack') ||
          reqUrl.includes('web3') ||
          reqUrl.includes('portal') ||
          (reqUrl.includes('.eth') && reqUrl.includes('//'))) {
        rpcs.push(reqUrl);
      }
    });
    
    try {
      await page.goto(url, { timeout: 20000, waitUntil: 'domcontentloaded' });
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
