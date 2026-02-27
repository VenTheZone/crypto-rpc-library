const https = require('https');

// NEW Base RPCs discovered from full DEX scan
const NEW_RPCS = [
  // Nodies POKT endpoint
  { name: 'Nodies POKT', url: 'https://base-pokt.nodies.app', foundOn: 'PancakeSwap JS' },
  
  // BlockPi public
  { name: 'BlockPi', url: 'https://base.blockpi.network/v1/rpc/public', foundOn: 'PancakeSwap JS' },
  
  // Tenderly gateway
  { name: 'Tenderly', url: 'https://base.gateway.tenderly.co', foundOn: 'PancakeSwap JS' },
  
  // Equalizer's own RPC
  { name: 'Equalizer', url: 'https://base.equalizer.exchange', foundOn: 'Equalizer' },
  
  // Privy
  { name: 'Privy', url: 'https://base-mainnet.rpc.privy.systems', foundOn: 'PancakeSwap JS' },
  
  // Gelato BaseCamp
  { name: 'Gelato BaseCamp', url: 'https://rpc.basecamp.t.raas.gelato.cloud', foundOn: 'PancakeSwap JS' },
  
  // Already known for comparison
  { name: 'Nodies (ref)', url: 'https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb', foundOn: 'Already tested' },
  { name: 'Base Official (ref)', url: 'https://mainnet.base.org', foundOn: 'Official' },
];

function rpcCall(url, method, params = [], timeout = 10000) {
  return new Promise((resolve, reject) => {
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
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(data);
    req.end();
  });
}

async function testRPS(url, concurrency = 12, duration = 2500) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  const runRequest = async () => {
    try { await rpcCall(url, 'eth_blockNumber', [], 5000); results.success++; } catch (e) { results.failed++; }
  };
  while (Date.now() - startTime < duration) {
    const batch = []; for (let i = 0; i < concurrency; i++) batch.push(runRequest());
    await Promise.all(batch);
  }
  return { rps: results.success / ((Date.now() - startTime) / 1000) };
}

async function testTPS(url) {
  try {
    const b1 = await rpcCall(url, 'eth_blockNumber', [], 15000);
    if (b1.error) return { tps: 0 };
    const n1 = parseInt(b1.result, 16);
    await new Promise(r => setTimeout(r, 5000));
    const b2 = await rpcCall(url, 'eth_blockNumber', [], 15000);
    if (b2.error) return { tps: 0 };
    const n2 = parseInt(b2.result, 16);
    const blocks = n2 - n1;
    if (blocks === 0) return { tps: 0, blocks: 0 };
    const bd = await rpcCall(url, 'eth_getBlockByNumber', [`0x${n2.toString(16)}`, false], 15000);
    const txs = bd.result?.transactions?.length || 50;
    return { tps: (blocks * txs) / 5, blocks, txs };
  } catch (e) { return { tps: 0 }; }
}

async function testMempool(url) {
  try {
    const r = await rpcCall(url, 'txpool_content', [], 10000);
    if (r.error?.code === -32601) return { hasMempool: false };
    if (r.error) return { hasMempool: false };
    const p = Object.keys(r.result?.pending || {}).length;
    const q = Object.keys(r.result?.queued || {}).length;
    return { hasMempool: p > 0 || q > 0 };
  } catch (e) { return { hasMempool: false }; }
}

async function main() {
  console.log('# NEW Base RPCs - Full Test\n');
  console.log('| Name | URL | RPS | TPS | Mempool | Safe TX | Found On | Status |');
  console.log('|------|-----|-----|-----|---------|---------|----------|--------|');
  
  for (const rpc of NEW_RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    try {
      const chain = await rpcCall(rpc.url, 'eth_chainId', [], 10000);
      if (chain.error) {
        console.log(`ERROR: ${chain.error.message?.substring(0, 30)}`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | error |`);
        continue;
      }
      if (parseInt(chain.result, 16) !== 8453) {
        console.log(`WRONG CHAIN`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | wrong-chain |`);
        continue;
      }
      
      const rps = await testRPS(rpc.url);
      const tps = await testTPS(rpc.url);
      const mem = await testMempool(rpc.url);
      const safe = !mem.hasMempool;
      const status = rps.rps > 0 ? 'working' : 'error';
      
      console.log(`RPS: ${rps.rps.toFixed(0)}, TPS: ${tps.tps.toFixed(0)}, Mempool: ${mem.hasMempool}`);
      console.log(`| ${rpc.name} | ${rpc.url} | ${rps.rps.toFixed(0)} | ${tps.tps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${safe ? '**yes**' : 'no'} | ${rpc.foundOn} | ${status} |`);
    } catch (e) {
      console.log(`ERROR: ${e.message?.substring(0, 30)}`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | error |`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);
