import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
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

import { PendleV2ContractFactory, StandardizedYield } from '../contracts';
import { BACKEND_QUERIES, PENDLE_V2_GRAPHQL_ENDPOINT } from '../pendle-v2.constant';
import { MarketsQueryResponse } from '../pendle-v2.types';

export type PendleV2StandardizedYieldTokenDefinition = {
  address: string;
  icon: string;
  name: string;
  price: number;
  underlyingApy: number;
};

export type PendleV2StandardizedYieldTokenDataProps = DefaultAppTokenDataProps &
  PendleV2StandardizedYieldTokenDefinition;

export abstract class PendleV2StandardizedYieldTokenFetcher extends AppTokenTemplatePositionFetcher<
  StandardizedYield,
  PendleV2StandardizedYieldTokenDataProps,
  PendleV2StandardizedYieldTokenDefinition
> {
  groupLabel = 'Standardized Yield Tokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) protected readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.standardizedYield({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2StandardizedYieldTokenDefinition[]> {
    const marketsResponse = await gqlFetch<MarketsQueryResponse>({
      endpoint: PENDLE_V2_GRAPHQL_ENDPOINT,
      query: BACKEND_QUERIES.getMarkets,
      variables: { chainId: NETWORK_IDS[this.network] },
    });

    const definitions = await Promise.all(
      marketsResponse.markets.results.map(async market => {
        return {
          address: market.sy.address,
          icon: market.sy.proIcon,
          name: market.sy.proName,
          price: market.sy.price.usd,
          underlyingApy: market.underlyingApy,
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
  }: GetPriceParams<
    StandardizedYield,
    PendleV2StandardizedYieldTokenDataProps,
    PendleV2StandardizedYieldTokenDefinition
  >): Promise<number> {
    return definition.price;
  }

  async getApy({
    definition,
  }: GetDataPropsParams<
    StandardizedYield,
    PendleV2StandardizedYieldTokenDataProps,
    PendleV2StandardizedYieldTokenDefinition
  >): Promise<number> {
    return definition.underlyingApy * 100;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<
    StandardizedYield,
    PendleV2StandardizedYieldTokenDataProps,
    PendleV2StandardizedYieldTokenDefinition
  >): Promise<string> {
    return definition.name;
  }

  async getImages({
    definition,
  }: GetDisplayPropsParams<
    StandardizedYield,
    PendleV2StandardizedYieldTokenDataProps,
    PendleV2StandardizedYieldTokenDefinition
  >): Promise<string[]> {
    return [definition.icon];
  }

  async getDataProps(
    params: GetDataPropsParams<
      StandardizedYield,
      PendleV2StandardizedYieldTokenDataProps,
      PendleV2StandardizedYieldTokenDefinition
    >,
  ): Promise<PendleV2StandardizedYieldTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);
    const { definition } = params;

    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
