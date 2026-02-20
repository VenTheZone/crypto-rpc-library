# crypto-rpc Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Go CLI tool to discover and test cryptocurrency RPC endpoints across multiple chains.

**Architecture:** Single Go binary with subcommands (discover, test, report). Shell out to subfinder/httpx for discovery, internal Go packages for RPC detection, testing, and markdown report generation.

**Tech Stack:** Go 1.21+, cobra (CLI), net/http, encoding/json, external tools (subfinder, httpx)

---

## Phase 1: Project Scaffold

### Task 1: Initialize Go Module

**Files:**
- Create: `go.mod`
- Create: `go.sum`

**Step 1: Initialize module**

Run: `go mod init github.com/kytusdevenn/crypto-rpc`
Expected: Creates go.mod

**Step 2: Verify**

Run: `cat go.mod`
Expected:
```
module github.com/kytusdevenn/crypto-rpc

go 1.21
```

**Step 3: Commit**

```bash
git add go.mod
git commit -m "chore: initialize go module"
```

---

### Task 2: Create Directory Structure

**Files:**
- Create: `cmd/crypto-rpc/main.go`
- Create: `internal/discover/discover.go`
- Create: `internal/test/test.go`
- Create: `internal/dedup/dedup.go`
- Create: `internal/report/report.go`
- Create: `networks/evm/.gitkeep`
- Create: `networks/solana/.gitkeep`
- Create: `networks/sui/.gitkeep`

**Step 1: Create directories**

```bash
mkdir -p cmd/crypto-rpc
mkdir -p internal/discover internal/test internal/dedup internal/report
mkdir -p networks/evm networks/solana networks/sui
touch networks/evm/.gitkeep networks/solana/.gitkeep networks/sui/.gitkeep
```

**Step 2: Create main.go stub**

```go
package main

import "fmt"

func main() {
	fmt.Println("crypto-rpc")
}
```

**Step 3: Verify build**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc && ./bin/crypto-rpc`
Expected: `crypto-rpc`

**Step 4: Commit**

```bash
git add .
git commit -m "chore: create project structure"
```

---

### Task 3: Add Cobra CLI

**Files:**
- Modify: `go.mod`
- Modify: `cmd/crypto-rpc/main.go`

**Step 1: Install cobra**

Run: `go get -u github.com/spf13/cobra@latest`

**Step 2: Rewrite main.go with cobra**

```go
package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "crypto-rpc",
	Short: "Discover and test cryptocurrency RPC endpoints",
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
```

**Step 3: Verify**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc && ./bin/crypto-rpc --help`
Expected: Help output with usage info

**Step 4: Commit**

```bash
git add go.mod go.sum cmd/crypto-rpc/main.go
git commit -m "feat: add cobra cli scaffold"
```

---

## Phase 2: Data Types

### Task 4: Define RPC Data Types

**Files:**
- Create: `internal/types/rpc.go`

**Step 1: Create types package**

```bash
mkdir -p internal/types
```

**Step 2: Write types/rpc.go**

```go
package types

type RPCStatus string

const (
	StatusWorking     RPCStatus = "working"
	StatusNeedsKey    RPCStatus = "needs-key"
	StatusRateLimited RPCStatus = "rate-limited"
	StatusDead        RPCStatus = "dead"
	StatusUntested    RPCStatus = "untested"
)

type ChainType string

const (
	ChainEVM    ChainType = "evm"
	ChainSolana ChainType = "solana"
	ChainSui    ChainType = "sui"
	ChainAptos  ChainType = "aptos"
	ChainUnknown ChainType = "unknown"
)

type RPC struct {
	Name       string    `json:"name"`
	URL        string    `json:"url"`
	AuthHeader string    `json:"auth_header"`
	RPS        float64   `json:"rps"`
	TPS        float64   `json:"tps"`
	Mempool    bool      `json:"mempool"`
	Status     RPCStatus `json:"status"`
	Chain      ChainType `json:"chain"`
}

type RPCList struct {
	Chain ChainType `json:"chain"`
	RPCs  []RPC     `json:"rpcs"`
}
```

