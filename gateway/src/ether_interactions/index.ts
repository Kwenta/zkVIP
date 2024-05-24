import { BigNumber, ethers } from "ethers";
import * as typeChain from "../../../contract/typechain/index.ts";

import { BrevisRequest__factory } from "../brevis_request/BrevisRequest__factory.ts";
import {
  findUserExistingUTVF,
  updateBrevisRequestStatus,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import {
  PROOF_STATUS_ONCHAIN_VERIFIED,
  PROOF_STATUS_PROOF_UPLOADED,
  STATUS_READY,
} from "../constants/index.ts";

import * as dotenv from "dotenv";
import { UserTradeVolumeFee } from "../server/type.ts";
dotenv.config();

const { FeeReimbursementApp__factory } = typeChain;
// DstChain Provider uses Arbitrum Sepolia RPC to submit transaction on AS
const dstChainProvider = new ethers.providers.JsonRpcProvider(
  process.env.DEST_RPC ?? ""
);
// Source Provider uses Arbirtrum RPC to retrieve Aribitrum data
const sourceChainProvider = new ethers.providers.JsonRpcProvider(
  process.env.SOURCE_RPC ?? ""
);
const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY ?? "",
  dstChainProvider
);

const brevisRequest = BrevisRequest__factory.connect(
  process.env.BREVIS_REQUEST ?? "",
  wallet
);
const userSwapAmountApp = FeeReimbursementApp__factory.connect(
  process.env.FEE_REIMBURSEMENT ?? "",
  wallet
);

async function monitorFeeAccumulated() {
  // event FeeReimbursed(address indexed user, uint128 accountId, uint248 feeRebate, uint32 startYearMonthDay, uint32 endYearMonthDay, uint64 startBlockNumber,uint64 endBlockNumber);
  // event FeeRebateAccumulated(uint128 accountId, uint248 feeRebate, uint248 volume30D, uint248 feeRebateWithRate,  uint64 startBlockNumber,uint64 endBlockNumber)
 
  userSwapAmountApp.on("FeeRebateAccumulated", (accountId, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber) => {
    const accountIdBN = accountId as BigNumber;
    const feeRebateBN = feeRebate as BigNumber;
    const volume30DBN = volume30D as BigNumber;
    const feeRebateWithRateBN = feeRebateWithRate as BigNumber;
    const startBlockNumberBN = startBlockNumber as BigNumber;
    const endBlockNumberBN = endBlockNumber as BigNumber;

    console.log("Fee Accumulated Event", accountId, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber)
    if (
      accountIdBN === undefined || accountIdBN === null ||
      feeRebateBN === undefined || feeRebateBN === null ||
      volume30DBN === undefined || volume30DBN === null ||
      feeRebateWithRateBN === undefined || feeRebateWithRateBN === null ||
      startBlockNumberBN === undefined || startBlockNumberBN === null ||
      endBlockNumberBN === undefined || endBlockNumberBN === null
    ) {
      return;
    }
    
    findUserExistingUTVF(accountIdBN.toString(), BigInt(startBlockNumberBN.toString()), BigInt(endBlockNumberBN.toString()))
      .then(utvf => {
        if (utvf) {
          utvf.status = PROOF_STATUS_ONCHAIN_VERIFIED
          return updateUserTradeVolumeFee(utvf)
        }
      }).catch(error => {
        console.error(
          "failed to update user swap amount",
          accountId,
          startBlockNumber,
          endBlockNumber, 
          error
        );
      })
  });
}

async function monitorBrevisRequest() {
  brevisRequest.on("RequestSent", (requestId: string) => {
    updateBrevisRequestStatus(requestId)
      .then()
      .catch((error) => {
        console.error(
          "failed to update brevis request on-chain status",
          requestId,
          error
        );
      });
  });
}

export {
  dstChainProvider,
  sourceChainProvider,
  wallet,
  brevisRequest,
  userSwapAmountApp,
  monitorFeeAccumulated,
  monitorBrevisRequest,
};
