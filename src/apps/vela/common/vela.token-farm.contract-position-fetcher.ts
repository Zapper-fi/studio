import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ViemMulticallDataLoader } from '~multicall';
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

import { VelaViemContractFactory } from '../contracts';
import { VelaTokenFarm } from '../contracts/viem';
import { VelaComplexRewarderContract } from '../contracts/viem/VelaComplexRewarder';
import { VelaTokenFarmContract } from '../contracts/viem/VelaTokenFarm';

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
    @Inject(VelaViemContractFactory) protected readonly velaContractFactory: VelaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.velaContractFactory.velaTokenFarm({
      address,
      network: this.network,
    });
  }

  async getFarmDefinitions({ multicall }: GetDefinitionsParams): Promise<VelaTokenFarmDefinition[]> {
    const velaTokenFarmAddress = await this.velaTokenFarmAddress;
    const velaTokenFarm = multicall.wrap(this.getContract(velaTokenFarmAddress));
    const poolCount = await velaTokenFarm.read.poolLength();

    const stakingFarmDefinitions: VelaTokenFarmDefinition[] = [];
    for (let poolId = 0; Number(poolCount) > poolId; poolId++) {
      const [[stakedTokenAddress], [rewardTokenAddresses]] = await Promise.all([
        velaTokenFarm.read.poolInfo([BigInt(poolId)]),
        velaTokenFarm.read.poolRewardsPerSec([BigInt(poolId)]),
      ]);

      stakingFarmDefinitions.push({
        poolId,
        address: velaTokenFarmAddress,
        stakedTokenAddress,
        rewardTokenAddresses: [...rewardTokenAddresses],
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
    const poolRewardsPerSec = await contract.read.poolRewardsPerSec([BigInt(poolId)]);
    const rewardsPerSec = poolRewardsPerSec[3];
    return [...rewardsPerSec];
  }

  async getIsActive({
    definition: { poolId },
    contract,
  }: GetDataPropsParams<VelaTokenFarm, VelaTokenFarmDataProps, VelaTokenFarmDefinition>): Promise<boolean> {
    return (await contract.read.poolRewardsPerSec([BigInt(poolId)]))[3].some(v => v > 0);
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
    const [stakedTokenBalance] = await contract.read.userInfo([BigInt(poolId), address]);
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
        return poolRewarder.read.pendingTokens([BigInt(poolId), address]);
      }),
    );

    return poolRewardersPendingTokens;
  }

  private async getPoolRewarders(
    contract: VelaTokenFarmContract,
    multicall: ViemMulticallDataLoader,
    poolId: number,
  ): Promise<VelaComplexRewarderContract[]> {
    const poolRewarderAddresses = await contract.read.poolRewarders([BigInt(poolId)]);
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
