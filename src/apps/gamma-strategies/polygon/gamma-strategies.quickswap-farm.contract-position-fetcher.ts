import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  MasterChefTemplateContractPositionFetcher,
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { GammaStrategiesViemContractFactory } from '../contracts';
import { GammaStrategiesQuickswapMasterchef } from '../contracts/viem';

@PositionTemplate()
export class PolygonGammaStrategiesQuickSwapFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<GammaStrategiesQuickswapMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0x20ec0d06f447d550fc6edee42121bc8c1817b97d';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesViemContractFactory) protected readonly contractFactory: GammaStrategiesViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.gammaStrategiesQuickswapMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: GammaStrategiesQuickswapMasterchef) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: GammaStrategiesQuickswapMasterchef, poolIndex: number) {
    return (await contract.read.lpToken(poolIndex)).toLowerCase();
  }

  async getRewardTokenAddress() {
    // dQuick Token
    return '0xf28164a485b0b2c90639e47b0f377b4a438a16b1';
  }

  async getTotalAllocPoints({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesQuickswapMasterchef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesQuickswapMasterchef>): Promise<BigNumberish> {
    return contract.read.sushiPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<GammaStrategiesQuickswapMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<GammaStrategiesQuickswapMasterchef>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v.amount);
  }

  async getRewardTokenBalance(): Promise<BigNumberish> {
    // TODO: this is actually a non-standard masterchef contract
    return 0;
  }
}
