import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { RadiantCapitalViemContractFactory } from '../contracts';
import { RadiantCapitalStaking } from '../contracts/viem';
import { RadiantCapitalStakingContract } from '../contracts/viem/RadiantCapitalStaking';

@PositionTemplate()
export class ArbitrumRadiantCapitalStakingContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<RadiantCapitalStaking> {
  groupLabel = 'Staking';
  chefAddress = '0xc963ef7d977ecb0ab71d835c4cb1bf737f28d010';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RadiantCapitalViemContractFactory) protected readonly contractFactory: RadiantCapitalViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.radiantCapitalStaking({ address, network: this.network });
  }

  async getPoolLength(contract: RadiantCapitalStakingContract): Promise<BigNumberish> {
    const numPools = await contract.read.poolLength();
    return Number(numPools) - 1; // Last index is a testing pool
  }

  async getStakedTokenAddress(contract: RadiantCapitalStakingContract, poolIndex: number): Promise<string> {
    return contract.read.registeredTokens([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(): Promise<string> {
    return '0x0c4681e6c0235179ec3d4f4fc4df3d14fdd96017';
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<RadiantCapitalStaking>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<RadiantCapitalStaking>): Promise<BigNumberish> {
    return contract.read.rewardsPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<RadiantCapitalStaking>): Promise<BigNumberish> {
    return contract.read.poolInfo([definition.address]).then(v => v[0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<RadiantCapitalStaking>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.tokens[0].address, address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<RadiantCapitalStaking>): Promise<BigNumberish> {
    const claimableRewards = await contract.read.claimableReward([address, [contractPosition.tokens[0].address]]);

    return claimableRewards[0];
  }
}
