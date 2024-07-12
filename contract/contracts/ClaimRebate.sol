// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AggregatorV2V3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV2V3Interface.sol";

interface IFeeReimbursementApp {
    function accountAccumulatedFee(address account) external view returns (uint248);
    function claim(address account) external;
}

contract FeeReimbursementClaim is Ownable {
    using SafeERC20 for IERC20;

    IFeeReimbursementApp public feeReimbursementApp;
    IERC20 public rewardToken;
    DataConsumerWithSequencerCheck public opPriceFeed;

    mapping(address => bool) public blacklist; // Blacklist mapping

    /*///////////////////////////////////////////////////////////////
                                EVENTS
    ///////////////////////////////////////////////////////////////*/

    /// @notice emitted when fee rebate is claimed
    /// @param account: address of account that claimed
    event FeeRebateClaimed(address indexed account);

    /// @notice emitted when tokens are recovered from this contract
    /// @param token: address of token recovered
    /// @param amount: amount of token recovered
    event Recovered(address token, uint256 amount);

    event BlacklistUpdated(address indexed account, bool isBlacklisted);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error Blacklisted();

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _feeReimbursementApp, address _rewardToken) {
        feeReimbursementApp = IFeeReimbursementApp(_feeReimbursementApp);
        rewardToken = IERC20(_rewardToken);
        opPriceFeed = DataConsumerWithSequencerCheck();
    }

    function claim() external notBlacklisted {
        address account = msg.sender;
        uint248 feeRebate = feeReimbursementApp.accountAccumulatedFee(account);

        // Convert feeRebate from USD to OP
        uint256 feeRebateOP = _convertUSDtoOP(feeRebateUSD);

        require(feeRebateOP > 0, "No fee rebate available");

        // Ensure the contract has enough tokens to reimburse
        uint256 contractBalance = rewardToken.balanceOf(address(this));
        require(contractBalance >= feeRebate, "Insufficient contract balance");

        // Interact with FeeReimbursementApp to reset the accumulated fee
        feeReimbursementApp.claim(account);

        // transfer fee rebate from this contract to the user
        rewardToken.transfer(account, feeRebateOP);

        emit FeeRebateClaimed(account);
    }

    // Function to recover any ERC20 tokens sent to this contract
    function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
        emit Recovered(_tokenAddress, _tokenAmount);
        IERC20(_tokenAddress).transfer(owner(), _tokenAmount);
    }

    function _convertUSDtoOP(uint248 _usdAmount) internal view returns (uint256) {
        int256 price = opPriceFeed.getChainlinkDataFeedLatestAnswer();

        // OP price feed is given with 8 decimals
        uint256 opPriceInWei = uint256(price) * 1e10;

        return uint256(_usdAmount) / opPriceInWei;
    }

    /// @notice access control modifier for blacklist
    modifier notBlacklisted() {
        _notBlacklisted();
        _;
    }

    function _notBlacklisted() internal view {
        if (blacklist[msg.sender]) revert Blacklisted();
    }

    function updateBlacklist(address account, bool isBlacklisted) external onlyOwner {
        blacklist[account] = isBlacklisted;
        emit BlacklistUpdated(account, isBlacklisted);
    }
}


contract DataConsumerWithSequencerCheck {
    AggregatorV2V3Interface internal dataFeed;
    AggregatorV2V3Interface internal sequencerUptimeFeed;

    uint256 private constant GRACE_PERIOD_TIME = 3600;

    error SequencerDown();
    error GracePeriodNotOver();

    /**
     * Network: Optimism mainnet
     * Data Feed: OP/USD
     * Data Feed address: 0x0D276FC14719f9292D5C1eA2198673d1f4269246
     * Uptime Feed address: 0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389
     * For a list of available Sequencer Uptime Feed proxy addresses, see:
     * https://docs.chain.link/docs/data-feeds/l2-sequencer-feeds
     */
    constructor() {
        dataFeed = AggregatorV2V3Interface(
            0x0D276FC14719f9292D5C1eA2198673d1f4269246
        );
        sequencerUptimeFeed = AggregatorV2V3Interface(
            0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389
        );
    }

    // Check the sequencer status and return the latest data
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int256 answer,
            uint256 startedAt,
            /*uint256 updatedAt*/,
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
            /*uint80 roundID*/,
            int data,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();

        return data;
    }
}
