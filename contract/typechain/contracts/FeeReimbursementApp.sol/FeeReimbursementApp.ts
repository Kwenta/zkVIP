/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace Brevis {
  export type ProofDataStruct = {
    commitHash: BytesLike;
    vkHash: BytesLike;
    appCommitHash: BytesLike;
    appVkHash: BytesLike;
    smtRoot: BytesLike;
  };

  export type ProofDataStructOutput = [
    commitHash: string,
    vkHash: string,
    appCommitHash: string,
    appVkHash: string,
    smtRoot: string
  ] & {
    commitHash: string;
    vkHash: string;
    appCommitHash: string;
    appVkHash: string;
    smtRoot: string;
  };

  export type LogExtraInfoStruct = {
    valueFromTopic: BigNumberish;
    valueIndex: BigNumberish;
    contractAddress: AddressLike;
    logTopic0: BytesLike;
  };

  export type LogExtraInfoStructOutput = [
    valueFromTopic: bigint,
    valueIndex: bigint,
    contractAddress: string,
    logTopic0: string
  ] & {
    valueFromTopic: bigint;
    valueIndex: bigint;
    contractAddress: string;
    logTopic0: string;
  };

  export type LogInfoStruct = {
    logExtraInfo: Brevis.LogExtraInfoStruct;
    logIndex: BigNumberish;
    value: BytesLike;
  };

  export type LogInfoStructOutput = [
    logExtraInfo: Brevis.LogExtraInfoStructOutput,
    logIndex: bigint,
    value: string
  ] & {
    logExtraInfo: Brevis.LogExtraInfoStructOutput;
    logIndex: bigint;
    value: string;
  };

  export type ReceiptInfoStruct = {
    blkNum: BigNumberish;
    receiptIndex: BigNumberish;
    logs: [
      Brevis.LogInfoStruct,
      Brevis.LogInfoStruct,
      Brevis.LogInfoStruct,
      Brevis.LogInfoStruct,
      Brevis.LogInfoStruct
    ];
  };

  export type ReceiptInfoStructOutput = [
    blkNum: bigint,
    receiptIndex: bigint,
    logs: [
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput
    ]
  ] & {
    blkNum: bigint;
    receiptIndex: bigint;
    logs: [
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput
    ];
  };

  export type StorageInfoStruct = {
    blockHash: BytesLike;
    account: AddressLike;
    slot: BytesLike;
    slotValue: BytesLike;
    blockNumber: BigNumberish;
  };

  export type StorageInfoStructOutput = [
    blockHash: string,
    account: string,
    slot: string,
    slotValue: string,
    blockNumber: bigint
  ] & {
    blockHash: string;
    account: string;
    slot: string;
    slotValue: string;
    blockNumber: bigint;
  };

  export type TransactionInfoStruct = {
    leafHash: BytesLike;
    blockHash: BytesLike;
    blockNumber: BigNumberish;
    blockTime: BigNumberish;
    leafRlpPrefix: BytesLike;
  };

  export type TransactionInfoStructOutput = [
    leafHash: string,
    blockHash: string,
    blockNumber: bigint,
    blockTime: bigint,
    leafRlpPrefix: string
  ] & {
    leafHash: string;
    blockHash: string;
    blockNumber: bigint;
    blockTime: bigint;
    leafRlpPrefix: string;
  };

  export type ExtractInfosStruct = {
    smtRoot: BytesLike;
    receipts: Brevis.ReceiptInfoStruct[];
    stores: Brevis.StorageInfoStruct[];
    txs: Brevis.TransactionInfoStruct[];
  };

  export type ExtractInfosStructOutput = [
    smtRoot: string,
    receipts: Brevis.ReceiptInfoStructOutput[],
    stores: Brevis.StorageInfoStructOutput[],
    txs: Brevis.TransactionInfoStructOutput[]
  ] & {
    smtRoot: string;
    receipts: Brevis.ReceiptInfoStructOutput[];
    stores: Brevis.StorageInfoStructOutput[];
    txs: Brevis.TransactionInfoStructOutput[];
  };
}