**Step 3: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 4: Commit**

```bash
git add internal/types/
git commit -m "feat: add rpc data types"
```

---

### Task 5: Add Markdown Parser/Writer

**Files:**
- Create: `internal/markdown/parser.go`
- Create: `internal/markdown/writer.go`

**Step 1: Create markdown package**

```bash
mkdir -p internal/markdown
```

**Step 2: Write parser.go**

```go
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
```

**Step 3: Write writer.go**

```go
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
```

**Step 4: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 5: Commit**

```bash
git add internal/markdown/
git commit -m "feat: add markdown parser and writer"
```

---

## Phase 3: Test Command

### Task 6: Add JSON-RPC Client

**Files:**
- Create: `internal/rpc/client.go`

**Step 1: Create rpc package**

```bash
mkdir -p internal/rpc
```

**Step 2: Write client.go**

```go
package rpc

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type JSONRPCRequest struct {
	JSONRPC string        `json:"jsonrpc"`
	ID      int           `json:"id"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
}

type JSONRPCResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      int             `json:"id"`
	Result  json.RawMessage `json:"result"`
	Error   *RPCError       `json:"error"`
}

type RPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type Client struct {
	httpClient *http.Client
	headers    map[string]string
}

func NewClient() *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 15 * time.Second,
		},
		headers: make(map[string]string),
	}
}

func (c *Client) SetHeader(key, value string) {
	c.headers[key] = value
}

