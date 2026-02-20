package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/kytusdevenn/crypto-rpc/internal/markdown"
	"github.com/kytusdevenn/crypto-rpc/internal/test"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
	"github.com/spf13/cobra"
)

var testCmd = &cobra.Command{
	Use:   "test",
	Short: "Test RPC endpoints",
	RunE:  runTest,
}

var (
	testInput      string
	testOutput     string
	testConcurrency int
)

func init() {
	testCmd.Flags().StringVarP(&testInput, "input", "i", "", "Input markdown file")
	testCmd.Flags().StringVarP(&testOutput, "output", "o", "", "Output markdown file")
	testCmd.Flags().IntVarP(&testConcurrency, "concurrency", "c", 50, "Concurrent requests for RPS test")
	testCmd.MarkFlagRequired("input")
	rootCmd.AddCommand(testCmd)
}

func runTest(cmd *cobra.Command, args []string) error {
	content, err := os.ReadFile(testInput)
	if err != nil {
		return fmt.Errorf("failed to read input: %w", err)
	}

	list, err := markdown.ParseFile(string(content))
	if err != nil {
		return fmt.Errorf("failed to parse input: %w", err)
	}

	ctx := context.Background()
	rpsTester := test.NewRPSTester(testConcurrency)
	tpsTester := test.NewTPSTester()
	mempoolTester := test.NewMempoolTester()

	for i := range list.RPCs {
		rpc := &list.RPCs[i]
		fmt.Printf("Testing %s... ", rpc.Name)

		rps, err := rpsTester.Test(ctx, rpc)
		if err != nil {
			rpc.Status = types.StatusDead
			fmt.Printf("FAILED (%v)\n", err)
			continue
		}
		rpc.RPS = rps

		tps, _ := tpsTester.Test(ctx, rpc)
		rpc.TPS = tps

		hasMempool, _ := mempoolTester.Test(ctx, rpc)
		rpc.Mempool = hasMempool

		rpc.Status = types.StatusWorking
		fmt.Printf("RPS=%.0f TPS=%.0f Mempool=%v\n", rps, tps, hasMempool)
	}

	output := markdown.WriteFile(list, "Tested RPCs")

	outPath := testOutput
	if outPath == "" {
		outPath = strings.TrimSuffix(testInput, ".md") + "-tested.md"
	}

	if err := os.WriteFile(outPath, []byte(output), 0644); err != nil {
		return fmt.Errorf("failed to write output: %w", err)
	}

	fmt.Printf("\nResults written to %s\n", outPath)
	return nil
}
