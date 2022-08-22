import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefTemplateContractPositionFetcher } from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { YieldYakChef, YieldYakContractFactory } from '../contracts';
import { YIELD_YAK_DEFINITION } from '../yield-yak.definition';

const appId = YIELD_YAK_DEFINITION.id;
const groupId = YIELD_YAK_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheYieldyakFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<YieldYakChef> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0x0cf605484a512d3f3435fed77ab5ddc0525daf5f';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldYakContractFactory) private readonly contractFactory: YieldYakContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YieldYakChef {
    return this.contractFactory.yieldYakChef({ address, network: this.network });
  }

  async getPoolLength(contract: YieldYakChef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: YieldYakChef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.token);
  }

  async getRewardTokenAddress() {
    return ZERO_ADDRESS;
  }

  async getTotalAllocPoints(contract: YieldYakChef) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate(contract: YieldYakChef) {
    return contract.rewardsPerSecond();
  }

  async getPoolAllocPoints(contract: YieldYakChef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance(address: string, contract: YieldYakChef, poolIndex: number): Promise<BigNumberish> {
    return contract.userInfo(poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: YieldYakChef, poolIndex: number): Promise<BigNumberish> {
    return contract.pendingRewards(poolIndex, address);
  }
}
