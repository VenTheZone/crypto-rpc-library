const { chromium } = require('playwright');
const fs = require('fs');

// ============================================
// NEW L2 CHAINS RPC DISCOVERY
// ============================================

const OUTPUT_DIR = 'networks/evm';

// Chain configurations
const CHAINS = {
  berachain: {
    chainId: 80094,
    name: 'Berachain',
    rpcs: [
      'https://rpc.berachain.com',
      'https://berachain-evm-rpc.publicnode.com',
      'https://bera.rpc.thirdweb.com',
    ],
    dexs: [
      { name: 'Kodiak', url: 'https://kodiak.finance' },
      { name: 'Berachain DEX', url: 'https://app.berachain.com' },
      { name: 'Uniswap Bera', url: 'https://app.uniswap.org/swap?chain=berachain' },
      { name: 'BEX', url: 'https://bex.berachain.com' },
      { name: 'Honeypot', url: 'https://honeypot.finance' },
    ],
  },
  blast: {
    chainId: 81457,
    name: 'Blast',
    rpcs: [
      'https://rpc.blast.io',
      'https://blast.drpc.org',
      'https://blast-evm-rpc.publicnode.com',
    ],
    dexs: [
      { name: 'Thruster', url: 'https://app.thruster.finance' },
      { name: 'Uniswap Blast', url: 'https://app.uniswap.org/swap?chain=blast' },
      { name: 'Sushi Blast', url: 'https://www.sushi.com/swap?chainIds=81457' },
      { name: 'Blast DEX', url: 'https://blast.io/swap' },
    ],
  },
  scroll: {
    chainId: 534352,
    name: 'Scroll',
    rpcs: [
      'https://rpc.scroll.io',
      'https://scroll.drpc.org',
      'https://scroll-evm-rpc.publicnode.com',
    ],
    dexs: [
      { name: 'Uniswap Scroll', url: 'https://app.uniswap.org/swap?chain=scroll' },
      { name: 'Zebra', url: 'https://zebra.axiacat.com' },
      { name: 'Skydrome', url: 'https://skydrome.io' },
      { name: 'SyncSwap', url: 'https://syncswap.xyz' },
    ],
  },
  zksync: {
    chainId: 324,
    name: 'zkSync Era',
    rpcs: [
      'https://mainnet.era.zksync.io',
      'https://zksync.drpc.org',
    ],
    dexs: [
      { name: 'SyncSwap', url: 'https://syncswap.xyz' },
      { name: 'Mute', url: 'https://mute.io' },
      { name: 'ZigZag', url: 'https://trade.zigzag.exchange' },
      { name: 'Uniswap zkSync', url: 'https://app.uniswap.org/swap?chain=zksync' },
    ],
  },
  linea: {
    chainId: 59144,
    name: 'Linea',
    rpcs: [
      'https://rpc.linea.build',
      'https://linea.drpc.org',
    ],
    dexs: [
      { name: 'Uniswap Linea', url: 'https://app.uniswap.org/swap?chain=linea' },
      { name: 'Echo', url: 'https://echo.dex' },
      { name: 'PancakeSwap Linea', url: 'https://pancakeswap.finance/swap?chain=linea' },
    ],
  },
  mantle: {
    chainId: 5000,
    name: 'Mantle',
    rpcs: [
      'https://rpc.mantle.xyz',
      'https://mantle.drpc.org',
    ],
    dexs: [
      { name: 'Agni', url: 'https://agni.finance' },
      { name: 'Cleopatra', url: 'https://cleopatra.exchange' },
      { name: 'Uniswap Mantle', url: 'https://app.uniswap.org/swap?chain=mantle' },
    ],
  },
  mode: {
    chainId: 34443,
    name: 'Mode',
    rpcs: [
      'https://mainnet.mode.network',
      'https://mode.drpc.org',
    ],
    dexs: [
      { name: 'Uniswap Mode', url: 'https://app.uniswap.org/swap?chain=mode' },
      { name: 'Kim', url: 'https://kim.exchange' },
      { name: 'Velodrome Mode', url: 'https://app.velodrome.finance' },
    ],
  },
};

// RPC URL patterns
const RPC_PATTERNS = [
  /https?:\/\/[^"'\s]*(?:rpc|api)[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.drpc\.org[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*\.publicnode\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*infura\.io[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*alchemy\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*quicknode\.com[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*ankr\.com[^"'\s]*/gi,
];

async function scanChain(chainKey, chain) {
  console.log(`\n# ${chain.name} (Chain ID: ${chain.chainId})\n`);
  
  const browser = await chromium.launch({ headless: true });
  const allRpcs = new Map();
  
  // Add known public RPCs
  for (const rpc of chain.rpcs) {
    allRpcs.set(rpc, { dex: 'known', methods: ['public'], source: 'public list' });
  }
  
  for (const dex of chain.dexs) {
    console.log(`  Scanning ${dex.name}...`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Intercept requests
    page.on('request', request => {
      const url = request.url();
      const postData = request.postData();
      
      if (postData && (postData.includes('eth_') || postData.includes('net_'))) {
        try {
          const json = JSON.parse(postData);
          if (!allRpcs.has(url)) {
            allRpcs.set(url, { dex: dex.name, methods: [], source: 'network' });
          }
          allRpcs.get(url).methods.push(json.method);
        } catch (e) {}
      }
    });
    
    // Intercept responses
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
      await page.goto(dex.url, { timeout: 30000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.mouse.move(500, 300);
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log(`    Error: ${e.message.substring(0, 40)}`);
    }
    
    await page.close();
    await context.close();
  }
  
  await browser.close();
  
  // Filter for chain-specific RPCs
  const chainRpcs = [];
  for (const [url, info] of allRpcs) {
    // Check if related to this chain
    const chainLower = chainKey.toLowerCase();
    if (url.toLowerCase().includes(chainLower) ||
        url.includes(String(chain.chainId)) ||
        info.methods.includes('found_in_js') ||
        info.dex === 'known') {
      chainRpcs.push({ url, ...info });
    }
  }
  
  // Print results
  console.log(`\n  Found ${chainRpcs.length} RPCs:`);
  for (const rpc of chainRpcs.slice(0, 10)) {
    console.log(`    - ${rpc.url.substring(0, 60)}...`);
  }
  
  return { chain: chain.name, chainId: chain.chainId, rpcs: chainRpcs };
}

async function main() {
  console.log('# New L2 Chains RPC Discovery\n');
  
  const results = [];
  
  for (const [key, chain] of Object.entries(CHAINS)) {
    const result = await scanChain(key, chain);
    results.push(result);
    
    // Save per-chain
    const outputPath = `${OUTPUT_DIR}/${key}-discovered-raw.json`;
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`  Saved to ${outputPath}\n`);
  }
  
  // Summary
  console.log('\n# SUMMARY\n');
  console.log('| Chain | Chain ID | RPCs Found |');
  console.log('|-------|----------|------------|');
  for (const r of results) {
    console.log(`| ${r.chain} | ${r.chainId} | ${r.rpcs.length} |`);
  }
}

main().catch(console.error);
