const { chromium } = require('playwright');
const fs = require('fs');

// ============================================
// GENERIC EVM RPC INTERCEPTOR
// Usage: node intercept-evm-rpcs.js <chain> <chainId>
// Example: node intercept-evm-rpcs.js base 8453
// ============================================

const CHAIN = process.argv[2] || 'base';
const CHAIN_ID = process.argv[3] || '8453';
const OUTPUT_DIR = 'networks/evm';

// DEX URLs by chain - add more as needed
const DEX_BY_CHAIN = {
  base: [
    { name: 'Aerodrome', url: 'https://aerodrome.finance/swap' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=base' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap?chain=base' },
    { name: 'BaseSwap', url: 'https://baseswap.fi/swap' },
    { name: 'Sushi', url: `https://www.sushi.com/swap?chainIds=${CHAIN_ID}` },
  ],
  ethereum: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap' },
    { name: '1inch', url: 'https://app.1inch.io/swap' },
    { name: 'CowSwap', url: 'https://cowswap.exchange' },
    { name: 'Curve', url: 'https://app.curve.fi' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap' },
  ],
  arbitrum: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=arbitrum' },
    { name: 'GMX', url: 'https://app.gmx.io' },
    { name: 'Camelot', url: 'https://app.camelot.exchange' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap?chain=arbitrum' },
    { name: 'Sushi', url: `https://www.sushi.com/swap?chainIds=${CHAIN_ID}` },
  ],
  optimism: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=optimism' },
    { name: 'Velodrome', url: 'https://app.velodrome.finance' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/optimism' },
  ],
  bsc: [
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=bsc' },
    { name: 'Thena', url: 'https://thena.fi' },
  ],
  polygon: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=polygon' },
    { name: 'QuickSwap', url: 'https://quickswap.exchange' },
    { name: 'Curve', url: 'https://polygon.curve.fi' },
  ],
  avalanche: [
    { name: 'Trader Joe', url: 'https://traderjoexyz.com' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=avalanche' },
    { name: 'Curve', url: 'https://avalanche.curve.fi' },
  ],
};

// Get DEX sites for requested chain
const DEX_SITES = DEX_BY_CHAIN[CHAIN] || DEX_BY_CHAIN.ethereum;

// RPC URL patterns to search for
const RPC_PATTERNS = [
  /https?:\/\/[^"'\s]*(?:rpc|api)[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.quiknode\.pro[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.drpc\.org[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*drpc\.live[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.publicnode\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.llamarpc\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.meowrpc\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*infura\.io[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*alchemy\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*quicknode\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*ankr\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*blastapi\.io[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*nodies\.app[^"'\s]*/gi,
];

async function scan() {
  console.log(`# ${CHAIN.toUpperCase()} RPC Discovery`);
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`Scanning ${DEX_SITES.length} DEXs...\n`);
  
  const browser = await chromium.launch({ headless: true });
  const allRpcs = new Map();
  
  for (const dex of DEX_SITES) {
    console.log(`\n## ${dex.name}: ${dex.url}`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const rpcRequests = [];
    
    // Intercept ALL requests
    page.on('request', request => {
      const url = request.url();
      const postData = request.postData();
      
      // Check for JSON-RPC calls
      if (postData && (postData.includes('eth_') || postData.includes('net_') || postData.includes('web3_'))) {
        try {
          const json = JSON.parse(postData);
          rpcRequests.push({ url, method: json.method });
          if (!allRpcs.has(url)) {
            allRpcs.set(url, { dex: dex.name, methods: [], source: 'network' });
          }
          allRpcs.get(url).methods.push(json.method);
        } catch (e) {}
      }
    });
    
    // Intercept responses to find RPC URLs in JS bundles
    page.on('response', async response => {
      const url = response.url();
      
      if (url.endsWith('.js') || url.includes('.js?')) {
        try {
          const body = await response.text();
          
          for (const pattern of RPC_PATTERNS) {
            const matches = body.match(pattern) || [];
            for (const match of matches) {
              const cleanUrl = match.replace(/['"\\]/g, '').split(',')[0];
              if (cleanUrl.length > 15 && cleanUrl.includes('http')) {
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
      console.log('  Loading...');
      await page.goto(dex.url, { timeout: 45000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      // Trigger more RPC calls
      await page.mouse.move(500, 300);
      await page.waitForTimeout(1000);
      
      console.log(`  Found ${rpcRequests.length} RPC requests`);
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    await page.close();
    await context.close();
  }
  
  await browser.close();
  
  // Filter for chain-specific RPCs
  const chainRpcs = [];
  for (const [url, info] of allRpcs) {
    if (url.includes(CHAIN) || 
        url.includes(CHAIN_ID) ||
        url.includes('quiknode') ||
        url.includes('drpc') ||
        url.includes('ankr') ||
        url.includes('infura') ||
        url.includes('alchemy')) {
      chainRpcs.push({ url, ...info });
    }
  }
  
  // Print results
  console.log('\n\n# ========================================');
  console.log(`# DISCOVERED ${CHAIN.toUpperCase()} RPCs`);
  console.log('# ========================================\n');
  
  console.log('| Source | RPC URL |');
  console.log('|--------|---------|');
  for (const rpc of chainRpcs) {
    console.log(`| ${rpc.dex} | ${rpc.url} |`);
  }
  
  // Save raw output
  const output = {
    chain: CHAIN,
    chainId: CHAIN_ID,
    scanned: DEX_SITES.map(d => d.name),
    discovered: chainRpcs,
    allRpcs: Object.fromEntries(allRpcs),
    timestamp: new Date().toISOString(),
  };
  
  const outputPath = `${OUTPUT_DIR}/${CHAIN}-discovered-raw.json`;
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nRaw output saved to ${outputPath}`);
  
  return chainRpcs;
}

scan().catch(console.error);
