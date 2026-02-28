const https = require('https');

// DRPC keys found from GitHub search
const DRPC_KEYS = [
  // Base keys
  { chain: 'base', chainId: 8453, key: 'AoBzi9hc10ZYuXKhr5g4Uz-ksgFoq00R8LjmQrxF2MGT', source: 'flooor' },
  { chain: 'base', chainId: 8453, key: 'ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT', source: 'Husk-Finance' },
  { chain: 'base', chainId: 8453, key: 'AqsOqlDzTk2hhbZByNV2pZuNHuIx1aIR8KnwCqfUNZ5M', source: 'vii-finance' },
  { chain: 'base', chainId: 8453, key: 'Asv5pVcZpEZuuMS7ScKuU2eUvqwk0b0R75_VQkTKRtpJ', source: 'Koan-Protocol' },
  
  // BSC keys
  { chain: 'bsc', chainId: 56, key: 'Ao7ya0msFUeiigkiZRZwqx8xQhizyg0R8JYQQmlfqV1j', source: 'DRPC-list' },
  
  // Polygon keys
  { chain: 'polygon', chainId: 137, key: 'AksFlvO-tUQvsJxhLBbmJvCRID1tl_YR8LtMwg8TMB_n', source: 'DRPC-list' },
  { chain: 'polygon', chainId: 137, key: 'AnN38OUr3EcfnfM04Tc8vZSVaPnrRU8R8IlbKlzbRHZc', source: 'DRPC-list' },
  { chain: 'polygon', chainId: 137, key: 'AuFiKv0x7UTRpr8JwDNyY03HKrQPxz4R8JULQmlfqV1j', source: 'DRPC-list' },
  
  // Arbitrum key
  { chain: 'arbitrum', chainId: 42161, key: 'AuFiKv0x7UTRpr8JwDNyY03HKrQPxz4R8JULQmlfqV1j', source: 'DRPC-list' },
  
  // Ethereum key
  { chain: 'ethereum', chainId: 1, key: 'ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT', source: 'DRPC-list' },
  
  // Solana key
  { chain: 'solana', chainId: -1, key: 'AnQ1H_zIs0nklopQGunnuPCTcOqT7HkR8Jis_qr8MPTs', source: 'DRPC-list' },
  
  // Unichain (new!)
  { chain: 'unichain', chainId: 130, key: 'AqsOqlDzTk2hhbZByNV2pZuNHuIx1aIR8KnwCqfUNZ5M', source: 'DRPC-list' },
  
  // XLayer (new!)
  { chain: 'xlayer', chainId: 196, key: 'AqsOqlDzTk2hhbZByNV2pZuNHuIx1aIR8KnwCqfUNZ5M', source: 'DRPC-list' },
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
    for (let i = 0; i < 10; i++) {
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
  console.log('# GitHub DRPC Keys - Test Results\n');
  console.log('| Chain | Key | RPS | Mempool | Safe TX | Source |');
  console.log('|-------|-----|-----|---------|---------|--------|');
  
  for (const item of DRPC_KEYS) {
    const url = `https://lb.drpc.live/${item.chain}/${item.key}`;
    process.stdout.write(`Testing ${item.chain}... `);
    
    try {
      const method = item.chain === 'solana' ? 'getHealth' : 'eth_chainId';
      const chainTest = await rpcCall(url, method, [], 8000);
      
      if (chainTest.error) {
        console.log(`ERROR: ${chainTest.error.message?.substring(0, 20)}`);
        continue;
      }
      
      if (item.chainId > 0) {
        const chainId = parseInt(chainTest.result, 16);
        if (chainId !== item.chainId) {
          console.log(`Wrong chain: ${chainId}`);
          continue;
        }
      }
      
      const rps = await testRPS(url);
      const mem = await testMempool(url);
      
      console.log(`${rps.rps.toFixed(0)} RPS, Mempool: ${mem.hasMempool ? 'YES' : 'no'}`);
      console.log(`| ${item.chain} | ${item.key.substring(0, 20)}... | ${rps.rps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${!mem.hasMempool ? '**yes**' : 'no'} | ${item.source} |`);
      
    } catch (e) {
      console.log(`ERROR: ${e.message?.substring(0, 20)}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
}

main().catch(console.error);
