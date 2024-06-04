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
  findUserTradeVolumeFees,
  getDailyTrack,
  getUserTradeVolumeFee,
  insertDailyTrack,
  insertReceipt,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import { getAvailableAccountIds } from "../graphql/index.ts";
import { sendUserTradeVolumeFeeProvingRequest, uploadUserTradeVolumeFeeProof } from "../prover/index.ts";
import { QueryOrderTxsByAccount } from "../query/index.ts";
import { querySingleReceipt, querySingleStorage } from "../rpc/index.ts";
import { findNextDay, getCurrentDay } from "../server/type.ts";
import moment from "moment";
import { submitBrevisRequestTx } from "../ether_interactions/index.ts";

export async function prepareNewDayTradeClaims() {
  try {
    const today = Number((moment(new Date())).format('YYYYMMDD'))
    var todayInTrack = await getDailyTrack(BigInt(today));
    if (todayInTrack != undefined && todayInTrack != null && todayInTrack) {
      return;
    }

    // TODO: Get yesterday's all available accountId
    await getAvailableAccountIds()
    // TODO: Uncomment insertDailyTrack for today
    // await insertDailyTrack(BigInt(today))
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
    promises.push(prepareUserSwapAmountInput());
    promises.push(prepareUserSwapAmountProof());
    promises.push(uploadUserSwapAmountProof());
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare utvfs", error);
  }
}

async function prepareUserSwapAmountInput() {
  try {
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_INIT);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(queryUserSwapAmountInput(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare utvf input", error);
  }
}

export async function queryUserSwapAmountInput(userSwapAmountOld: any) {
  const userSwapAmount = await getUserTradeVolumeFee(userSwapAmountOld.id)

  if (userSwapAmount.status != PROOF_STATUS_INIT) {
    return 
  }
  userSwapAmount.status = PROOF_STATUS_INPUT_REQUEST_SENT
  await updateUserTradeVolumeFee(userSwapAmount)

  const start = getCurrentDay(Number(userSwapAmount.start_ymd))
  const end = findNextDay(Number(userSwapAmount.end_ymd))


  if (start.length === 0 || end.length === 0) {
    console.error("invalid start end time format", userSwapAmount.start_ymd, userSwapAmount.end_ymd, userSwapAmount.id)
    userSwapAmount.status = PROOF_STATUS_INIT
    updateUserTradeVolumeFee(userSwapAmount)
  }

  console.log("Start to send dune query: ", userSwapAmount.id, (new Date()).toLocaleString())

  const duneResult = await QueryOrderTxsByAccount(start, end, userSwapAmount.account)

  console.log("Dune resule returned: ", userSwapAmount.id, (new Date()).toLocaleString())


  if (duneResult.txs.length === 0) {
    console.error("no order settled found")
    userSwapAmount.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID
    updateUserTradeVolumeFee(userSwapAmount)
    return
  } else if (BigNumber.from(duneResult.volume).lte(BigNumber.from("100000000000000000000000"))) {
    console.error("invalid volume", duneResult.volume, userSwapAmount.account)
    userSwapAmount.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID
    updateUserTradeVolumeFee(userSwapAmount)
    return
  }

  const promises = Array<Promise<string>>();

  duneResult.txs.forEach((tx) => {
    promises.push(
      // insertReceipt(tx, userSwapAmount.account).then((receipt) => {
      //   return receipt.id;
      // })
    );
  });

  const receiptIds = await Promise.all(promises);
  userSwapAmount.receipt_ids = receiptIds.reduce(
    (accumulator, currentValue) => accumulator + "," + currentValue
  );
  userSwapAmount.status = PROOF_STATUS_INPUT_READY;
  userSwapAmount.volume = duneResult.volume
  userSwapAmount.fee = duneResult.fee

  console.log("User Circuit Input Ready: ", userSwapAmount.id, (new Date()).toLocaleString())

  updateUserTradeVolumeFee(userSwapAmount).then(value => {
    sendUserTradeVolumeFeeProvingRequest(value)
  }).then();
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