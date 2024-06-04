var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/index.ts
import express from "express";

// src/db/index.ts
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// src/constants/index.ts
var STATUS_UNKNOWN = BigInt(0);
var STATUS_INIT = BigInt(1);
var STATUS_READY = BigInt(2);
var PROOF_STATUS_UNKNOWN = BigInt(0);
var PROOF_STATUS_INIT = BigInt(1);
var PROOF_STATUS_INPUT_REQUEST_SENT = BigInt(2);
var PROOF_STATUS_INPUT_READY = BigInt(3);
var PROOF_STATUS_PROVING_SENT = BigInt(4);
var PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED = BigInt(5);
var PROOF_STATUS_PROOF_UPLOAD_SENT = BigInt(7);
var PROOF_STATUS_PROOF_UPLOADED = BigInt(8);
var PROOF_STATUS_BREVIS_QUERY_ERROR = BigInt(9);
var PROOF_STATUS_ONCHAIN_VERIFIED = BigInt(11);
var PROOF_STATUS_INELIGIBLE_ACCOUNT_ID = BigInt(99);
var FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED = 0;
var FEE_REIMBURSEMENT_INFO_STATUS_INIT = 1;
var FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID = 2;
var FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST = 3;
var FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT = 4;
var FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED = 5;
var OrderFlowFeeImposedEvent = "0x213209073252965f156ceca72c65727bfcf77e3f25ca2a1f23a1b9db58295d48".toLowerCase();
var OrderFlowFeeImposedEventContractAddress = "0x6B32d15a6Cb77ea227A6Fb19532b2de542c45AC6".toLowerCase();
var DelayedOrderSubmittedEvent = "0x9deb3648ccf8efc44205985ac6ead4ffb30791fea9ce7f9437ae398b31cf9d5a".toLowerCase();
var SynthetixPerpsV2ProxyContractAddress = "0x2B3bb4c683BFc5239B029131EEf3B1d214478d93".toLowerCase();
var PositionModifiedEvent = "0xc0d933baa356386a245ade48f9a9c59db4612af2b5b9c17de5b451c628760f43".toLowerCase();

