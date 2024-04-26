import * as sdk from "brevis-sdk-typescript";
import { Receipt, UserTradeVolumeFee } from "../server/type.ts";
import {
  getReceipt,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import {
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_PROOF_UPLOADED,
  PROOF_STATUS_PROVING_FINISHED,
  STATUS_READY,
} from "../constants/index.ts";
import { ethers } from "ethers";

const {
  Brevis,
  ErrCode,
  ProofRequest,
  Prover,
  ReceiptData,
  StorageData,
  asUint248,
  asUint521,
} = sdk;

const usaProver = new Prover("localhost:33247");
const brevis = new Brevis("appsdk.brevis.network:11080");

const buildUSAProofReq = async (usa: UserTradeVolumeFee) => {
  const proofReq = new ProofRequest();
  const ids = usa.receipt_ids.split(",");
  let promises = Array<Promise<Receipt | undefined>>();

  for (let i = 0; i < ids.length; i++) {
    promises.push(
      getReceipt(ids[i]).then((value) => {
        const r = value as Receipt;
        if (r === undefined || r === null) {
          return undefined;
        } else {
          if (r.should_be_filtered_out) {
            return undefined;
          } else {
            return r;
          }
        }
      })
    );
  }

  const results = await Promise.all(promises);

  let index = 0;

  for (let i = 0; i < results.length; i++) {
    const receipt = results[i];
    if (receipt === undefined) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready");
    }
    const data = JSON.parse(receipt.data);

    console.log("data", data)
    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(data.block_num),
        tx_hash: receipt.tx_hash,
        fields: [
          new sdk.Field(data.fields[0]),
          new sdk.Field(data.fields[1]),
          new sdk.Field(data.fields[2]),
        ],
      }),
      index++
    );
  }

  proofReq.setCustomInput({
    UserAddress: asUint248(usa.account || ""),
  });

  console.log("proofReq", proofReq)

  return proofReq;
};

async function sendUSAProvingRequest(reward: UserTradeVolumeFee) {
  const proofReq = await buildUSAProofReq(reward);
  const proofRes = await usaProver.prove(proofReq);
  // // error handling
  if (proofRes.has_err) {
    const err = proofRes.err;
    switch (err.code) {
      case ErrCode.ERROR_INVALID_INPUT:
        console.error("invalid receipt/storage/transaction input:", err.msg);
        // handle invalid data input...
        break;
      case ErrCode.ERROR_INVALID_CUSTOM_INPUT:
        console.error("invalid custom input:", err.msg);
        // handle invalid custom input assignment...
        break;
      case ErrCode.ERROR_FAILED_TO_PROVE:
        console.error("failed to prove:", err.msg);
        // handle failed to prove case...
        break;
      default:
        break;
    }
    return;
  }

  reward.proof = ethers.utils.hexlify(proofRes.serializeBinary());
  reward.status = PROOF_STATUS_PROVING_FINISHED;
  updateUserTradeVolumeFee(reward);
}

async function uploadUSAProof(usa: UserTradeVolumeFee) {
  try {
    const proofReq = await buildUSAProofReq(usa);
    const proof = ethers.utils.arrayify(usa.proof || "");
    let proofRes = sdk.ProveResponse.deserializeBinary(proof);

    console.log("proofRes", proofRes)

    const brevisRes = await brevis.submit(
      proofReq,
      proofRes,
      Number(usa.src_chain_id),
      Number(usa.dst_chain_id)
    );
    usa.brevis_query_fee = brevisRes.fee;
    usa.brevis_query_hash = brevisRes.id;
    usa.status = PROOF_STATUS_PROOF_UPLOADED;
    updateUserTradeVolumeFee(usa);
  } catch (err) {
    usa.status = PROOF_STATUS_BREVIS_QUERY_ERROR;
    updateUserTradeVolumeFee(usa);
    console.error(err);
  }
}

export {
  sendUSAProvingRequest,
  uploadUSAProof,
};
