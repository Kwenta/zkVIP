import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_INIT,
  PROOF_STATUS_PROOF_UPLOAD_SENT,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
  STATUS_INIT,
} from "../constants/index.ts";
import { Trade } from "../graphql/common.ts";

const prisma = new PrismaClient();

// transaction_type: OrderFeeFlowTx is 1, ExecutionTx is 2
async function insertReceipt(tx_hash: string, account: string, transaction_type: bigint): Promise<any> {
  return prisma.receipt.create({
    data: {
      id: uuidv4(),
      tx_hash: tx_hash?.toLowerCase(),
      account: account,
      status: STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(),
      transaction_type: transaction_type,
    },
  });
}

async function updateReceipt(
  id: string,
  status: bigint,
  data: string,
  should_be_filtered_out: boolean,
): Promise<any> {
  return prisma.receipt.update({
    where: {
      id: id,
    },
    data: {
      status: status,
      update_time: new Date(),
      should_be_filtered_out: should_be_filtered_out,
      data: data,
    },
  });
}

async function getReceipt(id: string): Promise<any> {
  return prisma.receipt.findUnique({
    where: {
      id: id,
    },
  });
}

async function getReceiptByHash(
  tx_hash: string,
  account: string,
  transaction_type: bigint,
): Promise<any> {
  return prisma.receipt.findFirst({
    where: {
      tx_hash: tx_hash?.toLowerCase(),
      account: account?.toLowerCase(),
      transaction_type: {
        equals: transaction_type,
      }
    }
  })
}

async function findNotReadyReceipts(): Promise<any> {
  var now = new Date();
  return prisma.receipt.findMany({
    take: 50,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now,
      },
    },
  });
}

async function findNotReadyTrades(): Promise<any> {
  var now = new Date();
  return prisma.trade.findMany({
    take: 50,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now,
      },
    },
  });
}


async function insertStorage(account: string, key: string, blkNumber: bigint): Promise<any> {
  return prisma.storage.create({
    data: {
      id: uuidv4(),
      account: account,
      key: key,
      blk_number: BigInt(blkNumber),
      status: STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(),
    },
  });
}

async function updateStorage(
  id: string,
  status: bigint,
  value: string,
  data: string,
): Promise<any> {
  return prisma.storage.update({
    where: {
      id: id,
    },
    data: {
      status: status,
      value: value,
      update_time: new Date(),
      data: data,
    },
  });
}

async function getStorage(id: string): Promise<any> {
  return prisma.storage.findUnique({
    where: {
      id: id,
    },
  });
}

async function findNotReadyStorages(): Promise<any> {
  var now = new Date();
  now.setSeconds(now.getSeconds() - 10);
  return prisma.receipt.findMany({
    take: 10,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now,
      },
    },
  });
}

async function insertUserTradeVolumeFee(
  src_chain_id: bigint,
  dst_chain_id: bigint,
  account: string,
  owner: string,
  ymd: bigint,
): Promise<any> {
  console.log(
    `Insert user trade volume fee: src_chain_id: ${src_chain_id}, dst_chain_id: ${dst_chain_id}, account: ${account}, owner: ${owner}, ymd: ${ymd}`
  )
  return prisma.user_trade_volume_fee.create({
    data: {
      id: uuidv4(),
      src_chain_id: src_chain_id,
      dst_chain_id: dst_chain_id,
      account: account?.toLowerCase(),
      owner_address: owner,
      ymd: ymd,
      status: PROOF_STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(),
      request_sent: false,
    },
  });
}

