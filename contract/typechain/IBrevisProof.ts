/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace Brevis {
  export type ProofDataStruct = {
    commitHash: BytesLike;
    length: BigNumberish;
    vkHash: BytesLike;
    appCommitHash: BytesLike;
    appVkHash: BytesLike;
    smtRoot: BytesLike;
  };

  export type ProofDataStructOutput = [
    string,
    BigNumber,
    string,
    string,
    string,
    string
  ] & {
    commitHash: string;
    length: BigNumber;
    vkHash: string;
    appCommitHash: string;
    appVkHash: string;
    smtRoot: string;
  };

  export type LogExtraInfoStruct = {
    valueFromTopic: BigNumberish;
    valueIndex: BigNumberish;
    contractAddress: string;
    logTopic0: BytesLike;
  };

  export type LogExtraInfoStructOutput = [number, BigNumber, string, string] & {
    valueFromTopic: number;
    valueIndex: BigNumber;
    contractAddress: string;
    logTopic0: string;
  };

  export type LogInfoStruct = {
    logExtraInfo: Brevis.LogExtraInfoStruct;
    logIndex: BigNumberish;
    value: BytesLike;
  };

  export type LogInfoStructOutput = [
    Brevis.LogExtraInfoStructOutput,
    BigNumber,
    string
  ] & {
    logExtraInfo: Brevis.LogExtraInfoStructOutput;
    logIndex: BigNumber;
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
    BigNumber,
    BigNumber,
    [
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput,
      Brevis.LogInfoStructOutput
    ]
  ] & {
    blkNum: BigNumber;
    receiptIndex: BigNumber;
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
    account: string;
    slot: BytesLike;
    slotValue: BytesLike;
    blockNumber: BigNumberish;
  };

  export type StorageInfoStructOutput = [
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    blockHash: string;
    account: string;
    slot: string;
    slotValue: string;
    blockNumber: BigNumber;
  };

  export type TransactionInfoStruct = {
    leafHash: BytesLike;
    blockHash: BytesLike;
    blockNumber: BigNumberish;
    blockTime: BigNumberish;
    leafRlpPrefix: BytesLike;
  };

  export type TransactionInfoStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    string
  ] & {
    leafHash: string;
    blockHash: string;
    blockNumber: BigNumber;
    blockTime: BigNumber;
    leafRlpPrefix: string;
  };

  export type ExtractInfosStruct = {
    smtRoot: BytesLike;
    receipts: Brevis.ReceiptInfoStruct[];
    stores: Brevis.StorageInfoStruct[];
    txs: Brevis.TransactionInfoStruct[];
  };

  export type ExtractInfosStructOutput = [
    string,
    Brevis.ReceiptInfoStructOutput[],
    Brevis.StorageInfoStructOutput[],
    Brevis.TransactionInfoStructOutput[]
  ] & {
    smtRoot: string;
    receipts: Brevis.ReceiptInfoStructOutput[];
    stores: Brevis.StorageInfoStructOutput[];
    txs: Brevis.TransactionInfoStructOutput[];
  };
}

export interface IBrevisProofInterface extends utils.Interface {
  contractName: "IBrevisProof";
  functions: {
    "getProofAppData(bytes32)": FunctionFragment;
    "getProofData(bytes32)": FunctionFragment;
    "hasProof(bytes32)": FunctionFragment;
    "submitProof(uint64,bytes,bool)": FunctionFragment;
    "validateRequest(bytes32,uint64,(bytes32,(uint64,uint64,tuple[5])[],(bytes32,address,bytes32,bytes32,uint64)[],(bytes32,bytes32,uint64,uint64,bytes)[]))": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getProofAppData",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getProofData",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "hasProof", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "submitProof",
    values: [BigNumberish, BytesLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "validateRequest",
    values: [BytesLike, BigNumberish, Brevis.ExtractInfosStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "getProofAppData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProofData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasProof", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "submitProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateRequest",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IBrevisProof extends BaseContract {
  contractName: "IBrevisProof";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IBrevisProofInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getProofAppData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, string]>;

    getProofData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[Brevis.ProofDataStructOutput]>;

    hasProof(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    submitProof(
      _chainId: BigNumberish,
      _proofWithPubInputs: BytesLike,
      _withAppProof: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validateRequest(
      _requestId: BytesLike,
      _chainId: BigNumberish,
      _info: Brevis.ExtractInfosStruct,
      overrides?: CallOverrides
    ): Promise<[void]>;
  };

  getProofAppData(
    _requestId: BytesLike,
    overrides?: CallOverrides
  ): Promise<[string, string]>;

  getProofData(
    _requestId: BytesLike,
    overrides?: CallOverrides
  ): Promise<Brevis.ProofDataStructOutput>;

  hasProof(_requestId: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  submitProof(
    _chainId: BigNumberish,
    _proofWithPubInputs: BytesLike,
    _withAppProof: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validateRequest(
    _requestId: BytesLike,
    _chainId: BigNumberish,
    _info: Brevis.ExtractInfosStruct,
    overrides?: CallOverrides
  ): Promise<void>;

  callStatic: {
    getProofAppData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, string]>;

    getProofData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<Brevis.ProofDataStructOutput>;

    hasProof(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    submitProof(
      _chainId: BigNumberish,
      _proofWithPubInputs: BytesLike,
      _withAppProof: boolean,
      overrides?: CallOverrides
    ): Promise<string>;

    validateRequest(
      _requestId: BytesLike,
      _chainId: BigNumberish,
      _info: Brevis.ExtractInfosStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getProofAppData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProofData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasProof(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    submitProof(
      _chainId: BigNumberish,
      _proofWithPubInputs: BytesLike,
      _withAppProof: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validateRequest(
      _requestId: BytesLike,
      _chainId: BigNumberish,
      _info: Brevis.ExtractInfosStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getProofAppData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProofData(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasProof(
      _requestId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    submitProof(
      _chainId: BigNumberish,
      _proofWithPubInputs: BytesLike,
      _withAppProof: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validateRequest(
      _requestId: BytesLike,
      _chainId: BigNumberish,
      _info: Brevis.ExtractInfosStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
