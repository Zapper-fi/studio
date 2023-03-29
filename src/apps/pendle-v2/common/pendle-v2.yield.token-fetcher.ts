import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DollarDisplayItem, PercentageDisplayItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPriceParams,
} from '~position/template/app-token.template.types';
import { NETWORK_IDS } from '~types';

import { PendleV2ContractFactory, PendleYieldToken } from '../contracts';
import { PENDLE_V2_GRAPHQL_ENDPOINT, BACKEND_QUERIES } from '../pendle-v2.constant';
import { MarketsQueryResponse } from '../pendle-v2.types';

export type PendleV2YieldTokenDefinition = {
  address: string;
  icon: string;
  name: string;
  price: number;
  expiry: string;
  ytFloatingApy: number;
};

export type PendleV2YieldTokenDataProps = DefaultAppTokenDataProps & PendleV2YieldTokenDefinition;

export abstract class PendleV2YieldTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleYieldToken,
  PendleV2YieldTokenDataProps,
  PendleV2YieldTokenDefinition
> {
  groupLabel = 'Yield Tokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) protected readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.pendleYieldToken({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2YieldTokenDefinition[]> {
    const marketsResponse = await gqlFetch<MarketsQueryResponse>({
      endpoint: PENDLE_V2_GRAPHQL_ENDPOINT,
      query: BACKEND_QUERIES.getMarkets,
      variables: { chainId: NETWORK_IDS[this.network] },
    });

    const definitions = await Promise.all(
      marketsResponse.markets.results.map(async market => {
        return {
          address: market.yt.address,
          icon: market.yt.proIcon,
          name: market.yt.proName,
          price: market.yt.price.usd,
          expiry: market.expiry,
          ytFloatingApy: market.ytFloatingApy,
        };
      }),
    );

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(definition => definition.address);
  }

  async getUnderlyingTokenDefinitions() {
    return [];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice({
    definition,
  }: GetPriceParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<number> {
    return definition.price;
  }

  async getApy({
    definition,
  }: GetDataPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<number> {
    return definition.ytFloatingApy * 100;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<
    PendleYieldToken,
    PendleV2YieldTokenDataProps,
    PendleV2YieldTokenDefinition
  >): Promise<string> {
    return definition.name;
  }

  async getSecondaryLabel({
    definition,
  }: GetDisplayPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<
    string | number | DollarDisplayItem | PercentageDisplayItem | undefined
  > {
    return moment(definition.expiry).format('MMM DD, YYYY');
  }

  async getImages({
    definition,
  }: GetDisplayPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<
    string[]
  > {
    return [definition.icon];
  }

  async getDataProps(
    params: GetDataPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>,
  ): Promise<PendleV2YieldTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);
    const { definition } = params;
    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
