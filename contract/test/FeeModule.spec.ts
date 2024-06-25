import { expect } from 'chai';
import { Fixture } from 'ethereum-waffle';
import { BigNumber, ContractTransaction, Wallet } from 'ethers';
import { ethers, waffle } from 'hardhat';
import {MockFeeModule} from '../typechain';

async function deployContracts(admin: Wallet) {
  const factory = await ethers.getContractFactory('MockFeeModule');
  return factory.connect(admin).deploy();
}


describe('MockFeeModule', async () => {
  function loadFixture<T>(fixture: Fixture<T>): Promise<T> {
    const provider = waffle.provider;
    return waffle.createFixtureLoader(provider.getWallets(), provider)(fixture);
  }

  async function fixture([admin]: Wallet[]) {
    const contract = await deployContracts(admin);
    return { admin, contract };
  }

  let contract: MockFeeModule;
  let admin: Wallet;
  beforeEach(async () => {
    const res = await loadFixture(fixture);
    contract = res.contract;
    admin = res.admin;
  });

  it('get fee rebate percentage based on volume', async () => {
    const volumes = ["1000000", "1000001", "10000000", "10000001", "100000000", "100000001", "1000000000", "1000000001"]
    const tiers = ["0", "5", "5", "10", "10", "20", "20", "30"]
    for (var i = 0; i < volumes.length; i++) {
        const volume = BigNumber.from(volumes[i]).mul(BigNumber.from("1000000000000000000"))
        const percentage = await contract.getFeeRebatePercentage(volume)
        expect(percentage).eql(BigNumber.from(tiers[i]), "")
    }

    const volume = BigNumber.from(volumes[2]).mul(BigNumber.from("1000000000000000000"))
    const percentage = await contract.getFeeRebatePercentage(volume)
    expect(percentage.toNumber()).gt(BigNumber.from(tiers[0]).toNumber())
  });

});
