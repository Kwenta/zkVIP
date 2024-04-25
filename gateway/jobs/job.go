package jobs

import (
	"time"

	"github.com/celer-network/goutils/log"
	"github.com/ethereum/go-ethereum/ethclient"
)

type Jobs struct {
	EC *ethclient.Client
}

func NewJobs(ec *ethclient.Client) *Jobs {
	jobs := &Jobs{
		EC: ec,
	}

	return jobs
}

func Start() {
	log.Info("Gateway Jobs Start")

	circuitInputTicker := time.NewTicker(30 * time.Second)
	provingTicker := time.NewTicker(15 * time.Second)
	uploadProofTicker := time.NewTicker(15 * time.Second)

	for {
		select {
		case <-circuitInputTicker.C:
			{

			}
		case <-provingTicker.C:
			{

			}
		case <-uploadProofTicker.C:
			{

			}
		}
	}

}
