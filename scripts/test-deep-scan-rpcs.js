const https = require('https');

// RPCs from deep scan
const NEW_RPCS = [
  // DRPC with keys from Sushi (multiple chains!)
  { name: 'DRPC Celo', url: 'https://lb.drpc.live/ogrpc?network=celo&dkey=...', foundOn: 'Sushi' },
  { name: 'DRPC Gnosis', url: 'https://lb.drpc.live/ogrpc?network=gnosis&dkey=...', foundOn: 'Sushi' },
  { name: 'DRPC Polygon zkEVM', url: 'https://lb.drpc.live/ogrpc?network=polygon-zkevm&dkey=...', foundOn: 'Sushi' },
  { name: 'DRPC Cronos', url: 'https://lb.drpc.live/ogrpc?network=cronos&dkey=...', foundOn: 'Sushi' },
  
  // Thirdweb endpoints
  { name: 'Thirdweb Cronos', url: 'https://250.rpc.thirdweb.com', foundOn: 'VVS' },
  { name: 'Thirdweb Gnosis', url: 'https://21000000.rpc.thirdweb.com', foundOn: 'Curve' },
  
  // Onfinality (Moonbeam)
  { name: 'Onfinality Moonbeam', url: 'https://moonbeam.api.onfinality.io/public', foundOn: 'Solarbeam' },
  
  // Additional known public RPCs
  { name: 'Polygon zkEVM Public', url: 'https://rpc.ankr.com/polygon_zkevm', foundOn: 'Public' },
  { name: 'Polygon zkEVM Gateway', url: 'https://rpc.zkevm.cronos.org', foundOn: 'Sushi' },
  
  // Existing to compare
  { name: 'DRPC Celo (existing)', url: 'https://celo.drpc.org', foundOn: 'DRPC' },
  { name: 'DRPC Gnosis (existing)', url: 'https://gnosis.drpc.org', foundOn: 'DRPC' },
];

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
  console.log('# New RPCs from Deep Scan - Test Results\n');
  console.log('| RPC Name | URL | RPS | Mempool | Safe TX |');
  console.log('|----------|-----|-----|---------|---------|');
  
  for (const rpc of NEW_RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    try {
      const chainTest = await rpcCall(rpc.url, 'eth_chainId', [], 8000);
      if (chainTest.error) {
        console.log(`ERROR: ${chainTest.error.message?.substring(0, 30)}`);
        continue;
      }
      
      const chainId = parseInt(chainTest.result, 16);
      const rps = await testRPS(rpc.url);
      const mem = await testMempool(rpc.url);
      
      console.log(`${rps.rps.toFixed(0)} RPS, Mempool: ${mem.hasMempool ? 'YES' : 'no'}`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | ${rps.rps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${!mem.hasMempool ? '**yes**' : 'no'} |`);
      
    } catch (e) {
      console.log(`ERROR: ${e.message?.substring(0, 30)}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
}

main().catch(console.error);
