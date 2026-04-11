const https = require('https');
const fs = require('fs');
const path = require('path');

const RPC_LIST = [
  { name: 'Helius Jupiter', url: 'https://grateful-jerrie-fast-mainnet.helius-rpc.com' },
  { name: 'Helius Solend', url: 'https://rpc.helius.xyz/?api-key=96d88c32-e147-4ef8-88b0-18c758ca69df' },
  { name: 'Helius Pump', url: 'https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b' },
  { name: 'Helius Kamino', url: 'https://helius-rpc.kamino.com/02996efe-bbc3-405f-8d87-845794261033' },
  { name: 'Helius Tensor', url: 'https://lauraine-qytyxk-fast-mainnet.helius-rpc.com' },
  { name: 'QuickNode', url: 'https://alien-newest-vineyard.solana-mainnet.quiknode.pro/ebe5e35661d7edb7a5e48ab84bd9d477e472a40b/' },
  { name: 'Ironforge 1', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP' },
  { name: 'Ironforge MarginFi', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JTPF9HNNCBJ3ZF028K2JA3T3' },
  { name: 'Phantom', url: 'https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ' },
  { name: 'Solana Official', url: 'https://api.mainnet-beta.solana.com' },
  { name: 'NEW Helius Mainnet', url: 'https://mainnet.helius-rpc.com/?api-key=26bec238-00c2-4961-ba13-faa7c0a2d767' },
];

const ORIGINS = [
  { name: 'Jupiter', origin: 'https://jup.ag' },
  { name: 'Orca', origin: 'https://www.orca.so' },
  { name: 'Pump.fun', origin: 'https://pump.fun' },
  { name: 'Raydium', origin: 'https://raydium.io' },
];

function rpcCall(url, method, params = [], origin = null) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      };
      if (origin) headers['Origin'] = origin;
      
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers,
        timeout: 8000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve({ ok: !json.error, result: json });
          } catch { resolve({ ok: false }); }
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
  // Try without origin
  let result = await rpcCall(rpc.url, 'getHealth', [], null);
  if (result.ok && result.result.result === 'ok') {
    return { working: true, needsOrigin: false };
  }
  
  // Try with origins
  for (const orig of ORIGINS) {
    result = await rpcCall(rpc.url, 'getHealth', [], orig.origin);
    if (result.ok && result.result.result === 'ok') {
      return { working: true, needsOrigin: true, origin: orig.origin };
    }
  }
  
  return { working: false };
}

async function main() {
  console.log('## Solana RPC Health Count\n');
  console.log(`Testing ${RPC_LIST.length} RPCs...\n`);
  
  const working = [];
  const failed = [];
  
  for (const rpc of RPC_LIST) {
    process.stdout.write(`Testing ${rpc.name}... `);
    const result = await testRPC(rpc);
    
    if (result.working) {
      console.log('✅');
      working.push({ ...rpc, ...result });
    } else {
      console.log('❌');
      failed.push(rpc);
    }
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n## Results\n');
  console.log(`**✅ Working: ${working.length}/${RPC_LIST.length}**`);
  console.log(`**❌ Failed: ${failed.length}/${RPC_LIST.length}**\n`);
  
  console.log('### Working RPCs:\n');
  working.forEach(rpc => {
    const originNote = rpc.needsOrigin ? ` (origin: ${rpc.origin.split('/')[2]})` : '';
    console.log(`- **${rpc.name}**: ${rpc.url.substring(0, 50)}...${originNote}`);
  });
  
  if (failed.length > 0) {
    console.log('\n### Failed RPCs:\n');
    failed.forEach(rpc => console.log(`- ${rpc.name}`));
  }
}

main().catch(console.error);
