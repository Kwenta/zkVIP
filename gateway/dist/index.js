"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server/index.ts
var import_express = __toESM(require("express"));

// src/db/index.ts
var import_client = require("@prisma/client");
var import_uuid = require("uuid");

// src/constants/index.ts
var STATUS_UNKNOWN = BigInt(0);
var STATUS_INIT = BigInt(1);
var STATUS_READY = BigInt(2);
var PROOF_STATUS_UNKNOWN = BigInt(0);
var PROOF_STATUS_INIT = BigInt(1);
var PROOF_STATUS_INPUT_REQUEST_SENT = BigInt(2);
var PROOF_STATUS_INPUT_READY = BigInt(3);
var PROOF_STATUS_PROVING_SENT = BigInt(4);
var PROOF_STATUS_PROVING_FINISHED = BigInt(5);
var PROOF_STATUS_PROOF_UPLOAD_SENT = BigInt(6);
var PROOF_STATUS_PROOF_UPLOADED = BigInt(7);
var PROOF_STATUS_BREVIS_QUERY_ERROR = BigInt(8);
var PROOF_STATUS_BREVIS_REQUEST_SUBMITTED = BigInt(9);
var PROOF_STATUS_ONCHAIN_VERIFIED = BigInt(10);
var PROOF_STATUS_INELIGIBLE_ACCOUNT_ID = BigInt(99);
var FEE_REIMBURSEMENT_INFO_STATUS_UNDEFINED = 0;
var FEE_REIMBURSEMENT_INFO_STATUS_INIT = 1;
var FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID = 2;
var FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST = 3;
var FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT = 4;
var FEE_REIMBURSEMENT_INFO_STATUS_FEE_REIMBURSED = 5;

