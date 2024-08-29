// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract FeeModule {
    function getFeeRebatePercentage(uint248 volume30D) external pure returns (uint64) {
        if (volume30D > 1_000_000_000 * 1 ether) {
            return 30;
        } else if (volume30D > 100_000_000 * 1 ether) {
            return 20;
        } else if (volume30D > 10_000_000 * 1 ether) {
            return 10;
        } else if (volume30D > 1_000_000 * 1 ether) {
            return 5;
        }
        return 0;
    }
}
