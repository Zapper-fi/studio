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
import { HakuswapMasterchefContract } from '../contracts/viem/HakuswapMasterchef';

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

  async getPoolLength(contract: HakuswapMasterchefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: HakuswapMasterchefContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: HakuswapMasterchefContract): Promise<string> {
    return contract.read.cake();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<HakuswapMasterchef>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<HakuswapMasterchef>) {
    return contract.read.cakePerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<HakuswapMasterchef>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<HakuswapMasterchef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<HakuswapMasterchef>): Promise<BigNumberish> {
    return contract.read.pendingCake([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
