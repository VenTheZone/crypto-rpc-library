const { chromium } = require('playwright');

const RPC_DOMAINS = [
  'rpc', 'node', 'endpoint', 'mainnet', '.chain', 'blockchain',
  'infura', 'alchemy', 'ankr', 'quicknode', 'drpc', 'publicnode',
  'blastapi', 'nodereal', 'tenderly', 'twnodes', 'onfinality',
  'blockpi', 'getblock', 'cloudflare', 'pokt', 'gateway',
  'polygon-rpc', 'bsc-rpc', 'avalanche-rpc', 'fantom-rpc'
];

const EXCLUDE_PATTERNS = [
  'localhost', '127.0.0.1', '.css', '.jpg', '.png', '.svg', '.ico',
  'fonts.', 'cloudflare.com', 'googleapis', 'githubusercontent',
  'walletconnect', 'opensea', 'moonpay', 'defi',
  'statsig', 'sentry', 'datadog', 'segment', 'beacon',
  'challenges.cloudflare', 'vercel', 'ipfs', 'cloudfunctions',
  'inter', 'interfont', 'cdn', 'static', 'assets', 'images'
];

function isRPCURL(url) {
  if (!url || url.length < 10) return false;
  
  const lower = url.toLowerCase();
  
  // Must start with http
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    return false;
  }
  
  // Check exclude patterns first
  for (const pattern of EXCLUDE_PATTERNS) {
    if (lower.includes(pattern)) return false;
  }
  
  // Must contain RPC-related keyword
  const hasRPCKeyword = RPC_DOMAINS.some(d => lower.includes(d));
  return hasRPCKeyword;
}

function extractURLs(text) {
  const urlRegex = /https?:\/\/[^\s"'<>()]+/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)];
}

async function extractRPCsAndKeys(url) {
  const results = {
    url: url,
    rpcs: [],
    apiKeys: [],
    origins: [],
    chains: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(url, { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    // Get all JavaScript and text content
    const allContent = await page.evaluate(() => {
      let content = '';
      
      // Get all script tags
      document.querySelectorAll('script').forEach(s => {
        content += s.textContent + '\n';
      });
      
      // Get all inline scripts
      document.querySelectorAll('script:not([src])').forEach(s => {
        content += s.textContent + '\n';
      });
      
      // Also get the full HTML for URL patterns
      content += document.documentElement.outerHTML;
      
      return content;
    });
    
    // Extract all URLs
    const urls = extractURLs(allContent);
    
    // Filter for RPC URLs
    for (const url of urls) {
      if (isRPCURL(url) && !results.rpcs.includes(url)) {
        results.rpcs.push(url);
      }
    }
    
    // Try to detect chains from the content
    const chains = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'fantom', 'solana', 'celo', 'linea', 'zksync', 'scroll', 'mantle'];
    for (const chain of chains) {
      if (allContent.toLowerCase().includes(chain) || allContent.toLowerCase().includes(chain.toUpperCase())) {
        results.chains.push(chain);
      }
    }
    
    // Try to extract API keys from common patterns
    const keyPatterns = [
      /["'](?:RPC|API)[_"']?(?:KEY|TOKEN)?["']\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})/gi,
      /(?:apiKey|apikey|api_key)\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})/gi,
    ];
    
    for (const pattern of keyPatterns) {
      const matches = allContent.match(pattern);
      if (matches) {
        for (const match of matches) {
          const key = match.match(/[a-zA-Z0-9_-]{20,}/);
          if (key && !results.apiKeys.includes(key[0])) {
            results.apiKeys.push(key[0].substring(0, 40) + '...'); // Truncate for safety
          }
        }
      }
    }
    
  } catch (e) {
    results.error = e.message;
  } finally {
    await browser.close();
  }
  
  return results;
}

async function main() {
  const dexes = process.argv.slice(2);
  
  for (const dex of dexes) {
    const url = dex.startsWith('http') ? dex : `https://${dex}`;
    console.error(`Scanning: ${url}`);
    
    const results = await extractRPCsAndKeys(url);
    console.log(JSON.stringify(results));
  }
}

main().catch(console.error);
