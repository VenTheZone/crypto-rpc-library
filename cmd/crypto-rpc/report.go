package main

import (
	"fmt"
	"os"

	"github.com/kytusdevenn/crypto-rpc/internal/markdown"
	"github.com/kytusdevenn/crypto-rpc/internal/report"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
	"github.com/spf13/cobra"
)

var reportCmd = &cobra.Command{
	Use:   "report",
	Short: "Generate aggregate reports",
	RunE:  runReport,
}

var (
	reportInput  string
	reportOutput string
)

func init() {
	reportCmd.Flags().StringVarP(&reportInput, "input", "i", "networks/", "Input directory or file")
	reportCmd.Flags().StringVarP(&reportOutput, "output", "o", "NETWORKS.md", "Output file")
	rootCmd.AddCommand(reportCmd)
}

func runReport(cmd *cobra.Command, args []string) error {
	agg := report.NewAggregator()

	result, err := agg.AggregateFromDir(reportInput)
	if err != nil {
		return fmt.Errorf("failed to aggregate: %w", err)
	}

	var output string
	output += "# Crypto RPC Network Summary\n\n"
	output += fmt.Sprintf("Total RPCs: %d\n\n", len(result.All))

	output += "## Quick Reference\n\n"
	output += "| Chain | Working RPCs | With Mempool |\n"
	output += "| ----- | ------------ | ------------ |\n"

	for chain, rpcs := range result.ByChain {
		working := 0
		mempool := 0
		for _, r := range rpcs {
			if r.Status == types.StatusWorking {
				working++
				if r.Mempool {
					mempool++
				}
			}
		}
		output += fmt.Sprintf("| %s | %d | %d |\n", chain, working, mempool)
	}

	output += "\n---\n\n"

	for chain, rpcs := range result.ByChain {
		list := &types.RPCList{
			Chain: chain,
			RPCs:  rpcs,
		}
		output += markdown.WriteFile(list, string(chain))
		output += "\n"
	}

	if err := os.WriteFile(reportOutput, []byte(output), 0644); err != nil {
		return fmt.Errorf("failed to write output: %w", err)
	}

	fmt.Printf("Report written to %s\n", reportOutput)
	return nil
}
