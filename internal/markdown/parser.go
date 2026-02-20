package markdown

import (
	"bufio"
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

	return list, nil
}

func parseChainName(name string) types.ChainType {
	switch strings.ToLower(name) {
	case "ethereum", "bnb", "polygon", "arbitrum", "optimism", "base", "fantom", "avalanche", "evm":
		return types.ChainEVM
	case "solana":
		return types.ChainSolana
	case "sui":
		return types.ChainSui
	case "aptos":
		return types.ChainAptos
	default:
		return types.ChainUnknown
	}
}

func parseTableRow(line string) types.RPC {
	parts := strings.Split(line, "|")
	if len(parts) < 7 {
		return types.RPC{}
	}

	clean := func(s string) string {
		return strings.TrimSpace(strings.Trim(s, "`"))
	}

	authHeader := clean(parts[3])
	if authHeader == "-" {
		authHeader = ""
	}

	return types.RPC{
		Name:       clean(parts[1]),
		URL:        clean(parts[2]),
		AuthHeader: authHeader,
		Status:     types.StatusUntested,
	}
}
