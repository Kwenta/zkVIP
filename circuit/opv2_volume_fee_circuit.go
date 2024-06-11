package circuit

import (
	"fmt"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/celer-network/goutils/log"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

type OPV2VolumeFeeCircuit struct {
	Account       sdk.Uint248 // User's address
	StartBlkNum   sdk.Uint248 // First claimable execution transaction block number
	EndBlkNum     sdk.Uint248 // Last claimable execution transaction block number
	Contracts     [512]sdk.Uint248
	ContractsHash sdk.Bytes32
}

// Use AA' to calculate volume and fee for trade T.
// A is OrderFeeFlow transaction receipt and A' is Execution transaction receipt
// Since last 30 days will be counted and only last day is available to reimburse fee,
// use one receipt to calculate volume to decrease circuit constraints
const (
	OrderFlowFeeImposedEvent                = "0x213209073252965f156ceca72c65727bfcf77e3f25ca2a1f23a1b9db58295d48"
	OrderFlowFeeImposedEventContractAddress = "0x6B32d15a6Cb77ea227A6Fb19532b2de542c45AC6"
	DelayedOrderSubmittedEvent              = "0x9deb3648ccf8efc44205985ac6ead4ffb30791fea9ce7f9437ae398b31cf9d5a"

	PositionModifiedEvent        = "0xc0d933baa356386a245ade48f9a9c59db4612af2b5b9c17de5b451c628760f43"
	MaxReceipts                  = 256
	MaxClaimableTradesPerCircuit = 20
)

var OrderFlowFeeImposedEventID = sdk.ParseEventID(hexutil.MustDecode(OrderFlowFeeImposedEvent))
var OrderFlowFeeImposedEventContract = sdk.ConstUint248(OrderFlowFeeImposedEventContractAddress)
var DelayedOrderSubmittedEventID = sdk.ParseEventID(hexutil.MustDecode(DelayedOrderSubmittedEvent))
var PositionModifiedEventID = sdk.ParseEventID(hexutil.MustDecode(PositionModifiedEvent))

func DefaultOPV2VolumeFeeCircuit() *OPV2VolumeFeeCircuit {
	return &OPV2VolumeFeeCircuit{
		Account:     sdk.ConstUint248(0),
		StartBlkNum: sdk.ConstUint248(0),
		EndBlkNum:   sdk.ConstUint248(0),
	}
}

var _ sdk.AppCircuit = &OPV2VolumeFeeCircuit{}

func (c *OPV2VolumeFeeCircuit) Allocate() (maxReceipts, maxStorage, maxTransactions int) {
	return MaxReceipts, 0, 0
}

func (c *OPV2VolumeFeeCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
	uint248 := api.Uint248
	uint248.AssertIsLessOrEqual(c.StartBlkNum, c.EndBlkNum)
	receipts := sdk.NewDataStream(api, in.Receipts)

	// Avoid duplicate receipts input
	api.AssertInputsAreUnique()

	// Make sure receipts' block number is in ascending order
	// OrderFeeFlow transaction must happen before Execution transaction
	// And there will be no new trade if current trade doesn't finish
	sdk.AssertSorted(receipts, func(a, b sdk.Receipt) sdk.Uint248 {
		return uint248.Or(uint248.IsLessThan(a.BlockNum, b.BlockNum), uint248.IsEqual(a.BlockNum, b.BlockNum))
	})

	// Make sure start block number greater than 43200*30. 2s per block
	uint248.AssertIsLessOrEqual(sdk.ConstUint248(43200*30), c.StartBlkNum)

	startBlk30DAgo := uint248.Sub(c.StartBlkNum, sdk.ConstUint248(43200*30))
	unclaimableTrades := sdk.RangeUnderlying(receipts, 0, MaxReceipts-MaxClaimableTradesPerCircuit*2)

	// For those unclaimable trades, circuit cares about account, trade size and last price
	sdk.AssertEach(unclaimableTrades, func(r sdk.Receipt) sdk.Uint248 {
		assertionPassed := uint248.And(
			uint248.IsEqual(r.Fields[0].EventID, PositionModifiedEventID),
			c.checkContractInclusion(api, r.Fields[0].Contract),
			uint248.IsEqual(r.Fields[0].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(r.Fields[0].Index, sdk.ConstUint248(2)),
			api.Bytes32.IsEqual(r.Fields[0].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(r.Fields[1].EventID, PositionModifiedEventID),
			uint248.IsEqual(r.Fields[1].Contract, r.Fields[0].Contract),
			uint248.IsZero(r.Fields[1].IsTopic),
			uint248.IsEqual(r.Fields[1].Index, sdk.ConstUint248(2)), // amount index
			uint248.IsEqual(r.Fields[2].EventID, PositionModifiedEventID),
			uint248.IsEqual(r.Fields[2].Contract, r.Fields[0].Contract),
			uint248.IsZero(r.Fields[2].IsTopic),
			uint248.IsEqual(r.Fields[2].Index, sdk.ConstUint248(3)),
			uint248.IsZero(uint248.IsLessThan(r.BlockNum, startBlk30DAgo)), // r.BlockNum >= startBlkOneMonthAgo
			uint248.IsLessThan(r.BlockNum, c.StartBlkNum),                  // r.BlockNum < c.StartBlkNum
		)
		return assertionPassed
	})

	volumeMap := func(r sdk.Receipt) sdk.Uint248 {
		tradeSize := api.ToUint248(api.Int248.ABS(api.ToInt248(r.Fields[1].Value)))
		lastPrice := api.ToUint248(r.Fields[2].Value)
		volume, _ := uint248.Div(uint248.Mul(lastPrice, tradeSize), sdk.ConstUint248(1000000000000000000))

		return api.ToUint248(volume)
	}

	volume := sdk.Sum(sdk.Map(unclaimableTrades, volumeMap))

	claimableReceipts := sdk.RangeUnderlying(receipts, MaxReceipts-MaxClaimableTradesPerCircuit*2, MaxReceipts)

	if MaxReceipts%2 != 0 {
		return fmt.Errorf("invalid max receipts %d", MaxReceipts)
	}

	claimableTrades := sdk.WindowUnderlying(claimableReceipts, 2)
	sdk.AssertEach(claimableTrades, func(rs sdk.List[sdk.Receipt]) sdk.Uint248 {
		orderFlowFeeReceipt := rs[0]
		orderFlowFeeReceiptPassed := uint248.And(
			uint248.IsEqual(orderFlowFeeReceipt.Fields[0].EventID, OrderFlowFeeImposedEventID),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[0].Contract, OrderFlowFeeImposedEventContract),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[0].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[0].Index, sdk.ConstUint248(1)),
			api.Bytes32.IsEqual(orderFlowFeeReceipt.Fields[0].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(orderFlowFeeReceipt.Fields[1].EventID, OrderFlowFeeImposedEventID),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[1].Contract, OrderFlowFeeImposedEventContract),
			uint248.IsZero(orderFlowFeeReceipt.Fields[1].IsTopic),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[1].Index, sdk.ConstUint248(0)), // amount index
			uint248.IsEqual(orderFlowFeeReceipt.Fields[2].EventID, DelayedOrderSubmittedEventID),
			c.checkContractInclusion(api, orderFlowFeeReceipt.Fields[2].Contract),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[2].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[2].Index, sdk.ConstUint248(1)),
			api.Bytes32.IsEqual(orderFlowFeeReceipt.Fields[2].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(orderFlowFeeReceipt.Fields[3].EventID, DelayedOrderSubmittedEventID),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[3].Contract, orderFlowFeeReceipt.Fields[2].Contract),
			uint248.IsZero(orderFlowFeeReceipt.Fields[3].IsTopic),
			uint248.IsEqual(orderFlowFeeReceipt.Fields[3].Index, sdk.ConstUint248(6)), // keeperDeposit index
		)

		executionReceipt := rs[1]
		executionReceiptPassed := uint248.And(
			uint248.IsEqual(executionReceipt.Fields[0].EventID, PositionModifiedEventID),
			c.checkContractInclusion(api, executionReceipt.Fields[0].Contract),
			uint248.IsEqual(executionReceipt.Fields[0].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(executionReceipt.Fields[0].Index, sdk.ConstUint248(2)),
			api.Bytes32.IsEqual(executionReceipt.Fields[0].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(executionReceipt.Fields[1].EventID, PositionModifiedEventID),
			uint248.IsEqual(executionReceipt.Fields[1].Contract, executionReceipt.Fields[0].Contract),
			uint248.IsZero(executionReceipt.Fields[1].IsTopic),
			uint248.IsEqual(executionReceipt.Fields[1].Index, sdk.ConstUint248(2)), // tradeSize index
			uint248.IsEqual(executionReceipt.Fields[2].EventID, PositionModifiedEventID),
			uint248.IsEqual(executionReceipt.Fields[2].Contract, executionReceipt.Fields[0].Contract),
			uint248.IsZero(executionReceipt.Fields[2].IsTopic),
			uint248.IsEqual(executionReceipt.Fields[2].Index, sdk.ConstUint248(3)), // lastPrice index
			uint248.IsEqual(executionReceipt.Fields[3].EventID, PositionModifiedEventID),
			uint248.IsEqual(executionReceipt.Fields[3].Contract, executionReceipt.Fields[0].Contract),
			uint248.IsZero(executionReceipt.Fields[3].IsTopic),
			uint248.IsEqual(executionReceipt.Fields[3].Index, sdk.ConstUint248(5)), // fee index
		)

		executionReceiptBlockNumber := uint248.Select(uint248.IsZero(executionReceipt.BlockNum), c.StartBlkNum, executionReceipt.BlockNum)
		uint248.AssertIsLessOrEqual(c.StartBlkNum, executionReceiptBlockNumber)
		uint248.AssertIsLessOrEqual(executionReceiptBlockNumber, c.EndBlkNum)
		uint248.AssertIsLessOrEqual(orderFlowFeeReceipt.BlockNum, executionReceiptBlockNumber)

		return uint248.And(
			orderFlowFeeReceiptPassed,
			executionReceiptPassed,
		)
	})

	claimableTradesVolumeMap := sdk.Map(claimableTrades, func(rs sdk.List[sdk.Receipt]) sdk.Uint248 {
		executionReceipt := rs[1]
		tradeSize := api.ToUint248(api.Int248.ABS(api.ToInt248(executionReceipt.Fields[1].Value))) // tradeSize in PositionModified Event

		lastPrice := api.ToUint248(executionReceipt.Fields[2].Value) // lastPrice in PositionModified Event
		volume, _ := uint248.Div(uint248.Mul(lastPrice, tradeSize), sdk.ConstUint248(1000000000000000000))

		return api.ToUint248(volume)
	})
	volume = uint248.Add(volume, sdk.Sum(claimableTradesVolumeMap))

	feeMap := sdk.Map(claimableTrades, func(rs sdk.List[sdk.Receipt]) sdk.Uint248 {
		orderFeeFlowReceipt := rs[0]
		executionReceipt := rs[1]
		amount := api.ToUint248(orderFeeFlowReceipt.Fields[1].Value)        // amount in OrderFlowFeeImposed Event
		keeperDeposit := api.ToUint248(orderFeeFlowReceipt.Fields[3].Value) // keeperDeposit in DelayedOrderSubmitted Event
		fee := api.ToUint248(executionReceipt.Fields[3].Value)              // fee in PositionModified Event

		return uint248.Add(amount, keeperDeposit, fee)
	})

	fee := sdk.Sum(feeMap)

	hash, err := api.NewMiMC() // mimc.NewMiMC()
	if err != nil {
		return err
	}
	for _, contract := range c.Contracts {
		hash.Write(contract.Val)
	}

	contractsHash := hash.Sum()
	log.Info("contractsHash: ", contractsHash)
	// contractsHash.
	// sdk.Bytes32.FromValues(contractsHash)

	// api.Bytes32.AssertIsEqual(sdk.Uint248{Val: contractsHash}, c.ContractsHash)

	api.OutputAddress(c.Account)
	api.OutputUint(248, fee)
	api.OutputUint(248, volume)
	api.OutputUint(64, c.StartBlkNum)
	api.OutputUint(64, c.EndBlkNum)
	api.OutputBytes32(c.ContractsHash)
	return nil
}

func (c *OPV2VolumeFeeCircuit) checkContractInclusion(api *sdk.CircuitAPI, contract sdk.Uint248) sdk.Uint248 {
	contractFound := sdk.ConstUint248(0)
	for _, inputContract := range c.Contracts {
		contractFound = api.Uint248.Or(contractFound, api.Uint248.IsEqual(inputContract, contract))
	}
	return contractFound
}
