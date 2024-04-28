import express from "express";
import { findUserExistingUTVF, getUserTradeVolumeFee, insertUserTradeVolumeFee } from "../db/index.ts";
import {
  PROOF_STATUS_ONCHAIN_VERIFIED,
  PROOF_STATUS_PROOF_UPLOADED,
  
  FEE_REIMBURSEMENT_INFO_STATUS_INIT,
  FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST,
  FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED,
  FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT,
  FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED,
  PROOF_STATUS_BREVIS_REQUEST_SUBMITTED,
  FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID,
} from "../constants/index.ts";
import {
  getReceiptInfos,
  getStorageInfos,
  prepareUserTradeVolumeFees,
} from "../interval_jobs/index.ts";
import {
  monitorFeeReimbursed,
  monitorBrevisRequest,
} from "../ether_interactions/index.ts";
import { UserTradeVolumeFee } from "./type.ts";
import { BigNumber } from "ethers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
getReceiptInfos().then();
setInterval(getReceiptInfos, 10000);
getStorageInfos().then();
setInterval(getStorageInfos, 10000);
prepareUserTradeVolumeFees().then();
setInterval(prepareUserTradeVolumeFees, 10000);

monitorFeeReimbursed();
monitorBrevisRequest();

app.post("/kwenta/newTradeFeeReimbursement", async (req, res) => {
  try {
    const { account, trade_year_month } = req.body;

    const tym = Number(trade_year_month)

    const month = tym % 100

    const now = new Date();
    const utcMonth = now.getUTCMonth()
    const fullYear = now.getUTCFullYear()
  
    if (isNaN(tym) || tym < 202402 || (tym >= utcMonth + fullYear * 100) || month > 13) {
      res.status(500);
      res.send({ error: true, message: "invalid claim trade time period" });
      return
    }
    
    var utvf = await findUserExistingUTVF(account, BigInt(tym));
    if (utvf != undefined && utvf != null && utvf) {
      res.json({ query_id: utvf.id });
      return;
    }

    const src_chain_id = BigInt(process.env.SRC_CHAIN_ID ?? 8453);
    const dst_chain_id = BigInt(process.env.DST_CHAIN_ID ?? 8453);

    var utvf = await insertUserTradeVolumeFee(
      src_chain_id,
      dst_chain_id,
      account,
      BigInt(tym),
    );
    res.json({ query_id: utvf.id });
  } catch (error) {
    res.status(500);
    res.send({ error: true, message: error });
  }
});

app.get("/kwenta/getTradeFeeReimbursementInfo", async (req, res) => {
  try {
    const { query_id } = req.query;
    if (query_id?.toString() == null || query_id?.toString() == undefined) {
      res.status(500);
      res.send({ error: true, message: "query id not found" });
      return;
    }
    const utvf = await getUserTradeVolumeFee(query_id?.toString()) as UserTradeVolumeFee

    if (utvf == null || utvf == undefined) {
      res.status(500);
      res.send({ error: true, message: "info not found" });
      return;
    }

    let message = "";
    let status = FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED;
    let brevisRequest =
      "" + process.env.BREVIS_REQUEST;
    if (Number(utvf.status) == Number(PROOF_STATUS_ONCHAIN_VERIFIED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED;
      message = "Fee reimbursed";
    } else if ( Number(utvf.status) == Number(PROOF_STATUS_PROOF_UPLOADED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST;
      message =
        "You need to submit SendRequest transaction with query_hash and query_fee on brevis request contract." +
        "And use address(" +
        process.env.FEE_REIMBURSEMENT +
        ") as _callback";
    } else if ( Number(utvf.status) == Number(PROOF_STATUS_BREVIS_REQUEST_SUBMITTED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT;
      message = "Brevis is preparing swap amount proof";
    } else if ( Number(utvf.status) == Number(PROOF_STATUS_PROOF_UPLOADED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID
      message = "No order settled info found for this account id";
    } else {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INIT;
      message = "Wait until query_hash and query_fee is ready";
    }

    var volume = utvf.volume
    if (volume === "") {
      volume = "0"
    }
    const volumeBN = BigNumber.from(volume).div(BigNumber.from(1000000000000000000))

    var fee = utvf.fee
    if (fee === "") {
      fee = "0"
    }
    var feeBN = BigNumber.from(fee).div(BigNumber.from(1000000000000000000))

    var tier = -1
    if (volumeBN.toNumber() <= 100000) {
      tier = -1
    } else if (volumeBN.toNumber() <= 100000) {
      tier = 0
      feeBN = feeBN.mul(BigNumber.from(2)).div(BigNumber.from(10))
    } else if (volumeBN.toNumber() <= 1000000) {
      tier = 1
      feeBN = feeBN.mul(BigNumber.from(5)).div(BigNumber.from(10))
    } else if (volumeBN.toNumber() <= 10000000) {
      tier = 2    
      feeBN = feeBN.mul(BigNumber.from(75)).div(BigNumber.from(100))
    } else if (volumeBN.toNumber() <= 100000000) {
      tier = 3
      feeBN = feeBN.mul(BigNumber.from(9)).div(BigNumber.from(10))
    } 

    res.json({
      status: status,
      query_hash: utvf.brevis_query_hash,
      query_fee: utvf.brevis_query_fee,
      brevis_request_contract_address: brevisRequest,
      message: message,
      tier: tier,
      fee_to_reimbursed: feeBN.toString(),
    });
  } catch (error) {
    res.status(500);
    res.send({ error: true, message: error });
  }
});

const port = 11084;
export const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}!`)
);
