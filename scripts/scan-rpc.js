const { chromium } = require('playwright');

async function scanDEX(url) {
  const results = {
    rpcEndpoints: [],
    errors: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // Capture all requests
  page.on('request', request => {
    const reqUrl = request.url();
    
    // Look for RPC-related URLs
    if (reqUrl.includes('rpc') || reqUrl.includes('.solana') || 
        reqUrl.includes('helius') || reqUrl.includes('quicknode') ||
        reqUrl.includes('alchemy') || reqUrl.includes('ankr') ||
        reqUrl.includes('drpc') || reqUrl.includes('publicnode') ||
        reqUrl.includes('blockpi') || reqUrl.includes('getblock') ||
        reqUrl.includes('rpcpool') || reqUrl.includes('tenderly')) {
      
      results.rpcEndpoints.push(reqUrl);
    }
  });

  try {
    console.error(`Loading: ${url}`);
    await page.goto(url, { timeout: 25000, waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Try to trigger more requests
    await page.evaluate(() => {
      // Try clicking something
      const btn = document.querySelector('button');
      if (btn) btn.click();
    });
    await page.waitForTimeout(3000);
    
  } catch (e) {
    results.errors.push(e.message);
  } finally {
    await browser.close();
  }
  
  // Deduplicate
  results.rpcEndpoints = [...new Set(results.rpcEndpoints)];
  
  console.log(JSON.stringify(results));
}

const dex = process.argv[2] || 'https://jup.ag';
scanDEX(dex.startsWith('http') ? dex : `https://${dex}`);
