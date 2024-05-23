package circuit

import (
	"github.com/brevis-network/brevis-sdk/sdk"
)

const MaxClaimableBlocksPerCircuit = 2

type VolumeFeeCircuit struct {
	ClaimBlockNumHints [MaxClaimableBlocksPerCircuit - 1]int
	ClaimBlockNums     [MaxClaimableBlocksPerCircuit]sdk.Uint248
	AccountId          sdk.Uint248
}

var _ sdk.AppCircuit = &VolumeFeeCircuit{}

func (c *VolumeFeeCircuit) Allocate() (maxReceipts, maxStorage, maxTransactions int) {
	return 256, 0, 0
}

func DefaultVolumeFeeCircuit() *VolumeFeeCircuit {
	return &VolumeFeeCircuit{
		ClaimBlockNums: [MaxClaimableBlocksPerCircuit]sdk.Uint248{sdk.ConstUint248(0)},
		AccountId:      sdk.ConstUint248(0),
	}
}

func (c *VolumeFeeCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
	uint248 := api.Uint248
	r := sdk.NewDataStream(api, in.Receipts)

	blockInAsc := sdk.ConstUint248(1)
	lastBlockNum := sdk.ConstUint248(0)
	for i, blockNumber := range c.ClaimBlockNums {
		if i > 0 {
			isLessThan := uint248.Select(uint248.IsLessThan(sdk.ConstUint248(0), blockNumber), uint248.IsLessThan(c.ClaimBlockNums[i-1], blockNumber), sdk.ConstUint248(1))
			blockInAsc = uint248.And(blockInAsc, isLessThan)
			lastBlockNum = uint248.Select(uint248.IsLessThan(sdk.ConstUint248(0), blockNumber), blockNumber, lastBlockNum)
		} else {
			lastBlockNum = c.ClaimBlockNums[0]
		}
	}
	api.Uint248.AssertIsEqual(blockInAsc, sdk.ConstUint248(1))

	// 43200 blocks per day
	firstBlockNum := uint248.Select(uint248.IsLessThan(c.ClaimBlockNums[0], sdk.ConstUint248(43200*30)), sdk.ConstUint248(0), uint248.Sub(c.ClaimBlockNums[0], sdk.ConstUint248(43200*30)))
	sdk.AssertEach(r, func(r sdk.Receipt) sdk.Uint248 {
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
			uint248.IsZero(uint248.IsLessThan(r.BlockNum, firstBlockNum)), // r.BlockNum >= firstBlockNum
		)
		return assertionPassed
	})

	sdk.AssertSorted(r, func(a, b sdk.Receipt) sdk.Uint248 {
		return uint248.Or(uint248.IsLessThan(a.BlockNum, b.BlockNum), uint248.IsEqual(a.BlockNum, b.BlockNum))
	})

	for i, hint := range c.ClaimBlockNumHints {
		claimBlockNum := c.ClaimBlockNums[i+1]
		receipt := sdk.GetUnderlying(r, hint)
		uint248.AssertIsEqual(sdk.ConstUint248(1), uint248.Select(uint248.IsEqual(sdk.ConstUint248(0), claimBlockNum), sdk.ConstUint248(1), uint248.IsLessThan(receipt.BlockNum, claimBlockNum)))
	}

	api.AssertInputsAreUnique()

	volumeMap := func(r sdk.Receipt) sdk.Uint248 {
		fillPrice := api.ToUint248(r.Fields[1].Value)
		absSizeDelta := api.ToUint248(api.Int248.ABS(api.ToInt248(r.Fields[2].Value)))
		volume, _ := uint248.Div(uint248.Mul(fillPrice, absSizeDelta), sdk.ConstUint248(1000000000000000000))
		return api.ToUint248(volume)
	}

	feeMap := func(r sdk.Receipt) sdk.Uint248 {
		return api.ToUint248(r.Fields[3].Value)
	}

	feeRebate := sdk.ConstUint248(0)
	previousTotalVolume := sdk.ConstUint248(0)
	previousStartBlockNumber := sdk.ConstUint248(0)

	// toBe

	for i, blockNumber := range c.ClaimBlockNums {
		if i == 0 {
			filterReceipts := sdk.Filter(r, func(r sdk.Receipt) sdk.Uint248 {
				return uint248.And(
					uint248.IsLessThan(r.BlockNum, blockNumber),                      // r.BlockNum < blockNumber
					uint248.IsZero(uint248.IsGreaterThan(firstBlockNum, r.BlockNum)), //  r.BlockNum >= firstBlockNum
				)
			})
			previousVolumesMap := sdk.Map(filterReceipts, volumeMap)
			previousTotalVolume = sdk.Sum(previousVolumesMap)
			currentReceipt := sdk.Filter(r, func(r sdk.Receipt) sdk.Uint248 {
				return uint248.IsEqual(r.BlockNum, blockNumber)
			})
			currentVolumeMap := sdk.Map(currentReceipt, volumeMap)
			currentBlockVolume := sdk.Sum(currentVolumeMap)
			uint248.AssertIsEqual(sdk.ConstUint248(1), uint248.IsLessThan(sdk.ConstUint248(0), currentBlockVolume))
			previousTotalVolume = uint248.Add(previousTotalVolume, currentBlockVolume)
			currentFeeMap := sdk.Map(currentReceipt, feeMap)
			fee := sdk.Sum(currentFeeMap)
			feeRebate = uint248.Add(feeRebate, selectFeeBasedOnTier(api, fee, previousTotalVolume))
			previousStartBlockNumber = firstBlockNum
		} else {
			currentStartBlockNumber := uint248.Sub(blockNumber, sdk.ConstUint248(43200*30))
			toBeRemovedReceipts := sdk.Filter(r, func(r sdk.Receipt) sdk.Uint248 {
				return uint248.And(
					uint248.IsLessThan(r.BlockNum, currentStartBlockNumber),                     // r.BlockNum < currentStartBlockNumber
					uint248.IsZero(uint248.IsGreaterThan(previousStartBlockNumber, r.BlockNum)), //  r.BlockNum >= previousStartBlockNumber
				)
			})
			toBeRemovedReceiptsVolumeMap := sdk.Map(toBeRemovedReceipts, volumeMap)
			previousTotalVolume = uint248.Sub(previousTotalVolume, sdk.Sum(toBeRemovedReceiptsVolumeMap))

			currentReceipt := sdk.Filter(r, func(r sdk.Receipt) sdk.Uint248 {
				return uint248.IsEqual(r.BlockNum, blockNumber)
			})
			currentVolumeMap := sdk.Map(currentReceipt, volumeMap)
			currentBlockVolume := sdk.Sum(currentVolumeMap)
			/// If blockNumber is 0, then currentBlockVolume and fee must be 0
			validCurrentVolume := uint248.Select(uint248.IsEqual(sdk.ConstUint248(0), blockNumber), sdk.ConstUint248(1), uint248.IsLessThan(sdk.ConstUint248(0), currentBlockVolume))

			uint248.AssertIsEqual(sdk.ConstUint248(1), validCurrentVolume)
			previousTotalVolume = uint248.Add(previousTotalVolume, currentBlockVolume)
			currentFeeMap := sdk.Map(currentReceipt, feeMap)
			fee := sdk.Sum(currentFeeMap)
			feeRebate = uint248.Add(feeRebate, selectFeeBasedOnTier(api, fee, previousTotalVolume))
			previousStartBlockNumber = currentStartBlockNumber
		}
	}

	api.OutputUint(128, c.AccountId)
	api.OutputUint(248, feeRebate)
	api.OutputUint(64, c.ClaimBlockNums[0])
	api.OutputUint(64, c.ClaimBlockNums[len(c.ClaimBlockNums)-1])

	return nil
}

func selectFeeBasedOnTier(api *sdk.CircuitAPI, fee sdk.Uint248, volume sdk.Uint248) sdk.Uint248 {
	uint248 := api.Uint248
	tier0Fee, _ := uint248.Div(fee, sdk.ConstUint248(10))
	tier1Fee, _ := uint248.Div(uint248.Mul(fee, sdk.ConstUint248(4)), sdk.ConstUint248(10))
	tier2Fee, _ := uint248.Div(uint248.Mul(fee, sdk.ConstUint248(3)), sdk.ConstUint248(4))
	tier3Fee, _ := uint248.Div(uint248.Mul(fee, sdk.ConstUint248(9)), sdk.ConstUint248(10))
	selected1Fee := uint248.Select(uint248.IsGreaterThan(volume, sdk.ConstUint248("1000000000000000000000000")), tier1Fee, tier0Fee)
	selected2Fee := uint248.Select(uint248.IsGreaterThan(volume, sdk.ConstUint248("10000000000000000000000000")), tier2Fee, selected1Fee)
	selected3Fee := uint248.Select(uint248.IsGreaterThan(volume, sdk.ConstUint248("100000000000000000000000000")), tier3Fee, selected2Fee)
	return selected3Fee
}
