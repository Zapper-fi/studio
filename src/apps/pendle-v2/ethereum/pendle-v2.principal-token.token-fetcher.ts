import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
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

import { PendlePrincipalToken, PendleV2ContractFactory } from '../contracts';
import { PENDLE_V_2_DEFINITION } from '../pendle-v2.definition';

import { PendleV2MarketDataProps } from './pendle-v2.pool.token-fetcher';

export type PendleV2PrincipalTokenDefinition = {
  address: string;
  icon: string;
  name: string;
  price: number;
  expiry: string;
  impliedApy: number;
  ptDiscount: number;
};

export type PendleV2PrincipalTokenDataProps = DefaultAppTokenDataProps & PendleV2PrincipalTokenDefinition;

@PositionTemplate()
export class EthereumPendleV2PrincipalTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendlePrincipalToken,
  PendleV2PrincipalTokenDataProps,
  PendleV2PrincipalTokenDefinition
> {
  groupLabel = 'Principal Tokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) protected readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2PrincipalTokenDefinition[]> {
    const markets = await this.appToolkit.getAppTokenPositions<PendleV2MarketDataProps>({
      appId: 'pendle-v2',
      groupIds: [PENDLE_V_2_DEFINITION.groups.pool.id],
      network: this.network,
    });
    const definitions = markets.map(market => {
      return {
        address: market.dataProps.pt.address,
        icon: market.dataProps.pt.icon,
        name: market.dataProps.pt.name,
        price: market.dataProps.pt.price,
        expiry: market.dataProps.expiry,
        impliedApy: market.dataProps.impliedApy,
        ptDiscount: market.dataProps.ptDiscount,
      };
    });

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

  async getImages({
    definition,
  }: GetDisplayPropsParams<
    PendlePrincipalToken,
    PendleV2PrincipalTokenDataProps,
    PendleV2PrincipalTokenDefinition
  >): Promise<string[]> {
    return [definition.icon];
  }

  async getDataProps(
    params: GetDataPropsParams<PendlePrincipalToken, PendleV2PrincipalTokenDataProps, PendleV2PrincipalTokenDefinition>,
  ): Promise<PendleV2PrincipalTokenDataProps> {
    const defaultDataProps = super.getDataProps(params);
    const { definition } = params;
    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
