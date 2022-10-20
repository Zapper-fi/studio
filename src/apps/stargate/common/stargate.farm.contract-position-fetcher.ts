import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateChef, StargateContractFactory } from '../contracts';

export abstract class StargateFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StargateChef> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StargateChef {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }

  async getPoolLength(contract: StargateChef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: StargateChef, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: StargateChef): Promise<string> {
    return contract.stargate();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<StargateChef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChef>): Promise<BigNumberish> {
    return contract.stargatePerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<StargateChef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChef>): Promise<BigNumberish> {
    return contract.pendingStargate(contractPosition.dataProps.poolIndex, address).catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
