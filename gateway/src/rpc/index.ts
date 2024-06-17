import { BigNumber, ethers } from "ethers";
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
        if (transactionReceipt == null || transactionReceipt == undefined) {
          console.debug("tx receipt not found", receipt.id, receipt.tx_hash);
          return;
        }
        if (Number(receipt.transaction_type) === TX_TYPE_ORDER_FEE_FLOW) {
          const result = getJSONForOrderFeeFlowTx(receipt.account, transactionReceipt)
          if (result.logsFound) {
            updateReceipt(
              receipt.id,
              STATUS_READY,
              result.data,
            );
          }
        } else if (Number(receipt.transaction_type) === TX_TYPE_EXECUTION) {
          const result = getJSONForExecutionTx(receipt.account, transactionReceipt)
          if (result.logsFound) {
            updateReceipt(
              receipt.id,
              STATUS_READY,
              result.data,
            );
          } 
        } else {
          console.error("unexpected transaction type")
        }
      }, null);
}

async function querySingleStorage(storage: any) {
  return sourceChainProvider.getStorageAt(storage.account, storage.key, Number(storage.blk_number)).then((value) => {
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
  transactionReceipt: ethers.providers.TransactionReceipt
) {
  let original: ReceiptInfo = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.transactionHash,
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
      BigNumber.from(log.topics[1]).eq(BigNumber.from(account))
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
      BigNumber.from(log.topics[1]).eq(BigNumber.from(account))
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
  transactionReceipt: ethers.providers.TransactionReceipt
) {
  let original: ReceiptInfo = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.transactionHash,
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
      BigNumber.from(log.topics[2]).eq(BigNumber.from(account))
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
    console.error(`empty execution_tx_receipt_id for trade ${trade.id}`)
    return 
  }

  receiptPromises.push(getReceipt(execution_tx_receipt_id))

  // updateTrade()

  const receipts = await Promise.all(receiptPromises);

  var volume = BigNumber.from(0)
  var fee  = BigNumber.from(0)
  for (var i = 0; i < receipts.length; i++) {
    const receipt = receipts[i] as Receipt
    if (receipt === undefined || receipt === null) {
      console.debug(`invalid receipt ${receipt}`)
      return 
    }

    if (Number(receipt.status) !== Number(STATUS_READY)) {
      console.debug(`receipt ${receipt.tx_hash} not ready`)
      return 
    }
    const data = JSON.parse(receipt.data);

    if (Number(receipt.transaction_type) === TX_TYPE_ORDER_FEE_FLOW) {
      for (var i = 1; i < data.fields.length; i+=2) {
        fee = fee.add(BigNumber.from(data.fields[i].value))
      }
    } else {
      for (var i = 0; i < (data.fields.length / 4); i++) {
        volume = volume.add(BigNumber.from(data.fields[i*4 + 1].value).abs().mul(BigNumber.from(data.fields[i*4 + 2].value)).div(BigNumber.from("1000000000000000000")))
        fee = fee.add(BigNumber.from(data.fields[i*4+3].value))
      }
    }
  }

  if (volume.eq(BigNumber.from(trade.volume)) && fee.eq(BigNumber.from(trade.fee))) {
    await updateTrade(trade.id, STATUS_READY)
  } else {
    console.debug(`trade: ${trade.id} volume:${trade.volume}, ${volume.toString()}, fee: ${trade.fee}, ${fee.toString()},`)
  }
}

export {
    querySingleReceipt,
    querySingleStorage,
    queryTrade
}