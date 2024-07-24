var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/index.ts
import express from "express";

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
var PROOF_STATUS_RETRY = BigInt(9);
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
      account: account?.toLowerCase(),
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
  return prisma.receipt.findMany({
    take: 50,
    where: {
      status: STATUS_INIT
    }
  });
}
async function findNotReadyTrades() {
  return prisma.trade.findMany({
    take: 50,
    where: {
      status: STATUS_INIT
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
async function updateUserTradeVolumeFeeWithCreateTime(utvf) {
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
      create_time: utvf.create_time,
      update_time: /* @__PURE__ */ new Date(),
      prover_id: utvf.prover_id,
      request_sent: utvf.request_sent,
      start_blk_num: utvf.start_blk_num,
      end_blk_num: utvf.end_blk_num,
      fee_rebate: utvf.fee_rebate
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
    take: 3,
    where: {
      status: {
        equals: status
      }
    }
  });
}
async function findBrevisRequestSentUTVFS() {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      status: {
        equals: PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED
      }
    },
    orderBy: [
      {
        update_time: "asc"
      }
    ]
  });
}
async function findProofToUpload() {
  const a = /* @__PURE__ */ new Date();
  a.setMinutes(a.getMinutes() - 3);
  return prisma.user_trade_volume_fee.findMany({
    take: 5,
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
        update_time: "asc"
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
async function findRequestSentsUTVF(ymd) {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      request_sent: {
        equals: true
      },
      ymd: {
        equals: ymd
      }
    },
    orderBy: [
      {
        update_time: "asc"
      }
    ]
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
async function findUTVFToUploadProof() {
  return prisma.user_trade_volume_fee.findMany({
    take: 5,
    where: {
      brevis_query_hash: {
        not: ""
      },
      status: {
        not: PROOF_STATUS_PROOF_UPLOADED
      },
      proof: {
        not: ""
      }
    },
    orderBy: [
      {
        update_time: "asc"
      }
    ]
  });
}
async function insertTrade(trade, order_fee_flow_tx_receipt_id, execution_tx_receipt_id) {
  console.log(`Insert trade: execution_tx_receipt_id: ${execution_tx_receipt_id}, account: ${trade.abstractAccount}`);
  return prisma.trade.create({
    data: {
      order_fee_flow_tx_receipt_id,
      execution_tx_receipt_id,
      execution_tx_block_number: BigInt(trade.blockNumber),
      account: trade.abstractAccount.toLowerCase(),
      volume: trade.volume,
      fee: trade.feesPaid,
      status: STATUS_INIT,
      create_time: /* @__PURE__ */ new Date(),
      update_time: /* @__PURE__ */ new Date()
    }
  }).catch((reason) => {
    console.debug(`Failed to insert trade: execution_tx_receipt_id: ${execution_tx_receipt_id}, account: ${trade.abstractAccount}`);
    return void 0;
  });
}
async function getTrade(execution_tx_receipt_id, account) {
  return prisma.trade.findUnique({
    where: {
      execution_tx_receipt_id_account: {
        execution_tx_receipt_id,
        account
      }
    }
  });
}
async function updateTrade(execution_tx_receipt_id, account, status) {
  return prisma.trade.update({
    where: {
      execution_tx_receipt_id_account: {
        execution_tx_receipt_id,
        account: account.toLowerCase()
      }
    },
    data: {
      status,
      update_time: /* @__PURE__ */ new Date()
    }
  });
}

// src/graphql/common.ts
var GraphRpc = "https://subgraph.satsuma-prod.com/616cc2144c5c/kwenta/optimism-perps/version/0.0.22.1/api";

// src/graphql/index.ts
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
        volume: (BigInt(t0.volume) + BigInt(t1.volume)).toString(),
        feesPaid: (BigInt(t0.feesPaid) + BigInt(t1.feesPaid)).toString()
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
          futuresTrades(orderBy: timestamp, orderDirection: asc, skip: ${skip}, first: ${first}, where: {timestamp_gte:"${tsStart}", timestamp_lte: "${tsEnd}", orderType_not: Liquidation, accountType: smart_margin, trackingCode: "0x4b57454e54410000000000000000000000000000000000000000000000000000"}) 
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
        var size = BigInt(element.size);
        if (size < 0) {
          size = -size;
        }
        const volume = size * BigInt(element.price) / BigInt("1000000000000000000");
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
  new Prover("54.189.38.119:53248"),
  new Prover("54.189.38.119:53249"),
  new Prover("54.189.38.119:53423"),
  new Prover("54.189.38.119:53351")
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
  var tradeVolume = BigInt(0);
  const receiptIds = [];
  validTrades.forEach((trade) => {
    if (trade.order_fee_flow_tx_receipt_id.length > 0) {
      receiptIds.push(trade.order_fee_flow_tx_receipt_id);
    }
    if (trade.execution_tx_receipt_id.length > 0) {
      receiptIds.push(trade.execution_tx_receipt_id);
    }
    if (trade.volume.length > 0) {
      tradeVolume += BigInt(trade.volume);
    }
  });
  if (tradeVolume <= BigInt(1) * BigInt("1000000000000000000")) {
    utvf.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID;
    await updateUserTradeVolumeFee(utvf);
    return { proverIndex: -1, proofReq };
  }
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
  console.debug(`Prover Get receipt promises.length: ${receiptPromises.length}`);
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
      if (BigInt(a.volume) > BigInt(b.volume)) {
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
      if (orderFeeFlowR.length > exR.length) {
        console.debug(`Claimable trade's execution receipts are less than order fee flow receipts: ${trade.account}-${trade.execution_tx_receipt_id}`);
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
  } else if (unclaimableTradeReceipts.length <= 1300 && claimableTradeOrderFeeFlowReceipts.length <= 100 && claimableTradeExecutionReceipts.length <= 100) {
    proverIndex = 2;
    offRIndex = 1300;
    exeRIndex = 1400;
  } else if (unclaimableTradeReceipts.length <= 4400 && claimableTradeOrderFeeFlowReceipts.length <= 300 && claimableTradeExecutionReceipts.length <= 300) {
    proverIndex = 3;
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
  const account = "0x" + BigInt(utvf.account).toString(16);
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
      console.log("proofRes.circuit_info", r.proverIndex, utvf.id, proofRes.circuit_info.output, proofRes.circuit_info.output_commitment);
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
      const utvfObject = utvf;
      if (utvfObject === void 0 || utvfObject === null) {
        utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
        await updateUserTradeVolumeFee(utvf);
        return;
      }
      const now = /* @__PURE__ */ new Date();
      const timeDiff = now.getTime() - utvfObject.create_time.getTime();
      if (timeDiff >= 7200 * 1e3) {
        console.log(`Proof not found for long time from ${utvfObject.create_time} to ${now}: retry proving for  ${utvf.id}`);
        utvf.status = PROOF_STATUS_INPUT_READY;
        utvf.create_time = now;
        await updateUserTradeVolumeFeeWithCreateTime(utvf);
      } else {
        utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
        await updateUserTradeVolumeFee(utvf);
      }
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
async function submitProofForBrevis(utvf) {
  try {
    console.log("Submit ProofForBrevis: ", utvf.id, utvf.prover_id, (/* @__PURE__ */ new Date()).toLocaleString());
    await brevis.submitProof(
      utvf.brevis_query_hash,
      Number(utvf.dst_chain_id),
      utvf.proof
    );
    utvf.status = PROOF_STATUS_PROOF_UPLOADED;
    updateUserTradeVolumeFee(utvf);
  } catch (err) {
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

// src/ether_interactions/index.ts
import { ethers } from "ethers";

// ../contract/typechain/index.ts
var typechain_exports = {};
__export(typechain_exports, {
  BrevisApp__factory: () => BrevisApp__factory,
  FeeReimbursementApp__factory: () => FeeReimbursementApp__factory,
  IBrevisProof__factory: () => IBrevisProof__factory,
  IERC20__factory: () => IERC20__factory,
  IFeeRebateTierModule__factory: () => IFeeRebateTierModule__factory,
  IMigration__factory: () => IMigration__factory,
  MockFeeModule__factory: () => MockFeeModule__factory,
  Ownable__factory: () => Ownable__factory,
  Tx__factory: () => Tx__factory,
  factories: () => factories_exports
});

// ../contract/typechain/factories/index.ts
var factories_exports = {};
__export(factories_exports, {
  brevisContracts: () => brevis_contracts_exports,
  contracts: () => contracts_exports3,
  openzeppelin: () => openzeppelin_exports
});

// ../contract/typechain/factories/@openzeppelin/index.ts
var openzeppelin_exports = {};
__export(openzeppelin_exports, {
  contracts: () => contracts_exports
});

// ../contract/typechain/factories/@openzeppelin/contracts/index.ts
var contracts_exports = {};
__export(contracts_exports, {
  access: () => access_exports,
  token: () => token_exports
});

// ../contract/typechain/factories/@openzeppelin/contracts/access/index.ts
var access_exports = {};
__export(access_exports, {
  Ownable__factory: () => Ownable__factory
});

// ../contract/typechain/factories/@openzeppelin/contracts/access/Ownable__factory.ts
import { Contract, Interface } from "ethers";
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
    return new Interface(_abi);
  }
  static connect(address, runner) {
    return new Contract(address, _abi, runner);
  }
};
Ownable__factory.abi = _abi;

// ../contract/typechain/factories/@openzeppelin/contracts/token/index.ts
var token_exports = {};
__export(token_exports, {
  erc20: () => ERC20_exports
});

// ../contract/typechain/factories/@openzeppelin/contracts/token/ERC20/index.ts
var ERC20_exports = {};
__export(ERC20_exports, {
  IERC20__factory: () => IERC20__factory
});

// ../contract/typechain/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory.ts
import { Contract as Contract2, Interface as Interface2 } from "ethers";
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
    return new Interface2(_abi2);
  }
  static connect(address, runner) {
    return new Contract2(address, _abi2, runner);
  }
};
IERC20__factory.abi = _abi2;

// ../contract/typechain/factories/brevis-contracts/index.ts
var brevis_contracts_exports = {};
__export(brevis_contracts_exports, {
  contracts: () => contracts_exports2
});

// ../contract/typechain/factories/brevis-contracts/contracts/index.ts
var contracts_exports2 = {};
__export(contracts_exports2, {
  sdk: () => sdk_exports
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/index.ts
var sdk_exports = {};
__export(sdk_exports, {
  apps: () => apps_exports,
  interface: () => interface_exports,
  lib: () => lib_exports
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/apps/index.ts
var apps_exports = {};
__export(apps_exports, {
  framework: () => framework_exports
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/apps/framework/index.ts
var framework_exports = {};
__export(framework_exports, {
  BrevisApp__factory: () => BrevisApp__factory
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/apps/framework/BrevisApp__factory.ts
import { Contract as Contract3, Interface as Interface3 } from "ethers";
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
    return new Interface3(_abi3);
  }
  static connect(address, runner) {
    return new Contract3(address, _abi3, runner);
  }
};
BrevisApp__factory.abi = _abi3;

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/interface/index.ts
var interface_exports = {};
__export(interface_exports, {
  IBrevisProof__factory: () => IBrevisProof__factory
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/interface/IBrevisProof__factory.ts
import { Contract as Contract4, Interface as Interface4 } from "ethers";
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
    return new Interface4(_abi4);
  }
  static connect(address, runner) {
    return new Contract4(address, _abi4, runner);
  }
};
IBrevisProof__factory.abi = _abi4;

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  libSol: () => Lib_exports
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/lib/Lib.sol/index.ts
var Lib_exports = {};
__export(Lib_exports, {
  Tx__factory: () => Tx__factory
});

// ../contract/typechain/factories/brevis-contracts/contracts/sdk/lib/Lib.sol/Tx__factory.ts
import {
  Contract as Contract5,
  ContractFactory,
  Interface as Interface5
} from "ethers";
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
  }
  getDeployTransaction(overrides) {
    return super.getDeployTransaction(overrides || {});
  }
  deploy(overrides) {
    return super.deploy(overrides || {});
  }
  connect(runner) {
    return super.connect(runner);
  }
  static createInterface() {
    return new Interface5(_abi5);
  }
  static connect(address, runner) {
    return new Contract5(address, _abi5, runner);
  }
};
Tx__factory.bytecode = _bytecode;
Tx__factory.abi = _abi5;

// ../contract/typechain/factories/contracts/index.ts
var contracts_exports3 = {};
__export(contracts_exports3, {
  MockFeeModule__factory: () => MockFeeModule__factory,
  feeReimbursementAppSol: () => FeeReimbursementApp_exports
});

// ../contract/typechain/factories/contracts/FeeReimbursementApp.sol/index.ts
var FeeReimbursementApp_exports = {};
__export(FeeReimbursementApp_exports, {
  FeeReimbursementApp__factory: () => FeeReimbursementApp__factory,
  IFeeRebateTierModule__factory: () => IFeeRebateTierModule__factory,
  IMigration__factory: () => IMigration__factory
});

// ../contract/typechain/factories/contracts/FeeReimbursementApp.sol/FeeReimbursementApp__factory.ts
import {
  Contract as Contract6,
  ContractFactory as ContractFactory2,
  Interface as Interface6
} from "ethers";
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
    inputs: [],
    name: "ZeroAddress",
    type: "error"
  },
  {
    inputs: [],
    name: "onlyClaimContractCanAccess",
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
    inputs: [],
    name: "MigrationDone",
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
        name: "feeAccumulated",
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
    name: "MigrationFinishedForAccount",
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
    name: "claimContract",
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
        name: "_claimContract",
        type: "address"
      }
    ],
    name: "setClaimContract",
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
var _bytecode2 = "0x6080346100a957601f611f3438819003918201601f19168301916001600160401b038311848410176100ae578084926020946040528339810103126100a957516001600160a01b0390818116908190036100a95760018060a01b031990816000541617600055600154903390821617600155604051913391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3611e6f90816100c58239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe60c0604052600436101561001257600080fd5b6000803560e01c80631dd3f354146118ab5780631e83409a14611817578063360fde49146117bb57806343c927a91461179d5780634a30d3eb1461173e5780635419f27c146116f25780635d1c29eb1461151b57806366345da4146114f4578063715018a61461149457806379d6b6a2146111285780637c08aa7414610a315780637f239c4d14610a0a5780638da5cb5b146109e35780639bdcecd1146109bd578063a184a0c71461098f578063ada323ff14610902578063b18c0868146108c1578063b90c209a1461084b578063c772c87f146107db578063c7f5aaa0146107b5578063cdfb583214610743578063d379be231461071c578063ed1fe83b14610238578063f2fde38b146101595763f7c618c11461013057600080fd5b3461015657806003193601126101565760206001600160a01b0360025416604051908152f35b80fd5b503461015657602036600319011261015657610173611a28565b600154906001600160a01b038083169161018e338414611bc7565b169182156101cd576001600160a01b03191682176001557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b503461015657606036600319011261015657610252611a52565b6024359067ffffffffffffffff821161071857366023830112156107185767ffffffffffffffff8260040135116107185736602460a0846004013502840101116107185760443567ffffffffffffffff8111610714576102b69036906004016119f7565b9290916102c884836004013514611c5d565b6001600160a01b0385541690813b156107105785906040519063cf7ac5a960e01b825267ffffffffffffffff604483019116600483015260406024830152846004013590526064810192602485019384845b876004013581106106cf57505083918380809303915afa80156106c4576106ac575b505b8260040135811061034d578580f35b610385604061036183866004013586611cce565b0135610378610371848989611cf4565b3691611b80565b6020815191012014611c12565b61039481846004013584611cce565b5060606103a682856004013585611cce565b01356103b3828787611cf4565b90918852600660205261ffff60408920541615610674578060141161066c578060331161066c578060521161066c5780605a1161066c576062908082116106705760821161066c578101356005540361062757601481013560081c908180610558575b610433823560601c605a84013560c01c605285013560c01c611d73565b823560601c8a52600760205260408a209067ffffffffffffffff8151166fffffffffffffffff00000000000000006020845493015160401b16916fffffffffffffffffffffffffffffffff19161717905560086020526001600160f81b0360408a2054166001600160f81b038083168201116105445792605a836001600160f81b0360c09461053f9897828f6040907f865837efc36f96ff0de4b15e50b0ead4bf18a6928f7045e7e39161eebf7c5dc79a3560601c815260086020522091818416011660ff60f81b82541617905560405194833560601c86526020860152603383013560081c60408601521660608401526052810135841c60808401520135821c60a0820152a1611ca9565b61033e565b634e487b7160e01b8a52601160045260248afd5b602460206001600160a01b03600354166040519283809263b72bf50960e01b8252603388013560081c60048301525afa801561061c578a906105cd575b67ffffffffffffffff91501690806001600160f81b03838202160482148115171561054457606491026001600160f81b031604610416565b506020813d602011610614575b816105e760209383611b46565b81010312610610575167ffffffffffffffff811681036106105767ffffffffffffffff90610595565b8980fd5b3d91506105da565b6040513d8c823e3d90fd5b60405162461bcd60e51b815260206004820152601660248201527f696e76616c696420636f6e7472616374732068617368000000000000000000006044820152606490fd5b8780fd5b8880fd5b60405162461bcd60e51b815260206004820152601060248201526f1d9ad2185cda081b9bdd081d985b1a5960821b6044820152606490fd5b6106b590611aac565b6106c057843861033c565b8480fd5b6040513d84823e3d90fd5b81358352602080830135908401526040808301359084015260608083013590840152608080830135908401528a955060a0928301929091019060010161031a565b8580fd5b8380fd5b8280fd5b503461015657806003193601126101565760206001600160a01b0360045416604051908152f35b5034610156576020366003190112610156577fad74290dd7363323a597a949fa2f97ae088f486218d8190369bb417a41a075e36020610780611a28565b6001600160a01b039061079882600154163314611bc7565b16806001600160a01b03196004541617600455604051908152a180f35b50346101565780600319360112610156576001600160a01b036020915416604051908152f35b5034610156576020366003190112610156577f1bf3143ab1544528303e489724067fb6c3ff3f7e3b0a6df041cae24242e447736020610818611a28565b6001600160a01b039061083082600154163314611bc7565b16806001600160a01b0319855416178455604051908152a180f35b5034610156576020366003190112610156576004356001600160a01b03808216809203610718577fae4a28486e59e557cbe94f201dc6e5c485bd89a590bc78f414add8c2f6b4bd8d916108a5602092600154163314611bc7565b806001600160a01b03196003541617600355604051908152a180f35b5034610156576020366003190112610156576001600160f81b0360406020926001600160a01b036108f0611a28565b16815260088452205416604051908152f35b50346101565760403660031901126101565761091c611a28565b60243562ffffff81168103610718577fffffffffffffffffff00000000000000000000000000000000000000000000006001600160a01b0361096381600154163314611bc7565b76ffffff00000000000000000000000000000000000000006002549360a01b1693169116171760025580f35b50346101565760203660031901126101565761ffff6040602092600435815260068452205416604051908152f35b5034610156578060031936011261015657602062ffffff60025460a01c16604051908152f35b503461015657806003193601126101565760206001600160a01b0360015416604051908152f35b503461015657806003193601126101565760206001600160a01b0360035416604051908152f35b503461015657600319606036820112611124576024359067ffffffffffffffff8216820361110f576044359067ffffffffffffffff82116107145760809082360301126107185760405190610a8582611ad6565b80600401358252602481013567ffffffffffffffff81116106c0578101366023820112156106c057600481013590610abc82611b68565b91610aca6040519384611b46565b808352602083019136602483600a1b8301011161066c5760248101925b602483600a1b8301018410610ffb57505050506020830152604481013567ffffffffffffffff81116106c0578101366023820112156106c057600481013590610b2f82611b68565b91610b3d6040519384611b46565b808352602083019136602460a084028301011161066c579160248301925b602460a084028201018410610f975750505050604083015260648101359067ffffffffffffffff82116106c0573660238383010112156106c0576004828201013590610ba682611b68565b92610bb46040519485611b46565b82845260208401913660248560051b84840101011161066c57602482820101925b60248560051b84840101018410610ec957505050505060608201526001600160a01b0383541690813b156107145791839167ffffffffffffffff93604051948593631f022a9d60e21b855260043560048601521660248401526060604484015260e48301908051606485015260208101519160806084860152825180915260206101048601930190865b818110610e06575050506040810151916063198582030160a486015260208084519283815201930190865b818110610da75750505060600151906063198482030160c4850152815180825260208201916020808360051b83010194019287915b838310610cfc57505050505082809103915afa80156106c457610ce8575b602060405160018152f35b610cf28291611aac565b6101565780610cdd565b9295975092955092601f1982820301835260808651805183526020810151602084015267ffffffffffffffff604082015116604084015267ffffffffffffffff606082015116606084015201519060a060808201528151918260a08301528a5b838110610d915750506020600192819260c0918d838284010152601f8019910116010197019301930187959389979592610cbf565b80602080928401015160c0828601015201610d5c565b929496509281955060a060209167ffffffffffffffff608060019551805184526001600160a01b038682015116868501526040810151604085015260608101516060850152015116608082015201950191019086949288969492610c8a565b92949650929094506040855167ffffffffffffffff815116835267ffffffffffffffff60208201511660208401520151604082019089915b60058310610e6357505050602061040060019201950191019086949288969492610c5f565b602060c0600192604085516060815160ff815116855267ffffffffffffffff8782015116878601526001600160a01b038482015116848601520151606084015267ffffffffffffffff85820151166080840152015160a082015201920192019190610e3e565b833567ffffffffffffffff81116106105760a08385018201360360231901126106105760405191610ef983611b0e565b83850182016024810135845260448101356020850152610f1b90606401611a69565b6040840152610f306084838787010101611a69565b606084015260a4828686010101359067ffffffffffffffff8211610f935736604383858989010101011215610f93576024936020938493610f819136918a8a01909101018088013590604401611b80565b60808201528152019401939050610bd5565b8b80fd5b60a0843603126106705760a0806020602494604051610fb581611b0e565b88358152610fc4838a01611a3e565b838201526040890135604082015260608901356060820152610fe860808a01611a69565b6080820152815201950194925050610b5b565b6104008085360312610610576040519061101482611af2565b61101d86611a69565b825261102b60208701611a69565b602083015236605f87011215611120576040519061104882611b0e565b8190368189011161111c5760408801915b818901831061107c57505050604082015281526104009390930192602001610ae7565b60c0833603126111185760405161109281611af2565b60808436031261111457604051916110a983611ad6565b84359160ff8316830361110f578360209360c095526110c9848801611a69565b848201526110d960408801611a3e565b60408201526060870135606082015281526110f660808701611a69565b8382015260a08601356040820152815201920191611059565b600080fd5b8e80fd5b8d80fd5b8c80fd5b8a80fd5b5080fd5b503461015657604036600319011261015657602467ffffffffffffffff81358181116107145761115c903690600401611a7e565b916001600160a01b039084604083885416815197888092632cc27dc960e11b825260043560048301525afa80156114895787968891611450575b506111b46111a5368888611b80565b9788516020809a012014611c12565b87526006865261ffff6040882054161561141a578460141161141657833560601c958560331161066c57601485013560081c918660521161067057603386013560081c9387605a1161061057605287013560c01c968860621161112057605a81013560c01c986082116111205760620135600554036113d25783958415908115611321575b5050611246898989611d73565b898b526007845260408b20918151166fffffffffffffffff000000000000000085845493015160401b16916fffffffffffffffffffffffffffffffff191617179055600882526001600160f81b03808060408c20541696168096019181831161130f57509160c097959391899795937f865837efc36f96ff0de4b15e50b0ead4bf18a6928f7045e7e39161eebf7c5dc79a8c526008835260408c20911660ff60f81b82541617905560405196875286015260408501526060840152608083015260a0820152a180f35b634e487b7160e01b8b5260116004528afd5b83919297508490600354166040519283809263b72bf50960e01b82528a60048301525afa80156113c75787918c9161138d575b5016906001600160f81b03828602169185830414171561137a5760649004943880611239565b50634e487b7160e01b8952601160045288fd5b809250858092503d83116113c0575b6113a68183611b46565b810103126111205751868116810361112057869038611354565b503d61139c565b6040513d8d823e3d90fd5b60405162461bcd60e51b8152600481018490526016818401527f696e76616c696420636f6e7472616374732068617368000000000000000000006044820152606490fd5b8680fd5b8560106064926040519262461bcd60e51b845260048401528201526f1d9ad2185cda081b9bdd081d985b1a5960821b6044820152fd5b9650506040863d604011611481575b8161146c60409383611b46565b81010312611416576020865196015138611196565b3d915061145f565b6040513d89823e3d90fd5b503461015657806003193601126101565760006001546001600160a01b03196001600160a01b038216916114c9338414611bc7565b166001557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b503461015657806003193601126101565760206001600160a01b0360095416604051908152f35b50346101565761014036600319011261015657611536611a52565b60a03660231901126111245767ffffffffffffffff60e435818111610714576115639036906004016119f7565b926101049283359260ff8416809403611416578661012496873584811161071857611592903690600401611a7e565b9790966001600160a01b03968785541692833b1561071057879260405197889687958695632247cd8f60e01b875216600486015260249e8f803590870152604435604487015260643580608052606487015260843560a05260a051608487015260a43560a487015260c43560c487015260e48601610120905285019061161792611d36565b9183015203915afa8015611489576116df575b50611636368585611b80565b9461164b865160208098012060805114611c12565b60a05187526006865261ffff6040882054161561141a578460141161141657833560601c958560331161066c57601485013560081c918660521161067057603386013560081c9387605a1161061057605287013560c01c968860621161112057605a81013560c01c986082116111205760620135600554036113d25783958415908115611321575050611246898989611d73565b6116eb90969196611aac565b943861162a565b503461015657602036600319011261015657604080916001600160a01b03611718611a28565b1681526007602052205481519067ffffffffffffffff908181168352831c166020820152f35b503461015657602036600319011261015657611758611a28565b6001600160a01b039061177082600154163314611bc7565b16801561178b576001600160a01b0319600954161760095580f35b60405163d92e233d60e01b8152600490fd5b50346101565780600319360112610156576020600554604051908152f35b5034610156576020366003190112610156577f7bfc81ef745ea2254ff60bbb4fb7e8855f897b7aa3907ea8eebc957c362d8f5e60206004356118096001600160a01b03600154163314611bc7565b80600555604051908152a180f35b503461015657602036600319011261015657611831611a28565b6001600160a01b039081600954163303611899577f17525e7c25776b686f3c5fb5714aac26a41bdccd536c711002922e7e5ffb4c2c916040911680845260086020526001600160f81b0382852080549060ff60f81b821690558351928352166020820152a180f35b6040516332bc53e960e21b8152600490fd5b50346101565760403660031901126101565767ffffffffffffffff600435818111610718576118de9036906004016119f7565b91602435908111610714576118f79036906004016119f7565b90916001906119116001600160a01b038354163314611bc7565b61191c838614611c5d565b855b8581106119a8575061193c9060405195604087526040870191611d36565b916020838682950382880152828152019392865b82811061198157877fb3f7d79a2f90dac793ddd7d86f2d7d5d073e107289c685083e9d4329f1640f5c88880389a180f35b909192939485359061ffff8216809203610670579081528201948201939291908301611950565b6119b6818587969596611e29565b359061ffff821680920361066c576119ef916119d3828986611e29565b3589526006602052604089209061ffff19825416179055611ca9565b92919261191e565b9181601f8401121561110f5782359167ffffffffffffffff831161110f576020808501948460051b01011161110f57565b600435906001600160a01b038216820361110f57565b35906001600160a01b038216820361110f57565b6004359067ffffffffffffffff8216820361110f57565b359067ffffffffffffffff8216820361110f57565b9181601f8401121561110f5782359167ffffffffffffffff831161110f576020838186019501011161110f57565b67ffffffffffffffff8111611ac057604052565b634e487b7160e01b600052604160045260246000fd5b6080810190811067ffffffffffffffff821117611ac057604052565b6060810190811067ffffffffffffffff821117611ac057604052565b60a0810190811067ffffffffffffffff821117611ac057604052565b6040810190811067ffffffffffffffff821117611ac057604052565b90601f8019910116810190811067ffffffffffffffff821117611ac057604052565b67ffffffffffffffff8111611ac05760051b60200190565b92919267ffffffffffffffff8211611ac05760405191611baa601f8201601f191660200184611b46565b82948184528183011161110f578281602093846000960137010152565b15611bce57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b15611c1957565b606460405162461bcd60e51b815260206004820152602060248201527f6661696c656420746f206f70656e206f757470757420636f6d6d69746d656e746044820152fd5b15611c6457565b60405162461bcd60e51b815260206004820152601060248201527f6c656e677468206e6f74206d61746368000000000000000000000000000000006044820152606490fd5b6000198114611cb85760010190565b634e487b7160e01b600052601160045260246000fd5b9190811015611cde5760a0020190565b634e487b7160e01b600052603260045260246000fd5b9190811015611cde5760051b81013590601e198136030182121561110f57019081359167ffffffffffffffff831161110f57602001823603811361110f579190565b90918281527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831161110f5760209260051b809284830137010190565b916001600160a01b039060006020604051611d8d81611b2a565b828152015216600052600760205260406000209160405192611dae84611b2a565b549067ffffffffffffffff808084169384875260401c166020860193818552159081611e20575b50611e135780808651169416938410611e095780835116911611611e0557604051632d75bc4f60e01b8152600490fd5b5290565b9250905016815290565b8092939116845216905290565b90501538611dd5565b9190811015611cde5760051b019056fea264697066735822122076bd0911176946bf7cd2384de518f89aa3ab27930e50b08389c8338398dbb57564736f6c63430008140033";
var isSuperArgs2 = (xs) => xs.length > 1;
var FeeReimbursementApp__factory = class extends ContractFactory2 {
  constructor(...args) {
    if (isSuperArgs2(args)) {
      super(...args);
    } else {
      super(_abi6, _bytecode2, args[0]);
    }
  }
  getDeployTransaction(_brevisProof, overrides) {
    return super.getDeployTransaction(_brevisProof, overrides || {});
  }
  deploy(_brevisProof, overrides) {
    return super.deploy(_brevisProof, overrides || {});
  }
  connect(runner) {
    return super.connect(runner);
  }
  static createInterface() {
    return new Interface6(_abi6);
  }
  static connect(address, runner) {
    return new Contract6(
      address,
      _abi6,
      runner
    );
  }
};
FeeReimbursementApp__factory.bytecode = _bytecode2;
FeeReimbursementApp__factory.abi = _abi6;

// ../contract/typechain/factories/contracts/FeeReimbursementApp.sol/IFeeRebateTierModule__factory.ts
import { Contract as Contract7, Interface as Interface7 } from "ethers";
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
    return new Interface7(_abi7);
  }
  static connect(address, runner) {
    return new Contract7(
      address,
      _abi7,
      runner
    );
  }
};
IFeeRebateTierModule__factory.abi = _abi7;

// ../contract/typechain/factories/contracts/FeeReimbursementApp.sol/IMigration__factory.ts
import { Contract as Contract8, Interface as Interface8 } from "ethers";
var _abi8 = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
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
        name: "_account",
        type: "address"
      }
    ],
    name: "accountClaimPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      },
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
var IMigration__factory = class {
  static createInterface() {
    return new Interface8(_abi8);
  }
  static connect(address, runner) {
    return new Contract8(address, _abi8, runner);
  }
};
IMigration__factory.abi = _abi8;

// ../contract/typechain/factories/contracts/MockFeeModule__factory.ts
import {
  Contract as Contract9,
  ContractFactory as ContractFactory3,
  Interface as Interface9
} from "ethers";
var _abi9 = [
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
      super(_abi9, _bytecode3, args[0]);
    }
  }
  getDeployTransaction(overrides) {
    return super.getDeployTransaction(overrides || {});
  }
  deploy(overrides) {
    return super.deploy(overrides || {});
  }
  connect(runner) {
    return super.connect(runner);
  }
  static createInterface() {
    return new Interface9(_abi9);
  }
  static connect(address, runner) {
    return new Contract9(address, _abi9, runner);
  }
};
MockFeeModule__factory.bytecode = _bytecode3;
MockFeeModule__factory.abi = _abi9;

