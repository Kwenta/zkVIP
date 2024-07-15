pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TestFeeModule is Ownable {
    function getFeeRebatePercentage(uint248 volume30D) external pure returns (uint64) {
        uint248 _volume = volume30D / 1000000000000000000;
        if (_volume > 10000) {
            return 30;
        } else  if (_volume > 100) {
            return 20;
        } else  if (_volume > 10) {
            return 10;
        }  else  if (_volume > 1) {
            return 5;
        } 
        return 0;
    }
}