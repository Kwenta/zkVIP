// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

import "brevis-contracts/contracts/sdk/apps/framework/BrevisApp.sol";
import "brevis-contracts/contracts/sdk/interface/IBrevisProof.sol";

interface IFeeRebateTierModule {
    function getFeeRebatePercentage(uint248 volume30D) external view returns (uint64);
}

struct ClaimPeriod {
    uint64 startBlockNumber;
    uint64 endBlockNumber;
}

error InvalidNewClaimPeriod();
/// @notice Only Claim Contract can access this
error onlyClaimContractCanAccess();
/// @notice cannot set this value to the zero address
error ZeroAddress();

contract FeeReimbursementApp is BrevisApp, Ownable {
    IFeeRebateTierModule public feeRebateTierModule;
    uint256 public contractsHash;
    mapping(bytes32 => uint16) public vkHashesToCircuitSize; // batch tier vk hashes => tier batch size
    mapping(address => ClaimPeriod) public accountClaimPeriod;
    mapping(address => uint248) public accountAccumulatedFee;
    address public claimContract;

    event FeeRebateAccumulated(
        address account,
        uint248 feeRebate,
        uint248 volume30D,
        uint248 feeRebateWithRate,
        uint64 startBlockNumber,
        uint64 endBlockNumber
    );
    event VkHashesUpdated(bytes32[] vkHashes, uint16[] sizes);
    event FeeReimbursed(address account, uint248 feeRebate);
    event BrevisProofUpdated(address);
    event FeeRebateTireModuleUpdated(address);
    event ContractsHashUpdated(uint256);
    event ClaimContractUpdated(address);

    constructor(address _brevisProof) BrevisApp(IBrevisProof(_brevisProof)) {}

    // BrevisQuery contract will call our callback once Brevis backend submits the proof.
    function handleProofResult(
        bytes32, /*_requestId*/
        bytes32 _vkHash,
        bytes calldata _circuitOutput
    ) internal override {
        // We need to check if the verifying key that Brevis used to verify the proof generated by our circuit is indeed
        // our designated verifying keys. This proves that the _circuitOutput is authentic
        uint16 circuitSize = vkHashesToCircuitSize[_vkHash];
        require(circuitSize > 0, "vkHash not valid");

        (
            address account,
            uint248 feeRebate,
            uint248 volume30D,
            uint64 startBlockNumber,
            uint64 endBlockNumber,
            uint256 hash
        ) = decodeOutput(_circuitOutput);
        require(contractsHash == hash, "invalid contracts hash");

        uint64 percentage;
        uint248 feeRebateWithRate = feeRebate;
        if (feeRebate > 0) {
            percentage = feeRebateTierModule.getFeeRebatePercentage(volume30D);
            feeRebateWithRate = feeRebate * percentage / 100;
        }

        ClaimPeriod memory claimPeriod = _newClaimPeriod(startBlockNumber, endBlockNumber, account);
        accountClaimPeriod[account] = claimPeriod;
        uint248 accumulatedFee = accountAccumulatedFee[account];
        accountAccumulatedFee[account] = accumulatedFee + feeRebateWithRate;
        emit FeeRebateAccumulated(
            account, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber
        );
    }

    function decodeOutput(bytes calldata o)
        internal
        pure
        returns (
            address account,
            uint248 feeRebate,
            uint248 volume30D,
            uint64 startBlockNumber,
            uint64 endBlockNumber,
            uint256 hash
        )
    {
        account = address(bytes20(o[0:20]));
        feeRebate = uint248(bytes31(o[20:51]));
        volume30D = uint248(bytes31(o[51:82]));
        startBlockNumber = uint64(bytes8(o[82:90]));
        endBlockNumber = uint64(bytes8(o[90:98]));
        hash = uint256(bytes32(o[98:130]));
    }

    function _newClaimPeriod(uint64 startBlockNumber, uint64 endBlockNumber, address account)
        internal
        view
        returns (ClaimPeriod memory)
    {
        ClaimPeriod memory claimPeriod = accountClaimPeriod[account];
        // No claim record at all
        if (claimPeriod.startBlockNumber == 0 && claimPeriod.endBlockNumber == 0) {
            claimPeriod.startBlockNumber = startBlockNumber;
            claimPeriod.endBlockNumber = endBlockNumber;
            return claimPeriod;
        }
        // Make sure block numbers in claimPeriod are consecutive.
        // claimed.startB ---> claimed.endB ---> claimed.endB+1 = startB --> endB
        if (startBlockNumber == claimPeriod.endBlockNumber + 1) {
            claimPeriod.endBlockNumber = endBlockNumber;
            return claimPeriod;
        }

        revert InvalidNewClaimPeriod();
    }

    function setVkHashes(bytes32[] calldata _vkHashes, uint16[] calldata _sizes) public onlyOwner {
        require(_vkHashes.length == _sizes.length, "length not match");
        for (uint256 i = 0; i < _vkHashes.length; i++) {
            vkHashesToCircuitSize[_vkHashes[i]] = _sizes[i];
        }

        emit VkHashesUpdated(_vkHashes, _sizes);
    }

    function setFeeRebateTierModule(IFeeRebateTierModule _feeRebateTierModule) external onlyOwner {
        feeRebateTierModule = _feeRebateTierModule;
        emit FeeRebateTireModuleUpdated(address(_feeRebateTierModule));
    }

    function setContractsHash(uint256 _contractsHash) external onlyOwner {
        contractsHash = _contractsHash;
        emit ContractsHashUpdated(_contractsHash);
    }

    // After reimburse user's fee, call claim to reset accumulatedFee
    function claim(address account) public onlyClaimContract {
        uint248 feeRebate = accountAccumulatedFee[account];
        accountAccumulatedFee[account] = 0;
        emit FeeReimbursed(account, feeRebate);
    }

    function setBrevisProof(address _brevisProof) external onlyOwner {
        brevisProof = IBrevisProof(_brevisProof);
        emit BrevisProofUpdated(_brevisProof);
    }

    /// @notice access control modifier for claimContract
    modifier onlyClaimContract() {
        _onlyClaimContract();
        _;
    }

    function _onlyClaimContract() internal view {
        if (msg.sender != claimContract) revert onlyClaimContractCanAccess();
    }

    function setClaimContract(address _claimContract) external onlyOwner {
        if (_claimContract == address(0)) revert ZeroAddress();
        claimContract = _claimContract;
        emit ClaimContractUpdated(_claimContract);
    }
}