// src/db/index.ts
var prisma = new PrismaClient();
async function updateReceipt(id, status, data) {
  return prisma.receipt.update({
    where: {
      id
    },
    data: {
      status,
      update_time: /* @__PURE__ */ new Date(),
      data
    }
  });
}
async function getReceipt(id) {
  return prisma.receipt.findUnique({
    where: {
      id
    }
  });
}
async function findNotReadyReceipts() {
  var now = /* @__PURE__ */ new Date();
  return prisma.receipt.findMany({
    take: 10,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now
      }
    }
  });
}
async function updateStorage(id, status, value, data) {
  return prisma.storage.update({
    where: {
      id
    },
    data: {
      status,
      value,
      update_time: /* @__PURE__ */ new Date(),
      data
    }
  });
}
async function findNotReadyStorages() {
  var now = /* @__PURE__ */ new Date();
  now.setSeconds(now.getSeconds() - 10);
  return prisma.receipt.findMany({
    take: 10,
    where: {
      status: STATUS_INIT,
      update_time: {
        lte: now
      }
    }
  });
}
async function insertUserTradeVolumeFee(src_chain_id, dst_chain_id, account, start_ymd, end_ymd) {
  return prisma.user_trade_volume_fee.create({
    data: {
      id: uuidv4(),
      src_chain_id,
      dst_chain_id,
      account: account?.toLocaleLowerCase(),
      start_ymd,
      end_ymd,
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
      id: utvf.id
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
      update_time: /* @__PURE__ */ new Date(),
      prover_id: utvf.prover_id,
      request_sent: utvf.request_sent
    }
  });
}
async function getUserTradeVolumeFee(id) {
  return prisma.user_trade_volume_fee.findUnique({
    where: {
      id
    }
  });
}
async function findUserExistingUTVF(account, start_blk_num, end_blk_num) {
  return prisma.user_trade_volume_fee.findFirst({
    where: {
      account: account?.toLocaleLowerCase(),
      start_blk_num: {
        equals: start_blk_num
      },
      end_blk_num: {
        equals: end_blk_num
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
      brevis_query_hash: brevis_query_hash?.toLocaleLowerCase()
    },
    data: {
      request_sent: true
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

// src/interval_jobs/index.ts
import { BigNumber as BigNumber5 } from "ethers";

// src/graphql/index.ts
var getAvailableAccountIds = async () => {
};

// src/prover/index.ts
import * as sdk from "brevis-sdk-typescript";
import { BigNumber } from "ethers";
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
  new Prover("222.74.153.228:53250")
];
var brevis = new Brevis("appsdk.brevis.network:11080");
var buildUserTradeVolumeFeeProofReq = async (utvf) => {
  const proofReq = new ProofRequest();
  const ids = utvf.receipt_ids.split(",");
  let promises = Array();
  const startBlkNum = Number(utvf.start_blk_num);
  const endBlkNum = Number(utvf.end_blk_num);
  for (let i = 0; i < ids.length; i++) {
    promises.push(
      getReceipt(ids[i]).then((value) => {
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
  const results = await Promise.all(promises);
  var unclaimableReceiptIndexes = Array();
  var claimableReceiptIndexes = Array();
  const sortedReceipts = new Array();
  for (let i = 0; i < results.length; i++) {
    const receipt = results[i];
    if (receipt === void 0) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready");
    }
    sortedReceipts.push(receipt);
  }
  sortedReceipts.sort((a, b) => {
    const dataA = JSON.parse(a.data);
    const blkNumberA = Number(dataA.block_num);
    const dataB = JSON.parse(b.data);
    const blkNumberB = Number(dataB.block_num);
    if (blkNumberA < blkNumberB) {
      return -1;
    } else {
      return 1;
    }
  });
  for (let i = 0; i < sortedReceipts.length; i++) {
    const receipt = sortedReceipts[i];
    const data = JSON.parse(receipt.data);
    const blkNumber = Number(data.block_num);
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data);
    }
    if (blkNumber >= startBlkNum && blkNumber <= endBlkNum) {
      claimableReceiptIndexes.push(i);
    } else if (blkNumber < startBlkNum && blkNumber >= startBlkNum - 43200 * 30) {
      unclaimableReceiptIndexes.push(i);
    } else {
      console.error("out of range  receipt block number", data);
    }
  }
  var proverIndex = -1;
  var initialClaimableReceiptIndex = 0;
  if (unclaimableReceiptIndexes.length <= 236 && claimableReceiptIndexes.length <= 20) {
    proverIndex = 0;
    initialClaimableReceiptIndex = 236;
  } else if (unclaimableReceiptIndexes.length <= 462 && claimableReceiptIndexes.length <= 50) {
    proverIndex = 1;
    initialClaimableReceiptIndex = 462;
  } else if (unclaimableReceiptIndexes.length <= 4700 && claimableReceiptIndexes.length <= 300) {
    proverIndex = 2;
    initialClaimableReceiptIndex = 4700;
  } else if (claimableReceiptIndexes.length == 0) {
    console.error("no claimable receipts");
  } else {
    console.error("receipts out of range", sortedReceipts.length);
  }
  var receiptIndex = 0;
  unclaimableReceiptIndexes.forEach((index) => {
    const receipt = sortedReceipts[index];
    if (receipt === void 0) {
      return;
    }
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
      receiptIndex++
    );
  });
  claimableReceiptIndexes.forEach((index) => {
    const receipt = sortedReceipts[index];
    if (receipt === void 0) {
      return;
    }
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
      initialClaimableReceiptIndex++
    );
  });
  const accountIdHex = BigNumber.from(utvf.account).toHexString();
  proofReq.setCustomInput({
    AccountId: asUint248(accountIdHex),
    StartBlkNum: asUint248(utvf.start_blk_num.toString()),
    EndBlkNum: asUint248(utvf.end_blk_num.toString())
  });
  return { proofReq, proverIndex };
};
async function sendUserTradeVolumeFeeProvingRequest(utvfOld) {
  const utvf = await getUserTradeVolumeFee(utvfOld.id);
  if (utvf.status != PROOF_STATUS_INPUT_READY) {
    return;
  }
  utvf.status = PROOF_STATUS_PROVING_SENT;
  await updateUserTradeVolumeFee(utvf);
  try {
    console.log("Start to Build Proof Request: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    const r = await buildUserTradeVolumeFeeProofReq(utvf);
    console.log("User Circuit Proof Request Sent: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
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
    console.log("Prove failed back to PROOF_STATUS_INPUT_READY: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    utvf.status = PROOF_STATUS_INPUT_READY;
    await updateUserTradeVolumeFee(utvf);
  }
}
async function uploadUserTradeVolumeFeeProof(utvfOld) {
  const utvf = await getUserTradeVolumeFee(utvfOld.id);
  if (utvf.status != PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED) {
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
    console.log("Proof uploaded: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    updateUserTradeVolumeFee(utvf);
  } catch (err) {
    utvf.status = PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED;
    updateUserTradeVolumeFee(utvf);
    console.error(err);
  }
}

// src/query/index.ts
import { QueryParameter, DuneClient, ExecutionPerformance } from "@duneanalytics/client-sdk";
import * as dotenv from "dotenv";
import { BigNumber as BigNumber2 } from "ethers";
dotenv.config();
var client = new DuneClient(process.env.DUNE_API_KEY ?? "");
var queryId = 3677895;
async function QueryOrderTxsByAccount(from, end, accountId) {
  try {
    console.log("Client send dune query: ", from, end, accountId, (/* @__PURE__ */ new Date()).toLocaleString());
    const results = await client.runQuery({
      queryId,
      limit: 100,
      performance: ExecutionPerformance.Large,
      query_parameters: [
        QueryParameter.text("from", from),
        QueryParameter.text("to", end),
        QueryParameter.text("account_id", accountId)
      ]
    });
    console.log("result returned: results", from, end, accountId, (/* @__PURE__ */ new Date()).toLocaleString());
    const txs = Array();
    var fee = BigNumber2.from(0);
    var volume = BigNumber2.from(0);
    results.result?.rows.map((record) => {
      const tx_hash = record["evt_tx_hash"];
      const totalFees = record["totalFees"];
      const sizeDelta = record["sizeDelta"];
      const fillPrice = record["fillPrice"];
      fee = fee.add(BigNumber2.from(totalFees));
      volume = volume.add(
        BigNumber2.from(sizeDelta).abs().mul(BigNumber2.from(fillPrice)).div(BigNumber2.from("1000000000000000000"))
      );
      if (typeof tx_hash === "string" || tx_hash instanceof String) {
        txs.push(tx_hash.toString());
      } else {
        console.error("unknown type of dune result: ", tx_hash);
      }
    });
    console.log("dune result ready");
    return { txs, fee: fee.toString(), volume: volume.toString() };
  } catch (error) {
    console.log("dune error", error);
    console.error("dune result ready", error);
    return { txs: [], fee: "0", volume: "0" };
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
import { Contract, utils } from "ethers";
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
    return new Contract(address, _abi, signerOrProvider);
  }
};
Ownable__factory.abi = _abi;

// ../contract/typechain/factories/IERC20__factory.ts
import { Contract as Contract2, utils as utils2 } from "ethers";
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
    return new Contract2(address, _abi2, signerOrProvider);
  }
};
IERC20__factory.abi = _abi2;

// ../contract/typechain/factories/BrevisApp__factory.ts
import { Contract as Contract3, utils as utils3 } from "ethers";
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
    return new Contract3(address, _abi3, signerOrProvider);
  }
};
BrevisApp__factory.abi = _abi3;

// ../contract/typechain/factories/IBrevisProof__factory.ts
import { Contract as Contract4, utils as utils4 } from "ethers";
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
    return new Contract4(address, _abi4, signerOrProvider);
  }
};
IBrevisProof__factory.abi = _abi4;

// ../contract/typechain/factories/Tx__factory.ts
import { utils as utils5, Contract as Contract5, ContractFactory } from "ethers";
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
    return new Contract5(address, _abi5, signerOrProvider);
  }
};
Tx__factory.bytecode = _bytecode;
Tx__factory.abi = _abi5;

