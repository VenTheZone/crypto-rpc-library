const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Extended list of Solana DEXs and services to scan
const SOLANA_SITES = [
  // Major DEXs
  'https://jup.ag',
  'https://raydium.io',
  'https://www.orca.so',
  'https://www.meteora.ag',
  'https://app.drift.trade',
  'https://kamino.com',
  'https://app.marginfi.com',
  'https://solend.fi',
  'https://www.tensor.trade',
  'https://pump.fun',
  'https://moonshot.meme',
  'https://dexscreener.com/solana',
  'https://birdeye.so',
  
  // Additional DEXs and aggregators
  'https://lifinity.io',
  'https://cropper.finance',
  'https://saros.finance',
  'https://cykura.io',
  'https://saber.so',
  'https://mercurial.finance',
  'https://www.step.finance',
  'https://:flutter.dev', // for phantom
  
  // Liquid staking
  'https://marinade.finance',
  'https://socean.fi',
  'https://jpool.jps',
  'https://www.jito.wtf',
  'https://www.lido.fi/solana',
  
  // Lending/Borrowing
  'https://fraktion.app',
  'https://hubbleprotocol.io',
  
  // NFT Marketplaces
  'https://magiceden.io',
  'https:// CoralCube.io',
  'https:// CoralCube.io', // removed trailing comma
  
  // Wallets
  'https://phantom.app',
  'https://solflare.com',
  'https://backpack.app',
  'https://www.glow.app',
  
  // Analytics
  'https://solana.fm',
  'https://solscan.io',
  'https://explorer.solana.com',
  'https://www.sollective.io',
  
  // Trading bots
  'https://t.me/banana_gun_bot',
  'https://t.me/maestro_bot',
  'https://bonkbot.io',
  
  // Other
  'https://openserum.io',
  'https://defillama.com/chain/solana',
];

