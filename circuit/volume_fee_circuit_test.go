package circuit

import (
	"fmt"
	"math/big"
	"testing"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/brevis-network/brevis-sdk/test"
	"github.com/brevis-network/kwenta/common"
	"github.com/stretchr/testify/assert"
)

func TestVolumeFeeCircuit(t *testing.T) {
	app, err := sdk.NewBrevisApp()
	assert.NoError(t, err)

	accountId := common.Hex2Bytes("0x0000000000000000000000000000000080000000000000000000000000000312")

	app.AddReceipt(
		sdk.ReceiptData{
			BlockNum: big.NewInt(13622452 - 43200*30),
			TxHash:   common.Hex2Hash("0x34b6d7be702aeb2eebbae9f48487ac29cd605dc174225cdb52dd35c11bbfdfb0"),
			Fields: [sdk.NumMaxLogFields]sdk.LogFieldData{
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    true,
					FieldIndex: 2,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000080000000000000000000000000000312"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 0,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000a984d9ce18f8b9bdd2"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 3,
					Value:      common.Hex2Hash("0xfffffffffffffffffffffffffffffffffffffffffffffffff8ac2acc26980000"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 5,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000001fb2eda8bc65aa81"),
				},
			},
		},
	)

	app.AddReceipt(
		sdk.ReceiptData{
			BlockNum: big.NewInt(13622452),
			TxHash:   common.Hex2Hash("0x34b6d7be702aeb2eebbae9f48487ac29cd605dc174225cdb52dd35c11bbfdfb0"),
			Fields: [sdk.NumMaxLogFields]sdk.LogFieldData{
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    true,
					FieldIndex: 2,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000080000000000000000000000000000312"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 0,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000a984d9ce18f8b9bdd2"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 3,
					Value:      common.Hex2Hash("0xfffffffffffffffffffffffffffffffffffffffffffffffff8ac2acc26980000"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 5,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000001fb2eda8bc65aa81"),
				},
			},
		},
		MaxReceipts-MaxClaimableBlocksPerCircuit,
	)

	app.AddReceipt(
		sdk.ReceiptData{
			BlockNum: big.NewInt(13622453),
			TxHash:   common.Hex2Hash("0x34b6d7be702aeb2eebbae9f48487ac29cd605dc174225cdb52dd35c11bbfdfb0"),
			Fields: [sdk.NumMaxLogFields]sdk.LogFieldData{
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    true,
					FieldIndex: 2,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000080000000000000000000000000000312"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 0,
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000a984d9ce18f8b9bdd2"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 3,
					Value:      common.Hex2Hash("0xfffffffffffffffffffffffffffffffffffffffffffffffff8ac2acc26980000"),
				},
				{
					Contract:   common.Hex2Addr(ContractAddress),
					LogIndex:   10,
					EventID:    common.Hex2Hash(OrderSettledEventId),
					IsTopic:    false,
					FieldIndex: 5,
					Value:      common.Hex2Hash("0x8000000000000000000000000000031200000000000000000000000000000000000000000000003f65db5178cb5502000000000000000000000000000000000000000000010c849c96549c69cc6b0000000000cfdcb40000000000cfdcb5"),
				},
			},
		},
		MaxReceipts-MaxClaimableBlocksPerCircuit+1,
	)

	var claimBlockNums [MaxClaimableBlocksPerCircuit]sdk.Uint248

	for i := range claimBlockNums {
		claimBlockNums[i] = sdk.ConstUint248(0)
	}

	claimBlockNums[0] = sdk.ConstUint248(13622452)

	appCircuitAssignment := &VolumeFeeCircuit{
		StartBlkNum: sdk.ConstUint248(13622452),
		EndBlkNum:   sdk.ConstUint248(13622453),
		AccountId:   sdk.ConstUint248(new(big.Int).SetBytes(accountId)),
	}

	circuitInput, err := app.BuildCircuitInput(appCircuitAssignment)
	assert.NoError(t, err)

	out := circuitInput.GetAbiPackedOutput()

	test.IsSolved(t, DefaultVolumeFeeCircuit(), appCircuitAssignment, circuitInput)

	test.ProverSucceeded(t, DefaultVolumeFeeCircuit(), appCircuitAssignment, circuitInput)

	assert.Equal(t, fmt.Sprintf("0x%x", out), "0x800000000000000000000000000003120000000000010c849c96549c69cc6b0000000000cfdcb41fb2eda8bd358736000000000000000000000000000000000000000000010c849c96549c69cc6b0000000000cfdcb40000000000cfdcb5")
}
