import { GraphRpc, PoolAddr } from "./common.ts";

export const postSwapsQuery = async (
  timestamp30DAgo: number,
  startTimestamp: number,
  endTimestamp: number
) => {
  return fetch(
    "https://subgraph.satsuma-prod.com/616cc2144c5c/kwenta/optimism-perps/version/0.0.22/api",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{
          futuresTrades(orderBy: timestamp, orderDirection: asc, where: {timestamp_gte:"${timestamp30DAgo}", timestamp_lte: "${endTimestamp}"}) 
        {
          orderFeeFlowTxhash,
          executionTxhash,
          account,
          abstractAccount,
          blockNumber,
        }
      }`,
      }),
    }
  )
  .then((r) => {
      return r.json();
  })
  .then((response) => {
    console.log("response", response?.data?.futuresTrades)
  })
  .catch((error) => {
    console.log("graphql error:", error, );
    return { txs: [], error: error };
  });
};

export const getAvailableAccountIds = async () => {};
