const https = require('https');
const fs = require('fs');
const path = require('path');

// Load discovered Solana RPCs from JSON
const discoveredPath = path.join(__dirname, '..', 'data', 'solana', 'solana-discovered.json');
let discoveredData = { httpRpcs: {}, websockets: {} };

try {
  discoveredData = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'));
  console.log(`Loaded ${Object.keys(discoveredData.httpRpcs || {}).length} HTTP RPCs from discovery file`);
} catch (e) {
  console.log('Could not load discovery file, using fallback list\n');
}

// Build RPC list from discovered data + hardcoded known endpoints
const SOLANA_RPCS = [
  // === HELIUS ENDPOINTS (require Origin) ===
  { name: 'Helius Jupiter', url: 'https://grateful-jerrie-fast-mainnet.helius-rpc.com', foundOn: 'Jupiter', needsOrigin: true },
  { name: 'Helius Drift', url: 'https://kora-8cwrc2-fast-mainnet.helius-rpc.com/', foundOn: 'Drift', needsOrigin: true },
  { name: 'Helius Solend', url: 'https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df', foundOn: 'Solend', needsOrigin: true },
  { name: 'Helius Pump', url: 'https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b', foundOn: 'Pump.fun', needsOrigin: true },
  { name: 'Helius Kamino', url: 'https://helius-rpc.kamino.com/02996efe-bbc3-405f-8d87-845794261033', foundOn: 'Kamino', needsOrigin: true },
  { name: 'Helius Tensor', url: 'https://lauraine-qytyxk-fast-mainnet.helius-rpc.com', foundOn: 'Tensor', needsOrigin: true },
  { name: 'Helius Orb', url: 'https://orb.helius.dev/', foundOn: 'Raydium/Jupiter', needsOrigin: true },
  
  // === QUICKNODE ===
  { name: 'QuickNode', url: 'https://alien-newest-vineyard.solana-mainnet.quiknode.pro/ebe5e35661d7edb7a5e48ab84bd9d477e472a40b/', foundOn: 'Raydium', needsOrigin: false },
  
  // === RPC POOL (may need Origin) ===
  { name: 'RPC Pool Jupiter', url: 'https://mercuria-fronten-1cd8.mainnet.rpcpool.com/', foundOn: 'Jupiter', needsOrigin: true },
  { name: 'RPC Pool Jupiter 2', url: 'https://jupiter-frontend.rpcpool.com/', foundOn: 'Jupiter', needsOrigin: true },
  { name: 'RPC Pool Drift', url: 'https://drift-drift_ma-39b5.mainnet.rpcpool.com/', foundOn: 'Drift', needsOrigin: true },
  { name: 'RPC Pool Kamino', url: 'https://kamino.mainnet.rpcpool.com/', foundOn: 'Kamino', needsOrigin: true },
  { name: 'RPC Pool Solend', url: 'https://solendf-solendf-67c7.rpcpool.com/', foundOn: 'Solend', needsOrigin: true },
  
  // === IRONFORGE ===
  { name: 'Ironforge 1', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP', foundOn: 'Jupiter/Orca', needsOrigin: true },
  { name: 'Ironforge 2', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT6YB7SJS7N3N85PKEZ5MF', foundOn: 'Jupiter/Orca', needsOrigin: true },
  { name: 'Ironforge MarginFi', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JTPF9HNNCBJ3ZF028K2JA3T3', foundOn: 'MarginFi', needsOrigin: true },
  
  // === ALCHEMY ===
  { name: 'Alchemy', url: 'https://solana-mainnet.g.alchemy.com/v2/ZT3c4pYf1inIrB0GVDNR7nx4LwyED5Ci', foundOn: 'Jupiter', needsOrigin: false },
  
  // === PHANTOM ===
  { name: 'Phantom', url: 'https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ', foundOn: 'Phantom', needsOrigin: true },
  
  // === PUBLIC ENDPOINTS ===
  { name: 'Solana Official', url: 'https://api.mainnet-beta.solana.com', foundOn: 'Official', needsOrigin: false },
  { name: 'Solana Devnet', url: 'https://api.devnet.solana.com', foundOn: 'Official', needsOrigin: false },
  
  // === DISCOVERED RPCs ===
  ...Object.entries(discoveredData.httpRpcs || {})
    .filter(([url]) => url.includes('solana') || url.includes('helius') || url.includes('rpcpool') || url.includes('mainnet'))
    .map(([url, data]) => ({
      name: `Discovered: ${url.split('/')[2]?.substring(0, 30) || 'Unknown'}`,
      url: url,
      foundOn: data.dex || 'Discovery',
      needsOrigin: url.includes('helius') || url.includes('rpcpool') || url.includes('ironforge')
    }))
];

// Origin headers to try (for RPCs that need them)
const ORIGINS = [
  { name: 'Jupiter', origin: 'https://jup.ag' },
  { name: 'Raydium', origin: 'https://raydium.io' },
  { name: 'Orca', origin: 'https://www.orca.so' },
  { name: 'Meteora', origin: 'https://www.meteora.ag' },
  { name: 'Drift', origin: 'https://app.drift.trade' },
  { name: 'Kamino', origin: 'https://kamino.com' },
  { name: 'MarginFi', origin: 'https://app.marginfi.com' },
  { name: 'Solend', origin: 'https://solend.fi' },
  { name: 'Phantom', origin: 'https://phantom.app' },
  { name: 'Pump.fun', origin: 'https://pump.fun' },
  { name: 'Tensor', origin: 'https://www.tensor.trade' },
];

function rpcCall(url, method, params = [], timeout = 10000, origin = null) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      };
      
      if (origin) {
        headers['Origin'] = origin;
        headers['Referer'] = origin + '/';
      }
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers,
        timeout,
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve({ json, statusCode: res.statusCode });
          } catch (e) {
            reject(new Error(`JSON error: ${body.substring(0, 100)}`));
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
    } catch (e) {
      reject(e);
    }
  });
}

