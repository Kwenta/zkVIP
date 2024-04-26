import {
  PROOF_STATUS_INIT,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_PROVING_FINISHED,
} from "../constants/index.ts";
import {
  findNotReadyReceipts, 
  findNotReadyStorages, 
  findUserTradeVolumeFees,
  insertReceipt,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import { postSwapsQuery } from "../graphql/index.ts";
import { sendUSAProvingRequest, uploadUSAProof } from "../prover/index.ts";
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
    console.error("failed to get receipt infos");
  }
}

export async function prepareUserSwapAmounts() {
  try {
    let promises = Array<Promise<void>>();
    promises.push(prepareUserSwapAmountInput());
    promises.push(prepareUserSwapAmountProof());
    promises.push(uploadUserSwapAmountProof());
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare usas", error);
  }
}

async function prepareUserSwapAmountInput() {
  try {
    const usas = await findUserTradeVolumeFees(PROOF_STATUS_INIT);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < usas.length; i++) {
      promises.push(queryUserSwapAmountInput(usas[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare usa input", error);
  }
}

async function queryUserSwapAmountInput(userSwapAmount: any) {
  const result = await postSwapsQuery(userSwapAmount.account)

  if (result.error !== null) {
    console.error("failed to get swaps", result.error)
    return 
  }

  if (result.txs.length === 0) {
    console.error("no swap found")
    return
  }

  const promises = Array<Promise<string>>();

  result.txs.forEach((tx) => {
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
  updateUserTradeVolumeFee(userSwapAmount);
}

async function prepareUserSwapAmountProof() {
  try {
    const usas = await findUserTradeVolumeFees(PROOF_STATUS_INPUT_READY);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < usas.length; i++) {
      promises.push(sendUSAProvingRequest(usas[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to send user swap amount prove", error);
  }
}

async function uploadUserSwapAmountProof() {
  try {
    const usas = await findUserTradeVolumeFees(PROOF_STATUS_PROVING_FINISHED);
    let promises = Array<Promise<void>>();
    for (let i = 0; i < usas.length; i++) {
      promises.push(uploadUSAProof(usas[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to upload user swap amount proof");
  }
}