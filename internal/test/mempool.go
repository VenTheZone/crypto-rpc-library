package test

import (
	"context"
	"encoding/json"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type MempoolTester struct {
	origin string
}

func NewMempoolTester() *MempoolTester {
	return &MempoolTester{}
}

func (t *MempoolTester) SetOrigin(origin string) {
	t.origin = origin
}

func (t *MempoolTester) Test(ctx context.Context, r *types.RPC) (bool, error) {
	switch r.Chain {
	case types.ChainEVM:
		return t.testEVM(ctx, r)
	case types.ChainSolana:
		return t.testSolana(ctx, r)
	default:
		return false, nil
	}
}

func (t *MempoolTester) testEVM(ctx context.Context, r *types.RPC) (bool, error) {
	client := rpc.NewClient()
	if r.AuthHeader != "" {
		setHeadersFromAuth(client, r.AuthHeader)
	}
	// Apply custom Origin header if specified
	if t.origin != "" {
		client.SetHeader("Origin", t.origin)
	}

	resp, err := client.Call(ctx, r.URL, "txpool_content", nil)
	if err != nil {
		return false, err
	}

	if resp.Error != nil {
		if resp.Error.Code == -32601 {
			return false, nil
		}
		return false, nil
	}

	var result struct {
		Pending map[string]interface{} `json:"pending"`
		Queued  map[string]interface{} `json:"queued"`
	}

	if err := json.Unmarshal(resp.Result, &result); err != nil {
		return false, nil
	}

	return len(result.Pending) > 0 || len(result.Queued) > 0, nil
}

func (t *MempoolTester) testSolana(ctx context.Context, r *types.RPC) (bool, error) {
	return false, nil
}
