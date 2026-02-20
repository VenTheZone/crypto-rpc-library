package rpc

import (
	"context"
	"encoding/json"
	"strconv"
	"strings"

	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

func (c *Client) DetectChain(ctx context.Context, url string) (types.ChainType, error) {
	resp, err := c.Call(ctx, url, "eth_chainId", nil)
	if err == nil && resp.Error == nil && len(resp.Result) > 0 {
		return types.ChainEVM, nil
	}

	resp, err = c.Call(ctx, url, "getHealth", nil)
	if err == nil && resp.Error == nil {
		var result string
		if json.Unmarshal(resp.Result, &result) == nil && result == "ok" {
			return types.ChainSolana, nil
		}
	}

	resp, err = c.Call(ctx, url, "sui_getLatestCheckpointSequenceNumber", nil)
	if err == nil && resp.Error == nil && len(resp.Result) > 0 {
		return types.ChainSui, nil
	}

	return types.ChainUnknown, nil
}

func (c *Client) GetEVMChainID(ctx context.Context, url string) (int64, error) {
	resp, err := c.Call(ctx, url, "eth_chainId", nil)
	if err != nil {
		return 0, err
	}

	var hexResult string
	if err := json.Unmarshal(resp.Result, &hexResult); err != nil {
		return 0, err
	}

	hexResult = strings.TrimPrefix(hexResult, "0x")
	id, err := strconv.ParseInt(hexResult, 16, 64)
	if err != nil {
		return 0, err
	}

	return id, nil
}
