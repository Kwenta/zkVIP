package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/brevis-network/brevis-sdk/sdk/prover"
	"github.com/brevis-network/kwenta/circuit"
)

var serviceName = flag.String("service", "", "the name of the service to start")
var port = flag.Uint("port", 33248, "the port to start the service at")
var numMaxDataPoints = flag.Uint("numMaxDataPoints", 512, "sdk NumMaxDataPoints")
var maxReceipts = flag.Int("maxReceipts", 256, "maxReceipts")

// example usage: prover -service="totalfee" -port=33248
func main() {
	flag.Parse()

	if len(*serviceName) == 0 {
		panic("flag -service is required")
	}

	if *numMaxDataPoints == 0 {
		panic("flag -numMaxDataPoints is required")
	}

	switch *serviceName {
	case "fee-reimbursement":
		startService(circuit.DefaultTraderVolumeCircuit(), *numMaxDataPoints, *maxReceipts)
	case "fee-reimbursement-large-prover":
		startService(circuit.DefaultTraderVolumeCircuit(), *numMaxDataPoints, *maxReceipts)
	default:
		panic("invalid -service flag")
	}
}

func startService(c sdk.AppCircuit, numMaxDataPoints uint, maxReceipts int) {
	if sdk.NumMaxDataPoints != numMaxDataPoints {
		panic("invalid brevis sdk version")
	}

	maxReceiptsInCircuit, _, _ := c.Allocate()

	if maxReceipts != maxReceiptsInCircuit {
		panic("invalid max receipts number")
	}

	proverService, err := prover.NewService(c, prover.ServiceConfig{
		SetupDir: "$HOME/circuitOut",
		SrsDir:   "$HOME/kzgsrs",
	})
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	proverService.Serve(*port)
}