// src/brevis_request/BrevisRequest__factory.ts
import {
  Contract as Contract10,
  ContractFactory as ContractFactory4,
  Interface as Interface10
} from "ethers";
var _abi10 = [
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
    name: "RequestCallbackFailed",
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
      }
    ],
    name: "RequestRefunded",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "requestIds",
        type: "bytes32[]"
      }
    ],
    name: "RequestsCallbackFailed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "requestId",
        type: "bytes32[]"
      }
    ],
    name: "RequestsFulfilled",
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
        name: "_proof",
        type: "bytes"
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
      },
      {
        internalType: "address",
        name: "_callback",
        type: "address"
      }
    ],
    name: "fulfillAggRequests",
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
        internalType: "enum IBrevisRequest.RequestStatus",
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
        internalType: "enum IBrevisRequest.RequestStatus",
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
var _bytecode4 = "0x6080346100c057601f61127538819003918201601f19168301916001600160401b038311848410176100c55780849260409485528339810103126100c05780516001600160a01b0391828216918290036100c05760200151908282168092036100c0576000549060018060a01b0319913383821617600055604051943391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3816001541617600155600354161760035561119990816100dc8239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe608080604052600436101561001d575b50361561001b57600080fd5b005b600090813560e01c9081633f20b4c914610ec357508063622b6af414610e605780636a96173514610bc9578063715018a614610b6c5780637249fbb6146109e85780637ff7b0d2146109565780638da5cb5b146109305780639d866985146108c6578063a42dce801461084d578063b6979c3e14610813578063c415b95c146107ec578063c7f5aaa0146107c5578063da47dc32146105a6578063ecdafd46146101ae5763f2fde38b0361000f57346101ab5760203660031901126101ab576100e4610f28565b6001600160a01b0380916100fc828554163314610f92565b1690811561014057600054826001600160a01b0319821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b80fd5b50346101ab5760c03660031901126101ab5760043567ffffffffffffffff811681036105965760243567ffffffffffffffff8111610592576101f4903690600401610f61565b9160443567ffffffffffffffff81116105a257610215903690600401610edf565b67ffffffffffffffff6064351161059e5736602360643501121561059e5767ffffffffffffffff606435600401351161059e5736602460a0606435600401350260643501011161059e5760843567ffffffffffffffff811161059a5761027f903690600401610f61565b919092876001600160a01b03928360a4351660a43503610596578360035416803b156105925767ffffffffffffffff83896102f78c978e966102e56040519a8b998a988997633ab58d6f60e21b89521660048801526060602488015260648701916110da565b84810360031901604486015291611079565b03925af1801561058757610557575b5060015b8660ff82161061050557507fc9f9dbb4a40f26672580c28841452a59f824f5c0053e412183cfec77e76570ef604051602081528061034c602082018a8a6110da565b0390a160a4351661035b578580f35b85916040519363ed1fe83b60e01b602086015267ffffffffffffffff60848601911660248601526060604486015260643560040135905260a4840191602460643501845b6064356004013581106104c4575050602319858403016064860152808352602083019060208160051b850101938386915b83831061045757505050505050916103f281839403601f198101835282610fdd565b6020815191018260a4355af161040661109a565b5015610414575b8080808580f35b7fa27ac73d985dc053bec967c59a530feb90be0582343095d7b85ec7e7c3fef2089161044d6040519283926020845260208401916110da565b0390a1388061040d565b9193959092949650601f198282030186528635601e19843603018112156104c0578301906020823592019167ffffffffffffffff81116104bc5780360383136104bc576104aa6020928392600195611079565b98019601930190918a969594926103d0565b8c80fd5b8b80fd5b813585526020808301359086015260408083013590860152606080830135908601526080808301359086015289955060a0948501949091019060010161039f565b611fe08160051b168601358852600460205260036040892001600160a01b60ff60a01b1982541617905560ff8091169081146105435760010161030a565b634e487b7160e01b88526011600452602488fd5b67ffffffffffffffff8198929811610573576040529538610306565b634e487b7160e01b82526041600452602482fd5b6040513d8a823e3d90fd5b8280fd5b5080fd5b8680fd5b8580fd5b8480fd5b5060603660031901126101ab576004356105be610f12565b604435906001600160a01b038083168093036105a25783855260209160048352604086205461078057811690811561073b57600254420190814211610727576040519160a0830183811067ffffffffffffffff82111761071357604052825260038483019234845260408101948552606081019487865260808201948a8652898b526004885260408b209251835551600183015583600283019151166001600160a01b0319825416179055019251168254915160038110156106ff579160809593917fffffffffffffffffffffff00000000000000000000000000000000000000000074ff00000000000000000000000000000000000000007f4eede03ca33645529b4d82428b024149165298c901cf7453f68eb43bd3d3b65899979560a01b1692161717905560405192835233908301523460408301526060820152a180f35b634e487b7160e01b88526021600452602488fd5b634e487b7160e01b89526041600452602489fd5b634e487b7160e01b87526011600452602487fd5b60405162461bcd60e51b815260048101849052601560248201527f726566756e646565206e6f742070726f766964656400000000000000000000006044820152606490fd5b60405162461bcd60e51b815260048101849052601860248201527f7265717565737420616c726561647920696e20717565756500000000000000006044820152606490fd5b50346101ab57806003193601126101ab5760206001600160a01b0360035416604051908152f35b50346101ab57806003193601126101ab5760206001600160a01b0360015416604051908152f35b50346101ab5760203660031901126101ab5760ff6003604060209360043581526004855220015460a01c1661084b6040518092610f3e565bf35b50346101ab5760203660031901126101ab577f5d16ad41baeb009cd23eb8f6c7cde5c2e0cd5acf4a33926ab488875c37c37f38604061088a610f28565b6001600160a01b036108a0818654163314610f92565b80600154921690816001600160a01b03198416176001558351921682526020820152a180f35b50346101ab5760203660031901126101ab57604060a091600435815260046020522061084b8154916001810154906001600160a01b039060038260028301541691015492604051958652602086015260408501528116606084015260ff6080840191851c16610f3e565b50346101ab57806003193601126101ab576001600160a01b036020915416604051908152f35b50346101ab5760403660031901126101ab57610970610f12565b6001600160a01b036001541633036109a357818080806109a0946004359061c350f161099a61109a565b50611117565b80f35b60405162461bcd60e51b815260206004820152601160248201527f6e6f742066656520636f6c6c6563746f720000000000000000000000000000006044820152606490fd5b50346101ab5760208060031936011261059657600435808352600482526040832054421115610592576001600160a01b036024838260035416604051928380926371e8f36b60e11b82528760048301525afa8015610b6157610a52918691610b34575b501561102d565b81845260048352604084205415610aef5790610ab5848080807ffea410cb461deba9fe807dde02d6641d82e1bf09ecc88ecfa0f2ffadf2a1fdfe979686825260048852600160408320918383556002830154169101549061c350f161099a61109a565b80845260048252600360408520017402000000000000000000000000000000000000000060ff60a01b19825416179055604051908152a180f35b60405162461bcd60e51b815260048101849052601460248201527f72657175657374206e6f7420696e2071756575650000000000000000000000006044820152606490fd5b610b549150853d8711610b5a575b610b4c8183610fdd565b810190611015565b38610a4b565b503d610b42565b6040513d87823e3d90fd5b50346101ab57806003193601126101ab578080546001600160a01b03196001600160a01b03821691610b9f338414610f92565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b50346101ab5760a03660031901126101ab5760043560243567ffffffffffffffff808216809203610e5c576044358181116105a257610c0c903690600401610edf565b906064359283151580940361059a5760843590811161059a57610c33903690600401610edf565b9290936001600160a01b03928360035416604051936371e8f36b60e11b85528960048601528a6020998a87602481875afa958615610e5157610c818c97610cab998591610e3a57501561102d565b60405197889687958694630979240d60e21b86526004860152606060248601526064850191611079565b90604483015203925af1908115610e2f578791610e02575b508503610dbd57908592918584526004855260036040852001600160a01b60ff60a01b198254161790557f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e685604051888152a1858452600485526003604085200154169081610d30578380f35b83610d64610d7282956040519283918a830196633ceb5b5160e11b88528c6024850152604060448501526064840191611079565b03601f198101835282610fdd565b51925af1610d7e61109a565b5015610d8d575b828180808380f35b7ff9e9ac125efc63eaa0638c58fd8a1ab11673bae30202f01909611e4ebdbe9b4e91604051908152a13880610d85565b60405162461bcd60e51b815260048101859052601d60248201527f72657175657374496420616e642070726f6f66206e6f74206d617463680000006044820152606490fd5b90508481813d8311610e28575b610e198183610fdd565b8101031261059a575138610cc3565b503d610e0f565b6040513d89823e3d90fd5b610b549150893d8b11610b5a57610b4c8183610fdd565b6040513d84823e3d90fd5b8380fd5b50346101ab5760203660031901126101ab577f87a73c061f18ffd513249d1d727921e40e348948b01e2979efb36ef4f5204a636040600435610ead6001600160a01b038554163314610f92565b600254908060025582519182526020820152a180f35b9050346105965781600319360112610596576020906002548152f35b9181601f84011215610f0d5782359167ffffffffffffffff8311610f0d5760208381860195010111610f0d57565b600080fd5b602435906001600160a01b0382168203610f0d57565b600435906001600160a01b0382168203610f0d57565b906003821015610f4b5752565b634e487b7160e01b600052602160045260246000fd5b9181601f84011215610f0d5782359167ffffffffffffffff8311610f0d576020808501948460051b010111610f0d57565b15610f9957565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90601f8019910116810190811067ffffffffffffffff821117610fff57604052565b634e487b7160e01b600052604160045260246000fd5b90816020910312610f0d57518015158103610f0d5790565b1561103457565b60405162461bcd60e51b815260206004820152601760248201527f70726f6f6620616c72656164792067656e6572617465640000000000000000006044820152606490fd5b908060209392818452848401376000828201840152601f01601f1916010190565b3d156110d5573d9067ffffffffffffffff8211610fff57604051916110c9601f8201601f191660200184610fdd565b82523d6000602084013e565b606090565b90918281527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8311610f0d5760209260051b809284830137010190565b1561111e57565b60405162461bcd60e51b815260206004820152601260248201527f73656e64206e6174697665206661696c656400000000000000000000000000006044820152606490fdfea2646970667358221220c2624f28ab83f528b4b0611ce6018b867ef7227e773a85684493580622d4936464736f6c63430008140033";
var isSuperArgs4 = (xs) => xs.length > 1;
var BrevisRequest__factory = class extends ContractFactory4 {
  constructor(...args) {
    if (isSuperArgs4(args)) {
      super(...args);
    } else {
      super(_abi10, _bytecode4, args[0]);
    }
  }
  getDeployTransaction(_feeCollector, _brevisProof, overrides) {
    return super.getDeployTransaction(
      _feeCollector,
      _brevisProof,
      overrides || {}
    );
  }
  deploy(_feeCollector, _brevisProof, overrides) {
    return super.deploy(
      _feeCollector,
      _brevisProof,
      overrides || {}
    );
  }
  connect(runner) {
    return super.connect(runner);
  }
  static createInterface() {
    return new Interface10(_abi10);
  }
  static connect(address, runner) {
    return new Contract10(address, _abi10, runner);
  }
};
BrevisRequest__factory.bytecode = _bytecode4;
BrevisRequest__factory.abi = _abi10;

