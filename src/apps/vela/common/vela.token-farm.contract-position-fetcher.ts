import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import {
  GetTokenBalancesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { SingleStakingFarmDataProps } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { VelaComplexRewarder, VelaContractFactory, VelaTokenFarm } from '../contracts';

export interface VelaTokenFarmDefinition extends SingleStakingFarmDefinition {
  poolId: number;
}

export interface VelaTokenFarmDataProps extends DefaultDataProps, SingleStakingFarmDataProps {
  poolId: number;
}

export abstract class VelaTokenFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  VelaTokenFarm,
  VelaTokenFarmDataProps,
  VelaTokenFarmDefinition
> {
  groupLabel = 'Farms';

  abstract get velaTokenFarmAddress(): string | Promise<string>;

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

  async getFarmDefinitions({ multicall }: GetDefinitionsParams): Promise<VelaTokenFarmDefinition[]> {
    const velaTokenFarmAddress = await this.velaTokenFarmAddress;
    const velaTokenFarm = multicall.wrap(this.getContract(velaTokenFarmAddress));
    const poolCount = await velaTokenFarm.poolLength();

    const stakingFarmDefinitions: VelaTokenFarmDefinition[] = [];
    for (let poolId = 0; poolCount.gt(poolId); poolId++) {
      const [{ lpToken: stakedTokenAddress }, { addresses: rewardTokenAddresses }] = await Promise.all([
        velaTokenFarm.poolInfo(poolId),
        velaTokenFarm.poolRewardsPerSec(poolId),
      ]);
      stakingFarmDefinitions.push({
        poolId,
        address: velaTokenFarmAddress,
        stakedTokenAddress,
        rewardTokenAddresses,
      });
    }

    return stakingFarmDefinitions;
  }

  async getRewardRates({
    definition: { poolId },
    contract,
  }: GetDataPropsParams<VelaTokenFarm, VelaTokenFarmDataProps, VelaTokenFarmDefinition>): Promise<
    BigNumberish | BigNumberish[]
  > {
    const { rewardsPerSec } = await contract.poolRewardsPerSec(poolId);
    return rewardsPerSec;
  }

  async getIsActive({
    definition: { poolId },
    contract,
  }: GetDataPropsParams<VelaTokenFarm, VelaTokenFarmDataProps, VelaTokenFarmDefinition>): Promise<boolean> {
    return (await contract.poolRewardsPerSec(poolId)).rewardsPerSec.some(v => v.gt(0));
  }

  async getDataProps(
    params: GetDataPropsParams<VelaTokenFarm, VelaTokenFarmDataProps, VelaTokenFarmDefinition>,
  ): Promise<VelaTokenFarmDataProps> {
    return {
      ...(await super.getDataProps(params)),
      poolId: params.definition.poolId,
    };
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition: {
      dataProps: { poolId },
    },
  }: GetTokenBalancesParams<VelaTokenFarm, VelaTokenFarmDataProps>): Promise<BigNumberish> {
    const { amount: stakedTokenBalance } = await contract.userInfo(poolId, address);
    return stakedTokenBalance;
  }

  async getRewardTokenBalances({
    address,
    contract,
    multicall,
    contractPosition: {
      dataProps: { poolId },
    },
  }: GetTokenBalancesParams<VelaTokenFarm, VelaTokenFarmDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const poolRewarders = await this.getPoolRewarders(contract, multicall, poolId);
    const poolRewardersPendingTokens = await Promise.all(
      poolRewarders.map(poolRewarder => {
        return poolRewarder.pendingTokens(poolId, address);
      }),
    );

    return poolRewardersPendingTokens;
  }

  private async getPoolRewarders(
    contract: VelaTokenFarm,
    multicall: IMulticallWrapper,
    poolId: number,
  ): Promise<VelaComplexRewarder[]> {
    const poolRewarderAddresses = await contract.poolRewarders(poolId);
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
