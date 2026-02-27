const { chromium } = require('playwright');
const fs = require('fs');

// Base DEXs to scan - COMPLETE LIST (20+ DEXs)
const DEX_SITES = [
  // === TOP BY VOLUME ===
  { name: 'Aerodrome', url: 'https://aerodrome.finance/swap' },
  { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=base' },
  { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap?chain=base' },
  
  // === BASE-NATIVE DEXs ===
  { name: 'BaseSwap', url: 'https://baseswap.fi/swap' },
  { name: 'RocketSwap', url: 'https://rocketswap.exchange' },
  { name: 'Equalizer', url: 'https://equalizer.exchange' },
  
  // === MULTI-CHAIN DEXs ===
  { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=8453' },
  { name: 'DodoEx', url: 'https://app.dodoex.io/swap?network=base' },
  { name: 'KyberSwap', url: 'https://kyberswap.com/swap/base' },
  { name: 'Maverick', url: 'https://app.mav.xyz' },
  { name: 'Curve', url: 'https://curve.fi/base/swap' },
  
  // === AGGREGATORS (often have more RPC keys) ===
  { name: 'Matcha', url: 'https://matcha.xyz/?chain=base' },
  { name: '1inch', url: 'https://app.1inch.io/8453/swap' },
  { name: 'Paraswap', url: 'https://app.paraswap.io?network=base' },
  { name: 'Odos', url: 'https://app.odos.xyz?chain=base' },
  { name: 'OpenOcean', url: 'https://app.openocean.finance?network=Base' },
  { name: 'Jumper', url: 'https://jumper.exchange?fromChain=base' },
  { name: 'LI.FI', url: 'https://li.fi?chain=base' },
  
  // === PERPS / OTHER ===
  { name: 'SynFutures', url: 'https://app.synfutures.com' },
  { name: 'HyperSwag', url: 'https://hyperswag.io' },
];

// Base chainId = 8453 (0x2105)
const BASE_CHAIN_ID = '8453';

async function scan() {
  console.log('# Base RPC Discovery - Network Interception\n');
  
  const browser = await chromium.launch({ headless: true });
  const allRpcs = new Map();
  
  for (const dex of DEX_SITES) {
    console.log(`\n## Scanning ${dex.name}: ${dex.url}`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const rpcRequests = [];
    const jsFiles = [];
    
    // Intercept ALL requests
    page.on('request', request => {
      const url = request.url();
      const method = request.method();
      const postData = request.postData();
      
      // Check for JSON-RPC calls
      if (postData && (postData.includes('eth_') || postData.includes('net_') || postData.includes('web3_'))) {
        try {
          const json = JSON.parse(postData);
          rpcRequests.push({
            url,
            method: json.method,
            postData: postData.substring(0, 500),
          });
          
          if (!allRpcs.has(url)) {
            allRpcs.set(url, { dex: dex.name, methods: [] });
          }
          allRpcs.get(url).methods.push(json.method);
        } catch (e) {}
      }
      
      // Track JS files
      if (url.endsWith('.js') || url.includes('.js?')) {
        jsFiles.push(url);
      }
    });
    
    // Intercept responses to find RPC URLs in response bodies
    page.on('response', async response => {
      const url = response.url();
      
      // Check JS files for embedded RPC URLs
      if (url.endsWith('.js') || url.includes('.js?')) {
        try {
          const body = await response.text();
          
          // Find RPC URLs in JS
          const rpcPatterns = [
            /https?:\/\/[^"'\s]*(?:base|rpc)[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*\.drpc\.org[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*\.publicnode\.com[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*\.llamarpc\.com[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*\.meowrpc\.com[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*infura\.io[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*alchemy\.com[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*quicknode\.com[^"'\s]*/gi,
            /https?:\/\/[^"'\s]*ankr\.com[^"'\s]*/gi,
          ];
          
          for (const pattern of rpcPatterns) {
            const matches = body.match(pattern) || [];
            for (const match of matches) {
              // Clean up URL
              const cleanUrl = match.replace(/['"\\]/g, '').split(',')[0];
              if (cleanUrl.length > 10 && cleanUrl.includes('http')) {
                if (!allRpcs.has(cleanUrl)) {
                  allRpcs.set(cleanUrl, { dex: dex.name, methods: ['found_in_js'], source: url });
                }
              }
            }
          }
        } catch (e) {}
      }
    });
    
    try {
      console.log(`  Loading page...`);
      await page.goto(dex.url, { timeout: 45000, waitUntil: 'networkidle' });
      
      // Wait for RPC calls
      await page.waitForTimeout(2000);
      
      // Try to trigger wallet connection
      try {
        const connectBtn = await page.$('button:has-text("Connect"), button:has-text("Wallet")');
        if (connectBtn) {
          await connectBtn.hover();
          await page.waitForTimeout(500);
        }
      } catch (e) {}
      
      // Move mouse to trigger lazy-loaded content
      await page.mouse.move(500, 300);
      await page.waitForTimeout(1000);
      
      console.log(`  Found ${rpcRequests.length} RPC requests, ${jsFiles.length} JS files`);
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    await page.close();
    await context.close();
  }
  
  await browser.close();
  
  // Print results
  console.log('\n\n# ========================================');
  console.log('# ALL DISCOVERED BASE RPCs');
  console.log('# ========================================\n');
  
  // Filter for Base-specific RPCs
  const baseRpcs = [];
  for (const [url, info] of allRpcs) {
    // Check if it's likely a Base RPC
    if (url.includes('base') || 
        url.includes('8453') ||
        info.methods.includes('eth_chainId') ||
        info.methods.includes('found_in_js')) {
      baseRpcs.push({ url, ...info });
    }
  }
  
  console.log('| Source | RPC URL | Notes |');
  console.log('|--------|---------|-------|');
  for (const rpc of baseRpcs) {
    const notes = rpc.methods.includes('found_in_js') ? 'from JS bundle' : rpc.methods.join(', ');
    console.log(`| ${rpc.dex} | ${rpc.url} | ${notes} |`);
  }
  
  // Write to file
  const output = {
    scanned: DEX_SITES.map(d => d.name),
    discovered: baseRpcs,
    allRpcs: Object.fromEntries(allRpcs),
  };
  fs.writeFileSync('networks/evm/base-discovered-raw.json', JSON.stringify(output, null, 2));
  console.log('\nRaw output saved to networks/evm/base-discovered-raw.json');
}

scan().catch(console.error);
