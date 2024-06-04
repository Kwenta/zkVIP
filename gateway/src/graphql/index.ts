import { GraphRpc, PoolAddr } from "./common.ts";

export const postSwapsQuery = async (
  timestamp30DAgo: number,
  startTimestamp: number,
  endTimestamp: number
) => {
  try {
    const res = await fetch(GraphRpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{
            futuresTrades(orderBy: timestamp, orderDirection: asc, where: {timestamp_gte:"${timestamp30DAgo}", timestamp_lte: "${endTimestamp}"}) 
          {
            blockNumber,
            account,
            abstractAccount,
            timestamp,
            orderFeeFlowTxhash,
            executionTxhash,
          }
        }`,
      }),
    });
    console.log(6677777, res);
    if (res.status === 200) {
      const resBody = await res.json();
      console.log(111222333, resBody);
    }
  } catch (error) {
    console.log("getPositions66 graphql error:", error);
    return { txs: [], error: error };
  }
};

export const getAvailableAccountIds = async () => {};
