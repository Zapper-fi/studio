import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateViemContractFactory } from '../contracts';
import { Abi, GetContractReturnType } from 'viem';
import { StargateChef, StargateChefBase } from '../contracts/viem';
import { StargateChefContract } from '../contracts/viem/StargateChef';
import { StargateChefBaseContract } from '../contracts/viem/StargateChefBase';

export abstract class StargateFarmBaseContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StargateChefBase> {
  abstract getStargateChefContract(address: string): StargateChefBaseContract;
  abstract getStargateTokenAddress(contract: StargateChefBaseContract): Promise<string>;
  abstract getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChefBase>): Promise<BigNumberish>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateViemContractFactory) protected readonly contractFactory: StargateViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.getStargateChefContract(address);
  }

  async getPoolLength(contract: StargateChefBaseContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: StargateChefBaseContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: StargateChefBaseContract): Promise<string> {
    return this.getStargateTokenAddress(contract);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<StargateChefBase>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<StargateChefBase>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChefBase>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChefBase>): Promise<BigNumberish> {
    return contract.read.pendingEmissionToken([BigInt(contractPosition.dataProps.poolIndex), address]).catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
