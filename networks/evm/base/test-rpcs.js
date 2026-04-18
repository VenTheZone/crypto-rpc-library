#!/usr/bin/env node
const axios = require('axios');

// Base RPCs to test - from discovery and existing tested.md
const RPCS = [
  // Tier 1 - High RPS
  { name: 'QuickNode 1', url: 'https://thrumming-thrumming-pool.base-mainnet.quiknode.pro/afc8a0038cd744f30fd210e6f8c6b59ed5817bd7', tier: 1 },
  { name: 'QuickNode 2', url: 'https://fittest-wild-frog.base-mainnet.quiknode.pro/3474cf7682996021cbed75bfb11ec811dfed6ac2', tier: 1 },
  { name: 'QuickNode 3', url: 'https://warmhearted-falling-shape.base-mainnet.quiknode.pro/b1beacf9cbff295f07eba00f88985c08ed136559', tier: 1 },
  
  // Tier 2
  { name: 'Tenderly', url: 'https://base.gateway.tenderly.co', tier: 2 },
  { name: 'DRPC', url: 'https://base.drpc.org', tier: 2 },
  { name: 'MeowRPC', url: 'https://base.meowrpc.com', tier: 2 },
  { name: '1rpc.io', url: 'https://1rpc.io/base', tier: 2 },
  { name: 'Ankr Pro', url: 'https://rpc.ankr.com/base/49e8f39a9a4ec3f43b5ae964dfd6aa83b36e19dbb270a73f9121a9e593d85ad2', tier: 2 },
  { name: 'PublicNode', url: 'https://base.publicnode.com', tier: 2 },
  
  // Tier 3
  { name: 'Base Preconf', url: 'https://mainnet-preconf.base.org', tier: 3 },
  { name: 'Dev Access', url: 'https://developer-access-mainnet.base.org', tier: 3 },
  { name: 'Base Official', url: 'https://mainnet.base.org', tier: 3 },
  { name: 'Nodies', url: 'https://lb.nodies.app/v1/0abc2c55fd444b198a6b2f72b17529bb', tier: 3 },
  { name: 'Nodies POKT', url: 'https://base-pokt.nodies.app', tier: 3 },
  { name: 'Coinbase CDP', url: 'https://api.developer.coinbase.com/rpc/v1/base/pE-_rU5q_IliJGUVkVI-82ZoyiCeCSFx', tier: 3 },
  
  // Tier 4
  { name: 'LlamaRPC', url: 'https://base.llamarpc.com', tier: 4 },
  
  // Discovered new
  { name: 'Aerodrome dRPC', url: 'https://lb.drpc.live/base/Avibgvi26EjPsw76UtdwmsQOcPkUJIUR8YARurWHF38a', tier: 'new' },
  { name: 'Wallet Coinbase', url: 'https://rpc.wallet.coinbase.com', tier: 'new' },
  { name: 'Privy Base', url: 'https://base-mainnet.rpc.privy.systems', tier: 'new' },
];

const CHAIN_ID = 8453;

async function testChainId(rpc) {
  try {
    const res = await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: []
    }, { timeout: 10000 });
    const chainId = parseInt(res.data.result, 16);
    return { ok: chainId === CHAIN_ID, chainId, error: null };
  } catch (e) {
    return { ok: false, chainId: null, error: e.response?.status || e.message };
  }
}

async function testRPS(rpc) {
  const start = Date.now();
  const concurrent = 12;
  try {
    await Promise.all([...Array(concurrent)].map((_, i) => 
      axios.post(rpc.url, {
        jsonrpc: '2.0', id: i, method: 'eth_blockNumber', params: []
      }, { timeout: 5000 })
    ));
    const elapsed = (Date.now() - start) / 1000;
    return { rps: Math.round(concurrent / elapsed), error: null };
  } catch {
    try {
      await Promise.all([...Array(6)].map((_, i) =>
        axios.post(rpc.url, {
          jsonrpc: '2.0', id: i, method: 'eth_blockNumber', params: []
        }, { timeout: 5000 })
      ));
      const elapsed2 = (Date.now() - start) / 1000;
      return { rps: Math.round(6 / elapsed2), error: null };
    } catch {
      return { rps: 0, error: 'rate limited' };
    }
  }
}

