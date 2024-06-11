import { BigNumber, ethers } from "ethers";
import { DelayedOrderSubmittedEvent, isValidPositionModifiedContract, OrderFlowFeeImposedEvent, OrderFlowFeeImposedEventContractAddress, PositionModifiedEvent, STATUS_READY, TX_TYPE_EXECUTION, TX_TYPE_ORDER_FEE_FLOW } from "../constants/index.ts";
import { updateReceipt, updateStorage } from "../db/index.ts";
import { sourceChainProvider } from "../ether_interactions/index.ts";

type Log = {
  contract: string,
  log_index: number,
  event_id: string,
  is_topic: boolean,
  field_index: number,
  value: string,
} 
type ReceiptInfo = {
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
          } else {
            console.log(`${transactionReceipt.transactionHash} not valid`)
          }
        } else if (Number(receipt.transaction_type) === TX_TYPE_EXECUTION) {
          const result = getJSONForExecutionFlowTx(receipt.account, transactionReceipt)
          if (result.logsFound) {
            updateReceipt(
              receipt.id,
              STATUS_READY,
              result.data,
            );
          } else {
            console.log(`${transactionReceipt.transactionHash} not valid`)
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
  let data = "";

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
  data = JSON.stringify(original)

  return {data: data, logsFound: original.fields.length == 4}
}

function getJSONForExecutionFlowTx(  
  account: string,
  transactionReceipt: ethers.providers.TransactionReceipt
) {
  let logsFound = false;
  let data = "";

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
      && topic0.toLowerCase() === PositionModifiedEvent && BigNumber.from(log.topics[2]).eq(BigNumber.from(account))
    ) {
      logsFound = true;
      data = JSON.stringify({
        block_num: transactionReceipt.blockNumber,
        tx_hash: transactionReceipt.transactionHash,
        fields: [
          // account
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: true,
            field_index: 2,
            value: log.topics[2].toLowerCase(),
          },
          // tradeSize
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: false,
            field_index: 2,
            value: "0x" + log.data.replace("0x", "").slice(2 * 64, 3 * 64),
          },
          // lastPrice
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: false,
            field_index: 3,
            value: "0x" + log.data.replace("0x", "").slice(3 * 64, 4 * 64),
          },  
          // fee
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: false,
            field_index: 5,
            value: "0x" + log.data.replace("0x", "").slice(5 * 64, 6 * 64),
          },   
        ],
      });
    }
  });
  return {data: data, logsFound: logsFound}
}

export {
    querySingleReceipt,
    querySingleStorage,
}