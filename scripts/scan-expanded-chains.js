const { chromium } = require('playwright');
const fs = require('fs');

// ============================================
// EXPANDED L2 & NEW CHAINS RPC DISCOVERY
// ============================================

const OUTPUT_DIR = 'networks/evm';

// Additional chains to scan
const CHAINS = {
  'polygon-zkevm': {
    chainId: 1101,
    name: 'Polygon zkEVM',
    chainKey: 'polygon-zkevm',
    dexs: [
      { name: 'Uniswap Polygon zkEVM', url: 'https://app.uniswap.org/swap?chain=polygon-zkevm' },
      { name: 'QuickSwap', url: 'https://quickswap.exchange' },
      { name: 'Dov', url: 'https://dov.quest' },
    ],
  },
  'celo': {
    chainId: 42220,
    name: 'Celo',
    chainKey: 'celo',
    dexs: [
      { name: 'Uniswap Celo', url: 'https://app.uniswap.org/swap?chain=celo' },
      { name: 'Sushi Celo', url: 'https://www.sushi.com/swap?chainIds=42220' },
      { name: 'Curve Celo', url: 'https://curve.fi/celo' },
    ],
  },
  'gnosis': {
    chainId: 100,
    name: 'Gnosis Chain (xDai)',
    chainKey: 'gnosis',
    dexs: [
      { name: 'Uniswap Gnosis', url: 'https://app.uniswap.org/swap?chain=gnosis' },
      { name: 'Sushi Gnosis', url: 'https://www.sushi.com/swap?chainIds=100' },
      { name: 'Curve Gnosis', url: 'https://curve.fi/gnosis' },
    ],
  },
  'aurora': {
    chainId: 1313161554,
    name: 'Aurora (Near)',
    chainKey: 'aurora',
    dexs: [
      { name: 'Trisolaris', url: 'https://trisolaris.io' },
      { name: 'WannaSwap', url: 'https://wannaswap.finance' },
      { name: 'Aurora Swap', url: 'https://auroraswap.com' },
    ],
  },
  'cronos': {
    chainId: 25,
    name: 'Cronos',
    chainKey: 'cronos',
    dexs: [
      { name: 'VVS', url: 'https://vvs.finance' },
      { name: 'Cronaswap', url: 'https://cronaswap.org' },
      { name: 'MM Finance', url: 'https://mm.finance' },
    ],
  },
  'klaytn': {
    chainId: 8217,
    name: 'Klaytn',
    chainKey: 'klaytn',
    dexs: [
      { name: 'KlaySwap', url: 'https://klayswap.com' },
      { name: 'PantherSwap', url: 'https://pantherswap.com' },
      { name: 'KlayStation', url: 'https://klaystation.io' },
    ],
  },
  'moonbeam': {
    chainId: 1284,
    name: 'Moonbeam',
    chainKey: 'moonbeam',
    dexs: [
      { name: 'Beamswap', url: 'https://app.beamswap.io' },
      { name: 'StellaSwap', url: 'https://app.stellaswap.com' },
      { name: 'Solarbeam', url: 'https://solarbeam.io' },
    ],
  },
  'astar': {
    chainId: 592,
    name: 'Astar',
    chainKey: 'astar',
    dexs: [
      { name: 'ArthSwap', url: 'https://app.arthswap.com' },
      { name: 'Sirius', url: 'https://sirius.finance' },
      { name: 'Camelot', url: 'https://app.camelot.exchange' },
    ],
  },
  'fuse': {
    chainId: 122,
    name: 'Fuse',
    chainKey: 'fuse',
    dexs: [
      { name: 'Fuse Swap', url: 'https://app.fuse.io' },
      { name: 'Elk Finance', url: 'https://elk.finance' },
    ],
  },
  'zora': {
    chainId: 7777777,
    name: 'Zora',
    chainKey: 'zora',
    dexs: [
      { name: 'Uniswap Zora', url: 'https://app.uniswap.org/swap?chain=zora' },
      { name: 'Echo', url: 'https://echo.dex' },
    ],
  },
  'op': {
    chainId: 11155420,  // OP Sepolia testnet
    name: 'Optimism (OP)',
    chainKey: 'op',
    dexs: [
      { name: 'Velodrome', url: 'https://app.velodrome.finance' },
      { name: 'Uniswap OP', url: 'https://app.uniswap.org/swap?chain=optimism' },
    ],
  },
  'fraxtal': {
    chainId: 4242,
    name: 'Fraxtal',
    chainKey: 'fraxtal',
    dexs: [
      { name: 'Uniswap Fraxtal', url: 'https://app.uniswap.org/swap?chain=fraxtal' },
      { name: 'Fraxtal Swap', url: 'https://swap.fraxtal.com' },
    ],
  },
};

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
  const publicRpcs = [
    `https://${chainKey}.drpc.org`,
    `https://${chainKey}-evm-rpc.publicnode.com`,
    `https://rpc.${chainKey}.com`,
  ];
  
  for (const rpc of publicRpcs) {
    allRpcs.set(rpc, { dex: 'known', methods: ['public'], source: 'public list' });
  }
  
  for (const dex of chain.dexs) {
    console.log(`  Scanning ${dex.name}...`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
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
  const chainLower = chainKey.toLowerCase();
  
  for (const [url, info] of allRpcs) {
    if (url.toLowerCase().includes(chainLower) ||
        url.includes(String(chain.chainId)) ||
        info.dex === 'known') {
      chainRpcs.push({ url, ...info });
    }
  }
  
  console.log(`  Found ${chainRpcs.length} RPCs`);
  
  return { chain: chain.name, chainId: chain.chainId, chainKey, rpcs: chainRpcs };
}

async function main() {
  console.log('# Expanded Chains RPC Discovery\n');
  
  for (const [key, chain] of Object.entries(CHAINS)) {
    const result = await scanChain(key, chain);
    
    const outputPath = `${OUTPUT_DIR}/${key}/discovered-raw.json`;
    fs.mkdirSync(`${OUTPUT_DIR}/${key}`, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`  Saved to ${outputPath}\n`);
  }
  
  // Summary
  console.log('\n# SUMMARY\n');
  console.log('| Chain | Chain ID | RPCs Found |');
  console.log('|-------|----------|------------|');
  for (const [key, chain] of Object.entries(CHAINS)) {
    console.log(`| ${chain.name} | ${chain.chainId} | - |`);
  }
}

main().catch(console.error);
