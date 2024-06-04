import { GraphRpc, PoolAddr } from "./common.ts";

export const postSwapsQuery = async (
  timestamp30DAgo: number,
  startTimestamp: number,
  endTimestamp: number,
) => {
  return fetch(GraphRpc, {
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
      }
    }`,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res)
      // if (res.errors !== undefined && res.errors !== null) {
      //   throw new Error("invalid gql response");
      // }
      // const swapList = res?.data?.swaps;
      // swapList?.forEach((item: any) => {
      //   const tx = item.transaction.id
      //   txs.push(tx);
      // });
      // const errorInfo = null;
      // return { txs: txs, error: errorInfo };
    })
    .catch((error) => {
      console.log("getPositions graphql error:", error);
      return { txs: [], error: error };
    });
};

export const getAvailableAccountIds = async() => {
  
}
