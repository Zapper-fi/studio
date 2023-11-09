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

import { HakuswapViemContractFactory } from '../contracts';
import { HakuswapMasterchef } from '../contracts/viem';

@PositionTemplate()
export class AvalancheHakuswapFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<HakuswapMasterchef> {
  chefAddress = '0xba438a6f03c03fb1cf86567f6bb866ccfc9b2da7';
  groupLabel = 'Farms';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HakuswapViemContractFactory) private readonly contractFactory: HakuswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.hakuswapMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: HakuswapMasterchef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: HakuswapMasterchef, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: HakuswapMasterchef): Promise<string> {
    return contract.cake();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<HakuswapMasterchef>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<HakuswapMasterchef>) {
    return contract.cakePerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<HakuswapMasterchef>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<HakuswapMasterchef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<HakuswapMasterchef>): Promise<BigNumberish> {
    return contract.pendingCake(contractPosition.dataProps.poolIndex, address);
  }
}
