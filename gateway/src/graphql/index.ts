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

export const saveTrades = async (
  trades: Trade[],
  account: string,
) => {
  const promises = Array<Promise<string>>();
 
  for (let i =0; i < trades.length; i++) {
    const trade = trades[i]
    
    const tradePromises = Array<Promise<any>>();

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

    tradePromises.push(Promise.resolve(trade.blockNumber))

    const volume = BigNumber.from(trade.size).abs().mul(BigNumber.from(trade.price)).div(BigNumber.from('1000000000000000000'))

    tradePromises.push(Promise.resolve(volume.toString()))

    const tradeId = Promise.all(tradePromises).then(values => {
      return insertOrFindTrade(values)
    })

    promises.push(tradeId)
  }

  const results = await Promise.all(promises);
  return results.reduce(
    (accumulator, currentValue) => accumulator + "," + currentValue
  );
}

const insertOrFindTrade = async(
  values: any[]
) => {
  if (values.length != 4) {
    return ""
  }

  var execution_tx_receipt_id = ""
  if (typeof values[0] === 'string' || values[0] instanceof String) {
    execution_tx_receipt_id = values[0].toString()
  }

  var order_fee_flow_tx_receipt_id = ""
  if (typeof values[1] === 'string' || values[1] instanceof String) {
    order_fee_flow_tx_receipt_id = values[1].toString()
  }

  var execution_tx_block_number = 0
  if (typeof values[2] === 'number' || values[2] instanceof Number) {
    execution_tx_block_number = Number(execution_tx_block_number)
  }

  var volume = ""
  if (typeof values[3] === 'string' || values[3] instanceof String) {
    volume = values[3].toString()
  }

  var trade = await getTrade(execution_tx_receipt_id)

  if (trade === undefined || trade === null) {
    trade = await insertTrade(order_fee_flow_tx_receipt_id, execution_tx_receipt_id, execution_tx_block_number, volume)
  }
  if (trade === undefined || trade === null) {
    throw new Error(`failed to insert trade for order_fee_flow_tx_receipt_id: ${order_fee_flow_tx_receipt_id}, execution_tx_receipt_id: ${execution_tx_receipt_id}, execution_tx_block_number: ${execution_tx_block_number}`)
  }
  return trade.execution_tx_receipt_id
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
            size,
            price,
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
          size: element.size,
          price: element.price,
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
