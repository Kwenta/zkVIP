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

async function monitorFeeReimbursed() {
  userSwapAmountApp.on("FeeReimbursed", (user, trade_year_month, fee) => {
    const userAddress = user as string;
    const tradeYearMonthBN = trade_year_month as BigNumber;

    if (
      userAddress === undefined ||
      userAddress === null ||
      tradeYearMonthBN === undefined ||
      tradeYearMonthBN === null 
    ) {
      console.log(
        "reimbursement triggered with unexpected value:: ",
        user,
        trade_year_month,
        fee
      );
      return;
    }

    findUserExistingUTVF(userAddress, BigInt(tradeYearMonthBN.toNumber()))
      .then(utvf => {
        if (utvf) {
          utvf.status = PROOF_STATUS_ONCHAIN_VERIFIED
          return updateUserTradeVolumeFee(utvf)
        }
      }).catch(error => {
        console.error(
          "failed to update user swap amount",
          user,
          user,
          trade_year_month,
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
  monitorFeeReimbursed,
  monitorBrevisRequest,
};
