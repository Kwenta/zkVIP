import { ethers } from "ethers";
import { DelayedOrderSubmittedEvent, isValidPositionModifiedContract, OrderFlowFeeImposedEvent, OrderFlowFeeImposedEventContractAddress, PositionModifiedEvent, STATUS_READY, TX_TYPE_EXECUTION, TX_TYPE_ORDER_FEE_FLOW } from "../constants/index.ts";
import { getReceipt, updateReceipt, updateStorage, updateTrade } from "../db/index.ts";
import { sourceChainProvider } from "../ether_interactions/index.ts";
import { Receipt } from "../server/type.ts";

export type Log = {
  contract: string,
  log_index: number,
  event_id: string,
  is_topic: boolean,
  field_index: number,
  value: string,
} 
export type ReceiptInfo = {
  block_num: number,
  tx_hash: string,
  fields: Log[],
}

async function querySingleReceipt(receipt: any) {
    return sourceChainProvider
      .getTransactionReceipt(receipt.tx_hash)
      .catch((error) => {
        console.log(error, error);
      })
      .then((transactionReceipt) => {
        console.log(`${receipt.tx_hash}  ${transactionReceipt?.hash}`)
        if (transactionReceipt == null || transactionReceipt == undefined) {
          console.debug("tx receipt not found", receipt.id, receipt.tx_hash);
          return;
        }

        var shouldBeFilteredOut = transactionReceipt.logs.length > 128

        transactionReceipt.logs.forEach(log => {
          if (log.data.length >= 1000) {
            shouldBeFilteredOut = true
          }
        })

        if (Number(receipt.transaction_type) === TX_TYPE_ORDER_FEE_FLOW) {
          const result = getJSONForOrderFeeFlowTx(receipt.account, transactionReceipt)
          if (result.logsFound) {
            updateReceipt(
              receipt.tx_hash,
              receipt.account,
              receipt.transaction_type,
              STATUS_READY,
              result.data,
              shouldBeFilteredOut
            );
          } else {
            console.debug(`${receipt.tx_hash} is not a order fee flow tx: ${result.data}`)
          }
        } else if (Number(receipt.transaction_type) === TX_TYPE_EXECUTION) {
          const result = getJSONForExecutionTx(receipt.account, transactionReceipt)
          if (result.logsFound) {
            updateReceipt(
              receipt.tx_hash,
              receipt.account,
              receipt.transaction_type,
              STATUS_READY,
              result.data,
              shouldBeFilteredOut
            );
          } else {
            console.debug(`${receipt.tx_hash} is not a execution tx: ${result.data}`)
          }
        } else {
          console.error("unexpected transaction type")
        }
      }, null);
}

async function querySingleStorage(storage: any) {
  return sourceChainProvider.getStorage(storage.account, storage.key, Number(storage.blk_number)).then((value) => {
    if (value == null || value == void 0) {
      console.debug("storage not found", storage.id, storage.tx_hash);
      return;
    }
    updateStorage(
      storage.id,
      STATUS_READY,
      value,
      JSON.stringify({
        account: storage.account,
        key: storage.key,
        value,
        blk_number: storage.blk_number
      })
    );
  }, null);
}

function getJSONForOrderFeeFlowTx(
  account: string,
  transactionReceipt: ethers.TransactionReceipt
) {
  let original: ReceiptInfo = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.hash,
    fields: [],
  };

  transactionReceipt.logs.forEach((log, i) => {
    if (log.topics.length < 2) {
      return 
    }

    let logAddress = log.address.toLowerCase()
    let topic0 = log.topics[0].toLowerCase();
    
    if (topic0.toLowerCase() === DelayedOrderSubmittedEvent && !isValidPositionModifiedContract(logAddress)) {
      console.log(`${logAddress}`)
    }

    // OrderFlowFee Events
    if (
      logAddress === OrderFlowFeeImposedEventContractAddress &&
      topic0.toLowerCase() === OrderFlowFeeImposedEvent &&
      log.topics[1].toLowerCase() === account.toLowerCase()
    ) {
      // OrderFlowFeeImposed account
      original.fields.push({
        contract: OrderFlowFeeImposedEventContractAddress,
        log_index: i,
        event_id: OrderFlowFeeImposedEvent,
        is_topic: true,
        field_index: 1,
        value: account,
      })
      // OrderFlowFeeImposed amount
      original.fields.push({
        contract: OrderFlowFeeImposedEventContractAddress,
        log_index: i,
        event_id: OrderFlowFeeImposedEvent,
        is_topic: false,
        field_index: 0,
        value: "0x" + log.data.replace("0x", "").slice(0, 64),
      })
    } else  if (
      isValidPositionModifiedContract(logAddress) &&
      topic0.toLowerCase() === DelayedOrderSubmittedEvent &&
      log.topics[1].toLowerCase() === account.toLowerCase()
    ) {
      // DelayedOrderSubmittedEvent account
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: DelayedOrderSubmittedEvent,
        is_topic: true,
        field_index: 1,
        value: account,
      })
      // DelayedOrderSubmittedEvent keeperDeposit
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: DelayedOrderSubmittedEvent,
        is_topic: false,
        field_index: 6,
        value: "0x" + log.data.replace("0x", "").slice(6 * 64, 7 * 64),
      })
    }
  });
  const data = JSON.stringify(original)

  return {data: data, logsFound: original.fields.length >= 4 && original.fields.length % 4 == 0 }
}

