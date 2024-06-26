var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/index.ts
import express from "express";

// src/interval_jobs/index.ts
import { BigNumber as BigNumber5 } from "ethers";

// ../markets.json
var contracts = [
  "0x001b7876f567f0b3a639332ed1e363839c6d85e2",
  "0x01a43786c2279dc417e7901d45b917afa51ceb9a",
  "0x031a448f59111000b96f016c37e9c71e57845096",
  "0x074b8f19fc91d6b2eb51143e1f186ca0ddb88042",
  "0x08388dc122a956887c2f736aaec4a0ce6f0536ce",
  "0x0940b0a96c5e1ba33aee331a9f950bb2a6f2fb25",
  "0x09f9d7aaa6bef9598c3b676c0e19c9786aa566a8",
  "0x0ea09d97b4084d859328ec4bf8ebcf9ecca26f1d",
  "0x10305c1854d6db8a1060df60bdf8a8b2981249cf",
  "0x105f7f2986a2414b4007958b836904100a53d1ad",
  "0x1228c7d8bbc5bc53db181bd7b1fce765aa83bf8a",
  "0x139f94e4f0e1101c1464a321cba815c34d58b5d9",
  "0x152da6a8f32f25b56a32ef5559d4a2a96d09148b",
  "0x1681212a0edaf314496b489ab57cb3a5ad7a833f",
  "0x1dad8808d8ac58a0df912adc4b215ca3b93d6c49",
  "0x2292865b2b6c837b7406e819200ce61c1c4f8d43",
  "0x27665271210acff4fab08ad9bb657e91866471f0",
  "0x296286ae0b5c066cbcfe46cc4ffb375bccafe640",
  "0x2b3bb4c683bfc5239b029131eef3b1d214478d93",
  "0x2c5e2148bf3409659967fe3684fd999a76171235",
  "0x2ea06e73083f1b3314fa090eae4a5f70eb058f2e",
  "0x2f0f0865dfdd52adefb583ae824dde7d60b76a3b",
  "0x2f0fe4b621e7e54110446ce2df699004c6194636",
  "0x2fd9a39acf071aa61f92f3d7a98332c68d6b6602",
  "0x31a1659ca00f617e86dc765b6494afe70a5a9c1a",
  "0x33d4613639603c845e61a02cd3d2a78be7d513dc",
  "0x35b0ed8473e7943d31ee1eeead06c8767034ce39",
  "0x3a52b21816168dfe35be99b7c5fc209f17a0adb1",
  "0x3d3f34416f60f77a0a6cc8e32abe45d32a7497cb",
  "0x3ed04ceff4c91872f19b1da35740c0be9ca21558",
  "0x3f957df3ab99ff502ee09071dd353bf4352bbefe",
  "0x4272b356e7e406eeef15e47692f7f4de86370634",
  "0x4308427c463caeaab50fff98a9dec569c31e4e87",
  "0x442b69937a0daf9d46439a71567fabe6cb69fbaf",
  "0x4434f56ddbde28fab08c4ae71970a06b300f8881",
  "0x48beadab5781af9c4fec27ac6c8e0f402f2cc3d6",
  "0x4aa0dabd22bc0894975324bec293443c8538bd08",
  "0x4bf3c1af0faa689e3a808e6ad7a8d89d07bb9ec7",
  "0x4ff54624d5fb61c34c634c3314ed3bfe4dbb665a",
  "0x509072a5ae4a87ac89fc8d64d94adcb44bd4b88e",
  "0x50a40d947726ac1373dc438e7aadede9b237564d",
  "0x5374761526175b59f1e583246e20639909e189ce",
  "0x549dbdffbd47bd5639f9348ebe82e63e2f9f777a",
  "0x572f816f21f56d47e4c4fa577837bd3f58088676",
  "0x59b007e9ea8f89b069c43f8f45834d30853e3699",
  "0x5af0072617f7f2aeb0e314e2fad1de0231ba97cd",
  "0x5b6beb79e959aac2659bee60fe0d0885468bf886",
  "0x5ed8d0946b59d015f5a60039922b870537d43689",
  "0x6110df298b411a46d6edce72f5caca9ad826c1de",
  "0x66fc48720f09ac386608fb65ede53bb220d0d5bc",
  "0x6940e7c6125a177b052c662189bb27692e88e9cb",
  "0x69f5f465a46f324fb7bf3fd7c0d5c00f7165c7ea",
  "0x71f42ca320b3e9a8e4816e26de70c9b69eaf9d24",
  "0x76bb1edf0c55ec68f4c8c7fb3c076b811b1a9b9f",
  "0x77da808032dcdd48077fa7c57afbf088713e09ad",
  "0x852210f0616ac226a486ad3387dbf990e690116a",
  "0x86bbb4e38ffa64f263e84a0820138c5d938ba86e",
  "0x87ae62c5720dab812bdacba66cc24839440048d1",
  "0x88c8316e5cccce2e27e5bfcdac99f1251246196a",
  "0x8b9b5f94aac2316f048025b3cbe442386e85984b",
  "0x90c9b9d7399323fffe63819788eed7cde1e6a78c",
  "0x91cc4a83d026e5171525afcaed020123a653c2c9",
  "0x9615b6bfff240c44d3e33d0cd9a11f563a2e8d8b",
  "0x96690aae7cb7c4a9b5be5695e94d72827decc33f",
  "0x96f2842007021a4c5f06bcc72961701d66ff8465",
  "0x98ccbc721cc05e28a125943d69039b39be6a21e9",
  "0x9de146b5663b82f44e5052dede2aa3fd4cbcdc99",
  "0x9f1c2f0071bc3b31447aeda9fa3a68d651eb4632",
  "0x9f231dbe53d460f359b2b8cc47574493caa5b7bf",
  "0xa1ace9ce6862e865937939005b1a6c5ac938a11f",
  "0xaa94c874b91ef16c8b56a1c5b2f34e39366bd484",
  "0xad44873632840144ffc97b2d1de716f6e2cf0366",
  "0xae90e9bb73b32505fb56a0f4fd4ec8cf94bab730",
  "0xaf2e4c337b038eafa1de23b44c163d0008e49ead",
  "0xb147c69bee211f57290a6cde9d1babfd0dcf3ea3",
  "0xb25529266d9677e9171beaf333a0dea506c5f99a",
  "0xb3422e49db926f7c5f5d7daf5f1069abf1b7e894",
  "0xb7059ed9950f2d9fdc0155fc0d79e63d4441e806",
  "0xb815eb8d3a9da3eddd926225c0fbd3a566e8c749",
  "0xbb16c7b3244dfa1a6bf83fcce3ee4560837763cd",
  "0xbbd74c2c8c89d45b822e08fce400f4dde99e600b",
  "0xbcb2d435045e16b059b2130b28be70b5ca47bfe5",
  "0xbdb26bfb6a229d7f254faf1b2c744887ec5f1f31",
  "0xc18f85a6dd3bcd0516a1ca08d3b1f0a4e191a2c4",
  "0xc203a12f298ce73e44f7d45a4f59a43dbffe204d",
  "0xc645a757dd81c69641e010add2da894b4b7bc921",
  "0xc8fcd6fb4d15dd7c455373297def375a08942ece",
  "0xcf853f7f8f78b2b801095b66f8ba9c5f04db1640",
  "0xd325b17d5c9c3f2b6853a760afcf81945b0184d3",
  "0xd4e9e0784c3ce4796f54f2ea0d337c7cfccfd645",
  "0xd5faaa459e5b3c118fd85fc0fd67f56310b1618d",
  "0xd5fbf7136b86021ef9d0be5d798f948dce9c0dea",
  "0xd5fccd43205cef11fbaf9b38df15adbe1b186869",
  "0xd91db82733987513286b81e7115091d96730b62a",
  "0xdcb8438c979fa030581314e5a5df42bbfed744a0",
  "0xdccda0cfbee25b33ff4ccca64467e89512511bf6",
  "0xe698ccc3cd4f2172a848094ea6d28d89d750c16f",
  "0xeaf0191bca9dd417202cef2b18b7515abff1e196",
  "0xee8804d8ad10b0c3ad1bd57ac3737242ad24bb95",
  "0xf7d9bd13f877171f6c7f93f71bdf8e380335dc12",
  "0xf86048dff23cf130107dfb4e6386f574231a5c65",
  "0xf8ab6b9008f2290965426d3076bc9d2ea835575e",
  "0xf9ae92bc49a5dd96ae5840eaae75218016811c99",
  "0xf9dd29d2fd9b38cd90e390c797f1b7e0523f43a9",
  "0xfad0835dad2985b25ddab17eace356237589e5c7",
  "0xfbbbfa96af2980ae4014d5d5a2ef14bd79b2a299",
  "0xfe00395ec846240dc693e92ab2dd720f94765aa3"
];

// src/constants/index.ts
var STATUS_UNKNOWN = BigInt(0);
var STATUS_INIT = BigInt(1);
var STATUS_READY = BigInt(2);
var PROOF_STATUS_UNKNOWN = BigInt(0);
var PROOF_STATUS_INIT = BigInt(1);
var PROOF_STATUS_INPUT_READY = BigInt(2);
var PROOF_STATUS_PROVING_SENT = BigInt(3);
var PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED = BigInt(4);
var PROOF_STATUS_PROOF_UPLOAD_SENT = BigInt(5);
var PROOF_STATUS_PROOF_UPLOADED = BigInt(6);
var PROOF_STATUS_BREVIS_QUERY_ERROR = BigInt(7);
var PROOF_STATUS_ONCHAIN_VERIFIED = BigInt(8);
var PROOF_STATUS_INELIGIBLE_ACCOUNT_ID = BigInt(99);
var TX_TYPE_ORDER_FEE_FLOW = 1;
var TX_TYPE_EXECUTION = 2;
var OrderFlowFeeImposedEvent = "0x213209073252965f156ceca72c65727bfcf77e3f25ca2a1f23a1b9db58295d48".toLowerCase();
var OrderFlowFeeImposedEventContractAddress = "0x6B32d15a6Cb77ea227A6Fb19532b2de542c45AC6".toLowerCase();
var DelayedOrderSubmittedEvent = "0x9deb3648ccf8efc44205985ac6ead4ffb30791fea9ce7f9437ae398b31cf9d5a".toLowerCase();
var PositionModifiedEvent = "0xc0d933baa356386a245ade48f9a9c59db4612af2b5b9c17de5b451c628760f43".toLowerCase();
var PositionModifiedContracts = contracts;
function isValidPositionModifiedContract(contract) {
  return PositionModifiedContracts.find((value) => {
    return contract.toLowerCase() === value.toLowerCase();
  });
}

