// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IAccount {
    /// @return true if the caller is the owner or a delegate
    function isAuth() external view returns (bool);
}