// ../contract/typechain/factories/FeeReimbursementApp__factory.ts
import { utils as utils6, Contract as Contract6, ContractFactory as ContractFactory2 } from "ethers";
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
var _bytecode2 = "0x6080346100a957601f611d5438819003918201601f19168301916001600160401b038311848410176100ae578084926020946040528339810103126100a957516001600160a01b0390818116908190036100a95760018060a01b031990816000541617600055600154903390821617600155604051913391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3611c8f90816100c58239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe60c0604052600436101561001257600080fd5b6000803560e01c80631dd3f354146116c25780631e83409a146115fb5780635419f27c146115af5780635d1c29eb146113e9578063715018a61461138957806379d6b6a21461106b5780637c08aa74146109705780637f239c4d146109495780638da5cb5b146109225780639bdcecd1146108fc578063a184a0c7146108ce578063ada323ff14610841578063b18c086814610800578063b90c209a146107b6578063c772c87f14610746578063c7f5aaa014610720578063cdfb5832146106d9578063d379be23146106b2578063ed1fe83b1461020c578063f2fde38b1461012d5763f7c618c11461010457600080fd5b3461012a578060031936011261012a5760206001600160a01b0360025416604051908152f35b80fd5b503461012a57602036600319011261012a5761014761183f565b600154906001600160a01b03808316916101623384146119de565b169182156101a1576001600160a01b03191682176001557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b503461012a57606036600319011261012a57610226611869565b67ffffffffffffffff602435116106ae573660236024350112156106ae5767ffffffffffffffff60243560040135116106ae5736602460a08135600401350281350101116106ae5760443567ffffffffffffffff81116106aa5761028e90369060040161180e565b61029f816024356004013514611a74565b6001600160a01b0384541692833b156106a65784906040519063cf7ac5a960e01b825267ffffffffffffffff604483019116600483015260406024830152602435600401359052606481019460248035019586845b60243560040135811061066557505083918380809303915afa801561065a57610642575b505b60243560040135811061032b578480f35b6103656040610341836024356004013588611ae5565b0135610358610351848688611b0b565b3691611997565b6020815191012014611a29565b610376816024356004013586611ae5565b50606061038a826024356004013587611ae5565b0135610397828486611b0b565b90918752600560205261ffff6040882054161561060a5780601411610606578060331161060657806052116106065780605a116106065760621161060257601481013560081c908180610526575b610402823560601c605a84013560c01c605285013560c01c611b8a565b823560601c89526006602052604089209067ffffffffffffffff8151166fffffffffffffffff00000000000000006020845493015160401b16916fffffffffffffffffffffffffffffffff19161717905560076020526001600160f81b036040892054166001600160f81b038083168201116105125792605a836001600160f81b0360c09461050d98978260408f7f865837efc36f96ff0de4b15e50b0ead4bf18a6928f7045e7e39161eebf7c5dc79a3560601c815260076020522091818416011660ff60f81b82541617905560405194833560601c86526020860152603383013560081c60408601521660608401526052810135841c60808401520135821c60a0820152a1611ac0565b61031a565b634e487b7160e01b89526011600452602489fd5b602460206001600160a01b03600354166040519283809263b72bf50960e01b8252603388013560081c60048301525afa80156105f75789906105a8575b67ffffffffffffffff9150168061057b575b506103e5565b90806001600160f81b03838202160482148115171561051257606491026001600160f81b03160438610575565b506020813d6020116105ef575b816105c26020938361195d565b810103126105eb575167ffffffffffffffff811681036105eb5767ffffffffffffffff90610563565b8880fd5b3d91506105b5565b6040513d8b823e3d90fd5b8580fd5b8680fd5b60405162461bcd60e51b815260206004820152601060248201526f1d9ad2185cda081b9bdd081d985b1a5960821b6044820152606490fd5b61064b906118c3565b610656578338610318565b8380fd5b6040513d84823e3d90fd5b813583526020808301359084015260408083013590840152606080830135908401526080808301359084015289955060a092830192909101906001016102f4565b8480fd5b8280fd5b5080fd5b503461012a578060031936011261012a5760206001600160a01b0360045416604051908152f35b503461012a57602036600319011261012a576106f361183f565b6001600160a01b039061070b826001541633146119de565b166001600160a01b0319600454161760045580f35b503461012a578060031936011261012a576001600160a01b036020915416604051908152f35b503461012a57602036600319011261012a577f1bf3143ab1544528303e489724067fb6c3ff3f7e3b0a6df041cae24242e44773602061078361183f565b6001600160a01b039061079b826001541633146119de565b16806001600160a01b0319855416178455604051908152a180f35b503461012a57602036600319011261012a576004356001600160a01b038082168092036106aa576107ec906001541633146119de565b6001600160a01b0319600354161760035580f35b503461012a57602036600319011261012a576001600160f81b0360406020926001600160a01b0361082f61183f565b16815260078452205416604051908152f35b503461012a57604036600319011261012a5761085b61183f565b60243562ffffff811681036106aa577fffffffffffffffffff00000000000000000000000000000000000000000000006001600160a01b036108a2816001541633146119de565b76ffffff00000000000000000000000000000000000000006002549360a01b1693169116171760025580f35b503461012a57602036600319011261012a5761ffff6040602092600435815260058452205416604051908152f35b503461012a578060031936011261012a57602062ffffff60025460a01c16604051908152f35b503461012a578060031936011261012a5760206001600160a01b0360015416604051908152f35b503461012a578060031936011261012a5760206001600160a01b0360035416604051908152f35b503461012a576003196060368201126106ae576024359067ffffffffffffffff82168203611056576044359067ffffffffffffffff82116106565760809082360301126106aa57604051906109c4826118ed565b80600401358252602481013567ffffffffffffffff81116106a6578101366023820112156106a6576004810135906109fb8261197f565b91610a09604051938461195d565b808352602083019136602483600a1b83010111610eda5760248101925b602483600a1b8301018410610f4257505050506020830152604481013567ffffffffffffffff81116106a6578101366023820112156106a657600481013590610a6e8261197f565b91610a7c604051938461195d565b808352602083019136602460a0840283010111610eda579160248301925b602460a084028201018410610ede5750505050604083015260648101359067ffffffffffffffff82116106a6573660238383010112156106a6576004828201013590610ae58261197f565b92610af3604051948561195d565b82845260208401913660248560051b848401010111610eda57602482820101925b60248560051b84840101018410610e0857505050505060608201526001600160a01b0383541690813b156106565791839167ffffffffffffffff93604051948593631f022a9d60e21b855260043560048601521660248401526060604484015260e48301908051606485015260208101519160806084860152825180915260206101048601930190865b818110610d45575050506040810151916063198582030160a486015260208084519283815201930190865b818110610ce65750505060600151906063198482030160c4850152815180825260208201916020808360051b83010194019287915b838310610c3b57505050505082809103915afa801561065a57610c27575b602060405160018152f35b610c3182916118c3565b61012a5780610c1c565b9295975092955092601f1982820301835260808651805183526020810151602084015267ffffffffffffffff604082015116604084015267ffffffffffffffff606082015116606084015201519060a060808201528151918260a08301528a5b838110610cd05750506020600192819260c0918d838284010152601f8019910116010197019301930187959389979592610bfe565b80602080928401015160c0828601015201610c9b565b929496509281955060a060209167ffffffffffffffff608060019551805184526001600160a01b038682015116868501526040810151604085015260608101516060850152015116608082015201950191019086949288969492610bc9565b92949650929094506040855167ffffffffffffffff815116835267ffffffffffffffff60208201511660208401520151604082019089915b60058310610da257505050602061040060019201950191019086949288969492610b9e565b602060c0600192604085516060815160ff815116855267ffffffffffffffff8782015116878601526001600160a01b038482015116848601520151606084015267ffffffffffffffff85820151166080840152015160a082015201920192019190610d7d565b833567ffffffffffffffff8111610ed65760a0838501820136036023190112610ed65760405191610e3883611925565b83850182016024810135845260448101356020850152610e5a90606401611880565b6040840152610e6f6084838787010101611880565b606084015260a4828686010101359067ffffffffffffffff8211610ed25736604383858989010101011215610ed2576024936020938493610ec09136918a8a01909101018088013590604401611997565b60808201528152019401939050610b14565b8b80fd5b8980fd5b8780fd5b60a0843603126105eb5760a0806020602494604051610efc81611925565b88358152610f0b838a01611855565b838201526040890135604082015260608901356060820152610f2f60808a01611880565b6080820152815201950194925050610a9a565b6104008085360312610ed65760405190610f5b82611909565b610f6486611880565b8252610f7260208701611880565b602083015236605f870112156110675760405190610f8f82611925565b819036818901116110635760408801915b8189018310610fc357505050604082015281526104009390930192602001610a26565b60c08336031261105f57604051610fd981611909565b60808436031261105b5760405191610ff0836118ed565b84359160ff83168303611056578360209360c09552611010848801611880565b8482015261102060408801611855565b604082015260608701356060820152815261103d60808701611880565b8382015260a08601356040820152815201920191610fa0565b600080fd5b8e80fd5b8d80fd5b8c80fd5b8a80fd5b503461012a57604036600319011261012a57602467ffffffffffffffff81358181116106565761109f903690600401611895565b906001600160a01b039084604083885416815197888092632cc27dc960e11b825260043560048301525afa801561137e5787968891611345575b506110f76110e8368786611997565b9788516020809a012014611a29565b87526005865261ffff6040882054161561130f578360141161060657813560601c9584603311610eda57601483013560081c91856052116105eb57603384013560081c9386605a11610ed657605281013560c01c96606211610ed657605a013560c01c96839582848615928315611253575b50505050611178898989611b8a565b898b526006845260408b20918151166fffffffffffffffff000000000000000085845493015160401b16916fffffffffffffffffffffffffffffffff191617179055600782526001600160f81b03808060408c20541696168096019181831161124157509160c097959391899795937f865837efc36f96ff0de4b15e50b0ead4bf18a6928f7045e7e39161eebf7c5dc79a8c526007835260408c20911660ff60f81b82541617905560405196875286015260408501526060840152608083015260a0820152a180f35b634e487b7160e01b8b5260116004528afd5b600354166040519283809263b72bf50960e01b82528b60048301525afa80156113045783918d916112ca575b50169081611290575b848491611169565b909196506001600160f81b0382860216918583041417156112b75760649004943880611288565b50634e487b7160e01b8952601160045288fd5b809250868092503d83116112fd575b6112e3818361195d565b81010312610ed257518281168103610ed25782903861127f565b503d6112d9565b6040513d8e823e3d90fd5b8560106064926040519262461bcd60e51b845260048401528201526f1d9ad2185cda081b9bdd081d985b1a5960821b6044820152fd5b9650506040863d604011611376575b816113616040938361195d565b810103126106065760208651960151386110d9565b3d9150611354565b6040513d89823e3d90fd5b503461012a578060031936011261012a5760006001546001600160a01b03196001600160a01b038216916113be3384146119de565b166001557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b503461012a5761014036600319011261012a57611404611869565b60a03660231901126106ae5767ffffffffffffffff60e4358181116106565761143190369060040161180e565b926101049182359060ff821680920361060657866101249687358781116106aa57611460903690600401611895565b9690946001600160a01b03968785541692833b15610602578a9260405197889687958695632247cd8f60e01b875216600486015260249e8f803590870152604435604487015260643580608052606487015260843560a05260a051608487015260a43560a487015260c43560c487015260e4860161012090528501906114e592611b4d565b9183015203915afa801561137e5761159c575b50611504368483611997565b94611519865160208098012060805114611a29565b60a05187526005865261ffff6040882054161561130f578360141161060657813560601c9584603311610eda57601483013560081c91856052116105eb57603384013560081c9386605a11610ed657605281013560c01c96606211610ed657605a013560c01c968395828486159283156112535750505050611178898989611b8a565b6115a8909691966118c3565b94386114f8565b503461012a57602036600319011261012a57604080916001600160a01b036115d561183f565b1681526006602052205481519067ffffffffffffffff908181168352831c166020820152f35b503461012a57602036600319011261012a5761161561183f565b6001600160a01b03908160045416330361167d577f17525e7c25776b686f3c5fb5714aac26a41bdccd536c711002922e7e5ffb4c2c916040911680845260076020526001600160f81b0382852080549060ff60f81b821690558351928352166020820152a180f35b60405162461bcd60e51b815260206004820152601760248201527f696e76616c696420636c61696d657220616464726573730000000000000000006044820152606490fd5b503461012a57604036600319011261012a5767ffffffffffffffff6004358181116106aa576116f590369060040161180e565b916024359081116106565761170e90369060040161180e565b90916001906117286001600160a01b0383541633146119de565b611733838614611a74565b855b8581106117bf57506117539060405195604087526040870191611b4d565b916020838682950382880152828152019392865b82811061179857877fb3f7d79a2f90dac793ddd7d86f2d7d5d073e107289c685083e9d4329f1640f5c88880389a180f35b909192939485359061ffff82168092036105eb579081528201948201939291908301611767565b6117cd818587969596611c49565b359061ffff8216809203610eda57611806916117ea828986611c49565b3589526005602052604089209061ffff19825416179055611ac0565b929192611735565b9181601f840112156110565782359167ffffffffffffffff8311611056576020808501948460051b01011161105657565b600435906001600160a01b038216820361105657565b35906001600160a01b038216820361105657565b6004359067ffffffffffffffff8216820361105657565b359067ffffffffffffffff8216820361105657565b9181601f840112156110565782359167ffffffffffffffff8311611056576020838186019501011161105657565b67ffffffffffffffff81116118d757604052565b634e487b7160e01b600052604160045260246000fd5b6080810190811067ffffffffffffffff8211176118d757604052565b6060810190811067ffffffffffffffff8211176118d757604052565b60a0810190811067ffffffffffffffff8211176118d757604052565b6040810190811067ffffffffffffffff8211176118d757604052565b90601f8019910116810190811067ffffffffffffffff8211176118d757604052565b67ffffffffffffffff81116118d75760051b60200190565b92919267ffffffffffffffff82116118d757604051916119c1601f8201601f19166020018461195d565b829481845281830111611056578281602093846000960137010152565b156119e557565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b15611a3057565b606460405162461bcd60e51b815260206004820152602060248201527f6661696c656420746f206f70656e206f757470757420636f6d6d69746d656e746044820152fd5b15611a7b57565b60405162461bcd60e51b815260206004820152601060248201527f6c656e677468206e6f74206d61746368000000000000000000000000000000006044820152606490fd5b6000198114611acf5760010190565b634e487b7160e01b600052601160045260246000fd5b9190811015611af55760a0020190565b634e487b7160e01b600052603260045260246000fd5b9190811015611af55760051b81013590601e198136030182121561105657019081359167ffffffffffffffff8311611056576020018236038113611056579190565b90918281527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83116110565760209260051b809284830137010190565b9092916001600160a01b039060006020604051611ba681611941565b8281520152166000526006602052604060002060405190611bc682611941565b549267ffffffffffffffff91828086169586835260401c166020820195818752159081611c40575b50611c335782808251169616958610611c2957505080835116911611611c21575b604051632d75bc4f60e01b8152600490fd5b523880611c0f565b9350935016815290565b9282168352931690915290565b90501538611bee565b9190811015611af55760051b019056fea2646970667358221220ecd301770a11783d54c97caa25577647d0831b1af28a7917ec857c100b9177f364736f6c63430008140033";
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
    return new Contract6(address, _abi6, signerOrProvider);
  }
};
FeeReimbursementApp__factory.bytecode = _bytecode2;
FeeReimbursementApp__factory.abi = _abi6;

