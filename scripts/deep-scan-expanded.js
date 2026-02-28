const { chromium } = require('playwright');
const fs = require('fs');

// Deep scan for top chains with most DEX volume
const DEEP_SCAN_CHAINS = {
  'polygon-zkevm': {
    chainId: 1101,
    name: 'Polygon zkEVM',
    dexs: [
      { name: 'QuickSwap', url: 'https://quickswap.exchange' },
      { name: 'Dov', url: 'https://dov.quest' },
      { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=polygon-zkevm' },
      { name: 'Agni', url: 'https://agni.finance' },
      { name: 'Stargate', url: 'https://stargate.finance' },
      { name: 'Symble', url: 'https://symble.xyz' },
      { name: 'Owlto', url: 'https://owlto.xyz' },
      { name: 'Paraswap', url: 'https://app.paraswap.io?network=1101' },
    ],
  },
  'celo': {
    chainId: 42220,
    name: 'Celo',
    dexs: [
      { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=celo' },
      { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=42220' },
      { name: 'Curve', url: 'https://curve.fi/celo' },
      { name: 'Moola', url: 'https://app.moola.market' },
      { name: 'Ubeswap', url: 'https://app.ubeswap.org' },
      { name: 'Sopenswap', url: 'https://sopeswap.com' },
      { name: 'CeloDEX', url: 'https://celodex.io' },
      { name: 'Kresko', url: 'https://kresko.io' },
    ],
  },
  'cronos': {
    chainId: 25,
    name: 'Cronos',
    dexs: [
      { name: 'VVS', url: 'https://vvs.finance' },
      { name: 'Cronaswap', url: 'https://app.cronaswap.org' },
      { name: 'MM Finance', url: 'https://mm.finance' },
      { name: 'Tectonic', url: 'https://tectonic.finance' },
      { name: 'Pharaoh', url: 'https://pharaoh.app' },
      { name: 'Nebula', url: 'https://nebula.abc' },
      { name: 'Swapsicle', url: 'https://swapsicle.io' },
      { name: 'Elk', url: 'https://elk.finance' },
    ],
  },
  'moonbeam': {
    chainId: 1284,
    name: 'Moonbeam',
    dexs: [
      { name: 'Beamswap', url: 'https://app.beamswap.io' },
      { name: 'StellaSwap', url: 'https://app.stellaswap.com' },
      { name: 'Solarbeam', url: 'https://app.solarbeam.io' },
      { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=moonbeam' },
      { name: 'Curve', url: 'https://curve.fi/moonbeam' },
      { name: 'Lunar', url: 'https://lunar.io' },
      { name: 'Glacis', url: 'https://glacis.finance' },
      { name: 'Zenlink', url: 'https://app.zenlink.pro' },
    ],
  },
  'gnosis': {
    chainId: 100,
    name: 'Gnosis Chain',
    dexs: [
      { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=gnosis' },
      { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=100' },
      { name: 'Curve', url: 'https://curve.fi/gnosis' },
      { name: 'Honeyswap', url: 'https://honeyswap.org' },
      { name: 'Agave', url: 'https://agave.finance' },
      { name: 'Gnosis DAO', url: 'https://gnosis-defi.netlify.app' },
      { name: 'Baoswap', url: 'https://baoswap.xyz' },
      { name: 'Sashimi', url: 'https://sashimi.co' },
    ],
  },
  'klaytn': {
    chainId: 8217,
    name: 'Klaytn',
    dexs: [
      { name: 'KlaySwap', url: 'https://klayswap.com' },
      { name: 'PantherSwap', url: 'https://pantherswap.com' },
      { name: 'KlayStation', url: 'https://klaystation.io' },
      { name: 'Findora', url: 'https://findora.org' },
      { name: 'OCP', url: 'https://ocp.network' },
      { name: 'Klar', url: 'https://klar.io' },
      { name: 'BSC', url: 'https://bsc.org' },
      { name: 'Klayhub', url: 'https://klayhub.org' },
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
  /https?:\/\/[^"'\s]*blastapi[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*nodereal[^"'\s]*/gi,
];

async function scanChain(chainKey, chain) {
  console.log(`\n# ${chain.name} - Deep Scan\n`);
  
  const browser = await chromium.launch({ headless: true });
  const allRpcs = new Map();
  
  for (const dex of chain.dexs) {
    console.log(`  Scanning ${dex.name}...`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    page.on('response', async response => {
      const url = response.url();
      if (url.endsWith('.js') || url.includes('.js?')) {
        try {
          const body = await response.text();
          for (const pattern of RPC_PATTERNS) {
            const matches = body.match(pattern) || [];
            for (const match of matches) {
              const cleanUrl = match.replace(/['"\\]/g, '').split(',')[0].split(' ')[0];
              if (cleanUrl.length > 15 && cleanUrl.includes('http')) {
                if (!allRpcs.has(cleanUrl)) {
                  allRpcs.set(cleanUrl, { dex: dex.name, source: url.substring(0, 80) });
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
      console.log(`    Error: ${e.message.substring(0, 30)}`);
    }
    
    await page.close();
    await context.close();
  }
  
  await browser.close();
  
  // Filter for chain-specific
  const chainRpcs = [];
  const chainLower = chainKey.toLowerCase();
  
  for (const [url, info] of allRpcs) {
    if (url.toLowerCase().includes(chainLower) ||
        url.includes(String(chain.chainId)) ||
        url.includes('polygon-zkevm') ||
        url.includes('matic') ||
        url.includes('celo') ||
        url.includes('gnosis') ||
        url.includes('xdai') ||
        url.includes('cronos') ||
        url.includes('klaytn') ||
        url.includes('moonbeam') ||
        url.includes('glmr')) {
      chainRpcs.push({ url, ...info });
    }
  }
  
  console.log(`  Found ${chainRpcs.length} RPCs`);
  
  return { chain: chain.name, chainId: chain.chainId, rpcs: chainRpcs };
}

async function main() {
  console.log('# Deep DEX Scan - Expanded Chains\n');
  
  for (const [key, chain] of Object.entries(DEEP_SCAN_CHAINS)) {
    const result = await scanChain(key, chain);
    
    console.log(`\n## ${chain.name} Results:`);
    for (const rpc of result.rpcs) {
      console.log(`  - ${rpc.url.substring(0, 60)}... (${rpc.dex})`);
    }
    
    const outputPath = `networks/evm/${key}/deep-scan.json`;
    fs.mkdirSync(`networks/evm/${key}`, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  }
}

main().catch(console.error);
