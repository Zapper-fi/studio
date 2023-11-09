import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
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

import { PendleV2ViemContractFactory } from '../contracts';
import { PendleMarket } from '../contracts/viem';

import { AppTokenResponse, PendleV2MarketDefinitionsResolver } from './pendle-v2.market-definition-resolver';

export type PendleV2MarketTokenDefinition = {
  address: string;
  name: string;
  price: number;
  expiry: string;
  pt: AppTokenResponse;
  sy: AppTokenResponse;
  yt: AppTokenResponse;
  aggregatedApy: number;
  ytFloatingApy: number;
  impliedApy: number;
  underlyingApy: number;
  ptDiscount: number;
};

export type PendleV2MarketDataProps = DefaultAppTokenDataProps & PendleV2MarketTokenDefinition;

export abstract class PendleV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleMarket,
  PendleV2MarketDataProps,
  PendleV2MarketTokenDefinition
> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ViemContractFactory) protected readonly pendleV2ContractFactory: PendleV2ViemContractFactory,
    @Inject(PendleV2MarketDefinitionsResolver) protected readonly pendleV2Resolver: PendleV2MarketDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<PendleV2MarketTokenDefinition[]> {
    return this.pendleV2Resolver.getMarketDefinitions(this.network);
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
    return [price / definition.pt.price.usd, price / definition.sy.price.usd];
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
