import { ethers } from "ethers";
import * as typeChain from "../../../contract/typechain/index.ts";

import { BrevisRequest__factory } from "../brevis_request/BrevisRequest__factory.ts";
import {
  updateUserTradeVolumeFee,
  updateUserTradeVolumeFeeRequestSent,
} from "../db/index.ts";

import * as dotenv from "dotenv";
import { UserTradeVolumeFee } from "../server/type.ts";
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
    if (msg.includes("request already in queue")) {
      updateUserTradeVolumeFeeRequestSent(utvf.account, utvf.ymd, true)
      console.log(`tx has been sent for ${utvf.account}, ${utvf.ymd}`)
    } else {
      console.error(`failed to submit tx for ${utvf.account}-${utvf.ymd}: ${msg}`);
    }
  })
}


export {
  dstChainProvider,
  sourceChainProvider,
  wallet,
  brevisRequest,
  userSwapAmountApp,
  submitBrevisRequestTx,
};
