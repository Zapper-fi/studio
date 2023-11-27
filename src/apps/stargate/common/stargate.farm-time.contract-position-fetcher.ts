import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateViemContractFactory } from '../contracts';
import { StargateChefTime } from '../contracts/viem';
import { StargateChefTimeContract } from '../contracts/viem/StargateChefTime';

export abstract class StargateLpStakingTimeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StargateChefTime> {
  abstract getStargateChefContract(address: string): StargateChefTimeContract;
  abstract getStargateTokenAddress(contract: StargateChefTimeContract): Promise<string>;
  abstract getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChefTime>): Promise<BigNumberish>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateViemContractFactory) protected readonly contractFactory: StargateViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.getStargateChefContract(address);
  }

  async getPoolLength(contract: StargateChefTimeContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: StargateChefTimeContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: StargateChefTimeContract): Promise<string> {
    return this.getStargateTokenAddress(contract);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<StargateChefTime>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<StargateChefTime>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChefTime>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChefTime>): Promise<BigNumberish> {
    return contract.read.pendingEmissionToken([BigInt(contractPosition.dataProps.poolIndex), address]).catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
