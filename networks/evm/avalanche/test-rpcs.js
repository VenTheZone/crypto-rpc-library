#!/usr/bin/env node
const axios = require('axios');

// Avalanche C-Chain RPCs
const RPCS = [
  { name: 'Avalanche Official', url: 'https://api.avax.network/ext/bc/C/rpc', type: 'public' },
  { name: 'Avalanche Public', url: 'https://avalanche.public-rpc.com', type: 'public' },
  { name: 'Ankr', url: 'https://rpc.ankr.com/avalanche', type: 'public' },
  { name: '1rpc.io', url: 'https://1rpc.io/avax/c', type: 'public' },
  { name: 'DRPC', url: 'https://avalanche.drpc.org', type: 'public' },
  { name: 'BlastAPI', url: 'https://avalanche-mainnet.blastapi.io', type: 'public' },
  { name: 'PublicNode', url: 'https://avalanche-evm.publicnode.com', type: 'public' },
  { name: 'Infura', url: 'https://avalanche-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', type: 'public' },
  { name: 'LlamaRPC', url: 'https://avalanche.llamarpc.com', type: 'public' },
];

const CHAIN_ID = 43114;

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
  console.log('# Avalanche C-Chain RPC Test Results');
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`Tested: ${new Date().toISOString().split('T')[0]}\n`);
  
  const results = [];
  for (const rpc of RPCS) {
    const res = await testRPC(rpc);
    results.push(res);
  }
  
  // Summary
  console.log('\n| Name | URL | RPS | Mempool | Safe | Latency | Status |');
  console.log('|------|-----|----:|:-------:|:----:|--------:|--------|');
  results.forEach(r => {
    const mempoolStr = r.mempool === true ? `yes (${r.pending || 0}/${r.queued || 0})` : (r.mempool === false ? 'no' : '-');
    const safeStr = r.safe ? '✅' : (r.safe === false ? '❌' : '-');
    const latencyStr = r.latency ? `${r.latency}ms` : '-';
    const urlShort = r.url.length > 35 ? r.url.substring(0, 32) + '...' : r.url;
    console.log(`| ${r.name} | ${urlShort} | ${r.rps || '-'} | ${mempoolStr} | ${safeStr} | ${latencyStr} | ${r.status} |`);
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
  
  // Summary stats
  const working = results.filter(r => r.status === 'success');
  const safe = working.filter(r => r.safe);
  console.log(`\n\n**Summary**: ${working.length}/${RPCS.length} working, ${safe.length} MEV-safe`);
}

main().catch(console.error);
