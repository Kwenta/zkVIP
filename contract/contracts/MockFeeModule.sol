pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockFeeModule is Ownable {
    function getFeeRebatePercentage(uint248 volume30D) external pure returns (uint64) {
        if (volume30D > 30000) {
            return 2;
        }
        return 1;
    }
}