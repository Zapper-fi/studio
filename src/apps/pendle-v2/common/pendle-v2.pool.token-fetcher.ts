import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DollarDisplayItem, PercentageDisplayItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPriceParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';
import { NETWORK_IDS } from '~types/network.interface';

import { PendleMarket, PendleV2ContractFactory } from '../contracts';
import { BACKEND_QUERIES, PENDLE_V2_GRAPHQL_ENDPOINT } from '../pendle-v2.constant';
import { MarketsQueryResponse, TokenResponse } from '../pendle-v2.types';

type Token = {
  name: string;
  icon: string;
  address: string;
  price: number;
};

export type PendleV2MarketTokenDefinition = {
  address: string;
  aggregatedApy: number;
  ytFloatingApy: number;
  impliedApy: number;
  underlyingApy: number;
  ptDiscount: number;
  pt: Token;
  sy: Token;
  yt: Token;
  price: number;
  expiry: string;
  name: string;
  icon: string;
};

export type PendleV2MarketDataProps = DefaultAppTokenDataProps & PendleV2MarketTokenDefinition;

function toToken(tokenResp: TokenResponse): Token {
  return {
    // use simpleName if available, otherwise use proName
    name: tokenResp.simpleName ?? tokenResp.proName,
    icon: tokenResp.proIcon,
    address: tokenResp.address,
    price: tokenResp.price.usd,
  };
}

export abstract class PendleV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleMarket,
  PendleV2MarketDataProps,
  PendleV2MarketTokenDefinition
> {
  groupLabel = 'Pools';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) protected readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<PendleV2MarketTokenDefinition[]> {
    const marketsResponse = await gqlFetch<MarketsQueryResponse>({
      endpoint: PENDLE_V2_GRAPHQL_ENDPOINT,
      query: BACKEND_QUERIES.getMarkets,
      variables: { chainId: NETWORK_IDS[this.network] },
    });

    const definitions = await Promise.all(
      marketsResponse.markets.results.map(async market => {
        return {
          address: market.address,
          aggregatedApy: market.aggregatedApy,
          ytFloatingApy: market.ytFloatingApy,
          pt: toToken(market.pt),
          sy: toToken(market.sy),
          yt: toToken(market.yt),
          price: market.lp.price.usd,
          expiry: market.expiry,
          name: market.proName,
          icon: market.proIcon,
          impliedApy: market.impliedApy,
          underlyingApy: market.underlyingApy,
          ptDiscount: market.ptDiscount,
        };
      }),
    );

    return definitions;
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.pendleMarket({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(definition => definition.address);
  }

  async getPrice({
    definition,
  }: GetPriceParams<PendleMarket, PendleV2MarketDataProps, PendleV2MarketTokenDefinition>): Promise<number> {
    return definition.price;
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<PendleMarket, PendleV2MarketTokenDefinition>): Promise<UnderlyingTokenDefinition[]> {
    return [
      { address: definition.pt.address, network: this.network },
      { address: definition.sy.address, network: this.network },
    ];
  }

  async getPricePerShare({
    definition,
  }: GetPricePerShareParams<PendleMarket, PendleV2MarketDataProps, PendleV2MarketTokenDefinition>) {
    const price = definition.price;
    return [price / definition.pt.price, price / definition.sy.price];
  }

  async getApy({
    definition,
  }: GetDataPropsParams<PendleMarket, PendleV2MarketDataProps, PendleV2MarketTokenDefinition>): Promise<number> {
    return definition.aggregatedApy * 100;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PendleMarket, DefaultAppTokenDataProps, PendleV2MarketTokenDefinition>): Promise<string> {
    return definition.name;
  }

  async getSecondaryLabel({
    definition,
  }: GetDisplayPropsParams<PendleMarket, DefaultAppTokenDataProps, PendleV2MarketTokenDefinition>): Promise<
    string | number | DollarDisplayItem | PercentageDisplayItem | undefined
  > {
    return moment(definition.expiry).format('MMM DD, YYYY');
  }

  async getImages({
    definition,
  }: GetDisplayPropsParams<PendleMarket, DefaultAppTokenDataProps, PendleV2MarketTokenDefinition>): Promise<string[]> {
    return [definition.icon];
  }

  async getDataProps(
    params: GetDataPropsParams<PendleMarket, PendleV2MarketDataProps, PendleV2MarketTokenDefinition>,
  ): Promise<PendleV2MarketDataProps> {
    const defaultDataProps = await super.getDataProps(params);
    const { definition } = params;
    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
