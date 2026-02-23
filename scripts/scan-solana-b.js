const { chromium } = require('playwright');

const DEXES = [
  'https://larix.finance',
  'https://solfarm.io',
  'https://saber.so',
  'https://mercuria.finance',
  'https://goosefx.io',
  'https://step.finance',
  'https://marinade.finance',
  'https://socean.fi',
  'https://dexlab.space',
  'https://alphadex.ai',
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
      [...new Set(rpcs)].forEach(r => console.log(r));
    } else {
      console.log('No RPC found');
    }
    
    await page.close();
  }
  
  await browser.close();
}

scan().catch(console.error);
