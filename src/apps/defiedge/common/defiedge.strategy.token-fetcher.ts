import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetUnderlyingTokensParams,
  DefaultAppTokenDataProps,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPriceParams,
} from '~position/template/app-token.template.types';

import { DefiedgeViemContractFactory } from '../contracts';
import { Strategy } from '../contracts/viem';

import { DefiedgeStrategyDefinitionsResolver } from './defiedge.strategy.definitions-resolver';

export type DefiedgeStrategyDefinition = {
  address: string;
  title: string;
  subTitle: string | null;
  token0Address: string;
  token1Address: string;
};

export type DefiedgeStrategyTokenDataProps = DefaultAppTokenDataProps & {
  sinceInception: number;
  sharePrice: number;
  aum: number;
  unclaimedFees: number;
};

export function expandTo18Decimals(value: BigNumber, decimals?: number): BigNumber {
  return value.mul(BigNumber.from(10).pow(BigNumber.from(18).sub(BigNumber.from(decimals ?? 0))));
}

export abstract class DefiedgeStrategyTokenFetcher extends AppTokenTemplatePositionFetcher<
  Strategy,
  DefiedgeStrategyTokenDataProps,
  DefiedgeStrategyDefinition
> {
  groupLabel = 'Strategies';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DefiedgeViemContractFactory) protected readonly contractFactory: DefiedgeViemContractFactory,
    @Inject(DefiedgeStrategyDefinitionsResolver)
    protected readonly definitionResolver: DefiedgeStrategyDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.strategy({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefiedgeStrategyDefinition[]> {
    const apiDefinitions = await this.definitionResolver.getStrategies(this.network);

    return apiDefinitions.map(v => ({
      address: v.id.toLowerCase(),
      title: v.title,
      subTitle: v.subTitle,
      token0Address: v.token0.id.toLowerCase(),
      token1Address: v.token1.id.toLowerCase(),
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<DefiedgeStrategyDefinition>) {
    return definitions.map(v => v.address);
  }

  async getSymbol() {
    return 'DEShare';
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<Strategy, DefiedgeStrategyDefinition>) {
    return [
      { address: definition.token0Address, network: this.network },
      { address: definition.token1Address, network: this.network },
    ];
  }

  async getPrice({
    contract,
    appToken,
  }: GetPriceParams<Strategy, DefiedgeStrategyTokenDataProps, DefiedgeStrategyDefinition>): Promise<number> {
    const [aumWithFee, totalSupplyBN] = await Promise.all([
      contract.simulate.getAUMWithFees([false]).then(v => v.result),
      contract.read.totalSupply(),
    ]);

    const [amount0, amount1] = aumWithFee;
    const [amount0BN, amount1BN] = [amount0, amount1].map(v => BigNumber.from(v));
    const [token0, token1] = appToken.tokens;

    const t0Price = parseEther(token0.price.toString());
    const t1Price = parseEther(token1.price.toString());
    const aumBN = expandTo18Decimals(amount0BN, token0.decimals)
      .mul(t0Price)
      .add(expandTo18Decimals(amount1BN, token1.decimals).mul(t1Price));

    const sharePrice = BigNumber.from(totalSupplyBN).eq(0)
      ? 0
      : +Number(+formatEther(aumBN.div(totalSupplyBN))).toFixed(8) || 100;

    return sharePrice;
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<Strategy, DefiedgeStrategyTokenDataProps, DefiedgeStrategyDefinition>) {
    const [aumWithFee, totalSupplyBN] = await Promise.all([
      contract.simulate.getAUMWithFees([false]).then(v => v.result),
      contract.read.totalSupply(),
    ]);

    const [amount0, amount1] = aumWithFee;
    const [token0, token1] = appToken.tokens;

    const totalSupply = +formatEther(totalSupplyBN);

    const pricePerShare = [
      +formatEther(expandTo18Decimals(BigNumber.from(amount0), token0.decimals)) / totalSupply,
      +formatEther(expandTo18Decimals(BigNumber.from(amount1), token1.decimals)) / totalSupply,
    ];

    return pricePerShare;
  }

  async getDataProps(
    params: GetDataPropsParams<Strategy, DefiedgeStrategyTokenDataProps, DefiedgeStrategyDefinition>,
  ): Promise<DefiedgeStrategyTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);

    const { contract, appToken } = params;
    const [aumWithFee, totalSupplyBN] = await Promise.all([
      contract.simulate.getAUMWithFees([true]).then(v => v.result),
      contract.read.totalSupply(),
    ]);

    const [, , totalFee0, totalFee1] = aumWithFee;
    const [token0, token1] = appToken.tokens;
    const sharePrice = appToken.price;
    const liquidity = +formatEther(totalSupplyBN) * appToken.price;
    const unclaimedFees =
      +formatEther(BigNumber.from(totalFee0)) * token0.price + +formatEther(BigNumber.from(totalFee1)) * token1.price;

    return {
      ...defaultDataProps,
      unclaimedFees,
      liquidity,
      sharePrice,
      sinceInception: sharePrice - 100,
    };
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<Strategy, DefiedgeStrategyTokenDataProps, DefiedgeStrategyDefinition>) {
    return definition.subTitle ?? definition.title;
  }

  async getSecondaryLabel({
    definition,
  }: GetDisplayPropsParams<Strategy, DefiedgeStrategyTokenDataProps, DefiedgeStrategyDefinition>) {
    return definition.subTitle ?? '';
  }

  async getStatsItems({
    appToken,
  }: GetDisplayPropsParams<Strategy, DefiedgeStrategyTokenDataProps, DefiedgeStrategyDefinition>) {
    const { liquidity, apy, reserves, sinceInception, unclaimedFees } = appToken.dataProps;
    const reservesDisplay = reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ');

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Reserves', value: reservesDisplay },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Since inception', value: buildPercentageDisplayItem(sinceInception) },
      { label: 'Unclaimed Fees', value: buildDollarDisplayItem(unclaimedFees) },
    ];
  }
}
