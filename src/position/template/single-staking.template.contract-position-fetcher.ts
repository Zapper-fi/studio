import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';
import { isArray, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

export type SingleStakingFarmDefinition = {
  address: string;
  reserveAddress?: string;
  stakedTokenAddress: string;
  rewardTokenAddresses: string[];
};

export type SingleStakingFarmDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
};

export abstract class SingleStakingFarmTemplateContractPositionFetcher<
  T extends Contract,
  V extends SingleStakingFarmDataProps = SingleStakingFarmDataProps,
> extends ContractPositionTemplatePositionFetcher<T, V, SingleStakingFarmDefinition> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  abstract getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]>;
  abstract getRewardRates(params: GetDataPropsParams<T, V>): Promise<BigNumberish | BigNumberish[]>;
  abstract getStakedTokenBalance(params: GetTokenBalancesParams<T, SingleStakingFarmDataProps>): Promise<BigNumberish>;
  abstract getRewardTokenBalances(
    params: GetTokenBalancesParams<T, SingleStakingFarmDataProps>,
  ): Promise<BigNumberish | BigNumberish[]>;

  async getDefinitions() {
    return this.getFarmDefinitions();
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, SingleStakingFarmDefinition>) {
    const tokenDefinitions: UnderlyingTokenDefinition[] = [];
    tokenDefinitions.push({ metaType: MetaType.SUPPLIED, address: definition.stakedTokenAddress });
    tokenDefinitions.push(...definition.rewardTokenAddresses.map(v => ({ metaType: MetaType.CLAIMABLE, address: v })));
    return tokenDefinitions;
  }

  async getDataProps(params: GetDataPropsParams<T, V, SingleStakingFarmDefinition>): Promise<V> {
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

    return { liquidity, apy, isActive } as V;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    return getLabelFromToken(stakedToken);
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<T, V>) {
    return contractPosition.tokens.filter(isSupplied).flatMap(v => getImagesFromToken(v));
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T, SingleStakingFarmDataProps>) {
    const tokenBalances: BigNumberish[] = [];

    const [stakedBalanceRaw, rewardTokenBalancesRaw] = await Promise.all([
      this.getStakedTokenBalance(params),
      this.getRewardTokenBalances(params).then(v => (isArray(v) ? v : [v])),
    ]);

    tokenBalances.push(stakedBalanceRaw);
    tokenBalances.push(...rewardTokenBalancesRaw);
    return tokenBalances;
  }
}
