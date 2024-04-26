/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BrevisRequest, BrevisRequestInterface } from "./BrevisRequest";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeCollector",
        type: "address",
      },
      {
        internalType: "contract IBrevisProof",
        name: "_brevisProof",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "FeeCollectorUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
    ],
    name: "RequestFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "callback",
        type: "address",
      },
    ],
    name: "RequestSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "from",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "to",
        type: "uint256",
      },
    ],
    name: "RequestTimeoutUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "brevisProof",
    outputs: [
      {
        internalType: "contract IBrevisProof",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
    ],
    name: "chargeFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "collectFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "feeCollector",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "_chainId",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bool",
        name: "_withAppProof",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes",
      },
    ],
    name: "fulfillRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
    ],
    name: "queryRequestStatus",
    outputs: [
      {
        internalType: "enum BrevisRequest.RequestStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "requestTimeout",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "requests",
    outputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "refundee",
        type: "address",
      },
      {
        internalType: "address",
        name: "callback",
        type: "address",
      },
      {
        internalType: "enum BrevisRequest.RequestStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_refundee",
        type: "address",
      },
      {
        internalType: "address",
        name: "_callback",
        type: "address",
      },
    ],
    name: "sendRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeCollector",
        type: "address",
      },
    ],
    name: "setFeeCollector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timeout",
        type: "uint256",
      },
    ],
    name: "setRequestTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x6080346100c057601f610d9638819003918201601f19168301916001600160401b038311848410176100c55780849260409485528339810103126100c05780516001600160a01b0391828216918290036100c05760200151908282168092036100c0576000549060018060a01b0319913383821617600055604051943391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a38160015416176001556003541617600355610cba90816100dc8239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe60806040818152600480361015610021575b505050361561001f57600080fd5b005b600092833560e01c9081633f20b4c91461097b57508063622b6af41461091a5780636a96173514610700578063715018a6146106a0578381637249fbb614610600575080637ff7b0d2146105735780638da5cb5b1461054d5780639d866985146104e9578063a42dce8014610470578063b6979c3e1461043a578063c415b95c14610412578063c7f5aaa0146103ea578063da47dc32146101d5578063e713b4c9146101b15763f2fde38b0361001157346101ad5760203660031901126101ad576100ea6109e0565b908354906001600160a01b0380831693610105338614610a19565b169384156101445750506001600160a01b031916821783557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b8382346101d15760203660031901126101d1576101ce9035610b49565b80f35b5080fd5b50919060603660031901126101d1578235906101ef6109ca565b90604435916001600160a01b038084168094036103e657848652602091878352838720546103a35781169081156103605760025442019081421161034d5784519160a0830183811067ffffffffffffffff82111761033a5786528252600384830192348452868101948552606081019488865260808201948b86528a8c528c8852888c209251835551600183015583600283019151166001600160a01b031982541617905501925116825491516003811015610327577fffffffffffffffffffffff0000000000000000000000000000000000000000009092161760a09190911b74ff00000000000000000000000000000000000000001617905581519384523390840152349083015260608201527f4eede03ca33645529b4d82428b024149165298c901cf7453f68eb43bd3d3b65890608090a180f35b634e487b7160e01b895260218a52602489fd5b634e487b7160e01b8a5260418b5260248afd5b634e487b7160e01b885260118952602488fd5b835162461bcd60e51b8152808901849052601560248201527f726566756e646565206e6f742070726f766964656400000000000000000000006044820152606490fd5b835162461bcd60e51b8152808901849052601860248201527f7265717565737420616c726561647920696e20717565756500000000000000006044820152606490fd5b8580fd5b5050346101d157816003193601126101d1576020906001600160a01b03600354169051908152f35b5050346101d157816003193601126101d1576020906001600160a01b03600154169051908152f35b50346101ad5760203660031901126101ad5760ff6003836020958461046e95358252875220015460a01c16915180926109f6565bf35b5050346101d15760203660031901126101d1577f5d16ad41baeb009cd23eb8f6c7cde5c2e0cd5acf4a33926ab488875c37c37f38906104ad6109e0565b6001600160a01b036104c3818654163314610a19565b80600154921690816001600160a01b03198416176001558351921682526020820152a180f35b50346101ad5760203660031901126101ad578160a0938261046e93358252602052208054926001820154916001600160a01b039160038360028401541692015493815196875260208701528501528116606084015260ff6080840191851c166109f6565b5050346101d157816003193601126101d1576001600160a01b0360209254169051908152f35b50346101ad57816003193601126101ad5761058c6109ca565b916001600160a01b036001541633036105bd57508280806101ce948194359061c350f16105b7610abd565b50610c38565b906020606492519162461bcd60e51b8352820152601160248201527f6e6f742066656520636f6c6c6563746f720000000000000000000000000000006044820152fd5b8084843461069c57602036600319011261069c5780358084528160205261062b838520541515610afd565b80845281602052828420805442111561069857848080808460039961066b965560016001600160a01b036002830154169101549061c350f16105b7610abd565b84526020528220017402000000000000000000000000000000000000000060ff60a01b1982541617905580f35b8480fd5b5050fd5b83346106fd57806003193601126106fd578080546001600160a01b03196001600160a01b038216916106d3338414610a19565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b509190346101d15760a03660031901126101d15767ffffffffffffffff833560243582811690819003610698576044358381116103e6576107449036908801610997565b949060643594851515809603610905576084359081116109055761076b9036908a01610997565b939095896001600160a01b03936107a685600354169187519b8c968795630979240d60e21b8752860152606060248601526064850191610a9c565b926044830152818b60209b8c9503925af19081156109105788916108df575b50840361089c5786976107d785610b49565b8488528087526003838920017401000000000000000000000000000000000000000060ff60a01b198254161790557f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e6878451878152a1848852865260038288200154169384610844578680f35b86956108756108839288958551958694850198633ceb5b5160e11b8a52602486015260448501526064840191610a9c565b03601f198101835282610a64565b51925af150610890610abd565b50803880808080808680f35b815162461bcd60e51b8152808901879052601d60248201527f72657175657374496420616e642070726f6f66206e6f74206d617463680000006044820152606490fd5b90508681813d8311610909575b6108f68183610a64565b810103126109055751386107c5565b8780fd5b503d6108ec565b83513d8a823e3d90fd5b5090346101ad5760203660031901126101ad577f87a73c061f18ffd513249d1d727921e40e348948b01e2979efb36ef4f5204a6391356109656001600160a01b038554163314610a19565b600254908060025582519182526020820152a180f35b8490346101d157816003193601126101d1576020906002548152f35b9181601f840112156109c55782359167ffffffffffffffff83116109c557602083818601950101116109c557565b600080fd5b602435906001600160a01b03821682036109c557565b600435906001600160a01b03821682036109c557565b906003821015610a035752565b634e487b7160e01b600052602160045260246000fd5b15610a2057565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90601f8019910116810190811067ffffffffffffffff821117610a8657604052565b634e487b7160e01b600052604160045260246000fd5b908060209392818452848401376000828201840152601f01601f1916010190565b3d15610af8573d9067ffffffffffffffff8211610a865760405191610aec601f8201601f191660200184610a64565b82523d6000602084013e565b606090565b15610b0457565b60405162461bcd60e51b815260206004820152601460248201527f72657175657374206e6f7420696e2071756575650000000000000000000000006044820152606490fd5b60009080825260209060048252610b6560408420541515610afd565b6024826001600160a01b0360035416604051928380926371e8f36b60e11b82528660048301525afa908115610c2d578491610bf3575b5015610bae578252600490526040812055565b60405162461bcd60e51b815260048101839052601360248201527f70726f6f66206e6f742067656e657261746564000000000000000000000000006044820152606490fd5b90508281813d8311610c26575b610c0a8183610a64565b81010312610c2257518015158103610c225738610b9b565b8380fd5b503d610c00565b6040513d86823e3d90fd5b15610c3f57565b60405162461bcd60e51b815260206004820152601260248201527f73656e64206e6174697665206661696c656400000000000000000000000000006044820152606490fdfea26469706673582212201905409e4cdfc7fb6b946c9212735c55a3478272e9a45a4b96ed82c94b4d1ba164736f6c63430008140033";

type BrevisRequestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BrevisRequestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BrevisRequest__factory extends ContractFactory {
  constructor(...args: BrevisRequestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "BrevisRequest";
  }

  deploy(
    _feeCollector: string,
    _brevisProof: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BrevisRequest> {
    return super.deploy(
      _feeCollector,
      _brevisProof,
      overrides || {}
    ) as Promise<BrevisRequest>;
  }
  getDeployTransaction(
    _feeCollector: string,
    _brevisProof: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _feeCollector,
      _brevisProof,
      overrides || {}
    );
  }
  attach(address: string): BrevisRequest {
    return super.attach(address) as BrevisRequest;
  }
  connect(signer: Signer): BrevisRequest__factory {
    return super.connect(signer) as BrevisRequest__factory;
  }
  static readonly contractName: "BrevisRequest";
  public readonly contractName: "BrevisRequest";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BrevisRequestInterface {
    return new utils.Interface(_abi) as BrevisRequestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BrevisRequest {
    return new Contract(address, _abi, signerOrProvider) as BrevisRequest;
  }
}
