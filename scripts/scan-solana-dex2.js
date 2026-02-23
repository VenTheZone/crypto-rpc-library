const { chromium } = require('playwright');

const DEXES = [
  'https://dexlab.space',
  'https://dex.guru',
  'https://saros.io',
  'https://alphadex.ai',
  'https://orca.so',
  'https://jup.ag',
  'https://crema.finance',
  'https://lifinity.io',
  'https://phoenix.fi',
  'https://atrix.finance',
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
          reqUrl.includes('triton')) {
        const method = req.method();
        const postData = req.postData() || '';
        rpcs.push({ url: reqUrl, method, postData: postData.substring(0, 200) });
      }
    });
    
    try {
      await page.goto(url, { timeout: 20000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000);
      
      // Look for RPC in page source
      const content = await page.content();
      const rpcMatches = content.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.solana[^\s"'<]+/g) || [];
      const rpcMatches2 = content.match(/https?:\/\/[a-zA-Z0-9\-\.]+\/rpc[^\s"'<]+/g) || [];
      const rpcMatches3 = content.match(/https?:\/\/[a-zA-Z0-9\-\.]+helius[^\s"'<]+/g) || [];
      const rpcMatches4 = content.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.com\/[a-zA-Z0-9\-\.]+\/[a-zA-Z0-9\-\.]+/g) || [];
      
      const allMatches = [...new Set([...rpcMatches, ...rpcMatches2, ...rpcMatches3, ...rpcMatches4])];
      
      if (allMatches.length > 0) {
        console.log('Found in HTML:');
        allMatches.forEach(m => console.log('  ' + m));
      }
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    if (rpcs.length > 0) {
      console.log('RPC requests:');
      rpcs.forEach(r => console.log(`  ${r.method} ${r.url}`));
    } else {
      console.log('  No RPC found');
    }
    
    await page.close();
  }
  
  await browser.close();
}

scan().catch(console.error);
