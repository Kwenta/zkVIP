import express from "express";
import {
  getReceiptInfos,
  prepareNewDayTradeClaims,
  prepareTrades,
  prepareUserSwapAmountProof,
  submitUserSwapAmountTx,
  uploadProofs,
  uploadUserSwapAmountProof,
} from "../interval_jobs/index.ts";

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

prepareUserSwapAmountProof().then();
setInterval(prepareUserSwapAmountProof, 30000);

uploadUserSwapAmountProof().then();
setInterval(uploadUserSwapAmountProof, 15000);

prepareTrades().then();
setInterval(prepareTrades, 1000);

prepareNewDayTradeClaims();
setInterval(prepareNewDayTradeClaims, 60000);

submitUserSwapAmountTx();
setInterval(submitUserSwapAmountTx, 2000);

uploadProofs();
setInterval(uploadProofs, 5000);
