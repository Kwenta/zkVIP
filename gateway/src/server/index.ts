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
  prepareUserTradeVolumeFees,
  queryUserSwapAmountInput,
} from "../interval_jobs/index.ts";
import {
  monitorFeeReimbursed,
  monitorBrevisRequest,
} from "../ether_interactions/index.ts";
import { validTimeNumber, UserTradeVolumeFee, findNextDay } from "./type.ts";
import { BigNumber } from "ethers";
import { monitorEventLoopDelay } from "perf_hooks";
import moment from "moment";

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

monitorFeeReimbursed();
monitorBrevisRequest();

app.post("/kwenta/newTradeFeeReimbursement", async (req, res) => {
  try {
    const { account, start_year_month_day, end_year_month_day } = req.body;

    const start = Number(start_year_month_day)
    const end = Number(end_year_month_day)

    if (isNaN(start) || isNaN(end)) {
      res.status(500);
      res.send({ error: true, message: "invalid claim trade time period" });
      return
    }

    if (start > end) {
      res.status(500);
      res.send({ error: true, message: "start is bigger than end" });
      return
    }


    if (end >= Number((moment(new Date())).format('YYYYMMDD'))) {
      res.status(500);
      res.send({ error: true, message: "invalid end trade period" });
      return
    }

    if (!validTimeNumber(start)) {
      res.status(500);
      res.send({ error: true, message: "invalid start trade period" });
      return
    }

    if (!validTimeNumber(end)) {
      res.status(500);
      res.send({ error: true, message: "invalid end trade period" });
      return
    }

    var utvf = await findUserExistingUTVF(account, BigInt(start), BigInt(end));
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
      BigInt(start),
      BigInt(end),
    );

    console.log("New User Comes In: ", utvf.id, (new Date()).toLocaleString())

    queryUserSwapAmountInput(utvf).then()
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
    } else if (Number(utvf.status) == Number(PROOF_STATUS_BREVIS_QUERY_ERROR)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED;
      message = "unsupported user, please contact custom support";
    } else if (Number(utvf.status) >= Number(PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED)
      && Number(utvf.status) < Number(PROOF_STATUS_BREVIS_QUERY_ERROR)
      && !utvf.request_sent
    ) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST;
      message =
        "You need to submit SendRequest transaction with query_hash and query_fee on brevis request contract." +
        "And use address(" +
        process.env.FEE_REIMBURSEMENT +
        ") as _callback";
    } else if (utvf.request_sent) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT;
      message = "Brevis is preparing swap amount proof";
    } else if ( Number(utvf.status) == Number(PROOF_STATUS_INELIGIBLE_ACCOUNT_ID)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID
      message = "Ineligible account id";

      res.json({
        status: status,
        message: message,
        tier: -1,
        fee_to_reimbursed: 0,
      });
      return 
    } else {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INIT;
      message = "Wait until query_hash and query_fee is ready";
    }
    var feeBN = BigNumber.from("0")
    var tier = -1
    try {
      var volume = utvf.volume
      if (volume === "") {
        volume = "0"
      }
      const volumeBN = BigNumber.from(volume).div(BigNumber.from("1000000000000000000"))
  
      var fee = utvf.fee
      if (fee === "") {
        fee = "0"
      }
      var feeBN = BigNumber.from(fee)
  
      var tier = -1
  
      if (volumeBN.toNumber() > 100000000) {
        tier = 3
        feeBN = feeBN.mul(BigNumber.from(9)).div(BigNumber.from(10))
      } else if (volumeBN.toNumber() > 10000000) {
        tier = 2    
        feeBN = feeBN.mul(BigNumber.from(75)).div(BigNumber.from(100))
      } else if (volumeBN.toNumber() > 1000000) {
        tier = 1
        feeBN = feeBN.mul(BigNumber.from(5)).div(BigNumber.from(10))
      } else if (volumeBN.toNumber() > 100000) {
        tier = 0
        feeBN = feeBN.mul(BigNumber.from(2)).div(BigNumber.from(10))
      } else {
        feeBN = BigNumber.from(0)
        message = "Ineligble user"
      }
    } catch {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INIT;
      message = "Wait until query_hash and query_fee is ready";
      res.json({
        status: status,
        message: message,
      });
      return 
    }
   
    res.json({
      status: status,
      query_hash: utvf.brevis_query_hash,
      query_fee: utvf.brevis_query_fee,
      brevis_request_contract_address: brevisRequest,
      message: message,
      tier: tier,
      fee_to_be_reimbursed: feeBN.toString(),
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