// src/db/index.ts
var prisma = new import_client.PrismaClient();
async function insertReceipt(tx_hash) {
  return prisma.receipt.create({
    data: {
      id: (0, import_uuid.v4)(),
      tx_hash: tx_hash?.toLocaleLowerCase(),
      status: STATUS_INIT,
      create_time: /* @__PURE__ */ new Date(),
      update_time: /* @__PURE__ */ new Date()
    }
  });
}
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
    take: 20,
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
async function insertUserTradeVolumeFee(src_chain_id, dst_chain_id, account, trade_year_month) {
  return prisma.user_trade_volume_fee.create({
    data: {
      id: (0, import_uuid.v4)(),
      src_chain_id,
      dst_chain_id,
      account: account?.toLocaleLowerCase(),
      trade_year_month,
      status: PROOF_STATUS_INIT,
      create_time: /* @__PURE__ */ new Date(),
      update_time: /* @__PURE__ */ new Date()
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
      update_time: /* @__PURE__ */ new Date()
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
async function findUserExistingUTVF(account, trade_year_month) {
  return prisma.user_trade_volume_fee.findFirst({
    where: {
      account: account?.toLocaleLowerCase(),
      trade_year_month: {
        equals: trade_year_month
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
async function updateBrevisRequestStatus(brevis_query_hash) {
  return prisma.user_trade_volume_fee.updateMany({
    where: {
      brevis_query_hash: brevis_query_hash?.toLocaleLowerCase(),
      status: {
        lt: PROOF_STATUS_BREVIS_REQUEST_SUBMITTED
      }
    },
    data: {
      status: PROOF_STATUS_BREVIS_REQUEST_SUBMITTED
    }
  });
}

// src/prover/index.ts
var sdk = __toESM(require("brevis-sdk-typescript"));
var import_ethers = require("ethers");
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
var prover = new Prover("localhost:33248");
var brevis = new Brevis("appsdk.brevis.network:11080");
var buildUserTradeVolumeFeeProofReq = async (utvf) => {
  const proofReq = new ProofRequest();
  const ids = utvf.receipt_ids.split(",");
  let promises = Array();
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
  let index = 0;
  var earlistBlk = 0;
  var latestBlk = 1;
  for (let i = 0; i < results.length; i++) {
    const receipt = results[i];
    if (receipt === void 0) {
      continue;
    }
    if (receipt.status !== STATUS_READY) {
      throw new Error("receipts not ready");
    }
    const data = JSON.parse(receipt.data);
    const blkNumber = Number(data.block_num);
    if (isNaN(blkNumber)) {
      console.error("invalid receipt block number", data);
    }
    if (earlistBlk > blkNumber) {
      earlistBlk = blkNumber;
    }
    if (latestBlk < blkNumber) {
      latestBlk = blkNumber;
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
      index++
    );
  }
  const accountIdHex = import_ethers.BigNumber.from(utvf.account).toHexString();
  proofReq.setCustomInput({
    AccountId: asUint248(accountIdHex),
    StartBlkNum: asUint248(earlistBlk.toString()),
    EndBlkNum: asUint248(latestBlk.toString()),
    YearMonth: asUint248(utvf.trade_year_month.toString())
  });
  return proofReq;
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
    const proofReq = await buildUserTradeVolumeFeeProofReq(utvf);
    console.log("User Circuit Proof Request Sent: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    const proofRes = await prover.prove(proofReq);
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
    utvf.proof = import_ethers.ethers.utils.hexlify(proofRes.serializeBinary());
    utvf.status = PROOF_STATUS_PROVING_FINISHED;
    console.log("User Circuit Proved: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    updateUserTradeVolumeFee(utvf).then((value) => {
      uploadUserTradeVolumeFeeProof(value);
    }).then();
  } catch (error) {
    console.log("Prove failed back to PROOF_STATUS_INPUT_READY: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    utvf.status = PROOF_STATUS_INPUT_READY;
    await updateUserTradeVolumeFee(utvf);
  }
}
async function uploadUserTradeVolumeFeeProof(utvfOld) {
  const utvf = await getUserTradeVolumeFee(utvfOld.id);
  if (utvf.status != PROOF_STATUS_PROVING_FINISHED) {
    return;
  }
  utvf.status = PROOF_STATUS_PROOF_UPLOAD_SENT;
  await updateUserTradeVolumeFee(utvf);
  try {
    const proofReq = await buildUserTradeVolumeFeeProofReq(utvf);
    const proof = import_ethers.ethers.utils.arrayify(utvf.proof || "");
    let proofRes = sdk.ProveResponse.deserializeBinary(proof);
    console.log("Request sent: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    const brevisRes = await brevis.submit(
      proofReq,
      proofRes,
      Number(utvf.src_chain_id),
      Number(utvf.dst_chain_id)
    );
    utvf.brevis_query_fee = brevisRes.fee;
    utvf.brevis_query_hash = brevisRes.id;
    utvf.status = PROOF_STATUS_PROOF_UPLOADED;
    console.log("Request submitted: ", utvf.id, (/* @__PURE__ */ new Date()).toLocaleString());
    updateUserTradeVolumeFee(utvf);
  } catch (err) {
    utvf.status = PROOF_STATUS_BREVIS_QUERY_ERROR;
    updateUserTradeVolumeFee(utvf);
    console.error(err);
  }
}

// src/query/index.ts
var import_client_sdk = require("@duneanalytics/client-sdk");
var dotenv = __toESM(require("dotenv"));
var import_ethers2 = require("ethers");
dotenv.config();
var client = new import_client_sdk.DuneClient(process.env.DUNE_API_KEY ?? "");
var queryId = 3677895;
async function QueryOrderTxsByAccount(from, end, accountId) {
  try {
    console.log("Client send dune query: ", (/* @__PURE__ */ new Date()).toLocaleString());
    const results = await client.runQuery({
      queryId,
      query_parameters: [
        import_client_sdk.QueryParameter.text("from", from),
        import_client_sdk.QueryParameter.text("to", end),
        import_client_sdk.QueryParameter.text("account_id", accountId)
      ]
    });
    const txs = Array();
    var fee = import_ethers2.BigNumber.from(0);
    var volume = import_ethers2.BigNumber.from(0);
    results.result?.rows.map((record) => {
      const tx_hash = record["evt_tx_hash"];
      const totalFees = record["totalFees"];
      const sizeDelta = record["sizeDelta"];
      const fillPrice = record["fillPrice"];
      fee = fee.add(import_ethers2.BigNumber.from(totalFees));
      volume = volume.add(
        import_ethers2.BigNumber.from(sizeDelta).abs().mul(import_ethers2.BigNumber.from(fillPrice)).div(import_ethers2.BigNumber.from("1000000000000000000"))
      );
      if (typeof tx_hash === "string" || tx_hash instanceof String) {
        txs.push(tx_hash.toString());
      } else {
        console.error("unknown type of dune result: ", tx_hash);
      }
    });
    return { txs, fee: fee.toString(), volume: volume.toString() };
  } catch (error) {
    console.log("dune error", error);
    return { txs: [], fee: "0", volume: "0" };
  }
}

// src/ether_interactions/index.ts
var import_ethers11 = require("ethers");

// ../contract/typechain/index.ts
var typechain_exports = {};
__export(typechain_exports, {
  BrevisApp__factory: () => BrevisApp__factory,
  FeeReimbursementApp__factory: () => FeeReimbursementApp__factory,
  IAccountModule__factory: () => IAccountModule__factory,
  IBrevisProof__factory: () => IBrevisProof__factory,
  IERC20__factory: () => IERC20__factory,
  Ownable__factory: () => Ownable__factory,
  Tx__factory: () => Tx__factory
});

// ../contract/typechain/factories/Ownable__factory.ts
var import_ethers3 = require("ethers");
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
    return new import_ethers3.utils.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers3.Contract(address, _abi, signerOrProvider);
  }
};
Ownable__factory.abi = _abi;

// ../contract/typechain/factories/IERC20__factory.ts
var import_ethers4 = require("ethers");
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
    return new import_ethers4.utils.Interface(_abi2);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers4.Contract(address, _abi2, signerOrProvider);
  }
};
IERC20__factory.abi = _abi2;

// ../contract/typechain/factories/BrevisApp__factory.ts
var import_ethers5 = require("ethers");
var _abi3 = [
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
    return new import_ethers5.utils.Interface(_abi3);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers5.Contract(address, _abi3, signerOrProvider);
  }
};
BrevisApp__factory.abi = _abi3;

// ../contract/typechain/factories/IBrevisProof__factory.ts
var import_ethers6 = require("ethers");
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
            internalType: "uint256",
            name: "length",
            type: "uint256"
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
    return new import_ethers6.utils.Interface(_abi4);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers6.Contract(address, _abi4, signerOrProvider);
  }
};
IBrevisProof__factory.abi = _abi4;

// ../contract/typechain/factories/Tx__factory.ts
var import_ethers7 = require("ethers");
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
var _bytecode = "0x6080806040523461001a57610e5d9081610020823930815050f35b600080fdfe604060808152600436101561001357600080fd5b600090813560e01c63dae029d31461002a57600080fd5b602090816003193601126103d95767ffffffffffffffff916004358381116103d557366023820112156103d55780600401359384116103d557602481019060248536920101116103d5576102e7946102dd926102cc9261008861052e565b9660ff926100bd6002856100b66100b06100a2878961059c565b356001600160f81b03191690565b60f81c90565b16146105b9565b6100e26100dd6100d86100d1858088610605565b36916106b4565b610a18565b610a80565b926101166101086100fb6100f5876106eb565b51610b98565b67ffffffffffffffff1690565b67ffffffffffffffff168b52565b6101386101286100fb6100f5876106f8565b67ffffffffffffffff168b840152565b6101446100f585610708565b898b01526101546100f585610718565b60608b01526101656100f585610728565b60808b015261018f61017f61017986610738565b51610b7a565b6001600160a01b031660a08c0152565b61019b6100f585610748565b60c08b01526101b26101ac85610758565b51610c06565b60e08b01526101cc6101c66100f586610769565b60ff1690565b956101f06101e56101ac6101ea6101e56101ac8a61077a565b6107b0565b9761078b565b958a61020a6102056100b06100a289886105aa565b6107e9565b9582871660010361039f576102366101c66102316100b061022b858a610644565b90610876565b610801565b965b61ffff8816603781116102eb5750506102c093926102a0876102926102b8958561028c61027d61026b6102a8998e610655565b9d9093610277816108a2565b91610663565b929093519c8d9687019161090a565b9161090a565b03601f1981018852876104fd565b859716610825565b60f81b6001600160f81b03191690565b901a91610986565b535b8151910120610996565b6001600160a01b0316610100840152565b519182918261041d565b0390f35b909697945083959391925011156000146103655761035f93828261032161031b6100a2610333966103519861059c565b98610814565b9261032b826108a2565b931691610680565b8c5195869491929160f81b6001600160f81b03191690888601610954565b03601f1981018352826104fd565b906102c2565b61035f93828261032161031b6100a2610381966103519861059c565b8c5195869491929160f01b6001600160f01b03191690888601610918565b6103cf6103ca6103c46103be6103b76101c68c610814565b858a610627565b90610836565b60f01c90565b610862565b96610238565b8480fd5b8280fd5b919082519283825260005b848110610409575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016103e8565b6104c3906020815261043c60208201845167ffffffffffffffff169052565b602083015167ffffffffffffffff1660408201526040830151606082015260608301516080820152608083015160a082015261048860a084015160c08301906001600160a01b03169052565b60c083015160e082015260e0830151610120906104b26101009183838601526101408501906103dd565b9401516001600160a01b0316910152565b90565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff8211176104f857604052565b6104c6565b90601f8019910116810190811067ffffffffffffffff8211176104f857604052565b6040519061052c826104dc565b565b60405190610120820182811067ffffffffffffffff8211176104f857604052816101006000918281528260208201528260408201528260608201528260808201528260a08201528260c0820152606060e08201520152565b634e487b7160e01b600052603260045260246000fd5b90156105a55790565b610586565b90600110156105a55760010190565b156105c057565b60405162461bcd60e51b815260206004820152601660248201527f6e6f7420612044796e616d6963466565547854797065000000000000000000006044820152606490fd5b909291928360011161062257831161062257600101916000190190565b600080fd5b909291928360021161062257831161062257600201916001190190565b906003116106225760020190600190565b906002116106225790600290565b909291928360031161062257831161062257600301916002190190565b90939293848311610622578411610622578101920390565b67ffffffffffffffff81116104f857601f01601f191660200190565b9291926106c082610698565b916106ce60405193846104fd565b829481845281830111610622578281602093846000960137010152565b8051156105a55760200190565b8051600110156105a55760400190565b8051600210156105a55760600190565b8051600310156105a55760800190565b8051600410156105a55760a00190565b8051600510156105a55760c00190565b8051600610156105a55760e00190565b8051600710156105a5576101000190565b8051600910156105a5576101400190565b8051600a10156105a5576101600190565b8051600b10156105a5576101800190565b80518210156105a55760209160051b010190565b6020815191015190602081106107c4575090565b6000199060200360031b1b1690565b634e487b7160e01b600052601160045260246000fd5b60ff60f6199116019060ff82116107fc57565b6107d3565b60ff6042199116019060ff82116107fc57565b60ff166002019060ff82116107fc57565b60ff1660c0019060ff82116107fc57565b6001600160f01b0319903581811693926002811061085357505050565b60020360031b82901b16169150565b61ffff90811660421901919082116107fc57565b6001600160f81b0319903581811693926001811061089357505050565b60010360031b82901b16169150565b6042198101919082116107fc57565b60bf198101919082116107fc57565b607f198101919082116107fc57565b60200390602082116107fc57565b6000198101919082116107fc57565b60f6198101919082116107fc57565b60b6198101919082116107fc57565b908092918237016000815290565b6001600160f81b0319909116815260f960f81b60018201526001600160f01b031990911660028201526004929182908483013701016000815290565b6001600160f81b03199182168152601f60fb1b6001820152911660028201526003929182908483013701016000815290565b8051600110156105a55760210190565b919260ff8116601b81106109e5575b509160209360809260ff60009560405194855216868401526040830152606082015282805260015afa156109d95760005190565b6040513d6000823e3d90fd5b601b9150929192019060ff82116107fc57919060206109a5565b60405190610a0c826104dc565b60006020838281520152565b610a206109ff565b50602081519160405192610a33846104dc565b835201602082015290565b67ffffffffffffffff81116104f85760051b60200190565b90600182018092116107fc57565b919082018092116107fc57565b60001981146107fc5760010190565b610a8981610b53565b1561062257610a9781610c53565b610aa081610a3e565b91610aae60405193846104fd565b818352601f19610abd83610a3e565b0160005b818110610b3c575050610ae2602080920151610adc81610d3b565b90610a64565b6000905b838210610af4575050505090565b610b3081610b04610b3693610cb5565b90610b0d61051f565b8281528187820152610b1f868a61079c565b52610b2a858961079c565b50610a64565b91610a71565b90610ae6565b602090610b476109ff565b82828801015201610ac1565b805115610b7457602060c09101515160001a10610b6f57600190565b600090565b50600090565b601581510361062257610b946001600160a01b0391610b98565b1690565b80518015159081610bce575b501561062257610bb390610bda565b90519060208110610bc2575090565b6020036101000a900490565b60219150111538610ba4565b906020820191610bea8351610d3b565b9251908382018092116107fc57519283039283116107fc579190565b80511561062257610c196104c391610bda565b610c2581939293610698565b92610c3360405194856104fd565b818452601f19610c4283610698565b013660208601378360200190610daa565b805115610b745760009060208101908151610c6d81610d3b565b81018091116107fc579151905181018091116107fc5791905b828110610c935750905090565b610c9c81610cb5565b81018091116107fc57610caf9091610a71565b90610c86565b805160001a906080821015610ccb575050600190565b60b8821015610ce65750610ce16104c3916108c0565b610a56565b9060c0811015610d0a5760b51991600160b783602003016101000a91015104010190565b9060f8821015610d215750610ce16104c3916108b1565b60010151602082900360f7016101000a90040160f5190190565b5160001a6080811015610d4e5750600090565b60b881108015610d85575b15610d645750600190565b60c0811015610d7957610ce16104c3916108fb565b610ce16104c3916108ec565b5060c08110158015610d59575060f88110610d59565b601f81116107fc576101000a90565b929091928315610e215792915b602093848410610dec57805182528481018091116107fc579381018091116107fc5791601f1981019081116107fc5791610db7565b9193509180610dfa57505050565b610e0e610e09610e13926108cf565b610d9b565b6108dd565b905182518216911916179052565b5091505056fea2646970667358221220ba3a7502e3392bb3a68d4f7c6365ab0ae0054a0db643438919a1cfa0dc1a851a64736f6c63430008140033";
var isSuperArgs = (xs) => xs.length > 1;
var Tx__factory = class extends import_ethers7.ContractFactory {
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
    return new import_ethers7.utils.Interface(_abi5);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers7.Contract(address, _abi5, signerOrProvider);
  }
};
Tx__factory.bytecode = _bytecode;
Tx__factory.abi = _abi5;

// ../contract/typechain/factories/FeeReimbursementApp__factory.ts
var import_ethers8 = require("ethers");
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "accountId",
        type: "uint128"
      },
      {
        indexed: false,
        internalType: "uint24",
        name: "tradeYearMonth",
        type: "uint24"
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
    inputs: [],
    name: "accountModule",
    outputs: [
      {
        internalType: "contract IAccountModule",
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
        internalType: "contract IAccountModule",
        name: "_accountModule",
        type: "address"
      }
    ],
    name: "setAccountModule",
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
        internalType: "bytes32",
        name: "_vkHash",
        type: "bytes32"
      }
    ],
    name: "setVkHash",
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
    inputs: [],
    name: "vkHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var _bytecode2 = "0x60a0346100b757601f6114c038819003918201601f19168301916001600160401b038311848410176100bc578084926020946040528339810103126100b757516001600160a01b0390818116908190036100b7576080526000543360018060a01b0319821617600055604051913391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a36113ed90816100d382396080518181816102b0015281816109c10152610cb70152f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604052600436101561001257600080fd5b60003560e01c80630258daac146100e757806319d20391146100e25780634fe840f5146100dd578063715018a6146100d85780637859f6d9146100d357806379d6b6a2146100ce5780637c08aa74146100c95780638da5cb5b146100c45780639bdcecd1146100bf578063ada323ff146100ba578063c7f5aaa0146100b5578063f2fde38b146100b05763f7c618c1146100ab57600080fd5b610a94565b6109e5565b6109a1565b61090f565b6108e9565b6108c2565b6107ec565b610248565b610219565b6101ab565b61018d565b610166565b610102565b6001600160a01b038116036100fd57565b600080fd5b346100fd5760203660031901126100fd5760043561011f816100ec565b6001600160a01b039061013782600054163314610abb565b1673ffffffffffffffffffffffffffffffffffffffff196002541617600255600080f35b60009103126100fd57565b346100fd5760003660031901126100fd5760206001600160a01b0360025416604051908152f35b346100fd5760003660031901126100fd576020600354604051908152f35b346100fd576000806003193601126102165780805473ffffffffffffffffffffffffffffffffffffffff196001600160a01b038216916101ec338414610abb565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b346100fd5760203660031901126100fd576102406001600160a01b03600054163314610abb565b600435600355005b346100fd576040806003193601126100fd5767ffffffffffffffff6024358181116100fd57366023820112156100fd5780600401359182116100fd57602481019060248336920101116100fd578251632cc27dc960e11b8152600480359082015283816024817f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165afa90811561037d57600091610350575b506102f53684846106c1565b602081519101200361030d5761030b9250610f2c565b005b6064835162461bcd60e51b815260206004820152602060248201527f6661696c656420746f206f70656e206f757470757420636f6d6d69746d656e746044820152fd5b908482813d8311610376575b610366818361044d565b81010312610216575051386102e9565b503d61035c565b610c9e565b6024359067ffffffffffffffff821682036100fd57565b359067ffffffffffffffff821682036100fd57565b634e487b7160e01b600052604160045260246000fd5b6060810190811067ffffffffffffffff8211176103e057604052565b6103ae565b60a0810190811067ffffffffffffffff8211176103e057604052565b6080810190811067ffffffffffffffff8211176103e057604052565b67ffffffffffffffff81116103e057604052565b6040810190811067ffffffffffffffff8211176103e057604052565b90601f8019910116810190811067ffffffffffffffff8211176103e057604052565b67ffffffffffffffff81116103e05760051b60200190565b81601f820112156100fd5780359061049e8261046f565b926040926104ae8451958661044d565b8085526020918280870192600a1b850101938185116100fd578301915b8483106104db5750505050505090565b61040080848403126100fd578651906104f3826103c4565b6104fc85610399565b8252610509868601610399565b8683015283605f860112156100fd57875190610524826103e5565b8501818582116100fd579187939194928a8801905b8682106105565750506104009450898201528152019201916104cb565b908092949693955087039060c082126100fd578b5190610575826103c4565b60808093126100fd578c519161058a83610401565b843560ff811681036100fd5760c0948f948e956105d69382526105ae878a01610399565b8783015280890135906105c0826100ec565b8201526060808901359082015283528601610399565b838201528d60a0860135908201528152019101889492959391610539565b81601f820112156100fd5780359061060b8261046f565b9260409061061b8251958661044d565b838552602091828601918360a0809702860101948186116100fd578401925b85841061064b575050505050505090565b86848303126100fd578487918451610662816103e5565b8635815282870135610673816100ec565b838201528587013586820152606080880135908201526080610696818901610399565b9082015281520193019261063a565b67ffffffffffffffff81116103e057601f01601f191660200190565b9291926106cd826106a5565b916106db604051938461044d565b8294818452818301116100fd578281602093846000960137010152565b81601f820112156100fd5780359061070f8261046f565b9260409261071f8451958661044d565b808552602093848087019260051b850101938385116100fd57858101925b85841061074e575050505050505090565b67ffffffffffffffff9084358281116100fd5783019060a09283601f19848a0301126100fd57855192610780846103e5565b8a8101358452868101358b85015260609461079c868301610399565b888601526080956107ae878401610399565b908601528101359182116100fd57019187603f840112156100fd5789936107dd898589888098013591016106c1565b9082015281520193019261073d565b346100fd576003196060368201126100fd57610806610382565b6044359067ffffffffffffffff928383116100fd5760809083360301126100fd576040519061083482610401565b8260040135825260248301358481116100fd576108579060043691860101610487565b602083015260448301358481116100fd5761087890600436918601016105f4565b604083015260648301359384116100fd5761089f6108ac9360046108be96369201016106f8565b6060830152600435610caa565b60405190151581529081906020820190565b0390f35b346100fd5760003660031901126100fd5760206001600160a01b0360005416604051908152f35b346100fd5760003660031901126100fd57602062ffffff60015460a01c16604051908152f35b346100fd5760403660031901126100fd5760043561092c816100ec565b60243562ffffff811681036100fd577fffffffffffffffffff00000000000000000000000000000000000000000000006001600160a01b0361097381600054163314610abb565b76ffffff00000000000000000000000000000000000000006001549360a01b16931691161717600155600080f35b346100fd5760003660031901126100fd5760206040516001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168152f35b346100fd5760203660031901126100fd57600435610a02816100ec565b6001600160a01b03610a1981600054163314610abb565b811615610a295761030b90610b06565b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b346100fd5760003660031901126100fd5760206001600160a01b0360015416604051908152f35b15610ac257565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b600054906001600160a01b03809116918273ffffffffffffffffffffffffffffffffffffffff19821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b90815180825260208080930193019160005b828110610b7b575050505090565b835180518652808301516001600160a01b031686840152604080820151908701526060808201519087015260809081015167ffffffffffffffff169086015260a09094019392810192600101610b6d565b919082519283825260005b848110610bf8575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610bd7565b90815180825260208092019182818360051b85019501936000915b848310610c375750505050505090565b9091929394958480610c8e83856001950387528a5180518252838101518483015267ffffffffffffffff6040818184015116908401526060908183015116908301526080809101519160a080928201520190610bcc565b9801930193019194939290610c27565b6040513d6000823e3d90fd5b916001600160a01b0390817f00000000000000000000000000000000000000000000000000000000000000001691823b156100fd57929391906040948551958694631f022a9d60e21b8652600486015267ffffffffffffffff809216602486015260609081604487015260e486019284516064880152602093848601519460808060848b01528651809352816101048b0197019360009b8c925b858410610db6575050505050505092859392610d8892610d7686958401519260631993848883030160a4890152610b5b565b920151908483030160c4850152610c0c565b03915afa801561037d57610d9d575b50600190565b80610daa610db09261041d565b8061015b565b38610d97565b9193869a9b9c508d8882989b939597999a9b518781511685528784820151168486015201518a84019091905b8b8d60058410610e0d575050505050610400600192019a019401918d9b9a9998979694959391610d44565b9160c091859693600195965190808d83519060ff82511687528882015116888701528d8582015116858701520151908401528b85820151168a840152015160a082015201930191018892610de2565b634e487b7160e01b600052601160045260246000fd5b906001600160f81b038092169160148302169180830460141490151715610e9557565b610e5c565b906001600160f81b038092169160328302169180830460321490151715610e9557565b906001600160f81b0380921691604b83021691808304604b1490151715610e9557565b906001600160f81b0380921691605a83021691808304605a1490151715610e9557565b908160209103126100fd5751610f18816100ec565b90565b9081156001838004141715610e9557565b90610f3691611372565b91926001600160f81b039260009284166a52b7d2dcc80cd2e40000008111156110fd5750610f79919250610f6990610ee0565b6001600160f81b03606491160490565b905b600092821680610ff3575b50604080516fffffffffffffffffffffffffffffffff909516855262ffffff90911660208501526001600160f81b03909116908301526001600160a01b0316907fab5fbf0441b04b7a6b969c24bbf1821c6ec51adaa0bd99ceec902fb0fc2a2f499080606081015b0390a2565b909261101661100a6002546001600160a01b031690565b6001600160a01b031690565b60405163bf60c31d60e01b81526fffffffffffffffffffffffffffffffff871660048201529390602090859060249082905afa94851561037d577fab5fbf0441b04b7a6b969c24bbf1821c6ec51adaa0bd99ceec902fb0fc2a2f49956001600160a01b0395610fee94916110cf575b508094869182811661109f575b5050509294509250610f86565b6110c7926110c06110b260015494610f1b565b670de0b6b3a7640000900490565b9216611175565b388080611092565b6110f0915060203d81116110f6575b6110e8818361044d565b810190610f03565b38611085565b503d6110de565b6a084595161401484a0000008111156111265750611120919250610f6990610ebd565b90610f7b565b69d3c21bcecceda10000008111156111485750611120919250610f6990610e9a565b69152d02c7e14af68000001061115f575b50610f7b565b61116e919250610f6990610e72565b9038611159565b91604051916020938484019263a9059cbb60e01b84526001600160a01b0380931660248601526044850152604484526111ad84610401565b1690604051926111bc84610431565b8484527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656485850152823b1561122f57611208939260009283809351925af16112026112fe565b9061132e565b8051908161121557505050565b8261122d93611228938301019101611274565b61128c565b565b60405162461bcd60e51b815260048101869052601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b908160209103126100fd575180151581036100fd5790565b1561129357565b60405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608490fd5b3d15611329573d9061130f826106a5565b9161131d604051938461044d565b82523d6000602084013e565b606090565b9091901561133a575090565b81511561134a5750805190602001fd5b60405162461bcd60e51b81526020600482015290819061136e906024830190610bcc565b0390fd5b90806013116100fd57601082013560e81c92816023116100fd57601383013560801c92826042116100fd57602381013560081c926061116100fd576042013560081c9056fea2646970667358221220fe97d0be557d7597c7527ad40d30f6e2226ed8aa9adcd9484e2fd66112bdaafd64736f6c63430008140033";
