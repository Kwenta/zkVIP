package circuit

import (
	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/celer-network/goutils/log"
)

type VolumeFeeCircuit struct {
	StartBlkNum sdk.Uint248
	EndBlkNum   sdk.Uint248
	AccountId   sdk.Uint248
}

func DefaultVolumeFeeCircuit() *VolumeFeeCircuit {
	return &VolumeFeeCircuit{
		StartBlkNum: sdk.ConstUint248(0),
		EndBlkNum:   sdk.ConstUint248(1),
		AccountId:   sdk.ConstUint248(0),
	}
}

var _ sdk.AppCircuit = &VolumeFeeCircuit{}

func (c *VolumeFeeCircuit) Allocate() (maxReceipts, maxStorage, maxTransactions int) {
	return 256, 0, 0
}

func (c *VolumeFeeCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
	uint248 := api.Uint248
	uint521 := api.Uint521
	uint248.AssertIsLessOrEqual(c.StartBlkNum, c.EndBlkNum)
	receipts := sdk.NewDataStream(api, in.Receipts)

	uint248.AssertIsEqual(uint248.IsLessThan(sdk.ConstUint248(43200*30), c.StartBlkNum), sdk.ConstUint248(1))
	startBlk30DAgo := uint248.Sub(c.StartBlkNum, sdk.ConstUint248(43200*30))
	sdk.AssertEach(receipts, func(r sdk.Receipt) sdk.Uint248 {
		assertionPassed := uint248.And(
			uint248.IsEqual(r.Fields[0].EventID, EventIdOrderSettled),
			uint248.IsEqual(r.Fields[0].Contract, ContractValue),
			uint248.IsEqual(r.Fields[0].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(r.Fields[0].Index, sdk.ConstUint248(2)),
			api.Bytes32.IsEqual(r.Fields[0].Value, api.ToBytes32(c.AccountId)),
			uint248.IsEqual(r.Fields[1].EventID, EventIdOrderSettled),
			uint248.IsEqual(r.Fields[1].Contract, ContractValue),
			uint248.IsZero(r.Fields[1].IsTopic),
			uint248.IsEqual(r.Fields[1].Index, sdk.ConstUint248(0)),
			uint248.IsEqual(r.Fields[2].EventID, EventIdOrderSettled),
			uint248.IsEqual(r.Fields[2].Contract, ContractValue),
			uint248.IsZero(r.Fields[2].IsTopic),
			uint248.IsEqual(r.Fields[2].Index, sdk.ConstUint248(3)),
			uint248.IsEqual(r.Fields[3].EventID, EventIdOrderSettled),
			uint248.IsEqual(r.Fields[3].Contract, ContractValue),
			uint248.IsZero(r.Fields[3].IsTopic),
			uint248.IsEqual(r.Fields[3].Index, sdk.ConstUint248(5)),
			uint248.IsZero(uint248.IsLessThan(r.BlockNum, startBlk30DAgo)), // r.BlockNum >= startBlkOneMonthAgo
			uint248.IsZero(uint248.IsGreaterThan(r.BlockNum, c.EndBlkNum)), // r.BlockNum <= c.EndBlkNum
		)
		return assertionPassed
	})

	api.AssertInputsAreUnique()

	receiptVolumes := sdk.Map(receipts, func(r sdk.Receipt) sdk.Uint248 {
		fillPrice := api.ToUint521(r.Fields[1].Value)
		absSizeDelta := api.ToUint521(api.Int248.ABS(api.ToInt248(r.Fields[2].Value)))
		volume, _ := uint521.Div(uint521.Mul(fillPrice, absSizeDelta), sdk.ConstUint521(1000000000000000000))
		return api.ToUint248(volume)
	})
	volume := sdk.Sum(receiptVolumes)

	claimableBlocks := sdk.Filter(receipts, func(r sdk.Receipt) sdk.Uint248 {
		return uint248.And(
			uint248.IsZero(uint248.IsGreaterThan(r.BlockNum, c.EndBlkNum)),   // r.BlockNum <= c.ClaimBlockNums[0]
			uint248.IsZero(uint248.IsGreaterThan(c.StartBlkNum, r.BlockNum)), // startBlk30DAgo <= r.BlockNumber
		)
	})
	receiptFees := sdk.Map(claimableBlocks, func(r sdk.Receipt) sdk.Uint248 {
		return api.ToUint248(r.Fields[3].Value)
	})
	fee := sdk.Sum(receiptFees)

	log.Infof("trader volume %s, fee: %s", volume.String(), fee.String())

	api.OutputUint(128, c.AccountId)
	api.OutputUint(248, fee)
	api.OutputUint(248, volume)
	api.OutputUint(64, c.StartBlkNum)
	api.OutputUint(64, c.EndBlkNum)
	return nil
}
