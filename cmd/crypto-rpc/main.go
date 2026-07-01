package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	version   = "dev"
	gitCommit = "unknown"
)

func versionStr() string {
	return version + " (" + gitCommit + ")"
}

var rootCmd = &cobra.Command{
	Use:     "crypto-rpc",
	Short:   "Discover and test cryptocurrency RPC endpoints",
	Version: versionStr(),
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
