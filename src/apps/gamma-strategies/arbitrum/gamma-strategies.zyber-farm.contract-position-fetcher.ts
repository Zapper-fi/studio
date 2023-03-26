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

import { GammaStrategiesContractFactory, GammaStrategiesZyberswapMasterchef } from '../contracts';

@PositionTemplate()
export class ArbitrumGammaStrategiesZyberFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<GammaStrategiesZyberswapMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0x9ba666165867e916ee7ed3a3ae6c19415c2fbddd';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesContractFactory) protected readonly contractFactory: GammaStrategiesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GammaStrategiesZyberswapMasterchef {
    return this.contractFactory.gammaStrategiesZyberswapMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: GammaStrategiesZyberswapMasterchef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: GammaStrategiesZyberswapMasterchef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken.toLowerCase());
  }

  async getRewardTokenAddress(contract: GammaStrategiesZyberswapMasterchef) {
    return (await contract.zyber()).toLowerCase();
  }

  async getTotalAllocPoints({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesZyberswapMasterchef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesZyberswapMasterchef>): Promise<BigNumberish> {
    return contract.zyberPerSec();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<GammaStrategiesZyberswapMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<GammaStrategiesZyberswapMasterchef>): Promise<BigNumberish> {
    const result = await contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
    return result;
  }

  async getRewardTokenBalance(): Promise<BigNumberish> {
    // TODO: this is actually a non-standard masterchefv2
    return 0;
  }
}
