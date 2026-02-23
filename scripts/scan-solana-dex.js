const { chromium } = require('playwright');

const DEXES = [
  'https://dexscreener.com/solana',
  'https://birdeye.so',
  'https://solana.fm',
  'https://goosefx.io',
  'https://step.finance',
  'https://marinade.finance',
  'https://socean.fi',
  'https://jpool.jps'
];

async function scan() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const rpcs = new Set();
  const requests = [];
  
  for (const url of DEXES) {
    console.log(`\n=== Scanning ${url} ===`);
    const page = await context.newPage();
    
    page.on('request', (req) => {
      const url = req.url();
      requests.push(url);
      if (url.includes('rpc') || url.includes(' RPC')) {
        console.log(`  RPC: ${url}`);
        rpcs.add(url);
      }
    });
    
    try {
      await page.goto(url, { timeout: 15000, waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    await page.close();
  }
  
  console.log('\n=== All RPC requests found ===');
  requests.forEach(r => {
    if (r.includes('rpc') || r.includes('solana') || r.includes('helius') || r.includes('alchemy') || r.includes('quicknode') || r.includes('triton') || r.includes('puya')) {
      console.log(r);
    }
  });
  
  await browser.close();
}

scan().catch(console.error);
