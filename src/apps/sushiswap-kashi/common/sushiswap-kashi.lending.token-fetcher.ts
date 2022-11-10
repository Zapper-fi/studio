import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildPercentageDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { StatsItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { SushiswapKashiContractFactory, SushiswapKashiLendingToken } from '../contracts';

type SushiswapKashiLendingTokenDefinition = {
  address: string;
  assetAddress: string;
  collateralAddress: string;
  supplyAPR: string;
  borrowAPR: string;
};

type SushiswapKashiLendingTokenDataProps = {
  liquidity: number;
  reserves: number[];
  apy: number;
  supplyApr: number;
  borrowApr: number;
};

type KashiSubgraphPairsResponse = {
  kashiPairs?: {
    id: string;
    supplyAPR: string;
    borrowAPR: string;
    asset: {
      id: string;
    };
    collateral: {
      id: string;
    };
  }[];
};

const kashiSubgraphPairsQuery = gql`
  query getPairs($first: Int) {
    kashiPairs(first: $first) {
      id
      supplyAPR
      borrowAPR
      asset {
        id
      }
      collateral {
        id
      }
    }
  }
`;

export abstract class SushiswapKashiLendingTokenFetcher extends AppTokenTemplatePositionFetcher<
  SushiswapKashiLendingToken,
  SushiswapKashiLendingTokenDataProps,
  SushiswapKashiLendingTokenDefinition
> {
  subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SushiswapKashiContractFactory) protected readonly contractFactory: SushiswapKashiContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SushiswapKashiLendingToken {
    return this.contractFactory.sushiswapKashiLendingToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<SushiswapKashiLendingTokenDefinition[]> {
    const pairsData = await this.appToolkit.helpers.theGraphHelper.request<KashiSubgraphPairsResponse>({
      endpoint: this.subgraphUrl,
      query: kashiSubgraphPairsQuery,
      variables: { first: 500 },
    });

    return (pairsData.kashiPairs ?? []).map(pair => ({
      address: pair.id.toLowerCase(),
      collateralAddress: pair.collateral.id.toLowerCase(),
      assetAddress: pair.asset.id.toLowerCase(),
      supplyAPR: pair.supplyAPR,
      borrowAPR: pair.borrowAPR,
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<SushiswapKashiLendingToken, SushiswapKashiLendingTokenDefinition>) {
    return [definition.assetAddress, definition.collateralAddress];
  }

  async getPricePerShare() {
    return [1, 0];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<SushiswapKashiLendingToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<SushiswapKashiLendingToken>) {
    return (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
  }

  async getApy(_params: GetDataPropsParams<SushiswapKashiLendingToken>) {
    return 0;
  }

  async getDataProps(
    params: GetDataPropsParams<
      SushiswapKashiLendingToken,
      SushiswapKashiLendingTokenDataProps,
      SushiswapKashiLendingTokenDefinition
    >,
  ) {
    const { definition } = params;
    const defaultDataProps = await super.getDataProps(params);

    return {
      ...defaultDataProps,
      supplyApr: (Number(definition.supplyAPR) / 1e17) * 100,
      borrowApr: (Number(definition.borrowAPR) / 1e17) * 100,
    };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<SushiswapKashiLendingToken>) {
    const pairLabel = `${getLabelFromToken(appToken.tokens[0])} / ${getLabelFromToken(appToken.tokens[1])}`;
    return `${getLabelFromToken(appToken.tokens[0])} in Kashi ${pairLabel}`;
  }

  async getStatsItems(
    params: GetDisplayPropsParams<
      SushiswapKashiLendingToken,
      SushiswapKashiLendingTokenDataProps,
      SushiswapKashiLendingTokenDefinition
    >,
  ): Promise<StatsItem[] | undefined> {
    const { appToken } = params;
    const defaultStatsItems = await super.getStatsItems(params);

    return [
      ...(defaultStatsItems ?? []),
      { label: 'Borrow APR', value: buildPercentageDisplayItem(appToken.dataProps.borrowApr) },
      { label: 'Supply APR', value: buildPercentageDisplayItem(appToken.dataProps.supplyApr) },
    ];
  }
}
