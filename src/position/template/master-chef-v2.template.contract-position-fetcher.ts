import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { MetaType } from '~position/position.interface';

import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from './contract-position.template.types';
import {
  MasterChefContractPositionDataProps,
  MasterChefContractPositionDefinition,
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

  async getTokenDefinitions(params: GetTokenDefinitionsParams<T, MasterChefContractPositionDefinition>) {
    const { multicall, definition, contract } = params;
    const tokenDefinitions = await super.getTokenDefinitions(params);
    if (!tokenDefinitions) return null; // break early if it failed to resolve the primary supplied and claimable

    const extraRewarderAddress = await this.getExtraRewarder(contract, definition.poolIndex);
    if (extraRewarderAddress === ZERO_ADDRESS) return tokenDefinitions;

    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));
    const extraRewardTokenAddress = await this.getExtraRewardTokenAddress(rewarderContract, definition.poolIndex);
    tokenDefinitions.push({ metaType: MetaType.CLAIMABLE, address: extraRewardTokenAddress });

    return tokenDefinitions;
  }

  async getDataProps(
    params: GetDataPropsParams<T, MasterChefV2ContractPositionDataProps, MasterChefContractPositionDefinition>,
  ): Promise<MasterChefV2ContractPositionDataProps> {
    const { definition, contract } = params;
    const dataProps = await super.getDataProps(params);
    const extraRewarderAddress = await this.getExtraRewarder(contract, definition.poolIndex);
    return { ...dataProps, extraRewarderAddress: extraRewarderAddress.toLowerCase() };
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T, MasterChefV2ContractPositionDataProps>) {
    const { address, contractPosition, multicall } = params;
    const { extraRewarderAddress, poolIndex } = contractPosition.dataProps;

    const tokenBalancesForPosition = await super.getTokenBalancesPerPosition(params);
    if (extraRewarderAddress === ZERO_ADDRESS) return tokenBalancesForPosition;

    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));
    const extraRewardBalance = await this.getExtraRewardTokenBalance(address, rewarderContract, poolIndex);
    return [...tokenBalancesForPosition, extraRewardBalance];
  }
}
