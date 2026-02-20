package discover

import (
	"context"
	"net/http"
)

type DexScreenerClient struct {
	httpClient *http.Client
}

func NewDexScreenerClient() *DexScreenerClient {
	return &DexScreenerClient{
		httpClient: &http.Client{},
	}
}

func (c *DexScreenerClient) GetTopDEXes(ctx context.Context, chain string, limit int) ([]string, error) {
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
		}[:min(limit, 10)], nil
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
		}[:min(limit, 8)], nil
	case "solana":
		return []string{
			"jup.ag",
			"raydium.io",
			"orca.so",
			"pump.fun",
			"meteora.ag",
		}[:min(limit, 5)], nil
	case "fantom", "ftm":
		return []string{
			"spookyswap.finance",
			"spiritswap.finance",
			"beefy.finance",
			"scream.sh",
			"geist.finance",
		}[:min(limit, 5)], nil
	default:
		return []string{
			"uniswap.org",
			"sushi.com",
			"1inch.io",
		}[:min(limit, 3)], nil
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
