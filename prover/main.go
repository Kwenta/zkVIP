package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/brevis-network/brevis-sdk/sdk/prover"
	"github.com/brevis-network/kwenta/circuit"
	"github.com/brevis-network/kwenta/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

var serviceName = flag.String("service", "", "the name of the service to start")
var port = flag.Uint("port", 43248, "the port to start the service at")
var numMaxDataPoints = flag.Uint("numMaxDataPoints", 256, "sdk NumMaxDataPoints")
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
		startService(circuit.DefaultOPV2VolumeFeeCircuit(), *numMaxDataPoints, *maxReceipts)
	case "calculateContractsHash":
		calculateContractsHash()
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

	proverService.Serve("", *port)
}

func calculateContractsHash() {
	var contractsBytes [512][]byte
	contracts := []string{
		"0x2B3bb4c683BFc5239B029131EEf3B1d214478d93",
		"0x2c5e2148bf3409659967fe3684fd999a76171235",
		"0x33d4613639603c845e61a02cd3d2a78be7d513dc",
		"0xeaf0191bca9dd417202cef2b18b7515abff1e196",
		"0x59b007e9ea8f89b069c43f8f45834d30853e3699",
		"0xc203a12f298ce73e44f7d45a4f59a43dbffe204d",
		"0x98ccbc721cc05e28a125943d69039b39be6a21e9",
		"0x3d3f34416f60f77a0a6cc8e32abe45d32a7497cb",
		"0x0ea09d97b4084d859328ec4bf8ebcf9ecca26f1d",
		"0xbbd74c2c8c89d45b822e08fce400f4dde99e600b",
		"0x0940b0a96c5e1ba33aee331a9f950bb2a6f2fb25",
		"0x09f9d7aaa6bef9598c3b676c0e19c9786aa566a8",
		"0x31a1659ca00f617e86dc765b6494afe70a5a9c1a",
		"0x074b8f19fc91d6b2eb51143e1f186ca0ddb88042",
		"0x509072a5ae4a87ac89fc8d64d94adcb44bd4b88e",
		"0x66fc48720f09ac386608fb65ede53bb220d0d5bc",
		"0xd5fbf7136b86021ef9d0be5d798f948dce9c0dea",
		"0x442b69937a0daf9d46439a71567fabe6cb69fbaf",
		"0xb3422e49db926f7c5f5d7daf5f1069abf1b7e894",
		"0xd4e9e0784c3ce4796f54f2ea0d337c7cfccfd645",
		"0x2f0f0865dfdd52adefb583ae824dde7d60b76a3b",
		"0x3f957df3ab99ff502ee09071dd353bf4352bbefe",
		"0x96690aae7cb7c4a9b5be5695e94d72827decc33f",
		"0x5374761526175b59f1e583246e20639909e189ce",
		"0xc8fcd6fb4d15dd7c455373297def375a08942ece",
		"0xc18f85a6dd3bcd0516a1ca08d3b1f0a4e191a2c4",
		"0xc8fcd6fb4d15dd7c455373297def375a08942ece",
		"0x35b0ed8473e7943d31ee1eeead06c8767034ce39",
		"0x6940e7c6125a177b052c662189bb27692e88e9cb",
		"0x96f2842007021a4c5f06bcc72961701d66ff8465",
		"0x296286ae0b5c066cbcfe46cc4ffb375bccafe640",
		"0xd5fccd43205cef11fbaf9b38df15adbe1b186869",
		"0x105f7f2986a2414b4007958b836904100a53d1ad",
		"0xb25529266d9677e9171beaf333a0dea506c5f99a",
		"0xa1ace9ce6862e865937939005b1a6c5ac938a11f",
		"0xdccda0cfbee25b33ff4ccca64467e89512511bf6",
		"0xf7d9bd13f877171f6c7f93f71bdf8e380335dc12",
		"0x91cc4a83d026e5171525afcaed020123a653c2c9",
		"0x6110df298b411a46d6edce72f5caca9ad826c1de",
		"0xaa94c874b91ef16c8b56a1c5b2f34e39366bd484",
		"0x4bf3c1af0faa689e3a808e6ad7a8d89d07bb9ec7",
		"0x5b6beb79e959aac2659bee60fe0d0885468bf886",
		"0x2ea06e73083f1b3314fa090eae4a5f70eb058f2e",
		"0xe698ccc3cd4f2172a848094ea6d28d89d750c16f",
		"0xb7059ed9950f2d9fdc0155fc0d79e63d4441e806",
		"0x4308427c463caeaab50fff98a9dec569c31e4e87",
		"0xae90e9bb73b32505fb56a0f4fd4ec8cf94bab730",
		"0x8b9b5f94aac2316f048025b3cbe442386e85984b",
		"0x2fd9a39acf071aa61f92f3d7a98332c68d6b6602",
		"0xfbbbfa96af2980ae4014d5d5a2ef14bd79b2a299",
		"0x69f5f465a46f324fb7bf3fd7c0d5c00f7165c7ea",
		"0x9615b6bfff240c44d3e33d0cd9a11f563a2e8d8b",
		"0x27665271210acff4fab08ad9bb657e91866471f0",
		"0xd91db82733987513286b81e7115091d96730b62a",
		"0xf9ae92bc49a5dd96ae5840eaae75218016811c99",
		"0xbb16c7b3244dfa1a6bf83fcce3ee4560837763cd",
		"0x572f816f21f56d47e4c4fa577837bd3f58088676",
		"0x852210f0616ac226a486ad3387dbf990e690116a",
		"0xf9dd29d2fd9b38cd90e390c797f1b7e0523f43a9",
		"0x77da808032dcdd48077fa7c57afbf088713e09ad",
		"0x031a448f59111000b96f016c37e9c71e57845096",
		"0x48beadab5781af9c4fec27ac6c8e0f402f2cc3d6",
		"0xc645a757dd81c69641e010add2da894b4b7bc921",
		"0xaf2e4c337b038eafa1de23b44c163d0008e49ead",
		"0x2f0fe4b621e7e54110446ce2df699004c6194636",
		"0x139f94e4f0e1101c1464a321cba815c34d58b5d9",
		"0x1681212a0edaf314496b489ab57cb3a5ad7a833f",
		"0x71f42ca320b3e9a8e4816e26de70c9b69eaf9d24",
		"0x50a40d947726ac1373dc438e7aadede9b237564d",
	}

	for i := 0; i < len(contractsBytes); i++ {
		if i < len(contracts) {
			b, err := hexutil.Decode(contracts[i])
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}
			contractsBytes[i] = b
		} else {
			contractsBytes[i] = []byte{0}
		}
	}

	contractHash, err := common.CalculateHash(contractsBytes[:])
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Printf("contracts hash: 0x%x\n", contractHash)
}
