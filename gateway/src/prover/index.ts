import * as sdk from "brevis-sdk-typescript";
import { Receipt, UserTradeVolumeFee } from "../server/type.ts";
import {
  getReceipt,
  getUserTradeVolumeFee,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import {
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_PROOF_UPLOAD_SENT,
  PROOF_STATUS_PROOF_UPLOADED,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
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

const provers = [
  new Prover("222.74.153.228:53248"),
  new Prover("222.74.153.228:53249"),
  new Prover("222.74.153.228:53250")
]

const brevis = new Brevis("appsdk.brevis.network:11080");

const buildUserTradeVolumeFeeProofReq = async (utvf: UserTradeVolumeFee) => {
  const proofReq = new ProofRequest();
  const ids = utvf.receipt_ids.split(",");
  let promises = Array<Promise<Receipt | undefined>>();
  const startBlkNum = Number(utvf.start_blk_num)
  const endBlkNum = Number(utvf.end_blk_num)
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

  var unclaimableReceiptIndexes = Array<number>();
  var claimableReceiptIndexes = Array<number>();

  const sortedReceipts = new Array<Receipt>()
  for (let i = 0; i < results.length; i++) {
    const receipt = results[i];
    if (receipt === undefined) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready"); 
    }
    sortedReceipts.push(receipt)
  }

  sortedReceipts.sort((a,b) => {
    const dataA = JSON.parse(a.data);
    const blkNumberA= Number(dataA.block_num)

    const dataB = JSON.parse(b.data);
    const blkNumberB= Number(dataB.block_num)

    if (blkNumberA === 13414538 || blkNumberB === 13414538) {
      console.log("compare" , blkNumberA, blkNumberB)
    }
    
    if (blkNumberA < blkNumberB) {
      return -1
    } else {
      return 1
    }
  })

  for (let i = 0; i < sortedReceipts.length - 1; i++) {
    const receipt0 = sortedReceipts[i];
    const data0 = JSON.parse(receipt0.data);
    const blkNumber0= Number(data0.block_num)

    const receipt1 = sortedReceipts[i+1];
    const data1 = JSON.parse(receipt1.data);
    const blkNumber1= Number(data1.block_num)

    if (blkNumber0 > blkNumber1) {
      console.log("unsorted: ", blkNumber0, blkNumber1)
    }
  }

  for (let i = 0; i < sortedReceipts.length; i++) {
    const receipt = sortedReceipts[i];
    const data = JSON.parse(receipt.data);
    const blkNumber= Number(data.block_num)
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data)
    }

    if (blkNumber >= startBlkNum && blkNumber <= endBlkNum) {
      claimableReceiptIndexes.push(i)
    } else if (blkNumber < startBlkNum && blkNumber >= startBlkNum - 43200 * 30) {
      unclaimableReceiptIndexes.push(i)
    } else {
      console.error("out of range  receipt block number", data)
    }
  }

  var proverIndex = -1
  var initialClaimableReceiptIndex = 0
  if (unclaimableReceiptIndexes.length <= 236 && claimableReceiptIndexes.length <= 20) {
    proverIndex = 0
    initialClaimableReceiptIndex = 236
  } else if (unclaimableReceiptIndexes.length <= 462 && claimableReceiptIndexes.length <= 50) {
    proverIndex = 1
    initialClaimableReceiptIndex = 462
  } else if (unclaimableReceiptIndexes.length <= 4700 && claimableReceiptIndexes.length <=300) {
    proverIndex = 2
    initialClaimableReceiptIndex = 4700
  } else if (claimableReceiptIndexes.length == 0) {
    console.error("no claimable receipts")
  } else {
    console.error("receipts out of range", results.length)
  }

  var receiptIndex = 0
  unclaimableReceiptIndexes.forEach(index => {
    const receipt = results[index];
    if (receipt === undefined) {
      return;
    }
    const data = JSON.parse(receipt.data);
    const blkNumber= Number(data.block_num)
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data)
    }

    console.log(data.block_num)
    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(data.block_num),
        tx_hash: receipt.tx_hash,
        fields: [
          new sdk.Field(data.fields[0]),
          new sdk.Field(data.fields[1]),
          new sdk.Field(data.fields[2]),
          new sdk.Field(data.fields[3]), 
        ],
      }),
      receiptIndex++
    );
  })

  claimableReceiptIndexes.forEach(index => {
    const receipt = results[index];
    if (receipt === undefined) {
      return;
    }
    const data = JSON.parse(receipt.data);
    const blkNumber= Number(data.block_num)
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data)
    }

    console.log(data.block_num)

    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(data.block_num),
        tx_hash: receipt.tx_hash,
        fields: [
          new sdk.Field(data.fields[0]),
          new sdk.Field(data.fields[1]),
          new sdk.Field(data.fields[2]),
          new sdk.Field(data.fields[3]), 
        ],
      }),
      initialClaimableReceiptIndex++
    );
  })

  const accountIdHex = BigNumber.from(utvf.account).toHexString()
  
  proofReq.setCustomInput({
    AccountId: asUint248(accountIdHex),
    StartBlkNum: asUint248(utvf.start_blk_num.toString()),
    EndBlkNum: asUint248(utvf.end_blk_num.toString()),
  });

  return {proofReq: proofReq, proverIndex: proverIndex};
};

