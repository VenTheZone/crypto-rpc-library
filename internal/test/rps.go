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
}

func NewRPSTester(concurrency int) *RPSTester {
	return &RPSTester{
		concurrency: concurrency,
	}
}

func (t *RPSTester) Test(ctx context.Context, r *types.RPC) (float64, error) {
	start := time.Now()

	var wg sync.WaitGroup
	successCount := 0
	var mu sync.Mutex

	for i := 0; i < t.concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			client := rpc.NewClient()
			if r.AuthHeader != "" {
				setHeadersFromAuth(client, r.AuthHeader)
			}

			// For Solana, also try with Origin headers
			if r.Chain == types.ChainSolana {
				client.SetHeader("Origin", "https://solana.com")
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
