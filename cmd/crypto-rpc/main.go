package main

import (
	"fmt"
	"os"

	"github.com/kytusdevenn/crypto-rpc/internal/version"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:     "crypto-rpc",
	Short:   "Discover and test cryptocurrency RPC endpoints",
	Version: version.Get(),
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
