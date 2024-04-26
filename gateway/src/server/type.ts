type UserTradeVolumeFee = {
  id: string;
  src_chain_id: bigint;
  dst_chain_id: bigint;
  trade_year_month: bigint;
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
};

export { UserTradeVolumeFee, Receipt };
