import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { AuraRewardPoolResolver, AuraSingleStakingFarmDefinition } from '../common/aura.reward-pool.resolver';
import { AuraBaseRewardPoolUtils } from '../common/aura.reward-utils';
import { AuraBaseRewardPool, AuraContractFactory, AuraVirtualBalanceRewardPool } from '../contracts';

export type AuraPoolSingleStakingFarmDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
  extraRewards: {
    address: string;
    rewardToken: string;
  }[];
};

@PositionTemplate()
export class EthereumAuraPoolContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<AuraBaseRewardPool> {
  groupLabel = 'Balancer Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory)
    protected readonly contractFactory: AuraContractFactory,
    @Inject(AuraRewardPoolResolver)
    private readonly rewardPoolResolver: AuraRewardPoolResolver,
    @Inject(AuraBaseRewardPoolUtils) protected readonly baseRewardPoolUtils: AuraBaseRewardPoolUtils,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraBaseRewardPool {
    return this.contractFactory.auraBaseRewardPool({ network: this.network, address });
  }

  async getFarmDefinitions(): Promise<AuraSingleStakingFarmDefinition[]> {
    return await this.rewardPoolResolver.getRewardPoolDefinitions();
  }

  async getRewardRates({
    contract,
    definition,
    multicall,
  }: GetDataPropsParams<AuraBaseRewardPool, SingleStakingFarmDataProps, AuraSingleStakingFarmDefinition>): Promise<
    BigNumberish | BigNumberish[]
  > {
    // Platform reward (e.g. BAL)
    const rewardRate = await contract.rewardRate();

    // Aura reward
    const auraRewardRate = await this.baseRewardPoolUtils.getAuraRewardRate({ network: this.network, rewardRate });

    // Extra rewards
    const extraRewards = definition.extraRewardTokenAddresses;
    const otherRewardRates = await Promise.all(
      extraRewards.map(rewardToken =>
        multicall
          .wrap(
            this.contractFactory.auraVirtualBalanceRewardPool({ address: rewardToken.address, network: this.network }),
          )
          .rewardRate(),
      ),
    );

    return [rewardRate, auraRewardRate, ...otherRewardRates];
  }

  async getDataProps(
    params: GetDataPropsParams<AuraBaseRewardPool, SingleStakingFarmDataProps, AuraSingleStakingFarmDefinition>,
  ): Promise<AuraPoolSingleStakingFarmDataProps> {
    const { contractPosition, multicall } = params;
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const rewardRatesRaw = await this.getRewardRates(params).then(v => (isArray(v) ? v : [v]));

    const stakedTokenContract = this.appToolkit.globalContracts.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).balanceOf(contractPosition.address);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    const liquidity = reserve * stakedToken.price;

    const rewardRates = rewardTokens.map((v, i) => Number(rewardRatesRaw[i] ?? 0) / 10 ** v.decimals);
    const rewardRatesUSD = sum(rewardRates.map((v, i) => v * rewardTokens[i].price));
    const dailyRewardRateUSD = rewardRatesUSD * 86_400;
    const dailyReturn = (dailyRewardRateUSD + liquidity) / liquidity - 1;
    const apy = dailyReturn * 365 * 100;
    const isActive = apy > 0;

    const extraRewards = params.definition.extraRewardTokenAddresses;

    return { liquidity, apy, isActive, extraRewards } as AuraPoolSingleStakingFarmDataProps;
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<AuraBaseRewardPool, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return await contract.balanceOf(address);
  }

  async getRewardTokenBalances({
    address,
    contract,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<AuraBaseRewardPool, AuraPoolSingleStakingFarmDataProps>): Promise<
    BigNumberish | BigNumberish[]
  > {
    const rewardBalanceRaw = await contract.earned(address);
    const auraRewardBalanceRaw = await this.baseRewardPoolUtils.getAuraMintedForRewardToken({
      rewardTokenAmount: rewardBalanceRaw,
      network: this.network,
    });

    const extraRewardPools: AuraVirtualBalanceRewardPool[] = contractPosition.dataProps.extraRewards.map(
      ({ address }) => this.contractFactory.auraVirtualBalanceRewardPool({ address, network: this.network }),
    );

    const extraRewardBalancesRaw = await Promise.all(
      extraRewardPools.map(virtualBalanceRewardPool => multicall.wrap(virtualBalanceRewardPool).earned(address)),
    );

    return [rewardBalanceRaw, auraRewardBalanceRaw, ...extraRewardBalancesRaw];
  }
}
