import { BigNumber, ethers } from "ethers";
import { STATUS_READY } from "../constants/index.ts";
import { updateReceipt } from "../db/index.ts";
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
          console.log("log.idx", log.logIndex, i)
          if (log.topics.length < 3) {
            // https://holesky.etherscan.io/tx/0x01e85fb445de6ad871565aeec390dab1d0c94bfa353e4142cf5584412812da51#eventlog
            // topics length not met, return 
            return 
          }

          let logAddress = log.address.toLowerCase()
          let topic0 = log.topics[0].toLowerCase();
          
          if (
            logAddress ===
              "0x9616BDC926880053545675561afbA23aD0455e47".toLowerCase() &&
            topic0.toLowerCase() ===
              "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
          ) {
            logsFound = true;
            data = JSON.stringify({
              block_num: transactionReceipt.blockNumber,
              tx_hash: transactionReceipt.transactionHash,
              fields: [
                // User Account
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: true,
                  field_index: 2,
                  value: log.topics[2].toLowerCase(),
                },
                // Amount 0
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: false,
                  field_index: 0,
                  value: "0x" + log.data.replace("0x", "").slice(0, 64),
                },
                // Amount 1
                {
                  contract: logAddress,
                  log_index: i,
                  event_id: topic0,
                  is_topic: false,
                  field_index: 1,
                  value: "0x" + log.data.replace("0x", "").slice(64, 128),
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


export {
    querySingleReceipt,
}