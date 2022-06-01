import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const appId = EULER_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

interface EulerMarket {
  totalBalancesEth: string;
  totalBorrowsEth: string;
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
        totalBalancesEth
        totalBorrowsEth
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
    return data.eulerMarketStore.markets.reduce(
      (acc, cur) => acc + (Number(cur.totalBalancesEth) - Number(cur.totalBorrowsEth)),
      0,
    );
  }
}