// src/db/index.ts
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
var prisma = new PrismaClient();
async function insertReceipt(tx_hash, account, transaction_type) {
  console.log(`Insert receipt: tx: ${tx_hash}, account: ${account}, transaction_type: ${transaction_type}`);
  return prisma.receipt.create({
    data: {
      id: uuidv4(),
      tx_hash: tx_hash?.toLowerCase(),
      account,
      status: STATUS_INIT,
      create_time: /* @__PURE__ */ new Date(),
      update_time: /* @__PURE__ */ new Date(),
      transaction_type
    }
  });
}
async function updateReceipt(tx_hash, account, transaction_type, status, data, should_be_filtered_out) {
  return prisma.receipt.update({
    where: {
      tx_hash_account_transaction_type: {
        tx_hash: tx_hash?.toLowerCase(),
        account: account?.toLowerCase(),
        transaction_type
      }
    },
    data: {
      status,
      update_time: /* @__PURE__ */ new Date(),
      should_be_filtered_out,
      data
    }
  });
}
async function getReceipt(id) {
  return prisma.receipt.findFirst({
    where: {
      id
    }
  });
}
async function getReceiptByHash(tx_hash, account, transaction_type) {
  return prisma.receipt.findUnique({
    where: {
      tx_hash_account_transaction_type: {
        tx_hash: tx_hash?.toLowerCase(),
        account: account?.toLowerCase(),
        transaction_type
      }
    }
  });
}
async function findNotReadyReceipts() {
  var now = /* @__PURE__ */ new Date();
  return prisma.receipt.findMany({
    take: 50,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now
      }
    }
  });
}
async function findNotReadyTrades() {
  var now = /* @__PURE__ */ new Date();
  return prisma.trade.findMany({
    take: 50,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now
      }
    }
  });
}
async function insertUserTradeVolumeFee(src_chain_id, dst_chain_id, account, owner, ymd) {
  console.log(
    `Insert user trade volume fee: src_chain_id: ${src_chain_id}, dst_chain_id: ${dst_chain_id}, account: ${account}, owner: ${owner}, ymd: ${ymd}`
  );
  return prisma.user_trade_volume_fee.create({
    data: {
      id: uuidv4(),
      src_chain_id,
      dst_chain_id,
      account: account?.toLowerCase(),
      owner_address: owner,
      ymd,
      status: PROOF_STATUS_INIT,
      create_time: /* @__PURE__ */ new Date(),
      update_time: /* @__PURE__ */ new Date(),
      request_sent: false
    }
  });
}
async function updateUserTradeVolumeFee(utvf) {
  return prisma.user_trade_volume_fee.update({
    where: {
      account_ymd: {
        account: utvf.account?.toLowerCase(),
        ymd: utvf.ymd
      }
    },
    data: {
      volume: utvf.volume,
      fee: utvf.fee,
      trade_ids: utvf.trade_ids,
      storage_ids: utvf.storage_ids,
      brevis_query_hash: utvf.brevis_query_hash?.toLowerCase(),
      brevis_query_fee: utvf.brevis_query_fee,
      proof: utvf.proof,
      status: utvf.status,
      update_time: /* @__PURE__ */ new Date(),
      prover_id: utvf.prover_id,
      request_sent: utvf.request_sent,
      start_blk_num: utvf.start_blk_num,
      end_blk_num: utvf.end_blk_num,
      fee_rebate: utvf.fee_rebate
    }
  });
}
async function updateUserTradeVolumeFeeRequestSent(account, ymd, request_sent) {
  return prisma.user_trade_volume_fee.update({
    where: {
      account_ymd: {
        account: account?.toLowerCase(),
        ymd
      }
    },
    data: {
      request_sent
    }
  });
}
async function getUserTradeVolumeFee(account, ymd) {
  return prisma.user_trade_volume_fee.findUnique({
    where: {
      account_ymd: {
        account: account?.toLowerCase(),
        ymd
      }
    }
  });
}
async function findUserExistingUTVF(account, start_blk_num, end_blk_num) {
  return prisma.user_trade_volume_fee.findFirst({
    where: {
      account: account?.toLowerCase(),
      start_blk_num: {
        equals: start_blk_num
      },
      end_blk_num: {
        equals: end_blk_num
      }
    }
  });
}
async function findUserExistingUTVFByDate(account, ymd) {
  return prisma.user_trade_volume_fee.findUnique({
    where: {
      account_ymd: {
        account: account?.toLowerCase(),
        ymd
      }
    }
  });
}
async function findUserTradeVolumeFees(status) {
  return prisma.user_trade_volume_fee.findMany({
    take: 10,
    where: {
      status: {
        equals: status
      }
    }
  });
}
async function findBrevisRequestSentUTVFS() {
  return prisma.user_trade_volume_fee.findMany({
    take: 30,
    where: {
      status: {
        equals: PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED
      }
    }
  });
}
async function findProofToUpload() {
  const a = /* @__PURE__ */ new Date();
  a.setMinutes(a.getMinutes() - 3);
  return prisma.user_trade_volume_fee.findMany({
    take: 10,
    where: {
      status: {
        equals: PROOF_STATUS_PROOF_UPLOAD_SENT
      },
      update_time: {
        lte: a
      }
    },
    orderBy: [
      {
        update_time: "desc"
      }
    ]
  });
}
async function findTxToBeSent() {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      status: {
        gte: PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
        lt: PROOF_STATUS_BREVIS_QUERY_ERROR
      },
      request_sent: {
        equals: false
      }
    }
  });
}
async function updateBrevisRequestStatus(brevis_query_hash) {
  return prisma.user_trade_volume_fee.updateMany({
    where: {
      brevis_query_hash: brevis_query_hash?.toLowerCase()
    },
    data: {
      request_sent: true
    }
  });
}
async function insertDailyTrack(year_month_day) {
  return prisma.daily_track.create({
    data: {
      year_month_day
    }
  });
}
async function getDailyTrack(year_month_day) {
  return prisma.daily_track.findUnique({
    where: {
      year_month_day
    }
  });
}
async function insertTrade(trade, order_fee_flow_tx_receipt_id, execution_tx_receipt_id) {
  return prisma.trade.create({
    data: {
      order_fee_flow_tx_receipt_id,
      execution_tx_receipt_id,
      execution_tx_block_number: BigInt(trade.blockNumber),
      account: trade.abstractAccount,
      volume: trade.volume,
      fee: trade.feesPaid,
      status: STATUS_INIT,
      create_time: /* @__PURE__ */ new Date(),
      update_time: /* @__PURE__ */ new Date()
    }
  }).catch((reason) => {
    console.debug(`cannot insert trade ${reason}`);
    return void 0;
  });
}
async function getTrade(execution_tx_receipt_id, account) {
  return prisma.trade.findUnique({
    where: {
      account_execution_tx_receipt_id: {
        account,
        execution_tx_receipt_id
      }
    }
  });
}
async function updateTrade(execution_tx_receipt_id, account, status) {
  return prisma.trade.update({
    where: {
      account_execution_tx_receipt_id: {
        account,
        execution_tx_receipt_id
      }
    },
    data: {
      status,
      update_time: /* @__PURE__ */ new Date()
    }
  });
}

// src/graphql/common.ts
var GraphRpc = "https://subgraph.satsuma-prod.com/616cc2144c5c/kwenta/optimism-perps/version/0.0.22/api";

