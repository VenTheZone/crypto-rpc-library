package discover

import (
	"context"
	"strings"

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
	var detected []DetectedRPC

	for _, u := range urls {
		if u == "" {
			continue
		}
		if !strings.HasPrefix(u, "http://") && !strings.HasPrefix(u, "https://") {
			u = "https://" + u
		}

		chain, err := d.client.DetectChain(ctx, u)
		if err != nil {
			continue
		}

		if chain != types.ChainUnknown {
			name := extractName(u)
			detected = append(detected, DetectedRPC{
				URL:   u,
				Name:  name,
				Chain: chain,
			})
		}
	}

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
