pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TestFeeModule is Ownable {
    function getFeeRebatePercentage(uint248 volume30D) external pure returns (uint64) {
        if (volume30D > 1000 * 1 ether) {
            return 30;
        } else if (volume30D > 100 * 1 ether) {
            return 20;
        } else if (volume30D > 10 * 1 ether) {
            return 10;
        } else if (volume30D > 1 * 1 ether) {
            return 5;
        }
        return 0;
    }
}
