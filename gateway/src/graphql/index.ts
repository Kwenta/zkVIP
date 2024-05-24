import { GraphRpc, PoolAddr } from "./common.ts";

export const postSwapsQuery = async (
  recipient: string,
  pool: string = PoolAddr
) => {
  const txs: string[] = [];
  return fetch(GraphRpc, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `{
        swaps(orderBy: timestamp, orderDirection: desc, where: {pool:"${pool}", recipient: "${recipient}"}) 
      {
        transaction {
          id
        }
      }
    }`,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.errors !== undefined && res.errors !== null) {
        throw new Error("invalid gql response");
      }
      const swapList = res?.data?.swaps;
      swapList?.forEach((item: any) => {
        const tx = item.transaction.id
        txs.push(tx);
      });
      const errorInfo = null;
      return { txs: txs, error: errorInfo };
    })
    .catch((error) => {
      console.log("getPositions graphql error:", error);
      return { txs: [], error: error };
    });
};

export const getAvailableAccountIds = async() => {
  
}