async function testWithOrigins(rpc) {
  // First try without origin
  try {
    const { json } = await rpcCall(rpc.url, 'getHealth', [], 8000, null);
    if (!json.error) {
      return { working: true, withoutOrigin: true, origin: null };
    }
  } catch (e) {
    // Failed without origin, try with origins
  }
  
  // Try each origin
  for (const originTest of ORIGINS) {
    try {
      const { json } = await rpcCall(rpc.url, 'getHealth', [], 8000, originTest.origin);
      if (!json.error && json.result === 'ok') {
        return { working: true, withoutOrigin: false, origin: originTest.origin, originName: originTest.name };
      }
    } catch (e) {
      // Failed with this origin
    }
    await new Promise(r => setTimeout(r, 100));
  }
  
  return { working: false };
}

async function testRPS(url, origin = null, concurrency = 8, duration = 2500) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  
  const runRequest = async () => {
    try {
      await rpcCall(url, 'getSlot', [], 5000, origin);
      results.success++;
    } catch (e) {
      results.failed++;
    }
  };

  while (Date.now() - startTime < duration) {
    const batch = [];
    for (let i = 0; i < concurrency; i++) batch.push(runRequest());
    await Promise.all(batch);
  }
  
  const elapsed = (Date.now() - startTime) / 1000;
  return { 
    rps: elapsed > 0 ? results.success / elapsed : 0,
    success: results.success,
    failed: results.failed
  };
}

async function testTPS(url, origin = null) {
  try {
    const result = await rpcCall(url, 'getRecentPerformanceSamples', [5], 15000, origin);
    if (result.json.error || !result.json.result) {
      // Fallback: estimate from slots
      try {
        const slot1 = await rpcCall(url, 'getSlot', [], 10000, origin);
        if (slot1.json.error) return { tps: 0, error: slot1.json.error.message };
        await new Promise(r => setTimeout(r, 3000));
        const slot2 = await rpcCall(url, 'getSlot', [], 10000, origin);
        if (slot2.json.error) return { tps: 0, error: slot2.json.error.message };
        const slotsPerSec = (slot2.json.result - slot1.json.result) / 3;
        const estimatedTps = slotsPerSec * 4; // rough estimate
        return { tps: estimatedTps, slotsPerSec, method: 'estimated' };
      } catch (e) {
        return { tps: 0, error: e.message };
      }
    }
    
    const samples = result.json.result || [];
    if (samples.length === 0) return { tps: 0 };
    
    const avgTps = samples.reduce((sum, s) => sum + (s.numTransactions / s.samplePeriodSecs), 0) / samples.length;
    return { tps: avgTps, method: 'performance_samples' };
  } catch (e) {
    return { tps: 0, error: e.message };
  }
}

