package main

import (
	"context"
	"fmt"
	"os"

	"github.com/kytusdevenn/crypto-rpc/internal/discover"
	"github.com/kytusdevenn/crypto-rpc/internal/markdown"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
	"github.com/spf13/cobra"
)

var discoverCmd = &cobra.Command{
	Use:   "discover",
	Short: "Discover RPC endpoints",
	RunE:  runDiscover,
}

var (
	discoverChain  string
	discoverOutput string
	discoverDedup  string
	discoverLimit  int
)

func init() {
	discoverCmd.Flags().StringVarP(&discoverChain, "chain", "c", "all", "Chain to discover (bnb, eth, solana, all)")
	discoverCmd.Flags().StringVarP(&discoverOutput, "output", "o", "", "Output markdown file")
	discoverCmd.Flags().StringVarP(&discoverDedup, "dedup", "d", "", "Directory of known RPCs to exclude")
	discoverCmd.Flags().IntVarP(&discoverLimit, "limit", "l", 20, "Max DEXes to scan per chain")
	rootCmd.AddCommand(discoverCmd)
}

func runDiscover(cmd *cobra.Command, args []string) error {
	ctx := context.Background()

	dexClient := discover.NewDexScreenerClient()
	subfinder := discover.NewSubdomainFinder()
	detector := discover.NewRPCDetector()

	chains := getChains(discoverChain)
	var allRPCs []types.RPC

	for _, chain := range chains {
		fmt.Printf("Discovering %s DEXes...\n", chain)

		domains, err := dexClient.GetTopDEXes(ctx, chain, discoverLimit)
		if err != nil {
			fmt.Printf("Warning: failed to get DEXes for %s: %v\n", chain, err)
			continue
		}

		fmt.Printf("Found %d domains for %s\n", len(domains), chain)

		subdomains, err := subfinder.RunSubfinder(ctx, domains)
		if err != nil {
			fmt.Printf("Warning: subfinder failed: %v\n", err)
			continue
		}

		fmt.Printf("Found %d subdomains\n", len(subdomains))

		liveHosts, err := subfinder.RunHTTPX(ctx, subdomains)
		if err != nil {
			fmt.Printf("Warning: httpx failed: %v\n", err)
			continue
		}

		fmt.Printf("Found %d live hosts\n", len(liveHosts))

		detected, err := detector.DetectRPCs(ctx, liveHosts)
		if err != nil {
			fmt.Printf("Warning: detection failed: %v\n", err)
			continue
		}

		for _, d := range detected {
			allRPCs = append(allRPCs, types.RPC{
				Name:   d.Name,
				URL:    d.URL,
				Chain:  d.Chain,
				Status: types.StatusUntested,
			})
		}

		fmt.Printf("Detected %d RPCs for %s\n", len(detected), chain)
	}

	if discoverDedup != "" {
		allRPCs = dedupRPCs(allRPCs, discoverDedup)
	}

	list := &types.RPCList{
		Chain: types.ChainUnknown,
		RPCs:  allRPCs,
	}
	output := markdown.WriteFile(list, "Discovered RPCs")

	outPath := discoverOutput
	if outPath == "" {
		outPath = "discovered.md"
	}

	if err := os.WriteFile(outPath, []byte(output), 0644); err != nil {
		return fmt.Errorf("failed to write output: %w", err)
	}

	fmt.Printf("\nDiscovered %d RPCs, written to %s\n", len(allRPCs), outPath)
	return nil
}

func getChains(chain string) []string {
	if chain == "all" {
		return []string{"ethereum", "bsc", "polygon", "arbitrum", "optimism", "base", "solana", "avalanche"}
	}
	return []string{chain}
}

func dedupRPCs(rpcs []types.RPC, knownDir string) []types.RPC {
	knownURLs := make(map[string]bool)

	var filtered []types.RPC
	for _, r := range rpcs {
		if !knownURLs[r.URL] {
			filtered = append(filtered, r)
		}
	}
	return filtered
}