var isSuperArgs2 = (xs) => xs.length > 1;
var FeeReimbursementApp__factory = class extends import_ethers8.ContractFactory {
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
    return new import_ethers8.utils.Interface(_abi6);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers8.Contract(address, _abi6, signerOrProvider);
  }
};
FeeReimbursementApp__factory.bytecode = _bytecode2;
FeeReimbursementApp__factory.abi = _abi6;

// ../contract/typechain/factories/IAccountModule__factory.ts
var import_ethers9 = require("ethers");
var _abi7 = [
  {
    inputs: [
      {
        internalType: "uint128",
        name: "accountId",
        type: "uint128"
      }
    ],
    name: "getAccountOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
var IAccountModule__factory = class {
  static createInterface() {
    return new import_ethers9.utils.Interface(_abi7);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers9.Contract(address, _abi7, signerOrProvider);
  }
};
IAccountModule__factory.abi = _abi7;

// src/brevis_request/BrevisRequest__factory.ts
var import_ethers10 = require("ethers");
var _abi8 = [
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
var _bytecode3 = "0x6080346100c057601f610d9638819003918201601f19168301916001600160401b038311848410176100c55780849260409485528339810103126100c05780516001600160a01b0391828216918290036100c05760200151908282168092036100c0576000549060018060a01b0319913383821617600055604051943391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a38160015416176001556003541617600355610cba90816100dc8239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe60806040818152600480361015610021575b505050361561001f57600080fd5b005b600092833560e01c9081633f20b4c91461097b57508063622b6af41461091a5780636a96173514610700578063715018a6146106a0578381637249fbb614610600575080637ff7b0d2146105735780638da5cb5b1461054d5780639d866985146104e9578063a42dce8014610470578063b6979c3e1461043a578063c415b95c14610412578063c7f5aaa0146103ea578063da47dc32146101d5578063e713b4c9146101b15763f2fde38b0361001157346101ad5760203660031901126101ad576100ea6109e0565b908354906001600160a01b0380831693610105338614610a19565b169384156101445750506001600160a01b031916821783557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b8382346101d15760203660031901126101d1576101ce9035610b49565b80f35b5080fd5b50919060603660031901126101d1578235906101ef6109ca565b90604435916001600160a01b038084168094036103e657848652602091878352838720546103a35781169081156103605760025442019081421161034d5784519160a0830183811067ffffffffffffffff82111761033a5786528252600384830192348452868101948552606081019488865260808201948b86528a8c528c8852888c209251835551600183015583600283019151166001600160a01b031982541617905501925116825491516003811015610327577fffffffffffffffffffffff0000000000000000000000000000000000000000009092161760a09190911b74ff00000000000000000000000000000000000000001617905581519384523390840152349083015260608201527f4eede03ca33645529b4d82428b024149165298c901cf7453f68eb43bd3d3b65890608090a180f35b634e487b7160e01b895260218a52602489fd5b634e487b7160e01b8a5260418b5260248afd5b634e487b7160e01b885260118952602488fd5b835162461bcd60e51b8152808901849052601560248201527f726566756e646565206e6f742070726f766964656400000000000000000000006044820152606490fd5b835162461bcd60e51b8152808901849052601860248201527f7265717565737420616c726561647920696e20717565756500000000000000006044820152606490fd5b8580fd5b5050346101d157816003193601126101d1576020906001600160a01b03600354169051908152f35b5050346101d157816003193601126101d1576020906001600160a01b03600154169051908152f35b50346101ad5760203660031901126101ad5760ff6003836020958461046e95358252875220015460a01c16915180926109f6565bf35b5050346101d15760203660031901126101d1577f5d16ad41baeb009cd23eb8f6c7cde5c2e0cd5acf4a33926ab488875c37c37f38906104ad6109e0565b6001600160a01b036104c3818654163314610a19565b80600154921690816001600160a01b03198416176001558351921682526020820152a180f35b50346101ad5760203660031901126101ad578160a0938261046e93358252602052208054926001820154916001600160a01b039160038360028401541692015493815196875260208701528501528116606084015260ff6080840191851c166109f6565b5050346101d157816003193601126101d1576001600160a01b0360209254169051908152f35b50346101ad57816003193601126101ad5761058c6109ca565b916001600160a01b036001541633036105bd57508280806101ce948194359061c350f16105b7610abd565b50610c38565b906020606492519162461bcd60e51b8352820152601160248201527f6e6f742066656520636f6c6c6563746f720000000000000000000000000000006044820152fd5b8084843461069c57602036600319011261069c5780358084528160205261062b838520541515610afd565b80845281602052828420805442111561069857848080808460039961066b965560016001600160a01b036002830154169101549061c350f16105b7610abd565b84526020528220017402000000000000000000000000000000000000000060ff60a01b1982541617905580f35b8480fd5b5050fd5b83346106fd57806003193601126106fd578080546001600160a01b03196001600160a01b038216916106d3338414610a19565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b509190346101d15760a03660031901126101d15767ffffffffffffffff833560243582811690819003610698576044358381116103e6576107449036908801610997565b949060643594851515809603610905576084359081116109055761076b9036908a01610997565b939095896001600160a01b03936107a685600354169187519b8c968795630979240d60e21b8752860152606060248601526064850191610a9c565b926044830152818b60209b8c9503925af19081156109105788916108df575b50840361089c5786976107d785610b49565b8488528087526003838920017401000000000000000000000000000000000000000060ff60a01b198254161790557f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e6878451878152a1848852865260038288200154169384610844578680f35b86956108756108839288958551958694850198633ceb5b5160e11b8a52602486015260448501526064840191610a9c565b03601f198101835282610a64565b51925af150610890610abd565b50803880808080808680f35b815162461bcd60e51b8152808901879052601d60248201527f72657175657374496420616e642070726f6f66206e6f74206d617463680000006044820152606490fd5b90508681813d8311610909575b6108f68183610a64565b810103126109055751386107c5565b8780fd5b503d6108ec565b83513d8a823e3d90fd5b5090346101ad5760203660031901126101ad577f87a73c061f18ffd513249d1d727921e40e348948b01e2979efb36ef4f5204a6391356109656001600160a01b038554163314610a19565b600254908060025582519182526020820152a180f35b8490346101d157816003193601126101d1576020906002548152f35b9181601f840112156109c55782359167ffffffffffffffff83116109c557602083818601950101116109c557565b600080fd5b602435906001600160a01b03821682036109c557565b600435906001600160a01b03821682036109c557565b906003821015610a035752565b634e487b7160e01b600052602160045260246000fd5b15610a2057565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90601f8019910116810190811067ffffffffffffffff821117610a8657604052565b634e487b7160e01b600052604160045260246000fd5b908060209392818452848401376000828201840152601f01601f1916010190565b3d15610af8573d9067ffffffffffffffff8211610a865760405191610aec601f8201601f191660200184610a64565b82523d6000602084013e565b606090565b15610b0457565b60405162461bcd60e51b815260206004820152601460248201527f72657175657374206e6f7420696e2071756575650000000000000000000000006044820152606490fd5b60009080825260209060048252610b6560408420541515610afd565b6024826001600160a01b0360035416604051928380926371e8f36b60e11b82528660048301525afa908115610c2d578491610bf3575b5015610bae578252600490526040812055565b60405162461bcd60e51b815260048101839052601360248201527f70726f6f66206e6f742067656e657261746564000000000000000000000000006044820152606490fd5b90508281813d8311610c26575b610c0a8183610a64565b81010312610c2257518015158103610c225738610b9b565b8380fd5b503d610c00565b6040513d86823e3d90fd5b15610c3f57565b60405162461bcd60e51b815260206004820152601260248201527f73656e64206e6174697665206661696c656400000000000000000000000000006044820152606490fdfea26469706673582212201905409e4cdfc7fb6b946c9212735c55a3478272e9a45a4b96ed82c94b4d1ba164736f6c63430008140033";
var isSuperArgs3 = (xs) => xs.length > 1;
var BrevisRequest__factory = class extends import_ethers10.ContractFactory {
  constructor(...args) {
    if (isSuperArgs3(args)) {
      super(...args);
    } else {
      super(_abi8, _bytecode3, args[0]);
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
    return new import_ethers10.utils.Interface(_abi8);
  }
  static connect(address, signerOrProvider) {
    return new import_ethers10.Contract(address, _abi8, signerOrProvider);
  }
};
BrevisRequest__factory.bytecode = _bytecode3;
BrevisRequest__factory.abi = _abi8;

// src/ether_interactions/index.ts
var dotenv2 = __toESM(require("dotenv"));
dotenv2.config();
var { FeeReimbursementApp__factory: FeeReimbursementApp__factory2 } = typechain_exports;
var dstChainProvider = new import_ethers11.ethers.providers.JsonRpcProvider(
  process.env.DEST_RPC ?? ""
);
var sourceChainProvider = new import_ethers11.ethers.providers.JsonRpcProvider(
  process.env.SOURCE_RPC ?? ""
);
var wallet = new import_ethers11.ethers.Wallet(
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
async function monitorFeeReimbursed() {
  userSwapAmountApp.on("FeeReimbursed", (user, trade_year_month, fee) => {
    const userAddress = user;
    const tradeYearMonthBN = trade_year_month;
    if (userAddress === void 0 || userAddress === null || tradeYearMonthBN === void 0 || tradeYearMonthBN === null) {
      console.log(
        "reimbursement triggered with unexpected value:: ",
        user,
        trade_year_month,
        fee
      );
      return;
    }
    findUserExistingUTVF(userAddress, BigInt(tradeYearMonthBN.toNumber())).then((utvf) => {
      if (utvf) {
        utvf.status = PROOF_STATUS_ONCHAIN_VERIFIED;
        return updateUserTradeVolumeFee(utvf);
      }
    }).catch((error) => {
      console.error(
        "failed to update user swap amount",
        user,
        user,
        trade_year_month,
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

// src/rpc/index.ts
async function querySingleReceipt(receipt) {
  return sourceChainProvider.getTransactionReceipt(receipt.tx_hash).catch((error) => {
    console.log(error, error);
  }).then((transactionReceipt) => {
    if (transactionReceipt == null || transactionReceipt == void 0) {
      console.debug("tx receipt not found", receipt.id, receipt.tx_hash);
      return;
    }
    let logsFound = false;
    let data = "";
    transactionReceipt.logs.forEach((log, i) => {
      if (log.topics.length < 3) {
        return;
      }
      let logAddress = log.address.toLowerCase();
      let topic0 = log.topics[0].toLowerCase();
      if (logAddress === "0x0A2AF931eFFd34b81ebcc57E3d3c9B1E1dE1C9Ce".toLowerCase() && topic0.toLowerCase() === "0x460080a757ec90719fe90ab2384c0196cdeed071a9fd7ce1ada43481d96b7db5") {
        logsFound = true;
        data = JSON.stringify({
          block_num: transactionReceipt.blockNumber,
          tx_hash: transactionReceipt.transactionHash,
          fields: [
            // accountId
            {
              contract: logAddress,
              log_index: i,
              event_id: topic0,
              is_topic: true,
              field_index: 2,
              value: log.topics[2].toLowerCase()
            },
            // fillPrice
            {
              contract: logAddress,
              log_index: i,
              event_id: topic0,
              is_topic: false,
              field_index: 0,
              value: "0x" + log.data.replace("0x", "").slice(0, 64)
            },
            // sizeDelta
            {
              contract: logAddress,
              log_index: i,
              event_id: topic0,
              is_topic: false,
              field_index: 3,
              value: "0x" + log.data.replace("0x", "").slice(64 * 3, 64 * 4)
            },
            // totalFees
            {
              contract: logAddress,
              log_index: i,
              event_id: topic0,
              is_topic: false,
              field_index: 5,
              value: "0x" + log.data.replace("0x", "").slice(64 * 5, 64 * 6)
            }
          ]
        });
      }
    });
    if (logsFound) {
      updateReceipt(
        receipt.id,
        STATUS_READY,
        data
      );
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

// src/interval_jobs/index.ts
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
  const ym = Number(userSwapAmount.trade_year_month);
  const month = ym % 100;
  const monthString = (month + "").padStart(2, "0");
  const nextMonth = (month + 1) % 12;
  const nextMonthString = (nextMonth + "").padStart(2, "0");
  const year0 = Math.floor(ym / 100);
  var year1 = year0;
  if (nextMonth < month) {
    year1++;
  }
  console.log("Start to send dune query: ", userSwapAmount.id, (/* @__PURE__ */ new Date()).toLocaleString());
  const duneResult = await QueryOrderTxsByAccount(year0 + "-" + monthString + "-01", year1 + "-" + nextMonthString + "-01", userSwapAmount.account);
  console.log("Dune resule returned: ", userSwapAmount.id, (/* @__PURE__ */ new Date()).toLocaleString());
  if (duneResult.txs.length === 0) {
    console.error("no order settled found");
    userSwapAmount.status = PROOF_STATUS_INELIGIBLE_ACCOUNT_ID;
    updateUserTradeVolumeFee(userSwapAmount);
    return;
  }
  const promises = Array();
  duneResult.txs.forEach((tx) => {
    promises.push(
      insertReceipt(tx).then((receipt) => {
        return receipt.id;
      })
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
    const utvfs = await findUserTradeVolumeFees(PROOF_STATUS_PROVING_FINISHED);
    let promises = Array();
    for (let i = 0; i < utvfs.length; i++) {
      promises.push(uploadUserTradeVolumeFeeProof(utvfs[i]));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("failed to upload user swap amount proof");
  }
}

// src/server/index.ts
var import_ethers12 = require("ethers");
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
getReceiptInfos().then();
setInterval(getReceiptInfos, 4e3);
getStorageInfos().then();
setInterval(getStorageInfos, 1e4);
prepareUserTradeVolumeFees().then();
setInterval(prepareUserTradeVolumeFees, 1e4);
monitorFeeReimbursed();
monitorBrevisRequest();
app.post("/kwenta/newTradeFeeReimbursement", async (req, res) => {
  try {
    const { account, trade_year_month } = req.body;
    const tym = Number(trade_year_month);
    const month = tym % 100;
    const now = /* @__PURE__ */ new Date();
    const utcMonth = now.getUTCMonth() + 1;
    const fullYear = now.getUTCFullYear();
    if (isNaN(tym) || tym < 202402 || tym >= utcMonth + fullYear * 100 || month > 13) {
      res.status(500);
      res.send({ error: true, message: "invalid claim trade time period" });
      return;
    }
    var utvf = await findUserExistingUTVF(account, BigInt(tym));
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
      BigInt(tym)
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
    const { query_id } = req.query;
    if (query_id?.toString() == null || query_id?.toString() == void 0) {
      res.status(500);
      res.send({ error: true, message: "query id not found" });
      return;
    }
    const utvf = await getUserTradeVolumeFee(query_id?.toString());
    if (utvf == null || utvf == void 0) {
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
    } else if (Number(utvf.status) == Number(PROOF_STATUS_PROOF_UPLOADED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_NEED_TO_SUBMIT_REQUEST;
      message = "You need to submit SendRequest transaction with query_hash and query_fee on brevis request contract.And use address(" + process.env.FEE_REIMBURSEMENT + ") as _callback";
    } else if (Number(utvf.status) == Number(PROOF_STATUS_BREVIS_REQUEST_SUBMITTED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_WAITING_FOR_RESULT;
      message = "Brevis is preparing swap amount proof";
    } else if (Number(utvf.status) == Number(PROOF_STATUS_PROOF_UPLOADED)) {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INELIGIBLE_ACCOUNT_ID;
      message = "No order settled info found for this account id";
    } else {
      status = FEE_REIMBURSEMENT_INFO_STATUS_INIT;
      message = "Wait until query_hash and query_fee is ready";
    }
    var volume = utvf.volume;
    if (volume === "") {
      volume = "0";
    }
    const volumeBN = import_ethers12.BigNumber.from(volume).div(import_ethers12.BigNumber.from("1000000000000000000"));
    var fee = utvf.fee;
    if (fee === "") {
      fee = "0";
    }
    var feeBN = import_ethers12.BigNumber.from(fee).div(import_ethers12.BigNumber.from("1000000000000000000"));
    var tier = -1;
    if (volumeBN.toNumber() <= 1e5) {
      tier = -1;
    } else if (volumeBN.toNumber() <= 1e5) {
      tier = 0;
      feeBN = feeBN.mul(import_ethers12.BigNumber.from(2)).div(import_ethers12.BigNumber.from(10));
    } else if (volumeBN.toNumber() <= 1e6) {
      tier = 1;
      feeBN = feeBN.mul(import_ethers12.BigNumber.from(5)).div(import_ethers12.BigNumber.from(10));
    } else if (volumeBN.toNumber() <= 1e7) {
      tier = 2;
      feeBN = feeBN.mul(import_ethers12.BigNumber.from(75)).div(import_ethers12.BigNumber.from(100));
    } else if (volumeBN.toNumber() <= 1e8) {
      tier = 3;
      feeBN = feeBN.mul(import_ethers12.BigNumber.from(9)).div(import_ethers12.BigNumber.from(10));
    }
    res.json({
      status,
      query_hash: utvf.brevis_query_hash,
      query_fee: utvf.brevis_query_fee,
      brevis_request_contract_address: brevisRequest2,
      message,
      tier,
      fee_to_reimbursed: feeBN.toString()
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
var dotenv3 = __toESM(require("dotenv"));
dotenv3.config();
BigInt.prototype.toJSON = function() {
  return this.toString();
};
//# sourceMappingURL=index.js.map