async function testVersion(url, origin = null) {
  try {
    const result = await rpcCall(url, 'getVersion', [], 8000, origin);
    return { version: result.json.result?.['solana-core'] || 'unknown' };
  } catch (e) {
    return { version: 'unknown' };
  }
}

async function main() {
  console.log('# Solana RPC Test with Origin Spoofing\n');
  console.log(`Test Date: ${new Date().toISOString()}`);
  console.log(`Total RPCs to test: ${SOLANA_RPCS.length}\n`);
  
  const workingRPCs = [];
  const failedRPCs = [];
  
  console.log('| Name | Status | RPS | TPS | Requires Origin | Working Origin | Error |');
  console.log('|------|--------|-----|-----|-----------------|----------------|-------|');
  
  for (const rpc of SOLANA_RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    
    try {
      const healthResult = await testWithOrigins(rpc);
      
      if (!healthResult.working) {
        console.log(`❌ FAILED`);
        console.log(`| ${rpc.name} | ❌ DEAD | - | - | ${rpc.needsOrigin ? 'yes' : 'no'} | none | No response |`);
        failedRPCs.push({ ...rpc, error: 'No response' });
        continue;
      }
      
      const effectiveOrigin = healthResult.origin;
      
      // Test RPS
      process.stdout.write('RPS... ');
      const rpsResult = await testRPS(rpc.url, effectiveOrigin, 8, 2500);
      
      // Test TPS
      process.stdout.write('TPS... ');
      const tpsResult = await testTPS(rpc.url, effectiveOrigin);
      
      const rpsStr = rpsResult.rps > 0 ? rpsResult.rps.toFixed(0) : '0';
      const tpsStr = tpsResult.tps > 0 ? tpsResult.tps.toFixed(0) : '0';
      const originStr = healthResult.withoutOrigin ? 'none' : (healthResult.originName || 'custom');
      
      console.log(`✅ GOOD (${rpsStr} RPS, ${tpsStr} TPS)`);
      console.log(`| ${rpc.name} | ✅ WORKING | ${rpsStr} | ${tpsStr} | ${rpc.needsOrigin ? 'yes' : 'no'} | ${originStr} | - |`);
      
      workingRPCs.push({
        ...rpc,
        rps: rpsResult.rps,
        tps: tpsResult.tps,
        requiresOrigin: !healthResult.withoutOrigin,
        workingOrigin: effectiveOrigin
      });
      
    } catch (e) {
      console.log(`❌ ERROR: ${e.message.substring(0, 40)}`);
      console.log(`| ${rpc.name} | ❌ ERROR | - | - | ${rpc.needsOrigin ? 'yes' : 'no'} | - | ${e.message.substring(0, 30)} |`);
      failedRPCs.push({ ...rpc, error: e.message });
    }
    
    await new Promise(r => setTimeout(r, 300));
  }
  
  // Summary
  console.log('\n## Summary\n');
  console.log(`**Working RPCs: ${workingRPCs.length}/${SOLANA_RPCS.length}**`);
  console.log(`**Failed RPCs: ${failedRPCs.length}/${SOLANA_RPCS.length}**\n`);
  
  if (workingRPCs.length > 0) {
    console.log('### Working RPCs (sorted by RPS):\n');
    workingRPCs.sort((a, b) => b.rps - a.rps);
    workingRPCs.forEach(rpc => {
      const originNote = rpc.requiresOrigin ? ` (requires Origin: ${rpc.workingOrigin})` : '';
      console.log(`- **${rpc.name}**: ${rpc.rps.toFixed(0)} RPS | ${rpc.tps.toFixed(0)} TPS | Found on: ${rpc.foundOn}${originNote}`);
    });
  }
  
  if (failedRPCs.length > 0) {
    console.log('\n### Failed RPCs:\n');
    failedRPCs.forEach(rpc => {
      console.log(`- **${rpc.name}**: ${rpc.error || 'Unresponsive'} | ${rpc.url.substring(0, 60)}...`);
    });
  }
  
  // Save results
  const resultsPath = path.join(__dirname, '..', 'data', 'solana', 'solana-rpc-test-results.json');
  const results = {
    timestamp: new Date().toISOString(),
    working: workingRPCs,
    failed: failedRPCs,
    summary: {
      total: SOLANA_RPCS.length,
      working: workingRPCs.length,
      failed: failedRPCs.length
    }
  };
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 Results saved to: ${resultsPath}`);
  
  return { working: workingRPCs, failed: failedRPCs };
}

main().catch(console.error);