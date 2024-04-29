import * as sdk from "brevis-sdk-typescript";
import { Receipt, UserTradeVolumeFee } from "../server/type.ts";
import {
  getReceipt,
  getUserTradeVolumeFee,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import {
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_BREVIS_REQUEST_SUBMITTED,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_PROOF_UPLOADED,
  PROOF_STATUS_PROVING_FINISHED,
  PROOF_STATUS_PROVING_SENT,
  STATUS_READY,
} from "../constants/index.ts";
import { BigNumber, ethers } from "ethers";

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

const prover = new Prover("localhost:33248");
const brevis = new Brevis("appsdk.brevis.network:11080");

const buildUserTradeVolumeFeeProofReq = async (utvf: UserTradeVolumeFee) => {
  const proofReq = new ProofRequest();
  const ids = utvf.receipt_ids.split(",");
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
  var earlistBlk = 0
  var latestBlk = 1

  for (let i = 0; i < results.length; i++) {
    const receipt = results[i];
    if (receipt === undefined) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready"); 
    }
    const data = JSON.parse(receipt.data);
    const blkNumber= Number(data.block_num)
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data)
    }

    if (earlistBlk > blkNumber) {
      earlistBlk = blkNumber
    } 
    if (latestBlk < blkNumber) {
      latestBlk = blkNumber
    }
    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(data.block_num),
        tx_hash: receipt.tx_hash,
        // 14 fields needed. 
        fields: [
          new sdk.Field(data.fields[0]),
          new sdk.Field(data.fields[1]),
          new sdk.Field(data.fields[2]),
          new sdk.Field(data.fields[3]), 

          // Placeholders
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
          new sdk.Field(data.fields[3]), 
        ],
      }),
      index++
    );
  }

  const accountIdHex = BigNumber.from(utvf.account).toHexString()
  
  proofReq.setCustomInput({
    AccountId: asUint248(accountIdHex),
    StartBlkNum: asUint248(earlistBlk.toString()),
    EndBlkNum: asUint248(latestBlk.toString()),
		YearMonth:   asUint248(utvf.trade_year_month.toString()),
  });

  return proofReq;
};

async function sendUserTradeVolumeFeeProvingRequest(utvfOld: UserTradeVolumeFee) {
  const utvf = await getUserTradeVolumeFee(utvfOld.id)
  if (utvf.status != PROOF_STATUS_INPUT_READY) {
    return 
  }

  utvf.status = PROOF_STATUS_PROVING_SENT
  await updateUserTradeVolumeFee(utvf)
  try {
    const proofReq = await buildUserTradeVolumeFeeProofReq(utvf);
    const proofRes = await prover.prove(proofReq);

    // error handling
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

    utvf.proof = ethers.utils.hexlify(proofRes.serializeBinary());
    utvf.status = PROOF_STATUS_PROVING_FINISHED;
    updateUserTradeVolumeFee(utvf).then(value => {
      uploadUserTradeVolumeFeeProof(value)
    });
  } catch (error) {
    utvf.status = PROOF_STATUS_INPUT_READY
    await updateUserTradeVolumeFee(utvf)
  }
}

async function uploadUserTradeVolumeFeeProof(utvf: UserTradeVolumeFee) {
  try {
    const proofReq = await buildUserTradeVolumeFeeProofReq(utvf);
    const proof = ethers.utils.arrayify(utvf.proof || "");
    let proofRes = sdk.ProveResponse.deserializeBinary(proof);

    const brevisRes = await brevis.submit(
      proofReq,
      proofRes,
      Number(utvf.src_chain_id),
      Number(utvf.dst_chain_id)
    );
    utvf.brevis_query_fee = brevisRes.fee;
    utvf.brevis_query_hash = brevisRes.id;
    utvf.status = PROOF_STATUS_PROOF_UPLOADED;
    updateUserTradeVolumeFee(utvf);
  } catch (err) {
    utvf.status = PROOF_STATUS_BREVIS_QUERY_ERROR;
    updateUserTradeVolumeFee(utvf);
    console.error(err);
  }
}

export {
  sendUserTradeVolumeFeeProvingRequest,
  uploadUserTradeVolumeFeeProof,
};
