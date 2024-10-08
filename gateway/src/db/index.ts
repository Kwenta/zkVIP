import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_INIT,
  PROOF_STATUS_INPUT_READY,
  PROOF_STATUS_PROOF_UPLOAD_SENT,
  PROOF_STATUS_PROOF_UPLOADED,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
  PROOF_STATUS_PROVING_SENT,
  STATUS_INIT,
} from "../constants/index.ts";
import { Trade } from "../graphql/common.ts";

const prisma = new PrismaClient();

// transaction_type: OrderFeeFlowTx is 1, ExecutionTx is 2
async function insertReceipt(tx_hash: string, account: string, transaction_type: bigint): Promise<any> {
  console.log(`Insert receipt: tx: ${tx_hash}, account: ${account}, transaction_type: ${transaction_type}`)
  return prisma.receipt.create({
    data: {
      id: uuidv4(),
      tx_hash: tx_hash?.toLowerCase(),
      account: account?.toLowerCase(),
      status: STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(),
      transaction_type: transaction_type,
    },
  });
}

async function updateReceipt(
  tx_hash: string,
  account: string,
  transaction_type: bigint,
  status: bigint,
  data: string,
  should_be_filtered_out: boolean,
): Promise<any> {
  return prisma.receipt.update({
    where: {
      tx_hash_account_transaction_type: {
        tx_hash: tx_hash?.toLowerCase(),
        account: account?.toLowerCase(),
        transaction_type: transaction_type,
      }
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
  return prisma.receipt.findFirst({
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
  return prisma.receipt.findUnique({
    where: {
      tx_hash_account_transaction_type: {
        tx_hash: tx_hash?.toLowerCase(),
        account: account?.toLowerCase(),
        transaction_type: transaction_type,
      }
    }
  })
}

async function findNotReadyReceipts(): Promise<any> {
  return prisma.receipt.findMany({
    take: 50,
    where: {
      status: STATUS_INIT,
    },
  });
}

async function findNotReadyTrades(): Promise<any> {
  return prisma.trade.findMany({
    take: 50,
    where: {
      status: STATUS_INIT,
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

async function updateUserTradeVolumeFeeWithCreateTime(utvf: any): Promise<any> {
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
      create_time: utvf.create_time,
      update_time: new Date(),
      prover_id: utvf.prover_id,
      request_sent: utvf.request_sent,
      start_blk_num: utvf.start_blk_num,
      end_blk_num: utvf.end_blk_num,
      fee_rebate: utvf.fee_rebate,
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
    take: 3,
    where: {
      status: {
        equals: status,
      },
    },
  });
}

async function findBrevisRequestSentUTVFS(): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      status: {
        equals: PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
      },
    },
    orderBy: [
      {
        update_time: 'asc',
      }
    ]
  });
}

async function findBrevisErrorUTVFS(): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      status: {
        equals: PROOF_STATUS_BREVIS_QUERY_ERROR,
      },
    },
    orderBy: [
      {
        create_time: 'asc',
      }
    ]
  });
}

async function findProofToUpload(): Promise<any> {
  const a = new Date()
  a.setMinutes(a.getMinutes() - 3)
  return prisma.user_trade_volume_fee.findMany({
    take: 5,
    where: {
      status: {
        equals: PROOF_STATUS_PROOF_UPLOAD_SENT,
      },
      update_time: {
        lte: a
      }
    },
    orderBy: [
      {
        update_time: 'asc',
      }
    ]
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
    orderBy: [
      {
        update_time: 'asc',
      }
    ]
  });
}

async function findRequestSentsUTVF(ymd: bigint): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      request_sent: {
        equals: true,
      },
      ymd: {
        equals: ymd,
      },
    },
    orderBy: [
      {
        update_time: 'asc',
      }
    ]
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

async function findUTVFToDownLoadProof():  Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      prover_id: {
        not: null || '',
      },
      proof: {
        equals: null || '',
      },
    },
    orderBy: [
      {
        update_time: 'asc',
      }
    ]
  });
}

async function findUTVFToUploadProof():  Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 5,
    where: {
      brevis_query_hash: {
        not: null || '',
      },
      status: {
        not: PROOF_STATUS_PROOF_UPLOADED,
      },
      proof: {
        not: null || '',
      },
    },
    orderBy: [
      {
        update_time: 'asc',
      }
    ]
  });
}

async function insertTrade(
  trade: Trade,
  order_fee_flow_tx_receipt_id: string,
  execution_tx_receipt_id: string,
): Promise<any> {
  console.log(`Insert trade: execution_tx_receipt_id: ${execution_tx_receipt_id}, account: ${trade.abstractAccount}`)
  return prisma.trade.create({
    data: {
      order_fee_flow_tx_receipt_id: order_fee_flow_tx_receipt_id,
      execution_tx_receipt_id: execution_tx_receipt_id,
      execution_tx_block_number: BigInt(trade.blockNumber),
      account: trade.abstractAccount.toLowerCase(),
      volume: trade.volume,
      fee: trade.feesPaid,
      status: STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(), 
    }
  }).catch((reason: any) => {
    console.debug(`Failed to insert trade: execution_tx_receipt_id: ${execution_tx_receipt_id}, account: ${trade.abstractAccount}`)
    // console.debug(`cannot insert trade ${reason}`)
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
        execution_tx_receipt_id: execution_tx_receipt_id,
        account: account,
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
        execution_tx_receipt_id: execution_tx_receipt_id,
        account: account.toLowerCase(),
      }
    },
    data: {
      status: status,
      update_time: new Date(),
    },
  })
}

async function findUserExistingLatestEndBlockNumber(
  account: string,
): Promise<any> {
  const utvfs = await prisma.user_trade_volume_fee?.findMany({
    take: 1,
    where: {
      account: account?.toLowerCase(),
      status: {
        gte: PROOF_STATUS_INPUT_READY,
      },
    },
    orderBy: [
      {
        end_blk_num: 'desc',
      }
    ]
  })
  if (utvfs.length > 0) {
    return utvfs[0].end_blk_num
  } else {
    return BigInt(0)
  }
}

async function findPendingBrevisUTVFS(): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 1,
    where: {
      status: {
        equals: PROOF_STATUS_PROVING_SENT,
      },
    },
    orderBy: [
      {
        create_time: 'asc',
      }
    ]
  });
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
  updateUserTradeVolumeFeeRequestSent,
  findBrevisRequestSentUTVFS,
  findUTVFToDownLoadProof,
  findUTVFToUploadProof,
  findRequestSentsUTVF,
  updateUserTradeVolumeFeeWithCreateTime,
  findBrevisErrorUTVFS,
  findUserExistingLatestEndBlockNumber,
  findPendingBrevisUTVFS,
};
