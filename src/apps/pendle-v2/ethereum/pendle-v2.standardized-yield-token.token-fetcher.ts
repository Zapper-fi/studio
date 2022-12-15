import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPriceParams,
} from '~position/template/app-token.template.types';

import { PendleV2ContractFactory, StandardizedYield } from '../contracts';
import { PendleV2MarketDataProps } from './pendle-v2.pool.token-fetcher';

export type PendleV2StandardizedYieldTokenDefinition = {
  address: string;
  icon: string;
  name: string;
  price: number;
  underlyingApy: number;
};

export type PendleV2StandardizedYieldTokenDataProps = DefaultAppTokenDataProps &
  PendleV2StandardizedYieldTokenDefinition;

@PositionTemplate()
export class EthereumPendleV2StandardizedYieldTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
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

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2StandardizedYieldTokenDefinition[]> {
    const markets = await this.appToolkit.getAppTokenPositions<PendleV2MarketDataProps>({
      appId: 'pendle-v2',
      groupIds: ['pool'],
      network: this.network,
    });
    const definitions = markets.map(market => {
      return {
        address: market.dataProps.sy.address,
        icon: market.dataProps.sy.icon,
        name: market.dataProps.sy.name,
        price: market.dataProps.sy.price,
        underlyingApy: market.dataProps.underlyingApy,
      };
    });

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(definition => definition.address);
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.standardizedYield({ address, network: this.network });
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
    const defaultDataProps = super.getDataProps(params);
    const { definition } = params;
    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