// ../contract/typechain/factories/IFeeRebateTierModule__factory.ts
import { Contract as Contract7, utils as utils7 } from "ethers";
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
    return new Contract7(
      address,
      _abi7,
      signerOrProvider
    );
  }
};
IFeeRebateTierModule__factory.abi = _abi7;

// ../contract/typechain/factories/MockFeeModule__factory.ts
import { utils as utils8, Contract as Contract8, ContractFactory as ContractFactory3 } from "ethers";
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
var _bytecode3 = "0x6080806040523461005b5760008054336001600160a01b0319821681178355916001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a361030190816100618239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c8063715018a6146101d55780638da5cb5b146101a2578063b72bf509146101475763f2fde38b1461004957600080fd5b346101445760203660031901126101445760043573ffffffffffffffffffffffffffffffffffffffff8082168092036101405782549081169061008d33831461024c565b82156100d55773ffffffffffffffffffffffffffffffffffffffff1916821783557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b8280fd5b80fd5b503461014457602036600319011261014457600435907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8216820361014457602061019083610297565b67ffffffffffffffff60405191168152f35b503461014457806003193601126101445773ffffffffffffffffffffffffffffffffffffffff6020915416604051908152f35b503461014457806003193601126101445780805473ffffffffffffffffffffffffffffffffffffffff1973ffffffffffffffffffffffffffffffffffffffff82169161022233841461024c565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b1561025357565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6175309116116102c657600190565b60029056fea2646970667358221220826ef8d5ce734a1fe4385fd011e2cab52cceb1205ab9c235fae84880aba4ffd264736f6c63430008140033";
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
    return new Contract8(address, _abi8, signerOrProvider);
  }
};
MockFeeModule__factory.bytecode = _bytecode3;
MockFeeModule__factory.abi = _abi8;

