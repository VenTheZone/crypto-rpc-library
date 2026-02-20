package discover

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type SubdomainFinder struct{}

func NewSubdomainFinder() *SubdomainFinder {
	return &SubdomainFinder{}
}

func findBinary(name string) string {
	paths := []string{
		filepath.Join(os.Getenv("HOME"), "go", "bin", name),
		"/usr/local/go/bin/" + name,
		"/usr/bin/" + name,
	}
	for _, p := range paths {
		if _, err := os.Stat(p); err == nil {
			return p
		}
	}
	return name
}

func (f *SubdomainFinder) RunSubfinder(ctx context.Context, domains []string) ([]string, error) {
	args := []string{"-silent", "-d"}
	args = append(args, strings.Join(domains, ","))

	binary := findBinary("subfinder")
	cmd := exec.CommandContext(ctx, binary, args...)
	cmd.Env = append(os.Environ(), "PATH="+os.Getenv("PATH")+":/usr/local/go/bin:"+os.Getenv("HOME")+"/go/bin")
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	subdomains := strings.Split(strings.TrimSpace(string(output)), "\n")
	return subdomains, nil
}

func (f *SubdomainFinder) RunHTTPX(ctx context.Context, hosts []string) ([]string, error) {
	input := strings.Join(hosts, "\n")

	binary := findBinary("httpx")
	cmd := exec.CommandContext(ctx, binary, "-silent", "-sc", "-mc", "200,401,403,404,405,500")
	cmd.Stdin = strings.NewReader(input)
	cmd.Env = append(os.Environ(), "PATH="+os.Getenv("PATH")+":/usr/local/go/bin:"+os.Getenv("HOME")+"/go/bin")

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