function getJSONForExecutionTx(  
  account: string,
  transactionReceipt: ethers.TransactionReceipt
) {
  let original: ReceiptInfo = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.hash,
    fields: [],
  };

  transactionReceipt.logs.forEach((log, i) => {
    if (log.topics.length < 3) {
      return 
    }

    let logAddress = log.address.toLowerCase()
    let topic0 = log.topics[0].toLowerCase();
    
    if (topic0.toLowerCase() === PositionModifiedEvent && !isValidPositionModifiedContract(logAddress)) {
      console.log(`${logAddress}`)
    }

    // PositionModified Event 
    if (
      isValidPositionModifiedContract(logAddress)
      && topic0.toLowerCase() === PositionModifiedEvent && 
      log.topics[2].toLowerCase() === account.toLowerCase()
    ) {
      // account
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: true,
        field_index: 2,
        value: log.topics[2].toLowerCase(),
      })

      // tradeSize
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: false,
        field_index: 2,
        value: "0x" + log.data.replace("0x", "").slice(2 * 64, 3 * 64),
      })

      // lastPrice
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: false,
        field_index: 3,
        value: "0x" + log.data.replace("0x", "").slice(3 * 64, 4 * 64),
      })

      // fee
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: false,
        field_index: 5,
        value: "0x" + log.data.replace("0x", "").slice(5 * 64, 6 * 64),
      })
    }
  });

  const data = JSON.stringify(original)

  return {data: data, logsFound: original.fields.length >= 4 && original.fields.length % 4 == 0}
}

async function queryTrade(trade: any) {
  const order_fee_flow_tx_receipt_id = trade.order_fee_flow_tx_receipt_id
  const receiptPromises = Array<Promise<any>>();
  if (order_fee_flow_tx_receipt_id.length > 0) {
    receiptPromises.push(getReceipt(order_fee_flow_tx_receipt_id))
  }

  const execution_tx_receipt_id = trade.execution_tx_receipt_id
  
  if (execution_tx_receipt_id.length === 0) {
    console.error(`empty execution_tx_receipt_id for trade ${trade.account}-${trade.execution_tx_receipt_id}`)
    return 
  }

  receiptPromises.push(getReceipt(execution_tx_receipt_id))

  const receipts = await Promise.all(receiptPromises);

  var volume = BigInt(0)
  var fee  = BigInt(0)

  var debugFee = ""
  var debugVolume = ""

  for (var receiptIndex = 0; receiptIndex < receipts.length; receiptIndex++) {
    const receipt = receipts[receiptIndex] as Receipt
    if (receipt === undefined || receipt === null) {
      return 
    }

    if (Number(receipt.status) !== Number(STATUS_READY)) {
      return 
    }
    const data = JSON.parse(receipt.data);

    if (Number(receipt.transaction_type) === TX_TYPE_ORDER_FEE_FLOW) {
      debugFee += ` order fee flow tx ${receipt.tx_hash} `
      for (var i = 1; i < data.fields.length; i+=2) {
        fee = fee + BigInt(data.fields[i].value)

        debugFee += ` fee: ${data.fields[i].value} `
      }
    } else {
      debugFee += ` execution tx ${receipt.tx_hash} `
      debugVolume += ` execution tx ${receipt.tx_hash} `
      for (let i = 0; i < data.fields.length / 4; i++) {
        var size = BigInt.asIntN(256, BigInt("0x"+data.fields[i*4 + 1]));
        if (size < 0) {
          size = -size;
        }
        volume = volume + size * BigInt("0x"+data.fields[i*4 + 2].value) / BigInt("1000000000000000000")
        fee = fee + BigInt(data.fields[i*4+3].value)

        debugFee += ` fee: ${data.fields[i*4+3].value} `
      }
    }
  }

  if (volume !== BigInt(trade.volume)) {
    console.debug(`trade volume-not-match: account ${trade.account}. expected: ${trade.volume}. Debug-info: ${debugVolume}`)
  } else if (fee !== BigInt(trade.fee)) {
    console.debug(`trade fee-not-match: account ${trade.account}. Debug info: ${debugFee}`)
  }
  await updateTrade(trade.execution_tx_receipt_id, trade.account, STATUS_READY)
}

export {
    querySingleReceipt,
    querySingleStorage,
    queryTrade
}