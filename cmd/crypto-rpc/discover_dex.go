package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/spf13/cobra"
)

var dexDiscoverCmd = &cobra.Command{
	Use:   "discover-dex [chain]",
	Short: "Automatically discover RPCs from DEX frontends",
	Args:  cobra.MaximumNArgs(1),
	RunE:  runDexDiscover,
}

var (
	dexConcurrency int
	dexOutput      string
)

func init() {
	dexDiscoverCmd.Flags().IntVarP(&dexConcurrency, "concurrency", "c", 5, "Concurrent DEX scans")
	dexDiscoverCmd.Flags().StringVarP(&dexOutput, "output", "o", "", "Output file")
	rootCmd.AddCommand(dexDiscoverCmd)
}

func runDexDiscover(cmd *cobra.Command, args []string) error {
	chain := "solana"
	if len(args) > 0 {
		chain = args[0]
	}

	fmt.Printf("=== Automated DEX RPC Discovery: %s ===\n", chain)

	dexes := getDEXList(chain)
	fmt.Printf("Scanning %d DEXs...\n\n", len(dexes))

	ctx := context.Background()

	// Extract RPCs from DEX frontends
	fmt.Println("[1/3] Extracting RPCs from DEX frontends...")
	rpcs := extractRPCsConcurrent(ctx, dexes, dexConcurrency)

	// Deduplicate
	seen := make(map[string]bool)
	var unique []rpcDiscovery
	for _, r := range rpcs {
		key := r.URL + r.Source
		if !seen[key] {
			seen[key] = true
			unique = append(unique, r)
		}
	}
	rpcs = unique

	fmt.Printf("Found %d unique RPC endpoints\n\n", len(rpcs))

	// Test each RPC
	fmt.Println("[2/3] Testing RPCs for RPS/TPS...")
	tested := testDiscoveryRPCs(ctx, rpcs, chain)

	// Filter working
	var working []rpcDiscovery
	for _, r := range tested {
		if r.RPS > 0 {
			working = append(working, r)
		}
	}

	// Save results
	fmt.Println("\n[3/3] Saving results...")
	saveDiscoveryResults(working, chain, dexOutput)

	fmt.Println("\n=== Done! ===")
	return nil
}

type rpcDiscovery struct {
	URL     string  `json:"url"`
	RPS     float64 `json:"rps"`
	TPS     float64 `json:"tps"`
	Mempool bool    `json:"mempool"`
	SafeTX  bool    `json:"safeTx"`
	Origin  string  `json:"origin,omitempty"`
	Chain   string  `json:"chain"`
	Source  string  `json:"source"`
}

func getDEXList(chain string) []string {
	if chain == "solana" {
		return []string{
			"jup.ag", "raydium.io", "orca.so", "pump.fun", "meteora.ag",
			"phoenix.fi", "lifinity.io", "fluxbeam.xyz", "drift.trade",
			"solend.fi", "marginfi.com", "kamino.lend", "port.finance",
			"friktion.fi", "goosefx.com", "aldrin.com", "mooniswap.io",
			"crema.finance", "cykura.io", "deltafi.gg",
		}
	}
	return []string{
		"uniswap.org", "sushi.com", "curve.fi", "balancer.fi",
		"pancakeswap.finance", "biswap.org", "apeswap.finance",
		"quickswap.exchange", "camelot.exchange", "aerodrome.finance",
	}
}

func extractRPCsConcurrent(ctx context.Context, dexes []string, concurrency int) []rpcDiscovery {
	var results []rpcDiscovery
	var mu sync.Mutex
	var wg sync.WaitGroup

	sem := make(chan struct{}, concurrency)

	for _, dex := range dexes {
		wg.Add(1)
		sem <- struct{}{}

		go func(dex string) {
			defer wg.Done()
			defer func() { <-sem }()

			rpcURLs := extractRPCFromDEX(dex)

			mu.Lock()
			for _, url := range rpcURLs {
				results = append(results, rpcDiscovery{
					URL:    url,
					Chain:  "solana",
					Source: dex,
				})
			}
			mu.Unlock()
		}(dex)
	}

	wg.Wait()
	return results
}

