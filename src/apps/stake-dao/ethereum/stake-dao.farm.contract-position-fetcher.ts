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

import { StakeDaoContractFactory, StakeDaoFarm } from '../contracts';

@PositionTemplate()
export class EthereumStakeDaoFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StakeDaoFarm> {
  chefAddress = '0xfea5e213bbd81a8a94d0e1edb09dbd7ceab61e1c';
  groupLabel = 'Farms';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoViemContractFactory) protected readonly contractFactory: StakeDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakeDaoFarm {
    return this.contractFactory.stakeDaoFarm({ address, network: this.network });
  }

  async getPoolLength(contract: StakeDaoFarm): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: StakeDaoFarm, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: StakeDaoFarm): Promise<string> {
    return contract.sdt();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.sdtPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.pendingSdt(contractPosition.dataProps.poolIndex, address);
  }
}
