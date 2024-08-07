// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {FeeReimbursementClaim} from "../contracts/FeeReimbursementClaim.sol";
import {FeeReimbursementApp} from "../contracts/FeeReimbursementApp.sol";
import {IAccount} from "../contracts/interfaces/IAccount.sol";
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
    address public mockAddressBis = address(0x567);

    uint256 constant TEST_VALUE = 100 ether;

    /// @dev Mocked values for testing
    /// FEE_REBATE is set so that rewards are exactly 1 OP token
    int256 constant MOCK_OP_PRICE = 131_000_000;
    uint248 constant FEE_REBATE = 131e16;

    event FeeRebateClaimed(address indexed account, int256 price);
    event Recovered(address token, uint256 amount);

    function setUp() public {
        mockFeeReimbursementApp = new FeeReimbursementApp(address(0x345));
        mockFactory = new MockFactory();
        mockRewardToken = new MockERC20();
        opDataFeed = AggregatorV2V3Interface(mockAddress);
        opSequencerUptimeFeed = AggregatorV2V3Interface(mockAddressBis);

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
        mockFactory.createAccount(smartMarginAccount);
        mockFactory.setAccountOwner(smartMarginAccount, account);
        mockRewardToken.mint(address(feeReimbursementClaim), TEST_VALUE);
        mockFeeReimbursementApp.setClaimContract(address(feeReimbursementClaim));

        // Mock the current block timestamp to something else than 1 (So that we can mock the sequencer uptime feed response)
        vm.warp(1_641_070_800);

        // Mock the `IAccount` interface so `isAuth()` returns `true`
        address mockAccount = address(IAccount(smartMarginAccount));

        vm.mockCall(
            mockAccount,
            abi.encodeWithSignature("isAuth()"),
            abi.encode(true) // Mocked return value
        );

        // Mock chainlink data feed responses
        vm.mockCall(
            address(opSequencerUptimeFeed),
            abi.encodeWithSignature("latestRoundData()"),
            abi.encode(0, 0, block.timestamp - 3601, block.timestamp, 0)
        );

        vm.mockCall(
            address(opDataFeed),
            abi.encodeWithSignature("latestRoundData()"),
            abi.encode(0, MOCK_OP_PRICE, 0, 0, 0)
        );
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

    function test_claim() public {
        assertEq(mockRewardToken.balanceOf(account), 0);
        assertEq(mockRewardToken.balanceOf(address(feeReimbursementClaim)), TEST_VALUE);

        // Mock accumulated fee value
        vm.mockCall(
            address(mockFeeReimbursementApp),
            abi.encodeWithSignature("accountAccumulatedFee(address)"),
            abi.encode(FEE_REBATE)
        );

        vm.prank(account);

        // Check emitted event
        vm.expectEmit(true, true, true, true);
        emit FeeRebateClaimed(account, MOCK_OP_PRICE);

        feeReimbursementClaim.claim(smartMarginAccount);

        vm.clearMockedCalls();

        // Assert Rewards have been transferred
        assertEq(mockRewardToken.balanceOf(account), 1 ether);
        assertEq(mockRewardToken.balanceOf(address(feeReimbursementClaim)), TEST_VALUE - 1 ether);
        assertEq(mockFeeReimbursementApp.accountAccumulatedFee(smartMarginAccount), 0);
    }

    function test_claim_invalid_account() public {
        // Mock address is not a smart margin account
        vm.mockCall(
            address(mockFactory), abi.encodeWithSignature("accounts(address)"), abi.encode(false)
        );

        vm.expectRevert(FeeReimbursementClaim.InvalidAccount.selector);
        vm.prank(account);
        feeReimbursementClaim.claim(smartMarginAccount);
    }

    function test_claim_no_fee_rebate_available() public {
        // Mock no fee rebate
        vm.mockCall(
            address(mockFeeReimbursementApp),
            abi.encodeWithSignature("accountAccumulatedFee(address)"),
            abi.encode(0)
        );

        vm.expectRevert(FeeReimbursementClaim.NoFeeRebateAvailable.selector);
        vm.prank(owner);
        feeReimbursementClaim.claim(smartMarginAccount);
    }
}