func (c *Client) Call(ctx context.Context, url string, method string, params []interface{}) (*JSONRPCResponse, error) {
	req := JSONRPCRequest{
		JSONRPC: "2.0",
		ID:      1,
		Method:  method,
		Params:  params,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	for k, v := range c.headers {
		httpReq.Header.Set(k, v)
	}

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var rpcResp JSONRPCResponse
	if err := json.Unmarshal(respBody, &rpcResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &rpcResp, nil
}
```

**Step 3: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 4: Commit**

```bash
git add internal/rpc/
git commit -m "feat: add json-rpc client"
```

---

### Task 7: Implement Chain Detection

**Files:**
- Create: `internal/rpc/detect.go`

**Step 1: Write detect.go**

```go
package rpc

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"strconv"

	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

func (c *Client) DetectChain(ctx context.Context, url string) (types.ChainType, error) {
	// Try EVM: eth_chainId
	resp, err := c.Call(ctx, url, "eth_chainId", nil)
	if err == nil && resp.Error == nil && len(resp.Result) > 0 {
		return types.ChainEVM, nil
	}

	// Try Solana: getHealth
	resp, err = c.Call(ctx, url, "getHealth", nil)
	if err == nil && resp.Error == nil {
		var result string
		if json.Unmarshal(resp.Result, &result) == nil && result == "ok" {
			return types.ChainSolana, nil
		}
	}

	// Try Sui: sui_getLatestCheckpointSequenceNumber
	resp, err = c.Call(ctx, url, "sui_getLatestCheckpointSequenceNumber", nil)
	if err == nil && resp.Error == nil && len(resp.Result) > 0 {
		return types.ChainSui, nil
	}

	return types.ChainUnknown, nil
}

func (c *Client) GetEVMChainID(ctx context.Context, url string) (int64, error) {
	resp, err := c.Call(ctx, url, "eth_chainId", nil)
	if err != nil {
		return 0, err
	}

	var hexResult string
	if err := json.Unmarshal(resp.Result, &hexResult); err != nil {
		return 0, err
	}

	// Remove 0x prefix
	hexResult = hexResult[2:]
	id, err := strconv.ParseInt(hexResult, 16, 64)
	if err != nil {
		return 0, err
	}

	return id, nil
}
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/rpc/detect.go
git commit -m "feat: add chain detection"
```

---

### Task 8: Implement RPS Testing

**Files:**
- Create: `internal/test/rps.go`

**Step 1: Write rps.go**

```go
package test

import (
	"context"
	"sync"
	"time"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type RPSTester struct {
	client     *rpc.Client
	concurrency int
}

func NewRPSTester(concurrency int) *RPSTester {
	return &RPSTester{
		client:     rpc.NewClient(),
		concurrency: concurrency,
	}
}

func (t *RPSTester) Test(ctx context.Context, r *types.RPC) (float64, error) {
	start := time.Now()
	
	var wg sync.WaitGroup
	successCount := 0
	var mu sync.Mutex

	for i := 0; i < t.concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			
			client := rpc.NewClient()
			if r.AuthHeader != "" {
				// Parse header format: "Key: Value"
				// TODO: implement header parsing
			}

			resp, err := client.Call(ctx, r.URL, t.getBlockMethod(r.Chain), nil)
			if err == nil && (resp.Error == nil || resp.Error.Code != -32601) {
				mu.Lock()
				successCount++
				mu.Unlock()
			}
		}()
	}

	wg.Wait()
	elapsed := time.Since(start).Seconds()

	if elapsed == 0 || successCount == 0 {
		return 0, nil
	}

	return float64(successCount) / elapsed, nil
}

func (t *RPSTester) getBlockMethod(chain types.ChainType) string {
	switch chain {
	case types.ChainSolana:
		return "getSlot"
	case types.ChainSui:
		return "sui_getLatestCheckpointSequenceNumber"
	default:
		return "eth_blockNumber"
	}
}
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/test/rps.go
git commit -m "feat: add rps testing"
```

---

### Task 9: Implement Mempool Testing

**Files:**
- Create: `internal/test/mempool.go`

**Step 1: Write mempool.go**

```go
package test

import (
	"context"
	"encoding/json"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type MempoolTester struct {
	client *rpc.Client
}

func NewMempoolTester() *MempoolTester {
	return &MempoolTester{
		client: rpc.NewClient(),
	}
}

func (t *MempoolTester) Test(ctx context.Context, r *types.RPC) (bool, error) {
	switch r.Chain {
	case types.ChainEVM:
		return t.testEVM(ctx, r)
	case types.ChainSolana:
		return t.testSolana(ctx, r)
	default:
		return false, nil
	}
}

func (t *MempoolTester) testEVM(ctx context.Context, r *types.RPC) (bool, error) {
	client := rpc.NewClient()
	if r.AuthHeader != "" {
		// TODO: parse and set headers
	}

	resp, err := client.Call(ctx, r.URL, "txpool_content", nil)
	if err != nil {
		return false, err
	}

	if resp.Error != nil {
		// Method not supported
		if resp.Error.Code == -32601 {
			return false, nil
		}
		return false, nil
	}

	// Parse response: {"pending": {...}, "queued": {...}}
	var result struct {
		Pending map[string]interface{} `json:"pending"`
		Queued  map[string]interface{} `json:"queued"`
	}

	if err := json.Unmarshal(resp.Result, &result); err != nil {
		return false, nil
	}

	// Has mempool if either is non-empty
	return len(result.Pending) > 0 || len(result.Queued) > 0, nil
}

func (t *MempoolTester) testSolana(ctx context.Context, r *types.RPC) (bool, error) {
	// Solana doesn't have traditional mempool
	// Just check if getSignaturesForAddress works
	return false, nil
}
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/test/mempool.go
git commit -m "feat: add mempool testing"
```

---

### Task 10: Add Test Subcommand

**Files:**
- Create: `cmd/crypto-rpc/test.go`
- Modify: `cmd/crypto-rpc/main.go`

**Step 1: Write test.go**

```go
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
	testInput  string
	testOutput string
	testConcurrency int
)

func init() {
	testCmd.Flags().StringVarP(&testInput, "input", "i", "", "Input markdown file")
	testCmd.Flags().StringVarP(&testOutput, "output", "o", "", "Output markdown file")
	testCmd.Flags().IntVarP(&testConcurrency, "concurrency", "c", 50, "Concurrent requests for RPS test")
	testCmd.MarkFlagRequired("input")
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
	mempoolTester := test.NewMempoolTester()

	for i := range list.RPCs {
		rpc := &list.RPCs[i]
		fmt.Printf("Testing %s... ", rpc.Name)

		// Test RPS
		rps, err := rpsTester.Test(ctx, rpc)
		if err != nil {
			rpc.Status = types.StatusDead
			fmt.Printf("FAILED (%v)\n", err)
			continue
		}
		rpc.RPS = rps

		// Test mempool
		hasMempool, _ := mempoolTester.Test(ctx, rpc)
		rpc.Mempool = hasMempool

		rpc.Status = types.StatusWorking
		fmt.Printf("RPS=%.0f Mempool=%v\n", rps, hasMempool)
	}

	// Write output
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

func init() {
	rootCmd.AddCommand(testCmd)
}
```

**Step 2: Update main.go**

Add to `cmd/crypto-rpc/main.go`:
```go
// Add at top of main():
rootCmd.AddCommand(testCmd)
```

**Step 3: Verify**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc && ./bin/crypto-rpc test --help`
Expected: Help output for test command

**Step 4: Commit**

```bash
git add cmd/crypto-rpc/
git commit -m "feat: add test subcommand"
```

---

## Phase 4: Discover Command

### Task 11: Implement DexScreener Fetcher

**Files:**
- Create: `internal/discover/dexscreener.go`

**Step 1: Write dexscreener.go**

```go
package discover

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type DexScreenerClient struct {
	httpClient *http.Client
}

func NewDexScreenerClient() *DexScreenerClient {
	return &DexScreenerClient{
		httpClient: &http.Client{},
	}
}

type Dex struct {
	Chain     string `json:"chain"`
	DexId     string `json:"dexId"`
	URL       string `json:"url"`
	Address   string `json:"pairAddress"`
}

type DEXPairResponse struct {
	Pairs []struct {
		Chain     string `json:"chain"`
		DexId     string `json:"dexId"`
		URL       string `json:"url"`
	} `json:"pairs"`
}

// GetTopDEXes fetches top DEXes for a chain
func (c *DexScreenerClient) GetTopDEXes(ctx context.Context, chain string, limit int) ([]string, error) {
	// Search for popular tokens on the chain to get DEX URLs
	url := fmt.Sprintf("https://api.dexscreener.com/latest/dex/search?q=%s", chain)
	
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result DEXPairResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// Extract unique domains from URLs
	seen := make(map[string]bool)
	var domains []string

	for _, pair := range result.Pairs {
		if pair.URL == "" {
			continue
		}
		
		parsedURL, err := url.Parse(pair.URL)
		if err != nil {
			continue
		}
		
		domain := parsedURL.Hostname()
		// Remove www prefix
		domain = strings.TrimPrefix(domain, "www.")
		
		if !seen[domain] {
			seen[domain] = true
			domains = append(domains, domain)
			if len(domains) >= limit {
				break
			}
		}
	}

	return domains, nil
}
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/discover/dexscreener.go
git commit -m "feat: add dexscreener client"
```

---

### Task 12: Implement Subfinder/HTTPX Integration

**Files:**
- Create: `internal/discover/subdomains.go`

**Step 1: Write subdomains.go**

```go
package discover

import (
	"context"
	"os/exec"
	"strings"
)

type SubdomainFinder struct{}

func NewSubdomainFinder() *SubdomainFinder {
	return &SubdomainFinder{}
}

// RunSubfinder shells out to subfinder
func (f *SubdomainFinder) RunSubfinder(ctx context.Context, domains []string) ([]string, error) {
	domainList := strings.Join(domains, ",")
	
	cmd := exec.CommandContext(ctx, "subfinder", "-dL", "-silent", "-d", domainList)
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	subdomains := strings.Split(strings.TrimSpace(string(output)), "\n")
	return subdomains, nil
}

// RunHTTPX shells out to httpx to filter live hosts
func (f *SubdomainFinder) RunHTTPX(ctx context.Context, hosts []string) ([]string, error) {
	// Write hosts to temp file for httpx
	input := strings.Join(hosts, "\n")
	
	cmd := exec.CommandContext(ctx, "httpx", "-silent", "-https", "-status-code", "-mc", "200,401,403")
	cmd.Stdin = strings.NewReader(input)
	
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	lines := strings.Split(strings.TrimSpace(string(output)), "\n")
	var liveHosts []string
	for _, line := range lines {
		if line == "" {
			continue
		}
		// httpx outputs: https://domain.com [status]
		parts := strings.Fields(line)
		if len(parts) > 0 {
			liveHosts = append(liveHosts, parts[0])
		}
	}

	return liveHosts, nil
}
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/discover/subdomains.go
git commit -m "feat: add subfinder/httpx integration"
```

---

### Task 13: Implement RPC Detection from URLs

**Files:**
- Create: `internal/discover/detector.go`

**Step 1: Write detector.go**

```go
package discover

import (
	"context"
	"strings"

	"github.com/kytusdevenn/crypto-rpc/internal/rpc"
	"github.com/kytusdevenn/crypto-rpc/internal/types"
)

type RPCDetector struct {
	client *rpc.Client
}

func NewRPCDetector() *RPCDetector {
	return &RPCDetector{
		client: rpc.NewClient(),
	}
}

type DetectedRPC struct {
	URL   string
	Name  string
	Chain types.ChainType
}

// DetectRPCs probes URLs and identifies RPC endpoints
func (d *RPCDetector) DetectRPCs(ctx context.Context, urls []string) ([]DetectedRPC, error) {
	var detected []DetectedRPC

	for _, url := range urls {
		chain, err := d.client.DetectChain(ctx, url)
		if err != nil {
			continue
		}

		if chain != types.ChainUnknown {
			name := extractName(url)
			detected = append(detected, DetectedRPC{
				URL:   url,
				Name:  name,
				Chain: chain,
			})
		}
	}

	return detected, nil
}

func extractName(url string) string {
	// Extract domain name from URL
	url = strings.TrimPrefix(url, "https://")
	url = strings.TrimPrefix(url, "http://")
	parts := strings.Split(url, "/")
	domain := parts[0]
	
	// Remove common prefixes
	domain = strings.TrimPrefix(domain, "rpc.")
	domain = strings.TrimPrefix(domain, "api.")
	domain = strings.TrimPrefix(domain, "www.")
	
	return domain
}
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/discover/detector.go
git commit -m "feat: add rpc detector"
```

---

### Task 14: Add Discover Subcommand

**Files:**
- Create: `cmd/crypto-rpc/discover.go`

**Step 1: Write discover.go**

```go
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
	discoverChain   string
	discoverOutput  string
	discoverDedup   string
	discoverLimit   int
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

		// Get DEX domains
		domains, err := dexClient.GetTopDEXes(ctx, chain, discoverLimit)
		if err != nil {
			fmt.Printf("Warning: failed to get DEXes for %s: %v\n", chain, err)
			continue
		}

		fmt.Printf("Found %d domains for %s\n", len(domains), chain)

		// Run subfinder
		subdomains, err := subfinder.RunSubfinder(ctx, domains)
		if err != nil {
			fmt.Printf("Warning: subfinder failed: %v\n", err)
			continue
		}

		fmt.Printf("Found %d subdomains\n", len(subdomains))

		// Run httpx to get live hosts
		liveHosts, err := subfinder.RunHTTPX(ctx, subdomains)
		if err != nil {
			fmt.Printf("Warning: httpx failed: %v\n", err)
			continue
		}

		fmt.Printf("Found %d live hosts\n", len(liveHosts))

		// Detect RPCs
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

	// Dedup against known RPCs
	if discoverDedup != "" {
		allRPCs = dedupRPCs(allRPCs, discoverDedup)
	}

	// Write output
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
	// Load known RPCs from markdown files
	knownURLs := make(map[string]bool)
	
	// TODO: implement directory scanning
	
	var filtered []types.RPC
	for _, r := range rpcs {
		if !knownURLs[r.URL] {
			filtered = append(filtered, r)
		}
	}
	return filtered
}
```

**Step 2: Verify**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc && ./bin/crypto-rpc discover --help`
Expected: Help output for discover command

**Step 3: Commit**

```bash
git add cmd/crypto-rpc/discover.go
git commit -m "feat: add discover subcommand"
```

---

## Phase 5: Report Command

### Task 15: Implement Report Aggregator

**Files:**
- Create: `internal/report/aggregator.go`

**Step 1: Write aggregator.go**

```go
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

// AggregateFromDir reads all markdown files in a directory
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
```

**Step 2: Verify build**

Run: `go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
git add internal/report/aggregator.go
git commit -m "feat: add report aggregator"
```

---

### Task 16: Add Report Subcommand

**Files:**
- Create: `cmd/crypto-rpc/report.go`

**Step 1: Write report.go**

```go
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

	// Generate summary
	var output string
	output += "# Crypto RPC Network Summary\n\n"
	output += fmt.Sprintf("Total RPCs: %d\n\n", len(result.All))

	// Summary table
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

	// Detailed per-chain sections
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
```

**Step 2: Verify**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc && ./bin/crypto-rpc report --help`
Expected: Help output for report command

**Step 3: Commit**

```bash
git add cmd/crypto-rpc/report.go
git commit -m "feat: add report subcommand"
```

---

## Phase 6: Final Polish

### Task 17: Add Version Command

**Files:**
- Create: `internal/version/version.go`
- Modify: `cmd/crypto-rpc/main.go`

**Step 1: Write version.go**

```go
package version

var (
	Version   = "dev"
	GitCommit = "unknown"
)

func Get() string {
	return Version + " (" + GitCommit + ")"
}
```

**Step 2: Add version flag to main.go**

Add to `rootCmd` in `cmd/crypto-rpc/main.go`:
```go
var version bool

func init() {
	rootCmd.Version = version.Get()
}
```

**Step 3: Verify**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc && ./bin/crypto-rpc --version`
Expected: Version output

**Step 4: Commit**

```bash
git add internal/version/ cmd/crypto-rpc/main.go
git commit -m "feat: add version command"
```

---

### Task 18: Add README

**Files:**
- Create: `README.md`

**Step 1: Write README.md**

```markdown
# crypto-rpc

Discover and test cryptocurrency RPC endpoints.

## Installation

```bash
go build -o bin/crypto-rpc ./cmd/crypto-rpc
```

## Usage

### Discover RPCs

```bash
crypto-rpc discover --chain bnb --output networks/evm/bnb-new.md
```

### Test RPCs

```bash
crypto-rpc test --input networks/evm/bnb-new.md --output networks/evm/bnb-tested.md
```

### Generate Report

```bash
crypto-rpc report --input networks/ --output NETWORKS.md
```

## Requirements

- Go 1.21+
- [subfinder](https://github.com/projectdiscovery/subfinder)
- [httpx](https://github.com/projectdiscovery/httpx)

## Output Format

Markdown tables with columns:

| Name | URL | Auth Header | RPS | TPS | Mempool | Status |
|------|-----|-------------|-----|-----|---------|--------|
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add readme"
```

---

### Task 19: Final Build Test

**Step 1: Build**

Run: `go build -o bin/crypto-rpc ./cmd/crypto-rpc`

**Step 2: Test commands**

```bash
./bin/crypto-rpc --help
./bin/crypto-rpc discover --help
./bin/crypto-rpc test --help
./bin/crypto-rpc report --help
```

**Step 3: Final commit**

```bash
git add .
git commit -m "chore: final build verification"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-3 | Project scaffold |
| 2 | 4-5 | Data types & markdown |
| 3 | 6-10 | Test command |
| 4 | 11-14 | Discover command |
| 5 | 15-16 | Report command |
| 6 | 17-19 | Polish & docs |
