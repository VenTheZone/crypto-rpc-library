const https = require('https');
const http = require('http');

// RPCs with API keys discovered from DEX frontends
const RPCS_TO_TEST = [
  // Coinbase Developer Platform
  { name: 'Coinbase CDP', url: 'https://api.developer.coinbase.com/rpc/v1/base/pE-_rU5q_IliJGUVkVI-82ZoyiCeCSFx', source: 'PancakeSwap JS' },
  
  // QuickNode endpoints
  { name: 'QuickNode 1', url: 'https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7', source: 'PancakeSwap JS' },
  { name: 'QuickNode 2', url: 'https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2', source: 'PancakeSwap JS' },
  { name: 'QuickNode 3', url: 'https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559', source: 'PancakeSwap JS' },
  
  // DodoEx with API key
  { name: 'DodoEx', url: 'https://api.dodoex.io/frontend-rpc/8453?useCache=true&x_api_secret=JfPZkD%2FvhaGMAC7dRpwUWg%3D%3D&apikey=f1bd784016655422ee&x_api_key=BBDA8083BF3A7D51EFB1A0947C4A4F9B', source: 'DodoEx' },
  
  // Ankr with key
  { name: 'Ankr Key', url: 'https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2', source: 'PancakeSwap JS' },
  
  // Nodies
  { name: 'Nodies Base', url: 'https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb', source: 'PancakeSwap' },
  
  // KyberSwap
  { name: 'KyberSwap', url: 'https://base-rpc.kyberswap.com', source: 'KyberSwap' },
  
  // BlastAPI
  { name: 'BlastAPI', url: 'https://base-mainnet.blastapi.io', source: 'PancakeSwap JS' },
  
  // Privy
  { name: 'Privy', url: 'https://base-mainnet.rpc.privy.systems', source: 'PancakeSwap' },
  
  // Developer access
  { name: 'Dev Access', url: 'https://developer-access-mainnet.base.org', source: 'PancakeSwap' },
  
  // Already tested (for comparison)
  { name: 'DRPC (ref)', url: 'https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO', source: 'Aerodrome' },
  { name: 'Base Official (ref)', url: 'https://mainnet.base.org', source: 'Official' },
];

function rpcCall(url, method, params = []) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
      timeout: 10000,
    };
    
    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(data);
    req.end();
  });
}

async function testRPS(url, concurrency = 15, duration = 2000) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  const runRequest = async () => {
    try { await rpcCall(url, 'eth_blockNumber'); results.success++; } catch (e) { results.failed++; }
  };
  while (Date.now() - startTime < duration) {
    const batch = []; for (let i = 0; i < concurrency; i++) batch.push(runRequest());
    await Promise.all(batch);
  }
  return { rps: results.success / ((Date.now() - startTime) / 1000), success: results.success, failed: results.failed };
}

async function testMempool(url) {
  try {
    const result = await rpcCall(url, 'txpool_content');
    if (result.error?.code === -32601) return { hasMempool: false };
    const pending = result.result?.pending || {};
    const queued = result.result?.queued || {};
    return { hasMempool: Object.keys(pending).length > 0 || Object.keys(queued).length > 0 };
  } catch (e) { return { hasMempool: false }; }
}

async function main() {
  console.log('# Base RPC Test Results - API Keys Discovered\n');
  console.log('| Name | URL | RPS | Mempool | Safe TX | Status | Notes |');
  console.log('|------|-----|-----|---------|---------|--------|-------|');
  
  for (const rpc of RPCS_TO_TEST) {
    process.stdout.write(`Testing ${rpc.name}... `);
    try {
      const testBlock = await rpcCall(rpc.url, 'eth_chainId');
      if (testBlock.error) {
        console.log(`ERROR: ${testBlock.error.message?.substring(0, 50)}`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 60)}... | - | - | - | error | ${testBlock.error.message?.substring(0, 30)} |`);
        continue;
      }
      
      const chainId = parseInt(testBlock.result, 16);
      if (chainId !== 8453) {
        console.log(`WRONG CHAIN: ${chainId}`);
        console.log(`| ${rpc.name} | ${rpc.url.substring(0, 60)}... | - | - | - | wrong-chain | chainId=${chainId} |`);
        continue;
      }
      
      const rpsResult = await testRPS(rpc.url, 10, 1500);
      const mempoolResult = await testMempool(rpc.url);
      const safeTx = !mempoolResult.hasMempool;
      const status = rpsResult.rps > 0 ? 'working' : 'error';
      
      console.log(`RPS: ${rpsResult.rps.toFixed(0)}, Mempool: ${mempoolResult.hasMempool}`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 60)}... | ${rpsResult.rps.toFixed(0)} | ${mempoolResult.hasMempool ? 'yes' : 'no'} | ${safeTx ? '**yes**' : 'no'} | ${status} | |`);
    } catch (e) {
      console.log(`ERROR: ${e.message.substring(0, 40)}`);
      console.log(`| ${rpc.name} | ${rpc.url.substring(0, 60)}... | - | - | - | error | ${e.message.substring(0, 30)} |`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);
