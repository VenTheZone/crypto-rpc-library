package markdown

import (
	"bufio"
	"strconv"
	"strings"

	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

func ParseFile(content string) (*types.RPCList, error) {
	list := &types.RPCList{
		RPCs: []types.RPC{},
	}

	scanner := bufio.NewScanner(strings.NewReader(content))
	inTable := false

	for scanner.Scan() {
		line := scanner.Text()

		if strings.HasPrefix(line, "# ") {
			chainName := strings.TrimPrefix(line, "# ")
			list.Chain = parseChainName(chainName)
			continue
		}

		if strings.HasPrefix(line, "| ") && strings.Contains(line, " | ") {
			if strings.Contains(line, "Name") || strings.Contains(line, "---") {
				inTable = true
				continue
			}
			if inTable {
				rpc := parseTableRow(line)
				if rpc.URL != "" {
					list.RPCs = append(list.RPCs, rpc)
				}
			}
		}
	}

	SetChain(list)
	return list, nil
}

func SetChain(list *types.RPCList) {
	for i := range list.RPCs {
		if list.RPCs[i].Chain == types.ChainUnknown || list.RPCs[i].Chain == "" {
			list.RPCs[i].Chain = list.Chain
		}
	}
	if list.Chain == "" || list.Chain == types.ChainUnknown {
		list.Chain = types.ChainEVM
		for i := range list.RPCs {
			list.RPCs[i].Chain = types.ChainEVM
		}
	}
}

func parseChainName(name string) types.ChainType {
	name = strings.ToLower(name)

	if strings.Contains(name, "ethereum") || strings.Contains(name, "eth") {
		return types.ChainEVM
	}
	if strings.Contains(name, "bnb") || strings.Contains(name, "bsc") || strings.Contains(name, "binance") {
		return types.ChainEVM
	}
	if strings.Contains(name, "polygon") || strings.Contains(name, "matic") {
		return types.ChainEVM
	}
	if strings.Contains(name, "arbitrum") || strings.Contains(name, "arb") {
		return types.ChainEVM
	}
	if strings.Contains(name, "optimism") || strings.Contains(name, "op ") {
		return types.ChainEVM
	}
	if strings.Contains(name, "base") {
		return types.ChainEVM
	}
	if strings.Contains(name, "fantom") || strings.Contains(name, "ftm") {
		return types.ChainEVM
	}
	if strings.Contains(name, "avalanche") || strings.Contains(name, "avax") {
		return types.ChainEVM
	}
	if strings.Contains(name, "solana") || strings.Contains(name, "sol") {
		return types.ChainSolana
	}
	if strings.Contains(name, "sui") {
		return types.ChainSui
	}
	if strings.Contains(name, "aptos") {
		return types.ChainAptos
	}
	return types.ChainUnknown
}

func parseTableRow(line string) types.RPC {
	parts := strings.Split(line, "|")
	
	clean := func(s string) string {
		return strings.TrimSpace(strings.Trim(strings.Trim(s, "`"), "*"))
	}

	authHeader := clean(parts[3])
	if authHeader == "-" {
		authHeader = ""
	}

	origin := ""
	if len(parts) >= 9 {
		origin = clean(parts[4])
		if origin == "-" {
			origin = ""
		}
	}

	rpsIdx := 5
	tpsIdx := 6
	mempoolIdx := 7
	safeTXIdx := 8
	statusIdx := 9

	if len(parts) < 10 {
		rpsIdx = 4
		tpsIdx = 5
		mempoolIdx = 6
		safeTXIdx = 7
		statusIdx = 8
	}

	rps, _ := strconv.ParseFloat(clean(parts[rpsIdx]), 64)
	tps, _ := strconv.ParseFloat(clean(parts[tpsIdx]), 64)
	mempool := clean(parts[mempoolIdx]) == "yes"
	
	var safeTX bool
	var status types.RPCStatus
	
	if len(parts) >= 10 {
		safeTX = clean(parts[safeTXIdx]) == "yes"
		status = types.RPCStatus(clean(parts[statusIdx]))
	} else if len(parts) >= 9 {
		status = types.RPCStatus(clean(parts[safeTXIdx]))
	}
	
	if status == "" || status == "-" {
		status = types.StatusUntested
	}

	return types.RPC{
		Name:       clean(parts[1]),
		URL:        clean(parts[2]),
		AuthHeader: authHeader,
		Origin:     origin,
		RPS:        rps,
		TPS:        tps,
		Mempool:    mempool,
		SafeTX:     safeTX,
		Status:     status,
	}
}
