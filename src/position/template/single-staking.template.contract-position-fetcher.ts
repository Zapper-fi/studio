import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray, sum } from 'lodash';
import { Abi } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
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
  T extends Abi,
  V extends SingleStakingFarmDataProps = SingleStakingFarmDataProps,
  R extends SingleStakingFarmDefinition = SingleStakingFarmDefinition,
> extends ContractPositionTemplatePositionFetcher<T, V, R> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  abstract getFarmDefinitions(params: GetDefinitionsParams): Promise<R[]>;
  abstract getRewardRates(params: GetDataPropsParams<T, V, R>): Promise<BigNumberish | BigNumberish[]>;
  abstract getIsActive(params: GetDataPropsParams<T, V, R>): Promise<boolean>;
  abstract getStakedTokenBalance(params: GetTokenBalancesParams<T, V>): Promise<BigNumberish>;
  abstract getRewardTokenBalances(
    params: GetTokenBalancesParams<T, SingleStakingFarmDataProps>,
  ): Promise<BigNumberish | BigNumberish[]>;

  getDefinitions(params: GetDefinitionsParams): Promise<R[]> {
    return this.getFarmDefinitions(params);
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, R>) {
    const tokenDefinitions: UnderlyingTokenDefinition[] = [];

    tokenDefinitions.push({
      metaType: MetaType.SUPPLIED,
      address: definition.stakedTokenAddress,
      network: this.network,
    });

    tokenDefinitions.push(
      ...definition.rewardTokenAddresses.map(v => ({
        metaType: MetaType.CLAIMABLE,
        address: v,
        network: this.network,
      })),
    );

    return tokenDefinitions;
  }

  async getReserve({ contractPosition, multicall }: GetDataPropsParams<T, V, R>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const stakedTokenContract = this.appToolkit.globalViemContracts.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).read.balanceOf([contractPosition.address]);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    return reserve;
  }

  async getDataProps(params: GetDataPropsParams<T, V, R>): Promise<V> {
    const { contractPosition } = params;
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const rewardRatesRaw = await this.getRewardRates(params).then(v => (isArray(v) ? v : [v]));
    const isActive = await this.getIsActive(params);

    const reserve = await this.getReserve(params);
    const liquidity = reserve * stakedToken.price;

    const rewardRates = rewardTokens.map((v, i) => Number(rewardRatesRaw[i] ?? 0) / 10 ** v.decimals);
    const rewardRatesUSD = sum(rewardRates.map((v, i) => v * rewardTokens[i].price));
    const dailyRewardRateUSD = rewardRatesUSD * 86_400;
    const dailyReturn = liquidity > 0 ? (dailyRewardRateUSD + liquidity) / liquidity - 1 : 0;
    const apy = dailyReturn * 365 * 100;

    return { liquidity, apy, isActive } as V;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    return getLabelFromToken(stakedToken);
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<T, V>) {
    return contractPosition.tokens.filter(isSupplied).flatMap(v => getImagesFromToken(v));
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T, V>) {
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
