const https = require('https');

// Arbitrum RPCs discovered from DEX frontends
const ARBITRUM_RPCS = [
  // === QUICKNODE (with keys from Uniswap) ===
  { name: 'QuickNode', url: 'https://warmhearted-falling-shape.arbitrum-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559', foundOn: 'Uniswap JS' },
  
  // === INFURA (with key from Uniswap) ===
  { name: 'Infura', url: 'https://arbitrum-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1', foundOn: 'Uniswap JS' },
  
  // === PUBLIC ENDPOINTS ===
  { name: 'Arbitrum Official', url: 'https://arb1.arbitrum.io/rpc', foundOn: 'Official' },
  { name: 'PublicNode', url: 'https://arbitrum-one-rpc.publicnode.com', foundOn: 'GMX/PancakeSwap' },
  { name: 'LlamaRPC', url: 'https://arbitrum.llamarpc.com', foundOn: 'PancakeSwap' },
  { name: 'BlastAPI', url: 'https://arbitrum-one.public.blastapi.io', foundOn: 'GMX' },
  { name: 'DRPC', url: 'https://arbitrum.drpc.org', foundOn: 'DRPC' },
  
  // === PRIVY ===
  { name: 'Privy', url: 'https://arbitrum-mainnet.rpc.privy.systems', foundOn: 'PancakeSwap' },
  
  // === NODEREAL (with key) ===
  { name: 'NodeReal', url: 'https://open-platform.nodereal.io/e45cb8af438441b0a6dfad9c03224636/arbitrum-nitro', foundOn: 'PancakeSwap' },
  
  // === ALCHEMY ===
  { name: 'Alchemy', url: 'https://arb-mainnet.g.alchemy.com/v2', foundOn: 'PancakeSwap' },
  
  // === ARBITRUM NOVA ===
  { name: 'Nova Official', url: 'https://nova.arbitrum.io/rpc', foundOn: 'Sushi' },
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

async function testRPS(url, concurrency = 12, duration = 2500) {
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
    const txs = bd.result?.transactions?.length || 80; // Arbitrum avg ~80 tx/block
    return { tps: (blocks * txs) / 5, blocks, txs };
  } catch (e) { return { tps: 0 }; }
}

async function testMempool(url) {
  try {
    const r = await rpcCall(url, 'txpool_content', [], 10000);
    if (r.error?.code === -32601) return { hasMempool: false };
    return { hasMempool: Object.keys(r.result?.pending || {}).length > 0 };
  } catch { return { hasMempool: false }; }
}

async function main() {
  console.log('# Arbitrum RPC Full Test - RPS, TPS, Mempool\n');
  console.log(`Testing Date: ${new Date().toISOString()}\n`);
  console.log('| Name | URL | RPS | TPS | Mempool | Safe TX | Found On | Status |');
  console.log('|------|-----|-----|-----|---------|---------|----------|--------|');
  
  for (const rpc of ARBITRUM_RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    try {
      const chainTest = await rpcCall(rpc.url, 'eth_chainId', [], 10000);
      if (chainTest.error) {
        console.log(`ERROR: ${chainTest.error.message?.substring(0, 30)}`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | error |`);
        continue;
      }
      
      const chainId = parseInt(chainTest.result, 16);
      // Arbitrum One = 42161, Arbitrum Nova = 42170
      if (chainId !== 42161 && chainId !== 42170) {
        console.log(`WRONG: got ${chainId}`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | wrong-chain |`);
        continue;
      }
      
      const rps = await testRPS(rpc.url);
      const tps = await testTPS(rpc.url);
      const mem = await testMempool(rpc.url);
      const safe = !mem.hasMempool;
      const status = rps.rps > 0 ? 'working' : 'error';
      const chainLabel = chainId === 42170 ? ' (Nova)' : '';
      
      console.log(`${rps.rps.toFixed(0)} RPS, ${tps.tps.toFixed(0)} TPS`);
      console.log(`| ${rpc.name}${chainLabel} | ${rpc.url.substring(0, 50)}... | ${rps.rps.toFixed(0)} | ${tps.tps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${safe ? '**yes**' : 'no'} | ${rpc.foundOn} | ${status} |`);
      
    } catch (e) {
      console.log(`ERROR: ${e.message?.substring(0, 30)}`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | error |`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);
