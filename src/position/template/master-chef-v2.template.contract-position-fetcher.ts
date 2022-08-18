import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { MetaType } from '~position/position.interface';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';

import {
  MasterChefContractPositionDataProps,
  MasterChefContractPositionDescriptor,
  MasterChefTemplateContractPositionFetcher,
} from './master-chef.template.contract-position-fetcher';

export type MasterChefV2ContractPositionDataProps = MasterChefContractPositionDataProps & {
  extraRewarderAddress: string;
};

export abstract class MasterChefV2TemplateContractPositionFetcher<
  T extends Contract,
  V extends Contract,
> extends MasterChefTemplateContractPositionFetcher<T, MasterChefV2ContractPositionDataProps> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  abstract getExtraRewarder(contract: T, poolIndex: number): Promise<string>;
  abstract getExtraRewarderContract(address: string): V;
  abstract getExtraRewardTokenAddress(contract: V, poolIndex: number): Promise<string>;
  abstract getExtraRewardTokenBalance(address: string, contract: V, poolIndex: number): Promise<BigNumberish>;

  async getTokenDescriptors(
    params: TokenStageParams<T, MasterChefV2ContractPositionDataProps, MasterChefContractPositionDescriptor>,
  ) {
    const { multicall, descriptor, contract } = params;
    const tokenDescriptors = await super.getTokenDescriptors(params);
    if (!tokenDescriptors) return null; // break early if it failed to resolve the primary supplied and claimable

    const extraRewarderAddress = await this.getExtraRewarder(contract, descriptor.poolIndex);
    if (extraRewarderAddress === ZERO_ADDRESS) return tokenDescriptors;

    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));
    const extraRewardTokenAddress = await this.getExtraRewardTokenAddress(rewarderContract, descriptor.poolIndex);
    tokenDescriptors.push({ metaType: MetaType.CLAIMABLE, address: extraRewardTokenAddress });

    return tokenDescriptors;
  }

  async getDataProps(
    params: DataPropsStageParams<T, MasterChefV2ContractPositionDataProps, MasterChefContractPositionDescriptor>,
  ): Promise<MasterChefV2ContractPositionDataProps> {
    const { descriptor, contract } = params;
    const dataProps = await super.getDataProps(params);
    const extraRewarderAddress = await this.getExtraRewarder(contract, descriptor.poolIndex);
    return { ...dataProps, extraRewarderAddress: extraRewarderAddress.toLowerCase() };
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesPerPositionParams<T, MasterChefV2ContractPositionDataProps>,
  ) {
    const { address, contractPosition, multicall } = params;
    const { extraRewarderAddress, poolIndex } = contractPosition.dataProps;

    const tokenBalancesForPosition = await super.getTokenBalancesPerPosition(params);
    if (extraRewarderAddress === ZERO_ADDRESS) return tokenBalancesForPosition;

    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));
    const extraRewardBalance = await this.getExtraRewardTokenBalance(address, rewarderContract, poolIndex);
    return [...tokenBalancesForPosition, extraRewardBalance];
  }
}
