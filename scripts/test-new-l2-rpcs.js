const https = require('https');

// New L2 Chain RPCs to test
const CHAIN_TESTS = {
  berachain: {
    chainId: 80094,
    rpcs: [
      { name: 'Official', url: 'https://rpc.berachain.com', foundOn: 'Known' },
      { name: 'PublicNode', url: 'https://berachain-evm-rpc.publicnode.com', foundOn: 'PublicNode' },
      { name: 'Thirdweb', url: 'https://bera.rpc.thirdweb.com', foundOn: 'Thirdweb' },
    ],
  },
  blast: {
    chainId: 81457,
    rpcs: [
      { name: 'Official', url: 'https://rpc.blast.io', foundOn: 'Known' },
      { name: 'DRPC', url: 'https://blast.drpc.org', foundOn: 'DRPC' },
      { name: 'PublicNode', url: 'https://blast-evm-rpc.publicnode.com', foundOn: 'PublicNode' },
      { name: 'Ankr', url: 'https://rpc.ankr.com/blast', foundOn: 'Ankr' },
    ],
  },
  scroll: {
    chainId: 534352,
    rpcs: [
      { name: 'Official', url: 'https://rpc.scroll.io', foundOn: 'Known' },
      { name: 'DRPC', url: 'https://scroll.drpc.org', foundOn: 'DRPC' },
      { name: 'PublicNode', url: 'https://scroll-evm-rpc.publicnode.com', foundOn: 'PublicNode' },
    ],
  },
  zksync: {
    chainId: 324,
    rpcs: [
      { name: 'Official', url: 'https://mainnet.era.zksync.io', foundOn: 'Known' },
      { name: 'DRPC', url: 'https://zksync.drpc.org', foundOn: 'DRPC' },
    ],
  },
  linea: {
    chainId: 59144,
    rpcs: [
      { name: 'Official', url: 'https://rpc.linea.build', foundOn: 'Known' },
      { name: 'DRPC', url: 'https://linea.drpc.org', foundOn: 'DRPC' },
    ],
  },
  mantle: {
    chainId: 5000,
    rpcs: [
      { name: 'Official', url: 'https://rpc.mantle.xyz', foundOn: 'Known' },
      { name: 'DRPC', url: 'https://mantle.drpc.org', foundOn: 'DRPC' },
      { name: 'Moon Key', url: 'https://rpc-moon.sepolia.mantle.xyz/v1/OTEyYjhkZmJlZGFjOGFkMGUxZDNmMDYz', foundOn: 'Mantle JS' },
    ],
  },
  mode: {
    chainId: 34443,
    rpcs: [
      { name: 'Official', url: 'https://mainnet.mode.network', foundOn: 'Known' },
      { name: 'DRPC', url: 'https://mode.drpc.org', foundOn: 'DRPC' },
    ],
  },
};

function rpcCall(url, method, params = [], timeout = 10000) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
        timeout,
      };
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(new Error(`JSON: ${body.substring(0, 50)}`)); } });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(data);
      req.end();
    } catch (e) { reject(e); }
  });
}

async function testRPS(url, concurrency = 10, duration = 2000) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    const batch = [];
    for (let i = 0; i < concurrency; i++) {
      batch.push(rpcCall(url, 'eth_blockNumber', [], 5000).then(() => results.success++).catch(() => results.failed++));
    }
    await Promise.all(batch);
  }
  return { rps: results.success / ((Date.now() - startTime) / 1000) };
}

async function testMempool(url) {
  try {
    const r = await rpcCall(url, 'txpool_content', [], 10000);
    if (r.error?.code === -32601) return { hasMempool: false };
    return { hasMempool: Object.keys(r.result?.pending || {}).length > 0 };
  } catch { return { hasMempool: false }; }
}

async function main() {
  console.log('# New L2 Chains RPC Test\n');
  
  for (const [chainName, chain] of Object.entries(CHAIN_TESTS)) {
    console.log(`\n## ${chainName.toUpperCase()} (Chain ID: ${chain.chainId})\n`);
    console.log('| Name | RPS | Mempool | Safe TX | Found On | Status |');
    console.log('|------|-----|---------|---------|----------|--------|');
    
    for (const rpc of chain.rpcs) {
      process.stdout.write(`Testing ${rpc.name}... `);
      try {
        const chainTest = await rpcCall(rpc.url, 'eth_chainId', [], 10000);
        if (chainTest.error) {
          console.log(`ERROR: ${chainTest.error.message?.substring(0, 30)}`);
          console.log(`| ${rpc.name} | - | - | - | ${rpc.foundOn} | error |`);
          continue;
        }
        
        const chainId = parseInt(chainTest.result, 16);
        if (chainId !== chain.chainId) {
          console.log(`WRONG: got ${chainId}`);
          console.log(`| ${rpc.name} | - | - | - | ${rpc.foundOn} | wrong-chain |`);
          continue;
        }
        
        const rps = await testRPS(rpc.url);
        const mem = await testMempool(rpc.url);
        const safe = !mem.hasMempool;
        const status = rps.rps > 0 ? 'working' : 'error';
        
        console.log(`${rps.rps.toFixed(0)} RPS`);
        console.log(`| ${rpc.name} | ${rps.rps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${safe ? '**yes**' : 'no'} | ${rpc.foundOn} | ${status} |`);
        
      } catch (e) {
        console.log(`ERROR: ${e.message?.substring(0, 30)}`);
        console.log(`| ${rpc.name} | - | - | - | ${rpc.foundOn} | error |`);
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

main().catch(console.error);
