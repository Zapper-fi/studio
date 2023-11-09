import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/impl/multicall.ethers';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateViemContractFactory } from '../contracts';

export abstract class StargateFarmContractPositionFetcher<
  R extends Contract,
> extends MasterChefTemplateContractPositionFetcher<R> {
  abstract getStargateChefContract(address: string): R;
  abstract getStargateTokenAddress(contract: R): Promise<string>;
  abstract getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<R>): Promise<BigNumberish>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateViemContractFactory) protected readonly contractFactory: StargateViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.getStargateChefContract(address);
  }

  async getPoolLength(contract: R): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: R, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([poolIndex]).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: R): Promise<string> {
    return this.getStargateTokenAddress(contract);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<R>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<R>): Promise<BigNumberish> {
    return contract.read.poolInfo([definition.poolIndex]).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<R>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<R>): Promise<BigNumberish> {
    return contract.read.pendingStargate([contractPosition.dataProps.poolIndex, address]).catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
