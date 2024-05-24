// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "brevis-contracts/contracts/sdk/apps/framework/BrevisApp.sol";
import "brevis-contracts/contracts/sdk/interface/IBrevisProof.sol";

interface IAccountModule {
    function getAccountOwner(uint128 accountId) external view returns (address);
}

interface IFeeRebateTierModule {
    function getFeeRebatePercentage(uint248 volume30D) external view returns (uint64);
}

struct ClaimPeriod {
    uint64 startBlockNumber;
    uint64 endBlockNumber;     
}

error InvalidNewClaimPeriod();

contract FeeReimbursementApp is BrevisApp, Ownable {
    using SafeERC20 for IERC20;

    address public rewardToken;
    uint24 public rewardTokenDecimals;
    IAccountModule public accountModule;
    IFeeRebateTierModule public feeRebateTierModule;
    address public claimer;
    mapping(bytes32 => uint16) public vkHashesToCircuitSize; // batch tier vk hashes => tier batch size
    mapping(uint128 => ClaimPeriod) public accountIdClaimPeriod;
    mapping(uint128 => uint248) public accountIdAccumulatedFee;
    event FeeRebateAccumulated(uint128 accountId, uint248 feeRebate, uint248 volume30D, uint248 feeRebateWithRate,  uint64 startBlockNumber,uint64 endBlockNumber);
    event VkHashesUpdated(bytes32[] vkHashes, uint16[] sizes);
    event FeeReimbursed(uint128 accountId, uint248 feeRebate);
    
    constructor(address _brevisProof) BrevisApp(IBrevisProof(_brevisProof)) {}

    // BrevisQuery contract will call our callback once Brevis backend submits the proof.
    function handleProofResult(
        bytes32 /*_requestId*/,
        bytes32 _vkHash,
        bytes calldata _circuitOutput
    ) internal override {
        // We need to check if the verifying key that Brevis used to verify the proof generated by our circuit is indeed
        // our designated verifying keys. This proves that the _circuitOutput is authentic
        uint16 circuitSize = vkHashesToCircuitSize[_vkHash];
        require(circuitSize > 0, "vkHash not valid");

        (uint128 accountId, uint248 feeRebate, uint248 volume30D, uint64 startBlockNumber, uint64 endBlockNumber) = decodeOutput(_circuitOutput);
        uint64 percentage;
        uint248 feeRebateWithRate = feeRebate;
        if (feeRebate > 0) {
            percentage = feeRebateTierModule.getFeeRebatePercentage(volume30D);
            if (percentage != 0) {
                feeRebateWithRate = feeRebate * percentage; 
            }
        }
       
        ClaimPeriod memory claimPeriod = _newClaimPeriod(startBlockNumber, endBlockNumber, accountId);
        accountIdClaimPeriod[accountId] = claimPeriod;
        uint248 accumulatedFee = accountIdAccumulatedFee[accountId];
        accountIdAccumulatedFee[accountId] = accumulatedFee + feeRebateWithRate;        
        emit FeeRebateAccumulated(accountId, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber);
    }

    function decodeOutput(bytes calldata o) internal pure returns (uint128 accountId, uint248 feeRebate, uint248 volume30D, uint64 startBlockNumber,uint64 endBlockNumber) {
        accountId = uint128(bytes16(o[0:16]));
        feeRebate = uint248(bytes31(o[16:47]));
        volume30D = uint248(bytes31(o[47:78]));
        startBlockNumber = uint64(bytes8(o[78:86]));
        endBlockNumber = uint64(bytes8(o[86:94]));
    }

    function _newClaimPeriod(uint64 startBlockNumber, uint64 endBlockNumber, uint128 accountId) internal view returns (ClaimPeriod memory) {
        ClaimPeriod memory claimPeriod = accountIdClaimPeriod[accountId];
        // No claim record at all
        if (claimPeriod.startBlockNumber == 0 && claimPeriod.endBlockNumber == 0) {
            claimPeriod.startBlockNumber = startBlockNumber;
            claimPeriod.endBlockNumber = endBlockNumber;
            return claimPeriod;
        }
        // startB --> endB ---> claimed.startB ---> claimed.endB
        if (endBlockNumber < claimPeriod.startBlockNumber) {
            claimPeriod.startBlockNumber = startBlockNumber;
            return claimPeriod;
        }

        // claimed.startB ---> claimed.endB ---> startB --> endB
        if (startBlockNumber > claimPeriod.endBlockNumber) {
            claimPeriod.endBlockNumber = endBlockNumber;
        }
    
        revert InvalidNewClaimPeriod();
    }

    function setVkHashes(bytes32[] calldata _vkHashes, uint16[] calldata _sizes) public onlyOwner {
        require(_vkHashes.length == _sizes.length, "length not match");
        for (uint256 i = 0; i < _vkHashes.length; i++) {
            vkHashesToCircuitSize[_vkHashes[i]] = _sizes[i];
        }

        emit VkHashesUpdated(_vkHashes, _sizes);
    }

    function setRewardToken(address _rewardToken, uint24 _decimals) external onlyOwner {
        rewardToken = _rewardToken;
        rewardTokenDecimals = _decimals;
    }

    function setAccountModule(IAccountModule _accountModule) external onlyOwner {
        accountModule = _accountModule;
    }

    function setFeeRebateTierModule(IFeeRebateTierModule _feeRebateTierModule) external onlyOwner {
        feeRebateTierModule = _feeRebateTierModule;
    }

    function setClaimer(address _claimer) external onlyOwner {
        claimer = _claimer;
    }

    function claim(uint128 accountId) public {
        require(msg.sender == claimer, "invalid claimer address");
        uint248 feeRebate = accountIdAccumulatedFee[accountId];
      
        accountIdAccumulatedFee[accountId] = 0;
        emit FeeReimbursed(accountId, feeRebate);
    }
}
