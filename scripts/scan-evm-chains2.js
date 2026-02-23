const { chromium } = require('playwright');

const DEXES = [
  'https://www.base.org',
  'https://base.org',
  'https://www.optimism.io',
  'https://www.arbitrum.io',
  'https://www.blast.io',
  'https://www.mode.network',
  'https://www.zora.co',
  'https://www.inkblockchain.com',
  'https://www.metall2.com',
  'https://www.manta.network',
];

async function scan() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  for (const url of DEXES) {
    console.log(`\n=== ${url} ===`);
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
          reqUrl.includes('dkey=') ||
          reqUrl.includes('api-key')) {
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
      [...new Set(rpcs)].forEach(r => console.log(r));
    } else {
      console.log('No RPC found');
    }
    
    await page.close();
  }
  
  await browser.close();
}

scan().catch(console.error);
