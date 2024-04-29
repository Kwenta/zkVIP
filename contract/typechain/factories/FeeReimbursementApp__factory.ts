/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FeeReimbursementApp,
  FeeReimbursementAppInterface,
} from "../FeeReimbursementApp";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
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
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "accountId",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint24",
        name: "tradeYearMonth",
        type: "uint24",
      },
      {
        indexed: false,
        internalType: "uint248",
        name: "feeRebate",
        type: "uint248",
      },
    ],
    name: "FeeReimbursed",
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
    inputs: [],
    name: "accountModule",
    outputs: [
      {
        internalType: "contract IAccountModule",
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
        internalType: "bytes",
        name: "_appCircuitOutput",
        type: "bytes",
      },
    ],
    name: "brevisCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
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
    inputs: [],
    name: "rewardTokenDecimals",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAccountModule",
        name: "_accountModule",
        type: "address",
      },
    ],
    name: "setAccountModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "_decimals",
        type: "uint24",
      },
    ],
    name: "setRewardToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_vkHash",
        type: "bytes32",
      },
    ],
    name: "setVkHash",
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
        components: [
          {
            internalType: "bytes32",
            name: "smtRoot",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "blkNum",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "receiptIndex",
                type: "uint64",
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "uint8",
                        name: "valueFromTopic",
                        type: "uint8",
                      },
                      {
                        internalType: "uint64",
                        name: "valueIndex",
                        type: "uint64",
                      },
                      {
                        internalType: "address",
                        name: "contractAddress",
                        type: "address",
                      },
                      {
                        internalType: "bytes32",
                        name: "logTopic0",
                        type: "bytes32",
                      },
                    ],
                    internalType: "struct Brevis.LogExtraInfo",
                    name: "logExtraInfo",
                    type: "tuple",
                  },
                  {
                    internalType: "uint64",
                    name: "logIndex",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes32",
                    name: "value",
                    type: "bytes32",
                  },
                ],
                internalType: "struct Brevis.LogInfo[5]",
                name: "logs",
                type: "tuple[5]",
              },
            ],
            internalType: "struct Brevis.ReceiptInfo[]",
            name: "receipts",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "slotValue",
                type: "bytes32",
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64",
              },
            ],
            internalType: "struct Brevis.StorageInfo[]",
            name: "stores",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "leafHash",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
              },
              {
                internalType: "uint64",
                name: "blockNumber",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "blockTime",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "leafRlpPrefix",
                type: "bytes",
              },
            ],
            internalType: "struct Brevis.TransactionInfo[]",
            name: "txs",
            type: "tuple[]",
          },
        ],
        internalType: "struct Brevis.ExtractInfos",
        name: "_extractInfos",
        type: "tuple",
      },
    ],
    name: "validateRequest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vkHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a0346100b757601f6114e738819003918201601f19168301916001600160401b038311848410176100bc578084926020946040528339810103126100b757516001600160a01b0390818116908190036100b7576080526000543360018060a01b0319821617600055604051913391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a361141490816100d382396080518181816102b0015281816109c10152610cb70152f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604052600436101561001257600080fd5b60003560e01c80630258daac146100e757806319d20391146100e25780634fe840f5146100dd578063715018a6146100d85780637859f6d9146100d357806379d6b6a2146100ce5780637c08aa74146100c95780638da5cb5b146100c45780639bdcecd1146100bf578063ada323ff146100ba578063c7f5aaa0146100b5578063f2fde38b146100b05763f7c618c1146100ab57600080fd5b610a94565b6109e5565b6109a1565b61090f565b6108e9565b6108c2565b6107ec565b610248565b610219565b6101ab565b61018d565b610166565b610102565b6001600160a01b038116036100fd57565b600080fd5b346100fd5760203660031901126100fd5760043561011f816100ec565b6001600160a01b039061013782600054163314610abb565b1673ffffffffffffffffffffffffffffffffffffffff196002541617600255600080f35b60009103126100fd57565b346100fd5760003660031901126100fd5760206001600160a01b0360025416604051908152f35b346100fd5760003660031901126100fd576020600354604051908152f35b346100fd576000806003193601126102165780805473ffffffffffffffffffffffffffffffffffffffff196001600160a01b038216916101ec338414610abb565b1682557f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b346100fd5760203660031901126100fd576102406001600160a01b03600054163314610abb565b600435600355005b346100fd576040806003193601126100fd5767ffffffffffffffff6024358181116100fd57366023820112156100fd5780600401359182116100fd57602481019060248336920101116100fd578251632cc27dc960e11b8152600480359082015283816024817f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165afa90811561037d57600091610350575b506102f53684846106c1565b602081519101200361030d5761030b9250610f41565b005b6064835162461bcd60e51b815260206004820152602060248201527f6661696c656420746f206f70656e206f757470757420636f6d6d69746d656e746044820152fd5b908482813d8311610376575b610366818361044d565b81010312610216575051386102e9565b503d61035c565b610c9e565b6024359067ffffffffffffffff821682036100fd57565b359067ffffffffffffffff821682036100fd57565b634e487b7160e01b600052604160045260246000fd5b6060810190811067ffffffffffffffff8211176103e057604052565b6103ae565b60a0810190811067ffffffffffffffff8211176103e057604052565b6080810190811067ffffffffffffffff8211176103e057604052565b67ffffffffffffffff81116103e057604052565b6040810190811067ffffffffffffffff8211176103e057604052565b90601f8019910116810190811067ffffffffffffffff8211176103e057604052565b67ffffffffffffffff81116103e05760051b60200190565b81601f820112156100fd5780359061049e8261046f565b926040926104ae8451958661044d565b8085526020918280870192600a1b850101938185116100fd578301915b8483106104db5750505050505090565b61040080848403126100fd578651906104f3826103c4565b6104fc85610399565b8252610509868601610399565b8683015283605f860112156100fd57875190610524826103e5565b8501818582116100fd579187939194928a8801905b8682106105565750506104009450898201528152019201916104cb565b908092949693955087039060c082126100fd578b5190610575826103c4565b60808093126100fd578c519161058a83610401565b843560ff811681036100fd5760c0948f948e956105d69382526105ae878a01610399565b8783015280890135906105c0826100ec565b8201526060808901359082015283528601610399565b838201528d60a0860135908201528152019101889492959391610539565b81601f820112156100fd5780359061060b8261046f565b9260409061061b8251958661044d565b838552602091828601918360a0809702860101948186116100fd578401925b85841061064b575050505050505090565b86848303126100fd578487918451610662816103e5565b8635815282870135610673816100ec565b838201528587013586820152606080880135908201526080610696818901610399565b9082015281520193019261063a565b67ffffffffffffffff81116103e057601f01601f191660200190565b9291926106cd826106a5565b916106db604051938461044d565b8294818452818301116100fd578281602093846000960137010152565b81601f820112156100fd5780359061070f8261046f565b9260409261071f8451958661044d565b808552602093848087019260051b850101938385116100fd57858101925b85841061074e575050505050505090565b67ffffffffffffffff9084358281116100fd5783019060a09283601f19848a0301126100fd57855192610780846103e5565b8a8101358452868101358b85015260609461079c868301610399565b888601526080956107ae878401610399565b908601528101359182116100fd57019187603f840112156100fd5789936107dd898589888098013591016106c1565b9082015281520193019261073d565b346100fd576003196060368201126100fd57610806610382565b6044359067ffffffffffffffff928383116100fd5760809083360301126100fd576040519061083482610401565b8260040135825260248301358481116100fd576108579060043691860101610487565b602083015260448301358481116100fd5761087890600436918601016105f4565b604083015260648301359384116100fd5761089f6108ac9360046108be96369201016106f8565b6060830152600435610caa565b60405190151581529081906020820190565b0390f35b346100fd5760003660031901126100fd5760206001600160a01b0360005416604051908152f35b346100fd5760003660031901126100fd57602062ffffff60015460a01c16604051908152f35b346100fd5760403660031901126100fd5760043561092c816100ec565b60243562ffffff811681036100fd577fffffffffffffffffff00000000000000000000000000000000000000000000006001600160a01b0361097381600054163314610abb565b76ffffff00000000000000000000000000000000000000006001549360a01b16931691161717600155600080f35b346100fd5760003660031901126100fd5760206040516001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168152f35b346100fd5760203660031901126100fd57600435610a02816100ec565b6001600160a01b03610a1981600054163314610abb565b811615610a295761030b90610b06565b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b346100fd5760003660031901126100fd5760206001600160a01b0360015416604051908152f35b15610ac257565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b600054906001600160a01b03809116918273ffffffffffffffffffffffffffffffffffffffff19821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b90815180825260208080930193019160005b828110610b7b575050505090565b835180518652808301516001600160a01b031686840152604080820151908701526060808201519087015260809081015167ffffffffffffffff169086015260a09094019392810192600101610b6d565b919082519283825260005b848110610bf8575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610bd7565b90815180825260208092019182818360051b85019501936000915b848310610c375750505050505090565b9091929394958480610c8e83856001950387528a5180518252838101518483015267ffffffffffffffff6040818184015116908401526060908183015116908301526080809101519160a080928201520190610bcc565b9801930193019194939290610c27565b6040513d6000823e3d90fd5b916001600160a01b0390817f00000000000000000000000000000000000000000000000000000000000000001691823b156100fd57929391906040948551958694631f022a9d60e21b8652600486015267ffffffffffffffff809216602486015260609081604487015260e486019284516064880152602093848601519460808060848b01528651809352816101048b0197019360009b8c925b858410610db6575050505050505092859392610d8892610d7686958401519260631993848883030160a4890152610b5b565b920151908483030160c4850152610c0c565b03915afa801561037d57610d9d575b50600190565b80610daa610db09261041d565b8061015b565b38610d97565b9193869a9b9c508d8882989b939597999a9b518781511685528784820151168486015201518a84019091905b8b8d60058410610e0d575050505050610400600192019a019401918d9b9a9998979694959391610d44565b9160c091859693600195965190808d83519060ff82511687528882015116888701528d8582015116858701520151908401528b85820151168a840152015160a082015201930191018892610de2565b634e487b7160e01b600052601160045260246000fd5b906001600160f81b038092169160148302169180830460141490151715610e9557565b610e5c565b906001600160f81b038092169160328302169180830460321490151715610e9557565b906001600160f81b0380921691604b83021691808304604b1490151715610e9557565b906001600160f81b0380921691605a83021691808304605a1490151715610e9557565b908160209103126100fd5751610f18816100ec565b90565b62ffffff16604d8111610e9557600a0a90565b81810292918115918404141715610e9557565b90610f4b91611399565b91926001600160f81b039260009284166a52b7d2dcc80cd2e40000008111156111245750610f8e919250610f7e90610ee0565b6001600160f81b03606491160490565b905b600092821680611008575b50604080516fffffffffffffffffffffffffffffffff909516855262ffffff90911660208501526001600160f81b03909116908301526001600160a01b0316907fab5fbf0441b04b7a6b969c24bbf1821c6ec51adaa0bd99ceec902fb0fc2a2f499080606081015b0390a2565b909261102b61101f6002546001600160a01b031690565b6001600160a01b031690565b60405163bf60c31d60e01b81526fffffffffffffffffffffffffffffffff871660048201529390602090859060249082905afa94851561037d577fab5fbf0441b04b7a6b969c24bbf1821c6ec51adaa0bd99ceec902fb0fc2a2f49956001600160a01b039561100394916110f6575b50809486918281166110b4575b5050509294509250610f9b565b6110ee926110e76110d9600154946110d362ffffff8760a01c16610f1b565b90610f2e565b670de0b6b3a7640000900490565b921661119c565b3880806110a7565b611117915060203d811161111d575b61110f818361044d565b810190610f03565b3861109a565b503d611105565b6a084595161401484a00000081111561114d5750611147919250610f7e90610ebd565b90610f90565b69d3c21bcecceda100000081111561116f5750611147919250610f7e90610e9a565b69152d02c7e14af680000010611186575b50610f90565b611195919250610f7e90610e72565b9038611180565b91604051916020938484019263a9059cbb60e01b84526001600160a01b0380931660248601526044850152604484526111d484610401565b1690604051926111e384610431565b8484527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656485850152823b156112565761122f939260009283809351925af1611229611325565b90611355565b8051908161123c57505050565b826112549361124f93830101910161129b565b6112b3565b565b60405162461bcd60e51b815260048101869052601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b908160209103126100fd575180151581036100fd5790565b156112ba57565b60405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608490fd5b3d15611350573d90611336826106a5565b91611344604051938461044d565b82523d6000602084013e565b606090565b90919015611361575090565b8151156113715750805190602001fd5b60405162461bcd60e51b815260206004820152908190611395906024830190610bcc565b0390fd5b90806013116100fd57601082013560e81c92816023116100fd57601383013560801c92826042116100fd57602381013560081c926061116100fd576042013560081c9056fea2646970667358221220d41d730b97f9991c289dd4891ba6b355fdd0710c66c234cf0b86e3ee34a3a81064736f6c63430008140033";

type FeeReimbursementAppConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FeeReimbursementAppConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FeeReimbursementApp__factory extends ContractFactory {
  constructor(...args: FeeReimbursementAppConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "FeeReimbursementApp";
  }

  deploy(
    _brevisProof: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FeeReimbursementApp> {
    return super.deploy(
      _brevisProof,
      overrides || {}
    ) as Promise<FeeReimbursementApp>;
  }
  getDeployTransaction(
    _brevisProof: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_brevisProof, overrides || {});
  }
  attach(address: string): FeeReimbursementApp {
    return super.attach(address) as FeeReimbursementApp;
  }
  connect(signer: Signer): FeeReimbursementApp__factory {
    return super.connect(signer) as FeeReimbursementApp__factory;
  }
  static readonly contractName: "FeeReimbursementApp";
  public readonly contractName: "FeeReimbursementApp";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FeeReimbursementAppInterface {
    return new utils.Interface(_abi) as FeeReimbursementAppInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FeeReimbursementApp {
    return new Contract(address, _abi, signerOrProvider) as FeeReimbursementApp;
  }
}
