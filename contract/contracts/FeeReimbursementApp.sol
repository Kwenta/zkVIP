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

contract FeeReimbursementApp is BrevisApp, Ownable {
    using SafeERC20 for IERC20;

    address public rewardToken;
    uint24 public rewardTokenDecimals;
    IAccountModule public accountModule;
    bytes32 public vkHash;
    event FeeReimbursed(address indexed user, uint128 accountId, uint24 tradeYearMonth, uint248 feeRebate);

    constructor(address _brevisProof) BrevisApp(IBrevisProof(_brevisProof)) {}

    // BrevisQuery contract will call our callback once Brevis backend submits the proof.
    function handleProofResult(
        bytes32 /*_requestId*/,
        bytes32 /*_vkHash*/,
        bytes calldata _circuitOutput
    ) internal override {
        // We need to check if the verifying key that Brevis used to verify the proof generated by our circuit is indeed
        // our designated verifying key. This proves that the _circuitOutput is authentic
        // require(vkHash == _vkHash, "invalid vk");

        (uint24 yearMonth, uint128 accountId, uint248 volume, uint248 fee) = decodeOutput(_circuitOutput);
        uint248 feeRebate;
        if (volume > 100000000 * 1e18) {
            feeRebate = fee * 90 / 100;
        } else if (volume > 10000000 * 1e18) {
            feeRebate = fee * 75 / 100;
        } else if (volume > 1000000 * 1e18) {
            feeRebate = fee * 50 / 100;
        } else if (volume > 100000 * 1e18) {
            feeRebate = fee * 20 / 100;
        }

        address user;
        if (feeRebate > 0) {
            user = accountModule.getAccountOwner(accountId);
            if (user != address(0)) {
                uint256 feeInRewardToken = feeRebate * (1 ** rewardTokenDecimals) / 1e18;
                IERC20(rewardToken).safeTransfer(user, feeInRewardToken);
            }
        }
        emit FeeReimbursed(user, accountId, yearMonth, feeRebate);
    }

    function decodeOutput(bytes calldata o) internal pure returns (uint24 yearMonth, uint128 accountId, uint248 volume, uint248 fee) {
        yearMonth = uint24(bytes3(o[16:19]));
        accountId = uint128(bytes16(o[19:35]));
        volume = uint248(bytes31(o[35:66]));
        fee = uint248(bytes31(o[66:97]));
    }

    function setVkHash(bytes32 _vkHash) external onlyOwner {
        vkHash = _vkHash;
    }

    function setRewardToken(address _rewardToken, uint24 _decimals) external onlyOwner {
        rewardToken = _rewardToken;
        rewardTokenDecimals = _decimals;
    }

    function setAccountModule(IAccountModule _accountModule) external onlyOwner {
        accountModule = _accountModule;
    }
}
