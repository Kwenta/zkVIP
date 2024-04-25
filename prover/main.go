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
var port = flag.Uint("port", 33247, "the port to start the service at")

// example usage: prover -service="totalfee" -port=33248
func main() {
	flag.Parse()

	if len(*serviceName) == 0 {
		panic("flag -service is required")
	}

	switch *serviceName {
	case "trader-volume":
		startService(circuit.DefaultTraderVolumeCircuit())
	default:
		panic("invalid -service flag")
	}
}

func startService(c sdk.AppCircuit) {
	proverService, err := prover.NewService(c, prover.ServiceConfig{
		SetupDir: "$HOME/circuitOut",
		SrsDir:   "$HOME/kzgsrs",
	})
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	if err = proverService.Serve(*port); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
