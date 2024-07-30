// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IFeeReimbursementApp {
    function accountAccumulatedFee(address account) external view returns (uint248);
    function claim(address account) external;
}
