import { BigNumber, ethers } from "ethers";
import { STATUS_READY } from "../constants/index.ts";
import { updateReceipt, updateStorage } from "../db/index.ts";
import { sourceChainProvider } from "../ether_interactions/index.ts";

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
        let logsFound = false;
        let data = "";
        transactionReceipt.logs.forEach((log, i) => {
          if (log.topics.length < 3) {
            return 
          }

          let logAddress = log.address.toLowerCase()
          let topic0 = log.topics[0].toLowerCase();
          
          if (
            logAddress ===
              "0x0A2AF931eFFd34b81ebcc57E3d3c9B1E1dE1C9Ce".toLowerCase() &&
            topic0.toLowerCase() ===
              "0x460080a757ec90719fe90ab2384c0196cdeed071a9fd7ce1ada43481d96b7db5"
          ) {
            logsFound = true;
            data = JSON.stringify({
              block_num: transactionReceipt.blockNumber,
              tx_hash: transactionReceipt.transactionHash,
              fields: [
                // accountId
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: true,
                  field_index: 2,
                  value: log.topics[2].toLowerCase(),
                },
                // fillPrice
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: false,
                  field_index: 0,
                  value: "0x" + log.data.replace("0x", "").slice(0, 64),
                },
                // sizeDelta
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: false,
                  field_index: 3,
                  value: "0x" + log.data.replace("0x", "").slice(64 * 3, 64 * 4),
                },  
                // totalFees
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: false,
                  field_index: 5,
                  value: "0x" + log.data.replace("0x", "").slice(64 * 5, 64 * 6),
                },   
              ],
            });
          }
        });
  
        if (logsFound) {
          updateReceipt(
            receipt.id,
            STATUS_READY,
            data,
          );
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

export {
    querySingleReceipt,
    querySingleStorage,
}