package markdown

import (
	"fmt"
	"strings"

	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

func WriteFile(list *types.RPCList, title string) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("# %s\n\n", title))
	sb.WriteString("| Name | URL | Auth Header | RPS | TPS | Mempool | Status |\n")
	sb.WriteString("| ---- | --- | ----------- | --- | --- | ------- | ------ |\n")

	for _, rpc := range list.RPCs {
		auth := rpc.AuthHeader
		if auth == "" {
			auth = "-"
		} else {
			auth = fmt.Sprintf("`%s`", auth)
		}

		rps := "-"
		if rpc.RPS > 0 {
			rps = fmt.Sprintf("%.0f", rpc.RPS)
		}

		tps := "-"
		if rpc.TPS > 0 {
			tps = fmt.Sprintf("%.0f", rpc.TPS)
		}

		mempool := "no"
		if rpc.Mempool {
			mempool = "yes"
		}

		sb.WriteString(fmt.Sprintf("| %s | %s | %s | %s | %s | %s | %s |\n",
			rpc.Name, rpc.URL, auth, rps, tps, mempool, rpc.Status))
	}

	return sb.String()
}
