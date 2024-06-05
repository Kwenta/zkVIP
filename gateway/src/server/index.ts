import express from "express";
import { findUserExistingUTVF, getUserTradeVolumeFee, insertUserTradeVolumeFee } from "../db/index.ts";
import {
  PROOF_STATUS_ONCHAIN_VERIFIED,
  
  FEE_REIMBURSEMENT_INFO_STATUS_INIT,
  FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST,
  FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED,
  FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT,
  FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED,
  FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
  PROOF_STATUS_INELIGIBLE_ACCOUNT_ID,
  PROOF_STATUS_BREVIS_QUERY_ERROR,
} from "../constants/index.ts";
import {
  getReceiptInfos,
  getStorageInfos,
  prepareNewDayTradeClaims,
  prepareUserTradeVolumeFees,
  submitUserSwapAmountTx,
} from "../interval_jobs/index.ts";
import {
  monitorFeeAccumulated,
  monitorBrevisRequest,
} from "../ether_interactions/index.ts";
import { validTimeNumber, UserTradeVolumeFee, findNextDay, findDayStartTimestamp, findDayEndTimestamp } from "./type.ts";
import { BigNumber } from "ethers";
import moment from "moment";
import { getAllTradesWithin30Day } from "../graphql/index.ts";
import { error } from "console";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
getReceiptInfos().then();
setInterval(getReceiptInfos, 1000);
getStorageInfos().then();
setInterval(getStorageInfos, 10000);
prepareUserTradeVolumeFees().then();
setInterval(prepareUserTradeVolumeFees, 2000);

monitorFeeAccumulated();
monitorBrevisRequest();

// prepareNewDayTradeClaims();
// setInterval(prepareUserTradeVolumeFees, 60000);

submitUserSwapAmountTx();
setInterval(submitUserSwapAmountTx, 1000);

getAllTradesWithin30Day(1714799749, 1715459199).then().catch(error => {
  console.error("get all trades within 30day error", error)
})
