import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DollarDisplayItem, PercentageDisplayItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { DefaultAppTokenDataProps, GetAddressesParams, GetDataPropsParams, GetDefinitionsParams, GetDisplayPropsParams, GetPriceParams } from '~position/template/app-token.template.types';

import { PendleV2ContractFactory, PendleYieldToken } from '../contracts';
import { PendleV2MarketDataProps } from './pendle-v2.pool.token-fetcher';

export type PendleV2YieldTokenDefinition = {
  address: string;
  icon: string;
  name: string;
  price: number;
  expiry: string;
  ytFloatingApy: number;
};

export type PendleV2YieldTokenDataProps = DefaultAppTokenDataProps & PendleV2YieldTokenDefinition;

@PositionTemplate()
export class EthereumPendleV2YieldTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleYieldToken,
  PendleV2YieldTokenDataProps,
  PendleV2YieldTokenDefinition
>{
  groupLabel = 'Yield Tokens';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) protected readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<PendleV2YieldTokenDefinition[]> {
    const markets = await this.appToolkit.getAppTokenPositions<PendleV2MarketDataProps>({
      appId: 'pendle-v2',
      groupIds: ['pool'],
      network: this.network,
    });
    const definitions = markets.map((market) => {
      return {
        address: market.dataProps.yt.address,
        icon: market.dataProps.yt.icon,
        name: market.dataProps.yt.name,
        price: market.dataProps.yt.price,
        expiry: market.dataProps.expiry,
        ytFloatingApy: market.dataProps.ytFloatingApy,
      };
    });

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map((definition) => definition.address);
  }

  getContract(address: string) {
    return this.pendleV2ContractFactory.pendleYieldToken({ address, network: this.network });
  }

  async getPrice({ definition }: GetPriceParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<number> {
    return definition.price;
  }

  async getApy({ definition }: GetDataPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<number> {
    return definition.ytFloatingApy * 100;
  }

  async getLabel({ definition }: GetDisplayPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<string> {
    return definition.name;
  }

  async getSecondaryLabel({ definition }: GetDisplayPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<string | number | DollarDisplayItem | PercentageDisplayItem | undefined> {
    return moment(definition.expiry).format('MMM DD, YYYY');
  }

  async getImages({ definition }: GetDisplayPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<string[]> {
    return [definition.icon];
  }

  async getDataProps(params: GetDataPropsParams<PendleYieldToken, PendleV2YieldTokenDataProps, PendleV2YieldTokenDefinition>): Promise<PendleV2YieldTokenDataProps> {
    const defaultDataProps = super.getDataProps(params);
    const { definition } = params;
    return {
      ...defaultDataProps,
      ...definition,
    };
  }
}
