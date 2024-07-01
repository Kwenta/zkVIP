/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "BrevisApp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BrevisApp__factory>;
    getContractFactory(
      name: "IBrevisProof",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBrevisProof__factory>;
    getContractFactory(
      name: "Tx",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Tx__factory>;
    getContractFactory(
      name: "FeeReimbursementApp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FeeReimbursementApp__factory>;
    getContractFactory(
      name: "IFeeRebateTierModule",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFeeRebateTierModule__factory>;
    getContractFactory(
      name: "MockFeeModule",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockFeeModule__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "BrevisApp",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BrevisApp>;
    getContractAt(
      name: "IBrevisProof",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBrevisProof>;
    getContractAt(
      name: "Tx",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Tx>;
    getContractAt(
      name: "FeeReimbursementApp",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FeeReimbursementApp>;
    getContractAt(
      name: "IFeeRebateTierModule",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IFeeRebateTierModule>;
    getContractAt(
      name: "MockFeeModule",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MockFeeModule>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "BrevisApp",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BrevisApp>;
    deployContract(
      name: "IBrevisProof",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBrevisProof>;
    deployContract(
      name: "Tx",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Tx>;
    deployContract(
      name: "FeeReimbursementApp",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FeeReimbursementApp>;
    deployContract(
      name: "IFeeRebateTierModule",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFeeRebateTierModule>;
    deployContract(
      name: "MockFeeModule",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockFeeModule>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "BrevisApp",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BrevisApp>;
    deployContract(
      name: "IBrevisProof",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBrevisProof>;
    deployContract(
      name: "Tx",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Tx>;
    deployContract(
      name: "FeeReimbursementApp",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FeeReimbursementApp>;
    deployContract(
      name: "IFeeRebateTierModule",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFeeRebateTierModule>;
    deployContract(
      name: "MockFeeModule",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockFeeModule>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
