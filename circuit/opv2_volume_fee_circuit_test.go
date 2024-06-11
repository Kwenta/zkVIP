package circuit

import (
	"fmt"
	"math/big"
	"testing"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/brevis-network/brevis-sdk/test"
	"github.com/brevis-network/kwenta/common"
	"github.com/celer-network/goutils/log"
	"github.com/stretchr/testify/assert"
)

func TestOPV2VolumeFeeCircuit(t *testing.T) {
	app, err := sdk.NewBrevisApp()
	assert.NoError(t, err)

	account := common.Hex2Hash("0x5AD2e3c62a7774A58c4b3B5dd17c78446c86C8D2")
	const testContractAddress = "0x2B3bb4c683BFc5239B029131EEf3B1d214478d93"
	contract := sdk.ConstUint248(testContractAddress)

	var contractsBytes [512][]byte
	var contracts [512]sdk.Uint248
	contracts[0] = contract
	contractsBytes[0] = common.Hex2Bytes(testContractAddress)

	for i := 1; i < len(contracts); i++ {
		contracts[i] = sdk.ConstUint248(0)
		contractsBytes[i] = []byte{0}
	}

	contractHash, err := common.CalculateHash(contractsBytes[:])
	assert.NoError(t, err)

	app.AddReceipt(
		sdk.ReceiptData{
			BlockNum: big.NewInt(119533862),
			TxHash:   common.Hex2Hash("0x85a4dec94dc12afbed297e20698282fe6d93b69e3dbe10b25d2d0fbdd6076df7"),
			Fields: [sdk.NumMaxLogFields]sdk.LogFieldData{
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    true,
					FieldIndex: 2,
					Value:      account,
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    false,
					FieldIndex: 2,
					Value:      common.Hex2Hash("0xffffffffffffffffffffffffffffffffffffffffffffffffff88a0fa5f8c0000"),
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    false,
					FieldIndex: 3,
					Value:      common.Hex2Hash("0000000000000000000000000000000000000000000000a19cc424b2b2372024"),
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(DelayedOrderSubmittedEvent),
					IsTopic:    false,
					FieldIndex: 6,
					Value:      common.Hex2Hash("0x000000000000000000000000000000000000000000000000126d066d99996308"),
				},
			},
		},
		0,
	)

	app.AddReceipt(
		sdk.ReceiptData{
			BlockNum: big.NewInt(120665848),
			TxHash:   common.Hex2Hash("0x6ec133991506d69396dd377d8a5e299162893aee813085a4129c21c75773f964"),
			Fields: [sdk.NumMaxLogFields]sdk.LogFieldData{
				{
					Contract:   common.Hex2Addr(OrderFlowFeeImposedEventContractAddress),
					LogIndex:   11,
					EventID:    common.Hex2Hash(OrderFlowFeeImposedEvent),
					IsTopic:    true,
					FieldIndex: 1,
					Value:      account,
				},
				{
					Contract:   common.Hex2Addr(OrderFlowFeeImposedEventContractAddress),
					LogIndex:   11,
					EventID:    common.Hex2Hash(OrderFlowFeeImposedEvent),
					IsTopic:    false,
					FieldIndex: 0,
					Value:      common.Hex2Hash("0x000000000000000000000000000000000000000000000000001465578d7c9040"),
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(DelayedOrderSubmittedEvent),
					IsTopic:    true,
					FieldIndex: 1,
					Value:      account,
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(DelayedOrderSubmittedEvent),
					IsTopic:    false,
					FieldIndex: 6,
					Value:      common.Hex2Hash("0x000000000000000000000000000000000000000000000000126d066d99996308"),
				},
			},
		},
		MaxReceipts-MaxClaimableTradesPerCircuit*2,
	)

	app.AddReceipt(
		sdk.ReceiptData{
			BlockNum: big.NewInt(120665850),
			TxHash:   common.Hex2Hash("0x6561dbad43071d4e743c7c948db904c0335d91b358f35f759d9a671ced70dc57"),
			Fields: [sdk.NumMaxLogFields]sdk.LogFieldData{
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    true,
					FieldIndex: 2,
					Value:      account,
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    false,
					FieldIndex: 2,
					Value:      common.Hex2Hash("0xffffffffffffffffffffffffffffffffffffffffffffffffff945a4f7f4e4000"),
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    false,
					FieldIndex: 3,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000cf995c947e98e91449"),
				},
				{
					Contract:   common.Hex2Addr(testContractAddress),
					LogIndex:   7,
					EventID:    common.Hex2Hash(PositionModifiedEvent),
					IsTopic:    false,
					FieldIndex: 5,
					Value:      common.Hex2Hash("0x00000000000000000000000000000000000000000000000000f757bf6d800cd1"),
				},
			},
		},
		MaxReceipts-MaxClaimableTradesPerCircuit*2+1,
	)

	appCircuitAssignment := &OPV2VolumeFeeCircuit{
		StartBlkNum:   sdk.ConstUint248(120665850),
		EndBlkNum:     sdk.ConstUint248(120665850),
		Account:       sdk.ConstUint248(account.Bytes()),
		Contracts:     contracts,
		ContractsHash: sdk.ConstBytes32(contractHash),
	}

	log.Infof("contractsHash 0x%x", contractHash)

	circuitInput, err := app.BuildCircuitInput(appCircuitAssignment)
	assert.NoError(t, err)

	out := circuitInput.GetAbiPackedOutput()

	test.IsSolved(t, DefaultOPV2VolumeFeeCircuit(), appCircuitAssignment, circuitInput)

	test.ProverSucceeded(t, DefaultOPV2VolumeFeeCircuit(), appCircuitAssignment, circuitInput)

	assert.Equal(t, fmt.Sprintf("0x%x", out), "0x5ad2e3c62a7774a58c4b3b5dd17c78446c86c8d200000000000000000000000000000000000000000000001378c38494960019000000000000000000000000000000000000000000000bb86ded4243327d2900000000073136fa00000000073136fa")
}
