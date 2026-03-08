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
	ChainEVM     ChainType = "evm"
	ChainSolana  ChainType = "solana"
	ChainSui     ChainType = "sui"
	ChainAptos   ChainType = "aptos"
	ChainUnknown ChainType = "unknown"
)

type RPC struct {
	Name       string    `json:"name"`
	URL        string    `json:"url"`
	AuthHeader string    `json:"auth_header"`
	Origin     string    `json:"origin"`
	RPS        float64   `json:"rps"`
	TPS        float64   `json:"tps"`
	Mempool    bool      `json:"mempool"`
	SafeTX     bool      `json:"safe_tx"`
	Status     RPCStatus `json:"status"`
	Chain      ChainType `json:"chain"`
}

type RPCList struct {
	Chain ChainType `json:"chain"`
	RPCs  []RPC     `json:"rpcs"`
}
