package version

var (
	Version   = "dev"
	GitCommit = "unknown"
)

func Get() string {
	return Version + " (" + GitCommit + ")"
}
