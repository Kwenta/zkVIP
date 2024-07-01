import express from "express";
import { findUserExistingUTVF, findUserExistingUTVFByDate, getUserTradeVolumeFee, insertUserTradeVolumeFee } from "../db/index.ts";
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
  prepareTrades,
  prepareUserSwapAmountProof,
  submitUserSwapAmountTx,
  uploadUserSwapAmountProof,
} from "../interval_jobs/index.ts";
import {
  monitorFeeAccumulated,
  submitBrevisRequestTx,
} from "../ether_interactions/index.ts";
import { validTimeNumber, UserTradeVolumeFee, findNextDay, findDayStartTimestamp, findDayEndTimestamp } from "./type.ts";
import moment from "moment";
import { getAccountTradesList, getAllTradesWithin30Day } from "../graphql/index.ts";
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

prepareUserSwapAmountProof().then();
setInterval(prepareUserSwapAmountProof, 30000);

uploadUserSwapAmountProof().then();
setInterval(uploadUserSwapAmountProof, 15000);

prepareTrades().then();
setInterval(prepareTrades, 1000);

monitorFeeAccumulated();

prepareNewDayTradeClaims();
setInterval(prepareNewDayTradeClaims, 60000);

submitUserSwapAmountTx();
setInterval(submitUserSwapAmountTx, 2000);


var deleteDay = 0
// a()
// setInterval(a, 30000)

async function a() {
  deleteDay += 1
  const yesterday = Number((moment.utc(new Date()).subtract(deleteDay, "d")).format('YYYYMMDD'))
  const yesterdayStart = moment.utc(yesterday.toString(), "YYYYMMDD", true)
  const tsStart = yesterdayStart.utc().unix()
  const tsEnd = yesterdayStart.utc().add(1, "d").unix() - 1
  const ts30DAgo = yesterdayStart.utc().subtract(29, "d").unix()

  getAllTradesWithin30Day(ts30DAgo, tsEnd).then(result => {
    const accountTradesList = getAccountTradesList(result.trades)
  
    type TradesInfo = {
      tradeLength: number,
      unclaimableLength: number,
      claimableLength: number,
    }
    const tradesInfos: TradesInfo[] = []      
    for (var i = 0; i < accountTradesList.length; i++) {
      const trades = accountTradesList[i].trades
      if (trades.length === 0) {
        tradesInfos.push({
          tradeLength: 0,
          unclaimableLength: 0,
          claimableLength: 0,
        })
        continue
      }
  
      const claimableTrades = trades.filter(trade => {
        return trade.timestamp >= tsStart && trade.timestamp <= tsEnd
      })
  
      tradesInfos.push({
        tradeLength: trades.length,
        claimableLength: claimableTrades.length,
        unclaimableLength: trades.length-claimableTrades.length,
      })
    }
  
    tradesInfos.sort((a,b) => {
      if (a.tradeLength > b.tradeLength) {
        return -1
      } else if (a.tradeLength == b.tradeLength && a.claimableLength > b.claimableLength) {
        return -1
      } else {
        return 1
      }
    })

    const smallCircuit = tradesInfos.filter(info => {
      return info.claimableLength > 0 && info.claimableLength <= 20 && info.unclaimableLength <= 216
    }).length

    const noClaimable = tradesInfos.filter(info => {
      return info.claimableLength == 0 
    }).length

    const claimable = tradesInfos.filter(info => {
      return info.claimableLength > 0 
    }).length

    const mCircuit = tradesInfos.filter(info => {
      return info.claimableLength > 0 && info.claimableLength <= 50 && info.unclaimableLength <= 412
    }).length

    const lCircuit = tradesInfos.filter(info => {
      return info.claimableLength > 0 && info.claimableLength <= 300
    }).length

    const notSupport = tradesInfos.filter(info => {
      return info.claimableLength > 300
    }).length

    console.log(`
     ${yesterday} length: ${tradesInfos.length},
     claimable account length: ${claimable}
     smallCircuit support: ${smallCircuit} coverage: ${ smallCircuit/claimable * 100}%
     mediumCircuit: ${mCircuit- smallCircuit} coverage: ${ (mCircuit-smallCircuit)/claimable * 100}%
     lCircuit: ${lCircuit- mCircuit} coverage: ${ (lCircuit- mCircuit)/claimable * 100}%
     no claimable account: ${noClaimable} percentage: ${noClaimable/tradesInfos.length*100}%
     claimable trades length not support: ${notSupport} percentage: ${ notSupport/tradesInfos.length * 100}%
     `)

  
    // for (var i = 0; i < 20; i++) {
    //   if (i < tradesInfos.length ) {
    //     const tradesInfo = tradesInfos[i]
    //     console.log(`trades ${tradesInfo.tradeLength} claimable: ${tradesInfo.claimableLength} and unclaimable: ${tradesInfo.unclaimableLength}`)  
    //   }
     
    // }
    console.log(`=========================================================================================`)

  }).catch(error => {
    console.error("get all trades within 30day error", error)
  })
}


