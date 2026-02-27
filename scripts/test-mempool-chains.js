const https = require('https');

// Test mempool access across multiple chains
const CHAIN_RPCS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcs: [
      { name: 'PublicNode', url: 'https://ethereum.publicnode.com' },
      { name: 'DRPC', url: 'https://ethereum.drpc.org' },
      { name: 'Cloudflare', url: 'https://cloudflare-eth.com' },
      { name: '1rpc.io', url: 'https://1rpc.io/eth' },
    ],
  },
  bsc: {
    chainId: 56,
    name: 'BSC (BNB Chain)',
    rpcs: [
      { name: 'Official', url: 'https://bsc-dataseed.binance.org' },
      { name: 'PublicNode', url: 'https://bsc.publicnode.com' },
      { name: 'DRPC', url: 'https://bsc.drpc.org' },
      { name: '1rpc.io', url: 'https://1rpc.io/bnb' },
    ],
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcs: [
      { name: 'Official', url: 'https://polygon-rpc.com' },
      { name: 'PublicNode', url: 'https://polygon-bor.publicnode.com' },
      { name: 'DRPC', url: 'https://polygon.drpc.org' },
      { name: '1rpc.io', url: 'https://1rpc.io/matic' },
    ],
  },
  optimism: {
    chainId: 10,
    name: 'Optimism',
    rpcs: [
      { name: 'Official', url: 'https://mainnet.optimism.io' },
      { name: 'PublicNode', url: 'https://optimism.publicnode.com' },
      { name: 'DRPC', url: 'https://optimism.drpc.org' },
      { name: '1rpc.io', url: 'https://1rpc.io/opt' },
    ],
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    rpcs: [
      { name: 'Official', url: 'https://api.avax.network/ext/bc/C/rpc' },
      { name: 'PublicNode', url: 'https://avalanche-c-chain.publicnode.com' },
      { name: 'DRPC', url: 'https://avalanche.drpc.org' },
    ],
  },
  fantom: {
    chainId: 250,
    name: 'Fantom',
    rpcs: [
      { name: 'Official', url: 'https://rpc.ftm.tools' },
      { name: 'PublicNode', url: 'https://fantom.publicnode.com' },
      { name: 'DRPC', url: 'https://fantom.drpc.org' },
    ],
  },
  base: {
    chainId: 8453,
    name: 'Base',
    rpcs: [
      { name: 'Official', url: 'https://mainnet.base.org' },
      { name: 'DRPC Aerodrome', url: 'https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQzlkwrEmsR8b2u-uF7NYYO' },
      { name: 'PublicNode', url: 'https://base.publicnode.com' },
    ],
  },
  berachain: {
    chainId: 80094,
    name: 'Berachain',
    rpcs: [
      { name: 'Official', url: 'https://rpc.berachain.com' },
    ],
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum',
    rpcs: [
      { name: 'Official', url: 'https://arb1.arbitrum.io/rpc' },
    ],
  },
};

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

async function testMempool(url) {
  try {
    const r = await rpcCall(url, 'txpool_content', [], 10000);
    if (r.error) {
      if (r.error.code === -32601) return { hasMempool: false, reason: 'Method not supported' };
      return { hasMempool: false, reason: r.error.message?.substring(0, 40) };
    }
    const pending = Object.keys(r.result?.pending || {}).length;
    const queued = Object.keys(r.result?.queued || {}).length;
    return { hasMempool: pending > 0 || queued > 0, pending, queued };
  } catch (e) {
    return { hasMempool: false, reason: e.message?.substring(0, 30) };
  }
}

async function testRPS(url, duration = 1500) {
  const results = { success: 0, failed: 0 };
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    const batch = [];
    for (let i = 0; i < 8; i++) {
      batch.push(rpcCall(url, 'eth_blockNumber', [], 3000).then(() => results.success++).catch(() => results.failed++));
    }
    await Promise.all(batch);
  }
  return { rps: results.success / ((Date.now() - startTime) / 1000) };
}

async function main() {
  console.log('# Mempool Access Test - Which Chains Have Mempool?\n');
  console.log(`Testing Date: ${new Date().toISOString()}\n`);
  console.log('| Chain | RPC Name | Has Mempool | RPS | Notes |');
  console.log('|-------|----------|-------------|-----|-------|');
  
  const chainsWithMempool = [];
  const chainsWithoutMempool = [];
  
  for (const [chainKey, chain] of Object.entries(CHAIN_RPCS)) {
    console.log(`\n<!-- ${chain.name} -->`);
    
    for (const rpc of chain.rpcs) {
      process.stdout.write(`  ${chain.name} - ${rpc.name}... `);
      
      try {
        // Test chain ID first
        const chainTest = await rpcCall(rpc.url, 'eth_chainId', [], 8000);
        if (chainTest.error) {
          console.log(`SKIP (${chainTest.error.message?.substring(0, 20)})`);
          continue;
        }
        
        // Test mempool
        const mempool = await testMempool(rpc.url);
        
        if (mempool.hasMempool) {
          const rps = await testRPS(rpc.url);
          console.log(`✅ HAS MEMPOOL (${mempool.pending} pending)`);
          console.log(`| ${chain.name} | ${rpc.name} | **yes** | ${rps.rps.toFixed(0)} | ${mempool.pending} pending, ${mempool.queued} queued |`);
          chainsWithMempool.push({ chain: chain.name, rpc: rpc.name, url: rpc.url, rps: rps.rps });
        } else {
          console.log(`❌ ${mempool.reason}`);
          console.log(`| ${chain.name} | ${rpc.name} | no | - | ${mempool.reason} |`);
          chainsWithoutMempool.push({ chain: chain.name, rpc: rpc.name, reason: mempool.reason });
        }
      } catch (e) {
        console.log(`ERROR (${e.message?.substring(0, 20)})`);
      }
      
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  // Summary
  console.log('\n---\n');
  console.log('## SUMMARY: Chains WITH Mempool Access\n');
  
  if (chainsWithMempool.length > 0) {
    console.log('| Chain | RPC | RPS |');
    console.log('|-------|-----|-----|');
    for (const c of chainsWithMempool) {
      console.log(`| ${c.chain} | ${c.rpc} | ${c.rps.toFixed(0)} |`);
    }
  } else {
    console.log('No public RPCs found with mempool access.');
  }
  
  console.log('\n## Chains WITHOUT Mempool (Sequencer-based or restricted)\n');
  const uniqueChains = [...new Set(chainsWithoutMempool.map(c => c.chain))];
  for (const chain of uniqueChains) {
    console.log(`- ${chain}`);
  }
}

main().catch(console.error);
