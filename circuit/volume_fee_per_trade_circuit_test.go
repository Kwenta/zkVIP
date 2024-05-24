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

func TestNewVolumeFeeCircuit(t *testing.T) {
	app, err := sdk.NewBrevisApp()
	assert.NoError(t, err)

	userAddress := common.Hex2Bytes("0x0000000000000000000000000000000080000000000000000000000000000312")

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
					Value:      common.Hex2Hash("0x0000000000000000000000000000000000000000000000001fb2eda8bc65aa81"),
				},
			},
		},
	)

	var claimBlockNums [MaxClaimableBlocksPerCircuit]sdk.Uint248

	for i := range claimBlockNums {
		claimBlockNums[i] = sdk.ConstUint248(0)
	}

	claimBlockNums[0] = sdk.ConstUint248(13622452)

	appCircuit := &VolumeFeePerTradeCircuit{
		// ealiestReceiptIndexHints:    [MaxClaimableBlocksPerCircuit - 1]int{0},
		claimBlockReceiptFirstIndex: [MaxClaimableBlocksPerCircuit]int{1},
		claimBlockReceiptLastIndex:  [MaxClaimableBlocksPerCircuit]int{1},
		ClaimBlockNums:              claimBlockNums,
		AccountId:                   sdk.ConstUint248(new(big.Int).SetBytes(userAddress)),
	}
	appCircuitAssignment := &VolumeFeePerTradeCircuit{
		// ealiestReceiptIndexHints:    [MaxClaimableBlocksPerCircuit - 1]int{0},
		claimBlockReceiptFirstIndex: [MaxClaimableBlocksPerCircuit]int{1},
		claimBlockReceiptLastIndex:  [MaxClaimableBlocksPerCircuit]int{1},
		ClaimBlockNums:              claimBlockNums,
		AccountId:                   sdk.ConstUint248(new(big.Int).SetBytes(userAddress)),
	}

	circuitInput, err := app.BuildCircuitInput(appCircuit)
	assert.NoError(t, err)

	out := circuitInput.GetAbiPackedOutput()

	test.IsSolved(t, appCircuit, appCircuitAssignment, circuitInput)

	assert.Equal(t, fmt.Sprintf("0x%x", out), "0x0134d7ad0134d7ad800000000000000000000000000003120000000000000000000000000000000000000000000059818987718978997900000000000000000000000000000000000000000000001fb2eda8bc65aa810000000000cfcce00000000000cfdcb4")
}
