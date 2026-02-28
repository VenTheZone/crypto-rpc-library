const https = require('https');

// Expanded chain RPCs to test
const CHAIN_TESTS = {
  'polygon-zkevm': {
    chainId: 1101,
    name: 'Polygon zkEVM',
    rpcs: [
      { name: 'Official', url: 'https://zkevm-rpc.polygon.technology', foundOn: 'Public' },
      { name: 'DRPC', url: 'https://polygon-zkevm.drpc.org', foundOn: 'DRPC' },
      { name: 'PublicNode', url: 'https://polygon-zkevm-rpc.publicnode.com', foundOn: 'PublicNode' },
    ],
  },
  'celo': {
    chainId: 42220,
    name: 'Celo',
    rpcs: [
      { name: 'Official', url: 'https://forno.celo.org', foundOn: 'Celo' },
      { name: 'DRPC', url: 'https://celo.drpc.org', foundOn: 'DRPC' },
      { name: 'PublicNode', url: 'https://celo-rpc.publicnode.com', foundOn: 'PublicNode' },
    ],
  },
  'gnosis': {
    chainId: 100,
    name: 'Gnosis Chain',
    rpcs: [
      { name: 'Official', url: 'https://rpc.gnosischain.com', foundOn: 'Gnosis' },
      { name: 'DRPC', url: 'https://gnosis.drpc.org', foundOn: 'DRPC' },
      { name: 'PublicNode', url: 'https://gnosis-rpc.publicnode.com', foundOn: 'PublicNode' },
    ],
  },
  'aurora': {
    chainId: 1313161554,
    name: 'Aurora',
    rpcs: [
      { name: 'Official', url: 'https://mainnet.aurora.dev', foundOn: 'Aurora' },
      { name: 'DRPC', url: 'https://aurora.drpc.org', foundOn: 'DRPC' },
    ],
  },
  'cronos': {
    chainId: 25,
    name: 'Cronos',
    rpcs: [
      { name: 'Official', url: 'https://evm.cronos.org', foundOn: 'Cronos' },
      { name: 'DRPC', url: 'https://cronos.drpc.org', foundOn: 'DRPC' },
    ],
  },
  'klaytn': {
    chainId: 8217,
    name: 'Klaytn',
    rpcs: [
      { name: 'Official', url: 'https://klaytn.blockchainapi.org', foundOn: 'Klaytn' },
      { name: 'DRPC', url: 'https://klaytn.drpc.org', foundOn: 'DRPC' },
    ],
  },
  'moonbeam': {
    chainId: 1284,
    name: 'Moonbeam',
    rpcs: [
      { name: 'Official', url: 'https://rpc.api.moonbeam.network', foundOn: 'Moonbeam' },
      { name: 'DRPC', url: 'https://moonbeam.drpc.org', foundOn: 'DRPC' },
      { name: 'PublicNode', url: 'https://moonbeam-rpc.publicnode.com', foundOn: 'PublicNode' },
    ],
  },
  'astar': {
    chainId: 592,
    name: 'Astar',
    rpcs: [
      { name: 'Official', url: 'https://rpc.astar.network:8545', foundOn: 'Astar' },
      { name: 'DRPC', url: 'https://astar.drpc.org', foundOn: 'DRPC' },
    ],
  },
  'fuse': {
    chainId: 122,
    name: 'Fuse',
    rpcs: [
      { name: 'Official', url: 'https://rpc.fuse.io', foundOn: 'Fuse' },
      { name: 'DRPC', url: 'https://fuse.drpc.org', foundOn: 'DRPC' },
    ],
  },
  'zora': {
    chainId: 7777777,
    name: 'Zora',
    rpcs: [
      { name: 'Official', url: 'https://rpc.zora.energy', foundOn: 'Zora' },
      { name: 'DRPC', url: 'https://zora.drpc.org', foundOn: 'DRPC' },
    ],
  },
  'fraxtal': {
    chainId: 4242,
    name: 'Fraxtal',
    rpcs: [
      { name: 'Official', url: 'https://rpc.fraxtal.com', foundOn: 'Fraxtal' },
      { name: 'DRPC', url: 'https://fraxtal.drpc.org', foundOn: 'DRPC' },
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

async function testRPS(url, duration = 2000) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    const batch = [];
    for (let i = 0; i < 8; i++) {
      batch.push(rpcCall(url, 'eth_blockNumber', [], 3000).then(() => results.success++).catch(() => results.failed++));
    }
    await Promise.all(batch);
  }
  return { rps: results.success / ((Date.now() - startTime) / 1000) };
}

async function testMempool(url) {
  try {
    const r = await rpcCall(url, 'txpool_content', [], 8000);
    if (r.error?.code === -32601) return { hasMempool: false };
    return { hasMempool: Object.keys(r.result?.pending || {}).length > 0 };
  } catch { return { hasMempool: false }; }
}

async function main() {
  console.log('# Expanded Chains RPC Test - RPS & Mempool\n');
  console.log('| Chain | RPC | RPS | Mempool | Safe TX |');
  console.log('|-------|-----|-----|---------|---------|');
  
  for (const [key, chain] of Object.entries(CHAIN_TESTS)) {
    for (const rpc of chain.rpcs) {
      process.stdout.write(`${chain.name} - ${rpc.name}... `);
      try {
        const chainTest = await rpcCall(rpc.url, 'eth_chainId', [], 8000);
        if (chainTest.error) {
          console.log('ERROR');
          continue;
        }
        
        const chainId = parseInt(chainTest.result, 16);
        if (chainId !== chain.chainId) {
          console.log(`WRONG (${chainId})`);
          continue;
        }
        
        const rps = await testRPS(rpc.url);
        const mem = await testMempool(rpc.url);
        
        console.log(`${rps.rps.toFixed(0)} RPS, Mempool: ${mem.hasMempool ? 'YES' : 'no'}`);
        console.log(`| ${chain.name} | ${rpc.name} | ${rps.rps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${!mem.hasMempool ? '**yes**' : 'no'} |`);
        
      } catch (e) {
        console.log(`ERROR: ${e.message?.substring(0, 20)}`);
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

main().catch(console.error);