export interface FeeReimbursementAppInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "accountAccumulatedFee"
      | "accountClaimPeriod"
      | "brevisBatchCallback"
      | "brevisCallback"
      | "brevisProof"
      | "claim"
      | "claimer"
      | "contractsHash"
      | "factory"
      | "feeRebateTierModule"
      | "migrate"
      | "migrationContract"
      | "owner"
      | "renounceOwnership"
      | "rewardToken"
      | "rewardTokenDecimals"
      | "setBrevisProof"
      | "setClaimer"
      | "setContractsHash"
      | "setFeeRebateTierModule"
      | "setMigrationFinished"
      | "setRewardToken"
      | "setVkHashes"
      | "singleRun"
      | "transferOwnership"
      | "validateRequest"
      | "vkHashesToCircuitSize"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "BrevisProofUpdated"
      | "ClaimerUpdated"
      | "ContractsHashUpdated"
      | "FeeRebateAccumulated"
      | "FeeRebateTireModuleUpdated"
      | "FeeReimbursed"
      | "MigrationDone"
      | "MigrationFinishedForAccount"
      | "OwnershipTransferred"
      | "VkHashesUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "accountAccumulatedFee",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "accountClaimPeriod",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "brevisBatchCallback",
    values: [BigNumberish, Brevis.ProofDataStruct[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "brevisCallback",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "brevisProof",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claim", values: [AddressLike]): string;
  encodeFunctionData(functionFragment: "claimer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "contractsHash",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "feeRebateTierModule",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "migrate",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "migrationContract",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardTokenDecimals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setBrevisProof",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setClaimer",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setContractsHash",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeRebateTierModule",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setMigrationFinished",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardToken",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setVkHashes",
    values: [BytesLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "singleRun",
    values: [
      BigNumberish,
      Brevis.ProofDataStruct,
      BytesLike,
      BytesLike[],
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateRequest",
    values: [BytesLike, BigNumberish, Brevis.ExtractInfosStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "vkHashesToCircuitSize",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "accountAccumulatedFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "accountClaimPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "brevisBatchCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "brevisCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "brevisProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractsHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "feeRebateTierModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "migrate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "migrationContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardTokenDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBrevisProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setClaimer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setContractsHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeRebateTierModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMigrationFinished",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setVkHashes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "singleRun", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vkHashesToCircuitSize",
    data: BytesLike
  ): Result;
}

export namespace BrevisProofUpdatedEvent {
  export type InputTuple = [arg0: AddressLike];
  export type OutputTuple = [arg0: string];
  export interface OutputObject {
    arg0: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ClaimerUpdatedEvent {
  export type InputTuple = [arg0: AddressLike];
  export type OutputTuple = [arg0: string];
  export interface OutputObject {
    arg0: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ContractsHashUpdatedEvent {
  export type InputTuple = [arg0: BigNumberish];
  export type OutputTuple = [arg0: bigint];
  export interface OutputObject {
    arg0: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FeeRebateAccumulatedEvent {
  export type InputTuple = [
    account: AddressLike,
    feeRebate: BigNumberish,
    volume30D: BigNumberish,
    feeRebateWithRate: BigNumberish,
    startBlockNumber: BigNumberish,
    endBlockNumber: BigNumberish
  ];
  export type OutputTuple = [
    account: string,
    feeRebate: bigint,
    volume30D: bigint,
    feeRebateWithRate: bigint,
    startBlockNumber: bigint,
    endBlockNumber: bigint
  ];
  export interface OutputObject {
    account: string;
    feeRebate: bigint;
    volume30D: bigint;
    feeRebateWithRate: bigint;
    startBlockNumber: bigint;
    endBlockNumber: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FeeRebateTireModuleUpdatedEvent {
  export type InputTuple = [arg0: AddressLike];
  export type OutputTuple = [arg0: string];
  export interface OutputObject {
    arg0: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FeeReimbursedEvent {
  export type InputTuple = [account: AddressLike, feeRebate: BigNumberish];
  export type OutputTuple = [account: string, feeRebate: bigint];
  export interface OutputObject {
    account: string;
    feeRebate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MigrationDoneEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MigrationFinishedForAccountEvent {
  export type InputTuple = [
    account: AddressLike,
    feeAccumulated: BigNumberish,
    startBlockNumber: BigNumberish,
    endBlockNumber: BigNumberish
  ];
  export type OutputTuple = [
    account: string,
    feeAccumulated: bigint,
    startBlockNumber: bigint,
    endBlockNumber: bigint
  ];
  export interface OutputObject {
    account: string;
    feeAccumulated: bigint;
    startBlockNumber: bigint;
    endBlockNumber: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace VkHashesUpdatedEvent {
  export type InputTuple = [vkHashes: BytesLike[], sizes: BigNumberish[]];
  export type OutputTuple = [vkHashes: string[], sizes: bigint[]];
  export interface OutputObject {
    vkHashes: string[];
    sizes: bigint[];
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface FeeReimbursementApp extends BaseContract {
  connect(runner?: ContractRunner | null): FeeReimbursementApp;
  waitForDeployment(): Promise<this>;

  interface: FeeReimbursementAppInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  accountAccumulatedFee: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  accountClaimPeriod: TypedContractMethod<
    [arg0: AddressLike],
    [[bigint, bigint] & { startBlockNumber: bigint; endBlockNumber: bigint }],
    "view"
  >;

  brevisBatchCallback: TypedContractMethod<
    [
      _chainId: BigNumberish,
      _proofDataArray: Brevis.ProofDataStruct[],
      _appCircuitOutputs: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;

  brevisCallback: TypedContractMethod<
    [_requestId: BytesLike, _appCircuitOutput: BytesLike],
    [void],
    "nonpayable"
  >;

  brevisProof: TypedContractMethod<[], [string], "view">;

  claim: TypedContractMethod<[account: AddressLike], [void], "nonpayable">;

  claimer: TypedContractMethod<[], [string], "view">;

  contractsHash: TypedContractMethod<[], [bigint], "view">;

  factory: TypedContractMethod<[], [string], "view">;

  feeRebateTierModule: TypedContractMethod<[], [string], "view">;

  migrate: TypedContractMethod<
    [_accounts: AddressLike[]],
    [void],
    "nonpayable"
  >;

  migrationContract: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  rewardToken: TypedContractMethod<[], [string], "view">;

  rewardTokenDecimals: TypedContractMethod<[], [bigint], "view">;

  setBrevisProof: TypedContractMethod<
    [_brevisProof: AddressLike],
    [void],
    "nonpayable"
  >;

  setClaimer: TypedContractMethod<
    [_claimer: AddressLike],
    [void],
    "nonpayable"
  >;

  setContractsHash: TypedContractMethod<
    [_contractsHash: BigNumberish],
    [void],
    "nonpayable"
  >;

  setFeeRebateTierModule: TypedContractMethod<
    [_feeRebateTierModule: AddressLike],
    [void],
    "nonpayable"
  >;

  setMigrationFinished: TypedContractMethod<[], [void], "nonpayable">;

  setRewardToken: TypedContractMethod<
    [_rewardToken: AddressLike, _decimals: BigNumberish],
    [void],
    "nonpayable"
  >;

  setVkHashes: TypedContractMethod<
    [_vkHashes: BytesLike[], _sizes: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  singleRun: TypedContractMethod<
    [
      _chainId: BigNumberish,
      _proofData: Brevis.ProofDataStruct,
      _merkleRoot: BytesLike,
      _merkleProof: BytesLike[],
      _nodeIndex: BigNumberish,
      _appCircuitOutput: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  validateRequest: TypedContractMethod<
    [
      _requestId: BytesLike,
      _chainId: BigNumberish,
      _extractInfos: Brevis.ExtractInfosStruct
    ],
    [boolean],
    "view"
  >;

  vkHashesToCircuitSize: TypedContractMethod<
    [arg0: BytesLike],
    [bigint],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "accountAccumulatedFee"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "accountClaimPeriod"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [[bigint, bigint] & { startBlockNumber: bigint; endBlockNumber: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "brevisBatchCallback"
  ): TypedContractMethod<
    [
      _chainId: BigNumberish,
      _proofDataArray: Brevis.ProofDataStruct[],
      _appCircuitOutputs: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "brevisCallback"
  ): TypedContractMethod<
    [_requestId: BytesLike, _appCircuitOutput: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "brevisProof"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "claim"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "claimer"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "contractsHash"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "factory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "feeRebateTierModule"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "migrate"
  ): TypedContractMethod<[_accounts: AddressLike[]], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrationContract"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rewardToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rewardTokenDecimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "setBrevisProof"
  ): TypedContractMethod<[_brevisProof: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setClaimer"
  ): TypedContractMethod<[_claimer: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setContractsHash"
  ): TypedContractMethod<[_contractsHash: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setFeeRebateTierModule"
  ): TypedContractMethod<
    [_feeRebateTierModule: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setMigrationFinished"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setRewardToken"
  ): TypedContractMethod<
    [_rewardToken: AddressLike, _decimals: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setVkHashes"
  ): TypedContractMethod<
    [_vkHashes: BytesLike[], _sizes: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "singleRun"
  ): TypedContractMethod<
    [
      _chainId: BigNumberish,
      _proofData: Brevis.ProofDataStruct,
      _merkleRoot: BytesLike,
      _merkleProof: BytesLike[],
      _nodeIndex: BigNumberish,
      _appCircuitOutput: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validateRequest"
  ): TypedContractMethod<
    [
      _requestId: BytesLike,
      _chainId: BigNumberish,
      _extractInfos: Brevis.ExtractInfosStruct
    ],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "vkHashesToCircuitSize"
  ): TypedContractMethod<[arg0: BytesLike], [bigint], "view">;

  getEvent(
    key: "BrevisProofUpdated"
  ): TypedContractEvent<
    BrevisProofUpdatedEvent.InputTuple,
    BrevisProofUpdatedEvent.OutputTuple,
    BrevisProofUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "ClaimerUpdated"
  ): TypedContractEvent<
    ClaimerUpdatedEvent.InputTuple,
    ClaimerUpdatedEvent.OutputTuple,
    ClaimerUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "ContractsHashUpdated"
  ): TypedContractEvent<
    ContractsHashUpdatedEvent.InputTuple,
    ContractsHashUpdatedEvent.OutputTuple,
    ContractsHashUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "FeeRebateAccumulated"
  ): TypedContractEvent<
    FeeRebateAccumulatedEvent.InputTuple,
    FeeRebateAccumulatedEvent.OutputTuple,
    FeeRebateAccumulatedEvent.OutputObject
  >;
  getEvent(
    key: "FeeRebateTireModuleUpdated"
  ): TypedContractEvent<
    FeeRebateTireModuleUpdatedEvent.InputTuple,
    FeeRebateTireModuleUpdatedEvent.OutputTuple,
    FeeRebateTireModuleUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "FeeReimbursed"
  ): TypedContractEvent<
    FeeReimbursedEvent.InputTuple,
    FeeReimbursedEvent.OutputTuple,
    FeeReimbursedEvent.OutputObject
  >;
  getEvent(
    key: "MigrationDone"
  ): TypedContractEvent<
    MigrationDoneEvent.InputTuple,
    MigrationDoneEvent.OutputTuple,
    MigrationDoneEvent.OutputObject
  >;
  getEvent(
    key: "MigrationFinishedForAccount"
  ): TypedContractEvent<
    MigrationFinishedForAccountEvent.InputTuple,
    MigrationFinishedForAccountEvent.OutputTuple,
    MigrationFinishedForAccountEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "VkHashesUpdated"
  ): TypedContractEvent<
    VkHashesUpdatedEvent.InputTuple,
    VkHashesUpdatedEvent.OutputTuple,
    VkHashesUpdatedEvent.OutputObject
  >;

  filters: {
    "BrevisProofUpdated(address)": TypedContractEvent<
      BrevisProofUpdatedEvent.InputTuple,
      BrevisProofUpdatedEvent.OutputTuple,
      BrevisProofUpdatedEvent.OutputObject
    >;
    BrevisProofUpdated: TypedContractEvent<
      BrevisProofUpdatedEvent.InputTuple,
      BrevisProofUpdatedEvent.OutputTuple,
      BrevisProofUpdatedEvent.OutputObject
    >;

    "ClaimerUpdated(address)": TypedContractEvent<
      ClaimerUpdatedEvent.InputTuple,
      ClaimerUpdatedEvent.OutputTuple,
      ClaimerUpdatedEvent.OutputObject
    >;
    ClaimerUpdated: TypedContractEvent<
      ClaimerUpdatedEvent.InputTuple,
      ClaimerUpdatedEvent.OutputTuple,
      ClaimerUpdatedEvent.OutputObject
    >;

    "ContractsHashUpdated(uint256)": TypedContractEvent<
      ContractsHashUpdatedEvent.InputTuple,
      ContractsHashUpdatedEvent.OutputTuple,
      ContractsHashUpdatedEvent.OutputObject
    >;
    ContractsHashUpdated: TypedContractEvent<
      ContractsHashUpdatedEvent.InputTuple,
      ContractsHashUpdatedEvent.OutputTuple,
      ContractsHashUpdatedEvent.OutputObject
    >;

    "FeeRebateAccumulated(address,uint248,uint248,uint248,uint64,uint64)": TypedContractEvent<
      FeeRebateAccumulatedEvent.InputTuple,
      FeeRebateAccumulatedEvent.OutputTuple,
      FeeRebateAccumulatedEvent.OutputObject
    >;
    FeeRebateAccumulated: TypedContractEvent<
      FeeRebateAccumulatedEvent.InputTuple,
      FeeRebateAccumulatedEvent.OutputTuple,
      FeeRebateAccumulatedEvent.OutputObject
    >;

    "FeeRebateTireModuleUpdated(address)": TypedContractEvent<
      FeeRebateTireModuleUpdatedEvent.InputTuple,
      FeeRebateTireModuleUpdatedEvent.OutputTuple,
      FeeRebateTireModuleUpdatedEvent.OutputObject
    >;
    FeeRebateTireModuleUpdated: TypedContractEvent<
      FeeRebateTireModuleUpdatedEvent.InputTuple,
      FeeRebateTireModuleUpdatedEvent.OutputTuple,
      FeeRebateTireModuleUpdatedEvent.OutputObject
    >;

    "FeeReimbursed(address,uint248)": TypedContractEvent<
      FeeReimbursedEvent.InputTuple,
      FeeReimbursedEvent.OutputTuple,
      FeeReimbursedEvent.OutputObject
    >;
    FeeReimbursed: TypedContractEvent<
      FeeReimbursedEvent.InputTuple,
      FeeReimbursedEvent.OutputTuple,
      FeeReimbursedEvent.OutputObject
    >;

    "MigrationDone()": TypedContractEvent<
      MigrationDoneEvent.InputTuple,
      MigrationDoneEvent.OutputTuple,
      MigrationDoneEvent.OutputObject
    >;
    MigrationDone: TypedContractEvent<
      MigrationDoneEvent.InputTuple,
      MigrationDoneEvent.OutputTuple,
      MigrationDoneEvent.OutputObject
    >;

    "MigrationFinishedForAccount(address,uint248,uint64,uint64)": TypedContractEvent<
      MigrationFinishedForAccountEvent.InputTuple,
      MigrationFinishedForAccountEvent.OutputTuple,
      MigrationFinishedForAccountEvent.OutputObject
    >;
    MigrationFinishedForAccount: TypedContractEvent<
      MigrationFinishedForAccountEvent.InputTuple,
      MigrationFinishedForAccountEvent.OutputTuple,
      MigrationFinishedForAccountEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "VkHashesUpdated(bytes32[],uint16[])": TypedContractEvent<
      VkHashesUpdatedEvent.InputTuple,
      VkHashesUpdatedEvent.OutputTuple,
      VkHashesUpdatedEvent.OutputObject
    >;
    VkHashesUpdated: TypedContractEvent<
      VkHashesUpdatedEvent.InputTuple,
      VkHashesUpdatedEvent.OutputTuple,
      VkHashesUpdatedEvent.OutputObject
    >;
  };
}
