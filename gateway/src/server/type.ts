import moment from "moment";

type UserTradeVolumeFee = {
  id: string;
  src_chain_id: bigint;
  dst_chain_id: bigint;
  trade_year_month: bigint;
  start_ymd: bigint;
  end_ymd: bigint;
  account: string;
  volume: string;
  fee: string;
  receipt_ids: string;
  storage_ids: string;
  brevis_query_hash: string;
  brevis_query_fee: string;
  proof: string;
  status: bigint;
  create_time: Date;
  update_time: Date;
  prover_id: string;
  request_sent: boolean;
};

type Receipt = {
  id: string;
  tx_hash: string;
  status: bigint;
  data: string;
  create_time: Date;
  update_time: Date;
  should_be_filtered_out: boolean;
  reason: string;
  account: string;
};

type Storage = {
  id: string;
  account: string;
  key: string;
  value: string;
  blk_number: bigint;
  status: bigint;
  data: string;
  create_time: Date;
  update_time: Date;
}; 

function validTimeNumber(input: Number): boolean {
  return moment(input.toString(), "YYYYMMDD", true).isValid()
}

function getCurrentDay(input: number): string {
  if (isNaN(input)) {
    return ""
  }
  const date = moment(input.toString(), "YYYYMMDD", true)
  if (!date.isValid()) {
    return ""
  }

  return date.add(1, "d").format("YYYY-MM-DD")
}
function findNextDay(input: number): string {
  if (isNaN(input)) {
    return ""
  }
  const date = moment(input.toString(), "YYYYMMDD", true)
  if (!date.isValid()) {
    return ""
  }

  return date.add(1, "d").format("YYYY-MM-DD")
}

export { UserTradeVolumeFee, Receipt, Storage, validTimeNumber, getCurrentDay, findNextDay };
