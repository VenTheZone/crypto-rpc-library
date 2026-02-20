package discover

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type DexScreenerClient struct {
	httpClient *http.Client
}

func NewDexScreenerClient() *DexScreenerClient {
	return &DexScreenerClient{
		httpClient: &http.Client{},
	}
}

type DEXPairResponse struct {
	Pairs []struct {
		Chain string `json:"chain"`
		DexId string `json:"dexId"`
		URL   string `json:"url"`
	} `json:"pairs"`
}

func (c *DexScreenerClient) GetTopDEXes(ctx context.Context, chain string, limit int) ([]string, error) {
	apiURL := fmt.Sprintf("https://api.dexscreener.com/latest/dex/search?q=%s", chain)

	req, _ := http.NewRequestWithContext(ctx, "GET", apiURL, nil)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result DEXPairResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	seen := make(map[string]bool)
	var domains []string

	for _, pair := range result.Pairs {
		if pair.URL == "" {
			continue
		}

		parsedURL, err := url.Parse(pair.URL)
		if err != nil {
			continue
		}

		domain := parsedURL.Hostname()
		domain = strings.TrimPrefix(domain, "www.")

		if !seen[domain] {
			seen[domain] = true
			domains = append(domains, domain)
			if len(domains) >= limit {
				break
			}
		}
	}

	return domains, nil
}
