import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { YieldYakViemContractFactory } from '../contracts';
import { YieldYakChef } from '../contracts/viem';

@PositionTemplate()
export class AvalancheYieldyakFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<YieldYakChef> {
  groupLabel = 'Farms';
  chefAddress = '0x0cf605484a512d3f3435fed77ab5ddc0525daf5f';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldYakViemContractFactory) private readonly contractFactory: YieldYakViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.yieldYakChef({ address, network: this.network });
  }

  async getPoolLength(contract: YieldYakChef) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: YieldYakChef, poolIndex: number) {
    return contract.read.poolInfo([poolIndex]).then(v => v.token);
  }

  async getRewardTokenAddress() {
    return ZERO_ADDRESS;
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.read.rewardsPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.read.pendingRewards([contractPosition.dataProps.poolIndex, address]);
  }
}
