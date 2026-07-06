const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

chromium.use(StealthPlugin());

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
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=8453' },
    { name: 'SwapBased', url: 'https://swapbased.finance' },
    { name: 'Blueswap', url: 'https://app.blueswap.finance' },
    { name: 'DexScreener', url: 'https://dexscreener.com/base' },
    { name: 'Matcha', url: 'https://matcha.xyz?chain=base' },
    { name: 'Li.Fi', url: 'https://li.fi' },
    { name: 'Socket', url: 'https://socket.tech' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Across', url: 'https://across.to' },
    { name: 'WarpSpeed', url: 'https://warpspeed.finance' },
    { name: 'BaseScan', url: 'https://basescan.org' },
    { name: 'Blockscout', url: 'https://base.blockscout.com' },
    { name: 'PancakeSwap Infinity', url: 'https://pancakeswap.finance/swap?chain=base' },
    { name: 'Fluid DEX', url: 'https://fluid.deposit' },
  ],
  ethereum: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap' },
    { name: '1inch', url: 'https://app.1inch.io/swap' },
    { name: 'CowSwap', url: 'https://cowswap.exchange' },
    { name: 'Curve', url: 'https://curve.fi' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap' },
    { name: 'Balancer', url: 'https://balancer.fi' },
    { name: 'Paraswap', url: 'https://paraswap.io' },
    { name: 'DexScreener', url: 'https://dexscreener.com/ethereum' },
    { name: 'Lido', url: 'https://lido.fi' },
    { name: 'Aave', url: 'https://app.aave.com' },
    { name: 'Matcha', url: 'https://matcha.xyz' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/ethereum' },
    { name: 'Clipper', url: 'https://clipper.exchange' },
    { name: 'DODO', url: 'https://dodoex.io' },
    { name: 'Bancor', url: 'https://app.bancor.network' },
    { name: 'THORChain', url: 'https://app.thorchain.org' },
    { name: 'Firebird', url: 'https://firebird.finance' },
    { name: 'Li.Fi', url: 'https://li.fi' },
    { name: 'Socket', url: 'https://socket.tech' },
    { name: 'WOOFi', url: 'https://woo.org' },
    { name: 'Plasma Finance', url: 'https://plasma.finance' },
    { name: 'Morpho', url: 'https://morpho.org' },
    { name: 'Yearn', url: 'https://yearn.fi' },
    { name: 'Pendle', url: 'https://pendle.finance' },
    { name: 'Frax', url: 'https://app.frax.finance' },
    { name: 'Badger', url: 'https://app.badger.com' },
    { name: 'StakeDAO', url: 'https://stakedao.org' },
    { name: 'Aura', url: 'https://aura.finance' },
    { name: 'Connext', url: 'https://connext.network' },
    { name: 'Synapse', url: 'https://synapseprotocol.com' },
    { name: 'Hop', url: 'https://hop.exchange' },
    { name: 'Across', url: 'https://across.to' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Celer', url: 'https://cbridge.celer.network' },
    { name: 'Swapper', url: 'https://swapper.chainsafe.io' },
    { name: 'Symbiosis', url: 'https://symbiosis.finance' },
    { name: 'Wombat', url: 'https://wombat.exchange' },
    { name: 'Solidly', url: 'https://solidly.exchange' },
    { name: 'Swerve', url: 'https://swerve.fi' },
    { name: 'mStable', url: 'https://mstable.app' },
    { name: 'DeFi Saver', url: 'https://app.defisaver.com' },
    { name: 'Oasis', url: 'https://oasis.app' },
    { name: 'Instadapp', url: 'https://app.instadapp.io' },
    { name: 'Zapper', url: 'https://zapper.fi' },
    { name: 'Zerion', url: 'https://app.zerion.io' },
    { name: 'Etherscan', url: 'https://etherscan.io' },
    { name: 'Blockscout', url: 'https://eth.blockscout.com' },
    { name: 'Fluid DEX', url: 'https://fluid.deposit' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap?chain=ethereum' },
  ],
  arbitrum: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=arbitrum' },
    { name: 'GMX', url: 'https://app.gmx.io' },
    { name: 'Camelot', url: 'https://app.camelot.exchange' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap?chain=arbitrum' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=42161' },
    { name: 'Curve', url: 'https://arbitrum.curve.fi' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/arbitrum' },
    { name: 'DODO', url: 'https://dodoex.io' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=arbitrum' },
    { name: 'Swapr', url: 'https://swapr.finance' },
    { name: 'WOO', url: 'https://woo.org' },
    { name: 'Synapse', url: 'https://synapseprotocol.com' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Across', url: 'https://across.to' },
    { name: 'Hop', url: 'https://hop.exchange' },
    { name: 'DexScreener', url: 'https://dexscreener.com/arbitrum' },
    { name: 'Platypus', url: 'https://app.platypus.finance' },
    { name: 'Wombat', url: 'https://wombat.exchange' },
    { name: 'Zebra', url: 'https://zebra.xyz' },
    { name: 'WarpSpeed', url: 'https://warpspeed.finance' },
    { name: 'Arbiscan', url: 'https://arbiscan.io' },
    { name: 'Blockscout', url: 'https://arbitrum.blockscout.com' },
  ],
  optimism: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=optimism' },
    { name: 'Velodrome', url: 'https://app.velodrome.finance' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/optimism' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=10' },
    { name: 'Curve', url: 'https://optimism.curve.fi' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap?chain=optimism' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=optimism' },
    { name: 'Zipswap', url: 'https://zipswap.io' },
    { name: 'Beethoven X', url: 'https://beets.fi' },
    { name: 'Synapse', url: 'https://synapseprotocol.com' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Across', url: 'https://across.to' },
    { name: 'Hop', url: 'https://hop.exchange' },
    { name: 'Li.Fi', url: 'https://li.fi' },
    { name: 'DexScreener', url: 'https://dexscreener.com/optimism' },
    { name: 'Optimistic Etherscan', url: 'https://optimistic.etherscan.io' },
    { name: 'Blockscout', url: 'https://optimism.blockscout.com' },
  ],
  bsc: [
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=bsc' },
    { name: 'Thena', url: 'https://thena.fi' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=56' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=bsc' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance/swap' },
    { name: 'BiSwap', url: 'https://biswap.org' },
    { name: 'BabySwap', url: 'https://babyswap.finance' },
    { name: 'MDEX', url: 'https://mdex.com' },
    { name: 'Biswap', url: 'https://biswap.org' },
    { name: 'Wombat', url: 'https://wombat.exchange' },
    { name: 'Curve', url: 'https://bsc.curve.fi' },
    { name: 'DODO', url: 'https://dodoex.io' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/bsc' },
    { name: 'DexScreener', url: 'https://dexscreener.com/bsc' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Synapse', url: 'https://synapseprotocol.com' },
    { name: 'WOOFi', url: 'https://woo.org' },
    { name: 'ParaSwap', url: 'https://paraswap.io' },
    { name: 'BscScan', url: 'https://bscscan.com' },
    { name: 'Blockscout', url: 'https://bsc.blockscout.com' },
  ],
  polygon: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=polygon' },
    { name: 'QuickSwap', url: 'https://quickswap.exchange' },
    { name: 'Curve', url: 'https://polygon.curve.fi' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=137' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=polygon' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/polygon' },
    { name: 'DODO', url: 'https://dodoex.io' },
    { name: 'Cometh', url: 'https://cometh.io' },
    { name: 'WaultSwap', url: 'https://wault.finance' },
    { name: 'ApeSwap', url: 'https://apeswap.finance' },
    { name: 'DFyn', url: 'https://dfyn.network' },
    { name: 'Firebird', url: 'https://firebird.finance' },
    { name: 'DexScreener', url: 'https://dexscreener.com/polygon' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Across', url: 'https://across.to' },
    { name: 'ParaSwap', url: 'https://paraswap.io' },
    { name: 'PolygonScan', url: 'https://polygonscan.com' },
    { name: 'Blockscout', url: 'https://polygon.blockscout.com' },
    { name: 'Ramses', url: 'https://app.ramses.exchange' },
    { name: 'Swaap', url: 'https://app.swaap.finance' },
  ],
  avalanche: [
    { name: 'Trader Joe', url: 'https://traderjoexyz.com' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=avalanche' },
    { name: 'Curve', url: 'https://avalanche.curve.fi' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=43114' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=avalanche' },
    { name: 'Pangolin', url: 'https://pangolin.exchange' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/avalanche' },
    { name: 'Platypus', url: 'https://app.platypus.finance' },
    { name: 'Wombat', url: 'https://wombat.exchange' },
    { name: 'DexScreener', url: 'https://dexscreener.com/avalanche' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Synapse', url: 'https://synapseprotocol.com' },
    { name: 'ParaSwap', url: 'https://paraswap.io' },
    { name: 'Snowtrace', url: 'https://snowtrace.io' },
    { name: 'Blockscout', url: 'https://avalanche.blockscout.com' },
    { name: 'Pharaoh', url: 'https://pharaoh.exchange' },
  ],
  fantom: [
    { name: 'SpookySwap', url: 'https://spooky.fi' },
    { name: 'SpiritSwap', url: 'https://spiritswap.finance' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=250' },
    { name: 'Curve', url: 'https://ftm.curve.fi' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=fantom' },
    { name: 'KyberSwap', url: 'https://kyberswap.com/swap/fantom' },
    { name: 'Wombat', url: 'https://wombat.exchange' },
    { name: 'DexScreener', url: 'https://dexscreener.com/fantom' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'Synapse', url: 'https://synapseprotocol.com' },
    { name: 'FTMScan', url: 'https://ftmscan.com' },
    { name: 'Blockscout', url: 'https://ftm.blockscout.com' },
    { name: 'EmpireDEX', url: 'https://empiredex.io' },
    { name: 'WAGMI', url: 'https://wagmi.com' },
    { name: 'KnightSwap', url: 'https://knightswap.finance' },
  ],
  gnosis: [
    { name: 'Curve', url: 'https://gnosis.curve.fi' },
    { name: 'Sushi', url: 'https://www.sushi.com/swap?chainIds=100' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=gnosis' },
    { name: 'Honeyswap', url: 'https://honeyswap.org' },
    { name: '1inch', url: 'https://app.1inch.io/swap?chain=gnosis' },
    { name: 'DexScreener', url: 'https://dexscreener.com/gnosis' },
    { name: 'Stargate', url: 'https://stargate.finance' },
    { name: 'GnosisScan', url: 'https://gnosisscan.io' },
    { name: 'Blockscout', url: 'https://gnosis.blockscout.com' },
  ],
  berachain: [
    { name: 'BEX', url: 'https://bex.berachain.com' },
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=berachain' },
    { name: 'Kodiak', url: 'https://kodiak.berachain.com' },
    { name: 'DexScreener', url: 'https://dexscreener.com/berachain' },
    { name: 'BeraScan', url: 'https://berascan.com' },
    { name: 'Blockscout', url: 'https://berachain.blockscout.com' },
    { name: 'BrownFi', url: 'https://brownfi.xyz' },
    { name: 'BurrBear', url: 'https://burrbear.com' },
    { name: 'Holdstation', url: 'https://holdstation.xyz' },
    { name: 'Bulla Exchange', url: 'https://bulla.exchange' },
  ],
  taiko: [
    { name: 'Uniswap', url: 'https://app.uniswap.org/swap?chain=taiko' },
    { name: 'DexScreener', url: 'https://dexscreener.com/taiko' },
    { name: 'TaikoScan', url: 'https://taikoscan.io' },
    { name: 'Blockscout', url: 'https://taiko.blockscout.com' },
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
  /https?:\/\/[^"'\s]*etherscan\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*bscscan\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*polygonscan\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*arbiscan\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*ftmscan\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*snowtrace\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*basescan\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*blockscout\.[^"'\s]*/gi,
  /https?:\/\/[^"'\s]*blockpi\.network[^"'\s]*/gi,
];

async function scan() {
  console.log(`# ${CHAIN.toUpperCase()} RPC Discovery`);
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`Scanning ${DEX_SITES.length} DEXs...\n`);
  
  let browser = await chromium.launch({ headless: true });
  const allRpcs = new Map();
  
  for (const dex of DEX_SITES) {
    console.log(`\n## ${dex.name}: ${dex.url}`);
    
    let context, page;
    try {
      context = await browser.newContext();
      page = await context.newPage();
    } catch (e) {
      // Browser crashed - recreate
      try { await browser.close().catch(() => {}); } catch (e) {}
      browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      context = await browser.newContext();
      page = await context.newPage();
    }
    
    try {
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
                const cleanUrl = match.replace(/['"\\\\]/g, '').split(',')[0];
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
      
      console.log('  Loading...');
      await page.goto(dex.url, { timeout: 30000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      // Trigger more RPC calls
      await page.mouse.move(500, 300);
      await page.waitForTimeout(1000);
      
      console.log(`  Found ${rpcRequests.length} RPC requests`);
      
    } catch (e) {
      console.log(`  Error: ${e.message.split('\n')[0]}`);
    }
    
    try {
      if (page) await page.close().catch(() => {});
      if (context) await context.close().catch(() => {});
    } catch (e) {}
    
    // Recreate browser if it crashed
    try {
      await browser.version();
    } catch (e) {
      console.log('  Browser crashed, restarting...');
      try { await browser.close().catch(() => {}); } catch (e) {}
      browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    }
  }
  
  await browser.close();
  
  // Filter for chain-specific RPCs (strict)
  const chainRpcs = [];
  const CHAIN_ALIASES = {
    ethereum: ['eth', 'ethereum', 'mainnet'],
    base: ['base'],
    arbitrum: ['arb', 'arbitrum'],
    optimism: ['opt', 'optimism'],
    bsc: ['bsc', 'bnb'],
    polygon: ['polygon', 'matic'],
    avalanche: ['avax', 'avalanche'],
    fantom: ['ftm', 'fantom'],
    gnosis: ['gnosis', 'xdai'],
    berachain: ['bera', 'berachain'],
  };
  const aliases = CHAIN_ALIASES[CHAIN] || [CHAIN];
  
  for (const [url, info] of allRpcs) {
    const lower = url.toLowerCase();
    // Must be an actual RPC endpoint (not template, not API, not image)
    if (lower.includes('${') || lower.includes('`') || lower.includes('.png') ||
        lower.includes('.jpg') || lower.includes('.svg') || lower.includes('sentry') ||
        lower.includes('googleapis.com') || lower.includes('discord.com') ||
        lower.includes('coingecko') || lower.includes('moonpay') || lower.includes('onramper') ||
        lower.includes('safe.global') || lower.includes('webflow.com') || lower.includes('firebase') ||
        lower.includes('statsig') || lower.includes('ledger.com') || lower.includes('localhost') ||
        lower.includes('127.0.0.1') || lower.includes('testnet') || lower.includes('goerli') ||
        lower.includes('sepolia') || lower.includes('holesky') || lower.includes('mumbai') ||
        lower.includes('fuji') || lower.includes('.api.') || lower.includes('api/v1') ||
        lower.includes('api/v2') || lower.includes('graphql') || lower.includes('quote') ||
        lower.includes('swap?') || lower.includes('block/') || lower.includes('/tx/') ||
        lower.includes('/address/') || lower.includes('/token/') || lower.includes('gas-price') ||
        lower.includes('frontend-rpc') || lower.includes('walletconnect.com/v1?chainId')) continue;
    
    // Must match this chain
    const matchesChain = aliases.some(a => lower.includes(a)) || lower.includes(CHAIN_ID);
    // Must look like an RPC
    const isRpc = lower.includes('rpc') || lower.includes('/v2/') || lower.includes('/v1/') ||
                  lower.includes('quiknode') || lower.includes('drpc') || lower.includes('ankr') ||
                  lower.includes('infura') || lower.includes('alchemy') || lower.includes('publicnode') ||
                  lower.includes('nodies') || lower.includes('blockpi') || lower.includes('blastapi') ||
                  lower.includes('nodesmith') || lower.includes('therpc') || lower.includes('llamarpc');
    
    if (matchesChain && isRpc) {
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
  
  // Test headers for each RPC (max 10 unique)
  console.log('\nTesting headers...');
  const seen = new Set();
  const uniqueRpcs = chainRpcs.filter(r => {
    const key = r.url.replace(/\/v2\/.*/, '/v2/').replace(/\?.*/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
  
  for (const rpc of uniqueRpcs) {
    rpc.headers = {};
    const headers = [null, { 'Origin': 'https://app.uniswap.org' }, { 'User-Agent': 'Mozilla/5.0' }, { 'Referer': 'https://app.uniswap.org' }];
    const results = [];
    for (const h of headers) {
      try {
        const start = Date.now();
        await fetch(rpc.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...h },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
          signal: AbortSignal.timeout(3000),
        });
        results.push({ headers: h, latency: Date.now() - start });
      } catch (e) {
        results.push({ headers: h, error: true });
      }
    }
    // Find best performing header
    const valid = results.filter(r => !r.error);
    if (valid.length > 0) {
      const best = valid.reduce((a, b) => a.latency < b.latency ? a : b);
      rpc.bestHeaders = best.headers;
      rpc.bestLatency = best.latency;
      rpc.headerResults = results;
    }
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
  
  // Append to tested.md
  const testedPath = path.join(OUTPUT_DIR, '..', 'networks', 'evm', CHAIN, 'tested.md');
  if (fs.existsSync(testedPath)) {
    let tested = fs.readFileSync(testedPath, 'utf8');
    // Skip if already has this scan's DEXs
    const scanDate = new Date().toISOString().split('T')[0];
    if (!tested.includes(`Scanned: ${scanDate}`)) {
      const newRpcs = chainRpcs.filter(r => !tested.includes(r.url));
      if (newRpcs.length > 0) {
        let section = `\n## Discovered (${scanDate})\n\n| Source | RPC URL | Best Latency | Header |`;
        section += `\n|--------|--------|-------------|--------|\n`;
        for (const rpc of newRpcs) {
          const latency = rpc.bestLatency ? `${rpc.bestLatency}ms` : '?';
          const header = rpc.bestHeaders ? JSON.stringify(rpc.bestHeaders).replace(/[{}"]/g, '').replace(/:/, ': ') : 'none';
          section += `| ${rpc.dex} | \`${rpc.url}\` | ${latency} | ${header} |\n`;
        }
        tested += section;
        fs.writeFileSync(testedPath, tested);
        console.log(`Appended ${newRpcs.length} new RPCs to ${CHAIN}/tested.md`);
      } else {
        console.log(`No new RPCs for ${CHAIN}/tested.md`);
      }
    }
  }
  
  return chainRpcs;
}

scan().catch(console.error);
