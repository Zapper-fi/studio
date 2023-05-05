import { Inject } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { SynthetixContractFactory, SynthetixPerp } from '../contracts';

export type Market = {
  id: string;
  marketKey: string;
  asset: string;
};

export type FuturesMarkets = {
  futuresMarkets: Market[];
};

export const FUTURES_MARKETS_QUERY = gql`
  query MyQuery {
    futuresMarkets {
      id
      marketKey
      asset
    }
  }
`;

export type SynthetixPerpPositionDefinition = {
  address: string;
  asset: string;
};

export abstract class OptimismSynthetixPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SynthetixPerp,
  DefaultDataProps,
  SynthetixPerpPositionDefinition
> {
  useCustomMarketLogos = false;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixPerp {
    return this.contractFactory.synthetixPerp({ address, network: this.network });
  }

  abstract marketFilter(marketKey: string): boolean;

  protected isV2Market(marketKey: string): boolean {
    const marketKeyString = parseBytes32String(marketKey);
    //v2 marketKey includes 'PERP', v1 doesn't
    return marketKeyString.includes('PERP');
  }

  async getDefinitions(): Promise<SynthetixPerpPositionDefinition[]> {
    const { futuresMarkets } = await gqlFetch<FuturesMarkets>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-perps',
      query: FUTURES_MARKETS_QUERY,
    });

    const markets = futuresMarkets.filter(market => this.marketFilter(market.marketKey));

    const definitions = markets.map(market => {
      const baseAssetRaw = parseBytes32String(market.asset);
      const baseAsset = baseAssetRaw.charAt(0) === 's' ? baseAssetRaw.substring(1) : baseAssetRaw;
      return { address: market.id.toLowerCase(), asset: baseAsset };
    });

    return definitions;
  }

  async getTokenDefinitions() {
    return [
      {
        address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<SynthetixPerp, DefaultDataProps, SynthetixPerpPositionDefinition>): Promise<string> {
    return `${definition.asset}-PERP`;
  }

  async getImages({
    definition,
  }: GetDisplayPropsParams<SynthetixPerp, DefaultDataProps, SynthetixPerpPositionDefinition>) {
    return [getAppAssetImage(this.useCustomMarketLogos ? this.appId : 'synthetix', `s${definition.asset}`)];
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<SynthetixPerp>) {
    const remainingMargin = await contract.remainingMargin(address);
    return [remainingMargin.marginRemaining];
  }
}
