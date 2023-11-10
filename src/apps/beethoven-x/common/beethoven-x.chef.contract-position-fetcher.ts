import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BeethovenXViemContractFactory } from '../contracts';
import { BeethovenXMasterchef } from '../contracts/viem';
import { BeethovenXMasterchefContract } from '../contracts/viem/BeethovenXMasterchef';

export abstract class BeethovenXChefContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<BeethovenXMasterchef> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXViemContractFactory) protected readonly contractFactory: BeethovenXViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.beethovenXMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: BeethovenXMasterchefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: BeethovenXMasterchefContract, poolIndex: number): Promise<string> {
    return contract.read.lpTokens([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(contract: BeethovenXMasterchefContract): Promise<string> {
    return contract.read.beets();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.read.beetsPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BeethovenXMasterchef>): Promise<BigNumberish> {
    return contract.read.pendingBeets([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
