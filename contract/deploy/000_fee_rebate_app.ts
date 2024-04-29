import * as dotenv from 'dotenv';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verify } from './utils';

dotenv.config();

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ["0x320039A33Bf6D30f1FcF26A87f975eCDC7c15caA"];
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
