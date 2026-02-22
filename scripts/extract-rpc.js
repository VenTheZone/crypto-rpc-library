const { chromium } = require('playwright');

const DEX_LIST = [
  // Solana DEXs
  'jup.ag',
  'raydium.io', 
  'orca.so',
  'pump.fun',
  'meteora.ag',
  'phoenix.fi',
  'lifinity.io',
  'fluxbeam.xyz',
  'drift.trade',
  'solend.fi',
  'marginfi.com',
  'kamino.lend',
  'port.finance',
  'friktion.fi',
  'goosefx.com',
  'aldrin.com',
  'serum DEX', // deprecated but check
  'saber.so',
  'curve.fi',
  'venus.io',
  'ratio.exchange',
];

async function analyzeDEX(url) {
  const results = {
    url: url,
    rpcEndpoints: [],
    apiKeys: [],
    origins: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // Capture all requests
  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    const postData = request.postData();
    
    // Look for RPC endpoints (Solana & EVM)
    if (url.includes('rpc') || url.includes('.solana') || 
        url.includes('helius') || url.includes('quicknode') ||
        url.includes('alchemy') || url.includes('infura') ||
        url.includes('ankr') || url.includes('drpc') ||
        url.includes('publicnode') || url.includes('blockpi') ||
        url.includes('getblock') || url.includes('tenderly')) {
      
      // Extract origin from headers if present
      const headers = request.headers();
      
      results.rpcEndpoints.push({
        url: url,
        method: method,
        origin: headers.origin || headers.referer || '',
        hasPostData: !!postData
      });
    }
  });

  try {
    console.error(`Analyzing: ${url}`);
    await page.goto(url, { timeout: 30000, waitUntil: 'networkidle' });
    
    // Wait for the page to fully load and make dynamic requests
    await page.waitForTimeout(8000);
    
    // Try clicking common elements to trigger more requests
    try {
      await page.click('button', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000);
    } catch (e) {}
    
    // Also extract from JavaScript files
    const jsUrls = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(s => s.src);
    });
    
    // Fetch and analyze main JS bundles
    for (const jsUrl of jsUrls.slice(0, 10)) {
      if (jsUrl.includes('rpc') || jsUrl.includes('config') || jsUrl.includes('wallet')) {
        try {
          const response = await page.request.get(jsUrl);
          const text = await response.text();
          
          // Look for API keys (Helius, QuickNode, Alchemy, etc.)
          const keyPatterns = [
            /helius[_-]?key["']?\s*[:=]\s*["']([a-z0-9-]{20,})/gi,
            /alchemy[_-]?key["']?\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})/gi,
            /quicknode[_-]?key["']?\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})/gi,
            /infura[_-]?key["']?\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})/gi,
            /ankr[_-]?key["']?\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})/gi,
            /["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi, // UUIDs
          ];
          
          for (const pattern of keyPatterns) {
            const matches = text.match(pattern);
            if (matches) {
              for (const match of matches) {
                const key = match.match(/[a-zA-Z0-9_-]{20,}|[a-f0-9-]{36}/);
                if (key && !results.apiKeys.includes(key[0])) {
                  results.apiKeys.push(key[0]);
                }
              }
            }
          }
        } catch (e) {}
      }
    }
    
  } catch (e) {
    results.error = e.message;
  } finally {
    await browser.close();
  }
  
  return results;
}

async function main() {
  const dexes = process.argv.slice(2);
  
  console.error('=== DEX RPC & API Key Scanner ===');
  
  for (const dex of dexes) {
    const url = dex.startsWith('http') ? dex : `https://${dex}`;
    const results = await analyzeDEX(url);
    
    // Deduplicate
    const uniqueRPCs = [];
    const seen = new Set();
    for (const rpc of results.rpcEndpoints) {
      if (!seen.has(rpc.url)) {
        seen.add(rpc.url);
        uniqueRPCs.push(rpc);
      }
    }
    results.rpcEndpoints = uniqueRPCs;
    
    console.log(JSON.stringify(results));
  }
}

main().catch(console.error);
