const { chromium } = require('playwright');

const DEXES = [
  'https://app.mode.network',
  'https://www.unichain.org',
  'https://zora.co',
  'https://scroll.io',
  'https://www.metall2.com',
  'https://swellnetwork.io',
  'https://fraxtal.com',
  'https://www.inkblockchain.com',
  'https://www.manta.network',
  'https://celestia.org',
  'https://berachain.com',
  'https://soniclabs.com',
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
          reqUrl.includes('portal') ||
          reqUrl.includes('mode') ||
          reqUrl.includes('unichain') ||
          reqUrl.includes('monad')) {
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