async function sendUserTradeVolumeFeeProvingRequest(utvfOld: UserTradeVolumeFee) {
  const utvf = await getUserTradeVolumeFee(utvfOld.id)
  if (utvf.status != PROOF_STATUS_INPUT_READY) {
    return 
  }

  utvf.status = PROOF_STATUS_PROVING_SENT
  await updateUserTradeVolumeFee(utvf)
  try {
    console.log("Start to Build Proof Request: ", utvf.id, (new Date()).toLocaleString())
    const r = await buildUserTradeVolumeFeeProofReq(utvf);
    console.log("User Circuit Proof Request Sent: ", utvf.id, (new Date()).toLocaleString())
    if (r.proverIndex < 0) {
      console.log("Cannot proceed cause prover index is invalid", utvf.id, (new Date()).toLocaleString())
      return 
    }
    const proofRes = await provers[r.proverIndex].proveAsync(r.proofReq);
    console.log("proofRes proof_id ready",proofRes.proof_id, (new Date()).toLocaleString())
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

    // Save prover id in case prepare query failed
    utvf.prover_id = proofRes.proof_id
    await updateUserTradeVolumeFee(utvf)

    try {
      console.log("send prepare query request", (new Date()).toLocaleString())
      const prepareQueryResponse = await brevis.prepareQuery(
        r.proofReq, 
        proofRes.circuit_info, 
        Number(utvf.src_chain_id),
        Number(utvf.dst_chain_id)
      )

      if (prepareQueryResponse.has_err) {
        const err = prepareQueryResponse.err;
        console.error("Failed to prepare query", err, utvf.id)
        utvf.status = PROOF_STATUS_BREVIS_QUERY_ERROR
        updateUserTradeVolumeFee(utvf)
        return 
      }
      console.log('Ready to submit brevis query hash', prepareQueryResponse.query_hash, (new Date()).toLocaleString());
      utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED
      utvf.brevis_query_fee = prepareQueryResponse.fee
      utvf.brevis_query_hash = prepareQueryResponse.query_hash

      updateUserTradeVolumeFee(utvf).then(value => {
        uploadUserTradeVolumeFeeProof(value)
      }).then();
    } catch (error) {
      console.error("Failed to prepare query", error, utvf.id)
      utvf.status = PROOF_STATUS_BREVIS_QUERY_ERROR
      updateUserTradeVolumeFee(utvf)
    }
  } catch (error) {
    console.log("Prove failed back to PROOF_STATUS_INPUT_READY: ", utvf.id, (new Date()).toLocaleString())
    utvf.status = PROOF_STATUS_INPUT_READY
    await updateUserTradeVolumeFee(utvf)
  }
}

async function uploadUserTradeVolumeFeeProof(utvfOld: UserTradeVolumeFee) {
  const utvf = await getUserTradeVolumeFee(utvfOld.id)
  if (utvf.status != PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED) {
    return 
  }

  utvf.status = PROOF_STATUS_PROOF_UPLOAD_SENT
  await updateUserTradeVolumeFee(utvf)

  try {
    console.log("Proof upload sent: ", utvf.id, utvf.prover_id, (new Date()).toLocaleString())  
    const r = await buildUserTradeVolumeFeeProofReq(utvf);
    if (r.proverIndex < 0) {
      console.log("Cannot proceed upload proof cause prover index is invalid", utvf.id, (new Date()).toLocaleString())
      return 
    }
    const getProofRes = await provers[r.proverIndex].getProof(utvf.prover_id)
    if (getProofRes.has_err) {
      console.error(getProofRes.err.msg);
      utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED
      await updateUserTradeVolumeFee(utvf)
      return;
    } else if (getProofRes.proof.length === 0) {
      utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED
      await updateUserTradeVolumeFee(utvf)
      return;
    }

    await brevis.submitProof(
      utvf.brevis_query_hash,
      Number(utvf.dst_chain_id),
      getProofRes.proof
    );
   
    utvf.status = PROOF_STATUS_PROOF_UPLOADED;

    console.log("Proof uploaded: ", utvf.id, (new Date()).toLocaleString())

    updateUserTradeVolumeFee(utvf);
  } catch (err) {
    utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
    updateUserTradeVolumeFee(utvf);
    console.error(err);
  }
}

export {
  sendUserTradeVolumeFeeProvingRequest,
  uploadUserTradeVolumeFeeProof,
};
