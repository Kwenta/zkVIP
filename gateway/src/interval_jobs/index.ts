import { BigNumber } from "ethers";
import {
  PROOF_STATUS_INELIGIBLE_ACCOUNT_ID,
  PROOF_STATUS_INIT,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_INPUT_REQUEST_SENT,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
} from "../constants/index.ts";
import {
  findNotReadyReceipts, 
  findNotReadyStorages, 
  findTxToBeSent, 
  findUserExistingUTVF, 
  findUserTradeVolumeFees,
  getDailyTrack,
  getUserTradeVolumeFee,
  insertDailyTrack,
  insertReceipt,
  insertUserTradeVolumeFee,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import { getAllTradesWithin30Day, getAccountTradesMap, saveTrades } from "../graphql/index.ts";
import { sendUserTradeVolumeFeeProvingRequest, uploadUserTradeVolumeFeeProof } from "../prover/index.ts";
import { QueryOrderTxsByAccount } from "../query/index.ts";
import { querySingleReceipt, querySingleStorage } from "../rpc/index.ts";
import { findDayStartTimestamp, findNextDay, getCurrentDay } from "../server/type.ts";
import moment from "moment";
import { submitBrevisRequestTx, userSwapAmountApp } from "../ether_interactions/index.ts";
import { FeeReimbursementApp } from '../../../contract/typechain/FeeReimbursementApp';

export async function prepareNewDayTradeClaims() {
  try {
    const yesterday = Number((moment.utc(new Date()).subtract(1, "d")).format('YYYYMMDD'))
    var track = await getDailyTrack(BigInt(yesterday));
    if (track != undefined && track != null && track) {
      return;
    }

    const yesterdayStart = moment.utc(yesterday.toString(), "YYYYMMDD", true)
    const tsStart = yesterdayStart.utc().unix()
    const tsEnd = yesterdayStart.utc().add(1, "d").unix() - 1
    const ts30DAgo = yesterdayStart.utc().subtract(29, "d").unix()

    const result = await getAllTradesWithin30Day(ts30DAgo, tsEnd)
    if (result.error !== null) {
      throw result.error
    }

    await insertDailyTrack(BigInt(yesterday))

    const accountTradesMap = getAccountTradesMap(result.trades)
    for (let [account, trades] of accountTradesMap) {      
      if (trades.length === 0) {
        continue
      }

      const claimableTrades = trades.filter(trade => {
        return trade.timestamp >= tsStart && trade.timestamp <= tsEnd
      })
      console.log(`account ${account} claimable trades: ${claimableTrades.length} and unclaimable trades ${trades.length-claimableTrades.length}`)

       // No available fee rebate trade
      if (claimableTrades.length === 0) {
        continue
      }
      
      var utvf = await findUserExistingUTVF(account, BigInt(yesterday), BigInt(yesterday));
      if (utvf != undefined && utvf != null && utvf) {
        return;
      }

      const src_chain_id = BigInt(process.env.SRC_CHAIN_ID ?? 10);
      const dst_chain_id = BigInt(process.env.DST_CHAIN_ID ?? 10);

      var utvf = await insertUserTradeVolumeFee(
        src_chain_id,
        dst_chain_id,
        account,
        trades[0].account,
        BigInt(yesterday),
        BigInt(yesterday),
      );

      const trade_ids = await saveTrades(trades, account)
    
      utvf.status = PROOF_STATUS_INPUT_READY
      utvf.trade_ids = trade_ids

      const claimPeriod = await userSwapAmountApp.accountClaimPeriod(account)
    
      // Make sure start block number is bigger than claim period in contract
      var startBlockNumber = claimableTrades[0].blockNumber
      if (claimPeriod[1].gt(BigNumber.from(startBlockNumber))) {
        startBlockNumber = claimPeriod[1].toNumber() + 1
      }

      utvf.start_blk_num = BigInt(startBlockNumber)
      utvf.end_blk_num = BigInt(claimableTrades[claimableTrades.length - 1].blockNumber)
      
      await updateUserTradeVolumeFee(utvf)
    }
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
    console.error("failed to get receipt infos");
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

export async function prepareUserTradeVolumeFees() {
  try {
    let promises = Array<Promise<void>>();
    promises.push(prepareUserSwapAmountProof());
    promises.push(uploadUserSwapAmountProof());
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare utvfs", error);
  }
}

async function prepareUserSwapAmountProof() {
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

async function uploadUserSwapAmountProof() {
  try {
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(utvfs[i]));
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
    console.error("failed to submit tx", error);
  }
}