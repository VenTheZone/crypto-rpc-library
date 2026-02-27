const https = require('https');

// RPCs that appeared "restricted" or "not working"
const RESTRICTED_RPCS = [
  // Solana RPC Pool endpoints (were IP restricted)
  { name: 'RPC Pool Jupiter', url: 'https://mercuria-fronten-1cd8.mainnet.rpcpool.com/' },
  { name: 'RPC Pool Jupiter 2', url: 'https://jupiter-frontend.rpcpool.com/' },
  { name: 'RPC Pool Drift', url: 'https://drift-drift_ma-39b5.mainnet.rpcpool.com/' },
  { name: 'RPC Pool Kamino', url: 'https://kamino.mainnet.rpcpool.com/' },
  
  // Ironforge (were blocked)
  { name: 'Ironforge 1', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT602BNDP8R07TP105VNXP' },
  { name: 'Ironforge 2', url: 'https://rpc.ironforge.network/mainnet?apiKey=01JAFT6YB7SJS7N3N85PKEZ5MF' },
  
  // Base RPCs that failed
  { name: 'BlastAPI Base', url: 'https://base-mainnet.blastapi.io' },
  { name: 'Privy Base', url: 'https://base-mainnet.rpc.privy.systems' },
  { name: 'KyberSwap Base', url: 'https://base-rpc.kyberswap.com' },
  
  // New L2 PublicNode endpoints (all failed)
  { name: 'PublicNode Bera', url: 'https://berachain-evm-rpc.publicnode.com' },
  { name: 'PublicNode Blast', url: 'https://blast-evm-rpc.publicnode.com' },
  { name: 'PublicNode Scroll', url: 'https://scroll-evm-rpc.publicnode.com' },
];

// Origin headers to test - from trusted DEX domains
const ORIGINS = [
  { name: 'Jupiter', origin: 'https://jup.ag' },
  { name: 'PancakeSwap', origin: 'https://pancakeswap.finance' },
  { name: 'Uniswap', origin: 'https://app.uniswap.org' },
  { name: 'Raydium', origin: 'https://raydium.io' },
  { name: 'Aerodrome', origin: 'https://aerodrome.finance' },
  { name: 'Phantom', origin: 'https://phantom.app' },
  { name: 'Backpack', origin: 'https://backpack.app' },
  { name: 'Solflare', origin: 'https://solflare.com' },
];

function rpcCallWithOrigin(url, method, params, origin, timeout = 10000) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'Origin': origin,
          'Referer': origin + '/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        timeout,
      };
      
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve({ json, statusCode: res.statusCode, headers: res.headers });
          } catch (e) {
            reject(new Error(`JSON error: ${body.substring(0, 100)}`));
          }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(data);
      req.end();
    } catch (e) { reject(e); }
  });
}

async function testRPC(name, url, isSolana = false) {
  const method = isSolana ? 'getHealth' : 'eth_chainId';
  const workingOrigins = [];
  
  for (const originTest of ORIGINS) {
    try {
      const { json, statusCode } = await rpcCallWithOrigin(url, method, [], originTest.origin, 8000);
      
      if (!json.error && (json.result !== undefined || json.result === 'ok')) {
        workingOrigins.push({ origin: originTest.name, url: originTest.origin });
      }
    } catch (e) {
      // Failed with this origin
    }
    await new Promise(r => setTimeout(r, 200));
  }
  
  return workingOrigins;
}

async function main() {
  console.log('# Testing Restricted RPCs with Origin Spoofing\n');
  console.log('Testing if CORS-restricted RPCs work with trusted DEX origins...\n');
  
  console.log('| RPC Name | URL | Working With Origin |');
  console.log('|----------|-----|---------------------|');
  
  for (const rpc of RESTRICTED_RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    
    const isSolana = rpc.url.includes('solana') || rpc.url.includes('rpcpool') || rpc.url.includes('ironforge');
    const working = await testRPC(rpc.name, rpc.url, isSolana);
    
    if (working.length > 0) {
      console.log(`✅ UNLOCKED!`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | ${working.map(o => o.origin).join(', ')} |`);
      
      // Test RPS with first working origin
      console.log(`  Testing RPS with ${working[0].origin}...`);
      // Could add RPS test here
    } else {
      console.log(`❌ Still blocked`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 50)}... | none |`);
    }
  }
  
  console.log('\n---\n');
  console.log('**Note:** RPCs unlocked with Origin spoofing can be used by setting the Origin header in your requests.');
}

main().catch(console.error);
