const GraphRpc = "https://subgraph.satsuma-prod.com/616cc2144c5c/kwenta/optimism-perps/version/0.0.22/api";

type Trade = {
  blockNumber: number,
  account: string,    // Owner
  abstractAccount: string, // Safe Margin Account: circuit output
  timestamp: number,
  orderFeeFlowTxhash: string,
  executionTxhash: string,
  volume: string,
  feesPaid: string,
}

export {
  GraphRpc,
  Trade
};

