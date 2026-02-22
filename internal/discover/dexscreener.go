package discover

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type DexScreenerClient struct {
	httpClient *http.Client
}

type TokenPair struct {
	ChainID     string `json:"chainId"`
	PairAddress string `json:"pairAddress"`
}

type DexScreenerResponse struct {
	Pairs []TokenPair `json:"pairs"`
}

func NewDexScreenerClient() *DexScreenerClient {
	return &DexScreenerClient{
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

func (c *DexScreenerClient) GetAllDEXes(ctx context.Context, chain string) ([]string, error) {
	chainID := c.chainToChainID(chain)
	
	url := fmt.Sprintf("https://api.dexscreener.com/orders/v1/%s", chainID)
	
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != 200 {
		return c.getFallbackDEXes(chain), nil
	}
	
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return c.getFallbackDEXes(chain), nil
	}
	
	seen := make(map[string]bool)
	var dexes []string
	
	if orders, ok := result["orders"].([]interface{}); ok {
		for _, o := range orders {
			if order, ok := o.(map[string]interface{}); ok {
				if pair, ok := order["pair"].(map[string]interface{}); ok {
					if url, ok := pair["url"].(string); ok && url != "" {
						domain := extractDomain(url)
						if domain != "" && !seen[domain] {
							seen[domain] = true
							dexes = append(dexes, domain)
						}
					}
				}
			}
		}
	}
	
	if len(dexes) == 0 {
		return c.getFallbackDEXes(chain), nil
	}
	
	return dexes, nil
}

func (c *DexScreenerClient) chainToChainID(chain string) string {
	mapping := map[string]string{
		"ethereum":     "ethereum",
		"eth":          "ethereum",
		"bsc":          "bsc",
		"bnb":          "bsc",
		"solana":       "solana",
		"polygon":      "polygon",
		"matic":        "polygon",
		"arbitrum":     "arbitrum",
		"arb":          "arbitrum",
		"optimism":     "optimism",
		"op":           "optimism",
		"base":         "base",
		"avalanche":    "avalanche",
		"avax":         "avalanche",
		"fantom":       "fantom",
		"ftm":          "fantom",
		"celo":         "celo",
		"zksync":       "zksync",
		"era":          "zksync",
		"linea":        "linea",
		"mantle":       "mantle",
		"scroll":       "scroll",
		"gnosis":       "gnosis",
		"moonbeam":     "moonbeam",
		"moonriver":    "moonriver",
		"cronos":       "cronos",
		"aurora":       "aurora",
		"harmony":      "harmony",
		"klaytn":       "klaytn",
	}
	
	if id, ok := mapping[chain]; ok {
		return id
	}
	return chain
}

func extractDomain(url string) string {
	if len(url) > 0 {
		for i := len(url) - 1; i >= 0; i-- {
			if url[i] == '/' || url[i] == ':' {
				if i+1 < len(url) {
					return url[i+1:]
				}
			}
		}
		return url
	}
	return ""
}

func (c *DexScreenerClient) getFallbackDEXes(chain string) []string {
	switch chain {
	case "bsc", "bnb":
		return []string{
			"pancakeswap.finance",
			"biswap.org",
			"apeswap.finance",
			"mdex.com",
			"babyswap.finance",
			"thena.fi",
			"uniswap.org",
			"sushi.com",
			"1inch.io",
			"kyberswap.com",
		}
	case "ethereum", "eth":
		return []string{
			"uniswap.org",
			"sushi.com",
			"curve.fi",
			"balancer.fi",
			"1inch.io",
			"kyberswap.com",
			"paraswap.io",
			"0x.org",
			"traderjoexyz.com",
			"cryptex.finance",
			"lido.fi",
			"aave.com",
			"compound.finance",
			"makerdao.com",
		}
	case "solana":
		return []string{
			"jup.ag",
			"raydium.io",
			"orca.so",
			"pump.fun",
			"meteora.ag",
			"phoenix.fi",
			"lifinity.io",
		}
	case "fantom", "ftm":
		return []string{
			"spookyswap.finance",
			"spiritswap.finance",
			"beefy.finance",
			"geist.finance",
			"tarot.to",
		}
	case "base":
		return []string{
			"aerodrome.finance",
			"baseswap.fi",
			"uniswap.org",
		}
	case "polygon":
		return []string{
			"quickswap.exchange",
			"apeswap.finance",
			"sushi.com",
		}
	case "arbitrum":
		return []string{
			"uniswap.org",
			"sushi.com",
			"camelot.exchange",
		}
	case "optimism":
		return []string{
			"uniswap.org",
			"velodrome.finance",
			"sushi.com",
		}
	case "avalanche":
		return []string{
			"traderjoexyz.com",
			"pangolin.exchange",
			"lyra.finance",
		}
	default:
		return []string{
			"uniswap.org",
			"sushi.com",
			"1inch.io",
		}
	}
}

func (c *DexScreenerClient) GetTopDEXes(ctx context.Context, chain string, limit int) ([]string, error) {
	all, err := c.GetAllDEXes(ctx, chain)
	if err != nil {
		return c.getFallbackDEXes(chain)[:min(limit, len(c.getFallbackDEXes(chain)))], nil
	}
	if len(all) > limit {
		return all[:limit], nil
	}
	return all, nil
}
