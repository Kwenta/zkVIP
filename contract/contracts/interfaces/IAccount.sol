// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IAccount {
    /// @notice Returns the owner of the account.
    /// @return The address of the account owner.
    function owner() external view returns (address);

    /// @notice Checks if an address is a delegate.
    /// @param delegate The address to check.
    /// @return True if the address is a delegate, false otherwise.
    function delegates(address delegate) external view returns (bool);
}