// Patterns to identify RPC endpoints
const RPC_PATTERNS = [
  /https?:\/\/[^\s"'<>]+\.helius-rpc\.com[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.helius\.xyz[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.helius\.dev[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.rpcpool\.com[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.quiknode\.pro[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.g\.alchemy\.com[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.ironforge\.network[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+\.phantom\.app[^\s"'<>]*/gi,
  /https?:\/\/api\.(mainnet-beta|devnet|testnet)\.solana\.com[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+solana[^\s"'<>]*\.rpc[^\s"'<>]*/gi,
  /wss?:\/\/[^\s"'<>]+solana[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+solana-mainnet[^\s"'<>]*/gi,
  /https?:\/\/[^\s"'<>]+fast-mainnet[^\s"'<>]*/gi,
];

function extractRPCs(text, source) {
  const found = new Set();
  RPC_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(url => {
        // Clean up the URL
        let cleanUrl = url
          .replace(/\\/g, '')
          .replace(/\/$/, '')
          .replace(/[`'"<>]/g, '')
          .replace(/\$\{[^}]+\}/g, '')
          .replace(/\+[^,]+/g, '')
          .trim();
        
        if (cleanUrl.length > 10 && cleanUrl.startsWith('http')) {
          found.add(JSON.stringify({ url: cleanUrl, source }));
        }
      });
    }
  });
  return [...found].map(s => JSON.parse(s));
}

async function scanSite(page, url, foundRPCs) {
  const requests = [];
  
  page.on('request', (req) => {
    const reqUrl = req.url();
    requests.push(reqUrl);
    
    // Check if it's an RPC request
    if (reqUrl.includes('rpc') || 
        reqUrl.includes('solana') || 
        reqUrl.includes('helius') ||
        reqUrl.includes('alchemy') ||
        reqUrl.includes('quiknode') ||
        reqUrl.includes('rpcpool') ||
        reqUrl.includes('ironforge')) {
      const rpcs = extractRPCs(reqUrl, url);
      rpcs.forEach(rpc => foundRPCs.set(rpc.url, { ...rpc, method: 'network' }));
    }
  });
  
  try {
    await page.goto(url, { timeout: 20000, waitUntil: 'networkidle' });
    
    // Wait for dynamic content
    await page.waitForTimeout(5000);
    
    // Get page content
    const html = await page.content();
    const rpcs = extractRPCs(html, url);
    rpcs.forEach(rpc => foundRPCs.set(rpc.url, { ...rpc, method: 'html' }));
    
    // Get all script sources
    const scripts = await page.$$eval('script[src]', scripts => 
      scripts.filter(s => s.src.includes('.js')).map(s => s.src)
    );
    
    // Fetch and scan script content
    for (const scriptUrl of scripts.slice(0, 10)) {
      try {
        const response = await page.evaluate(async (url) => {
          const res = await fetch(url);
          return res.text();
        }, scriptUrl);
        
        const scriptRPCs = extractRPCs(response, scriptUrl);
        scriptRPCs.forEach(rpc => foundRPCs.set(rpc.url, { ...rpc, method: 'js' }));
      } catch (e) {
        // Ignore fetch errors
      }
    }
    
    console.log(`✅ Scanned ${url} - found ${foundRPCs.size} unique RPCs`);
  } catch (e) {
    console.log(`⚠️ ${url}: ${e.message.substring(0, 60)}`);
  }
}

async function main() {
  console.log('# Discovering New Solana RPCs\n');
  console.log(`Scanning ${SOLANA_SITES.length} sites...\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const foundRPCs = new Map();
  
  // Load existing RPCs to avoid duplicates
  const discoveredPath = path.join(__dirname, '..', 'data', 'solana', 'solana-discovered.json');
  let existingURLs = new Set();
  try {
    const existing = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'));
    Object.keys(existing.httpRpcs || {}).forEach(url => existingURLs.add(url));
    console.log(`Loaded ${existingURLs.size} existing RPCs to skip duplicates\n`);
  } catch (e) {
    console.log('No existing discovery file found\n');
  }
  
  for (const url of SOLANA_SITES) {
    process.stdout.write(`Scanning ${url}... `);
    const page = await context.newPage();
    await scanSite(page, url, foundRPCs);
    await page.close();
    await new Promise(r => setTimeout(r, 500));
  }
  
  await browser.close();
  
  // Filter out existing RPCs
  const newRPCs = [];
  foundRPCs.forEach((data, url) => {
    if (!existingURLs.has(url)) {
      newRPCs.push({ url, ...data });
    }
  });
  
  console.log(`\n## Results\n`);
  console.log(`**Total unique RPCs found:** ${foundRPCs.size}`);
  console.log(`**New RPCs discovered:** ${newRPCs.length}`);
  console.log(`**Already known:** ${foundRPCs.size - newRPCs.length}`);
  
  if (newRPCs.length > 0) {
    console.log('\n### New RPCs:\n');
    newRPCs.forEach(rpc => {
      console.log(`- ${rpc.url} (${rpc.method})`);
    });
  }
  
  // Save results
  const resultsPath = path.join(__dirname, '..', 'data', 'solana', 'solana-new-rpcs.json');
  const results = {
    timestamp: new Date().toISOString(),
    totalFound: foundRPCs.size,
    newCount: newRPCs.length,
    newRPCs: newRPCs,
    allRPCs: [...foundRPCs.entries()].map(([url, data]) => ({ url, ...data }))
  };
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 Results saved to: ${resultsPath}`);
  
  // Also update the main discovered file
  if (newRPCs.length > 0) {
    const discoveredData = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'));
    newRPCs.forEach(rpc => {
      discoveredData.httpRpcs[rpc.url] = {
        dex: rpc.source.split('/')[2] || 'Discovery',
        methods: [rpc.method],
        source: rpc.source,
        discovered: new Date().toISOString()
      };
    });
    fs.writeFileSync(discoveredPath, JSON.stringify(discoveredData, null, 2));
    console.log(`📁 Updated ${discoveredPath} with ${newRPCs.length} new RPCs`);
  }
  
  return results;
}

main().catch(console.error);
