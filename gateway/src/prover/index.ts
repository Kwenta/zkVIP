import * as sdk from "brevis-sdk-typescript";
import { Receipt, Trade, UserTradeVolumeFee } from "../server/type.ts";
import {
  getReceipt,
  getTrade,
  getUserTradeVolumeFee,
  updateUserTradeVolumeFee,
} from "../db/index.ts";
import {
  isValidPositionModifiedContract,
  PositionModifiedContracts,
  PositionModifiedEvent,
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_PROOF_UPLOAD_SENT,
  PROOF_STATUS_PROOF_UPLOADED,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
  PROOF_STATUS_PROVING_SENT,
  STATUS_READY,
  TX_TYPE_EXECUTION,
  TX_TYPE_ORDER_FEE_FLOW,
} from "../constants/index.ts";
import { BigNumber, Contract, ethers } from "ethers";

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

type DebugReceipt = {
  data: any;
  tx_hash: string;
  index: number;
}

const brevis = new Brevis("appsdk.brevis.network:11080");

const buildUserTradeVolumeFeeProofReq = async (utvf: UserTradeVolumeFee) => {
  const proofReq = new ProofRequest();
  const tradeIds = utvf.trade_ids.split(",");
  const startBlkNum = Number(utvf.start_blk_num)
  const endBlkNum = Number(utvf.end_blk_num)

  let tradePromises = Array<Promise<Trade | undefined>>();
  for (let i = 0; i < tradeIds.length; i++) {
    tradePromises.push(
      getTrade(tradeIds[i], utvf.account).then((value) => {
        const r = value as Trade;
        if (r === undefined || r === null) {
          return undefined;
        } else {
          return r;
        }
      })
    );
  }

  const trades = await Promise.all(tradePromises)
  const validTrades: Trade[] = []
  trades.forEach(trade => {
    if (trade !== undefined) {
      validTrades.push(trade)
    }
  })

  validTrades.sort((a,b) => {
    if (a.execution_tx_block_number < b.execution_tx_block_number) {
      return -1
    } else {
      return 1
    }
  })

  const receiptIds: string[] = []
  validTrades.forEach(trade => {
    if (trade.order_fee_flow_tx_receipt_id.length > 0) {
      receiptIds.push(trade.order_fee_flow_tx_receipt_id)
    }
    if (trade.execution_tx_receipt_id.length > 0) {
      receiptIds.push(trade.execution_tx_receipt_id)
    }
  })

  let receiptPromises = Array<Promise<Receipt | undefined>>();
  for (let i = 0; i < receiptIds.length; i++) {
    receiptPromises.push(
      getReceipt(receiptIds[i]).then((value) => {
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

  const receipts = await Promise.all(receiptPromises);

  const validReceipts: Receipt[] = []
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    if (receipt === undefined) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready"); 
    }

    validReceipts.push(receipt)
  }

  validReceipts.sort((a,b) => {
    const dataA = JSON.parse(a.data);
    const blkNumberA= Number(dataA.block_num)

    const dataB = JSON.parse(b.data);
    const blkNumberB= Number(dataB.block_num)
    
    if (blkNumberA < blkNumberB) {
      return -1
    } else if (blkNumberA == blkNumberB && Number(dataA.transaction_type) < Number(dataB.transaction_type)) {
      return -1
    } else {
      return 1
    }
  })

  var unclaimableTrades = validTrades.filter(trade => {
    const bn = trade?.execution_tx_block_number ?? 0
    return (Number(bn) >= startBlkNum -  43200 * 30) && (((Number(bn)) < startBlkNum))
  })

  if (unclaimableTrades.length > 4400) {
    // Sort unclaimableTrades by volume desc
    unclaimableTrades.sort((a, b) => {
      if (BigNumber.from(a.volume).gt(BigNumber.from(b.volume))) {
        return -1 
      } else {
        return 1
      }
    })

    // Use the first 4400 trade to calculate the largest volume
    unclaimableTrades = unclaimableTrades.slice(0,4400)

    // Sort unclaimableTrades by block number asc to fit circuit input
    unclaimableTrades.sort((a,b) => {
      if (Number(a.execution_tx_block_number) < Number(b.execution_tx_block_number)) {
        return -1
      } else {
        return 1
      }
    })
  }

  const claimableTrades = validTrades.filter(trade => {
    const bn = trade?.execution_tx_block_number ?? 0
    return (Number(bn) >= startBlkNum) && ((Number(bn) <= endBlkNum))
  })

  var proverIndex = -1
  var claimableReceiptIndex = 0
  if (unclaimableTrades.length <= 216 && claimableTrades.length <= 20) {
    proverIndex = 0
    claimableReceiptIndex = 216
  } else if (unclaimableTrades.length <= 412 && claimableTrades.length <= 50) {
    proverIndex = 1
    claimableReceiptIndex = 412
  } else if (unclaimableTrades.length <= 4400 && claimableTrades.length <=300) {
    proverIndex = 2
    claimableReceiptIndex = 4400
  } else if (claimableTrades.length > 300) {
    console.error("unsupport no claimable trades")
  } else {
    console.error(`claimable trades out of range: ${claimableTrades.length}`)
  }

  const debugReceipts: DebugReceipt[] = []
  var unClaimableReceiptIndex = 0
  unclaimableTrades.forEach(trade => {
    const receipt = validReceipts.find(value => {
      return value.id === trade.execution_tx_receipt_id
    })
    if (receipt === undefined) {
      return;
    }
    const data = JSON.parse(receipt.data);
    const blkNumber= Number(data.block_num)
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data)
    }
    console.log(`Add unclaimable receipt blk: ${data.block_num}`)

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
      unClaimableReceiptIndex++
    );

    debugReceipts.push({
      data: data,
      tx_hash: receipt.tx_hash,
      index: unClaimableReceiptIndex - 1
    })
  })

  claimableTrades.forEach(trade => {
    const orderFeeFlowTxReceipt = validReceipts.find(value => {
      return value.id === trade.order_fee_flow_tx_receipt_id
    })
    if (orderFeeFlowTxReceipt === undefined) {
      return;
    }
    const orderFeeFlowData = JSON.parse(orderFeeFlowTxReceipt.data);
    const blkNumber= Number(orderFeeFlowData.block_num)
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", orderFeeFlowData)
    }

    console.log(`Add claimable receipt 0 blk: ${orderFeeFlowData.block_num}`)

    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(orderFeeFlowData.block_num),
        tx_hash: orderFeeFlowTxReceipt.tx_hash,
        fields: [
          new sdk.Field(orderFeeFlowData.fields[0]),
          new sdk.Field(orderFeeFlowData.fields[1]),
          new sdk.Field(orderFeeFlowData.fields[2]),
          new sdk.Field(orderFeeFlowData.fields[3]), 
        ],
      }),
      claimableReceiptIndex++
    );
    debugReceipts.push({
      data: orderFeeFlowData,
      tx_hash: orderFeeFlowTxReceipt.tx_hash,
      index: claimableReceiptIndex - 1
    })

    const executionTxReceipt = validReceipts.find(value => {
      return value.id === trade.execution_tx_receipt_id
    })
    if (executionTxReceipt === undefined) {
      return;
    }
    const executionTxReceiptData = JSON.parse(executionTxReceipt.data);
    const executionTxReceiptBlk= Number(executionTxReceiptData.block_num)
    if (isNaN(executionTxReceiptBlk)) {
      console.error(`invalid receipt id ${executionTxReceipt.id} block number ${executionTxReceipt.data}`)
    }

    console.log(`Add claimable receipt 1 blk: ${executionTxReceiptData.block_num}`)

    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(executionTxReceiptData.block_num),
        tx_hash: executionTxReceipt.tx_hash,
        fields: [
          new sdk.Field(executionTxReceiptData.fields[0]),
          new sdk.Field(executionTxReceiptData.fields[1]),
          new sdk.Field(executionTxReceiptData.fields[2]),
          new sdk.Field(executionTxReceiptData.fields[3]), 
        ],
      }),
      claimableReceiptIndex++
    );

    debugReceipts.push({
      data: executionTxReceiptData,
      tx_hash: executionTxReceipt.tx_hash,
      index: claimableReceiptIndex -  1
    })

  })

  const account = BigNumber.from(utvf.account).toHexString()
  
  const contracts = PositionModifiedContracts.map(value => {
    return asUint248(value)
  })

  const paddingIndex = 512 - contracts.length
  for (let i = 0; i <paddingIndex; i++) {
    contracts.push(asUint248("0x0"))
  }

  isValidPositionModifiedContract
  proofReq.setCustomInput({
    Account: asUint248(account),
    StartBlkNum: asUint248(utvf.start_blk_num.toString()),
    EndBlkNum: asUint248(utvf.end_blk_num.toString()),
    Contracts: contracts,
    ContractsHash: sdk.asBytes32("0x0f4609cd4bed42d65042468a77bd40822cec9a83414e4406c16135b9406ecc46")
  });

  const debugRequest = JSON.stringify({
    receipts: debugReceipts,
    contracts: PositionModifiedContracts,
    start: utvf.start_blk_num.toString(),
    account: account,
    end: utvf.end_blk_num.toString()
  })

  console.debug(`${debugRequest}`)

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
      console.log(`send prepare query request ${ r.proofReq.getReceipts()}`)
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
    console.log("error ", error)
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
