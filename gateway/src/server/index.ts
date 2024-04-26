import express from "express";
import { findUserExistingUSA, getUserSwapAmount, insertUserSwapAmount } from "../db/index.ts";
import {
  PROOF_STATUS_ONCHAIN_VERIFIED,
  PROOF_STATUS_PROOF_UPLOADED,
  
  AMOUNT_VERIFICATION_INFO_STATUS_INIT,
  AMOUNT_VERIFICATION_INFO_STATUS_NEED_TO_SUBMIT_REQUEST,
  AMOUNT_VERIFICATION_INFO_STATUS_UNDEFINED,
  AMOUNT_VERIFICATION_INFO_STATUS_WAITING_FOR_RESULT,
  AMOUNT_VERIFICATION_INFO_STATUS_AMOUNT_VERIFIED,
  PROOF_STATUS_BREVIS_REQUEST_SUBMITTED,
} from "../constants/index.ts";
import {
  getReceiptInfos,
  prepareUserSwapAmounts,
} from "../interval_jobs/index.ts";
import {
  monitorSwapAmountVerified,
  monitorBrevisRequest,
} from "../ether_interactions/index.ts";

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
prepareUserSwapAmounts().then();
setInterval(prepareUserSwapAmounts, 300000);

monitorSwapAmountVerified();
monitorBrevisRequest();

app.post("/algebra/newSwapAmtVerification", async (req, res) => {
  try {
    const { account } = req.body;

    var usa = await findUserExistingUSA(account);
    if (usa != undefined && usa != null && usa) {
      res.json({ query_id: usa.id });
      return;
    }

    const src_chain_id = BigInt(process.env.SRC_CHAIN_ID ?? 0);
    const dst_chain_id = BigInt(process.env.DST_CHAIN_ID ?? 0);

    var usa = await insertUserSwapAmount(
      src_chain_id,
      dst_chain_id,
      account
    );
    res.json({ query_id: usa.id });
  } catch (error) {
    res.status(500);
    res.send({ error: true, message: error });
  }
});

app.get("/algebra/getVerificationInfo", async (req, res) => {
  try {
    const { query_id } = req.query;
    if (query_id?.toString() == null || query_id?.toString() == undefined) {
      res.status(500);
      res.send({ error: true, message: "info not found" });
      return;
    }
    const usa = await getUserSwapAmount(query_id?.toString());

    if (usa == null || usa == undefined) {
      res.status(500);
      res.send({ error: true, message: "info not found" });
      return;
    }

    let message = "";
    let status = AMOUNT_VERIFICATION_INFO_STATUS_UNDEFINED;
    let brevisRequest =
      "" + process.env.BREVIS_REQUEST;
    if (Number(usa.status) == Number(PROOF_STATUS_ONCHAIN_VERIFIED)) {
      status = AMOUNT_VERIFICATION_INFO_STATUS_AMOUNT_VERIFIED;
      message = "Swap amount verified";
    } else if (
      Number(usa.status) == Number(PROOF_STATUS_PROOF_UPLOADED)
    ) {
      status = AMOUNT_VERIFICATION_INFO_STATUS_NEED_TO_SUBMIT_REQUEST;
      message =
        "You need to submit SendRequest transaction with query_hash and query_fee on brevis request contract." +
        "And use address(" +
        process.env.USER_SWAP_AMOUNT +
        ") as _callback";
    } else if ( Number(usa.status) == Number(PROOF_STATUS_BREVIS_REQUEST_SUBMITTED)) {
      status = AMOUNT_VERIFICATION_INFO_STATUS_WAITING_FOR_RESULT;
      message = "Brevis is preparing swap amount proof";
    } else {
      status = AMOUNT_VERIFICATION_INFO_STATUS_INIT;
      message = "Wait until query_hash and query_fee is ready";
    }

    res.json({
      status: status,
      query_hash: usa.brevis_query_hash,
      query_fee: usa.brevis_query_fee,
      brevis_request_contract_address: brevisRequest,
      message: message,
    });
  } catch (error) {
    res.status(500);
    res.send({ error: true, message: error });
  }
});

const port = 11083;
export const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}!`)
);
