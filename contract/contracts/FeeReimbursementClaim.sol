// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AggregatorV2V3Interface} from
    "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV2V3Interface.sol";
import {IFeeReimbursementApp} from "./interfaces/IFeeReimbursementApp.sol";
import {IFactory} from "./interfaces/IFactory.sol";
import {IAccount} from "./interfaces/IAccount.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Fee Reimbursement Claim Contract for zkVIP Program
/// @author Flocqst (florian@kwenta.io)
contract FeeReimbursementClaim is Ownable {
    using SafeERC20 for IERC20;
    /*///////////////////////////////////////////////////////////////
                        IMPORTS AND STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    IFeeReimbursementApp public immutable feeReimbursementApp;
    IFactory public immutable factory;
    IERC20 public immutable rewardToken;

    AggregatorV2V3Interface internal immutable dataFeed;
    AggregatorV2V3Interface internal immutable sequencerUptimeFeed;

    /// @dev Grace period time in seconds used for the Chainlink price feed
    /// If the sequencer is up and the GRACE_PERIOD_TIME has passed, the _getChainlinkDataFeedLatestAnswer function retrieves
    /// the latest answer from the data feed using the dataFeed object.
    uint256 private constant GRACE_PERIOD_TIME = 3600;

    /*///////////////////////////////////////////////////////////////
                                EVENTS
    ///////////////////////////////////////////////////////////////*/

    /// @notice emitted when fee rebate is claimed
    /// @param account: address of account that claimed
    /// @param price: price of OP token at the moment of claim
    event FeeRebateClaimed(address indexed account, int256 price);

    /// @notice emitted when tokens are recovered from this contract
    /// @param token: address of token recovered
    /// @param amount: amount of token recovered
    event Recovered(address token, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error SequencerDown();
    error StaleData();
    error GracePeriodNotOver();
    error InvalidAccount();
    error Unauthorized();
    error UsdAmountTooSmall(uint248 amount);
    error NoFeeRebateAvailable();

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Constructs the FeeReimbursementClaim contract
    /// @param _feeReimbursementApp address of the fee FeeReimbursementApp contract
    /// @param _factory address of the Factory contract.
    /// @param _rewardToken address of the reward token contract
    /// @param _dataFeed address of the Chainlink data feed
    /// @param _sequencerUptimeFeed address of the Chainlink sequencer uptime feed
    constructor(
        address _feeReimbursementApp,
        address _factory,
        address _rewardToken,
        address _dataFeed,
        address _sequencerUptimeFeed
    ) {
        feeReimbursementApp = IFeeReimbursementApp(_feeReimbursementApp);
        factory = IFactory(_factory);
        rewardToken = IERC20(_rewardToken);
        /**
         * Network: Optimism mainnet
         * Data Feed: OP/USD
         * Data Feed address: 0x0D276FC14719f9292D5C1eA2198673d1f4269246
         * Uptime Feed address: 0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389
         * For a list of available Sequencer Uptime Feed proxy addresses, see:
         * https://docs.chain.link/docs/data-feeds/l2-sequencer-feeds
         */
        dataFeed = AggregatorV2V3Interface(_dataFeed);
        // Optimism Sequencer Uptime Feed
        sequencerUptimeFeed = AggregatorV2V3Interface(_sequencerUptimeFeed);
    }

    /// @notice Claims the available fee rebate for the specified smart margin account
    /// @param _smartMarginAccount address of the smart margin account
    /// @dev This function can only be called by the owner of the smart margin account
    function claim(address _smartMarginAccount) external {
        address account = msg.sender;

        if (!factory.accounts(_smartMarginAccount)) {
            revert InvalidAccount();
        }

        IAccount smAccount = IAccount(_smartMarginAccount);
        if (smAccount.owner() != account && !(smAccount.delegates(account))) {
            revert Unauthorized();
        }

        uint248 feeRebate = feeReimbursementApp.accountAccumulatedFee(_smartMarginAccount);

        if (feeRebate == 0) {
            revert NoFeeRebateAvailable();
        }

        // Convert feeRebate from USD to OP
        (uint256 feeRebateOP, int256 opPrice) = _convertUSDtoOP(feeRebate);

        // Interact with FeeReimbursementApp to reset the accumulated fee
        feeReimbursementApp.claim(_smartMarginAccount);

        // transfer fee rebate from this contract to the user
        rewardToken.safeTransfer(account, feeRebateOP);

        emit FeeRebateClaimed(account, opPrice);
    }

    // Function to recover any ERC20 tokens sent to this contract
    function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
        emit Recovered(_tokenAddress, _tokenAmount);
        IERC20(_tokenAddress).transfer(owner(), _tokenAmount);
    }

    function _convertUSDtoOP(uint248 _usdAmount)
        internal
        view
        returns (uint256 opAmount, int256 price)
    {
        /// @dev ensures there are no rounding errors when converting USD to OP
        if (_usdAmount < 1e8) {
            revert UsdAmountTooSmall(_usdAmount);
        }

        price = _getChainlinkDataFeedLatestAnswer();

        // OP price feed is given with 8 decimals
        uint256 opPriceInWei = uint256(price) * 1e10;

        opAmount = (uint256(_usdAmount) * 1 ether) / opPriceInWei;
    }

    /// @notice Check the sequencer status and return the latest data
    function _getChainlinkDataFeedLatestAnswer() internal view returns (int256) {
        // prettier-ignore
        (
            /*uint80 roundID*/
            ,
            int256 answer,
            uint256 startedAt,
            /*uint256 updatedAt*/
            ,
            /*uint80 answeredInRound*/
        ) = sequencerUptimeFeed.latestRoundData();

        // Answer == 0: Sequencer is up
        // Answer == 1: Sequencer is down
        bool isSequencerUp = answer == 0;
        if (!isSequencerUp) {
            revert SequencerDown();
        }

        // Make sure the grace period has passed after the
        // sequencer is back up.
        uint256 timeSinceUp = block.timestamp - startedAt;
        if (timeSinceUp <= GRACE_PERIOD_TIME) {
            revert GracePeriodNotOver();
        }

        // prettier-ignore
        (
            /*uint80 roundID*/
            ,
            int256 data,
            /*uint startedAt*/
            ,
            uint256 timeStamp,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();

        // If reported answer is not updated within the heartbeat (OP Data feed hearbeat is 20min), price is considered stale
        if (timeStamp < block.timestamp - 20 minutes) {
            revert StaleData();
        }

        return data;
    }
}
