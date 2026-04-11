const https = require('https');
const fs = require('fs');
const path = require('path');

const discoveredPath = path.join(__dirname, '..', 'data', 'solana', 'solana-discovered.json');
const discovered = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'));

const RPC_LIST = [];
Object.entries(discovered.httpRpcs || {}).forEach(([url, data]) => {
  RPC_LIST.push({ url, foundOn: data.dex || 'Discovery' });
});

const seen = new Set();
const UNIQUE_RPCS = RPC_LIST.filter(rpc => {
  if (seen.has(rpc.url)) return false;
  seen.add(rpc.url);
  return true;
});

const ORIGINS = [
  { name: 'Jupiter', origin: 'https://jup.ag' },
  { name: 'Orca', origin: 'https://www.orca.so' },
  { name: 'Pump.fun', origin: 'https://pump.fun' },
  { name: 'Raydium', origin: 'https://raydium.io' },
  { name: 'Kamino', origin: 'https://kamino.com' },
];

function call(url, method, origin = null) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: [] });
      const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) };
      if (origin) headers['Origin'] = origin;
      
      const req = https.request({ hostname: u.hostname, port: 443, path: u.pathname + u.search, method: 'POST', headers, timeout: 10000 }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try { const json = JSON.parse(body); resolve({ ok: !json.error, result: json.result }); }
          catch { resolve({ ok: false }); }
        });
      });
      req.on('error', () => resolve({ ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
      req.write(data);
      req.end();
    } catch { resolve({ ok: false }); }
  });
}

async function testRPC(rpc) {
  let res = await call(rpc.url, 'getHealth', null);
  if (res.ok && res.result === 'ok') return { working: true, needsOrigin: false };
  
  for (const o of ORIGINS) {
    res = await call(rpc.url, 'getHealth', o.origin);
    if (res.ok && res.result === 'ok') return { working: true, needsOrigin: true, originName: o.name, origin: o.origin };
  }
  return { working: false };
}

async function testRPS(url, origin) {
  let success = 0;
  const start = Date.now();
  await Promise.all(Array(10).fill(null).map(async () => {
    try { const r = await call(url, 'getSlot', origin); if (r.ok) success++; } catch {}
  }));
  const rps = success / ((Date.now() - start) / 1000);
  return Math.round(rps);
}

async function testTPS(url, origin) {
  try {
    const r = await call(url, 'getRecentPerformanceSamples', origin);
    if (r.ok && Array.isArray(r.result) && r.result.length > 0) {
      return Math.round(r.result.reduce((sum, s) => sum + (s.numTransactions / s.samplePeriodSecs), 0) / r.result.length);
    }
  } catch {}
  return 0;
}

async function main() {
  console.log(`Auditing ${UNIQUE_RPCS.length} unique RPCs...\n`);
  
  const working = [];
  const dead = [];
  
  const fullTest = UNIQUE_RPCS.slice(0, 40);
  
  for (let i = 0; i < fullTest.length; i++) {
    const rpc = fullTest[i];
    process.stdout.write(`[${i + 1}/${fullTest.length}] ${rpc.url.substring(0, 45)}... `);
    
    const result = await testRPC(rpc);
    
    if (result.working) {
      const rps = await testRPS(rpc.url, result.origin);
      const tps = await testTPS(rpc.url, result.origin);
      console.log(`✅ ${rps} RPS, ${tps} TPS${result.needsOrigin ? ' (needs ' + result.originName + ')' : ''}`);
      working.push({ ...rpc, ...result, rps, tps });
    } else {
      console.log('❌');
      dead.push(rpc);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  const rest = UNIQUE_RPCS.slice(40);
  if (rest.length) {
    console.log(`\nChecking ${rest.length} more...`);
    for (const rpc of rest) {
      process.stdout.write(`${rpc.url.substring(0, 45)}... `);
      const result = await testRPC(rpc);
      if (result.working) {
        console.log(`✅${result.needsOrigin ? ' (needs origin)' : ''}`);
        working.push({ ...rpc, ...result, rps: null, tps: null });
      } else {
        console.log('❌');
        dead.push(rpc);
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  console.log(`\n✅ Working: ${working.length} | ❌ Dead: ${dead.length}`);
  working.sort((a, b) => (b.rps || -1) - (a.rps || -1));
  
  // Write deadrpc.txt
  const deadContent = dead.map(r => r.url).join('\n');
  fs.writeFileSync('deadrpc.txt', `# Dead Solana RPCs - ${dead.length}\n# Generated: ${new Date().toISOString()}\n\n${deadContent}`);
  
  // Write Working-Solana-RPC.md
  const withPerf = working.filter(w => w.rps !== null);
  const noPerf = working.filter(w => w.rps === null);
  
  let md = `# Working Solana RPCs

> Generated: ${new Date().toISOString()}  
> Working: ${working.length} | Dead: ${dead.length} | Total: ${UNIQUE_RPCS.length}

## Top Performers (with RPS/TPS metrics)

| RPC | RPS | TPS | Needs Origin | Source |
|-----|-----|-----|--------------|--------|
`;
  
  withPerf.forEach(w => {
    const origin = w.needsOrigin ? `**${w.originName}**` : 'No';
    md += `|\`${w.url.substring(0, 50)}${w.url.length > 50 ? '...' : ''}\` | ${w.rps} | ${w.tps} | ${origin} | ${w.foundOn} |\n`;
  });
  
  if (noPerf.length) {
    md += `\n## Additional Working RPCs (health only)\n\n| RPC | Needs Origin | Source |\n|-----|--------------|--------|\n`;
    noPerf.forEach(w => {
      const origin = w.needsOrigin ? `**${w.originName}**` : 'No';
      md += `|\`${w.url.substring(0, 50)}${w.url.length > 50 ? '...' : ''}\` | ${origin} | ${w.foundOn} |\n`;
    });
  }
  
  md += `\n## Usage Notes\n\n- RPCs with RPS/TPS metrics were tested with full performance benchmarks\n- RPCs in "Additional Working" section were health-checked only\n- Bold origin names indicate the RPC requires that specific Origin header\n- Add Origin header like: \`curl -H 'Origin: https://jup.ag' ...\`
`;
  
  fs.writeFileSync('Working-Solana-RPC.md', md);
  
  console.log(`\nFiles created:`);
  console.log(`  - deadrpc.txt (${dead.length} dead RPCs)`);
  console.log(`  - Working-Solana-RPC.md (${working.length} working RPCs)`);
}

main().catch(console.error);
