package test

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
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

	blockNum, err := strconv.ParseInt(strings.TrimPrefix(hexBlock, "0x"), 16, 64)
	if err != nil {
		return 0, fmt.Errorf("parse hex err: %w", err)
	}

	time.Sleep(5 * time.Second)

	resp, err = client.Call(ctx, r.URL, "eth_blockNumber", nil)
	if err != nil {
		return 0, err
	}

	if err := json.Unmarshal(resp.Result, &hexBlock); err != nil {
		return 0, err
	}

	newBlockNum, err := strconv.ParseInt(strings.TrimPrefix(hexBlock, "0x"), 16, 64)
	if err != nil {
		return 0, err
	}

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
	return 0, nil
}
