import { error } from "console";
import { GraphRpc, Trade } from "./common.ts";
import { getReceiptByHash, getTrade, insertReceipt, insertTrade } from "../db/index.ts";
import { TX_TYPE_EXECUTION, TX_TYPE_ORDER_FEE_FLOW } from "../constants/index.ts";
import { BigNumber } from "ethers";

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

    finalResult.trades = finalResult.trades.concat(result.trades)
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

export const batchTradesWithSameTxAccount = (trades: Trade[]) => {
  let map = new Map<string, Trade[]>()
  trades.forEach(trade => {
    const userTrades = map.get(trade.executionTxhash)
    if (userTrades === undefined) {
      map.set(trade.executionTxhash, [trade])
    } else {
      userTrades.push(trade)
    }
  })

  const result :Trade[] = []
  for (let [key, trades] of map) {
    const trade = trades.reduce((t0, t1) => {
      var orderFeeFlowTxhash = t0.orderFeeFlowTxhash
      if (orderFeeFlowTxhash.length === 0) {
        orderFeeFlowTxhash = t1.orderFeeFlowTxhash
      }
      return {
        blockNumber: t0.blockNumber,
        account: t0.account,
        abstractAccount: t0.abstractAccount,
        timestamp: t0.timestamp,
        orderFeeFlowTxhash: orderFeeFlowTxhash,
        executionTxhash: t0.executionTxhash,
        volume: BigNumber.from(t0.volume).add(t1.volume).toString(),
        feesPaid: BigNumber.from(t0.feesPaid).add(t1.feesPaid).toString()
      }
    })
    
    console.log(`key: ${key}, trade.executionTxhash: ${trade.executionTxhash}, trade.orderFeeFlowTxhash: ${trade.orderFeeFlowTxhash}`)

    result.push(trade)
  }

  return result
}

export const saveTrades = async (
  trades: Trade[],
  account: string,
) => {
  const promises = Array<Promise<string>>();
 
  const batchedTrade = batchTradesWithSameTxAccount(trades)
  for (let i =0; i < batchedTrade.length; i++) {
    const trade = batchedTrade[i]
    
    var executionTxId = ""
    var orderFlowTxId = ""

    if (trade.executionTxhash.length > 0) {
      executionTxId = await insertOrFindReceipt(trade.executionTxhash, account, TX_TYPE_EXECUTION)
    } else {
      console.log(`invalid trade with empty executionTxhash ${trade}`)
      continue
    }

    if (trade.orderFeeFlowTxhash.length > 0) {
      orderFlowTxId = await insertOrFindReceipt(trade.orderFeeFlowTxhash, account, TX_TYPE_ORDER_FEE_FLOW)
    } else {
      orderFlowTxId = ''
    }

    promises.push(insertOrFindTrade(
      executionTxId,
      orderFlowTxId,
      trade,
    ))
  }

  const results = await Promise.all(promises);
  return results.reduce(
    (accumulator, currentValue) => accumulator + "," + currentValue
  );
}

const insertOrFindTrade = async(
  execution_tx_receipt_id: string,
  order_fee_flow_tx_receipt_id: string,
  tradeInfo: Trade,
) => {
  var trade = await getTrade(execution_tx_receipt_id, tradeInfo.abstractAccount)

  if (trade === undefined || trade === null) {
    trade = await insertTrade(
      tradeInfo,
      order_fee_flow_tx_receipt_id, 
      execution_tx_receipt_id
      )
  }
  if (trade === undefined || trade === null) {
    throw new Error(`failed to insert trade for order_fee_flow_tx_receipt_id: ${order_fee_flow_tx_receipt_id}, execution_tx_receipt_id: ${execution_tx_receipt_id}, trade: ${tradeInfo}`)
  }

  return trade.execution_tx_receipt_id
}

const insertOrFindReceipt = async(
  txHash: string,
  account: string,
  txType: number,
) => {
  let receipt = await getReceiptByHash(txHash, account, BigInt(txType))
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
            futuresTrades(orderBy: timestamp, orderDirection: asc, skip: ${skip}, first: ${first}, where: {timestamp_gte:"${tsStart}", timestamp_lte: "${tsEnd}",}) 
          {
            blockNumber,
            account,
            abstractAccount,
            timestamp,
            orderFeeFlowTxhash,
            executionTxhash,
            size,
            price,
            feesPaid,
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
        const volume = BigNumber.from(element.size).abs().mul(BigNumber.from(element.price)).div(BigNumber.from('1000000000000000000'))
        trades.push({
          blockNumber: element.blockNumber,
          account: element.account,
          abstractAccount: element.abstractAccount,
          timestamp: element.timestamp,
          orderFeeFlowTxhash: element.orderFeeFlowTxhash ?? "",
          executionTxhash: element.executionTxhash,
          feesPaid: element.feesPaid,
          volume: volume.toString(),
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
