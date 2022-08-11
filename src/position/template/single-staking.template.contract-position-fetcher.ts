import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';
import { isArray, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
  UnderlyingTokenDescriptor,
} from '~position/template/contract-position.template.position-fetcher';

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
  abstract getRewardRates(contract: T): Promise<BigNumberish | BigNumberish[]>;
  abstract getStakedTokenBalance(
    params: GetTokenBalancesPerPositionParams<T, SingleStakingFarmDataProps>,
  ): Promise<BigNumberish>;
  abstract getRewardTokenBalances(
    params: GetTokenBalancesPerPositionParams<T, SingleStakingFarmDataProps>,
  ): Promise<BigNumberish | BigNumberish[]>;

  async getDescriptors() {
    return this.getFarmDefinitions();
  }

  async getTokenDescriptors({ descriptor }: TokenStageParams<T, V, SingleStakingFarmDefinition>) {
    const tokens: UnderlyingTokenDescriptor[] = [];
    tokens.push({ metaType: MetaType.SUPPLIED, address: descriptor.stakedTokenAddress });
    tokens.push(...descriptor.rewardTokenAddresses.map(v => ({ metaType: MetaType.CLAIMABLE, address: v })));
    return tokens;
  }

  async getDataProps({
    contract,
    contractPosition,
    multicall,
  }: DataPropsStageParams<T, V, SingleStakingFarmDefinition>): Promise<V> {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const rewardRatesRaw = await this.getRewardRates(contract).then(v => (isArray(v) ? v : [v]));

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

  async getLabel({ contractPosition }: DisplayPropsStageParams<T>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    return getLabelFromToken(stakedToken);
  }

  async getImages({ contractPosition }: DisplayPropsStageParams<T, V>) {
    return contractPosition.tokens.filter(isSupplied).flatMap(v => getImagesFromToken(v));
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesPerPositionParams<T, SingleStakingFarmDataProps>) {
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
