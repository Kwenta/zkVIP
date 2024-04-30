import { QueryParameter, DuneClient } from "@duneanalytics/client-sdk";
import * as dotenv from "dotenv";
import { BigNumber } from "ethers";

dotenv.config();
const client = new DuneClient(process.env.DUNE_API_KEY ?? "");
const queryId = 3677895;

type DuneResult = {
  txs: Array<string>,
  fee: string,
  volume: string,
}
export async function QueryOrderTxsByAccount(
  from: string,
  end: string,
  accountId: string
): Promise<DuneResult> {
  try {
    console.log("Client send dune query: ", (new Date()).toLocaleString(), from, end, accountId)
    const results = await client.runQuery({
      queryId: queryId,
      query_parameters: [
        QueryParameter.text("from", from),
        QueryParameter.text("to", end),
        QueryParameter.text("account_id", accountId),
      ],
    }).catch(error => {
      console.log("dune error", error)
    });
    // console.log("result returned: results", results, from, end, accountId)
    // const txs = Array<string>();
    // var fee = BigNumber.from(0)
    // var volume = BigNumber.from(0)

    // results.result?.rows.map((record) => {
    //   const tx_hash = record["evt_tx_hash"];
    //   const totalFees = record["totalFees"]
    //   const sizeDelta = record["sizeDelta"]
    //   const fillPrice = record["fillPrice"]

    //   fee = fee.add(BigNumber.from(totalFees))
    //   volume = volume.add(
    //     BigNumber.from(sizeDelta).abs().mul(BigNumber.from(fillPrice)).div(BigNumber.from("1000000000000000000"))
    //   )

    //   if (typeof tx_hash === "string" || tx_hash instanceof String) {
    //     txs.push(tx_hash.toString());
    //   } else {
    //     console.error("unknown type of dune result: ", tx_hash);
    //   }
    // });
    // console.log("dune result ready")
    // return {txs: txs, fee: fee.toString(), volume: volume.toString()};
    return {txs: [], fee: "0", volume: "0"};
  } catch (error) {
    console.log("dune error", error);
    console.error("dune result ready", error)

    return {txs: [], fee: "0", volume: "0"};
  }
}