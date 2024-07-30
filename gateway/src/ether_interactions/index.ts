import { ethers } from "ethers";
import * as typeChain from "../../../contract/typechain/index.ts";

import { BrevisRequest__factory } from "../brevis_request/BrevisRequest__factory.ts";
import {
  updateUserTradeVolumeFee,
  updateUserTradeVolumeFeeRequestSent,
} from "../db/index.ts";

import * as dotenv from "dotenv";
import { UserTradeVolumeFee } from "../server/type.ts";
import { error } from "console";
dotenv.config();

const { FeeReimbursementApp__factory } = typeChain;
// DstChain Provider uses Arbitrum Sepolia RPC to submit transaction on AS
const dstChainProvider = new ethers.JsonRpcProvider(
  process.env.DEST_RPC ?? ""
);
// Source Provider uses Arbirtrum RPC to retrieve Aribitrum data
const sourceChainProvider = new ethers.JsonRpcProvider(
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
  // userSwapAmountApp.on(FeeRebateAccumulatedEvent.Event, (account, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber) => {
  //   const feeRebateBN = feeRebate as BigInt;
  //   const volume30DBN = volume30D as BigInt;
  //   const feeRebateWithRateBN = feeRebateWithRate as BigInt;
  //   const startBlockNumberBN = startBlockNumber as BigInt;
  //   const endBlockNumberBN = endBlockNumber as BigInt;

  //   console.log("Fee Accumulated Event", account, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber)
  //   if (
  //     account === undefined || account === null ||
  //     feeRebateBN === undefined || feeRebateBN === null ||
  //     volume30DBN === undefined || volume30DBN === null ||
  //     feeRebateWithRateBN === undefined || feeRebateWithRateBN === null ||
  //     startBlockNumberBN === undefined || startBlockNumberBN === null ||
  //     endBlockNumberBN === undefined || endBlockNumberBN === null
  //   ) {
  //     return;
  //   }
    
  //   findUserExistingUTVF(account, BigInt(startBlockNumberBN.toString()), BigInt(endBlockNumberBN.toString()))
  //     .then(utvf => {
  //       if (utvf) {
  //         utvf.status = PROOF_STATUS_ONCHAIN_VERIFIED
  //         utvf.fee_rebate = feeRebateWithRateBN
  //         return updateUserTradeVolumeFee(utvf)
  //       }
  //     }).catch(error => {
  //       console.error(
  //         "failed to update user swap amount",
  //         account,
  //         startBlockNumber,
  //         endBlockNumber, 
  //         error
  //       );
  //     })
  // });
}

async function submitBrevisRequestTx(utvf: UserTradeVolumeFee) {
  console.log(`submit tx for ${utvf.account}-${utvf.ymd}`)
  await updateUserTradeVolumeFee(utvf)
  brevisRequest.sendRequest(
      utvf.brevis_query_hash,
      wallet.address ?? "",
      process.env.FEE_REIMBURSEMENT ?? "",
      {
        value: 0,
      }
  ).then(tx => {
     updateUserTradeVolumeFeeRequestSent(utvf.account, utvf.ymd, true)
     console.log(`tx: ${tx.hash} sent for ${utvf.account}, ${utvf.ymd}`)
  }).catch(error => {
    const msg = `${error}`
    if (msg.includes("execution reverted: request already in queue")) {
      updateUserTradeVolumeFeeRequestSent(utvf.account, utvf.ymd, true)
      console.log(`tx has been sent for ${utvf.account}, ${utvf.ymd}`)
    } else {
      console.error(`failed to submit tx: ${msg}`);
    }
  })
}


export {
  dstChainProvider,
  sourceChainProvider,
  wallet,
  brevisRequest,
  userSwapAmountApp,
  monitorFeeAccumulated,
  submitBrevisRequestTx,
};
