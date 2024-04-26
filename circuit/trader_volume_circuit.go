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
	return 340, 170, 0
}

func (c *TraderVolumeCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
	uint248 := api.Uint248
	uint521 := api.Uint521
	uint248.AssertIsEqual(uint248.IsLessThan(c.StartBlkNum, c.EndBlkNum), sdk.ConstUint248(1))

	receipts := sdk.NewDataStream(api, in.Receipts)

	// completeReceipts := sdk.WindowUnderlying(receipts, 2)

	// sdk.AssertEach(completeReceipts, func(cur sdk.List[sdk.Receipt]) sdk.Uint248 {
	// 	txAreEqual := sdk.ConstUint248(1)
	// 	blockNum := cur[0].BlockNum
	// 	for _, s := range cur {
	// 		txAreEqual = uint248.IsEqual()
	// 	}

	// })

	// storages := sdk.NewDataStream(api, in.StorageSlots)

	// valueCheck := sdk.ZipMap2(
	// 	completeReceipts,
	// 	storages,
	// 	func(receipts sdk.List[sdk.Receipt], storageList sdk.List[sdk.StorageSlot]) sdk.Uint248 {
	// 		return sdk.ConstUint248(0)
	// 	},
	// )

	// // Add assertions that every check has passed
	// sdk.AssertEach(valueCheck, func(current sdk.Uint248) sdk.Uint248 {
	// 	return uint248.IsEqual(current, sdk.ConstUint248(1))
	// })

	sdk.AssertEach(receipts, func(l sdk.Receipt) sdk.Uint248 {
		assertionPassed := uint248.And(
			uint248.IsEqual(l.Fields[0].EventID, EventIdOrderSettled),
			uint248.IsEqual(l.Fields[0].Contract, ContractValue),
			uint248.IsZero(l.Fields[0].IsTopic),
			uint248.IsEqual(l.Fields[0].Index, sdk.ConstUint248(0)),
			uint248.IsEqual(l.Fields[1].EventID, EventIdOrderSettled),
			uint248.IsEqual(l.Fields[1].Contract, ContractValue),
			uint248.IsZero(l.Fields[1].IsTopic),
			uint248.IsEqual(l.Fields[1].Index, sdk.ConstUint248(3)),
			uint248.IsEqual(l.Fields[2].EventID, EventIdOrderSettled),
			uint248.IsEqual(l.Fields[2].Contract, ContractValue),
			uint248.IsZero(l.Fields[2].IsTopic),
			uint248.IsEqual(l.Fields[2].Index, sdk.ConstUint248(5)),
			uint248.IsZero(uint248.IsLessThan(l.BlockNum, c.StartBlkNum)),  // l.BlockNum >= c.StartBlkNum
			uint248.IsZero(uint248.IsGreaterThan(l.BlockNum, c.EndBlkNum)), // l.BlockNum <= c.EndBlkNum
		)
		return assertionPassed
	})

	api.AssertInputsAreUnique()

	volume := sdk.Reduce(receipts, sdk.ConstUint248(0), func(accum sdk.Uint248, r sdk.Receipt) sdk.Uint248 {
		fillPrice := api.ToUint521(r.Fields[0].Value)
		absSizeDelta := api.ToUint521(api.Int248.ABS(api.ToInt248(r.Fields[1].Value)))
		volume, _ := uint521.Div(uint521.Mul(fillPrice, absSizeDelta), sdk.ConstUint521(1000000000000000000))
		return api.ToUint248(volume)
	})

	fee := sdk.Reduce(receipts, sdk.ConstUint248(0), func(accum sdk.Uint248, r sdk.Receipt) sdk.Uint248 {
		return uint248.Add(accum, api.ToUint248(r.Fields[2].Value))
	})

	log.Infof("trader volume %s, fee: %s", volume.String(), fee.String())

	api.OutputUint(64, c.StartBlkNum)
	api.OutputUint(64, c.EndBlkNum)
	api.OutputAddress(c.TraderAddress)
	api.OutputUint(248, volume)
	api.OutputUint(248, fee)
	return nil
}
