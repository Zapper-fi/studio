import { Inject } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { DefaultDataProps } from '~position/display.interface';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SynthetixContractFactory, SynthetixPerp } from '../contracts';

export type GetContracts = {
  futuresMarkets: {
    id: string;
    marketKey: string;
  }[];
};

export const getContractsQuery = gql`
  query MyQuery {
    futuresMarkets {
      id
      marketKey
    }
  }
`;

export type PerpPositionDefinition = {
  address: string;
  side: string;
};

export abstract class OptimismSynthetixPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SynthetixPerp> {
  extraLabel = '';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixPerp {
    return this.contractFactory.synthetixPerp({ address, network: this.network });
  }

  abstract marketFilter(market): boolean;

  protected isV2Market(market): boolean {
    const marketKeyString = parseBytes32String(market.marketKey);
    //v2 marketKey includes 'PERP', v1 doesn't
    return marketKeyString.includes('PERP');
  }

  async getDefinitions(): Promise<PerpPositionDefinition[]> {
    const contractsFromSubgraph = await gqlFetch<GetContracts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-perps',
      query: getContractsQuery,
    });

    const markets = contractsFromSubgraph.futuresMarkets
      .filter(market => this.marketFilter(market));

    const longMarkets = this.getMarketsDefinitions(markets, 'LONG');
    const shortMarkets = this.getMarketsDefinitions(markets, 'SHORT');
    const neutralMarkets = this.getMarketsDefinitions(markets, 'NEUTRAL');

    return longMarkets.concat(shortMarkets, neutralMarkets);
  }

  getMarketsDefinitions(markets, side: string) {
    return markets.map(futuresMarket => ({ address: futuresMarket.id, side: side }));
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

  private async getBaseAsset({ contractPosition }) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contract = multicall.wrap(this.getContract(contractPosition.address));
    const baseAssetRaw = await contract.baseAsset();
    let baseAsset = parseBytes32String(baseAssetRaw);
    //some market use legacy naming starting with an "s"
    if (baseAsset.charAt(0) === 's') {
      baseAsset = baseAsset.substring(1);
    }
    return baseAsset;
  }

  async getLabel({ contractPosition, definition }: GetDisplayPropsParams<SynthetixPerp, DefaultDataProps, PerpPositionDefinition>): Promise<string> {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    return `${baseAsset}-PERP ${definition.side}${this.extraLabel}`;
  }

  async getDataProps({ definition }) {
    return { side: definition.side };
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<SynthetixPerp>) {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    return [getAppAssetImage('synthetix', `s${baseAsset}`)];
  }

  async getTokenBalancesPerPosition({ address, contract, contractPosition }: GetTokenBalancesParams<SynthetixPerp>) {
    const remainingMargin = await contract.remainingMargin(address);
    const marginRemaining = remainingMargin.marginRemaining;
    if (Number(marginRemaining) === 0) {
      return [];
    }
    const position = await contract.positions(address);
    const side = contractPosition.dataProps.side;
    const size = Number(position.size);
    const matchesSide = (size > 0 && side === 'LONG') || (size < 0 && side === 'SHORT') || (size === 0 && side === 'NEUTRAL');
    return matchesSide ? [marginRemaining] : [];
  }
}
