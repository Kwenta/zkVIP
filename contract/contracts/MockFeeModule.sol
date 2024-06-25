pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockFeeModule is Ownable {
    function getFeeRebatePercentage(uint248 volume30D) external pure returns (uint64) {
        uint248 _volume = volume30D / 1000000000000000000;
        if (_volume > 1000000000) {
            return 30;
        } else  if (_volume > 100000000) {
            return 20;
        } else  if (_volume > 10000000) {
            return 10;
        }  else  if (_volume > 1000000) {
            return 5;
        } 
        return 0;
    }
}