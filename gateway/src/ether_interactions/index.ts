import { BigNumber, ethers } from "ethers";
import * as typeChain from "../../../contract/typechain/index.ts";

import { BrevisRequest__factory } from "../brevis_request/BrevisRequest__factory.ts";
import {
  findUserExistingUSA,
  updateBrevisRequestStatus,
} from "../db/index.ts";
import {
  PROOF_STATUS_ONCHAIN_VERIFIED,
  PROOF_STATUS_PROOF_UPLOADED,
  STATUS_READY,
} from "../constants/index.ts";

import * as dotenv from "dotenv";
import { UserSwapAmount } from "../server/type.ts";
dotenv.config();

const { UserSwapAmountApp__factory } = typeChain;
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
const userSwapAmountApp = UserSwapAmountApp__factory.connect(
  process.env.USER_SWAP_AMOUNT ?? "",
  wallet
);

async function monitorSwapAmountVerified() {
  userSwapAmountApp.on("UserSwapVerified", (user, amount0, amount1) => {
    const userAddress = user as string;
    const amount0BN = amount0 as BigNumber;
    const amount1BN = amount1 as BigNumber;

    if (
      userAddress === undefined ||
      userAddress === null ||
      amount0BN === undefined ||
      amount0BN === null ||
      amount1BN === undefined ||
      amount1BN === null
    ) {
      console.log(
        "claimed triggered with unexpected value:: ",
        user,
        amount0,
        amount1,
      );
      return;
    }

    findUserExistingUSA(userAddress)
      .then(usa => {
        if (usa) {
          usa.token0_amount = amount0BN.toString()
          usa.token1_amount = amount1BN.toString()
        }
      }).catch(error => {
        console.error(
          "failed to update user swap amount",
          user,
          amount0,
          amount1,
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
  monitorSwapAmountVerified,
  monitorBrevisRequest,
};
