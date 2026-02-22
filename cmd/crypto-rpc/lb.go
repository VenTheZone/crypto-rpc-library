package main

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/spf13/cobra"
)

var lbCmd = &cobra.Command{
	Use:   "lb",
	Short: "Load balancer for multiple RPCs",
}

var lbTestCmd = &cobra.Command{
	Use:   "test",
	Short: "Test load balanced RPCs",
	RunE:  runLBTest,
}

var (
	lbURLs    string
	lbChain   string
	lbCount   int
	lbWorkers int
)

func init() {
	lbTestCmd.Flags().StringVarP(&lbURLs, "urls", "u", "", "Comma-separated RPC URLs")
	lbTestCmd.Flags().StringVarP(&lbChain, "chain", "c", "solana", "Chain type (solana, evm)")
	lbTestCmd.Flags().IntVarP(&lbCount, "count", "n", 100, "Number of requests")
	lbTestCmd.Flags().IntVarP(&lbWorkers, "workers", "w", 0, "Number of concurrent workers (default: number of URLs)")
	lbTestCmd.MarkFlagRequired("urls")
	
	lbCmd.AddCommand(lbTestCmd)
	rootCmd.AddCommand(lbCmd)
}

func runLBTest(cmd *cobra.Command, args []string) error {
	urls := strings.Split(lbURLs, ",")
	if len(urls) == 0 {
		return fmt.Errorf("no URLs provided")
	}

	fmt.Printf("Load balancing across %d RPCs:\n", len(urls))
	for i, u := range urls {
		fmt.Printf("  [%d] %s\n", i+1, u)
	}
	fmt.Printf("\nSending %d requests with %d workers...\n\n", lbCount, lbWorkers)

	lb := rpc.NewLoadBalancedClient(urls)
	if lbChain == "solana" {
		lb.SetHeader("Origin", "https://solana.com")
	}

	ctx := context.Background()
	method := "getHealth"
	if lbChain == "evm" {
		method = "eth_blockNumber"
	}

	start := time.Now()
	success, fail := lb.CallBatch(ctx, method, nil, lbCount, lbWorkers)

	elapsed := time.Since(start)
	rps := float64(success) / elapsed.Seconds()

	fmt.Printf("Results:\n")
	fmt.Printf("  Total:     %d\n", lbCount)
	fmt.Printf("  Success:   %d\n", success)
	fmt.Printf("  Failed:    %d\n", fail)
	fmt.Printf("  Time:      %v\n", elapsed.Round(time.Millisecond))
	fmt.Printf("  RPS:       %.0f\n", rps)
	fmt.Printf("\nHealthy RPCs: %d/%d\n", lb.GetHealthyCount(), len(urls))

	return nil
}
