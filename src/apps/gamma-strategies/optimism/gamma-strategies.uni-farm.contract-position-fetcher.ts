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

import { GammaStrategiesContractFactory, GammaStrategiesUniOpMasterchef } from '../contracts';

@PositionTemplate()
export class OptimismGammaStrategiesUniFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<GammaStrategiesUniOpMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0xc7846d1bc4d8bcf7c45a7c998b77ce9b3c904365';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesContractFactory) protected readonly contractFactory: GammaStrategiesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GammaStrategiesUniOpMasterchef {
    return this.contractFactory.gammaStrategiesUniOpMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: GammaStrategiesUniOpMasterchef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: GammaStrategiesUniOpMasterchef, poolIndex: number) {
    return contract.lpToken(poolIndex);
  }

  async getRewardTokenAddress() {
    // OP Token
    return '0x4200000000000000000000000000000000000042';
  }

  async getTotalAllocPoints({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.sushiPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(): Promise<BigNumberish> {
    // TODO: this is actually a non-standard masterchef contract
    return 0;
  }
}