async function testMempool(rpc) {
  try {
    const res = await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 1, method: 'txpool_content', params: []
    }, { timeout: 10000 });
    if (res.data.error?.code === -32601) {
      return { mempool: false, safe: true, error: null };
    }
    const result = res.data.result;
    const pending = result?.pending ? Object.keys(result.pending).length : 0;
    const queued = result?.queued ? Object.keys(result.queued).length : 0;
    return { mempool: true, pending, queued, safe: false, error: null };
  } catch (e) {
    return { mempool: false, safe: false, error: e.response?.status || e.message };
  }
}

async function testLatency(rpc) {
  const start = Date.now();
  try {
    await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: []
    }, { timeout: 5000 });
    return { latency: Date.now() - start, error: null };
  } catch (e) {
    return { latency: null, error: e.message };
  }
}

async function testRPC(rpc) {
  process.stdout.write(`Testing ${rpc.name}... `);
  
  const chain = await testChainId(rpc);
  if (!chain.ok) {
    console.log(`FAIL (${chain.error})`);
    return { ...rpc, status: 'failed', error: chain.error };
  }
  
  const [rps, mempool, latency] = await Promise.all([
    testRPS(rpc),
    testMempool(rpc),
    testLatency(rpc)
  ]);
  
  console.log('OK');
  return {
    ...rpc, status: 'success', chainId: chain.chainId,
    rps: rps.rps, mempool: mempool.mempool, pending: mempool.pending, queued: mempool.queued,
    safe: mempool.safe, latency: latency.latency
  };
}

async function main() {
  console.log('# Base Mainnet RPC Test Results');
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`Tested: ${new Date().toISOString().split('T')[0]}\n`);
  
  const results = [];
  for (const rpc of RPCS) {
    const res = await testRPC(rpc);
    results.push(res);
  }
  
  // Summary table
  console.log('\n| Name | URL | RPS | Mempool | Safe | Latency | Status |');
  console.log('|------|-----|----:|:-------:|:----:|--------:|--------|');
  results.forEach(r => {
    const mempoolStr = r.mempool === true ? `yes (${r.pending || 0}/${r.queued || 0})` : (r.mempool === false ? 'no' : '-');
    const safeStr = r.safe ? '✅' : (r.safe === false ? '❌' : '-');
    const latencyStr = r.latency ? `${r.latency}ms` : '-';
    const rpsStr = r.rps || '-';
    const status = r.status === 'success' ? 'working' : 'failed';
    const urlShort = r.url.length > 40 ? r.url.substring(0, 37) + '...' : r.url;
    console.log(`| ${r.name} | ${urlShort} | ${rpsStr} | ${mempoolStr} | ${safeStr} | ${latencyStr} | ${status} |`);
  });
  
  // Details
  console.log('\n## Details');
  results.forEach(r => {
    console.log(`\n### ${r.name}`);
    if (r.status === 'failed') {
      console.log(`- **Status**: Failed - ${r.error}`);
    } else {
      console.log(`- **RPS**: ${r.rps || 'N/A'}`);
      console.log(`- **Latency**: ${r.latency}ms`);
      console.log(`- **Mempool**: ${r.mempool ? `Exposed (${r.pending}/${r.queued}) ⚠️` : 'Hidden ✅'}`);
      console.log(`- **Safe TX**: ${r.safe ? '✅' : '❌'}`);
    }
  });
  
  // Summary
  const working = results.filter(r => r.status === 'success');
  const safe = working.filter(r => r.safe);
  const fast = working.filter(r => r.rps > 100);
  
  console.log(`\n\n**Summary**: ${working.length} working, ${safe.length} MEV-safe, ${fast.length} fast (>100 RPS)`);
}

main().catch(console.error);
