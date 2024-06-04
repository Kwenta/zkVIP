import { GraphRpc, PoolAddr } from "./common.ts";

export const postSwapsQuery = async (
  timestamp30DAgo: number,
  startTimestamp: number,
  endTimestamp: number
) => {
  const a = JSON.stringify({
    query:
      '\n\n{\n        futuresTrades(orderBy: timestamp, orderDirection: asc, where: {timestamp_gte:"123456789", timestamp_lte: "123456789"}) \n      {\n        orderFeeFlowTxhash,\n        executionTxhash,\n      }\n    }',
  });
  const b = JSON.parse(a);

  console.log("bbbbb", b);
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
          futuresTrades(orderBy: timestamp, orderDirection: asc, where: {timestamp_gte:"123456789", timestamp_lte: "123456789"}) 
        {
          orderFeeFlowTxhash,
          executionTxhash,
        }
      }`,
      }),
    }
  )
    .then((r) => {
      r.json();
      console.log(333333, r);
    })
    .catch((error) => {
      console.log("getPositions graphql error:", error, a);
      return { txs: [], error: error };
    });
};

export const getAvailableAccountIds = async () => {};
