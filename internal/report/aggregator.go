package report

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/kytusdevenn/crypto-rpc/internal/markdown"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type Aggregator struct{}

func NewAggregator() *Aggregator {
	return &Aggregator{}
}

type AggregatedReport struct {
	ByChain map[types.ChainType][]types.RPC
	All     []types.RPC
}

func (a *Aggregator) AggregateFromDir(dir string) (*AggregatedReport, error) {
	report := &AggregatedReport{
		ByChain: make(map[types.ChainType][]types.RPC),
		All:     []types.RPC{},
	}

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() || !strings.HasSuffix(path, ".md") {
			return nil
		}

		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		list, err := markdown.ParseFile(string(content))
		if err != nil {
			return err
		}

		for _, rpc := range list.RPCs {
			report.All = append(report.All, rpc)
			report.ByChain[rpc.Chain] = append(report.ByChain[rpc.Chain], rpc)
		}

		return nil
	})

	return report, err
}