func extractRPCFromDEX(dex string) []string {
	// Try playwright extraction
	scriptPath := "/home/kytusdevenn/.kimaki/projects/crypto-rpc-library/scripts/extract-rpc.js"
	if _, err := os.Stat(scriptPath); err != nil {
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 45*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "node", scriptPath, dex)
	cmd.Dir = filepath.Dir(scriptPath)

	output, err := cmd.Output()
	if err != nil {
		return nil
	}

	var urls []string
	lines := strings.Split(string(output), "\n")

	for _, line := range lines {
		if strings.Contains(line, `"url":"`) && strings.Contains(line, "rpc") {
			var result map[string]interface{}
			if json.Unmarshal([]byte(line), &result) == nil {
				if endpoints, ok := result["rpcEndpoints"].([]interface{}); ok {
					for _, e := range endpoints {
						if ep, ok := e.(map[string]interface{}); ok {
							if url, ok := ep["url"].(string); ok && url != "" {
								urls = append(urls, url)
							}
						}
					}
				}
			}
		}
	}

	return urls
}

func testDiscoveryRPCs(ctx context.Context, rpcs []rpcDiscovery, chain string) []rpcDiscovery {
	for i := range rpcs {
		r := &rpcs[i]

		client := rpc.NewClient()

		// Set Origin header if needed
		if strings.Contains(r.Source, "raydium") {
			client.SetHeader("Origin", "https://raydium.io")
			r.Origin = "https://raydium.io"
		} else if strings.Contains(r.Source, "meteora") {
			client.SetHeader("Origin", "https://www.meteora.ag")
			r.Origin = "https://www.meteora.ag"
		}

		// Test RPS
		rps, _ := testDiscoveryRPS(ctx, client, r.URL, chain)
		r.RPS = rps

		// Test TPS
		if chain == "solana" {
			tps, _ := testDiscoveryTPS(ctx, client, r.URL)
			r.TPS = tps
		}

		// Test mempool
		r.Mempool, r.SafeTX = testDiscoveryMempool(ctx, client, r.URL, chain)

		fmt.Printf("  %s: RPS=%.0f TPS=%.0f SafeTX=%v\n", r.Source, r.RPS, r.TPS, r.SafeTX)
	}

	return rpcs
}

func testDiscoveryRPS(ctx context.Context, client *rpc.Client, url, chain string) (float64, error) {
	method := "getHealth"
	if chain != "solana" {
		method = "eth_blockNumber"
	}

	start := time.Now()
	success := 0

	for i := 0; i < 30; i++ {
		_, err := client.Call(ctx, url, method, nil)
		if err == nil {
			success++
		}
	}

	elapsed := time.Since(start).Seconds()
	if elapsed > 0 {
		return float64(success) / elapsed, nil
	}
	return 0, nil
}

func testDiscoveryTPS(ctx context.Context, client *rpc.Client, url string) (float64, error) {
	client.SetHeader("Origin", "https://solana.com")

	resp, err := client.Call(ctx, url, "getRecentPerformanceSamples", []interface{}{1})
	if err != nil || resp.Error != nil {
		return 0, nil
	}

	var samples []struct {
		NumTransactions  int64 `json:"numTransactions"`
		SamplePeriodSecs int64 `json:"samplePeriodSecs"`
	}

	if err := json.Unmarshal(resp.Result, &samples); err != nil || len(samples) == 0 {
		return 0, nil
	}

	return float64(samples[0].NumTransactions) / float64(samples[0].SamplePeriodSecs), nil
}

func testDiscoveryMempool(ctx context.Context, client *rpc.Client, url, chain string) (mempool, safeTX bool) {
	if chain == "solana" {
		return false, true
	}

	_, err := client.Call(ctx, url, "txpool_content", nil)
	if err == nil {
		return true, false
	}

	return false, true
}

func saveDiscoveryResults(rpcs []rpcDiscovery, chain, output string) {
	if output == "" {
		output = fmt.Sprintf("networks/%s/dex-discovered.md", chain)
	}

	var sb strings.Builder
	sb.WriteString("# Discovered RPCs from DEX Frontends\n\n")
	sb.WriteString("| Source | URL | Origin | RPS | TPS | Safe TX |\n")
	sb.WriteString("|--------|-----|--------|-----|-----|---------|\n")

	for _, r := range rpcs {
		origin := r.Origin
		if origin == "" {
			origin = "-"
		}
		sb.WriteString(fmt.Sprintf("| %s | %s | %s | %.0f | %.0f | %v |\n",
			r.Source, r.URL, origin, r.RPS, r.TPS, r.SafeTX))
	}

	os.WriteFile(output, []byte(sb.String()), 0644)
	fmt.Printf("Saved to %s\n", output)
}
