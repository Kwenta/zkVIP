import {
  PROOF_STATUS_INELIGIBLE_ACCOUNT_ID,
  PROOF_STATUS_INIT,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
} from "../constants/index.ts";
import {
  findBrevisRequestSentUTVFS,
  findNotReadyReceipts, 
  findNotReadyStorages, 
  findNotReadyTrades, 
  findProofToUpload, 
  findRequestSentsUTVF, 
  findTxToBeSent, 
  findUserExistingUTVF, 
  findUserExistingUTVFByDate, 
  findUserTradeVolumeFees,
  findUTVFToDownLoadProof,
  findUTVFToUploadProof,
  getDailyTrack,
  insertDailyTrack,
  insertUserTradeVolumeFee,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import { getAllTradesWithin30Day, getAccountTradesList, saveTrades } from "../graphql/index.ts";
import { downloadUTVFProof, sendUserTradeVolumeFeeProvingRequest, submitProofForBrevis, uploadUserTradeVolumeFeeProof } from "../prover/index.ts";
import { querySingleReceipt, querySingleStorage, queryTrade } from "../rpc/index.ts";
import { findDayStartTimestamp, findNextDay, getCurrentDay } from "../server/type.ts";
import moment from "moment";
import { brevisRequest, submitBrevisRequestTx, userSwapAmountApp } from "../ether_interactions/index.ts";

export async function prepareNewDayTradeClaims() {
  try {
    // Give 10 minutes buffer to avoid brevis gateway failure
    const yesterday = Number((moment.utc(new Date()).subtract(10, "m").subtract(1, "d")).format('YYYYMMDD'))
    var track = await getDailyTrack(BigInt(yesterday));
    if (track != undefined && track != null && track) {
      return;
    }

    const yesterdayStart = moment.utc(yesterday.toString(), "YYYYMMDD", true)
    var tsStart = yesterdayStart.utc().unix()
    var tsEnd = yesterdayStart.utc().add(1, "d").unix() - 1
    var ts30DAgo = yesterdayStart.utc().subtract(29, "d").unix()
    
    const result = await getAllTradesWithin30Day(ts30DAgo, tsEnd)
    if (result.error !== null) {
      throw result.error
    }

    console.log(`${yesterday}, trades count: ${result.trades.length}`)

    const accountTradesList = getAccountTradesList(result.trades)
    for (var i = 0; i < accountTradesList.length; i++) {
      const trades = accountTradesList[i].trades
      const account = accountTradesList[i].account
      if (trades.length === 0) {
        continue
      }

      const claimableTrades = trades.filter(trade => {
        return trade.timestamp >= tsStart && trade.timestamp <= tsEnd
      })

       // No available fee rebate trade
      if (claimableTrades.length === 0) {
        continue
      }
      
      var utvf = await findUserExistingUTVFByDate(account, BigInt(yesterday));
      if (utvf != undefined && utvf != null && utvf && Number(utvf.status) > 1)  {
        // no need to update trade infos
        continue;
      } else if (utvf != undefined && utvf != null && utvf && Number(utvf.status) == 1) {
        // no need to insert account trade infos
      } else {
        const src_chain_id = BigInt(process.env.SRC_CHAIN_ID ?? 10);
        const dst_chain_id = BigInt(process.env.DST_CHAIN_ID ?? 10);
  
        utvf = await insertUserTradeVolumeFee(
          src_chain_id,
          dst_chain_id,
          account,
          trades[0].account,
          BigInt(yesterday),
        );
      }
     
      const trade_ids = await saveTrades(trades, account)
      const claimPeriod = await userSwapAmountApp.accountClaimPeriod(account)
    
      // Make sure start block number is bigger than claim period in contract
      var startBlockNumber = claimableTrades[0].blockNumber

      if (claimPeriod[1] > BigInt(startBlockNumber)) {
        startBlockNumber = Number(claimPeriod[1]) + 1
      }

      utvf.start_blk_num = BigInt(startBlockNumber)
      utvf.end_blk_num = BigInt(claimableTrades[claimableTrades.length - 1].blockNumber)
      utvf.status = PROOF_STATUS_INPUT_READY
      utvf.trade_ids = trade_ids

      await updateUserTradeVolumeFee(utvf)
    }

    await insertDailyTrack(BigInt(yesterday))
  } catch (error) {
    console.error("failed to prepare new day trade claims", error)
  }
}

export async function getReceiptInfos() {
  try {
    const receipts = await findNotReadyReceipts();
    let promises = Array<Promise<void>>();
    for (let i = 0; i < receipts.length; i++) {
      promises.push(querySingleReceipt(receipts[i]));
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("failed to get receipt infos", error);
  }
}

export async function prepareTrades() {
  try {
    const trades = await findNotReadyTrades();
    let promises = Array<Promise<void>>();
    for (let i = 0; i < trades.length; i++) {
      promises.push(queryTrade(trades[i]));
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare trade");
  }
}

export async function getStorageInfos() {
  try {
    const storages = await findNotReadyStorages();
    let promises = Array<Promise<void>>();
    for (let i = 0; i < storages.length; i++) {
      promises.push(querySingleStorage(storages[i]));
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("failed to get storage infos");
  }
}

export async function prepareUserSwapAmountProof() {
  try {
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_INPUT_READY);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(sendUserTradeVolumeFeeProvingRequest(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to send user swap amount prove", error);
  }
}

export async function uploadUserSwapAmountProof() {
  try {
    const utvfs = await findBrevisRequestSentUTVFS();
    const pendingProofUploads = await findProofToUpload()
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(utvfs[i]));
    }
    for (let i = 0; i < pendingProofUploads.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(pendingProofUploads[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to upload user swap amount proof");
  }
}

export async function submitUserSwapAmountTx() {
  try {
    const utvfs = await findTxToBeSent();
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(submitBrevisRequestTx(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {

  }
}

export async function checkRequestStatusOnchain() {
  try {
    const yesterday = Number((moment.utc(new Date()).subtract(10, "m").subtract(1, "d")).format('YYYYMMDD'))
    const utvf = await findRequestSentsUTVF(BigInt(yesterday));
    const request = await brevisRequest.requests(utvf.brevis_query_hash)
    if (request[0] === BigInt(0)) {
      console.log(`request info not found for ${utvf.account}-${utvf.ymd}`)
      utvf.request_sent = false
      await updateUserTradeVolumeFee(utvf)
    }
  } catch (error) {

  }
}

export async function downloadProofs() {
  try {
    const utvfs = await findUTVFToDownLoadProof();
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(downloadUTVFProof(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {

  }
}

export async function uploadProofs() {
  try {
    const utvfs = await findUTVFToUploadProof();
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(submitProofForBrevis(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {

  }
}

