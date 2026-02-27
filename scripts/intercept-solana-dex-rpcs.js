const { chromium } = require('playwright');
const fs = require('fs');

// ============================================
// SOLANA RPC DISCOVERY - DEX FRONTEND INTERCEPTION
// ============================================

const OUTPUT_DIR = 'networks/solana';

// Top Solana DEXs by volume (Feb 2026)
const DEX_SITES = [
  // === TOP DEXs ===
  { name: 'Jupiter', url: 'https://jup.ag/swap' },
  { name: 'Raydium', url: 'https://raydium.io/swap' },
  { name: 'Orca', url: 'https://www.orca.so' },
  { name: 'Meteora', url: 'https://www.meteora.ag' },
  
  // === PERPS / MARGIN ===
  { name: 'Drift', url: 'https://app.drift.trade' },
  { name: 'Zeta', url: 'https://zeta.markets' },
  { name: 'Kamino', url: 'https://kamino.finance' },
  { name: 'MarginFi', url: 'https://marginfi.com' },
  { name: 'Solend', url: 'https://solend.fi' },
  
  // === OTHER ===
  { name: 'Phoenix', url: 'https://phoenix.trade' },
  { name: 'Tensor', url: 'https://tensor.trade' },
  { name: 'Pump.fun', url: 'https://pump.fun' },
  { name: 'Moonshot', url: 'https://moonshot.cc' },
  
  // === AGGREGATORS ===
  { name: '1inch Solana', url: 'https://app.1inch.io/solana/swap' },
  { name: 'OpenOcean', url: 'https://app.openocean.finance?network=Solana' },
];

// Solana RPC URL patterns
const RPC_PATTERNS = [
  /https?:\/\/[^"'\s]*(?:\.mainnet\.beta\.solana|api\.mainnet|solana-mainnet)[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*helius[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*quicknode[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*triton[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*ironforge[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*drpc[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*alchemy[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*ankr[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*blockpipe[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*chainstack[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*getblock[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*nownodes[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*blockslot[^"'\s]*/gi,
  // Generic RPC patterns
  /https?:\/\/[^"'\s]*\.rpc\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*api\.[^"'\s]*\/[^"'\s]*/gi,
];

async function scan() {
  console.log('# SOLANA RPC Discovery - DEX Frontend Interception\n');
  console.log(`Scanning ${DEX_SITES.length} Solana DEXs...\n`);
  
  const browser = await chromium.launch({ headless: true });
  const allRpcs = new Map();
  const allWs = new Map();
  
  for (const dex of DEX_SITES) {
    console.log(`\n## ${dex.name}: ${dex.url}`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const rpcRequests = [];
    const wsConnections = [];
    
    // Intercept HTTP requests
    page.on('request', request => {
      const url = request.url();
      const postData = request.postData();
      
      // Check for JSON-RPC calls
      if (postData) {
        try {
          const json = JSON.parse(postData);
          if (json.jsonrpc === '2.0' || json.method) {
            // Solana methods
            const solanaMethods = ['getHealth', 'getSlot', 'getBlockHeight', 'getLatestBlockhash', 
                                   'getAccountInfo', 'getBalance', 'getTransaction', 'sendTransaction'];
            if (solanaMethods.some(m => postData.includes(m))) {
              rpcRequests.push({ url, method: json.method });
              if (!allRpcs.has(url)) {
                allRpcs.set(url, { dex: dex.name, methods: [], source: 'network' });
              }
              allRpcs.get(url).methods.push(json.method);
            }
          }
        } catch (e) {}
      }
    });
    
    // Intercept responses to find RPC URLs in JS bundles
    page.on('response', async response => {
      const url = response.url();
      
      // Check JS files for embedded RPC URLs
      if (url.endsWith('.js') || url.includes('.js?')) {
        try {
          const body = await response.text();
          
          for (const pattern of RPC_PATTERNS) {
            const matches = body.match(pattern) || [];
            for (const match of matches) {
              const cleanUrl = match.replace(/['"\\]/g, '').split(',')[0].split(' ')[0];
              if (cleanUrl.length > 15 && cleanUrl.includes('http')) {
                // Check if it's a Solana-related URL
                if (cleanUrl.includes('solana') || 
                    cleanUrl.includes('mainnet') ||
                    cleanUrl.includes('helius') ||
                    cleanUrl.includes('quicknode') ||
                    cleanUrl.includes('triton') ||
                    cleanUrl.includes('drpc') ||
                    cleanUrl.includes('alchemy') ||
                    cleanUrl.includes('ankr') ||
                    cleanUrl.includes('rpc')) {
                  if (!allRpcs.has(cleanUrl)) {
                    allRpcs.set(cleanUrl, { dex: dex.name, methods: ['found_in_js'], source: url });
                  }
                }
              }
            }
          }
          
          // Look for WebSocket endpoints
          const wsMatches = body.match(/wss?:\/\/[^"'\s]+/g) || [];
          for (const ws of wsMatches) {
            const cleanWs = ws.replace(/['"\\]/g, '');
            if (cleanWs.includes('solana') || cleanWs.includes('mainnet') || cleanWs.includes('rpc')) {
              if (!allWs.has(cleanWs)) {
                allWs.set(cleanWs, { dex: dex.name, source: url });
              }
            }
          }
        } catch (e) {}
      }
    });
    
    try {
      console.log('  Loading...');
      await page.goto(dex.url, { timeout: 45000, waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Trigger more RPC calls
      await page.mouse.move(500, 300);
      await page.waitForTimeout(1500);
      
      console.log(`  Found ${rpcRequests.length} RPC requests`);
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    await page.close();
    await context.close();
  }
  
  await browser.close();
  
  // Print results
  console.log('\n\n# ========================================');
  console.log('# DISCOVERED SOLANA RPCs');
  console.log('# ========================================\n');
  
  // HTTP RPCs
  console.log('## HTTP RPC Endpoints\n');
  console.log('| Source | RPC URL | Notes |');
  console.log('|--------|---------|-------|');
  
  for (const [url, info] of allRpcs) {
    const notes = info.methods.includes('found_in_js') ? 'from JS bundle' : info.methods.join(', ').substring(0, 30);
    // Filter out obvious non-Solana URLs
    if (!url.includes('ethereum') && 
        !url.includes('eth-') && 
        !url.includes('arb1') && 
        !url.includes('polygon') &&
        !url.includes('optimism')) {
      console.log(`| ${info.dex} | ${url} | ${notes} |`);
    }
  }
  
  // WebSocket endpoints
  if (allWs.size > 0) {
    console.log('\n## WebSocket Endpoints\n');
    console.log('| Source | WS URL |');
    console.log('|--------|--------|');
    for (const [url, info] of allWs) {
      console.log(`| ${info.dex} | ${url} |`);
    }
  }
  
  // Save raw output
  const output = {
    chain: 'solana',
    scanned: DEX_SITES.map(d => d.name),
    httpRpcs: Object.fromEntries(allRpcs),
    websockets: Object.fromEntries(allWs),
    timestamp: new Date().toISOString(),
  };
  
  const outputPath = `${OUTPUT_DIR}/solana-discovered-raw.json`;
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nRaw output saved to ${outputPath}`);
}

scan().catch(console.error);
