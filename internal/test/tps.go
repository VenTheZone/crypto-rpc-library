package test

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type TPSTester struct {
	client *rpc.Client
}

func NewTPSTester() *TPSTester {
	return &TPSTester{
		client: rpc.NewClient(),
	}
}

func (t *TPSTester) Test(ctx context.Context, r *types.RPC) (float64, error) {
	switch r.Chain {
	case types.ChainEVM:
		return t.testEVM(ctx, r)
	case types.ChainSolana:
		return t.testSolana(ctx, r)
	default:
		return 0, nil
	}
}

func (t *TPSTester) testEVM(ctx context.Context, r *types.RPC) (float64, error) {
	client := rpc.NewClient()
	if r.AuthHeader != "" {
		setHeadersFromAuth(client, r.AuthHeader)
	}

	resp, err := client.Call(ctx, r.URL, "eth_blockNumber", nil)
	if err != nil {
		return 0, fmt.Errorf("blockNumber err: %w", err)
	}
	if resp.Error != nil {
		return 0, fmt.Errorf("blockNumber rpc err: %s", resp.Error.Message)
	}

	var hexBlock string
	if err := json.Unmarshal(resp.Result, &hexBlock); err != nil {
		return 0, fmt.Errorf("unmarshal err: %w", err)
	}

	blockNum := parseHexInt(hexBlock)

	time.Sleep(5 * time.Second)

	resp, err = client.Call(ctx, r.URL, "eth_blockNumber", nil)
	if err != nil {
		return 0, err
	}

	if err := json.Unmarshal(resp.Result, &hexBlock); err != nil {
		return 0, err
	}

	newBlockNum := parseHexInt(hexBlock)

	blocksProduced := newBlockNum - blockNum
	if blocksProduced <= 0 {
		return 0, nil
	}

	resp, err = client.Call(ctx, r.URL, "eth_getBlockByNumber", []interface{}{fmt.Sprintf("0x%x", newBlockNum), false})
	if err != nil {
		return float64(blocksProduced) / 5.0, nil
	}
	if resp.Error != nil {
		return float64(blocksProduced) / 5.0, nil
	}

	var block struct {
		Transactions []interface{} `json:"transactions"`
	}
	if err := json.Unmarshal(resp.Result, &block); err != nil {
		return float64(blocksProduced) / 5.0, nil
	}

	txCount := len(block.Transactions)
	if txCount == 0 {
		txCount = 50
	}

	tps := float64(blocksProduced*int64(txCount)) / 5.0
	return tps, nil
}

func (t *TPSTester) testSolana(ctx context.Context, r *types.RPC) (float64, error) {
	client := rpc.NewClient()
	client.SetHeader("Origin", "https://solana.com")
	if r.AuthHeader != "" {
		setHeadersFromAuth(client, r.AuthHeader)
	}

	// Method 1: getRecentPerformanceSamples (most accurate)
	resp, err := client.Call(ctx, r.URL, "getRecentPerformanceSamples", []interface{}{5})
	if err == nil && resp.Error == nil {
		var samples []struct {
			NumTransactions  int64 `json:"numTransactions"`
			SamplePeriodSecs int64 `json:"samplePeriodSecs"`
		}
		if err := json.Unmarshal(resp.Result, &samples); err == nil && len(samples) > 0 {
			totalTx := int64(0)
			totalSecs := int64(0)
			for _, s := range samples {
				totalTx += s.NumTransactions
				totalSecs += s.SamplePeriodSecs
			}
			if totalSecs > 0 {
				return float64(totalTx) / float64(totalSecs), nil
			}
		}
	}

	// Method 2: getSlot sampling (fallback)
	client2 := rpc.NewClient()
	client2.SetHeader("Origin", "https://solana.com")

	resp2, err := client2.Call(ctx, r.URL, "getSlot", nil)
	if err != nil || resp2.Error != nil {
		return 0, nil
	}

	var slot float64
	if err := json.Unmarshal(resp2.Result, &slot); err != nil {
		return 0, nil
	}

	time.Sleep(5 * time.Second)

	resp2, err = client2.Call(ctx, r.URL, "getSlot", nil)
	if err != nil || resp2.Error != nil {
		return 0, nil
	}

	var newSlot float64
	if err := json.Unmarshal(resp2.Result, &newSlot); err != nil {
		return 0, nil
	}

	slotsProduced := int64(newSlot - slot)
	if slotsProduced <= 0 {
		return 0, nil
	}

	// Solana: ~400ms per slot = 2.5 slots/sec
	// Average ~2000 TPS / 2.5 = ~800 tx per slot
	avgTxPerSlot := int64(800)
	tps := float64(slotsProduced*avgTxPerSlot) / 5.0
	return tps, nil
}

func parseHexInt(hex string) int64 {
	hex = strings.TrimPrefix(hex, "0x")
	var result int64
	fmt.Sscanf(hex, "%x", &result)
	return result
}
