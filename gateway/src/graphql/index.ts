import { error } from "console";
import { GraphRpc, Trade } from "./common.ts";
import { getReceiptByHash, getTrade, insertReceipt } from "../db/index.ts";
import { TX_TYPE_EXECUTION, TX_TYPE_ORDER_FEE_FLOW } from "../constants/index.ts";

type PostGraphQLRes = {
  trades: Trade[],
  error: Error | null
}

export const getAllTradesWithin30Day = async (
  ts30Ago: number,
  tsClaimDayEnd: number
) => {
  var first = 10000
  var skip = 0
  const finalResult: PostGraphQLRes = {
    trades: [],
    error: null
  }
  while(true) {
    const result = await postGraphQL(ts30Ago, tsClaimDayEnd, skip, first)

    if (result.error != null) {
      finalResult.error = result.error
      return finalResult
    }

    if (result.trades.length == 0) {
      return finalResult
    }

    finalResult.trades.concat(result.trades)
    skip += first
  }
};

export const getAccountTradesMap = (
  trades: Trade[]
)  => {
  let map = new Map<string, Trade[]>()
  trades.forEach(trade => {
    const userTrades = map.get(trade.abstractAccount)
    if (userTrades === undefined) {
      map.set(trade.abstractAccount, [trade])
    } else {
      userTrades.push(trade)
    }
  })
  return map
};

export const saveTrades = async (
  trades: Trade[],
  account: string,
) => {
  const promises = Array<Promise<string>>();
 
  for (let i =0; i < trades.length; i++) {
    const trade = trades[i]
    const tradePromises = Array<Promise<string>>();
    // Promise.all(
    //   insertOrFindReceipt(trade.executionTxhash, account, TX_TYPE_EXECUTION),
    //   insertOrFindReceipt(trade.orderFeeFlowTxhash, account, TX_TYPE_ORDER_FEE_FLOW),
    // ).then () {

    // }

    if (trade.executionTxhash.length > 0) {
      tradePromises.push(insertOrFindReceipt(trade.executionTxhash, account, TX_TYPE_EXECUTION))
    } else {
      console.log(`invalid trade with empty executionTxhash ${trade}`)
      continue
    }

    if (trade.orderFeeFlowTxhash.length > 0) {
      tradePromises.push(insertOrFindReceipt(trade.orderFeeFlowTxhash, account, TX_TYPE_ORDER_FEE_FLOW))
    } else {
      tradePromises.push(Promise.resolve(""))
    }

    // const receiptIds = await Promise.all(tradePromises).cat
    // getTrade(receiptIds[0])
  }

  const results = await Promise.all(promises);
  return results.reduce(
    (accumulator, currentValue) => accumulator + "," + currentValue
  );
}

const insertOrFindReceipt = async(
  txHash: string,
  account: string,
  txType: number,
) => {
  let receipt = await getReceiptByHash(txHash)
  if (receipt === undefined || receipt === null) {
    receipt = await insertReceipt(txHash, account, BigInt(txType))
  }
  if (receipt === undefined || receipt === null) {
    throw new Error(`failed to insert receipt for txHash: ${txHash}, account: ${account}, txType: ${txType}`)
  }
  return receipt.id
}

const postGraphQL = async (
  tsStart: number,
  tsEnd: number,
  skip: number,
  first: number,
) =>   {
  try {
    const response = await fetch(GraphRpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{
            futuresTrades(orderBy: timestamp, orderDirection: asc, skip: ${skip}, first: ${first}, where: {timestamp_gte:"${tsStart}", timestamp_lte: "${tsEnd}"}) 
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
    // const swapList = res?.data?.swaps;
    const result: PostGraphQLRes = {
      trades: [],
      error: null,
    }
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.errors !== undefined && responseJson.errors !== null) {
        result.error = new Error(`invalid gql response errors: ${responseJson.errors} `) 
        return result
      }
      const trades: Trade[] =[]
      responseJson?.data?.futuresTrades?.forEach((element: any) => {
        trades.push({
          blockNumber: element.blockNumber,
          account: element.account,
          abstractAccount: element.abstractAccount,
          timestamp: element.timestamp,
          orderFeeFlowTxhash: element.orderFeeFlowTxhash ?? "",
          executionTxhash: element.executionTxhash,
        })
      });
      result.trades = trades
      return result
    } else {
      console.error("failed to get graphql response: ", response)
      result.error = new Error(`invalid graphql response skip: ${skip}, first: ${first}, where: {timestamp_gte:"${tsStart}", timestamp_lte: "${tsEnd}"`)
      return result
    }
  } catch (error) {
    console.error("faild to send graphql error:", error);
    const result: PostGraphQLRes = {
      trades: [],
      error: new Error(`faild to send graphql error: ${error}`),
    }
    return result
  }
}
