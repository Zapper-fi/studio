import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { DystopiaContractFactory, DystopiaPair } from '../contracts';

export const DYSTOPIA_QUERY = gql`
  query fetchDystopiaPairs {
    pairs(first: 1000) {
      id
      gauge {
        id
      }
    }
  }
`;

export interface DystopiaQueryResponse {
  pairs: {
    id: string;
    gauge: {
      id: string;
    };
  }[];
}

@PositionTemplate()
export class PolygonDystopiaPairsTokenFetcher extends AppTokenTemplatePositionFetcher<DystopiaPair> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DystopiaContractFactory) private readonly contractFactory: DystopiaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DystopiaPair {
    return this.contractFactory.dystopiaPair({ address, network: this.network });
  }

  async getAddresses() {
    const data = await gqlFetch<DystopiaQueryResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/dystopia-exchange/dystopia',
      query: DYSTOPIA_QUERY,
    });
    return data.pairs.map(v => v.id);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<DystopiaPair>) {
    return [
      { address: await contract.token0(), network: this.network },
      { address: await contract.token1(), network: this.network },
    ];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<DystopiaPair, DefaultDataProps>) {
    const [token0, token1] = appToken.tokens;
    const [reserve0, reserve1] = await Promise.all([contract.reserve0(), contract.reserve1()]);
    const reserves = [Number(reserve0) / 10 ** token0.decimals, Number(reserve1) / 10 ** token1.decimals];
    const pricePerShare = reserves.map(r => r / appToken.supply);
    return pricePerShare;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<DystopiaPair>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<DystopiaPair>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<DystopiaPair>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservesDisplay = reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ');

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Reserves', value: reservesDisplay },
    ];
  }
}
