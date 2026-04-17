#!/usr/bin/env node
const axios = require('axios');

const RPCS = [
  { name: 'Berachain Official', url: 'https://rpc.berachain.com', type: 'public' },
  { name: 'PublicNode', url: 'https://berachain-evm-rpc.publicnode.com', type: 'public' },
  { name: 'Kodiak', url: 'https://rpc.kodiak.finance', type: 'dex' },
  { name: 'Thirdweb', url: 'https://bera.rpc.thirdweb.com', type: 'public' },
];

const CHAIN_ID = 80094;

async function testChainId(rpc) {
  try {
    const res = await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: []
    }, { timeout: 10000 });
    const chainId = parseInt(res.data.result, 16);
    return { ok: chainId === CHAIN_ID, chainId, error: null };
  } catch (e) {
    return { ok: false, chainId: null, error: e.message };
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
      const start2 = Date.now();
      await Promise.all([...Array(6)].map((_, i) =>
        axios.post(rpc.url, {
          jsonrpc: '2.0', id: i, method: 'eth_blockNumber', params: []
        }, { timeout: 5000 })
      ));
      const elapsed2 = (Date.now() - start2) / 1000;
      return { rps: Math.round(6 / elapsed2), error: null };
    } catch {
      return { rps: 0, error: 'failed' };
    }
  }
}

async function testTPS(rpc) {
  try {
    const res1 = await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 1, method: 'eth_getBlockByNumber', params: ['latest', false]
    }, { timeout: 10000 });
    const block1 = res1.data.result;
    await new Promise(r => setTimeout(r, 5000));
    const res2 = await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 2, method: 'eth_getBlockByNumber', params: ['latest', false]
    }, { timeout: 10000 });
    const block2 = res2.data.result;
    const txCount = block2.transactions?.length || 0;
    return { tps: txCount, error: null };
  } catch (e) {
    return { tps: 0, error: e.message };
  }
}

async function testMempool(rpc) {
  try {
    const res = await axios.post(rpc.url, {
      jsonrpc: '2.0', id: 1, method: 'txpool_content', params: []
    }, { timeout: 10000 });
    if (res.data.error?.code === -32601) {
      return { mempool: false, safe: true };
    }
    const result = res.data.result;
    const pendingCount = result?.pending ? Object.keys(result.pending).length : 0;
    const queuedCount = result?.queued ? Object.keys(result.queued).length : 0;
    return { mempool: true, pending: pendingCount, queued: queuedCount, safe: false };
  } catch (e) {
    return { mempool: false, safe: false, error: e.message };
  }
}

async function main() {
  console.log('# Berachain RPC Test Results');
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`Tested: ${new Date().toISOString().split('T')[0]}\n`);
  
  const results = [];
  for (const rpc of RPCS) {
    process.stdout.write(`Testing ${rpc.name}... `);
    const chain = await testChainId(rpc);
    if (!chain.ok) {
      console.log(`FAIL`);
      results.push({ ...rpc, status: 'failed', error: chain.error });
      continue;
    }
    
    const [rps, tps, mempool] = await Promise.all([
      testRPS(rpc), testTPS(rpc), testMempool(rpc)
    ]);
    
    console.log('OK');
    results.push({
      ...rpc, status: 'success', chainId: chain.chainId,
      rps: rps.rps, tps: tps.tps,
      mempool: mempool.mempool, pending: mempool.pending, queued: mempool.queued,
      safe: mempool.safe
    });
  }
  
  // Table
  console.log('\n| Name | URL | RPS | TPS | Mempool | Safe TX | Status |');
  console.log('|------|-----|----:|----:|:-------:|:-------:|--------|');
  results.forEach(r => {
    const status = r.status === 'success' ? 'working' : 'failed';
    const mempoolStr = r.mempool === true ? `yes (${r.pending || 0}/${r.queued || 0})` : (r.mempool === false ? 'no' : '-');
    console.log(`| ${r.name} | ${r.url} | ${r.rps || '-'} | ${r.tps || '-'} | ${mempoolStr} | ${r.safe ? '✅' : '❌'} | ${status} |`);
  });
  
  // Details
  console.log('\n## Details');
  results.forEach(r => {
    console.log(`\n### ${r.name}`);
    if (r.status === 'failed') {
      console.log(`- **Status**: Failed - ${r.error}`);
    } else {
      console.log(`- **RPS**: ${r.rps || 'N/A'}`);
      console.log(`- **TPS**: ${r.tps}/block`);
      console.log(`- **Mempool**: ${r.mempool ? `Exposed (${r.pending} pending, ${r.queued} queued) ⚠️` : 'Hidden ✅'}`);
      console.log(`- **Safe TX**: ${r.safe ? '✅' : '❌'}`);
    }
  });
  
  // Summary
  const working = results.filter(r => r.status === 'success');
  const safe = working.filter(r => r.safe);
  console.log(`\n\n**Working RPCs**: ${working.length}`);
  console.log(`**MEV-Safe RPCs**: ${safe.length}`);
  if (!safe.length) {
    console.log('\n⚠️ **Warning**: No MEV-safe RPCs found - all have mempool exposure');
  }
}

main().catch(console.error);
