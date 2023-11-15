import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
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

import { PendleV2ViemContractFactory } from '../contracts';
import { PendlePrincipalToken } from '../contracts/viem';

import { PendleV2MarketDefinitionsResolver } from './pendle-v2.market-definition-resolver';

export type PendleV2PrincipalTokenDefinition = {
  address: string;
  name: string;
  price: number;
  expiry: string;
  impliedApy: number;
  ptDiscount: number;
};

export type PendleV2PrincipalTokenDataProps = DefaultAppTokenDataProps & PendleV2PrincipalTokenDefinition;

export abstract class PendleV2PrincipalTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendlePrincipalToken,
  PendleV2PrincipalTokenDataProps,
  PendleV2PrincipalTokenDefinition
> {
  groupLabel = 'Principal Tokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ViemContractFactory) protected readonly pendleV2ContractFactory: PendleV2ViemContractFactory,
    @Inject(PendleV2MarketDefinitionsResolver) protected readonly pendleV2Resolver: PendleV2MarketDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2PrincipalTokenDefinition[]> {
    const marketsResponse = await this.pendleV2Resolver.getMarketDefinitions(this.network);

    const definitions = await Promise.all(
      marketsResponse.map(async market => {
        return {
          address: market.pt.address,
          name: market.pt.proName,
          price: market.pt.price.usd,
          expiry: market.expiry,
          impliedApy: market.impliedApy,
          ptDiscount: market.ptDiscount,
        };
      }),
    );

    return definitions;
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.pendlePrincipalToken({ address, network: this.network });
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
    PendlePrincipalToken,
    PendleV2PrincipalTokenDataProps,
    PendleV2PrincipalTokenDefinition
  >): Promise<number> {
    return definition.price;
  }

  async getApy({
    definition,
  }: GetDataPropsParams<
    PendlePrincipalToken,
    PendleV2PrincipalTokenDataProps,
    PendleV2PrincipalTokenDefinition
  >): Promise<number> {
    return definition.impliedApy * 100;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<
    PendlePrincipalToken,
    PendleV2PrincipalTokenDataProps,
    PendleV2PrincipalTokenDefinition
  >): Promise<string> {
    return definition.name;
  }

  async getSecondaryLabel({
    definition,
  }: GetDisplayPropsParams<
    PendlePrincipalToken,
    PendleV2PrincipalTokenDataProps,
    PendleV2PrincipalTokenDefinition
  >): Promise<string | number | DollarDisplayItem | PercentageDisplayItem | undefined> {
    return 'Expire at ' + moment(definition.expiry).format('MMM DD, YYYY');
  }

  async getTertiaryLabel({
    definition,
  }: GetDisplayPropsParams<
    PendlePrincipalToken,
    PendleV2PrincipalTokenDataProps,
    PendleV2PrincipalTokenDefinition
  >): Promise<string | number | DollarDisplayItem | PercentageDisplayItem | undefined> {
    return 'Discount ' + (definition.ptDiscount * 100).toFixed(3) + '%';
  }

  async getDataProps(
    params: GetDataPropsParams<PendlePrincipalToken, PendleV2PrincipalTokenDataProps, PendleV2PrincipalTokenDefinition>,
  ): Promise<PendleV2PrincipalTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);
    const { definition } = params;
    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