// src/ether_interactions/index.ts
import * as dotenv from "dotenv";
dotenv.config();
var { FeeReimbursementApp__factory: FeeReimbursementApp__factory2 } = typechain_exports;
var dstChainProvider = new ethers.JsonRpcProvider(
  process.env.DEST_RPC ?? ""
);
var sourceChainProvider = new ethers.JsonRpcProvider(
  process.env.SOURCE_RPC ?? ""
);
var wallet = new ethers.Wallet(
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
}
async function submitBrevisRequestTx(utvf) {
  console.log(`submit tx for ${utvf.account}-${utvf.ymd}`);
  updateUserTradeVolumeFeeRequestSent(utvf.account, utvf.ymd, true);
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
      } else {
        console.debug(`${receipt.tx_hash} is not a order fee flow tx: ${result.data}`);
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
      } else {
        console.debug(`${receipt.tx_hash} is not a execution tx: ${result.data}`);
      }
    } else {
      console.error("unexpected transaction type");
    }
  }, null);
}
function getJSONForOrderFeeFlowTx(account, transactionReceipt) {
  let original = {
    block_num: transactionReceipt.blockNumber,
    tx_hash: transactionReceipt.hash,
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
    if (logAddress === OrderFlowFeeImposedEventContractAddress && topic0.toLowerCase() === OrderFlowFeeImposedEvent && BigInt(log.topics[1].toLowerCase()) === BigInt(account.toLowerCase())) {
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
    } else if (isValidPositionModifiedContract(logAddress) && topic0.toLowerCase() === DelayedOrderSubmittedEvent && BigInt(log.topics[1].toLowerCase()) === BigInt(account.toLowerCase())) {
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
    tx_hash: transactionReceipt.hash,
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
    if (isValidPositionModifiedContract(logAddress) && topic0.toLowerCase() === PositionModifiedEvent && BigInt(log.topics[2].toLowerCase()) === BigInt(account.toLowerCase())) {
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
  console.debug(`Get receipt promises.length: ${receiptPromises.length}`);
  const receipts = await Promise.all(receiptPromises);
  var volume = BigInt(0);
  var fee = BigInt(0);
  var debugFee = "";
  var debugVolume = "";
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
      debugFee += ` order fee flow tx ${receipt.tx_hash} `;
      for (var i = 1; i < data.fields.length; i += 2) {
        fee = fee + BigInt(data.fields[i].value);
        debugFee += ` fee: ${data.fields[i].value} `;
      }
    } else {
      debugFee += ` execution tx ${receipt.tx_hash} `;
      debugVolume += ` execution tx ${receipt.tx_hash} `;
      for (let i2 = 0; i2 < data.fields.length / 4; i2++) {
        var size = BigInt.asIntN(256, BigInt(data.fields[i2 * 4 + 1].value));
        if (size < 0) {
          size = -size;
        }
        volume = volume + size * BigInt(data.fields[i2 * 4 + 2].value) / BigInt("1000000000000000000");
        fee = fee + BigInt(data.fields[i2 * 4 + 3].value);
        debugFee += ` fee: ${data.fields[i2 * 4 + 3].value} `;
      }
    }
  }
  if (volume !== BigInt(trade.volume)) {
    console.debug(`trade volume-not-match: account ${trade.account}. expected: ${trade.volume}. Debug-info: ${debugVolume}`);
  } else if (fee !== BigInt(trade.fee)) {
    console.debug(`trade fee-not-match: account ${trade.account}. Debug info: ${debugFee}`);
  }
  await updateTrade(trade.execution_tx_receipt_id, trade.account, STATUS_READY);
}

// src/interval_jobs/index.ts
import moment2 from "moment";
async function prepareNewDayTradeClaims() {
  try {
    const yesterday = Number(moment2.utc(/* @__PURE__ */ new Date()).subtract(10, "m").subtract(1, "d").format("YYYYMMDD"));
    var track = await getDailyTrack(BigInt(yesterday));
    if (track != void 0 && track != null && track) {
      return;
    }
    const yesterdayStart = moment2.utc(yesterday.toString(), "YYYYMMDD", true);
    var tsStart = yesterdayStart.utc().unix();
    var tsEnd = yesterdayStart.utc().add(1, "d").unix() - 1;
    var ts30DAgo = yesterdayStart.utc().subtract(29, "d").unix();
    const eventStartDay = moment2.utc("20240724", "YYYYMMDD", true).utc().unix();
    if (ts30DAgo < eventStartDay) {
      ts30DAgo = eventStartDay;
    }
    const result = await getAllTradesWithin30Day(ts30DAgo, tsEnd);
    if (result.error !== null) {
      throw result.error;
    }
    console.log(`${yesterday}, trades count: ${result.trades.length}`);
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
      if (claimPeriod[1] > BigInt(startBlockNumber)) {
        startBlockNumber = Number(claimPeriod[1]) + 1;
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
    console.error("failed to get receipt infos", error);
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
    console.error("failed to prepare trade");
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
async function checkRequestStatusOnchain() {
  try {
    const yesterday = Number(moment2.utc(/* @__PURE__ */ new Date()).subtract(10, "m").subtract(1, "d").format("YYYYMMDD"));
    const utvfs = await findRequestSentsUTVF(BigInt(yesterday));
    if (utvfs.length < 1) {
      return;
    }
    const utvf = utvfs[0];
    const request = await brevisRequest.requests(utvf.brevis_query_hash);
    if (request[0] === BigInt(0)) {
      console.log(`request info not found for ${utvf.account}-${utvf.ymd}`);
      utvf.request_sent = false;
    }
    await updateUserTradeVolumeFee(utvf);
  } catch (error) {
    console.log(`${error}`);
  }
}
async function uploadProofs() {
  try {
    const utvfs = await findUTVFToUploadProof();
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(submitProofForBrevis(utvfs[i]));
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
prepareNewDayTradeClaims();
setInterval(prepareNewDayTradeClaims, 6e4);
submitUserSwapAmountTx();
setInterval(submitUserSwapAmountTx, 2e3);
checkRequestStatusOnchain();
setInterval(checkRequestStatusOnchain, 1e3);
uploadProofs();
setInterval(uploadProofs, 5e3);

// src/index.ts
import * as dotenv2 from "dotenv";
dotenv2.config();
BigInt.prototype.toJSON = function() {
  return this.toString();
};
//# sourceMappingURL=index.mjs.map