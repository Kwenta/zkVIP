// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IFactory} from "../../contracts/interfaces/IFactory.sol";

contract MockFactory is IFactory {
    // Mapping to store account owners
    mapping(address => address) private _accountOwners;

    // Function to set the account owner for a specific address
    function setAccountOwner(address _account, address _owner) external {
        _accountOwners[_account] = _owner;
    }

    // Function to get the account owner for a specific address
    function getAccountOwner(address _account) external view override returns (address) {
        return _accountOwners[_account];
    }
}
