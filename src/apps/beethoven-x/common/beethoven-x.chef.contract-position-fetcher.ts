import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BeethovenXContractFactory, BeethovenXMasterchef } from '../contracts';

export abstract class BeethovenXChefContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<BeethovenXMasterchef> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory) protected readonly contractFactory: BeethovenXContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BeethovenXMasterchef {
    return this.contractFactory.beethovenXMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: BeethovenXMasterchef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: BeethovenXMasterchef, poolIndex: number): Promise<string> {
    return contract.lpTokens(poolIndex);
  }

  async getRewardTokenAddress(contract: BeethovenXMasterchef): Promise<string> {
    return contract.beets();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.beetsPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.pendingBeets(contractPosition.dataProps.poolIndex, address);
  }
}
