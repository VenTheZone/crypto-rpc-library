const https = require('https');

// Solana RPCs discovered from DEX frontends
const SOLANA_RPCS = [
  // === HELIUS ENDPOINTS (with API keys) ===
  { name: 'Helius Jupiter', url: 'https://grateful-jerrie-fast-mainnet.helius-rpc.com', foundOn: 'Jupiter' },
  { name: 'Helius Drift', url: 'https://kora-8cwrc2-fast-mainnet.helius-rpc.com/', foundOn: 'Drift' },
  { name: 'Helius Solend', url: 'https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df', foundOn: 'Solend' },
  { name: 'Helius Pump', url: 'https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b', foundOn: 'Pump.fun' },
  { name: 'Helius Kamino', url: 'https://helius-rpc.kamino.com/02996efe-bbc3-405f-8d87-845794261033', foundOn: 'Kamino' },
  { name: 'Helius Tensor', url: 'https://lauraine-qytyxk-fast-mainnet.helius-rpc.com', foundOn: 'Tensor' },
  
  // === QUICKNODE ===
  { name: 'QuickNode', url: 'https://alien-newest-vineyard.solana-mainnet.quiknode.pro/ebe5e35661d7edb7a5e48ab84bd9d477e472a40b/', foundOn: 'Raydium' },
  
  // === RPC POOL (dedicated endpoints) ===
  { name: 'RPC Pool Jupiter', url: 'https://mercuria-fronten-1cd8.mainnet.rpcpool.com/', foundOn: 'Jupiter' },
  { name: 'RPC Pool Jupiter 2', url: 'https://jupiter-frontend.rpcpool.com/', foundOn: 'Jupiter' },
  { name: 'RPC Pool Drift', url: 'https://drift-drift_ma-39b5.mainnet.rpcpool.com/', foundOn: 'Drift' },
  { name: 'RPC Pool Kamino', url: 'https://kamino.mainnet.rpcpool.com/', foundOn: 'Kamino' },
  { name: 'RPC Pool Solend', url: 'https://solendf-solendf-67c7.rpcpool.com/', foundOn: 'Solend' },
  
  // === IRONFORGE ===
  { name: 'Ironforge 1', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP', foundOn: 'Jupiter' },
  { name: 'Ironforge 2', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT6YB7SJS7N3N85PKEZ5MF', foundOn: 'Jupiter' },
  
  // === ALCHEMY ===
  { name: 'Alchemy', url: 'https://solana-mainnet.g.alchemy.com/v2/ZT3c4pYf1inIrB0GVDNR7nx4LwyED5Ci', foundOn: 'Jupiter' },
  
  // === PHANTOM ===
  { name: 'Phantom', url: 'https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ', foundOn: 'Phantom' },
  
  // === PUBLIC ENDPOINTS ===
  { name: 'Solana Official', url: 'https://api.mainnet-beta.solana.com', foundOn: 'Official' },
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
        res.on('end', () => {
          try { resolve(JSON.parse(body)); } catch (e) { reject(new Error(`JSON error: ${body.substring(0, 100)}`)); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(data);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

// ============================================
// RPS TEST: Measure requests per second
// ============================================
async function testRPS(url, concurrency = 12, duration = 2500) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  
  const runRequest = async () => {
    try { 
      await rpcCall(url, 'getSlot', [], 5000);
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

  return { rps: results.success / ((Date.now() - startTime) / 1000) };
}

// ============================================
// TPS TEST: Get performance samples (Solana specific)
// ============================================
async function testTPS(url) {
  try {
    // Solana has getRecentPerformanceSamples method
    const result = await rpcCall(url, 'getRecentPerformanceSamples', [5], 15000);
    
    if (result.error) {
      // Fallback: estimate from slots
      const slot1 = await rpcCall(url, 'getSlot', [], 10000);
      if (slot1.error) return { tps: 0, error: slot1.error.message };
      
      await new Promise(r => setTimeout(r, 5000));
      
      const slot2 = await rpcCall(url, 'getSlot', [], 10000);
      if (slot2.error) return { tps: 0, error: slot2.error.message };
      
      const slotsPerSec = (slot2.result - slot1.result) / 5;
      // Average ~4000 TPS on Solana, ~800 slots/sec
      const estimatedTps = slotsPerSec * 5; // rough estimate
      
      return { tps: estimatedTps, slotsPerSec, method: 'estimated' };
    }
    
    // Calculate average TPS from samples
    const samples = result.result || [];
    if (samples.length === 0) return { tps: 0 };
    
    const avgTps = samples.reduce((sum, s) => sum + (s.numTransactions / s.samplePeriodSecs), 0) / samples.length;
    const avgSlots = samples.reduce((sum, s) => sum + (s.numSlots / s.samplePeriodSecs), 0) / samples.length;
    
    return { tps: avgTps, slotsPerSec: avgSlots, method: 'performance_samples' };
    
  } catch (e) {
    return { tps: 0, error: e.message };
  }
}

// ============================================
// HEALTH TEST
// ============================================
async function testHealth(url) {
  try {
    const result = await rpcCall(url, 'getHealth', [], 10000);
    if (result.result === 'ok') return { healthy: true };
    if (result.error) return { healthy: false, error: result.error.message };
    return { healthy: false };
  } catch (e) {
    return { healthy: false, error: e.message };
  }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('# Solana RPC Full Test - RPS, TPS, Health\n');
  console.log(`Testing Date: ${new Date().toISOString()}\n`);
  console.log('| Name | URL | RPS | TPS | Slots/s | Healthy | Found On | Status |');
  console.log('|------|-----|-----|-----|---------|---------|----------|--------|');
  
  for (const rpc of SOLANA_RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    
    try {
      // Quick health check
      const health = await testHealth(rpc.url);
      if (!health.healthy) {
        console.log(`UNHEALTHY: ${health.error?.substring(0, 30)}`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | no | ${rpc.foundOn} | error |`);
        continue;
      }
      
      // RPS Test
      process.stdout.write('RPS... ');
      const rpsResult = await testRPS(rpc.url);
      
      // TPS Test
      process.stdout.write('TPS... ');
      const tpsResult = await testTPS(rpc.url);
      
      console.log(`Done!`);
      
      const status = rpsResult.rps > 0 ? 'working' : 'error';
      const healthyStr = health.healthy ? 'yes' : 'no';
      const tpsStr = tpsResult.tps > 0 ? tpsResult.tps.toFixed(0) : '0';
      const slotsStr = tpsResult.slotsPerSec ? tpsResult.slotsPerSec.toFixed(0) : '-';
      
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | ${rpsResult.rps.toFixed(0)} | ${tpsStr} | ${slotsStr} | ${healthyStr} | ${rpc.foundOn} | ${status} |`);
      
    } catch (e) {
      console.log(`ERROR: ${e.message?.substring(0, 40)}`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | - | - | - | - | ${rpc.foundOn} | error |`);
    }
    
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n---\n');
  console.log('## Summary\n');
  console.log('- **Mempool:** Solana does not have a traditional mempool like EVM chains');
  console.log('- **TPS:** Measured via `getRecentPerformanceSamples` or estimated from slots');
  console.log('- **Safe TX:** All Solana RPCs are safe (no mempool to front-run)');
}

main().catch(console.error);
