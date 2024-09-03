// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/// @notice interface for factory for creating smart margin accounts
/// @dev For the full interface refer to https://github.com/Kwenta/smart-margin/blob/main/src/interfaces/IFactory.sol
interface IFactory {
    /// @param _account: address of account
    /// @return owner of account
    function getAccountOwner(address _account) external view returns (address);

    /// @param _account: address of account
    /// @return whether or not account exists
    function accounts(address _account) external view returns (bool);
}
