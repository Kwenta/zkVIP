// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {FeeReimbursementClaim} from "../contracts/FeeReimbursementClaim.sol";
import {FeeReimbursementApp} from "../contracts/FeeReimbursementApp.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockFactory} from "./mocks/MockFactory.sol";
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
    address public mockAddress = address(0x345);

    uint256 constant TEST_VALUE = 1 ether;

    function setUp() public {
        mockFeeReimbursementApp = new FeeReimbursementApp(address(0x345));
        mockFactory = new MockFactory();
        mockRewardToken = new MockERC20();
        opDataFeed = AggregatorV2V3Interface(mockAddress);
        opSequencerUptimeFeed = AggregatorV2V3Interface(mockAddress);

        // Deploy the contract
        vm.prank(owner);
        feeReimbursementClaim = new FeeReimbursementClaim(
            address(mockFeeReimbursementApp),
            address(mockFactory),
            address(mockRewardToken),
            address(opDataFeed),
            address(opSequencerUptimeFeed)
        );

        // Set up initial conditions
        mockFactory.setAccountOwner(smartMarginAccount, account);
        mockRewardToken.mint(address(feeReimbursementClaim), TEST_VALUE);
    }

    function test_Only_Owner_Can_Call_recoverERC20(address caller) public {
        vm.startPrank(caller);

        if (caller == owner) {
            feeReimbursementClaim.recoverERC20(address(mockRewardToken), 0);
        } else {
            vm.expectRevert("Ownable: caller is not the owner");
            feeReimbursementClaim.recoverERC20(address(mockRewardToken), 0);
        }

        vm.stopPrank();
    }

    function test_Can_RecoverERC20_Token() public {
        assertEq(mockRewardToken.balanceOf(address(feeReimbursementClaim)), TEST_VALUE);
        assertEq(mockRewardToken.balanceOf(address(owner)), 0);

        vm.prank(owner);
        feeReimbursementClaim.recoverERC20(address(mockRewardToken), TEST_VALUE);

        // check balances
        assertEq(mockRewardToken.balanceOf(address(feeReimbursementClaim)), 0);
        assertEq(mockRewardToken.balanceOf(address(owner)), TEST_VALUE);
    }
}
