package circuit

import (
	"github.com/brevis-network/brevis-sdk/sdk"
)

type VolumeFeePerTradeCircuit struct {
	ealiestReceiptIndexHints    [MaxClaimableBlocksPerCircuit - 1]int // Indicate index of earlist receipt which should be counted for not-first claimable trade
	claimBlockReceiptFirstIndex [MaxClaimableBlocksPerCircuit]int
	claimBlockReceiptLastIndex  [MaxClaimableBlocksPerCircuit]int
	ClaimBlockNums              [MaxClaimableBlocksPerCircuit]sdk.Uint248
	AccountId                   sdk.Uint248
}

var _ sdk.AppCircuit = &VolumeFeePerTradeCircuit{}

func (c *VolumeFeePerTradeCircuit) Allocate() (maxReceipts, maxStorage, maxTransactions int) {
	return 256, 0, 0
}

func DefaultVolumeFeePerTradeCircuit() *VolumeFeePerTradeCircuit {
	return &VolumeFeePerTradeCircuit{
		ClaimBlockNums: [MaxClaimableBlocksPerCircuit]sdk.Uint248{sdk.ConstUint248(0)},
		AccountId:      sdk.ConstUint248(0),
	}
}

func (c *VolumeFeePerTradeCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
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

	// receipt[hint].blockNumber >= c.ClaimBlockNums[i+1] - 43200 * 30
	// receipt[hint-1].blockNumber <  c.ClaimBlockNums[i+1] - 43200 * 30
	for i, hint := range c.ealiestReceiptIndexHints {
		claimBlockNum := c.ClaimBlockNums[i+1]
		targetStartBlkNum := uint248.Sub(claimBlockNum, sdk.ConstUint248(43200*30))
		// Previous receipt block number must be less than ClaimBlockNum[i+1] - 43200 * 30

		previousIndex := hint - 1
		if previousIndex < 0 {
			previousIndex = 0
		}
		previousReceipt := sdk.GetUnderlying(r, previousIndex)
		uint248.AssertIsEqual(sdk.ConstUint248(1), uint248.IsLessThan(previousReceipt.BlockNum, targetStartBlkNum))

		receipt := sdk.GetUnderlying(r, hint)
		// Current receipt block number must not be less than ClaimBlockNum[i+1] - 43200 * 30
		uint248.AssertIsEqual(sdk.ConstUint248(1), uint248.Select(uint248.IsEqual(sdk.ConstUint248(0), claimBlockNum), sdk.ConstUint248(1),
			uint248.Or(uint248.IsGreaterThan(receipt.BlockNum, targetStartBlkNum), uint248.IsEqual(receipt.BlockNum, targetStartBlkNum))))
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

	var volumeBetweens [MaxClaimableBlocksPerCircuit - 1]sdk.Uint248

	for i, hint := range c.ealiestReceiptIndexHints {
		endIndex := hint
		if endIndex < 0 {
			endIndex = 0
		}
		var startIndex int
		if i == 0 {
			startIndex = 0
		} else {
			startIndex = c.ealiestReceiptIndexHints[i-1]
		}
		receipts := sdk.RangeUnderlying(r, startIndex, endIndex)
		volumeBetweens[i] = sdk.Sum(sdk.Map(receipts, volumeMap))
	}

	overlappingReceipts := sdk.RangeUnderlying(r, c.ealiestReceiptIndexHints[len(c.ealiestReceiptIndexHints)-1], c.claimBlockReceiptFirstIndex[0])
	lastBlockNumOneMonthAgo := uint248.Sub(lastBlockNum, sdk.ConstUint248(43200*30))
	sdk.AssertEach(overlappingReceipts, func(r sdk.Receipt) sdk.Uint248 {
		return uint248.And(
			uint248.IsLessThan(r.BlockNum, c.ClaimBlockNums[0]),                        // r.BlockNum < c.ClaimBlockNums[0]
			uint248.IsZero(uint248.IsGreaterThan(lastBlockNumOneMonthAgo, r.BlockNum)), // lastBlockNumOneMonthAgo <= r.BlockNumber
		)
	})

	previousTotalVolume := sdk.Sum(sdk.Map(overlappingReceipts, volumeMap))
	feeRebate := sdk.ConstUint248(0)

	for _, value := range volumeBetweens {
		previousTotalVolume = uint248.Add(previousTotalVolume, value)
	}

	for i, blockNumber := range c.ClaimBlockNums {

		currentReceipts := sdk.RangeUnderlying(r, c.claimBlockReceiptFirstIndex[i], c.claimBlockReceiptLastIndex[i]+1)

		sdk.AssertEach(currentReceipts, func(r sdk.Receipt) sdk.Uint248 {
			return uint248.Select(uint248.IsEqual(blockNumber, sdk.ConstUint248(0)), sdk.ConstUint248(1), uint248.IsEqual(blockNumber, r.BlockNum))
		})

		if c.claimBlockReceiptFirstIndex[i] > 0 {
			previousReceipt := sdk.GetUnderlying(r, c.claimBlockReceiptFirstIndex[i]-1)
			uint248.AssertIsEqual(
				sdk.ConstUint248(1),
				uint248.Select(
					uint248.IsEqual(blockNumber, sdk.ConstUint248(0)),
					sdk.ConstUint248(1),
					uint248.IsLessThan(previousReceipt.BlockNum, blockNumber)))
		}

		currentVolume := sdk.Sum(sdk.Map(currentReceipts, volumeMap))
		currentFee := sdk.Sum(sdk.Map(currentReceipts, feeMap))
		previousTotalVolume = uint248.Add(previousTotalVolume, currentVolume)
		if i > 0 {
			previousTotalVolume = uint248.Sub(previousTotalVolume, volumeBetweens[i-1])
		}
		feeRebate = uint248.Add(feeRebate, selectFeeBasedOnTier(api, currentFee, previousTotalVolume))
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