// src/graphql/index.ts
import { BigNumber } from "ethers";
var getAllTradesWithin30Day = async (ts30Ago, tsClaimDayEnd) => {
  var first = 1e4;
  var skip = 0;
  const finalResult = {
    trades: [],
    error: null
  };
  while (true) {
    const result = await postGraphQL(ts30Ago, tsClaimDayEnd, skip, first);
    if (result.error != null) {
      finalResult.error = result.error;
      return finalResult;
    }
    if (result.trades.length == 0) {
      return finalResult;
    }
    finalResult.trades = finalResult.trades.concat(result.trades);
    skip += first;
  }
};
var getAccountTradesList = (trades) => {
  let map = /* @__PURE__ */ new Map();
  trades.forEach((trade) => {
    const userTrades = map.get(trade.abstractAccount);
    if (userTrades === void 0) {
      map.set(trade.abstractAccount, [trade]);
    } else {
      userTrades.push(trade);
    }
  });
  const accountTradesList = [];
  for (let [account, trades2] of map) {
    accountTradesList.push({
      account,
      trades: trades2
    });
  }
  accountTradesList.sort((a, b) => {
    if (a.trades.length < b.trades.length) {
      return -1;
    } else {
      return 1;
    }
  });
  return accountTradesList;
};
var batchTradesWithSameTxAccount = (trades) => {
  let map = /* @__PURE__ */ new Map();
  trades.forEach((trade) => {
    const userTrades = map.get(trade.executionTxhash);
    if (userTrades === void 0) {
      map.set(trade.executionTxhash, [trade]);
    } else {
      userTrades.push(trade);
    }
  });
  const result = [];
  for (let [_, trades2] of map) {
    const trade = trades2.reduce((t0, t1) => {
      var orderFeeFlowTxhash = t0.orderFeeFlowTxhash;
      if (orderFeeFlowTxhash.length === 0) {
        orderFeeFlowTxhash = t1.orderFeeFlowTxhash;
      }
      return {
        blockNumber: t0.blockNumber,
        account: t0.account,
        abstractAccount: t0.abstractAccount,
        timestamp: t0.timestamp,
        orderFeeFlowTxhash,
        executionTxhash: t0.executionTxhash,
        volume: BigNumber.from(t0.volume).add(t1.volume).toString(),
        feesPaid: BigNumber.from(t0.feesPaid).add(t1.feesPaid).toString()
      };
    });
    result.push(trade);
  }
  return result;
};
var saveTrades = async (trades, account) => {
  const promises = Array();
  const batchedTrade = batchTradesWithSameTxAccount(trades);
  for (let i = 0; i < batchedTrade.length; i++) {
    const trade = batchedTrade[i];
    var executionTxId = "";
    var orderFlowTxId = "";
    if (trade.executionTxhash.length > 0) {
      executionTxId = await insertOrFindReceipt(trade.executionTxhash, account, TX_TYPE_EXECUTION);
    } else {
      console.log(`invalid trade with empty executionTxhash ${trade}`);
      continue;
    }
    if (trade.orderFeeFlowTxhash.length > 0) {
      orderFlowTxId = await insertOrFindReceipt(trade.orderFeeFlowTxhash, account, TX_TYPE_ORDER_FEE_FLOW);
    } else {
      orderFlowTxId = "";
    }
    promises.push(insertOrFindTrade(
      executionTxId,
      orderFlowTxId,
      trade
    ));
  }
  const results = await Promise.all(promises);
  return results.reduce(
    (accumulator, currentValue) => {
      if (currentValue.length === 0) {
        return accumulator;
      }
      return accumulator + "," + currentValue;
    }
  );
};
var insertOrFindTrade = async (execution_tx_receipt_id, order_fee_flow_tx_receipt_id, tradeInfo) => {
  var trade = await getTrade(execution_tx_receipt_id, tradeInfo.abstractAccount);
  if (trade === void 0 || trade === null) {
    trade = await insertTrade(
      tradeInfo,
      order_fee_flow_tx_receipt_id,
      execution_tx_receipt_id
    );
  }
  if (trade === void 0 || trade === null) {
    return "";
  }
  return trade.execution_tx_receipt_id;
};
var insertOrFindReceipt = async (txHash, account, txType) => {
  let receipt = await getReceiptByHash(txHash, account, BigInt(txType));
  if (receipt === void 0 || receipt === null) {
    receipt = await insertReceipt(txHash, account, BigInt(txType));
  }
  if (receipt === void 0 || receipt === null) {
    throw new Error(`failed to insert receipt for txHash: ${txHash}, account: ${account}, txType: ${txType}`);
  }
  return receipt.id;
};
var postGraphQL = async (tsStart, tsEnd, skip, first) => {
  try {
    const response = await fetch(GraphRpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
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
        }`
      })
    });
    const result = {
      trades: [],
      error: null
    };
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.errors !== void 0 && responseJson.errors !== null) {
        result.error = new Error(`invalid gql response errors: ${responseJson.errors} `);
        return result;
      }
      const trades = [];
      responseJson?.data?.futuresTrades?.forEach((element) => {
        const volume = BigNumber.from(element.size).abs().mul(BigNumber.from(element.price)).div(BigNumber.from("1000000000000000000"));
        trades.push({
          blockNumber: element.blockNumber,
          account: element.account,
          abstractAccount: element.abstractAccount,
          timestamp: element.timestamp,
          orderFeeFlowTxhash: element.orderFeeFlowTxhash ?? "",
          executionTxhash: element.executionTxhash,
          feesPaid: element.feesPaid,
          volume: volume.toString()
        });
      });
      result.trades = trades;
      return result;
    } else {
      console.error("failed to get graphql response: ", response);
      result.error = new Error(`invalid graphql response skip: ${skip}, first: ${first}, where: {timestamp_gte:"${tsStart}", timestamp_lte: "${tsEnd}"`);
      return result;
    }
  } catch (error) {
    console.error("faild to send graphql error:", error);
    const result = {
      trades: [],
      error: new Error(`faild to send graphql error: ${error}`)
    };
    return result;
  }
};

// src/prover/index.ts
import * as sdk from "brevis-sdk-typescript";
import { BigNumber as BigNumber2 } from "ethers";
import moment from "moment";
var {
  Brevis,
  ErrCode,
  ProofRequest,
  Prover,
  ReceiptData,
  StorageData,
  asUint248,
  asUint521
} = sdk;
var provers = [
  new Prover("222.74.153.228:53248"),
  new Prover("222.74.153.228:53249"),
  new Prover("222.74.153.228:53351")
];
var brevis = new Brevis("appsdk.brevis.network:11080");
var buildUserTradeVolumeFeeProofReq = async (utvf) => {
  const proofReq = new ProofRequest();
  const tradeIds = utvf.trade_ids.split(",");
  const startBlkNum = Number(utvf.start_blk_num);
  const endBlkNum = Number(utvf.end_blk_num);
  let tradePromises = Array();
  for (let i = 0; i < tradeIds.length; i++) {
    tradePromises.push(
      getTrade(tradeIds[i], utvf.account).then((value) => {
        const t = value;
        if (t === void 0 || t === null) {
          return void 0;
        }
        if (t.status !== STATUS_READY) {
          throw new Error(`trade ${t.id} not ready`);
        } else {
          return t;
        }
      })
    );
  }
  const trades = await Promise.all(tradePromises);
  const validTrades = [];
  trades.forEach((trade) => {
    if (trade !== void 0) {
      validTrades.push(trade);
    }
  });
  validTrades.sort((a, b) => {
    if (a.execution_tx_block_number < b.execution_tx_block_number) {
      return -1;
    } else {
      return 1;
    }
  });
  const receiptIds = [];
  validTrades.forEach((trade) => {
    if (trade.order_fee_flow_tx_receipt_id.length > 0) {
      receiptIds.push(trade.order_fee_flow_tx_receipt_id);
    }
    if (trade.execution_tx_receipt_id.length > 0) {
      receiptIds.push(trade.execution_tx_receipt_id);
    }
  });
  let receiptPromises = Array();
  for (let i = 0; i < receiptIds.length; i++) {
    receiptPromises.push(
      getReceipt(receiptIds[i]).then((value) => {
        const r = value;
        if (r === void 0 || r === null) {
          return void 0;
        } else {
          if (r.should_be_filtered_out) {
            return void 0;
          } else {
            return r;
          }
        }
      })
    );
  }
  const receipts = await Promise.all(receiptPromises);
  var validReceipts = [];
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    if (receipt === void 0) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready");
    }
    validReceipts = validReceipts.concat(devideReceiptIntoCircuitInputReceipts(receipt));
  }
  validReceipts.sort((a, b) => {
    const dataA = JSON.parse(a.data);
    const blkNumberA = Number(dataA.block_num);
    const dataB = JSON.parse(b.data);
    const blkNumberB = Number(dataB.block_num);
    if (blkNumberA < blkNumberB) {
      return -1;
    } else if (blkNumberA == blkNumberB && Number(dataA.transaction_type) < Number(dataB.transaction_type)) {
      return -1;
    } else {
      return 1;
    }
  });
  var unclaimableTrades = validTrades.filter((trade) => {
    const bn = trade?.execution_tx_block_number ?? 0;
    return Number(bn) >= startBlkNum - 43200 * 30 && Number(bn) < startBlkNum;
  });
  if (unclaimableTrades.length > 4400) {
    unclaimableTrades.sort((a, b) => {
      if (BigNumber2.from(a.volume).gt(BigNumber2.from(b.volume))) {
        return -1;
      } else {
        return 1;
      }
    });
    unclaimableTrades = unclaimableTrades.slice(0, 4400);
    unclaimableTrades.sort((a, b) => {
      if (Number(a.execution_tx_block_number) < Number(b.execution_tx_block_number)) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  var unclaimableTradeReceipts = [];
  unclaimableTrades.forEach((trade) => {
    unclaimableTradeReceipts = unclaimableTradeReceipts.concat(validReceipts.filter((receipt) => {
      return receipt.id === trade.execution_tx_receipt_id;
    }));
  });
  if (unclaimableTradeReceipts.length > 4400) {
    unclaimableTradeReceipts = unclaimableTradeReceipts.slice(0, 4400);
  }
  const claimableTrades = validTrades.filter((trade) => {
    const bn = trade?.execution_tx_block_number ?? 0;
    return Number(bn) >= startBlkNum && Number(bn) <= endBlkNum;
  });
  var claimableTradeOrderFeeFlowReceipts = [];
  claimableTrades.forEach((trade) => {
    claimableTradeOrderFeeFlowReceipts = claimableTradeOrderFeeFlowReceipts.concat(validReceipts.filter((receipt) => {
      return receipt.id === trade.order_fee_flow_tx_receipt_id;
    }));
  });
  claimableTradeOrderFeeFlowReceipts.sort(sortByBlk);
  var claimableTradeExecutionReceipts = [];
  claimableTrades.forEach((trade) => {
    claimableTradeExecutionReceipts = claimableTradeExecutionReceipts.concat(validReceipts.filter((receipt) => {
      return receipt.id === trade.execution_tx_receipt_id;
    }));
  });
  claimableTradeExecutionReceipts.sort(sortByBlk);
  if (claimableTradeOrderFeeFlowReceipts.length !== claimableTradeExecutionReceipts.length) {
    claimableTrades.forEach((trade) => {
      const orderFeeFlowR = validReceipts.filter((receipt) => {
        return receipt.id === trade.order_fee_flow_tx_receipt_id;
      });
      const exR = validReceipts.filter((receipt) => {
        return receipt.id === trade.execution_tx_receipt_id;
      });
      if (orderFeeFlowR.length !== exR.length) {
        console.debug(`OR,ER not match for: ${trade.account}-${trade.execution_tx_receipt_id}, ${orderFeeFlowR.length}, ${exR.length}`);
      }
    });
  }
  var proverIndex = -1;
  var offRIndex = 0;
  var exeRIndex = 0;
  if (unclaimableTradeReceipts.length <= 216 && claimableTradeOrderFeeFlowReceipts.length <= 20 && claimableTradeExecutionReceipts.length <= 20) {
    proverIndex = 0;
    offRIndex = 216;
    exeRIndex = 236;
  } else if (unclaimableTradeReceipts.length <= 412 && claimableTradeOrderFeeFlowReceipts.length <= 50 && claimableTradeExecutionReceipts.length <= 50) {
    proverIndex = 1;
    offRIndex = 412;
    exeRIndex = 462;
  } else if (unclaimableTradeReceipts.length <= 4400 && claimableTradeOrderFeeFlowReceipts.length <= 300 && claimableTradeExecutionReceipts.length <= 300) {
    proverIndex = 2;
    offRIndex = 4400;
    exeRIndex = 4700;
  } else {
    console.error(`${utvf.id}: ${utvf.account}, ${utvf.ymd}, claimable trades out of range: unclaimableTradeReceipts.length  ${unclaimableTradeReceipts.length}; claimableTradeOrderFeeFlowReceipts.length ${claimableTradeOrderFeeFlowReceipts.length}; claimableTradeExecutionReceipts.length ${claimableTradeExecutionReceipts.length}`);
  }
  const debugReceipts = [];
  var unClaimableReceiptIndex = 0;
  unclaimableTradeReceipts.forEach((receipt) => {
    const data = JSON.parse(receipt.data);
    const blkNumber = Number(data.block_num);
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data);
    }
    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(data.block_num),
        tx_hash: receipt.tx_hash,
        fields: [
          new sdk.Field(data.fields[0]),
          new sdk.Field(data.fields[1]),
          new sdk.Field(data.fields[2]),
          new sdk.Field(data.fields[3])
        ]
      }),
      unClaimableReceiptIndex
    );
    debugReceipts.push({
      data,
      tx_hash: receipt.tx_hash,
      index: unClaimableReceiptIndex
    });
    unClaimableReceiptIndex++;
  });
  claimableTradeOrderFeeFlowReceipts.forEach((receipt) => {
    const orderFeeFlowData = JSON.parse(receipt.data);
    const blkNumber = Number(orderFeeFlowData.block_num);
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", orderFeeFlowData);
    }
    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(orderFeeFlowData.block_num),
        tx_hash: receipt.tx_hash,
        fields: [
          new sdk.Field(orderFeeFlowData.fields[0]),
          new sdk.Field(orderFeeFlowData.fields[1]),
          new sdk.Field(orderFeeFlowData.fields[2]),
          new sdk.Field(orderFeeFlowData.fields[3])
        ]
      }),
      offRIndex
    );
    debugReceipts.push({
      data: orderFeeFlowData,
      tx_hash: receipt.tx_hash,
      index: offRIndex
    });
    offRIndex++;
  });
  claimableTradeExecutionReceipts.forEach((receipt) => {
    const data = JSON.parse(receipt.data);
    const blkNumber = Number(data.block_num);
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data);
    }
    proofReq.addReceipt(
      new ReceiptData({
        block_num: Number(data.block_num),
        tx_hash: receipt.tx_hash,
        fields: [
          new sdk.Field(data.fields[0]),
          new sdk.Field(data.fields[1]),
          new sdk.Field(data.fields[2]),
          new sdk.Field(data.fields[3])
        ]
      }),
      exeRIndex
    );
    debugReceipts.push({
      data,
      tx_hash: receipt.tx_hash,
      index: exeRIndex
    });
    exeRIndex++;
  });
  const account = BigNumber2.from(utvf.account).toHexString();
  const contracts2 = PositionModifiedContracts.map((value) => {
    return asUint248(value);
  });
  const paddingIndex = 512 - contracts2.length;
  for (let i = 0; i < paddingIndex; i++) {
    contracts2.push(asUint248("0x0"));
  }
  proofReq.setCustomInput({
    Account: asUint248(account),
    StartBlkNum: asUint248(utvf.start_blk_num.toString()),
    EndBlkNum: asUint248(utvf.end_blk_num.toString()),
    Contracts: contracts2,
    ContractsHash: sdk.asBytes32("0x0f4609cd4bed42d65042468a77bd40822cec9a83414e4406c16135b9406ecc46")
  });
  const debugRequest = JSON.stringify({
    receipts: debugReceipts,
    contracts: PositionModifiedContracts,
    start: utvf.start_blk_num.toString(),
    account,
    end: utvf.end_blk_num.toString()
  });
  if (debugReceipts.length === 0) {
    throw new Error("empty receipts");
  }
  if (debugReceipts.length === 0) {
    return { proofReq, proverIndex: -1 };
  }
  const lastReceiptIndex = debugReceipts[debugReceipts.length - 1].index;
  if (lastReceiptIndex > 256 && proverIndex == 0 || lastReceiptIndex > 512 && proverIndex == 1) {
    console.debug(`Invalid debug request ${utvf.id}, provdeIndex: ${proverIndex}, debugReceipts.length: ${debugReceipts.length}, ${debugRequest}`);
    return { proofReq, proverIndex: -1 };
  }
  return { proofReq, proverIndex };
};
async function sendUserTradeVolumeFeeProvingRequest(utvfOld) {
  const utvf = await getUserTradeVolumeFee(utvfOld.account, utvfOld.ymd);
  if (utvf.status != PROOF_STATUS_INPUT_READY) {
    return;
  }
  utvf.status = PROOF_STATUS_PROVING_SENT;
  await updateUserTradeVolumeFee(utvf);
  try {
    const r = await buildUserTradeVolumeFeeProofReq(utvf);
    console.log("User Circuit Proof Request Sent: ", r.proverIndex, utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    if (r.proverIndex < 0) {
      console.log("Cannot proceed cause prover index is invalid", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
      return;
    }
    const proofRes = await provers[r.proverIndex].proveAsync(r.proofReq);
    console.log("proofRes proof_id ready", proofRes.proof_id, (/* @__PURE__ */ new Date()).toLocaleString());
    if (proofRes.has_err) {
      const err = proofRes.err;
      switch (err.code) {
        case ErrCode.ERROR_INVALID_INPUT:
          console.error("invalid receipt/storage/transaction input:", err.msg);
          break;
        case ErrCode.ERROR_INVALID_CUSTOM_INPUT:
          console.error("invalid custom input:", err.msg);
          break;
        case ErrCode.ERROR_FAILED_TO_PROVE:
          console.error("failed to prove:", err.msg);
          break;
        default:
          break;
      }
      return;
    }
    utvf.prover_id = proofRes.proof_id;
    await updateUserTradeVolumeFee(utvf);
    try {
      console.log("send prepare query request", (/* @__PURE__ */ new Date()).toLocaleString());
      console.log("proofRes.circuit_info", r.proverIndex, proofRes.circuit_info.output, proofRes.circuit_info.output_commitment);
      const prepareQueryResponse = await brevis.prepareQuery(
        r.proofReq,
        proofRes.circuit_info,
        Number(utvf.src_chain_id),
        Number(utvf.dst_chain_id)
      );
      if (prepareQueryResponse.has_err) {
        const err = prepareQueryResponse.err;
        console.error("Failed to prepare query", err, utvf.id);
        utvf.status = PROOF_STATUS_BREVIS_QUERY_ERROR;
        updateUserTradeVolumeFee(utvf);
        return;
      }
      console.log("Ready to submit brevis query hash", prepareQueryResponse.query_hash, (/* @__PURE__ */ new Date()).toLocaleString());
      utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
      utvf.brevis_query_fee = prepareQueryResponse.fee;
      utvf.brevis_query_hash = prepareQueryResponse.query_hash;
      updateUserTradeVolumeFee(utvf).then((value) => {
        uploadUserTradeVolumeFeeProof(value);
      }).then();
    } catch (error) {
      console.error("Failed to prepare query", error, utvf.id);
      utvf.status = PROOF_STATUS_BREVIS_QUERY_ERROR;
      updateUserTradeVolumeFee(utvf);
    }
  } catch (error) {
    console.log("error ", error);
    utvf.status = PROOF_STATUS_INPUT_READY;
    await updateUserTradeVolumeFee(utvf);
  }
}
async function uploadUserTradeVolumeFeeProof(utvfOld) {
  const utvf = await getUserTradeVolumeFee(utvfOld.account, utvfOld.ymd);
  if (utvf.status != PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED && moment.utc(utvf.update_time).unix() > moment.utc(/* @__PURE__ */ new Date()).unix() - 1200) {
    return;
  }
  utvf.status = PROOF_STATUS_PROOF_UPLOAD_SENT;
  await updateUserTradeVolumeFee(utvf);
  try {
    console.log("Proof upload sent: ", utvf.id, utvf.prover_id, (/* @__PURE__ */ new Date()).toLocaleString());
    const r = await buildUserTradeVolumeFeeProofReq(utvf);
    if (r.proverIndex < 0) {
      console.log("Cannot proceed upload proof cause prover index is invalid", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
      return;
    }
    const getProofRes = await provers[r.proverIndex].getProof(utvf.prover_id);
    if (getProofRes.has_err) {
      console.error(getProofRes.err.msg);
      utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
      await updateUserTradeVolumeFee(utvf);
      return;
    } else if (getProofRes.proof.length === 0) {
      utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
      await updateUserTradeVolumeFee(utvf);
      return;
    }
    await brevis.submitProof(
      utvf.brevis_query_hash,
      Number(utvf.dst_chain_id),
      getProofRes.proof
    );
    utvf.status = PROOF_STATUS_PROOF_UPLOADED;
    utvf.proof = getProofRes.proof;
    console.log("Proof uploaded: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    updateUserTradeVolumeFee(utvf);
  } catch (err) {
    utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
    updateUserTradeVolumeFee(utvf);
    console.error(err);
  }
}
function devideReceiptIntoCircuitInputReceipts(receipt) {
  const result = [];
  const data = JSON.parse(receipt.data);
  for (var i = 0; i < data.fields.length / 4; i++) {
    let original = {
      block_num: data.block_num,
      tx_hash: data.tx_hash,
      fields: []
    };
    original.fields.push(data.fields[i * 4]);
    original.fields.push(data.fields[i * 4 + 1]);
    original.fields.push(data.fields[i * 4 + 2]);
    original.fields.push(data.fields[i * 4 + 3]);
    result.push({
      id: receipt.id,
      tx_hash: receipt.tx_hash,
      transaction_type: receipt.transaction_type,
      status: receipt.status,
      data: JSON.stringify(original),
      create_time: receipt.create_time,
      update_time: receipt.update_time,
      should_be_filtered_out: receipt.should_be_filtered_out,
      account: receipt.account
    });
  }
  return result;
}
function sortByBlk(a, b) {
  const dataA = JSON.parse(a.data);
  const blkNumberA = Number(dataA.block_num);
  const dataB = JSON.parse(b.data);
  const blkNumberB = Number(dataB.block_num);
  if (blkNumberA < blkNumberB) {
    return -1;
  } else if (blkNumberA == blkNumberB && Number(dataA.transaction_type) < Number(dataB.transaction_type)) {
    return -1;
  } else {
    return 1;
  }
}

// src/rpc/index.ts
import { BigNumber as BigNumber4 } from "ethers";

// src/ether_interactions/index.ts
import { ethers as ethers2 } from "ethers";

// ../contract/typechain/index.ts
var typechain_exports = {};
__export(typechain_exports, {
  BrevisApp__factory: () => BrevisApp__factory,
  FeeReimbursementApp__factory: () => FeeReimbursementApp__factory,
  IBrevisProof__factory: () => IBrevisProof__factory,
  IERC20__factory: () => IERC20__factory,
  IFeeRebateTierModule__factory: () => IFeeRebateTierModule__factory,
  MockFeeModule__factory: () => MockFeeModule__factory,
  Ownable__factory: () => Ownable__factory,
  Tx__factory: () => Tx__factory
});

// ../contract/typechain/factories/Ownable__factory.ts
import { Contract as Contract2, utils } from "ethers";
var _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
var Ownable__factory = class {
  static createInterface() {
    return new utils.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract2(address, _abi, signerOrProvider);
  }
};
Ownable__factory.abi = _abi;

// ../contract/typechain/factories/IERC20__factory.ts
import { Contract as Contract3, utils as utils2 } from "ethers";
var _abi2 = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
var IERC20__factory = class {
  static createInterface() {
    return new utils2.Interface(_abi2);
  }
  static connect(address, signerOrProvider) {
    return new Contract3(address, _abi2, signerOrProvider);
  }
};
IERC20__factory.abi = _abi2;

// ../contract/typechain/factories/BrevisApp__factory.ts
import { Contract as Contract4, utils as utils3 } from "ethers";
var _abi3 = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData[]",
        name: "_proofDataArray",
        type: "tuple[]"
      },
      {
        internalType: "bytes[]",
        name: "_appCircuitOutputs",
        type: "bytes[]"
      }
    ],
    name: "brevisBatchCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes"
      }
    ],
    name: "brevisCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "brevisProof",
    outputs: [
      {
        internalType: "contract IBrevisProof",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData",
        name: "_proofData",
        type: "tuple"
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32"
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]"
      },
      {
        internalType: "uint8",
        name: "_nodeIndex",
        type: "uint8"
      },
      {
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes"
      }
    ],
    name: "singleRun",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "blkNum",
                type: "uint64"
              },
              {
                internalType: "uint64",
                name: "receiptIndex",
                type: "uint64"
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "uint8",
                        name: "valueFromTopic",
                        type: "uint8"
                      },
                      {
                        internalType: "uint64",
                        name: "valueIndex",
                        type: "uint64"
                      },
                      {
                        internalType: "address",
                        name: "contractAddress",
                        type: "address"
                      },
                      {
                        internalType: "bytes32",
                        name: "logTopic0",
                        type: "bytes32"
                      }
                    ],
                    internalType: "struct Brevis.LogExtraInfo",
                    name: "logExtraInfo",
                    type: "tuple"
                  },
                  {
                    internalType: "uint64",
                    name: "logIndex",
                    type: "uint64"
                  },
                  {
                    internalType: "bytes32",
                    name: "value",
                    type: "bytes32"
                  }
                ],
                internalType: "struct Brevis.LogInfo[5]",
                name: "logs",
                type: "tuple[5]"
              }
            ],
            internalType: "struct Brevis.ReceiptInfo[]",
            name: "receipts",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32"
              },
              {
                internalType: "address",
                name: "account",
                type: "address"
              },
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "slotValue",
                type: "bytes32"
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64"
              }
            ],
            internalType: "struct Brevis.StorageInfo[]",
            name: "stores",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "leafHash",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32"
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64"
              },
              {
                internalType: "uint64",
                name: "blockTime",
                type: "uint64"
              },
              {
                internalType: "bytes",
                name: "leafRlpPrefix",
                type: "bytes"
              }
            ],
            internalType: "struct Brevis.TransactionInfo[]",
            name: "txs",
            type: "tuple[]"
          }
        ],
        internalType: "struct Brevis.ExtractInfos",
        name: "_extractInfos",
        type: "tuple"
      }
    ],
    name: "validateRequest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var BrevisApp__factory = class {
  static createInterface() {
    return new utils3.Interface(_abi3);
  }
  static connect(address, signerOrProvider) {
    return new Contract4(address, _abi3, signerOrProvider);
  }
};
BrevisApp__factory.abi = _abi3;

// ../contract/typechain/factories/IBrevisProof__factory.ts
import { Contract as Contract5, utils as utils4 } from "ethers";
var _abi4 = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    name: "getProofAppData",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    name: "getProofData",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    name: "hasProof",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        internalType: "bytes32[]",
        name: "_requestIds",
        type: "bytes32[]"
      },
      {
        internalType: "bytes",
        name: "_proofWithPubInputs",
        type: "bytes"
      }
    ],
    name: "mustSubmitAggProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData",
        name: "_proofData",
        type: "tuple"
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32"
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]"
      },
      {
        internalType: "uint8",
        name: "_nodeIndex",
        type: "uint8"
      }
    ],
    name: "mustValidateRequest",
    outputs: [],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData[]",
        name: "_proofDataArray",
        type: "tuple[]"
      }
    ],
    name: "mustValidateRequests",
    outputs: [],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        internalType: "bytes",
        name: "_proofWithPubInputs",
        type: "bytes"
      },
      {
        internalType: "bool",
        name: "_withAppProof",
        type: "bool"
      }
    ],
    name: "submitProof",
    outputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "blkNum",
                type: "uint64"
              },
              {
                internalType: "uint64",
                name: "receiptIndex",
                type: "uint64"
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "uint8",
                        name: "valueFromTopic",
                        type: "uint8"
                      },
                      {
                        internalType: "uint64",
                        name: "valueIndex",
                        type: "uint64"
                      },
                      {
                        internalType: "address",
                        name: "contractAddress",
                        type: "address"
                      },
                      {
                        internalType: "bytes32",
                        name: "logTopic0",
                        type: "bytes32"
                      }
                    ],
                    internalType: "struct Brevis.LogExtraInfo",
                    name: "logExtraInfo",
                    type: "tuple"
                  },
                  {
                    internalType: "uint64",
                    name: "logIndex",
                    type: "uint64"
                  },
                  {
                    internalType: "bytes32",
                    name: "value",
                    type: "bytes32"
                  }
                ],
                internalType: "struct Brevis.LogInfo[5]",
                name: "logs",
                type: "tuple[5]"
              }
            ],
            internalType: "struct Brevis.ReceiptInfo[]",
            name: "receipts",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32"
              },
              {
                internalType: "address",
                name: "account",
                type: "address"
              },
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "slotValue",
                type: "bytes32"
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64"
              }
            ],
            internalType: "struct Brevis.StorageInfo[]",
            name: "stores",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "leafHash",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32"
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64"
              },
              {
                internalType: "uint64",
                name: "blockTime",
                type: "uint64"
              },
              {
                internalType: "bytes",
                name: "leafRlpPrefix",
                type: "bytes"
              }
            ],
            internalType: "struct Brevis.TransactionInfo[]",
            name: "txs",
            type: "tuple[]"
          }
        ],
        internalType: "struct Brevis.ExtractInfos",
        name: "_info",
        type: "tuple"
      }
    ],
    name: "validateRequest",
    outputs: [],
    stateMutability: "view",
    type: "function"
  }
];
var IBrevisProof__factory = class {
  static createInterface() {
    return new utils4.Interface(_abi4);
  }
  static connect(address, signerOrProvider) {
    return new Contract5(address, _abi4, signerOrProvider);
  }
};
IBrevisProof__factory.abi = _abi4;

// ../contract/typechain/factories/Tx__factory.ts
import { utils as utils5, Contract as Contract6, ContractFactory } from "ethers";
var _abi5 = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "txRaw",
        type: "bytes"
      }
    ],
    name: "decodeTx",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "chainId",
            type: "uint64"
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64"
          },
          {
            internalType: "uint256",
            name: "gasTipCap",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "gasFeeCap",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          },
          {
            internalType: "address",
            name: "from",
            type: "address"
          }
        ],
        internalType: "struct Tx.TxInfo",
        name: "info",
        type: "tuple"
      }
    ],
    stateMutability: "pure",
    type: "function"
  }
];
var _bytecode = "0x6080806040523461001a57610e5d9081610020823930815050f35b600080fdfe604060808152600436101561001357600080fd5b600090813560e01c63dae029d31461002a57600080fd5b602090816003193601126103d95767ffffffffffffffff916004358381116103d557366023820112156103d55780600401359384116103d557602481019060248536920101116103d5576102e7946102dd926102cc9261008861052e565b9660ff926100bd6002856100b66100b06100a2878961059c565b356001600160f81b03191690565b60f81c90565b16146105b9565b6100e26100dd6100d86100d1858088610605565b36916106b4565b610a18565b610a80565b926101166101086100fb6100f5876106eb565b51610b98565b67ffffffffffffffff1690565b67ffffffffffffffff168b52565b6101386101286100fb6100f5876106f8565b67ffffffffffffffff168b840152565b6101446100f585610708565b898b01526101546100f585610718565b60608b01526101656100f585610728565b60808b015261018f61017f61017986610738565b51610b7a565b6001600160a01b031660a08c0152565b61019b6100f585610748565b60c08b01526101b26101ac85610758565b51610c06565b60e08b01526101cc6101c66100f586610769565b60ff1690565b956101f06101e56101ac6101ea6101e56101ac8a61077a565b6107b0565b9761078b565b958a61020a6102056100b06100a289886105aa565b6107e9565b9582871660010361039f576102366101c66102316100b061022b858a610644565b90610876565b610801565b965b61ffff8816603781116102eb5750506102c093926102a0876102926102b8958561028c61027d61026b6102a8998e610655565b9d9093610277816108a2565b91610663565b929093519c8d9687019161090a565b9161090a565b03601f1981018852876104fd565b859716610825565b60f81b6001600160f81b03191690565b901a91610986565b535b8151910120610996565b6001600160a01b0316610100840152565b519182918261041d565b0390f35b909697945083959391925011156000146103655761035f93828261032161031b6100a2610333966103519861059c565b98610814565b9261032b826108a2565b931691610680565b8c5195869491929160f81b6001600160f81b03191690888601610954565b03601f1981018352826104fd565b906102c2565b61035f93828261032161031b6100a2610381966103519861059c565b8c5195869491929160f01b6001600160f01b03191690888601610918565b6103cf6103ca6103c46103be6103b76101c68c610814565b858a610627565b90610836565b60f01c90565b610862565b96610238565b8480fd5b8280fd5b919082519283825260005b848110610409575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016103e8565b6104c3906020815261043c60208201845167ffffffffffffffff169052565b602083015167ffffffffffffffff1660408201526040830151606082015260608301516080820152608083015160a082015261048860a084015160c08301906001600160a01b03169052565b60c083015160e082015260e0830151610120906104b26101009183838601526101408501906103dd565b9401516001600160a01b0316910152565b90565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff8211176104f857604052565b6104c6565b90601f8019910116810190811067ffffffffffffffff8211176104f857604052565b6040519061052c826104dc565b565b60405190610120820182811067ffffffffffffffff8211176104f857604052816101006000918281528260208201528260408201528260608201528260808201528260a08201528260c0820152606060e08201520152565b634e487b7160e01b600052603260045260246000fd5b90156105a55790565b610586565b90600110156105a55760010190565b156105c057565b60405162461bcd60e51b815260206004820152601660248201527f6e6f7420612044796e616d6963466565547854797065000000000000000000006044820152606490fd5b909291928360011161062257831161062257600101916000190190565b600080fd5b909291928360021161062257831161062257600201916001190190565b906003116106225760020190600190565b906002116106225790600290565b909291928360031161062257831161062257600301916002190190565b90939293848311610622578411610622578101920390565b67ffffffffffffffff81116104f857601f01601f191660200190565b9291926106c082610698565b916106ce60405193846104fd565b829481845281830111610622578281602093846000960137010152565b8051156105a55760200190565b8051600110156105a55760400190565b8051600210156105a55760600190565b8051600310156105a55760800190565b8051600410156105a55760a00190565b8051600510156105a55760c00190565b8051600610156105a55760e00190565b8051600710156105a5576101000190565b8051600910156105a5576101400190565b8051600a10156105a5576101600190565b8051600b10156105a5576101800190565b80518210156105a55760209160051b010190565b6020815191015190602081106107c4575090565b6000199060200360031b1b1690565b634e487b7160e01b600052601160045260246000fd5b60ff60f6199116019060ff82116107fc57565b6107d3565b60ff6042199116019060ff82116107fc57565b60ff166002019060ff82116107fc57565b60ff1660c0019060ff82116107fc57565b6001600160f01b0319903581811693926002811061085357505050565b60020360031b82901b16169150565b61ffff90811660421901919082116107fc57565b6001600160f81b0319903581811693926001811061089357505050565b60010360031b82901b16169150565b6042198101919082116107fc57565b60bf198101919082116107fc57565b607f198101919082116107fc57565b60200390602082116107fc57565b6000198101919082116107fc57565b60f6198101919082116107fc57565b60b6198101919082116107fc57565b908092918237016000815290565b6001600160f81b0319909116815260f960f81b60018201526001600160f01b031990911660028201526004929182908483013701016000815290565b6001600160f81b03199182168152601f60fb1b6001820152911660028201526003929182908483013701016000815290565b8051600110156105a55760210190565b919260ff8116601b81106109e5575b509160209360809260ff60009560405194855216868401526040830152606082015282805260015afa156109d95760005190565b6040513d6000823e3d90fd5b601b9150929192019060ff82116107fc57919060206109a5565b60405190610a0c826104dc565b60006020838281520152565b610a206109ff565b50602081519160405192610a33846104dc565b835201602082015290565b67ffffffffffffffff81116104f85760051b60200190565b90600182018092116107fc57565b919082018092116107fc57565b60001981146107fc5760010190565b610a8981610b53565b1561062257610a9781610c53565b610aa081610a3e565b91610aae60405193846104fd565b818352601f19610abd83610a3e565b0160005b818110610b3c575050610ae2602080920151610adc81610d3b565b90610a64565b6000905b838210610af4575050505090565b610b3081610b04610b3693610cb5565b90610b0d61051f565b8281528187820152610b1f868a61079c565b52610b2a858961079c565b50610a64565b91610a71565b90610ae6565b602090610b476109ff565b82828801015201610ac1565b805115610b7457602060c09101515160001a10610b6f57600190565b600090565b50600090565b601581510361062257610b946001600160a01b0391610b98565b1690565b80518015159081610bce575b501561062257610bb390610bda565b90519060208110610bc2575090565b6020036101000a900490565b60219150111538610ba4565b906020820191610bea8351610d3b565b9251908382018092116107fc57519283039283116107fc579190565b80511561062257610c196104c391610bda565b610c2581939293610698565b92610c3360405194856104fd565b818452601f19610c4283610698565b013660208601378360200190610daa565b805115610b745760009060208101908151610c6d81610d3b565b81018091116107fc579151905181018091116107fc5791905b828110610c935750905090565b610c9c81610cb5565b81018091116107fc57610caf9091610a71565b90610c86565b805160001a906080821015610ccb575050600190565b60b8821015610ce65750610ce16104c3916108c0565b610a56565b9060c0811015610d0a5760b51991600160b783602003016101000a91015104010190565b9060f8821015610d215750610ce16104c3916108b1565b60010151602082900360f7016101000a90040160f5190190565b5160001a6080811015610d4e5750600090565b60b881108015610d85575b15610d645750600190565b60c0811015610d7957610ce16104c3916108fb565b610ce16104c3916108ec565b5060c08110158015610d59575060f88110610d59565b601f81116107fc576101000a90565b929091928315610e215792915b602093848410610dec57805182528481018091116107fc579381018091116107fc5791601f1981019081116107fc5791610db7565b9193509180610dfa57505050565b610e0e610e09610e13926108cf565b610d9b565b6108dd565b905182518216911916179052565b5091505056fea26469706673582212209f248e3623c0552a588c9ed1a405b35a0ff8efaec2e217249cf2a7102e52077164736f6c63430008140033";
var isSuperArgs = (xs) => xs.length > 1;
var Tx__factory = class extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi5, _bytecode, args[0]);
    }
    this.contractName = "Tx";
  }
  deploy(overrides) {
    return super.deploy(overrides || {});
  }
  getDeployTransaction(overrides) {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address) {
    return super.attach(address);
  }
  connect(signer) {
    return super.connect(signer);
  }
  static createInterface() {
    return new utils5.Interface(_abi5);
  }
  static connect(address, signerOrProvider) {
    return new Contract6(address, _abi5, signerOrProvider);
  }
};
Tx__factory.bytecode = _bytecode;
Tx__factory.abi = _abi5;

// ../contract/typechain/factories/FeeReimbursementApp__factory.ts
import { utils as utils6, Contract as Contract7, ContractFactory as ContractFactory2 } from "ethers";
var _abi6 = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_brevisProof",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "InvalidNewClaimPeriod",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "BrevisProofUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "ClaimerUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "ContractsHashUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint248",
        name: "feeRebate",
        type: "uint248"
      },
      {
        indexed: false,
        internalType: "uint248",
        name: "volume30D",
        type: "uint248"
      },
      {
        indexed: false,
        internalType: "uint248",
        name: "feeRebateWithRate",
        type: "uint248"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "startBlockNumber",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "endBlockNumber",
        type: "uint64"
      }
    ],
    name: "FeeRebateAccumulated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "FeeRebateTireModuleUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint248",
        name: "feeRebate",
        type: "uint248"
      }
    ],
    name: "FeeReimbursed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "vkHashes",
        type: "bytes32[]"
      },
      {
        indexed: false,
        internalType: "uint16[]",
        name: "sizes",
        type: "uint16[]"
      }
    ],
    name: "VkHashesUpdated",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "accountAccumulatedFee",
    outputs: [
      {
        internalType: "uint248",
        name: "",
        type: "uint248"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "accountClaimPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "startBlockNumber",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "endBlockNumber",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData[]",
        name: "_proofDataArray",
        type: "tuple[]"
      },
      {
        internalType: "bytes[]",
        name: "_appCircuitOutputs",
        type: "bytes[]"
      }
    ],
    name: "brevisBatchCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes"
      }
    ],
    name: "brevisCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "brevisProof",
    outputs: [
      {
        internalType: "contract IBrevisProof",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "claimer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "contractsHash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "feeRebateTierModule",
    outputs: [
      {
        internalType: "contract IFeeRebateTierModule",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardTokenDecimals",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_brevisProof",
        type: "address"
      }
    ],
    name: "setBrevisProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_claimer",
        type: "address"
      }
    ],
    name: "setClaimer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contractsHash",
        type: "uint256"
      }
    ],
    name: "setContractsHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IFeeRebateTierModule",
        name: "_feeRebateTierModule",
        type: "address"
      }
    ],
    name: "setFeeRebateTierModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address"
      },
      {
        internalType: "uint24",
        name: "_decimals",
        type: "uint24"
      }
    ],
    name: "setRewardToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_vkHashes",
        type: "bytes32[]"
      },
      {
        internalType: "uint16[]",
        name: "_sizes",
        type: "uint16[]"
      }
    ],
    name: "setVkHashes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "commitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "vkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appCommitHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "appVkHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          }
        ],
        internalType: "struct Brevis.ProofData",
        name: "_proofData",
        type: "tuple"
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32"
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]"
      },
      {
        internalType: "uint8",
        name: "_nodeIndex",
        type: "uint8"
      },
      {
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes"
      }
    ],
    name: "singleRun",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32"
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "blkNum",
                type: "uint64"
              },
              {
                internalType: "uint64",
                name: "receiptIndex",
                type: "uint64"
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "uint8",
                        name: "valueFromTopic",
                        type: "uint8"
                      },
                      {
                        internalType: "uint64",
                        name: "valueIndex",
                        type: "uint64"
                      },
                      {
                        internalType: "address",
                        name: "contractAddress",
                        type: "address"
                      },
                      {
                        internalType: "bytes32",
                        name: "logTopic0",
                        type: "bytes32"
                      }
                    ],
                    internalType: "struct Brevis.LogExtraInfo",
                    name: "logExtraInfo",
                    type: "tuple"
                  },
                  {
                    internalType: "uint64",
                    name: "logIndex",
                    type: "uint64"
                  },
                  {
                    internalType: "bytes32",
                    name: "value",
                    type: "bytes32"
                  }
                ],
                internalType: "struct Brevis.LogInfo[5]",
                name: "logs",
                type: "tuple[5]"
              }
            ],
            internalType: "struct Brevis.ReceiptInfo[]",
            name: "receipts",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32"
              },
              {
                internalType: "address",
                name: "account",
                type: "address"
              },
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "slotValue",
                type: "bytes32"
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64"
              }
            ],
            internalType: "struct Brevis.StorageInfo[]",
            name: "stores",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "leafHash",
                type: "bytes32"
              },
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32"
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64"
              },
              {
                internalType: "uint64",
                name: "blockTime",
                type: "uint64"
              },
              {
                internalType: "bytes",
                name: "leafRlpPrefix",
                type: "bytes"
              }
            ],
            internalType: "struct Brevis.TransactionInfo[]",
            name: "txs",
            type: "tuple[]"
          }
        ],
        internalType: "struct Brevis.ExtractInfos",
        name: "_extractInfos",
        type: "tuple"
      }
    ],
    name: "validateRequest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "vkHashesToCircuitSize",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var _bytecode2 = "0x6080346100a957601f611eeb38819003918201601f19168301916001600160401b038311848410176100ae578084926020946040528339810103126100a957516001600160a01b0390818116908190036100a95760018060a01b031990816000541617600055600154903390821617600155604051913391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3611e2690816100c58239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe60c0604052600436101561001257600080fd5b6000803560e01c80631dd3f354146118625780631e83409a1461179b578063360fde491461173f57806343c927a9146117215780635419f27c146116d55780635d1c29eb146114fa578063715018a61461149a57806379d6b6a21461111f5780637c08aa7414610a285780637f239c4d14610a015780638da5cb5b146109da5780639bdcecd1146109b4578063a184a0c714610986578063ada323ff146108f9578063b18c0868146108b8578063b90c209a14610842578063c772c87f146107d2578063c7f5aaa0146107ac578063cdfb58321461073a578063d379be2314610713578063ed1fe83b14610222578063f2fde38b146101435763f7c618c11461011a57600080fd5b3461014057806003193601126101405760206001600160a01b0360025416604051908152f35b80fd5b50346101405760203660031901126101405761015d6119df565b600154906001600160a01b0380831691610178338414611b7e565b169182156101b7576001600160a01b03191682176001557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b50346101405760603660031901126101405761023c611a09565b6024359067ffffffffffffffff821161070f573660238301121561070f5767ffffffffffffffff82600401351161070f5736602460a08460040135028401011161070f5760443567ffffffffffffffff811161070b576102a09036906004016119ae565b9290916102b284836004013514611c14565b6001600160a01b0385541690813b156107075785906040519063cf7ac5a960e01b825267ffffffffffffffff604483019116600483015260406024830152846004013590526064810192602485019384845b876004013581106106c657505083918380809303915afa80156106bb576106a3575b505b82600401358110610337578580f35b61036f604061034b83866004013586611c85565b013561036261035b848989611cab565b3691611b37565b6020815191012014611bc9565b61037e81846004013584611c85565b50606061039082856004013585611c85565b013561039d828787611cab565b90918852600660205261ffff6040892054161561066b5780601411610663578060331161066357806052116106635780605a116106635760629080821161066757608211610663578101356005540361061e57601481013560081c908180610542575b61041d823560601c605a84013560c01c605285013560c01c611d2a565b823560601c8a52600760205260408a209067ffffffffffffffff8151166fffffffffffffffff00000000000000006020845493015160401b16916fffffffffffffffffffffffffffffffff19161717905560086020526001600160f81b0360408a2054166001600160f81b0380831682011161052e5792605a836001600160f81b0360c0946105299897828f6040907f865837efc36f96ff0de4b15e50b0ead4bf18a6928f7045e7e39161eebf7c5dc79a3560601c815260086020522091818416011660ff60f81b82541617905560405194833560601c86526020860152603383013560081c60408601521660608401526052810135841c60808401520135821c60a0820152a1611c60565b610328565b634e487b7160e01b8a52601160045260248afd5b602460206001600160a01b03600354166040519283809263b72bf50960e01b8252603388013560081c60048301525afa8015610613578a906105c4575b67ffffffffffffffff91501680610597575b50610400565b90806001600160f81b03838202160482148115171561052e57606491026001600160f81b03160438610591565b506020813d60201161060b575b816105de60209383611afd565b81010312610607575167ffffffffffffffff811681036106075767ffffffffffffffff9061057f565b8980fd5b3d91506105d1565b6040513d8c823e3d90fd5b60405162461bcd60e51b815260206004820152601660248201527f696e76616c696420636f6e7472616374732068617368000000000000000000006044820152606490fd5b8780fd5b8880fd5b60405162461bcd60e51b815260206004820152601060248201526f1d9ad2185cda081b9bdd081d985b1a5960821b6044820152606490fd5b6106ac90611a63565b6106b7578438610326565b8480fd5b6040513d84823e3d90fd5b81358352602080830135908401526040808301359084015260608083013590840152608080830135908401528a955060a09283019290910190600101610304565b8580fd5b8380fd5b8280fd5b503461014057806003193601126101405760206001600160a01b0360045416604051908152f35b5034610140576020366003190112610140577fad74290dd7363323a597a949fa2f97ae088f486218d8190369bb417a41a075e360206107776119df565b6001600160a01b039061078f82600154163314611b7e565b16806001600160a01b03196004541617600455604051908152a180f35b50346101405780600319360112610140576001600160a01b036020915416604051908152f35b5034610140576020366003190112610140577f1bf3143ab1544528303e489724067fb6c3ff3f7e3b0a6df041cae24242e44773602061080f6119df565b6001600160a01b039061082782600154163314611b7e565b16806001600160a01b0319855416178455604051908152a180f35b5034610140576020366003190112610140576004356001600160a01b0380821680920361070f577fae4a28486e59e557cbe94f201dc6e5c485bd89a590bc78f414add8c2f6b4bd8d9161089c602092600154163314611b7e565b806001600160a01b03196003541617600355604051908152a180f35b5034610140576020366003190112610140576001600160f81b0360406020926001600160a01b036108e76119df565b16815260088452205416604051908152f35b5034610140576040366003190112610140576109136119df565b60243562ffffff8116810361070f577fffffffffffffffffff00000000000000000000000000000000000000000000006001600160a01b0361095a81600154163314611b7e565b76ffffff00000000000000000000000000000000000000006002549360a01b1693169116171760025580f35b50346101405760203660031901126101405761ffff6040602092600435815260068452205416604051908152f35b5034610140578060031936011261014057602062ffffff60025460a01c16604051908152f35b503461014057806003193601126101405760206001600160a01b0360015416604051908152f35b503461014057806003193601126101405760206001600160a01b0360035416604051908152f35b50346101405760031960603682011261111b576024359067ffffffffffffffff82168203611106576044359067ffffffffffffffff821161070b57608090823603011261070f5760405190610a7c82611a8d565b80600401358252602481013567ffffffffffffffff81116106b7578101366023820112156106b757600481013590610ab382611b1f565b91610ac16040519384611afd565b808352602083019136602483600a1b830101116106635760248101925b602483600a1b8301018410610ff257505050506020830152604481013567ffffffffffffffff81116106b7578101366023820112156106b757600481013590610b2682611b1f565b91610b346040519384611afd565b808352602083019136602460a0840283010111610663579160248301925b602460a084028201018410610f8e5750505050604083015260648101359067ffffffffffffffff82116106b7573660238383010112156106b7576004828201013590610b9d82611b1f565b92610bab6040519485611afd565b82845260208401913660248560051b84840101011161066357602482820101925b60248560051b84840101018410610ec057505050505060608201526001600160a01b0383541690813b1561070b5791839167ffffffffffffffff93604051948593631f022a9d60e21b855260043560048601521660248401526060604484015260e48301908051606485015260208101519160806084860152825180915260206101048601930190865b818110610dfd575050506040810151916063198582030160a486015260208084519283815201930190865b818110610d9e5750505060600151906063198482030160c4850152815180825260208201916020808360051b83010194019287915b838310610cf357505050505082809103915afa80156106bb57610cdf575b602060405160018152f35b610ce98291611a63565b6101405780610cd4565b9295975092955092601f1982820301835260808651805183526020810151602084015267ffffffffffffffff604082015116604084015267ffffffffffffffff606082015116606084015201519060a060808201528151918260a08301528a5b838110610d885750506020600192819260c0918d838284010152601f8019910116010197019301930187959389979592610cb6565b80602080928401015160c0828601015201610d53565b929496509281955060a060209167ffffffffffffffff608060019551805184526001600160a01b038682015116868501526040810151604085015260608101516060850152015116608082015201950191019086949288969492610c81565b92949650929094506040855167ffffffffffffffff815116835267ffffffffffffffff60208201511660208401520151604082019089915b60058310610e5a57505050602061040060019201950191019086949288969492610c56565b602060c0600192604085516060815160ff815116855267ffffffffffffffff8782015116878601526001600160a01b038482015116848601520151606084015267ffffffffffffffff85820151166080840152015160a082015201920192019190610e35565b833567ffffffffffffffff81116106075760a08385018201360360231901126106075760405191610ef083611ac5565b83850182016024810135845260448101356020850152610f1290606401611a20565b6040840152610f276084838787010101611a20565b606084015260a4828686010101359067ffffffffffffffff8211610f8a5736604383858989010101011215610f8a576024936020938493610f789136918a8a01909101018088013590604401611b37565b60808201528152019401939050610bcc565b8b80fd5b60a0843603126106675760a0806020602494604051610fac81611ac5565b88358152610fbb838a016119f5565b838201526040890135604082015260608901356060820152610fdf60808a01611a20565b6080820152815201950194925050610b52565b6104008085360312610607576040519061100b82611aa9565b61101486611a20565b825261102260208701611a20565b602083015236605f87011215611117576040519061103f82611ac5565b819036818901116111135760408801915b818901831061107357505050604082015281526104009390930192602001610ade565b60c08336031261110f5760405161108981611aa9565b60808436031261110b57604051916110a083611a8d565b84359160ff83168303611106578360209360c095526110c0848801611a20565b848201526110d0604088016119f5565b60408201526060870135606082015281526110ed60808701611a20565b8382015260a08601356040820152815201920191611050565b600080fd5b8e80fd5b8d80fd5b8c80fd5b8a80fd5b5080fd5b503461014057604036600319011261014057602467ffffffffffffffff813581811161070b57611153903690600401611a35565b916001600160a01b039084604083885416815197888092632cc27dc960e11b825260043560048301525afa801561148f5787968891611456575b506111ab61119c368888611b37565b9788516020809a012014611bc9565b87526006865261ffff60408820541615611420578460141161141c57833560601c958560331161066357601485013560081c918660521161066757603386013560081c9387605a1161060757605287013560c01c968860621161111757605a81013560c01c986082116111175760620135600554036113d85783958284861592831561131c575b50505050611241898989611d2a565b898b526007845260408b20918151166fffffffffffffffff000000000000000085845493015160401b16916fffffffffffffffffffffffffffffffff191617179055600882526001600160f81b03808060408c20541696168096019181831161130a57509160c097959391899795937f865837efc36f96ff0de4b15e50b0ead4bf18a6928f7045e7e39161eebf7c5dc79a8c526008835260408c20911660ff60f81b82541617905560405196875286015260408501526060840152608083015260a0820152a180f35b634e487b7160e01b8b5260116004528afd5b600354166040519283809263b72bf50960e01b82528b60048301525afa80156113cd5783918d91611393575b50169081611359575b848491611232565b909196506001600160f81b0382860216918583041417156113805760649004943880611351565b50634e487b7160e01b8952601160045288fd5b809250868092503d83116113c6575b6113ac8183611afd565b81010312610f8a57518281168103610f8a57829038611348565b503d6113a2565b6040513d8e823e3d90fd5b60405162461bcd60e51b8152600481018490526016818401527f696e76616c696420636f6e7472616374732068617368000000000000000000006044820152606490fd5b8680fd5b8560106064926040519262461bcd60e51b845260048401528201526f1d9ad2185cda081b9bdd081d985b1a5960821b6044820152fd5b9650506040863d604011611487575b8161147260409383611afd565b8101031261141c57602086519601513861118d565b3d9150611465565b6040513d89823e3d90fd5b503461014057806003193601126101405760006001546001600160a01b03196001600160a01b038216916114cf338414611b7e565b166001557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b50346101405761014036600319011261014057611515611a09565b60a036602319011261111b5767ffffffffffffffff60e43581811161070b576115429036906004016119ae565b926101049283359260ff841680940361141c578661012496873584811161070f57611571903690600401611a35565b9790966001600160a01b03968785541692833b1561070757879260405197889687958695632247cd8f60e01b875216600486015260249e8f803590870152604435604487015260643580608052606487015260843560a05260a051608487015260a43560a487015260c43560c487015260e4860161012090528501906115f692611ced565b9183015203915afa801561148f576116c2575b50611615368585611b37565b9461162a865160208098012060805114611bc9565b60a05187526006865261ffff60408820541615611420578460141161141c57833560601c958560331161066357601485013560081c918660521161066757603386013560081c9387605a1161060757605287013560c01c968860621161111757605a81013560c01c986082116111175760620135600554036113d85783958284861592831561131c5750505050611241898989611d2a565b6116ce90969196611a63565b9438611609565b503461014057602036600319011261014057604080916001600160a01b036116fb6119df565b1681526007602052205481519067ffffffffffffffff908181168352831c166020820152f35b50346101405780600319360112610140576020600554604051908152f35b5034610140576020366003190112610140577f7bfc81ef745ea2254ff60bbb4fb7e8855f897b7aa3907ea8eebc957c362d8f5e602060043561178d6001600160a01b03600154163314611b7e565b80600555604051908152a180f35b5034610140576020366003190112610140576117b56119df565b6001600160a01b03908160045416330361181d577f17525e7c25776b686f3c5fb5714aac26a41bdccd536c711002922e7e5ffb4c2c916040911680845260086020526001600160f81b0382852080549060ff60f81b821690558351928352166020820152a180f35b60405162461bcd60e51b815260206004820152601760248201527f696e76616c696420636c61696d657220616464726573730000000000000000006044820152606490fd5b50346101405760403660031901126101405767ffffffffffffffff60043581811161070f576118959036906004016119ae565b9160243590811161070b576118ae9036906004016119ae565b90916001906118c86001600160a01b038354163314611b7e565b6118d3838614611c14565b855b85811061195f57506118f39060405195604087526040870191611ced565b916020838682950382880152828152019392865b82811061193857877fb3f7d79a2f90dac793ddd7d86f2d7d5d073e107289c685083e9d4329f1640f5c88880389a180f35b909192939485359061ffff8216809203610667579081528201948201939291908301611907565b61196d818587969596611de0565b359061ffff8216809203610663576119a69161198a828986611de0565b3589526006602052604089209061ffff19825416179055611c60565b9291926118d5565b9181601f840112156111065782359167ffffffffffffffff8311611106576020808501948460051b01011161110657565b600435906001600160a01b038216820361110657565b35906001600160a01b038216820361110657565b6004359067ffffffffffffffff8216820361110657565b359067ffffffffffffffff8216820361110657565b9181601f840112156111065782359167ffffffffffffffff8311611106576020838186019501011161110657565b67ffffffffffffffff8111611a7757604052565b634e487b7160e01b600052604160045260246000fd5b6080810190811067ffffffffffffffff821117611a7757604052565b6060810190811067ffffffffffffffff821117611a7757604052565b60a0810190811067ffffffffffffffff821117611a7757604052565b6040810190811067ffffffffffffffff821117611a7757604052565b90601f8019910116810190811067ffffffffffffffff821117611a7757604052565b67ffffffffffffffff8111611a775760051b60200190565b92919267ffffffffffffffff8211611a775760405191611b61601f8201601f191660200184611afd565b829481845281830111611106578281602093846000960137010152565b15611b8557565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b15611bd057565b606460405162461bcd60e51b815260206004820152602060248201527f6661696c656420746f206f70656e206f757470757420636f6d6d69746d656e746044820152fd5b15611c1b57565b60405162461bcd60e51b815260206004820152601060248201527f6c656e677468206e6f74206d61746368000000000000000000000000000000006044820152606490fd5b6000198114611c6f5760010190565b634e487b7160e01b600052601160045260246000fd5b9190811015611c955760a0020190565b634e487b7160e01b600052603260045260246000fd5b9190811015611c955760051b81013590601e198136030182121561110657019081359167ffffffffffffffff8311611106576020018236038113611106579190565b90918281527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83116111065760209260051b809284830137010190565b916001600160a01b039060006020604051611d4481611ae1565b828152015216600052600760205260406000209160405192611d6584611ae1565b549067ffffffffffffffff808084169384875260401c166020860193818552159081611dd7575b50611dca5780808651169416938410611dc05780835116911611611dbc57604051632d75bc4f60e01b8152600490fd5b5290565b9250905016815290565b8092939116845216905290565b90501538611d8c565b9190811015611c955760051b019056fea2646970667358221220bfacff671d4e1600df49daf1a26437b33a11f174758617dfefb134d5b5f8472064736f6c63430008140033";
var isSuperArgs2 = (xs) => xs.length > 1;
var FeeReimbursementApp__factory = class extends ContractFactory2 {
  constructor(...args) {
    if (isSuperArgs2(args)) {
      super(...args);
    } else {
      super(_abi6, _bytecode2, args[0]);
    }
    this.contractName = "FeeReimbursementApp";
  }
  deploy(_brevisProof, overrides) {
    return super.deploy(
      _brevisProof,
      overrides || {}
    );
  }
  getDeployTransaction(_brevisProof, overrides) {
    return super.getDeployTransaction(_brevisProof, overrides || {});
  }
  attach(address) {
    return super.attach(address);
  }
  connect(signer) {
    return super.connect(signer);
  }
  static createInterface() {
    return new utils6.Interface(_abi6);
  }
  static connect(address, signerOrProvider) {
    return new Contract7(address, _abi6, signerOrProvider);
  }
};
FeeReimbursementApp__factory.bytecode = _bytecode2;
FeeReimbursementApp__factory.abi = _abi6;

// ../contract/typechain/factories/IFeeRebateTierModule__factory.ts
import { Contract as Contract8, utils as utils7 } from "ethers";
var _abi7 = [
  {
    inputs: [
      {
        internalType: "uint248",
        name: "volume30D",
        type: "uint248"
      }
    ],
    name: "getFeeRebatePercentage",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var IFeeRebateTierModule__factory = class {
  static createInterface() {
    return new utils7.Interface(_abi7);
  }
  static connect(address, signerOrProvider) {
    return new Contract8(
      address,
      _abi7,
      signerOrProvider
    );
  }
};
IFeeRebateTierModule__factory.abi = _abi7;

// ../contract/typechain/factories/MockFeeModule__factory.ts
import { utils as utils8, Contract as Contract9, ContractFactory as ContractFactory3 } from "ethers";
var _abi8 = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint248",
        name: "volume30D",
        type: "uint248"
      }
    ],
    name: "getFeeRebatePercentage",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
var _bytecode3 = "0x6080806040523461005b5760008054336001600160a01b0319821681178355916001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a361034390816100618239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c8063715018a6146101d55780638da5cb5b146101a2578063b72bf509146101475763f2fde38b1461004957600080fd5b346101445760203660031901126101445760043573ffffffffffffffffffffffffffffffffffffffff8082168092036101405782549081169061008d33831461024c565b82156100d55773ffffffffffffffffffffffffffffffffffffffff1916821783557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b8280fd5b80fd5b503461014457602036600319011261014457600435907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8216820361014457602061019083610297565b67ffffffffffffffff60405191168152f35b503461014457806003193601126101445773ffffffffffffffffffffffffffffffffffffffff6020915416604051908152f35b503461014457806003193601126101445780805473ffffffffffffffffffffffffffffffffffffffff1973ffffffffffffffffffffffffffffffffffffffff82169161022233841461024c565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b1561025357565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b670de0b6b3a76400007effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9182160416633b9aca008111156102d75750601e90565b6305f5e1008111156102e95750601490565b629896808111156102fa5750600a90565b620f42401061030857600090565b60059056fea2646970667358221220790bfcf40637c588b54bd9bdbf9a6fb911b9b7a3a9b7a0fe9349e7ab82a60bb064736f6c63430008140033";
var isSuperArgs3 = (xs) => xs.length > 1;
var MockFeeModule__factory = class extends ContractFactory3 {
  constructor(...args) {
    if (isSuperArgs3(args)) {
      super(...args);
    } else {
      super(_abi8, _bytecode3, args[0]);
    }
    this.contractName = "MockFeeModule";
  }
  deploy(overrides) {
    return super.deploy(overrides || {});
  }
  getDeployTransaction(overrides) {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address) {
    return super.attach(address);
  }
  connect(signer) {
    return super.connect(signer);
  }
  static createInterface() {
    return new utils8.Interface(_abi8);
  }
  static connect(address, signerOrProvider) {
    return new Contract9(address, _abi8, signerOrProvider);
  }
};
MockFeeModule__factory.bytecode = _bytecode3;
MockFeeModule__factory.abi = _abi8;

// src/brevis_request/BrevisRequest__factory.ts
import { utils as utils9, Contract as Contract10, ContractFactory as ContractFactory4 } from "ethers";
var _abi9 = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeCollector",
        type: "address"
      },
      {
        internalType: "contract IBrevisProof",
        name: "_brevisProof",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "FeeCollectorUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      }
    ],
    name: "RequestFulfilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "callback",
        type: "address"
      }
    ],
    name: "RequestSent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "from",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "to",
        type: "uint256"
      }
    ],
    name: "RequestTimeoutUpdated",
    type: "event"
  },
  {
    inputs: [],
    name: "brevisProof",
    outputs: [
      {
        internalType: "contract IBrevisProof",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    name: "chargeFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "_to",
        type: "address"
      }
    ],
    name: "collectFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "feeCollector",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64"
      },
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes"
      },
      {
        internalType: "bool",
        name: "_withAppProof",
        type: "bool"
      },
      {
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes"
      }
    ],
    name: "fulfillRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    name: "queryRequestStatus",
    outputs: [
      {
        internalType: "enum BrevisRequest.RequestStatus",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      }
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "requestTimeout",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "requests",
    outputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "refundee",
        type: "address"
      },
      {
        internalType: "address",
        name: "callback",
        type: "address"
      },
      {
        internalType: "enum BrevisRequest.RequestStatus",
        name: "status",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "_refundee",
        type: "address"
      },
      {
        internalType: "address",
        name: "_callback",
        type: "address"
      }
    ],
    name: "sendRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeCollector",
        type: "address"
      }
    ],
    name: "setFeeCollector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timeout",
        type: "uint256"
      }
    ],
    name: "setRequestTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    stateMutability: "payable",
    type: "receive"
  }
];
var _bytecode4 = "0x6080346100c057601f610d9638819003918201601f19168301916001600160401b038311848410176100c55780849260409485528339810103126100c05780516001600160a01b0391828216918290036100c05760200151908282168092036100c0576000549060018060a01b0319913383821617600055604051943391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a38160015416176001556003541617600355610cba90816100dc8239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe60806040818152600480361015610021575b505050361561001f57600080fd5b005b600092833560e01c9081633f20b4c91461097b57508063622b6af41461091a5780636a96173514610700578063715018a6146106a0578381637249fbb614610600575080637ff7b0d2146105735780638da5cb5b1461054d5780639d866985146104e9578063a42dce8014610470578063b6979c3e1461043a578063c415b95c14610412578063c7f5aaa0146103ea578063da47dc32146101d5578063e713b4c9146101b15763f2fde38b0361001157346101ad5760203660031901126101ad576100ea6109e0565b908354906001600160a01b0380831693610105338614610a19565b169384156101445750506001600160a01b031916821783557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b8382346101d15760203660031901126101d1576101ce9035610b49565b80f35b5080fd5b50919060603660031901126101d1578235906101ef6109ca565b90604435916001600160a01b038084168094036103e657848652602091878352838720546103a35781169081156103605760025442019081421161034d5784519160a0830183811067ffffffffffffffff82111761033a5786528252600384830192348452868101948552606081019488865260808201948b86528a8c528c8852888c209251835551600183015583600283019151166001600160a01b031982541617905501925116825491516003811015610327577fffffffffffffffffffffff0000000000000000000000000000000000000000009092161760a09190911b74ff00000000000000000000000000000000000000001617905581519384523390840152349083015260608201527f4eede03ca33645529b4d82428b024149165298c901cf7453f68eb43bd3d3b65890608090a180f35b634e487b7160e01b895260218a52602489fd5b634e487b7160e01b8a5260418b5260248afd5b634e487b7160e01b885260118952602488fd5b835162461bcd60e51b8152808901849052601560248201527f726566756e646565206e6f742070726f766964656400000000000000000000006044820152606490fd5b835162461bcd60e51b8152808901849052601860248201527f7265717565737420616c726561647920696e20717565756500000000000000006044820152606490fd5b8580fd5b5050346101d157816003193601126101d1576020906001600160a01b03600354169051908152f35b5050346101d157816003193601126101d1576020906001600160a01b03600154169051908152f35b50346101ad5760203660031901126101ad5760ff6003836020958461046e95358252875220015460a01c16915180926109f6565bf35b5050346101d15760203660031901126101d1577f5d16ad41baeb009cd23eb8f6c7cde5c2e0cd5acf4a33926ab488875c37c37f38906104ad6109e0565b6001600160a01b036104c3818654163314610a19565b80600154921690816001600160a01b03198416176001558351921682526020820152a180f35b50346101ad5760203660031901126101ad578160a0938261046e93358252602052208054926001820154916001600160a01b039160038360028401541692015493815196875260208701528501528116606084015260ff6080840191851c166109f6565b5050346101d157816003193601126101d1576001600160a01b0360209254169051908152f35b50346101ad57816003193601126101ad5761058c6109ca565b916001600160a01b036001541633036105bd57508280806101ce948194359061c350f16105b7610abd565b50610c38565b906020606492519162461bcd60e51b8352820152601160248201527f6e6f742066656520636f6c6c6563746f720000000000000000000000000000006044820152fd5b8084843461069c57602036600319011261069c5780358084528160205261062b838520541515610afd565b80845281602052828420805442111561069857848080808460039961066b965560016001600160a01b036002830154169101549061c350f16105b7610abd565b84526020528220017402000000000000000000000000000000000000000060ff60a01b1982541617905580f35b8480fd5b5050fd5b83346106fd57806003193601126106fd578080546001600160a01b03196001600160a01b038216916106d3338414610a19565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b509190346101d15760a03660031901126101d15767ffffffffffffffff833560243582811690819003610698576044358381116103e6576107449036908801610997565b949060643594851515809603610905576084359081116109055761076b9036908a01610997565b939095896001600160a01b03936107a685600354169187519b8c968795630979240d60e21b8752860152606060248601526064850191610a9c565b926044830152818b60209b8c9503925af19081156109105788916108df575b50840361089c5786976107d785610b49565b8488528087526003838920017401000000000000000000000000000000000000000060ff60a01b198254161790557f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e6878451878152a1848852865260038288200154169384610844578680f35b86956108756108839288958551958694850198633ceb5b5160e11b8a52602486015260448501526064840191610a9c565b03601f198101835282610a64565b51925af150610890610abd565b50803880808080808680f35b815162461bcd60e51b8152808901879052601d60248201527f72657175657374496420616e642070726f6f66206e6f74206d617463680000006044820152606490fd5b90508681813d8311610909575b6108f68183610a64565b810103126109055751386107c5565b8780fd5b503d6108ec565b83513d8a823e3d90fd5b5090346101ad5760203660031901126101ad577f87a73c061f18ffd513249d1d727921e40e348948b01e2979efb36ef4f5204a6391356109656001600160a01b038554163314610a19565b600254908060025582519182526020820152a180f35b8490346101d157816003193601126101d1576020906002548152f35b9181601f840112156109c55782359167ffffffffffffffff83116109c557602083818601950101116109c557565b600080fd5b602435906001600160a01b03821682036109c557565b600435906001600160a01b03821682036109c557565b906003821015610a035752565b634e487b7160e01b600052602160045260246000fd5b15610a2057565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90601f8019910116810190811067ffffffffffffffff821117610a8657604052565b634e487b7160e01b600052604160045260246000fd5b908060209392818452848401376000828201840152601f01601f1916010190565b3d15610af8573d9067ffffffffffffffff8211610a865760405191610aec601f8201601f191660200184610a64565b82523d6000602084013e565b606090565b15610b0457565b60405162461bcd60e51b815260206004820152601460248201527f72657175657374206e6f7420696e2071756575650000000000000000000000006044820152606490fd5b60009080825260209060048252610b6560408420541515610afd565b6024826001600160a01b0360035416604051928380926371e8f36b60e11b82528660048301525afa908115610c2d578491610bf3575b5015610bae578252600490526040812055565b60405162461bcd60e51b815260048101839052601360248201527f70726f6f66206e6f742067656e657261746564000000000000000000000000006044820152606490fd5b90508281813d8311610c26575b610c0a8183610a64565b81010312610c2257518015158103610c225738610b9b565b8380fd5b503d610c00565b6040513d86823e3d90fd5b15610c3f57565b60405162461bcd60e51b815260206004820152601260248201527f73656e64206e6174697665206661696c656400000000000000000000000000006044820152606490fdfea26469706673582212201905409e4cdfc7fb6b946c9212735c55a3478272e9a45a4b96ed82c94b4d1ba164736f6c63430008140033";
var isSuperArgs4 = (xs) => xs.length > 1;
var BrevisRequest__factory = class extends ContractFactory4 {
  constructor(...args) {
    if (isSuperArgs4(args)) {
      super(...args);
    } else {
      super(_abi9, _bytecode4, args[0]);
    }
    this.contractName = "BrevisRequest";
  }
  deploy(_feeCollector, _brevisProof, overrides) {
    return super.deploy(
      _feeCollector,
      _brevisProof,
      overrides || {}
    );
  }
  getDeployTransaction(_feeCollector, _brevisProof, overrides) {
    return super.getDeployTransaction(
      _feeCollector,
      _brevisProof,
      overrides || {}
    );
  }
  attach(address) {
    return super.attach(address);
  }
  connect(signer) {
    return super.connect(signer);
  }
  static createInterface() {
    return new utils9.Interface(_abi9);
  }
  static connect(address, signerOrProvider) {
    return new Contract10(address, _abi9, signerOrProvider);
  }
};
BrevisRequest__factory.bytecode = _bytecode4;
BrevisRequest__factory.abi = _abi9;

// src/ether_interactions/index.ts
import * as dotenv from "dotenv";
dotenv.config();
var { FeeReimbursementApp__factory: FeeReimbursementApp__factory2 } = typechain_exports;
var dstChainProvider = new ethers2.providers.JsonRpcProvider(
  process.env.DEST_RPC ?? ""
);
var sourceChainProvider = new ethers2.providers.JsonRpcProvider(
  process.env.SOURCE_RPC ?? ""
);
var wallet = new ethers2.Wallet(
  process.env.PRIVATE_KEY ?? "",
  dstChainProvider
);
var brevisRequest = BrevisRequest__factory.connect(
  process.env.BREVIS_REQUEST ?? "",
  wallet
);
var userSwapAmountApp = FeeReimbursementApp__factory2.connect(
  process.env.FEE_REIMBURSEMENT ?? "",
  wallet
);
async function monitorFeeAccumulated() {
  userSwapAmountApp.on("FeeRebateAccumulated", (account, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber) => {
    const feeRebateBN = feeRebate;
    const volume30DBN = volume30D;
    const feeRebateWithRateBN = feeRebateWithRate;
    const startBlockNumberBN = startBlockNumber;
    const endBlockNumberBN = endBlockNumber;
    console.log("Fee Accumulated Event", account, feeRebate, volume30D, feeRebateWithRate, startBlockNumber, endBlockNumber);
    if (account === void 0 || account === null || feeRebateBN === void 0 || feeRebateBN === null || volume30DBN === void 0 || volume30DBN === null || feeRebateWithRateBN === void 0 || feeRebateWithRateBN === null || startBlockNumberBN === void 0 || startBlockNumberBN === null || endBlockNumberBN === void 0 || endBlockNumberBN === null) {
      return;
    }
    findUserExistingUTVF(account, BigInt(startBlockNumberBN.toString()), BigInt(endBlockNumberBN.toString())).then((utvf) => {
      if (utvf) {
        utvf.status = PROOF_STATUS_ONCHAIN_VERIFIED;
        utvf.fee_rebate = feeRebateWithRateBN;
        return updateUserTradeVolumeFee(utvf);
      }
    }).catch((error) => {
      console.error(
        "failed to update user swap amount",
        account,
        startBlockNumber,
        endBlockNumber,
        error
      );
    });
  });
}
async function monitorBrevisRequest() {
  brevisRequest.on("RequestSent", (requestId) => {
    updateBrevisRequestStatus(requestId).then().catch((error) => {
      console.error(
        "failed to update brevis request on-chain status",
        requestId,
        error
      );
    });
  });
}
async function submitBrevisRequestTx(utvf) {
  console.log(`submit tx for ${utvf.account}-${utvf.ymd}`);
  brevisRequest.sendRequest(
    utvf.brevis_query_hash,
    wallet.address ?? "",
    process.env.FEE_REIMBURSEMENT ?? "",
    {
      value: 0
    }
  ).then((tx) => {
    updateUserTradeVolumeFeeRequestSent(utvf.account, utvf.ymd, true);
    console.log(`tx: ${tx.hash} sent for ${utvf.account}, ${utvf.ymd}`);
  }).catch((error) => {
    const msg = `${error}`;
    if (msg.includes("execution reverted: request already in queue")) {
      updateUserTradeVolumeFeeRequestSent(utvf.account, utvf.ymd, true);
      console.log(`tx has been sent for ${utvf.account}, ${utvf.ymd}`);
    } else {
      console.error(`failed to submit tx: ${msg}`);
    }
  });
}

// src/rpc/index.ts
async function querySingleReceipt(receipt) {
  return sourceChainProvider.getTransactionReceipt(receipt.tx_hash).catch((error) => {
    console.log(error, error);
  }).then((transactionReceipt) => {
    if (transactionReceipt == null || transactionReceipt == void 0) {
      console.debug("tx receipt not found", receipt.id, receipt.tx_hash);
      return;
    }
    var shouldBeFilteredOut = transactionReceipt.logs.length > 128;
    transactionReceipt.logs.forEach((log) => {
      if (log.data.length >= 1e3) {
        shouldBeFilteredOut = true;
      }
    });
    if (Number(receipt.transaction_type) === TX_TYPE_ORDER_FEE_FLOW) {
      const result = getJSONForOrderFeeFlowTx(receipt.account, transactionReceipt);
      if (result.logsFound) {
        updateReceipt(
          receipt.tx_hash,
          receipt.account,
          receipt.transaction_type,
          STATUS_READY,
          result.data,
          shouldBeFilteredOut
        );
      }
    } else if (Number(receipt.transaction_type) === TX_TYPE_EXECUTION) {
      const result = getJSONForExecutionTx(receipt.account, transactionReceipt);
      if (result.logsFound) {
        updateReceipt(
          receipt.tx_hash,
          receipt.account,
          receipt.transaction_type,
          STATUS_READY,
          result.data,
          shouldBeFilteredOut
        );
      }
    } else {
      console.error("unexpected transaction type");
    }
  }, null);
}
function getJSONForOrderFeeFlowTx(account, transactionReceipt) {
  let original = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.transactionHash,
    fields: []
  };
  transactionReceipt.logs.forEach((log, i) => {
    if (log.topics.length < 2) {
      return;
    }
    let logAddress = log.address.toLowerCase();
    let topic0 = log.topics[0].toLowerCase();
    if (topic0.toLowerCase() === DelayedOrderSubmittedEvent && !isValidPositionModifiedContract(logAddress)) {
      console.log(`${logAddress}`);
    }
    if (logAddress === OrderFlowFeeImposedEventContractAddress && topic0.toLowerCase() === OrderFlowFeeImposedEvent && BigNumber4.from(log.topics[1]).eq(BigNumber4.from(account))) {
      original.fields.push({
        contract: OrderFlowFeeImposedEventContractAddress,
        log_index: i,
        event_id: OrderFlowFeeImposedEvent,
        is_topic: true,
        field_index: 1,
        value: account
      });
      original.fields.push({
        contract: OrderFlowFeeImposedEventContractAddress,
        log_index: i,
        event_id: OrderFlowFeeImposedEvent,
        is_topic: false,
        field_index: 0,
        value: "0x" + log.data.replace("0x", "").slice(0, 64)
      });
    } else if (isValidPositionModifiedContract(logAddress) && topic0.toLowerCase() === DelayedOrderSubmittedEvent && BigNumber4.from(log.topics[1]).eq(BigNumber4.from(account))) {
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: DelayedOrderSubmittedEvent,
        is_topic: true,
        field_index: 1,
        value: account
      });
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: DelayedOrderSubmittedEvent,
        is_topic: false,
        field_index: 6,
        value: "0x" + log.data.replace("0x", "").slice(6 * 64, 7 * 64)
      });
    }
  });
  const data = JSON.stringify(original);
  return { data, logsFound: original.fields.length >= 4 && original.fields.length % 4 == 0 };
}
function getJSONForExecutionTx(account, transactionReceipt) {
  let original = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.transactionHash,
    fields: []
  };
  transactionReceipt.logs.forEach((log, i) => {
    if (log.topics.length < 3) {
      return;
    }
    let logAddress = log.address.toLowerCase();
    let topic0 = log.topics[0].toLowerCase();
    if (topic0.toLowerCase() === PositionModifiedEvent && !isValidPositionModifiedContract(logAddress)) {
      console.log(`${logAddress}`);
    }
    if (isValidPositionModifiedContract(logAddress) && topic0.toLowerCase() === PositionModifiedEvent && BigNumber4.from(log.topics[2]).eq(BigNumber4.from(account))) {
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: true,
        field_index: 2,
        value: log.topics[2].toLowerCase()
      });
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: false,
        field_index: 2,
        value: "0x" + log.data.replace("0x", "").slice(2 * 64, 3 * 64)
      });
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: false,
        field_index: 3,
        value: "0x" + log.data.replace("0x", "").slice(3 * 64, 4 * 64)
      });
      original.fields.push({
        contract: logAddress,
        log_index: i,
        event_id: topic0,
        is_topic: false,
        field_index: 5,
        value: "0x" + log.data.replace("0x", "").slice(5 * 64, 6 * 64)
      });
    }
  });
  const data = JSON.stringify(original);
  return { data, logsFound: original.fields.length >= 4 && original.fields.length % 4 == 0 };
}
async function queryTrade(trade) {
  const order_fee_flow_tx_receipt_id = trade.order_fee_flow_tx_receipt_id;
  const receiptPromises = Array();
  if (order_fee_flow_tx_receipt_id.length > 0) {
    receiptPromises.push(getReceipt(order_fee_flow_tx_receipt_id));
  }
  const execution_tx_receipt_id = trade.execution_tx_receipt_id;
  if (execution_tx_receipt_id.length === 0) {
    console.error(`empty execution_tx_receipt_id for trade ${trade.account}-${trade.execution_tx_receipt_id}`);
    return;
  }
  receiptPromises.push(getReceipt(execution_tx_receipt_id));
  const receipts = await Promise.all(receiptPromises);
  var volume = BigNumber4.from(0);
  var fee = BigNumber4.from(0);
  var debugFee = "";
  for (var receiptIndex = 0; receiptIndex < receipts.length; receiptIndex++) {
    const receipt = receipts[receiptIndex];
    if (receipt === void 0 || receipt === null) {
      return;
    }
    if (Number(receipt.status) !== Number(STATUS_READY)) {
      return;
    }
    const data = JSON.parse(receipt.data);
    if (Number(receipt.transaction_type) === TX_TYPE_ORDER_FEE_FLOW) {
      debugFee += `tx ${receipt.tx_hash} add order flow fee `;
      for (var i = 1; i < data.fields.length; i += 2) {
        fee = fee.add(BigNumber4.from(data.fields[i].value));
        debugFee += ` fee: ${data.fields[i].value} `;
      }
    } else {
      debugFee += `tx ${receipt.tx_hash} add execution fee `;
      for (let i2 = 0; i2 < data.fields.length / 4; i2++) {
        volume = volume.add(BigNumber4.from(data.fields[i2 * 4 + 1].value).fromTwos(256).abs().mul(BigNumber4.from(data.fields[i2 * 4 + 2].value)).div(BigNumber4.from("1000000000000000000")));
        fee = fee.add(BigNumber4.from(data.fields[i2 * 4 + 3].value));
        debugFee += ` fee: ${data.fields[i2 * 4 + 3].value} `;
      }
    }
  }
  if (!volume.eq(BigNumber4.from(trade.volume))) {
    console.error(`trade: ${trade.account}-${trade.execution_tx_receipt_id} volume not match: ${trade.volume}, ${volume.toString()}`);
  } else if (!fee.eq(BigNumber4.from(trade.fee))) {
    console.error(`trade: ${trade.account}-${trade.execution_tx_receipt_id} fee not match: ${trade.fee}, ${fee.toString()}, ${receipts[0].tx_hash} . Debug info: ${debugFee}`);
  }
  await updateTrade(trade.execution_tx_receipt_id, trade.account, STATUS_READY);
}

// src/interval_jobs/index.ts
import moment2 from "moment";
async function prepareNewDayTradeClaims() {
  try {
    const yesterday = Number(moment2.utc(/* @__PURE__ */ new Date()).subtract(1, "d").format("YYYYMMDD"));
    var track = await getDailyTrack(BigInt(yesterday));
    if (track != void 0 && track != null && track) {
      return;
    }
    const yesterdayStart = moment2.utc(yesterday.toString(), "YYYYMMDD", true);
    var tsStart = yesterdayStart.utc().unix();
    var tsEnd = yesterdayStart.utc().add(1, "d").unix() - 1;
    var ts30DAgo = yesterdayStart.utc().subtract(29, "d").unix();
    const result = await getAllTradesWithin30Day(ts30DAgo, tsEnd);
    if (result.error !== null) {
      throw result.error;
    }
    const accountTradesList = getAccountTradesList(result.trades);
    for (var i = 0; i < accountTradesList.length; i++) {
      const trades = accountTradesList[i].trades;
      const account = accountTradesList[i].account;
      if (trades.length === 0) {
        continue;
      }
      const claimableTrades = trades.filter((trade) => {
        return trade.timestamp >= tsStart && trade.timestamp <= tsEnd;
      });
      if (claimableTrades.length === 0) {
        continue;
      }
      var utvf = await findUserExistingUTVFByDate(account, BigInt(yesterday));
      if (utvf != void 0 && utvf != null && utvf && Number(utvf.status) > 1) {
        continue;
      } else if (utvf != void 0 && utvf != null && utvf && Number(utvf.status) == 1) {
      } else {
        const src_chain_id = BigInt(process.env.SRC_CHAIN_ID ?? 10);
        const dst_chain_id = BigInt(process.env.DST_CHAIN_ID ?? 10);
        utvf = await insertUserTradeVolumeFee(
          src_chain_id,
          dst_chain_id,
          account,
          trades[0].account,
          BigInt(yesterday)
        );
      }
      const trade_ids = await saveTrades(trades, account);
      const claimPeriod = await userSwapAmountApp.accountClaimPeriod(account);
      var startBlockNumber = claimableTrades[0].blockNumber;
      if (claimPeriod[1].gt(BigNumber5.from(startBlockNumber))) {
        startBlockNumber = claimPeriod[1].toNumber() + 1;
      }
      utvf.start_blk_num = BigInt(startBlockNumber);
      utvf.end_blk_num = BigInt(claimableTrades[claimableTrades.length - 1].blockNumber);
      utvf.status = PROOF_STATUS_INPUT_READY;
      utvf.trade_ids = trade_ids;
      await updateUserTradeVolumeFee(utvf);
    }
    await insertDailyTrack(BigInt(yesterday));
  } catch (error) {
    console.error("failed to prepare new day trade claims", error);
  }
}
async function getReceiptInfos() {
  try {
    const receipts = await findNotReadyReceipts();
    let promises = Array();
    for (let i = 0; i < receipts.length; i++) {
      promises.push(querySingleReceipt(receipts[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to get receipt infos");
  }
}
async function prepareTrades() {
  try {
    const trades = await findNotReadyTrades();
    let promises = Array();
    for (let i = 0; i < trades.length; i++) {
      promises.push(queryTrade(trades[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to get receipt infos");
  }
}
async function prepareUserSwapAmountProof() {
  try {
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_INPUT_READY);
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(sendUserTradeVolumeFeeProvingRequest(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to send user swap amount prove", error);
  }
}
async function uploadUserSwapAmountProof() {
  try {
    const utvfs = await findBrevisRequestSentUTVFS();
    const pendingProofUploads = await findProofToUpload();
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(utvfs[i]));
    }
    for (let i = 0; i < pendingProofUploads.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(pendingProofUploads[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to upload user swap amount proof");
  }
}
async function submitUserSwapAmountTx() {
  try {
    const utvfs = await findTxToBeSent();
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(submitBrevisRequestTx(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
  }
}

// src/server/index.ts
import moment3 from "moment";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
getReceiptInfos().then();
setInterval(getReceiptInfos, 1e3);
prepareUserSwapAmountProof().then();
setInterval(prepareUserSwapAmountProof, 3e4);
uploadUserSwapAmountProof().then();
setInterval(uploadUserSwapAmountProof, 15e3);
prepareTrades().then();
setInterval(prepareTrades, 1e3);
monitorFeeAccumulated();
monitorBrevisRequest();
prepareNewDayTradeClaims();
setInterval(prepareNewDayTradeClaims, 6e4);
submitUserSwapAmountTx();
setInterval(submitUserSwapAmountTx, 2e3);

// src/index.ts
import * as dotenv2 from "dotenv";
dotenv2.config();
BigInt.prototype.toJSON = function() {
  return this.toString();
};
//# sourceMappingURL=index.mjs.map