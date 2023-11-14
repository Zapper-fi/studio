import { Inject } from '@nestjs/common';
import { uniqBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPriceParams,
} from '~position/template/app-token.template.types';

import { PendleV2ViemContractFactory } from '../contracts';
import { StandardizedYield } from '../contracts/viem';

import { PendleV2MarketDefinitionsResolver } from './pendle-v2.market-definition-resolver';

export type PendleV2StandardizedYieldTokenDefinition = {
  address: string;
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
    @Inject(PendleV2ViemContractFactory) protected readonly pendleV2ContractFactory: PendleV2ViemContractFactory,
    @Inject(PendleV2MarketDefinitionsResolver) protected readonly pendleV2Resolver: PendleV2MarketDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.standardizedYield({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2StandardizedYieldTokenDefinition[]> {
    const marketsResponse = await this.pendleV2Resolver.getMarketDefinitions(this.network);

    const definitions = await Promise.all(
      marketsResponse.map(async market => {
        return {
          address: market.sy.address,
          name: market.sy.proName,
          price: market.sy.price.usd,
          underlyingApy: market.underlyingApy,
        };
      }),
    );

    return uniqBy(definitions, 'address');
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
