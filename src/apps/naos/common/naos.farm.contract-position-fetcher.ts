import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { NaosContractFactory, NaosStakingPools } from '../contracts';

export abstract class NaosFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<NaosStakingPools> {
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(NaosContractFactory) protected readonly contractFactory: NaosContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): NaosStakingPools {
    return this.contractFactory.naosStakingPools({ address, network: this.network });
  }

  async getPoolLength(contract: NaosStakingPools): Promise<BigNumberish> {
    return contract.poolCount();
  }

  async getStakedTokenAddress(contract: NaosStakingPools, poolIndex: number): Promise<string> {
    return contract.getPoolToken(poolIndex);
  }

  async getRewardTokenAddress(contract: NaosStakingPools): Promise<string> {
    return contract.reward();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<NaosStakingPools>): Promise<BigNumberish> {
    return contract.totalRewardWeight();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<NaosStakingPools>): Promise<BigNumberish> {
    return contract.rewardRate();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<NaosStakingPools>): Promise<BigNumberish> {
    return contract.getPoolRewardWeight(definition.poolIndex);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<NaosStakingPools>): Promise<BigNumberish> {
    return contract.getStakeTotalDeposited(address, contractPosition.dataProps.poolIndex);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<NaosStakingPools>): Promise<BigNumberish> {
    return contract.getStakeTotalUnclaimed(address, contractPosition.dataProps.poolIndex);
  }
}
