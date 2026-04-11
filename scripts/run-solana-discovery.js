const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRIPTS = [
  'scan-solana-a.js',
  'scan-solana-b.js', 
  'scan-solana-c.js',
  'scan-solana-d.js',
  'scan-solana-data.js',
  'scan-solana-dex.js',
  'scan-solana-dex2.js',
  'scan-solana-dex3.js',
  'scan-solana-dex4.js',
  'scan-solana-nft.js',
  'scan-solana-other.js',
  'scan-solana-wallets.js'
];

const RPC_PATTERNS = [
  /https?:\/\/[^\s"'<>\s)]+\.helius-rpc\.com[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.helius\.xyz[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.helius\.dev[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.rpcpool\.com[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.quiknode\.pro[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.g\.alchemy\.com[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.ironforge\.network[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+\.phantom\.app[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+solana-mainnet[^\s"'<>\s)]*/gi,
  /https?:\/\/[^\s"'<>\s)]+fast-mainnet[^\s"'<>\s)]*/gi,
];

function extractRPCs(text, source) {
  const found = new Map();
  RPC_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(url => {
        let cleanUrl = url
          .replace(/\\/g, '')
          .replace(/["'<>)]/g, '')
          .replace(/\$\{[^}]+\}/g, '')
          .trim();
        
        if (cleanUrl.length > 10 && cleanUrl.startsWith('http')) {
          found.set(cleanUrl, source);
        }
      });
    }
  });
  return found;
}

async function runScript(scriptPath) {
  return new Promise((resolve) => {
    try {
      console.log(`\n📦 Running ${scriptPath}...`);
      const output = execSync(`node ${scriptPath}`, { 
        cwd: __dirname,
        encoding: 'utf8',
        timeout: 120000,
        maxBuffer: 10 * 1024 * 1024
      });
      console.log(`✅ ${scriptPath} completed`);
      resolve({ script: scriptPath, output, error: null });
    } catch (e) {
      console.log(`⚠️ ${scriptPath} finished with warnings`);
      resolve({ script: scriptPath, output: e.stdout || e.message, error: e.stderr });
    }
  });
}

async function main() {
  console.log('# Solana RPC Discovery Master Runner\n');
  console.log(`Running ${SCRIPTS.length} discovery scripts...\n`);
  
  const allRPCs = new Map();
  const results = [];
  
  for (const script of SCRIPTS) {
    const scriptPath = path.join(__dirname, script);
    if (!fs.existsSync(scriptPath)) {
      console.log(`⏭️ Skipping ${script} (not found)`);
      continue;
    }
    
    const result = await runScript(scriptPath);
    results.push(result);
    
    const found = extractRPCs(result.output, script);
    found.forEach((source, url) => {
      if (!allRPCs.has(url)) {
        allRPCs.set(url, { sources: [], discovered: new Date().toISOString() });
      }
      if (!allRPCs.get(url).sources.includes(source)) {
        allRPCs.get(url).sources.push(source);
      }
    });
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n## Discovery Summary\n');
  console.log(`**Total unique RPCs found:** ${allRPCs.size}`);
  
  // Load existing
  const discoveredPath = path.join(__dirname, '..', 'data', 'solana', 'solana-discovered.json');
  let existingURLs = new Set();
  let discoveredData = { httpRpcs: {}, websockets: {}, scanned: [], timestamp: new Date().toISOString() };
  
  try {
    discoveredData = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'));
    existingURLs = new Set(Object.keys(discoveredData.httpRpcs || {}));
    console.log(`**Already known:** ${existingURLs.size}`);
  } catch (e) {
    console.log('No existing discovery file');
  }
  
  // Filter new
  const newRPCs = [];
  allRPCs.forEach((data, url) => {
    if (!existingURLs.has(url)) {
      newRPCs.push({ url, ...data });
    }
  });
  
  console.log(`**New RPCs discovered:** ${newRPCs.length}\n`);
  
  if (newRPCs.length > 0) {
    console.log('### New RPCs:\n');
    newRPCs.forEach(rpc => {
      console.log(`- ${rpc.url}`);
      console.log(`  Sources: ${rpc.sources.join(', ')}`);
    });
    
    // Add to discovered data
    newRPCs.forEach(rpc => {
      discoveredData.httpRpcs[rpc.url] = {
        dex: rpc.sources[0].replace('.js', ''),
        methods: ['discovered'],
        source: rpc.sources.join(', '),
        discovered: rpc.discovered
      };
    });
    
    fs.writeFileSync(discoveredPath, JSON.stringify(discoveredData, null, 2));
    console.log(`\n📁 Updated ${discoveredPath}`);
  }
  
  // Save new RPCs to test file
  if (newRPCs.length > 0) {
    const newRPCsPath = path.join(__dirname, '..', 'data', 'solana', 'solana-new-rpcs.json');
    fs.writeFileSync(newRPCsPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      newCount: newRPCs.length,
      newRPCs: newRPCs
    }, null, 2));
    console.log(`📁 Saved ${newRPCs.length} new RPCs to test`);
  }
  
  return { total: allRPCs.size, new: newRPCs.length, rpcs: [...allRPCs.keys()] };
}

main().catch(console.error);
