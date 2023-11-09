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
import { PopsicleChefContract } from '../contracts/viem/PopsicleChef';

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

  async getPoolLength(contract: PopsicleChefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PopsicleChefContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: PopsicleChefContract): Promise<string> {
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
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[4]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PopsicleChef>): Promise<BigNumberish> {
    return contract.read.pendingIce([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
