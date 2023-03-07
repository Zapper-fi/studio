import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { VelaComplexRewarder, VelaContractFactory, VelaTokenFarm } from '../contracts';

interface VelaTokenFarmPool {
  poolId: number;
}

export abstract class VelaTokenFarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<VelaTokenFarm> {
  groupLabel = 'Farms';

  abstract get velaTokenFarmAddress(): string | Promise<string>;
  abstract get pool(): VelaTokenFarmPool | Promise<VelaTokenFarmPool>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelaContractFactory) protected readonly velaContractFactory: VelaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VelaTokenFarm {
    return this.velaContractFactory.velaTokenFarm({
      address,
      network: this.network,
    });
  }

  async getFarmAddresses(): Promise<string[]> {
    const velaTokenFarmAddress = await this.velaTokenFarmAddress;
    return [velaTokenFarmAddress];
  }

  async getStakedTokenAddress({
    contract,
  }: GetTokenDefinitionsParams<VelaTokenFarm, DefaultContractPositionDefinition>): Promise<string> {
    const pool = await this.pool;
    const poolInfo = await contract.poolInfo(pool.poolId);
    return poolInfo.lpToken;
  }

  async getRewardTokenAddresses({
    contract,
    multicall,
  }: GetTokenDefinitionsParams<VelaTokenFarm, DefaultContractPositionDefinition>): Promise<string | string[]> {
    const poolRewarders = await this.getPoolRewarders(contract, multicall);
    return await Promise.all(
      poolRewarders.map(poolRewarder => {
        return poolRewarder.rewardToken();
      }),
    );
  }

  async getRewardRates({
    contract,
    multicall,
  }: GetDataPropsParams<VelaTokenFarm, SingleStakingFarmDataProps, DefaultContractPositionDefinition>): Promise<
    BigNumberish | BigNumberish[]
  > {
    const poolRewarders = await this.getPoolRewarders(contract, multicall);
    const poolRewardersRewardsPerSec = await Promise.all(
      poolRewarders.map(poolRewarder => poolRewarder.poolRewardsPerSec(0)),
    );
    return poolRewardersRewardsPerSec;
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<VelaTokenFarm, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    const pool = await this.pool;
    const userInfo = await contract.userInfo(pool.poolId, address);
    return userInfo.amount;
  }

  async getRewardTokenBalances({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<VelaTokenFarm, SingleStakingFarmDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const poolRewarders = await this.getPoolRewarders(contract, multicall);
    const poolRewardersPendingTokens = await Promise.all(
      poolRewarders.map(poolRewarder => poolRewarder.pendingTokens(0, address)),
    );

    return poolRewardersPendingTokens;
  }

  private async getPoolRewarders(
    contract: VelaTokenFarm,
    multicall: IMulticallWrapper,
  ): Promise<VelaComplexRewarder[]> {
    const pool = await this.pool;
    const poolRewarderAddresses = await contract.poolRewarders(pool.poolId);
    const poolRewarders = poolRewarderAddresses.map(poolRewarderAddress => {
      return multicall.wrap(
        this.velaContractFactory.velaComplexRewarder({
          address: poolRewarderAddress,
          network: this.network,
        }),
      );
    });
    return poolRewarders;
  }
}
