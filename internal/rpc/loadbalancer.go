package rpc

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

type LoadBalancedClient struct {
	urls    []string
	client  *Client
	index   uint64
	healthy []bool
	mu      sync.RWMutex
}

func NewLoadBalancedClient(urls []string) *LoadBalancedClient {
	lb := &LoadBalancedClient{
		urls:    urls,
		client:  NewClient(),
		healthy: make([]bool, len(urls)),
	}
	for i := range lb.healthy {
		lb.healthy[i] = true
	}
	go lb.healthCheck()
	return lb
}

func (lb *LoadBalancedClient) SetHeader(key, value string) {
	lb.client.SetHeader(key, value)
}

func (lb *LoadBalancedClient) Call(ctx context.Context, method string, params []interface{}) (*JSONRPCResponse, error) {
	start := atomic.AddUint64(&lb.index, 1)
	numURLs := uint64(len(lb.urls))

	var lastErr error
	for i := uint64(0); i < numURLs; i++ {
		idx := (start + i) % numURLs

		lb.mu.RLock()
		healthy := lb.healthy[idx]
		lb.mu.RUnlock()

		if !healthy {
			continue
		}

		resp, err := lb.client.Call(ctx, lb.urls[idx], method, params)
		if err == nil {
			return resp, nil
		}

		lastErr = err
		lb.mu.Lock()
		lb.healthy[idx] = false
		lb.mu.Unlock()
	}

	if lastErr != nil {
		return nil, lastErr
	}
	return nil, fmt.Errorf("no healthy RPC endpoints")
}

func (lb *LoadBalancedClient) healthCheck() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		for i, url := range lb.urls {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			
			// Try Solana health check
			_, err := lb.client.Call(ctx, url, "getHealth", nil)
			if err != nil {
				// Try EVM health check
				_, err = lb.client.Call(ctx, url, "eth_blockNumber", nil)
			}
			cancel()

			lb.mu.Lock()
			lb.healthy[i] = err == nil
			lb.mu.Unlock()
		}
	}
}

func (lb *LoadBalancedClient) GetHealthyCount() int {
	lb.mu.RLock()
	defer lb.mu.RUnlock()
	count := 0
	for _, h := range lb.healthy {
		if h {
			count++
		}
	}
	return count
}

func (lb *LoadBalancedClient) GetStats() map[string]bool {
	lb.mu.RLock()
	defer lb.mu.RUnlock()
	stats := make(map[string]bool)
	for i, url := range lb.urls {
		stats[url] = lb.healthy[i]
	}
	return stats
}

type CallResult struct {
	Index int
	Resp  *JSONRPCResponse
	Err   error
}

func (lb *LoadBalancedClient) CallBatch(ctx context.Context, method string, params []interface{}, totalRequests, workers int) (int, int) {
	if workers <= 0 {
		workers = len(lb.urls)
	}
	if workers > totalRequests {
		workers = totalRequests
	}

	type job struct {
		id int
	}
	type result struct {
		resp *JSONRPCResponse
		err  error
	}

	jobs := make(chan job, totalRequests)
	results := make(chan result, totalRequests)

	var wg sync.WaitGroup

	for w := 0; w < workers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := range jobs {
				resp, err := lb.Call(ctx, method, params)
				results <- result{resp: resp, err: err}
				_ = j.id
			}
		}()
	}

	go func() {
		for i := 0; i < totalRequests; i++ {
			jobs <- job{id: i}
		}
		close(jobs)
	}()

	go func() {
		wg.Wait()
		close(results)
	}()

	success := 0
	fail := 0
	for r := range results {
		if r.err == nil {
			success++
		} else {
			fail++
		}
	}

	return success, fail
}
