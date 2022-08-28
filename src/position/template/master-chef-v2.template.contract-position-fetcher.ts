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
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefContractPositionDataProps,
  MasterChefContractPositionDefinition,
  MasterChefTemplateContractPositionFetcher,
} from './master-chef.template.contract-position-fetcher';

export type MasterChefV2ContractPositionDataProps = MasterChefContractPositionDataProps & {
  extraRewarderAddress: string;
};

export type GetMasterChefV2ExtraRewardTokenRewardRates<
  T extends Contract,
  V extends Contract,
> = GetMasterChefDataPropsParams<T> & {
  rewarderContract: V;
};

export type GetMasterChefV2ExtraRewardTokenBalancesParams<
  T extends Contract,
  V extends Contract,
> = GetMasterChefTokenBalancesParams<T> & {
  rewarderContract: V;
};

export abstract class MasterChefV2TemplateContractPositionFetcher<
  T extends Contract,
  V extends Contract,
> extends MasterChefTemplateContractPositionFetcher<T, MasterChefV2ContractPositionDataProps> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  // Tokens
  abstract getExtraRewarder(contract: T, poolIndex: number): Promise<string>;
  abstract getExtraRewarderContract(address: string): V;
  abstract getExtraRewardTokenAddresses(contract: V, poolIndex: number): Promise<string[]>;

  // APY
  abstract getExtraRewardTokenRewardRates(
    params: GetMasterChefV2ExtraRewardTokenRewardRates<T, V>,
  ): Promise<BigNumberish | BigNumberish[]>;

  // Balances
  abstract getExtraRewardTokenBalances(
    params: GetMasterChefV2ExtraRewardTokenBalancesParams<T, V>,
  ): Promise<BigNumberish | BigNumberish[]>;

  async getTokenDefinitions(params: GetTokenDefinitionsParams<T, MasterChefContractPositionDefinition>) {
    const { multicall, definition, contract } = params;
    const tokenDefinitions = await super.getTokenDefinitions(params);
    if (!tokenDefinitions) return null; // break early if it failed to resolve the primary supplied and claimable

    const extraRewarderAddress = await this.getExtraRewarder(contract, definition.poolIndex);
    if (extraRewarderAddress === ZERO_ADDRESS) return tokenDefinitions;

    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));
    const extraRewardTokenAddresses = await this.getExtraRewardTokenAddresses(rewarderContract, definition.poolIndex);
    tokenDefinitions.push(...extraRewardTokenAddresses.map(v => ({ metaType: MetaType.CLAIMABLE, address: v })));

    return tokenDefinitions;
  }

  async getRewardRates(
    params: GetDataPropsParams<T, MasterChefV2ContractPositionDataProps, MasterChefContractPositionDefinition>,
  ): Promise<BigNumberish[]> {
    const rewardRates = await super.getRewardRates(params);

    const { contract, definition, multicall } = params;
    const extraRewarderAddress = await this.getExtraRewarder(contract, definition.poolIndex);
    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));

    const extraRewardRates = await this.getExtraRewardTokenRewardRates({ ...params, rewarderContract });
    return [...rewardRates, ...(Array.isArray(extraRewardRates) ? extraRewardRates : [extraRewardRates])];
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
    const { contractPosition, multicall } = params;
    const { extraRewarderAddress } = contractPosition.dataProps;

    const tokenBalancesForPosition = await super.getTokenBalancesPerPosition(params);
    if (extraRewarderAddress === ZERO_ADDRESS) return tokenBalancesForPosition;

    const rewarderContract = multicall.wrap(this.getExtraRewarderContract(extraRewarderAddress));
    const extraResult = await this.getExtraRewardTokenBalances({ ...params, rewarderContract });
    const extraRewardBalances = Array.isArray(extraResult) ? extraResult : [extraResult];
    return [...tokenBalancesForPosition, ...extraRewardBalances];
  }
}
