import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { AbracadabraViemContractFactory } from '../contracts';
import { PopsicleChef } from '../contracts/viem';

export abstract class AbracadabraFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PopsicleChef> {
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraViemContractFactory) protected readonly contractFactory: AbracadabraViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.popsicleChef({ address, network: this.network });
  }

  async getPoolLength(contract: PopsicleChef): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PopsicleChef, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([poolIndex]).then(v => v.stakingToken);
  }

  async getRewardTokenAddress(contract: PopsicleChef): Promise<string> {
    return contract.read.ice();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.read.icePerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.read.pendingIce([contractPosition.dataProps.poolIndex, address]);
  }
}
