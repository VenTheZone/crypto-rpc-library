const https = require('https');

// Test RPS with Origin header
async function testRPSWithOrigin(url, origin, concurrency = 12, duration = 2500) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  
  const runRequest = async () => {
    try {
      const urlObj = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] });
      
      return new Promise((resolve) => {
        const options = {
          hostname: urlObj.hostname,
          port: 443,
          path: urlObj.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Origin': origin,
          },
          timeout: 5000,
        };
        
        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(body);
              if (!json.error) results.success++;
              else results.failed++;
            } catch { results.failed++; }
            resolve();
          });
        });
        req.on('error', () => { results.failed++; resolve(); });
        req.on('timeout', () => { req.destroy(); results.failed++; resolve(); });
        req.write(data);
        req.end();
      });
    } catch { results.failed++; }
  };

  while (Date.now() - startTime < duration) {
    const batch = [];
    for (let i = 0; i < concurrency; i++) batch.push(runRequest());
    await Promise.all(batch);
  }

  return { rps: results.success / ((Date.now() - startTime) / 1000) };
}

async function testMempoolWithOrigin(url, origin) {
  try {
    const urlObj = new URL(url);
    const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'txpool_content', params: [] });
    
    return new Promise((resolve) => {
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'Origin': origin,
        },
        timeout: 10000,
      };
      
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json.error?.code === -32601) resolve({ hasMempool: false });
            else resolve({ hasMempool: Object.keys(json.result?.pending || {}).length > 0 });
          } catch { resolve({ hasMempool: false }); }
        });
      });
      req.on('error', () => resolve({ hasMempool: false }));
      req.on('timeout', () => { req.destroy(); resolve({ hasMempool: false }); });
      req.write(data);
      req.end();
    });
  } catch { return { hasMempool: false }; }
}

async function main() {
  const url = 'https://base-rpc.kyberswap.com';
  const origin = 'https://jup.ag';
  
  console.log('# KyberSwap Base RPC - Full Test with Origin Spoofing\n');
  console.log(`URL: ${url}`);
  console.log(`Origin Header: ${origin}\n`);
  
  // Test chain ID first
  console.log('Testing chain ID...');
  const urlObj = new URL(url);
  const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] });
  
  const chainResult = await new Promise((resolve) => {
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Origin': origin,
      },
      timeout: 10000,
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.write(data);
    req.end();
  });
  
  if (chainResult.result) {
    const chainId = parseInt(chainResult.result, 16);
    console.log(`Chain ID: ${chainId} ${chainId === 8453 ? '✅ (Base)' : '❌ (Wrong chain)'}`);
  } else {
    console.log('Error:', chainResult.error);
    return;
  }
  
  // RPS Test
  console.log('\nTesting RPS...');
  const rps = await testRPSWithOrigin(url, origin);
  console.log(`RPS: ${rps.rps.toFixed(0)}`);
  
  // Mempool Test
  console.log('\nTesting Mempool...');
  const mem = await testMempoolWithOrigin(url, origin);
  console.log(`Mempool: ${mem.hasMempool ? 'yes' : 'no'}`);
  
  // Summary
  console.log('\n---\n');
  console.log('| Name | URL | RPS | Mempool | Safe TX | Requires Origin |');
  console.log('|------|-----|-----|---------|---------|-----------------|');
  console.log(`| KyberSwap Base | ${url} | ${rps.rps.toFixed(0)} | ${mem.hasMempool ? 'yes' : 'no'} | ${!mem.hasMempool ? '**yes**' : 'no'} | ${origin} |`);
  
  console.log('\n**Usage:**');
  console.log('```bash');
  console.log(`curl -X POST ${url} \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "Origin: ${origin}" \\`);
  console.log(`  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'`);
  console.log('```');
}

main().catch(console.error);
