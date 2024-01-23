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

import { StakeDaoViemContractFactory } from '../contracts';
import { StakeDaoFarm } from '../contracts/viem';
import { StakeDaoFarmContract } from '../contracts/viem/StakeDaoFarm';

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

  getContract(address: string) {
    return this.contractFactory.stakeDaoFarm({ address, network: this.network });
  }

  async getPoolLength(contract: StakeDaoFarmContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: StakeDaoFarmContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: StakeDaoFarmContract): Promise<string> {
    return contract.read.sdt();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.read.sdtPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StakeDaoFarm>): Promise<BigNumberish> {
    return contract.read.pendingSdt([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
