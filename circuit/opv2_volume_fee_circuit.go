package circuit

import (
	"fmt"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

type OPV2VolumeFeeCircuit struct {
	Account       sdk.Uint248 // User's address
	StartBlkNum   sdk.Uint248 // First claimable execution transaction block number
	EndBlkNum     sdk.Uint248 // Last claimable execution transaction block number
	Contracts     [512]sdk.Uint248
	ContractsHash sdk.Bytes32
}

// Receipts Location
// From 0 ===> MaxReceipts - MaxClaimableTradesPerCircuit*2:
// Unclaimable execution tx receipts. Calculate volume info
// From MaxReceipts - MaxClaimableTradesPerCircuit*2 ===> MaxReceipts - MaxClaimableTradesPerCircuit:
// OrderFeeFlow tx receipts. Sum amount and keeperDeposit
// From MaxReceipts - MaxClaimableTradesPerCircuit ===> MaxReceipts:
// Claimable execution tx receipts. Calculate volume info and sum fee
// To support batch trades in one tx,
// add tx receipts multiple times with different event log info

const (
	OrderFlowFeeImposedEvent                = "0x213209073252965f156ceca72c65727bfcf77e3f25ca2a1f23a1b9db58295d48"
	OrderFlowFeeImposedEventContractAddress = "0x6B32d15a6Cb77ea227A6Fb19532b2de542c45AC6"
	DelayedOrderSubmittedEvent              = "0x9deb3648ccf8efc44205985ac6ead4ffb30791fea9ce7f9437ae398b31cf9d5a"
	PositionModifiedEvent                   = "0xc0d933baa356386a245ade48f9a9c59db4612af2b5b9c17de5b451c628760f43"
	MaxReceipts                             = 256
	MaxClaimableTradesPerCircuit            = 20
)

var OrderFlowFeeImposedEventID = sdk.ParseEventID(hexutil.MustDecode(OrderFlowFeeImposedEvent))
var OrderFlowFeeImposedEventContract = sdk.ConstUint248(OrderFlowFeeImposedEventContractAddress)
var DelayedOrderSubmittedEventID = sdk.ParseEventID(hexutil.MustDecode(DelayedOrderSubmittedEvent))
var PositionModifiedEventID = sdk.ParseEventID(hexutil.MustDecode(PositionModifiedEvent))

func DefaultOPV2VolumeFeeCircuit() *OPV2VolumeFeeCircuit {
	return &OPV2VolumeFeeCircuit{}
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

	// Make sure start block number greater than 43200*30. 2s per block
	uint248.AssertIsLessOrEqual(sdk.ConstUint248(43200*30), c.StartBlkNum)

	startBlk30DAgo := uint248.Sub(c.StartBlkNum, sdk.ConstUint248(43200*30))
	unclaimableExecutionReceipts := sdk.RangeUnderlying(receipts, 0, MaxReceipts-MaxClaimableTradesPerCircuit*2)

	// For those unclaimable execution transaction, circuit cares about account, trade size and last price
	sdk.AssertEach(unclaimableExecutionReceipts, func(r sdk.Receipt) sdk.Uint248 {
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

	volume := sdk.Sum(sdk.Map(unclaimableExecutionReceipts, volumeMap))

	if MaxReceipts%2 != 0 {
		return fmt.Errorf("invalid max receipts %d", MaxReceipts)
	}

	claimableOrderFeeFlowReceipts := sdk.RangeUnderlying(receipts, MaxReceipts-MaxClaimableTradesPerCircuit*2, MaxReceipts-MaxClaimableTradesPerCircuit)

	sdk.AssertEach(claimableOrderFeeFlowReceipts, func(r sdk.Receipt) sdk.Uint248 {
		return uint248.And(
			uint248.IsEqual(r.Fields[0].EventID, OrderFlowFeeImposedEventID),
			uint248.IsEqual(r.Fields[0].Contract, OrderFlowFeeImposedEventContract),
			uint248.IsEqual(r.Fields[0].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(r.Fields[0].Index, sdk.ConstUint248(1)),
			api.Bytes32.IsEqual(r.Fields[0].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(r.Fields[1].EventID, OrderFlowFeeImposedEventID),
			uint248.IsEqual(r.Fields[1].Contract, OrderFlowFeeImposedEventContract),
			uint248.IsZero(r.Fields[1].IsTopic),
			uint248.IsEqual(r.Fields[1].Index, sdk.ConstUint248(0)), // amount index
			uint248.IsEqual(r.Fields[2].EventID, DelayedOrderSubmittedEventID),
			c.checkContractInclusion(api, r.Fields[2].Contract),
			uint248.IsEqual(r.Fields[2].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(r.Fields[2].Index, sdk.ConstUint248(1)),
			api.Bytes32.IsEqual(r.Fields[2].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(r.Fields[3].EventID, DelayedOrderSubmittedEventID),
			uint248.IsEqual(r.Fields[3].Contract, r.Fields[2].Contract),
			uint248.IsZero(r.Fields[3].IsTopic),
			uint248.IsEqual(r.Fields[3].Index, sdk.ConstUint248(6)), // keeperDeposit index
		)
	})

	feeMap := sdk.Map(claimableOrderFeeFlowReceipts, func(r sdk.Receipt) sdk.Uint248 {
		amount := api.ToUint248(r.Fields[1].Value)        // amount in OrderFlowFeeImposed Event
		keeperDeposit := api.ToUint248(r.Fields[3].Value) // keeperDeposit in DelayedOrderSubmitted Event
		return uint248.Add(amount, keeperDeposit)
	})

	fee := sdk.Sum(feeMap)

	// Make sure non-claimable execution txs' block numbers are in ascending order
	nonClaimableExecutionTxReceipts := sdk.RangeUnderlying(receipts, 0, MaxReceipts-MaxClaimableTradesPerCircuit)
	sdk.AssertSorted(nonClaimableExecutionTxReceipts, func(a, b sdk.Receipt) sdk.Uint248 {
		return uint248.Or(uint248.IsLessThan(a.BlockNum, b.BlockNum), uint248.IsEqual(a.BlockNum, b.BlockNum))
	})

	claimableExecutionReceipts := sdk.RangeUnderlying(receipts, MaxReceipts-MaxClaimableTradesPerCircuit, MaxReceipts)
	// Makse sure claimable execution tx's block numbers are in ascending order
	sdk.AssertSorted(claimableExecutionReceipts, func(a, b sdk.Receipt) sdk.Uint248 {
		return uint248.Or(uint248.IsLessThan(a.BlockNum, b.BlockNum), uint248.IsEqual(a.BlockNum, b.BlockNum))
	})
	sdk.AssertEach(claimableExecutionReceipts, func(r sdk.Receipt) sdk.Uint248 {
		blockNumber := uint248.Select(uint248.IsZero(r.BlockNum), c.StartBlkNum, r.BlockNum)
		uint248.AssertIsLessOrEqual(c.StartBlkNum, blockNumber)
		uint248.AssertIsLessOrEqual(blockNumber, c.EndBlkNum)

		return uint248.And(
			uint248.IsEqual(r.Fields[0].EventID, PositionModifiedEventID),
			c.checkContractInclusion(api, r.Fields[0].Contract),
			uint248.IsEqual(r.Fields[0].IsTopic, sdk.ConstUint248(1)),
			uint248.IsEqual(r.Fields[0].Index, sdk.ConstUint248(2)),
			api.Bytes32.IsEqual(r.Fields[0].Value, api.ToBytes32(c.Account)), // account check
			uint248.IsEqual(r.Fields[1].EventID, PositionModifiedEventID),
			uint248.IsEqual(r.Fields[1].Contract, r.Fields[0].Contract),
			uint248.IsZero(r.Fields[1].IsTopic),
			uint248.IsEqual(r.Fields[1].Index, sdk.ConstUint248(2)), // tradeSize index
			uint248.IsEqual(r.Fields[2].EventID, PositionModifiedEventID),
			uint248.IsEqual(r.Fields[2].Contract, r.Fields[0].Contract),
			uint248.IsZero(r.Fields[2].IsTopic),
			uint248.IsEqual(r.Fields[2].Index, sdk.ConstUint248(3)), // lastPrice index
			uint248.IsEqual(r.Fields[3].EventID, PositionModifiedEventID),
			uint248.IsEqual(r.Fields[3].Contract, r.Fields[0].Contract),
			uint248.IsZero(r.Fields[3].IsTopic),
			uint248.IsEqual(r.Fields[3].Index, sdk.ConstUint248(5)), // fee index
		)
	})

	volume = uint248.Add(volume, sdk.Sum(sdk.Map(claimableExecutionReceipts, volumeMap)))

	executionTxFeeMap := sdk.Map(claimableExecutionReceipts, func(r sdk.Receipt) sdk.Uint248 {
		return api.ToUint248(r.Fields[3].Value) // fee
	})
	fee = uint248.Add(fee, sdk.Sum(executionTxFeeMap))

	hash, err := api.NewMiMC() // mimc.NewMiMC()
	if err != nil {
		return err
	}
	for _, contract := range c.Contracts {
		hash.Write(contract.Val)
	}

	contractsHash := hash.Sum()

	api.Bytes32.AssertIsEqual(api.Bytes32.FromFV(contractsHash), c.ContractsHash)

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
