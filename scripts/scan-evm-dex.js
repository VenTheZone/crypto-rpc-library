const { chromium } = require('playwright');

const DEXES = [
  'https://app.uniswap.org',
  'https://app.sushi.com',
  'https://curve.fi',
  'https://balancer.fi',
  'https://dodoex.io',
  'https://clipper.exchange',
  'https://kyberswap.com',
  'https://pancakeswap.finance',
  'https://apeswap.finance',
  'https://traderjoexyz.com',
  'https://camelot.exchange',
  'https://velodrome.finance',
  'https://aerodrome.finance',
  'https://synthetix.io',
  'https://perp.com',
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
          (reqUrl.includes('.eth') && reqUrl.includes('//'))) {
        rpcs.push(reqUrl);
      }
    });
    
    try {
      await page.goto(url, { timeout: 20000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(4000);
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
