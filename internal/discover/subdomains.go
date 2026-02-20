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

func (f *SubdomainFinder) RunHTTPX(ctx context.Context, hosts []string) ([]string, error) {
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
		parts := strings.Fields(line)
		if len(parts) > 0 {
			liveHosts = append(liveHosts, parts[0])
		}
	}

	return liveHosts, nil
}
