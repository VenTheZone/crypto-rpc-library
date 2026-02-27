const https = require('https');
const http = require('http');

const RPCS_TO_TEST = [
  { name: 'DRPC (Aerodrome)', url: 'https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO', source: 'Aerodrome' },
  { name: 'DRPC (BaseSwap)', url: 'https://base.drpc.org/', source: 'BaseSwap' },
  { name: 'PublicNode Base', url: 'https://base.publicnode.com/', source: 'PancakeSwap' },
  { name: 'LlamaRPC Base', url: 'https://base.llamarpc.com/', source: 'PancakeSwap' },
  { name: 'MeowRPC Base', url: 'https://base.meowrpc.com/', source: 'PancakeSwap' },
  { name: 'Base Official', url: 'https://mainnet.base.org/', source: 'PancakeSwap' },
  // Already known ones for comparison
  { name: 'Blast (existing)', url: 'https://base.drpc.org', source: 'DRPC' },
  { name: '1rpc.io/base (existing)', url: 'https://1rpc.io/base', source: '1rpc.io' },
  { name: 'PublicNode (existing)', url: 'https://base-rpc.publicnode.com', source: 'PublicNode' },
];

// RPC call helper
function rpcCall(url, method, params = []) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    });

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname || '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
      timeout: 10000,
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(data);
    req.end();
  });
}

// Test RPS - fire N concurrent requests
async function testRPS(url, concurrency = 20, duration = 3000) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  
  const runRequest = async () => {
    try {
      await rpcCall(url, 'eth_blockNumber');
      results.success++;
    } catch (e) {
      results.failed++;
    }
  };

  // Run for duration
  while (Date.now() - startTime < duration) {
    const batch = [];
    for (let i = 0; i < concurrency; i++) {
      batch.push(runRequest());
    }
    await Promise.all(batch);
  }

  const elapsed = (Date.now() - startTime) / 1000;
  return {
    rps: results.success / elapsed,
    success: results.success,
    failed: results.failed,
  };
}

// Test TPS - measure blocks and transactions over time
async function testTPS(url) {
  try {
    // Get current block
    const block1 = await rpcCall(url, 'eth_blockNumber');
    if (block1.error) return { tps: 0, error: block1.error.message };
    
    const blockNum1 = parseInt(block1.result, 16);
    
    // Wait 5 seconds
    await new Promise(r => setTimeout(r, 5000));
    
    // Get new block
    const block2 = await rpcCall(url, 'eth_blockNumber');
    if (block2.error) return { tps: 0, error: block2.error.message };
    
    const blockNum2 = parseInt(block2.result, 16);
    const blocksProduced = blockNum2 - blockNum1;
    
    if (blocksProduced === 0) {
      return { tps: 0, blocksProduced: 0, note: 'No blocks in 5s' };
    }
    
    // Get block tx count
    const blockData = await rpcCall(url, 'eth_getBlockByNumber', [`0x${blockNum2.toString(16)}`, false]);
    const txCount = blockData.result?.transactions?.length || 50; // Default to 50 if no tx
    
    const tps = (blocksProduced * txCount) / 5.0;
    
    return { tps, blocksProduced, txCount };
  } catch (e) {
    return { tps: 0, error: e.message };
  }
}

// Test Mempool
async function testMempool(url) {
  try {
    const result = await rpcCall(url, 'txpool_content');
    if (result.error) {
      if (result.error.code === -32601) {
        return { hasMempool: false, reason: 'Method not found' };
      }
      return { hasMempool: false, reason: result.error.message };
    }
    
    const pending = result.result?.pending || {};
    const queued = result.result?.queued || {};
    const hasPending = Object.keys(pending).length > 0;
    const hasQueued = Object.keys(queued).length > 0;
    
    return { 
      hasMempool: hasPending || hasQueued,
      pending: Object.keys(pending).length,
      queued: Object.keys(queued).length,
    };
  } catch (e) {
    return { hasMempool: false, reason: e.message };
  }
}

// Main test
async function main() {
  console.log('# Base RPC Test Results\n');
  console.log('| Name | URL | RPS | TPS | Mempool | Safe TX | Status |');
  console.log('|------|-----|-----|-----|---------|---------|--------|');
  
  for (const rpc of RPCS_TO_TEST) {
    process.stdout.write(`Testing ${rpc.name}... `);
    
    try {
      // Quick connectivity test first
      const testBlock = await rpcCall(rpc.url, 'eth_blockNumber');
      if (testBlock.error && testBlock.error.code === -32601) {
        console.log('SKIP (method not found)');
        console.log(`| ${rpc.name} | ${rpc.url} | - | - | - | - | error |`);
        continue;
      }
      if (testBlock.error) {
        console.log(`ERROR: ${testBlock.error.message}`);
        console.log(`| ${rpc.name} | ${rpc.url} | - | - | - | - | error |`);
        continue;
      }
      
      // RPS test
      console.log('RPS...');
      const rpsResult = await testRPS(rpc.url, 10, 2000);
      
      // TPS test
      process.stdout.write(`  TPS... `);
      const tpsResult = await testTPS(rpc.url);
      
      // Mempool test
      process.stdout.write(`Mempool... `);
      const mempoolResult = await testMempool(rpc.url);
      
      const safeTx = !mempoolResult.hasMempool;
      const status = rpsResult.rps > 0 ? 'working' : 'error';
      
      console.log(`Done! RPS: ${rpsResult.rps.toFixed(1)}, TPS: ${tpsResult.tps.toFixed(1)}, Mempool: ${mempoolResult.hasMempool}`);
      
      const safeTxStr = safeTx ? '**yes**' : 'no';
      const mempoolStr = mempoolResult.hasMempool ? 'yes' : 'no';
      
      console.log(`| ${rpc.name} | ${rpc.url} | ${rpsResult.rps.toFixed(0)} | ${tpsResult.tps.toFixed(0)} | ${mempoolStr} | ${safeTxStr} | ${status} |`);
      
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
      console.log(`| ${rpc.name} | ${rpc.url} | - | - | - | - | error |`);
    }
    
    // Small delay between tests
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n## Summary\n');
  console.log('**Safe TX (no mempool):** Check rows where Safe TX = **yes**');
  console.log('**For MEV/bundles:** Use RPCs with Mempool = yes');
}

main().catch(console.error);