// src/brevis_request/BrevisRequest__factory.ts
import { utils as utils9, Contract as Contract9, ContractFactory as ContractFactory4 } from "ethers";
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
    return new Contract9(address, _abi9, signerOrProvider);
  }
};
BrevisRequest__factory.bytecode = _bytecode4;
BrevisRequest__factory.abi = _abi9;

// src/ether_interactions/index.ts
import * as dotenv2 from "dotenv";
dotenv2.config();
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
  console.log(
    brevisRequest.address,
    utvf.brevis_query_hash,
    utvf.id,
    process.env.FEE_REIMBURSEMENT
  );
  const tx = await brevisRequest.sendRequest(
    utvf.brevis_query_hash,
    wallet.address ?? "",
    process.env.FEE_REIMBURSEMENT ?? "",
    {
      value: 0
    }
  );
  utvf.request_sent = true;
  updateUserTradeVolumeFee(utvf);
  const receipt = await tx.wait();
  if (receipt.status == 1) {
    utvf.request_sent = true;
    updateUserTradeVolumeFee(utvf);
  } else {
    utvf.request_sent = false;
    updateUserTradeVolumeFee(utvf);
  }
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
    if (receipt.transaction_type == 1) {
      const result = getJSONForOrderFeeFlowTx(receipt.account, transactionReceipt);
      if (result.logsFound) {
        updateReceipt(
          receipt.id,
          STATUS_READY,
          result.data
        );
      }
    } else if (receipt.transaction_type == 2) {
      const result = getJSONForExecutionFlowTx(receipt.account, transactionReceipt);
      if (result.logsFound) {
        updateReceipt(
          receipt.id,
          STATUS_READY,
          result.data
        );
      }
    } else {
      console.error("unexpected transaction type");
    }
  }, null);
}
async function querySingleStorage(storage) {
  return sourceChainProvider.getStorageAt(storage.account, storage.key, Number(storage.blk_number)).then((value) => {
    if (value == null || value == void 0) {
      console.debug("storage not found", storage.id, storage.tx_hash);
      return;
    }
    updateStorage(
      storage.id,
      STATUS_READY,
      value,
      JSON.stringify({
        account: storage.account,
        key: storage.key,
        value,
        blk_number: storage.blk_number
      })
    );
  }, null);
}
function getJSONForOrderFeeFlowTx(account, transactionReceipt) {
  let data = "";
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
    } else if (logAddress === SynthetixPerpsV2ProxyContractAddress && topic0.toLowerCase() === DelayedOrderSubmittedEvent && BigNumber4.from(log.topics[1]).eq(BigNumber4.from(account))) {
      original.fields.push({
        contract: SynthetixPerpsV2ProxyContractAddress,
        log_index: i,
        event_id: DelayedOrderSubmittedEvent,
        is_topic: true,
        field_index: 1,
        value: account
      });
      original.fields.push({
        contract: SynthetixPerpsV2ProxyContractAddress,
        log_index: i,
        event_id: DelayedOrderSubmittedEvent,
        is_topic: false,
        field_index: 6,
        value: "0x" + log.data.replace("0x", "").slice(6 * 64, 7 * 64)
      });
    }
  });
  data = JSON.stringify(original);
  return { data, logsFound: original.fields.length == 4 };
}
function getJSONForExecutionFlowTx(account, transactionReceipt) {
  let logsFound = false;
  let data = "";
  transactionReceipt.logs.forEach((log, i) => {
    if (log.topics.length < 3) {
      return;
    }
    let logAddress = log.address.toLowerCase();
    let topic0 = log.topics[0].toLowerCase();
    if (logAddress === SynthetixPerpsV2ProxyContractAddress && topic0.toLowerCase() === PositionModifiedEvent && BigNumber4.from(log.topics[2]).eq(BigNumber4.from(account))) {
      logsFound = true;
      data = JSON.stringify({
        block_num: transactionReceipt.blockNumber,
        tx_hash: transactionReceipt.transactionHash,
        fields: [
          // account
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: true,
            field_index: 2,
            value: log.topics[2].toLowerCase()
          },
          // tradeSize
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: false,
            field_index: 2,
            value: "0x" + log.data.replace("0x", "").slice(2 * 64, 3 * 64)
          },
          // lastPrice
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: false,
            field_index: 3,
            value: "0x" + log.data.replace("0x", "").slice(3 * 64, 4 * 64)
          },
          // fee
          {
            contract: logAddress,
            log_index: i,
            event_id: topic0,
            is_topic: false,
            field_index: 5,
            value: "0x" + log.data.replace("0x", "").slice(5 * 64, 6 * 64)
          }
        ]
      });
    }
  });
  return { data, logsFound };
}

