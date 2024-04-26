package circuit

import (
	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/celer-network/goutils/log"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

type TraderVolumeCircuit struct {
	StartBlkNum   sdk.Uint248
	EndBlkNum     sdk.Uint248
	TraderAddress sdk.Uint248
}

const (
	OrderSettledEventId = "0x460080a757ec90719fe90ab2384c0196cdeed071a9fd7ce1ada43481d96b7db5"
	ContractAddress     = "0x0A2AF931eFFd34b81ebcc57E3d3c9B1E1dE1C9Ce"
)

var EventIdOrderSettled = sdk.ParseEventID(hexutil.MustDecode(OrderSettledEventId)) //Order settled event
var ContractValue = sdk.ConstUint248(ContractAddress)

func DefaultTraderVolumeCircuit() *TraderVolumeCircuit {
	return &TraderVolumeCircuit{
		StartBlkNum:   sdk.ConstUint248(0),
		EndBlkNum:     sdk.ConstUint248(1),
		TraderAddress: sdk.ConstUint248(0),
	}
}

var _ sdk.AppCircuit = &TraderVolumeCircuit{}

func (c *TraderVolumeCircuit) Allocate() (maxReceipts, maxStorage, maxTransactions int) {
	// Our app is only ever going to use one storage data at a time so
	// we can simply limit the max number of data for storage to 1 and
	// 0 for all others
	return 1000, 0, 0
}

func (c *TraderVolumeCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
	uint248 := api.Uint248
	uint521 := api.Uint521
	uint248.AssertIsEqual(uint248.IsLessThan(c.StartBlkNum, c.EndBlkNum), sdk.ConstUint248(1))

	receipts := sdk.NewDataStream(api, in.Receipts)

	completeReceipts := sdk.WindowUnderlying(receipts, 2)

	sdk.AssertEach(completeReceipts, func(list sdk.List[sdk.Receipt]) sdk.Uint248 {
		// Then first receipt contains accountId, fillPrize, sizeDelta
		// Second receipt contains accountId, fee,
		passed := sdk.ConstUint248(1)
		first := list[0]
		second := list[1]
		passed = api.Uint248.And(passed,
			api.Uint248.IsEqual(first.Fields[0].EventID, second.Fields[0].EventID),
			api.Uint248.IsEqual(first.Fields[0].Contract, second.Fields[0].Contract),
			api.Uint248.IsEqual(first.Fields[0].IsTopic, second.Fields[0].IsTopic),
			api.Uint248.IsEqual(first.Fields[0].Index, second.Fields[0].Index),
			api.Bytes32.IsEqual(first.Fields[0].Value, second.Fields[0].Value),
			api.Uint248.IsEqual(first.BlockNum, second.BlockNum),

			// Account Id
			api.Uint248.IsEqual(first.Fields[0].EventID, EventIdOrderSettled),
			api.Uint248.IsEqual(first.Fields[0].Contract, ContractValue),
			api.Uint248.IsEqual(first.Fields[0].IsTopic, sdk.ConstUint248(1)),
			api.Uint248.IsEqual(first.Fields[0].Index, sdk.ConstUint248(2)),

			// fillPrize
			api.Uint248.IsEqual(first.Fields[1].EventID, EventIdOrderSettled),
			api.Uint248.IsEqual(first.Fields[1].Contract, ContractValue),
			api.Uint248.IsZero(first.Fields[1].IsTopic),
			api.Uint248.IsEqual(first.Fields[1].Index, sdk.ConstUint248(0)),

			// sizeDelta
			api.Uint248.IsEqual(first.Fields[2].EventID, EventIdOrderSettled),
			api.Uint248.IsEqual(first.Fields[2].Contract, ContractValue),
			api.Uint248.IsZero(first.Fields[2].IsTopic),
			api.Uint248.IsEqual(first.Fields[2].Index, sdk.ConstUint248(3)),

			// fee
			api.Uint248.IsEqual(second.Fields[1].EventID, EventIdOrderSettled),
			api.Uint248.IsEqual(second.Fields[1].Contract, ContractValue),
			api.Uint248.IsZero(second.Fields[1].IsTopic),
			api.Uint248.IsEqual(second.Fields[1].Index, sdk.ConstUint248(5)),
			api.Uint248.IsZero(api.Uint248.IsLessThan(first.BlockNum, c.StartBlkNum)),  // BlockNum >= c.StartBlkNum
			api.Uint248.IsZero(api.Uint248.IsGreaterThan(first.BlockNum, c.EndBlkNum)), // BlockNum <= c.EndBlkNum
		)

		return passed
	})

	api.AssertInputsAreUnique()

	receiptVolumes := sdk.Map(completeReceipts, func(current sdk.List[sdk.Receipt]) sdk.Uint248 {
		r := current[0]
		fillPrice := api.ToUint521(r.Fields[1].Value)
		absSizeDelta := api.ToUint521(api.Int248.ABS(api.ToInt248(r.Fields[2].Value)))
		volume, _ := uint521.Div(uint521.Mul(fillPrice, absSizeDelta), sdk.ConstUint521(1000000000000000000))
		return api.ToUint248(volume)
	})

	volume := sdk.Sum(receiptVolumes)

	receiptFees := sdk.Map(completeReceipts, func(current sdk.List[sdk.Receipt]) sdk.Uint248 {
		r := current[1]
		return api.ToUint248(r.Fields[1].Value)
	})

	fee := sdk.Sum(receiptFees)

	log.Infof("trader volume %s, fee: %s", volume.String(), fee.String())

	api.OutputUint(64, c.StartBlkNum)
	api.OutputUint(64, c.EndBlkNum)
	api.OutputAddress(c.TraderAddress)
	api.OutputUint(248, volume)
	api.OutputUint(248, fee)
	return nil
}
