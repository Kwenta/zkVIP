// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { Test, console } from "forge-std/Test.sol";
import { FeeReimbursementClaim } from "../contracts/ClaimRebate.sol";
import { FeeReimbursementApp } from "../contracts/FeeReimbursementApp.sol";
import { MockERC20 } from "./mocks/MockERC20.sol";
import { MockFactory } from "./mocks/MockFactory.sol";
import {AggregatorV2V3Interface} from
    "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV2V3Interface.sol";

contract FeeReimbursementClaimTest is Test {
    FeeReimbursementClaim public feeReimbursementClaim;
    FeeReimbursementApp public mockFeeReimbursementApp;
    MockERC20 public mockRewardToken;
    MockFactory public mockFactory;
    
    AggregatorV2V3Interface public opDataFeed;
    AggregatorV2V3Interface public opSequencerUptimeFeed;

    address public owner = address(0x123);
    address public user1 = address(0x234);
    address public account = address(0x456);
    address public smartMarginAccount = address(0x789);

    uint256 constant TEST_VALUE = 1 ether;
    
    function setUp() public {
        mockFeeReimbursementApp = new FeeReimbursementApp(address(0x345));
        mockFactory = new MockFactory();
        mockRewardToken = new MockERC20();
        opDataFeed = AggregatorV2V3Interface(0x0D276FC14719f9292D5C1eA2198673d1f4269246);
        opSequencerUptimeFeed = AggregatorV2V3Interface(0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389);
        
        // Deploy the contract
        vm.prank(owner);
        feeReimbursementClaim = new FeeReimbursementClaim(
            address(mockFeeReimbursementApp),
            address(mockFactory),
            address(mockRewardToken),
            address(opDataFeed)
        );

        // Set up initial conditions
        mockFactory.setAccountOwner(smartMarginAccount, account);
        mockRewardToken.mint(address(feeReimbursementClaim), TEST_VALUE);
    }

    function testUpdateBlacklist() public {
        vm.prank(owner);
        feeReimbursementClaim.updateBlacklist(account, true);

        // Check if the account is blacklisted
        assertTrue(feeReimbursementClaim.blacklist(account));
    }

    function test_Only_Owner_Can_Call_recoverERC20() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        feeReimbursementClaim.recoverERC20(address(mockRewardToken), 0);
    }

    function test_Can_Recover_ERC20_Token() public {
        assertEq(mockRewardToken.balanceOf(address(feeReimbursementClaim)), TEST_VALUE);

        vm.prank(owner);
        feeReimbursementClaim.recoverERC20(address(mockRewardToken), TEST_VALUE);

        // check balances
        assertEq(mockRewardToken.balanceOf(address(feeReimbursementClaim)), 0);
        assertEq(mockRewardToken.balanceOf(address(owner)), TEST_VALUE);
    }
}