// src/server/type.ts
import moment from "moment";
function validTimeNumber(input) {
  return moment(input.toString(), "YYYYMMDD", true).isValid();
}
function getCurrentDay(input) {
  if (isNaN(input)) {
    return "";
  }
  const date = moment(input.toString(), "YYYYMMDD", true);
  if (!date.isValid()) {
    return "";
  }
  return date.add(1, "d").format("YYYY-MM-DD");
}
function findNextDay(input) {
  if (isNaN(input)) {
    return "";
  }
  const date = moment(input.toString(), "YYYYMMDD", true);
  if (!date.isValid()) {
    return "";
  }
  return date.add(1, "d").format("YYYY-MM-DD");
}
function findDayStartTimestamp(input) {
  if (isNaN(input)) {
    return 0;
  }
  const date = moment(input.toString(), "YYYYMMDD", true);
  if (!date.isValid()) {
    return 0;
  }
  return date.unix();
}
function findDayEndTimestamp(input) {
  if (isNaN(input)) {
    return 0;
  }
  const date = moment(input.toString(), "YYYYMMDD", true);
  if (!date.isValid()) {
    return 0;
  }
  return date.add(1, "d").unix() - 1;
}

// src/interval_jobs/index.ts
import moment2 from "moment";
async function prepareNewDayTradeClaims() {
  try {
    const today = Number(moment2(/* @__PURE__ */ new Date()).format("YYYYMMDD"));
    var todayInTrack = await getDailyTrack(BigInt(today));
    if (todayInTrack != void 0 && todayInTrack != null && todayInTrack) {
      return;
    }
    await getAvailableAccountIds();
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
async function getStorageInfos() {
  try {
    const storages = await findNotReadyStorages();
    let promises = Array();
    for (let i = 0; i < storages.length; i++) {
      promises.push(querySingleStorage(storages[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to get storage infos");
  }
}
async function prepareUserTradeVolumeFees() {
  try {
    let promises = Array();
    promises.push(prepareUserSwapAmountInput());
    promises.push(prepareUserSwapAmountProof());
    promises.push(uploadUserSwapAmountProof());
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare utvfs", error);
  }
}
async function prepareUserSwapAmountInput() {
  try {
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_INIT);
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(queryUserSwapAmountInput(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to prepare utvf input", error);
  }
}
async function queryUserSwapAmountInput(userSwapAmountOld) {
  const userSwapAmount = await getUserTradeVolumeFee(userSwapAmountOld.id);
  if (userSwapAmount.status != PROOF_STATUS_INIT) {
    return;
  }
  userSwapAmount.status = PROOF_STATUS_INPUT_REQUEST_SENT;
  await updateUserTradeVolumeFee(userSwapAmount);
  const start = getCurrentDay(Number(userSwapAmount.start_ymd));
  const end = findNextDay(Number(userSwapAmount.end_ymd));
  if (start.length === 0 || end.length === 0) {
    console.error("invalid start end time format", userSwapAmount.start_ymd, userSwapAmount.end_ymd, userSwapAmount.id);
    userSwapAmount.status = PROOF_STATUS_INIT;
    updateUserTradeVolumeFee(userSwapAmount);
  }
  console.log("Start to send dune query: ", userSwapAmount.id, (/* @__PURE__ */ new Date()).toLocaleString());
  const duneResult = await QueryOrderTxsByAccount(start, end, userSwapAmount.account);
  console.log("Dune resule returned: ", userSwapAmount.id, (/* @__PURE__ */ new Date()).toLocaleString());
  if (duneResult.txs.length === 0) {
    console.error("no order settled found");
    userSwapAmount.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID;
    updateUserTradeVolumeFee(userSwapAmount);
    return;
  } else if (BigNumber5.from(duneResult.volume).lte(BigNumber5.from("100000000000000000000000"))) {
    console.error("invalid volume", duneResult.volume, userSwapAmount.account);
    userSwapAmount.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID;
    updateUserTradeVolumeFee(userSwapAmount);
    return;
  }
  const promises = Array();
  duneResult.txs.forEach((tx) => {
    promises.push(
      // insertReceipt(tx, userSwapAmount.account).then((receipt) => {
      //   return receipt.id;
      // })
    );
  });
  const receiptIds = await Promise.all(promises);
  userSwapAmount.receipt_ids = receiptIds.reduce(
    (accumulator, currentValue) => accumulator + "," + currentValue
  );
  userSwapAmount.status = PROOF_STATUS_INPUT_READY;
  userSwapAmount.volume = duneResult.volume;
  userSwapAmount.fee = duneResult.fee;
  console.log("User Circuit Input Ready: ", userSwapAmount.id, (/* @__PURE__ */ new Date()).toLocaleString());
  updateUserTradeVolumeFee(userSwapAmount).then((value) => {
    sendUserTradeVolumeFeeProvingRequest(value);
  }).then();
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
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED);
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(utvfs[i]));
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
    console.error("failed to submit tx", error);
  }
}

// src/server/index.ts
import { BigNumber as BigNumber6 } from "ethers";
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
getStorageInfos().then();
setInterval(getStorageInfos, 1e4);
prepareUserTradeVolumeFees().then();
setInterval(prepareUserTradeVolumeFees, 2e3);
monitorFeeAccumulated();
monitorBrevisRequest();
prepareNewDayTradeClaims();
setInterval(prepareUserTradeVolumeFees, 3e4);
submitUserSwapAmountTx();
setInterval(submitUserSwapAmountTx, 1e3);
console.log("findDayStartTimestamp(20240401)", findDayStartTimestamp(20240401));
console.log("findDayEndTimestamp(20240401)", findDayEndTimestamp(20240401));
app.post("/kwenta/newTradeFeeReimbursement", async (req, res) => {
  try {
    const { account, start_year_month_day, end_year_month_day } = req.body;
    const start = Number(start_year_month_day);
    const end = Number(end_year_month_day);
    if (isNaN(start) || isNaN(end)) {
      res.status(500);
      res.send({ error: true, message: "invalid claim trade time period" });
      return;
    }
    if (start > end) {
      res.status(500);
      res.send({ error: true, message: "start is bigger than end" });
      return;
    }
    if (end >= Number(moment3(/* @__PURE__ */ new Date()).format("YYYYMMDD"))) {
      res.status(500);
      res.send({ error: true, message: "invalid end trade period" });
      return;
    }
    if (!validTimeNumber(start)) {
      res.status(500);
      res.send({ error: true, message: "invalid start trade period" });
      return;
    }
    if (!validTimeNumber(end)) {
      res.status(500);
      res.send({ error: true, message: "invalid end trade period" });
      return;
    }
    var utvf = await findUserExistingUTVF(account, BigInt(start), BigInt(end));
    if (utvf != void 0 && utvf != null && utvf) {
      res.json({ query_id: utvf.id });
      return;
    }
    const src_chain_id = BigInt(process.env.SRC_CHAIN_ID ?? 8453);
    const dst_chain_id = BigInt(process.env.DST_CHAIN_ID ?? 8453);
    var utvf = await insertUserTradeVolumeFee(
      src_chain_id,
      dst_chain_id,
      account,
      BigInt(start),
      BigInt(end)
    );
    console.log("New User Comes In: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    queryUserSwapAmountInput(utvf).then();
    res.json({ query_id: utvf.id });
  } catch (error) {
    res.status(500);
    res.send({ error: true, message: error });
  }
});
app.get("/kwenta/getTradeFeeReimbursementInfo", async (req, res) => {
  try {
    const { account, start_year_month_day, end_year_month_day } = req.query;
    const start = Number(start_year_month_day);
    const end = Number(end_year_month_day);
    if (account?.toString() == null || account?.toString() == void 0) {
      res.status(500);
      res.send({ error: true, message: "invalid account id" });
      return;
    }
    if (isNaN(start) || isNaN(end)) {
      res.status(500);
      res.send({ error: true, message: "invalid claim trade time period" });
      return;
    }
    if (start > end) {
      res.status(500);
      res.send({ error: true, message: "start is bigger than end" });
      return;
    }
    if (end >= Number(moment3(/* @__PURE__ */ new Date()).format("YYYYMMDD"))) {
      res.status(500);
      res.send({ error: true, message: "invalid end trade period" });
      return;
    }
    if (!validTimeNumber(start)) {
      res.status(500);
      res.send({ error: true, message: "invalid start trade period" });
      return;
    }
    if (!validTimeNumber(end)) {
      res.status(500);
      res.send({ error: true, message: "invalid end trade period" });
      return;
    }
    const utvf = await findUserExistingUTVF(account?.toString(), BigInt(start), BigInt(end));
    if (utvf === void 0 || utvf === null || !utvf) {
      res.status(500);
      res.send({ error: true, message: "info not found" });
      return;
    }
    let message = "";
    let status = FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED;
    let brevisRequest2 = "" + process.env.BREVIS_REQUEST;
    if (Number(utvf.status) == Number(PROOF_STATUS_ONCHAIN_VERIFIED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED;
      message = "Fee reimbursed";
    } else if (Number(utvf.status) == Number(PROOF_STATUS_BREVIS_QUERY_ERROR)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED;
      message = "unsupported user, please contact custom support";
    } else if (Number(utvf.status) >= Number(PROOF_STATUS_PROVING_BREVIS_REQUEST_GENERATED) && Number(utvf.status) < Number(PROOF_STATUS_BREVIS_QUERY_ERROR) && !utvf.request_sent) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST;
      message = "You need to submit SendRequest transaction with query_hash and query_fee on brevis request contract.And use address(" + process.env.FEE_REIMBURSEMENT + ") as _callback";
    } else if (utvf.request_sent) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT;
      message = "Brevis is preparing swap amount proof";
    } else if (Number(utvf.status) == Number(PROOF_STATUS_INELIGIBLE_ACCOUNT_ID)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID;
      message = "Ineligible account id";
      res.json({
        status,
        message,
        tier: -1,
        fee_to_reimbursed: 0
      });
      return;
    } else {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INIT;
      message = "Wait until query_hash and query_fee is ready";
    }
    var feeBN = BigNumber6.from("0");
    var volumeBN = BigNumber6.from("0");
    var totalFeeBN = BigNumber6.from("0");
    var tier = -1;
    try {
      var volume = utvf.volume;
      if (volume === "") {
        volume = "0";
      }
      volumeBN = BigNumber6.from(volume);
      const volumeWithoutDecimalBN = volumeBN.div(BigNumber6.from("1000000000000000000"));
      var fee = utvf.fee;
      if (fee === "") {
        fee = "0";
      }
      feeBN = BigNumber6.from(fee);
      totalFeeBN = BigNumber6.from(fee);
      tier = -1;
      if (volumeWithoutDecimalBN.toNumber() > 1e8) {
        tier = 3;
        feeBN = feeBN.mul(BigNumber6.from(9)).div(BigNumber6.from(10));
      } else if (volumeWithoutDecimalBN.toNumber() > 1e7) {
        tier = 2;
        feeBN = feeBN.mul(BigNumber6.from(75)).div(BigNumber6.from(100));
      } else if (volumeWithoutDecimalBN.toNumber() > 1e6) {
        tier = 1;
        feeBN = feeBN.mul(BigNumber6.from(5)).div(BigNumber6.from(10));
      } else if (volumeWithoutDecimalBN.toNumber() > 1e5) {
        tier = 0;
        feeBN = feeBN.mul(BigNumber6.from(2)).div(BigNumber6.from(10));
      } else {
        feeBN = BigNumber6.from(0);
        message = "Ineligble user";
      }
    } catch {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INIT;
      message = "preparing account info";
      res.json({
        status,
        message
      });
      return;
    }
    res.json({
      status,
      query_hash: utvf.brevis_query_hash,
      query_fee: utvf.brevis_query_fee,
      brevis_request_contract_address: brevisRequest2,
      message,
      tier,
      fee_to_be_reimbursed: feeBN.toString(),
      volume: volumeBN.toString(),
      total_fee: totalFeeBN.toString()
    });
  } catch (error) {
    res.status(500);
    res.send({ error: true, message: error });
  }
});
var port = 11084;
var server = app.listen(
  port,
  () => console.log(`
\u{1F680} Server ready at: http://localhost:${port}!`)
);

// src/index.ts
import * as dotenv3 from "dotenv";
dotenv3.config();
BigInt.prototype.toJSON = function() {
  return this.toString();
};
//# sourceMappingURL=index.mjs.map