async function updateUserTradeVolumeFee(utvf: any): Promise<any> {
  return prisma.user_trade_volume_fee.update({
    where: {
      account_ymd: {
        account: utvf.account?.toLowerCase(),
        ymd: utvf.ymd,
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
      update_time: new Date(),
      prover_id: utvf.prover_id,
      request_sent: utvf.request_sent,
      start_blk_num: utvf.start_blk_num,
      end_blk_num: utvf.end_blk_num,
      fee_rebate: utvf.fee_rebate,
    },
  });
}

async function updateUserTradeVolumeFeeRequestSent(account: string, ymd: bigint, request_sent: any): Promise<any> {
  return prisma.user_trade_volume_fee.update({
    where: {
      account_ymd: {
        account: account?.toLowerCase(),
        ymd: ymd,
      },
    },
    data: {
      request_sent: request_sent,
    },
  });
}

async function getUserTradeVolumeFee(  
  account: string,
  ymd: bigint
): Promise<any> {
  return prisma.user_trade_volume_fee.findUnique({
    where: {
      account_ymd: {
        account: account?.toLowerCase(),
        ymd: ymd,
      }
    },
  });
}

async function findUserExistingUTVF(
  account: string,
  start_blk_num: bigint,
  end_blk_num: bigint
): Promise<any> {
  return prisma.user_trade_volume_fee.findFirst({
    where: {
      account: account?.toLowerCase(),
      start_blk_num: {
        equals: start_blk_num,
      },
      end_blk_num: {
        equals: end_blk_num,
      }
    },
  });
}

async function findUserExistingUTVFByDate(
  account: string,
  ymd: bigint,
): Promise<any> {
  return prisma.user_trade_volume_fee.findUnique({
    where: {
      account_ymd: {
        account: account?.toLowerCase(),
        ymd: ymd,
      }
    },
  });
}

async function findUserTradeVolumeFees(status: bigint): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 10,
    where: {
      status: {
        equals: status,
      },
    },
  });
}

async function findProofToUpload(): Promise<any> {
  const a = new Date()
  a.setMinutes(a.getMinutes() - 3)
  return prisma.user_trade_volume_fee.findMany({
    take: 10,
    where: {
      status: {
        equals: PROOF_STATUS_PROOF_UPLOAD_SENT,
      },
      update_time: {
        lte: a
      }
    },
  });
}

async function findTxToBeSent(): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      status: {
        gte: PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
        lt: PROOF_STATUS_BREVIS_QUERY_ERROR,
      },
      request_sent: {
        equals: false,
      }
    },
  });
}

async function updateBrevisRequestStatus(
  brevis_query_hash: string
): Promise<any> {
  return prisma.user_trade_volume_fee.updateMany({
    where: {
      brevis_query_hash: brevis_query_hash?.toLowerCase(),
    },
    data: {
      request_sent: true,
    },
  });
}

async function insertDailyTrack(
  year_month_day: bigint,
): Promise<any> {
  return prisma.daily_track.create({
    data: {
      year_month_day: year_month_day,
    },
  });
}

async function getDailyTrack(year_month_day: bigint): Promise<any> {
  return prisma.daily_track.findUnique({
    where: {
      year_month_day: year_month_day,
    },
  });
}

async function insertTrade(
  trade: Trade,
  order_fee_flow_tx_receipt_id: string,
  execution_tx_receipt_id: string,
): Promise<any> {
  return prisma.trade.create({
    data: {
      order_fee_flow_tx_receipt_id: order_fee_flow_tx_receipt_id,
      execution_tx_receipt_id: execution_tx_receipt_id,
      execution_tx_block_number: BigInt(trade.blockNumber),
      account: trade.abstractAccount,
      volume: trade.volume,
      fee: trade.feesPaid,
      status: STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(), 
    }
  }).catch((reason) => {
    return undefined;
  })
}

async function getTrade(
  execution_tx_receipt_id: string,
  account: string,
): Promise<any> {
  return prisma.trade.findUnique({
    where: {
      execution_tx_receipt_id_account: {
        account: account,
        execution_tx_receipt_id: execution_tx_receipt_id,
      }
    }
  })
}

async function updateTrade(
  execution_tx_receipt_id: string,
  account: string,
  status: bigint
): Promise<any> {
  return prisma.trade.update({
    where: {
      execution_tx_receipt_id_account: {
        account: account,
        execution_tx_receipt_id: execution_tx_receipt_id,
      }
    },
    data: {
      status: status,
      update_time: new Date(),
    },
  })
}

export {
  insertReceipt,
  updateReceipt,
  getReceipt,
  getReceiptByHash,
  findNotReadyReceipts,
  insertUserTradeVolumeFee,
  updateUserTradeVolumeFee,
  getUserTradeVolumeFee,
  findUserExistingUTVF,
  findUserExistingUTVFByDate,
  findUserTradeVolumeFees,
  updateBrevisRequestStatus,
  insertStorage,
  updateStorage,
  getStorage,
  findNotReadyStorages,
  insertDailyTrack,
  getDailyTrack,
  findTxToBeSent,
  insertTrade,
  getTrade,
  updateTrade,
  findNotReadyTrades,
  findProofToUpload,
  updateUserTradeVolumeFeeRequestSent
};
