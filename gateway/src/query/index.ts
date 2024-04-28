import { QueryParameter, DuneClient } from "@duneanalytics/client-sdk";
import * as dotenv from "dotenv";

dotenv.config();
const client = new DuneClient(process.env.DUNE_API_KEY ?? "");
const queryId = 3677895;

export async function QueryOrderTxsByAccount(
  from: string,
  end: string,
  accountId: string
): Promise<Array<string>> {
  try {
    const results = await client.runQuery({
      queryId: queryId,
      query_parameters: [
        QueryParameter.text("from", from),
        QueryParameter.text("to", end),
        QueryParameter.text("account_id", accountId),
      ],
    });
    const txs = Array<string>();
    results.result?.rows.map((record) => {
      const tx_hash = record["evt_tx_hash"];
      if (typeof tx_hash === "string" || tx_hash instanceof String) {
        txs.push(tx_hash.toString());
      } else {
        console.error("unknown type of dune result: ", tx_hash);
      }
    });
    return txs;
  } catch (error) {
    console.log("dune error", error);
    return [];
  }
}