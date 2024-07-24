import * as dotenv from 'dotenv';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verify } from './utils';

dotenv.config();

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ["0xB876cc05c3C3C8ECBA65dAc4CF69CaF871F2e0DD", "0x1345c8a6b99536531f1fa3cfe37d8a5b7fc859aa"];
  const deployment = await deploy('FeeReimbursementApp', {
    from: deployer,
    log: true,
    args: args
  });
  await verify(hre, deployment, args);
};

deployFunc.tags = ['FeeReimbursementApp'];
deployFunc.dependencies = [];
export default deployFunc;
