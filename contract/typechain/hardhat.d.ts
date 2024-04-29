/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

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
      name: "IAccountModule",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccountModule__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "BrevisApp",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BrevisApp>;
    getContractAt(
      name: "IBrevisProof",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBrevisProof>;
    getContractAt(
      name: "Tx",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Tx>;
    getContractAt(
      name: "FeeReimbursementApp",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FeeReimbursementApp>;
    getContractAt(
      name: "IAccountModule",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccountModule>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
