import {
  PROOF_STATUS_INELIGIBLE_ACCOUNT_ID,
  PROOF_STATUS_INIT,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_INPUT_REQUEST_SENT,
  PROOF_STATUS_PROVING_FINISHED,
} from "../constants/index.ts";
import {
  findNotReadyReceipts, 
  findNotReadyStorages, 
  findUserTradeVolumeFees,
  getUserTradeVolumeFee,
  insertReceipt,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import { postSwapsQuery } from "../graphql/index.ts";
import { sendUserTradeVolumeFeeProvingRequest, uploadUserTradeVolumeFeeProof } from "../prover/index.ts";
import { QueryOrderTxsByAccount } from "../query/index.ts";
import { querySingleReceipt, querySingleStorage } from "../rpc/index.ts";

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
  const ym = Number(userSwapAmount.trade_year_month)

  const month = ym % 100
  const monthString = (month + "").padStart(2, "0")
  const nextMonth = (month + 1) % 12
  const nextMonthString = (nextMonth + "").padStart(2, "0")

  const year0 = Math.floor(ym / 100)
  var year1 = year0
  if (nextMonth < month) {
    year1++
  }

  const duneResult = await QueryOrderTxsByAccount(year0+"-"+monthString+"-01", year1+"-"+nextMonthString+"-01", userSwapAmount.account)

  if (duneResult.txs.length === 0) {
    console.error("no order settled found")
    userSwapAmount.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID
    updateUserTradeVolumeFee(userSwapAmount)
    return
  }

  const promises = Array<Promise<string>>();

  duneResult.txs.forEach((tx) => {
    promises.push(
      insertReceipt(tx).then((receipt) => {
        return receipt.id;
      })
    );
  });

  const receiptIds = await Promise.all(promises);
  userSwapAmount.receipt_ids = receiptIds.reduce(
    (accumulator, currentValue) => accumulator + "," + currentValue
  );
  userSwapAmount.status = PROOF_STATUS_INPUT_READY;
  userSwapAmount.volume = duneResult.volume
  userSwapAmount.fee = duneResult.fee

  const now = new Date()
  console.log("User Circuit Input Ready: ", userSwapAmount.id, now.toLocaleDateString())

  updateUserTradeVolumeFee(userSwapAmount).then(value => {
    sendUserTradeVolumeFeeProvingRequest(value)
  });
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
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_PROVING_FINISHED);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to upload user swap amount proof");
  }
}