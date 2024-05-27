import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {
  PROOF_STATUS_BREVIS_QUERY_ERROR,
  PROOF_STATUS_INIT,
  PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED,
  STATUS_INIT,
} from "../constants/index.ts";

const prisma = new PrismaClient();

async function insertReceipt(tx_hash: string, account: string): Promise<any> {
  return prisma.receipt.create({
    data: {
      id: uuidv4(),
      tx_hash: tx_hash?.toLocaleLowerCase(),
      account: account,
      status: STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(),
    },
  });
}

async function updateReceipt(
  id: string,
  status: bigint,
  data: string,
): Promise<any> {
  return prisma.receipt.update({
    where: {
      id: id,
    },
    data: {
      status: status,
      update_time: new Date(),
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

async function findNotReadyReceipts(): Promise<any> {
  var now = new Date();
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
  start_ymd: bigint,
  end_ymd: bigint,
): Promise<any> {
  return prisma.user_trade_volume_fee.create({
    data: {
      id: uuidv4(),
      src_chain_id: src_chain_id,
      dst_chain_id: dst_chain_id,
      account: account?.toLocaleLowerCase(),
      start_ymd: start_ymd,
      end_ymd: end_ymd,
      status: PROOF_STATUS_INIT,
      create_time: new Date(),
      update_time: new Date(),
    },
  });
}

async function updateUserTradeVolumeFee(utvf: any): Promise<any> {
  return prisma.user_trade_volume_fee.update({
    where: {
      id: utvf.id,
    },
    data: {
      volume: utvf.volume,
      fee: utvf.fee,
      receipt_ids: utvf.receipt_ids,
      storage_ids: utvf.storage_ids,
      brevis_query_hash: utvf.brevis_query_hash?.toLocaleLowerCase(),
      brevis_query_fee: utvf.brevis_query_fee,
      proof: utvf.proof,
      status: utvf.status,
      update_time: new Date(),
      prover_id: utvf.prover_id,
      request_sent: utvf.request_sent,
    },
  });
}

async function getUserTradeVolumeFee(id: string): Promise<any> {
  return prisma.user_trade_volume_fee.findUnique({
    where: {
      id: id,
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
      account: account?.toLocaleLowerCase(),
      start_blk_num: {
        equals: start_blk_num,
      },
      end_blk_num: {
        equals: end_blk_num,
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

async function findTxToBeSent(): Promise<any> {
  return prisma.user_trade_volume_fee.findMany({
    take: 3,
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
      brevis_query_hash: brevis_query_hash?.toLocaleLowerCase(),
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

export {
  insertReceipt,
  updateReceipt,
  getReceipt,
  findNotReadyReceipts,
  insertUserTradeVolumeFee,
  updateUserTradeVolumeFee,
  getUserTradeVolumeFee,
  findUserExistingUTVF,
  findUserTradeVolumeFees,
  updateBrevisRequestStatus,
  insertStorage,
  updateStorage,
  getStorage,
  findNotReadyStorages,
  insertDailyTrack,
  getDailyTrack,
  findTxToBeSent,
};
