import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { sum } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const appId = EULER_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

interface EulerMarket {
  symbol: string;
  totalBalancesUsd: string;
  totalBorrowsUsd: string;
  decimals: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

const query = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets {
        totalBalancesUsd
        totalBorrowsUsd
        decimals
      }
    }
  }
`;

@Register.TvlFetcher({ appId, network })
export class EthereumEulerTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet';
    const data = await this.appToolkit.helpers.theGraphHelper.request<EulerMarketsResponse>({ endpoint, query });
    const markets = data.eulerMarketStore.markets;

    const tvlPerMarket = markets.map(market => {
      const totalBalance = Number(market.totalBalancesUsd) / 10 ** Number(market.decimals);
      const totalBorrows = Number(market.totalBorrowsUsd) / 10 ** Number(market.decimals);

      return totalBalance - totalBorrows;
    });

    return sum(tvlPerMarket);
  }
}
