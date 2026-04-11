const https = require('https');
const fs = require('fs');
const path = require('path');

const newRPCs = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'data', 'solana', 'solana-new-rpcs.json'),
  'utf8'
)).newRPCs;

const ORIGINS = [
  { name: 'Larix', origin: 'https://larix.finance' },
  { name: 'Saber', origin: 'https://saber.so' },
  { name: 'Raydium', origin: 'https://raydium.io' },
  { name: 'Jupiter', origin: 'https://jup.ag' },
];

function rpcCall(url, method, params = [], timeout = 10000, origin = null) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      };
      if (origin) headers['Origin'] = origin;
      
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers,
        timeout
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ json: JSON.parse(body), statusCode: res.statusCode });
          } catch { reject(new Error('JSON parse error')); }
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(data);
      req.end();
    } catch (e) { reject(e); }
  });
}

async function testRPC(rpc) {
  // Try without origin first
  try {
    const result = await rpcCall(rpc.url, 'getHealth', [], 8000, null);
    if (!result.json.error && result.json.result === 'ok') {
      return { working: true, needsOrigin: false };
    }
  } catch (e) {}
  
  // Try with origins
  for (const origin of ORIGINS) {
    try {
      const result = await rpcCall(rpc.url, 'getHealth', [], 8000, origin.origin);
      if (!result.json.error && result.json.result === 'ok') {
        return { working: true, needsOrigin: true, origin: origin.origin, originName: origin.name };
      }
    } catch (e) {}
  }
  
  return { working: false };
}

async function testRPS(url, origin = null) {
  const results = { success: 0 };
  const start = Date.now();
  const run = async () => {
    try {
      await rpcCall(url, 'getSlot', [], 5000, origin);
      results.success++;
    } catch {}
  };
  
  const batch = Array(20).fill(null).map(run);
  await Promise.all(batch);
  const elapsed = (Date.now() - start) / 1000;
  return { rps: results.success / elapsed };
}

async function main() {
  console.log('# Testing New Solana RPCs\n');
  
  const working = [];
  const failed = [];
  
  console.log('| RPC | Status | RPS | Needs Origin | Working Origin |');
  console.log('|-----|--------|-----|--------------|----------------|');
  
  for (const rpc of newRPCs) {
    process.stdout.write(`Testing ${rpc.url.substring(0, 50)}... `);
    
    const result = await testRPC(rpc);
    
    if (result.working) {
      const rps = await testRPS(rpc.url, result.origin || null);
      const originStr = result.needsOrigin ? result.originName : 'none';
      console.log(`✅ (${rps.rps.toFixed(0)} RPS)`);
      console.log(`| ${rpc.url.substring(0, 40)}... | ✅ | ${rps.rps.toFixed(0)} | ${result.needsOrigin ? 'yes' : 'no'} | ${originStr} |`);
      working.push({ ...rpc, rps: rps.rps, requiresOrigin: result.needsOrigin, origin: result.origin });
    } else {
      console.log(`❌ FAILED`);
      console.log(`| ${rpc.url.substring(0, 40)}... | ❌ | - | - | - |`);
      failed.push(rpc);
    }
  }
  
  console.log(`\n## Summary\n`);
  console.log(`**Working:** ${working.length}/${newRPCs.length}`);
  console.log(`**Failed:** ${failed.length}/${newRPCs.length}`);
  
  // Save results
  const resultsPath = path.join(__dirname, '..', 'data', 'solana', 'solana-tested-new-rpcs.json');
  fs.writeFileSync(resultsPath, JSON.stringify({ working, failed, timestamp: new Date().toISOString() }, null, 2));
  
  return { working, failed };
}

main().catch(console.error);
