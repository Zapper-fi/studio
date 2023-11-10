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
import { GammaStrategiesUniOpMasterchef } from '../contracts/viem';
import { GammaStrategiesUniOpMasterchefContract } from '../contracts/viem/GammaStrategiesUniOpMasterchef';

@PositionTemplate()
export class OptimismGammaStrategiesUniFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<GammaStrategiesUniOpMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0xc7846d1bc4d8bcf7c45a7c998b77ce9b3c904365';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesViemContractFactory) protected readonly contractFactory: GammaStrategiesViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.gammaStrategiesUniOpMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: GammaStrategiesUniOpMasterchefContract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: GammaStrategiesUniOpMasterchefContract, poolIndex: number) {
    return contract.read.lpToken([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress() {
    // OP Token
    return '0x4200000000000000000000000000000000000042';
  }

  async getTotalAllocPoints({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({
    contract,
  }: GetMasterChefDataPropsParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.read.sushiPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[2]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<GammaStrategiesUniOpMasterchef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance(): Promise<BigNumberish> {
    // TODO: this is actually a non-standard masterchef contract
    return 0;
  }
}
