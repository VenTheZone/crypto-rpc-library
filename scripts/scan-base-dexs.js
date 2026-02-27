const { chromium } = require('playwright');

// Base-specific DEXs - ordered by volume
const BASE_DEXS = [
  // Top DEXs by volume
  'https://aerodrome.finance',
  'https://app.uniswap.org',
  'https://pancakeswap.finance',
  
  // Base-native DEXs
  'https://baseswap.fi',
  'https://rocketswap.exchange',
  'https://equalizer.exchange',
  
  // Multi-chain DEXs on Base
  'https://www.sushi.com',
  'https://curve.fi',
  'https://mav.xyz',
  'https://matcha.xyz',
  
  // More Base DEXs
  'https://synfutures.com',
  'https://app.dodoex.io',
  'https://kyberswap.com',
  'https://app.osmosis.zone', // Cosmos but let's check
  
  // Aggregators
  'https://jumper.exchange',
  'https://li.fi',
  'https://app.odos.xyz',
];

async function scan() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const allRpcs = new Map(); // URL -> sources
  
  for (const url of BASE_DEXS) {
    console.log(`\n=== Scanning ${url} ===`);
    const page = await context.newPage();
    
    const rpcs = [];
    page.on('request', async (req) => {
      const reqUrl = req.url();
      // RPC patterns
      if (reqUrl.includes('rpc') || 
          reqUrl.includes('infura') || 
          reqUrl.includes('alchemy') || 
          reqUrl.includes('quicknode') ||
          reqUrl.includes('ankr') ||
          reqUrl.includes('drpc') ||
          reqUrl.includes('publicnode') ||
          reqUrl.includes('chainstack') ||
          reqUrl.includes('llamarpc') ||
          reqUrl.includes('meowrpc') ||
          reqUrl.includes('blastapi') ||
          reqUrl.includes('getblock') ||
          reqUrl.includes('nodereal') ||
          reqUrl.includes('.base.org') ||
          reqUrl.includes('base') ||
          reqUrl.includes('web3') ||
          reqUrl.includes('portal')) {
        
        // Filter for JSON-RPC looking URLs
        if (reqUrl.startsWith('http') && 
            (reqUrl.includes('/rpc') || 
             reqUrl.includes('base') ||
             reqUrl.includes('ethereum') ||
             reqUrl.includes('optimism'))) {
          rpcs.push(reqUrl);
        }
      }
    });
    
    try {
      await page.goto(url, { timeout: 30000, waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Try to trigger more network requests
      try {
        await page.mouse.move(100, 100);
        await page.waitForTimeout(1000);
      } catch (e) {}
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    const uniqueRpcs = [...new Set(rpcs)];
    if (uniqueRpcs.length > 0) {
      console.log('  Found RPCs:');
      uniqueRpcs.forEach(r => {
        console.log(`    ${r}`);
        const existing = allRpcs.get(r) || [];
        existing.push(url);
        allRpcs.set(r, existing);
      });
    } else {
      console.log('  No RPC found');
    }
    
    await page.close();
  }
  
  await browser.close();
  
  // Summary
  console.log('\n\n========== BASE RPC SUMMARY ==========\n');
  console.log('| Source | RPC URL |');
  console.log('|--------|---------|');
  for (const [rpc, sources] of allRpcs) {
    const source = sources[0].replace('https://', '').replace('http://', '').split('/')[0];
    console.log(`| ${source} | ${rpc} |`);
  }
}

scan().catch(console.error);
