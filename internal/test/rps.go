package test

import (
	"context"
	"sync"
	"time"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type RPSTester struct {
	concurrency int
	origin      string
}

func NewRPSTester(concurrency int) *RPSTester {
	return &RPSTester{
		concurrency: concurrency,
	}
}

func (t *RPSTester) SetOrigin(origin string) {
	t.origin = origin
}

func (t *RPSTester) Test(ctx context.Context, r *types.RPC) (float64, error) {
	start := time.Now()

	var wg sync.WaitGroup
	successCount := 0
	var mu sync.Mutex

	// Determine origin: use custom origin if set, otherwise default to https://solana.com for Solana
	origin := t.origin
	if origin == "" && r.Chain == types.ChainSolana {
		origin = "https://solana.com"
	}

	for i := 0; i < t.concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			client := rpc.NewClient()
			if r.AuthHeader != "" {
				setHeadersFromAuth(client, r.AuthHeader)
			}

			// Set origin header if specified
			if origin != "" {
				client.SetHeader("Origin", origin)
			}

			resp, err := client.Call(ctx, r.URL, t.getBlockMethod(r.Chain), nil)
			if err == nil && (resp.Error == nil || resp.Error.Code != -32601) {
				mu.Lock()
				successCount++
				mu.Unlock()
			}
		}()
	}

	wg.Wait()
	elapsed := time.Since(start).Seconds()

	if elapsed == 0 || successCount == 0 {
		return 0, nil
	}

	return float64(successCount) / elapsed, nil
}

func (t *RPSTester) getBlockMethod(chain types.ChainType) string {
	switch chain {
	case types.ChainSolana:
		return "getHealth"
	case types.ChainSui:
		return "sui_getLatestCheckpointSequenceNumber"
	default:
		return "eth_blockNumber"
	}
}

func setHeadersFromAuth(client *rpc.Client, authHeader string) {
}
