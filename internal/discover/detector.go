package discover

import (
	"context"
	"strings"
	"sync"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type RPCDetector struct {
	client *rpc.Client
}

func NewRPCDetector() *RPCDetector {
	return &RPCDetector{
		client: rpc.NewClient(),
	}
}

type DetectedRPC struct {
	URL   string
	Name  string
	Chain types.ChainType
}

func (d *RPCDetector) DetectRPCs(ctx context.Context, urls []string) ([]DetectedRPC, error) {
	var filtered []string
	for _, u := range urls {
		if u == "" {
			continue
		}
		lower := strings.ToLower(u)
		if strings.Contains(lower, "rpc") || strings.Contains(lower, "api") || strings.Contains(lower, "node") || strings.Contains(lower, "eth") {
			filtered = append(filtered, u)
		}
	}

	if len(filtered) > 100 {
		filtered = filtered[:100]
	}

	var detected []DetectedRPC
	var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, 20)

	for _, u := range filtered {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
				url = "https://" + url
			}

			client := rpc.NewClient()
			chain, err := client.DetectChain(ctx, url)
			if err != nil {
				return
			}

			if chain != types.ChainUnknown {
				name := extractName(url)
				mu.Lock()
				detected = append(detected, DetectedRPC{
					URL:   url,
					Name:  name,
					Chain: chain,
				})
				mu.Unlock()
			}
		}(u)
	}

	wg.Wait()
	return detected, nil
}

func extractName(url string) string {
	url = strings.TrimPrefix(url, "https://")
	url = strings.TrimPrefix(url, "http://")
	parts := strings.Split(url, "/")
	domain := parts[0]

	domain = strings.TrimPrefix(domain, "rpc.")
	domain = strings.TrimPrefix(domain, "api.")
	domain = strings.TrimPrefix(domain, "www.")

	return domain
}
